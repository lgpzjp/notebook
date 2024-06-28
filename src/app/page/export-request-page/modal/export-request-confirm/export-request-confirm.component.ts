import { Component } from '@angular/core';
import { AbstractBlModal, ModalButtonType, ModalButtonSetting, ModalButton, ModalOption, ModalSize } from '@blcloud/bl-ng-ui-component';

/**
 * データ出力リクエスト確認ダイアログコンポーネント
 */
@Component({
  templateUrl: 'export-request-confirm.component.html',
  styleUrls: ['./export-request-confirm.component.scss'],
})
export class ExportRequestConfirmComponent extends AbstractBlModal {
  /** タイトル */
  _title = '出力データの取扱注意事項';

  /** フッターボタンタイプ */
  _footerButtonType: ModalButtonType = ModalButtonType.OkCancel;

  /** OKボタン設定 */
  _okButtonSetting: ModalButtonSetting = { label: '同意します' };

  /** キャンセルボタン設定 */
  _cancelButtonSetting: ModalButtonSetting = { label: '同意しません' };

  /**
   * コンストラクタ
   */
  constructor() {
    super();
  }

  /** @override */
  onShown(): void {
    this.focusFooterButton(ModalButton.Cancel);
  }

  /** @override */
  getResults() {
    return null;
  }

  /** @override */
  defaultOption(_data?: any): ModalOption {
    return { size: ModalSize.Large };
  }

}
