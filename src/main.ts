import dayjs from 'dayjs'
import { PackageJson } from 'type-fest'

import { createCsv } from './csv'

const PROPERTY_GITHUB_TOKEN = 'github-token'
const GITHUB_STORAGE_SERVER_HOST = 'raw.githubusercontent.com'
const DATE_FORMAT = 'YYYY/MM/DD HH:mm'

const SPREADSHEET_TITLE = 'フロントエンドの利用ライブラリ比較'

type Sheet = ReturnType<typeof SpreadsheetApp.getActiveSheet>
type Spreadsheet = ReturnType<typeof SpreadsheetApp.getActiveSpreadsheet>

const getScriptProperties = () => {
  const properties = PropertiesService.getScriptProperties().getProperties()

  const packageJsonUrls = Object.keys(properties)
    .sort()
    .filter(propertyKey => propertyKey !== PROPERTY_GITHUB_TOKEN)
    .map(jsonUrlKey => properties[jsonUrlKey])

  return {
    packageJsonUrls,
    gitHubToken: properties[PROPERTY_GITHUB_TOKEN] ?? '',
  }
}

const clearSheet = (sheet: Sheet) => sheet.clear()

const setSpreadSheetTitle = (spreadsheet: Spreadsheet) =>
  spreadsheet.rename(`${SPREADSHEET_TITLE} (${dayjs().format(DATE_FORMAT)})`)

// NOTE: GASにはURL Classが実装されていない？ため簡易的に実装している
const isGitHubServerHost = (url: string) => url.split('/')[2] === GITHUB_STORAGE_SERVER_HOST

const fetchPackageJsons = (packageJsonUrls: string[], gitHubToken?: string): PackageJson[] =>
  packageJsonUrls
    .filter(url => isGitHubServerHost(url))
    .map(url =>
      JSON.parse(
        // NOTE: UrlFetchApp.fetchAllを利用すると並列に取得できるが、なぜかヘッダの指定ができなかったため、UrlFetchApp.fetchを利用している
        UrlFetchApp.fetch(url, { headers: { Authorization: `token ${gitHubToken}` } }).getContentText(),
      ),
    )

const setNewCsv = (sheet: Sheet, csvString: string) => {
  const dArr = Utilities.parseCsv(csvString)
  sheet.getRange(1, 1, dArr.length, dArr[0].length).setValues(dArr)
}

const setSheetStyle = (sheet: Sheet) => {
  sheet.setFrozenRows(1)
  sheet.autoResizeColumn(1)
  sheet.getRange('1:1').setFontWeight('bold')
}

// @ts-expect-error
global.main = () => {
  try {
    const { packageJsonUrls, gitHubToken } = getScriptProperties()

    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
    const sheet = spreadsheet.getSheetByName('マスター') ?? spreadsheet.getActiveSheet()
    if (!sheet) {
      throw new Error('シートが見つかりません')
    }

    const packageJsons = fetchPackageJsons(packageJsonUrls, gitHubToken)
    const csv = createCsv(packageJsons)

    clearSheet(sheet)
    setNewCsv(sheet, csv)
    setSheetStyle(sheet)

    setSpreadSheetTitle(spreadsheet)
  } catch (e) {
    Logger.log(e)
  }
}
