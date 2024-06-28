import { browser } from 'protractor';

export class CommonUtils {
  static sendXhr(url, reqbody) {
    browser.executeAsyncScript(function () {
      const callback = arguments[arguments.length - 1];
      const xhr = new XMLHttpRequest();
      xhr.open('POST', arguments[0]);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
          callback();
        }
      };
      xhr.send(JSON.stringify(arguments[1]));
    }, url, reqbody);
  }
}
