export interface CountryJSON {
  id?: string
  code: string
  nameEn: string
  nameAr: string
  dialCode: string
  flagUrl?: string
}

export default class CountryModel {
  readonly code: string
  readonly nameEn: string
  readonly nameAr: string
  readonly dialCode: string
  readonly flagUrl?: string

  constructor({ code, nameEn, nameAr, dialCode, flagUrl }: { code: string; nameEn: string; nameAr: string; dialCode: string; flagUrl?: string }) {
    this.code = code
    this.nameEn = nameEn
    this.nameAr = nameAr
    this.dialCode = dialCode
    this.flagUrl = flagUrl
  }

  static fromJSON(json: CountryJSON): CountryModel {
    return new CountryModel({
      code: json.code,
      nameEn: json.nameEn,
      nameAr: json.nameAr,
      dialCode: json.dialCode,
      flagUrl: json.flagUrl,
    })
  }
}
