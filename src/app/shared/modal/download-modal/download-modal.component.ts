import {
  Component,
  OnInit,
  OnDestroy,
  ViewEncapsulation,
} from '@angular/core';
import {
  AbstractBlDynamicGuide, ModalReason,
  GuideContent
} from '@blcloud/bl-ng-ui-component';
import {
  forEach as _forEach
} from 'lodash';

@Component({
  selector: 'app-download-modal',
  templateUrl: './download-modal.component.html',
  styleUrls: ['./download-modal.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DownloadModalComponent extends AbstractBlDynamicGuide implements OnInit, OnDestroy {
  // guide contentsの定義
  guideContents: GuideContent[] = [
    {
      navText: '下記のテキストファイル作成が完了しました。ファイル選択よりダウンロードが開始されます。',
      tableContent: {
        headers: [
          { key: 'exportInfoDivEnumName', label: 'テキストファイル名', width: '100%' },
        ],
        datas: []
      }
    },
  ];

  /**
   * コンストラクタ.
   * @param el エレメント
   * @param changeDetectorRef ChangeDetectorRef
   */
  constructor(
  ) {
    super();
  }


  ngOnInit() {
  }

  ngOnDestroy() {
  }

  /**
   * 表示後処理
   */
  onShown() {
    _forEach(this.data.listFile, file => {
      this.guideContents[0].tableContent.datas.push({
        urlDownload: file.urlDownload,
        exportInfoDivEnumName: file.exportInfoDivEnumName
      });
    });
  }

  /**
   * ファイルのダウンロードを開始
   * @param listFile
   */
  onSelectRowEvent($event) {
    location.href = $event.data.urlDownload.toString();
  }

  btnKeyDownEvent($event): void {
    switch ($event) {
      case ModalReason.Done:
        break;
      case ModalReason.Any:
        break;
      default:
        break;
    }
  }
}
