module.exports = {

  // q_paramを解析してオブジェクト化します。
  toQuery: function(qParam) {
    const params = decodeURI(qParam).split('&');
    const result = {};

    params.forEach(param => {
      const temp = param.split('=');
      const key = temp[0];
      const value = temp[1];

      switch(key) {
        case 'f':
        case 'xf':
        case 'o':
          result[key] = value.split(',');
          break;
        case 'c':
          result[key] = JSON.parse(value);
          const groups = Object.keys(result[key])
          for (let i = 0; i < groups.length; i++) {
            result[key][groups[i]] = result[key][groups[i]].map(cond => {
              const p = cond.split(':');
              return {
                sign: p[1],
                pid: p[0],
                value: (p[1] === 'in' ? p[2].split(',') : p[2]),
              };
            });
          }
          break;
        case 'p':
        case 's':
        case 'v':
          result[key] = Number(value);
          break;
        case 'fl':
          result[key] = (value === 'true');
          break;
      }
    });

    return result;
  },

  // オブジェクト化したq_paramからデータをフィルタリングします。
  filter: function(datas, query) {
    if (Array.isArray(datas)&&query['c']) {
      return datas.filter(data => {
        const groups = Object.keys(query['c']);
        for (let i = 0; i < groups.length; i++) {
          const result = query['c'][groups[i]].every(cond => {
            switch (cond.sign) {
              case 'eq':
                return this.findRecursive(data, cond.pid) == cond.value;
              case 'ne':                return this.findRecursive(data, cond.pid) != cond.value;
              case 'lt':
                return this.findRecursive(data, cond.pid) < Number(cond.value);
              case 'le':
                return this.findRecursive(data, cond.pid) <= Number(cond.value);
              case 'gt':
                return this.findRecursive(data, cond.pid) > Number(cond.value);
              case 'ge':
                return this.findRecursive(data, cond.pid) >= Number(cond.value);
              case 'ct':
                return this.findRecursive(data, cond.pid).indexOf(String(cond.value)) > -1;
              case 'px':
                return this.findRecursive(data, cond.pid).indexOf(String(cond.value)) === 0;
              case 'sx':
                return this.findRecursive(data, cond.pid).lastIndexOf(String(cond.value)) + String(cond.value).length === this.findRecursive(data, cond.pid).length;
              case 'in':
                return cond.value.some(value => this.findRecursive(data, cond.pid) === value);
            }
          });
          if (result) {
            return true;
          }
        }
        return false;
      });
    } else {
      return datas;
    }
  },

  // オブジェクトが特定のプロパティを持っているか再帰的に検査します。持っている場合はvalueを返却、持っていない場合は空文字を返却
  findRecursive: function(obj, key) {
    const keys = key.split('.');
    let result = obj;
    for (let i=0; i<keys.length; i++) {
        result = this.find(result, keys[i]);
      if (!result) {
          break;
      }
    }
    if (!result && obj.subjects) {
        if (obj.subjects.sf) {
            result = this.findRecursive(obj.subjects.sf, key);
        }
        if (!result && obj.subjects.pm) {
            result = this.findRecursive(obj.subjects.pm, key);
        }
    }
    if (result === undefined) {
      return '';
    }
    return result;
  },

  find: function(obj, key) {
    if (!Array.isArray(obj)) {
        if (obj.hasOwnProperty(key)) {
          return obj[key];
        } else {
            return undefined;
        }
    } else {
        // 配列の場合は最初の最初の要素を検査
        let result = this.find(obj[0], key);
        return result;
    }
  }
}
