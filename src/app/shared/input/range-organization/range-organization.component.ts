import { Component, Output, OnInit, EventEmitter } from '@angular/core';

import { AbstractContainer, BeginSearchParam, BlModalService, ModalReason } from '@blcloud/bl-ng-ui-component';
import { OrganizationGuideComponent } from '@blcloud/bl-ng-share-module';
import { StringUtils } from '@blcloud/bl-common';
import { CompanyConst } from '@blcloud/bl-datamodel/const/company';

import { RangeOrganizationService } from './range-organization.service';
import { selectTypeArray, SelectTypeEnum, IselectObject } from './range-organization.define';

import {
  isNil as _isNil,
  indexOf as _indexOf,
} from 'lodash';

/**
 * 組織 個別/範囲指定切り替えコンポーネント
 */
@Component({
  selector: 'app-range-organization',
  templateUrl: 'range-organization.component.html',
  styleUrls: ['range-organization.component.scss']
})
export class RangeOrganizationComponent extends AbstractContainer implements OnInit {
  /* ガイド非活性イベント */
  @Output() guideDisabledEvent: EventEmitter<object> = new EventEmitter();
  /* 選択情報 (親画面通知用) */
  @Output() selectInfo: EventEmitter<object> = new EventEmitter();

  selectObject: IselectObject = {
    selectType: SelectTypeEnum.RANGE,
    focus: null,
    organizationCodeFrom: null,
    organizationCodeTo: null,
    organizationList: [null, null, null, null, null, null, null, null, null, null],
    allOrganizationCode: [CompanyConst.ORGANIZATION_CODE_ALL_COMPANY]
  };

  /** selectboxリスト */
  readonly selectTypeArray = selectTypeArray;

  /** selectboxの値 */
  readonly SelectTypeEnum = SelectTypeEnum;

  /**組織ガイドにてフォーカスアウト用のリソース */
  organizationResource: {};

  /**
   * コンストラクタ
   * @param service 組織管理 倉庫 個別/範囲指定切り替えサービス
   * @param modalService モーダル管理サービス
   */
  constructor(
    private service: RangeOrganizationService,
    private modalService: BlModalService,
  ) {
    super();
  }

  /**
   * 初期化処理
   */
  ngOnInit(): void {
    this.selectInfo.emit(this.selectObject);
    this.organizationResource = this.service.getOrganizationInnerResource();
  }

  /**
   * 組織個別指定 結果を受け取り、後続の処理を行います。
   * @param event 検索結果
   * @param id 修正するコードのindex
   */
  onAfterSearchOrgCodeEvent(event, id: any) {
    if (!_isNil(event)) {
      this.deleteDuplicateValue(event.organizationCode);
      this.selectObject.organizationList[id] = event.organizationCode;
    } else {
      this.selectObject.organizationList[id] = null;
    }
  }

  /**
   * 一覧情報（ngFor）のトラッキング設定
   * リストが更新されるたびに、フォーカスロストしないように、キー設定をする
   */
  trackByIndex(index) {
    return index;
  }

  /**
   * 組織 変更イベント
   * @param event イベント情報
   */
  onSelectChangeEvent(event: number): void {
    this.selectObject.selectType = event;
    if (this.selectObject.selectType === SelectTypeEnum.RANGE) {
      // 範囲指定
      this.selectObject.organizationCodeFrom = null;
      this.selectObject.organizationCodeTo = null;
    } else if (this.selectObject.selectType === SelectTypeEnum.INDIVIDUAL) {
      // 個別指定
      this.selectObject.organizationList = [null, null, null, null, null, null, null, null, null, null];
    }
  }

  /**
   * 組織コードの検索前イベント
   * @param param 検索条件
   */
  onBeginSearchOrgCodeEvent(param: BeginSearchParam) {
    param.value = StringUtils.paddingLeft(param.value, 6);
  }

  /**
   * 画面のテキストをクリアします。
   */
  public doClear(): void {
    this.selectObject = {
      selectType: SelectTypeEnum.RANGE,
      focus: null,
      organizationCodeFrom: null,
      organizationCodeTo: null,
      organizationList: [null, null, null, null, null, null, null, null, null, null],
      allOrganizationCode: [CompanyConst.ORGANIZATION_CODE_ALL_COMPANY]
    };
  }

  /**
   * フォーカス処理
   * @param _event
   * @param _focus
   */
  onFocus(_event, _focus): void {
    this.selectObject.focus = _focus;
    const obj = {
      focus: true,
      focusElement: _focus
    };
    // フォーカスのある項目にガイドが存在する場合、該当するガイドを表示する。
    this.guideDisabledEvent.emit(obj);
  }

  /**
   * フォーカス処理
   */
  onBlur(): void {
    // フォーカスのある項目にガイドが存在する場合、該当するガイドを表示する。
    const obj = {
      focus: false
    };
    this.guideDisabledEvent.emit(obj);
  }


  /**
   * 組織ガイドボタンクリックイベント
   * @param element
   * @param event
   */
  onClickOrganizationGuide(element, event?) {
    const data = {
      initValue: event,
    };
    this.modalService.show(OrganizationGuideComponent, { data }).subscribe(
      (modal) => {
        if (modal.reason === ModalReason.Done) {
          const entity = modal.getResults();
          if (element.id === 'organizationFrom') {
            this.selectObject.organizationCodeFrom = entity.organizationCode;
          } else if (element.id === 'organizationTo') {
            this.selectObject.organizationCodeTo = entity.organizationCode;
          } else {
            let index = _indexOf(this.selectObject.organizationList, null);
            index = index === -1 ? 9 : index;
            this.deleteDuplicateValue(entity.organizationCode);
            this.selectObject.organizationList[index] = entity.organizationCode;
          }
        }
        modal.hide(element);
      }
    );
  }

  /**
   * 組織ガイドボタンクリックイベント 個別指定
   * @param element
   */
  onClickOrganizationListGuide(element) {
    this.modalService.show(OrganizationGuideComponent).subscribe(
      (modal) => {
        if (modal.reason === ModalReason.Done) {
          const entity = modal.getResults();
          let index = _indexOf(this.selectObject.organizationList, null);
          index = index === -1 ? 9 : index;
          this.deleteDuplicateValue(entity.organizationCode);
          this.selectObject.organizationList[index] = entity.organizationCode;
        }
        modal.hide(element);
      }
    );
  }

  /**
   * リスト値の重複値を削除
   * @param inputValue 入力値
   */
  private deleteDuplicateValue(inputValue: string) {
    for (let i = 0; i < this.selectObject.organizationList.length; i++) {
      if (inputValue === this.selectObject.organizationList[i]) {
        this.selectObject.organizationList[i] = null;
      }
    }
  }

  /**
   * 組織コードの変更のイベント
   * @param employeeCode 組織コード
   * @param index 索引
   */
  onChangeOrganizationCodeEvent(organizationCode: string, index: number) {
    if (!organizationCode) {
      return;
    }
    // 組織コードフォーマット
    organizationCode = StringUtils.paddingLeft(organizationCode, 6);
    this.service.getOrganizationInfo(organizationCode).subscribe(
      response => {
        if (index === 1) {
          this.selectObject.organizationCodeFrom = !_isNil(response)
            ? response.organizationCode
            : this.selectObject.organizationCodeFrom === null
            ? ''
            : null;
        } else if (index === 2) {
          this.selectObject.organizationCodeTo = !_isNil(response)
            ? response.organizationCode
            : this.selectObject.organizationCodeTo === null
            ? ''
            : null;
        }
      }
    );
  }
}
