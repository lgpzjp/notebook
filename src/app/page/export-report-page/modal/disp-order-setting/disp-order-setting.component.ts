import { Component, ViewChild } from '@angular/core';
import { AbstractBlModal, BlSortableComponent, BlSortableOption } from '@blcloud/bl-ng-ui-component';
import { defer as _defer, get as _get, isNil as _isNil, map as _map, set as _set, size as _size } from 'lodash';

import { IDispOrderSetting } from './disp-order-setting.interface';

/**
 * 表示順位設定モーダル
 */
@Component({
  templateUrl: 'disp-order-setting.component.html',
  styleUrls: ['disp-order-setting.component.scss'],
})
export class DispOrderSettingComponent extends AbstractBlModal {
  /** ラベル表示用のプロパティ名 */
  private readonly LABEL_PROPERTY_NAME = 'DISP_ORDER_SETTNG_LABEL';

  /** 操作対象データの配列 */
  items = [];

  /** ソータブルコンポーネントオプション */
  option: BlSortableOption = {
    fieldName: this.LABEL_PROPERTY_NAME,
    placeholderClass: 'sortable-placeholder',
    itemClass: '',
    wrapperClass: '',
  };

  /** OKボタンを非活性にするか */
  get disabledOkButton() {
    return _size(this.items) < 2;
  }

  /** 注釈を表示する必要があるか */
  get shouldShowAnnotation() {
    return _size(this.items) > 0;
  }

  /** ソータブルコンポーネント */
  @ViewChild('blSortable') private blSortable: BlSortableComponent;

  /**
   * モーダルウィンドウ表示後イベントハンドラ
   */
  onShown() {
    const { field, items } = <IDispOrderSetting>this.data.dispOrderSetting;

    // ラベル表示用のプロパティを追加して表示データをセット
    this.items = _map(items, (item) => _set(item, this.LABEL_PROPERTY_NAME, _get(item, field)));

    // リストの先頭にフォーカスを当てる
    _defer(() => {
      if (!_isNil(this.blSortable)) {
        this.blSortable.focus();
      }
    });
  }

  /**
   * モーダルウィンドウ処理結果取得
   */
  getResults() {
    return _map(this.items, (item) => {
      delete item[this.LABEL_PROPERTY_NAME];
      return item;
    });
  }
}
