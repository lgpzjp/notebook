import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
// import { finalize } from 'rxjs/operators';
import { of as RxOf } from 'rxjs/observable/of';
import { isEmpty as _isEmpty, find as _find, forEach as _forEach } from 'lodash';

// import { BlUrlQuery } from '@blcloud/bl-ng-common';
import { BlLoadingService } from '@blcloud/bl-ng-ui-component';
import { ScreenService, PageId, PageName } from '@blcloud/bl-ng-share-module';

import { ExportRequestPageService } from './export-request-page.service';
import { IExportGroupItem, IExportMenuItem } from './export-request-page.interface';

/**
 * データ出力リクエストページコンポーネント
 */
@Component({
  templateUrl: './export-request-page.component.html',
  styleUrls: ['./export-request-page.component.scss'],
})
export class ExportRequestPageComponent implements OnInit, OnDestroy {
  /** タイトル */
  _title = '';

  /** メニュー省略フラグ */
  _isOmitMenu = false;

  /** 出力グループ項目リスト */
  _exportGroupItems: IExportGroupItem[] = [];

  /** 出力メニュー項目リスト */
  _exportMenuItems: IExportMenuItem[] = [];

  /** すべての出力メニュー項目リスト */
  private allExportMenuItems: IExportMenuItem[] = [];

  /** 選択中の出力グループID */
  private selectExportGroupId: string;

  /** 選択中の出力メニューID */
  private selectExportMenuId: string;

  /** 購読 */
  private subscription: Subscription = new Subscription();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private screenService: ScreenService,
    private loadingService: BlLoadingService,
    private pageService: ExportRequestPageService
  ) {
  }

  ngOnInit(): void {
    this.screenService.setPageId(PageId.DataExport);
    this.screenService.setTitle(PageName[PageId.DataExport]);
    this._title = PageName[PageId.DataExport];

    // ルーティングイベント監視
    this.monitorRouterEvent();
  }

  ngOnDestroy() {
    if (this.subscription && !this.subscription.closed) {
      this.subscription.unsubscribe();
    }
  }

  /**
   * 出力グループ　クリックイベントハンドラ
   * @param id ID
   */
  onClickExportGroup(id: string) {
    this.selectMenu(id);
  }

  /**
   * 出力メニュー　クリックイベントハンドラ
   * @param id ID
   */
  onClickExportMenu(id: string) {
    this.selectMenu(this.selectExportGroupId, id);
  }

  /**
   * ルーティングイベント監視
   */
  private monitorRouterEvent() {
    this.subscription.add(
      this.route.url.subscribe(
        () => {
          this.loadingService.show();

          // 有効な全サブメニュー項目を取得
          let allExportMenuItems$ = RxOf(this.allExportMenuItems);
          if (_isEmpty(this.allExportMenuItems)) {
            allExportMenuItems$ = this.pageService.getAllExportMenuItems();
          }

          allExportMenuItems$.subscribe(
            items => {
              this.allExportMenuItems = items;
              if (_isEmpty(items)) {
                this._exportGroupItems = [];
                this._exportMenuItems = [];
                return;
              }

              // メインメニュー項目リストを取得
              this._exportGroupItems = this.pageService.getExportGroupItems(items);
              if (_isEmpty(this._exportGroupItems)) {
                this._exportMenuItems = [];
                return;
              }

              let exportGroupId = '';
              let exportMenuId = '';

              const urls = this.router.url.split('/');
              if (urls.length > 2) {
                exportMenuId = urls[2];
              }

              if (exportMenuId) {
                const findMenu = _find(this.allExportMenuItems, item => item.id === exportMenuId);
                if (findMenu) {
                  exportGroupId = findMenu.exportGroupId;
                } else {
                  exportGroupId = this._exportGroupItems[0].id;
                }
              }

              // メニュー選択
              this.selectMenu(exportGroupId, exportMenuId);

              this.loadingService.hide();
            }
          );
        }
      )
    );
  }

  /**
   * メニューを選択します。
   * @param exportGroupId 出力グループID
   * @param exportMenuId 出力メニューID
   */
  private selectMenu(exportGroupId: string, exportMenuId?: string) {
    if (!exportGroupId) {
      // 先頭のグループ項目を選択
      exportGroupId = this._exportGroupItems[0].id;
    }

    // グループ変更時
    if (this.selectExportGroupId !== exportGroupId) {
      this.selectExportGroupId = exportGroupId;

      _forEach(this._exportGroupItems, item => {
        if (item.id === exportGroupId) {
          item.active = true;
          this._exportMenuItems = this.pageService.getExportMenuItems(this.allExportMenuItems, exportGroupId);
        } else {
          item.active = false;
        }
      });
    }

    if (!exportMenuId) {
      // 先頭サブメニュー項目を選択
      exportMenuId = this._exportMenuItems[0].id;
    }

    // サブメニュー変更時
    if (this.selectExportMenuId !== exportMenuId) {
      this.selectExportMenuId = exportMenuId;

      let path = '';
      _forEach(this._exportMenuItems, item => {
        if (item.id === exportMenuId) {
          item.active = true;
          path = item.path;
        } else {
          item.active = false;
        }
      });

      if (path) {
        this.router.navigate([path], { relativeTo: this.route });
      }
    }
  }

}
