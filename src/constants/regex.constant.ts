export const RegexConstant = {
  timeFormatHHmm: /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/,
  isTime: /^([01]\d|2[0-3]):?([0-5]\d)$/,
  phoneWithOutCountryCode: /^[0][0-9]*$/,
  escapeString: /[\\_&%]/g,
  regexDateFormatWithoutTime:
    /^(?:\d{4}(-|\/)\d{2}(-|\/)\d{2}|\d{2}(-|\/)\d{2}(-|\/)\d{4})$/,
  dateForwardSlashFormatWithYearStart: /^\d{4}(\/)\d{2}(\/)\d{2}$/,
  hexColorFormat: /^#(?:[0-9a-fA-F]{3,4}){1,2}$/,
}
