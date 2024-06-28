import { DateTimeUtils, DateTimeOutput, DateTimePadding, DateSeparator, DateEra } from '@blcloud/bl-common';

export const ColumnDefs = [
  {
    headerName: '個人/共有',
    field: 'accountGenericSettingSubID.blUserId',
    valueGetter: (params) => {
      const isCommon = params.data.accountGenericSettingSubID.blUserId === '0';
      return isCommon ? '共有' : '個人';
    }
  },
  {
    headerName: '名称',
    field: 'conditionName',
  },
  {
    headerName: '更新日時',
    field: 'updateDateTime',
    valueFormatter: (params) => {
      if (params.value) {
        return DateTimeUtils.format(
          DateTimeUtils.parseDate(params.value),
          DateTimeOutput.YMD_LT,
          DateTimePadding.ZERO,
          DateSeparator.JP,
          DateEra.AD
        );
      } else {
        return '';
      }
    },
  },
];
