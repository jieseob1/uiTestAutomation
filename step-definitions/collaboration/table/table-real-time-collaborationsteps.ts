import { Given, When, Then, After, Before } from '@cucumber/cucumber';
import puppeteer, { Browser, Page } from 'puppeteer';
import { clearUp, clearUpAndDisconnectPage } from '../../../utils/clearup.js';
import { pageLoadingComplete } from '../../../utils/navigation.js';
import { createTable, getTableCell } from '../../../utils/tableActions.js';
import { writeText } from '../../../utils/elementActions.js';
import { checkSingleMessageSynchronized } from '../../../utils/textEvaluation.js';
import '../../../utils/customConsole.js'
import { withErrorHandling } from '../../../utils/util.js';
import { FIRSTDOCUMENT, ISHEADLESS, STEP_TIMEOUT, URL } from '../../../constants/common.js';
import { SELECTION } from '../../../constants/office_docx.js';

let browserA: Browser;
let browserB: Browser;
let pageA: Page;
let pageB: Page;
let tableRowNum: number;
let tableColumnNum: number;

Before({ tags: '@table-real-time', timeout: STEP_TIMEOUT }, async function () {
  browserA = await puppeteer.launch({ headless: ISHEADLESS })
  browserB = await puppeteer.launch({ headless: ISHEADLESS })
  pageA = await browserA.newPage();
  pageB = await browserB.newPage();
})

After({ tags: '@table-real-time', timeout: STEP_TIMEOUT }, async function () {
  withErrorHandling(() => clearUpAndDisconnectPage(pageA), "error occured while clearUpAndDisconnectPage at pageA");
  withErrorHandling(() => clearUpAndDisconnectPage(pageB), "error occured while clearUpAndDisconnectPage at pageB");

  await withErrorHandling(() => browserA.close(), "Error occured while closing broswerA");
  await withErrorHandling(() => browserB.close(), "Error occured while closing broswerB");
})

Given('"User A" and "User B" have opened the same document in table real time collaboration steps', { timeout: STEP_TIMEOUT }, async function () {
  await withErrorHandling(() => pageLoadingComplete(pageA, FIRSTDOCUMENT, SELECTION, URL), "opening the pageA has failed");
  await withErrorHandling(() => clearUp(pageA), "error occured while cleaning at pageA"); // 이부분은 추가해주는게 좋을듯

  await withErrorHandling(() => pageLoadingComplete(pageB, FIRSTDOCUMENT, SELECTION, URL), "opening the pageB has failed");
});

When('"User A" create column {int} row {int} a new table in table real time collaboration steps', { timeout: STEP_TIMEOUT }, async function (column, row) {
  withErrorHandling(() => createTable(pageA, column, row), "error occured while creating table");
  tableColumnNum = column;
  tableRowNum = row;
});

When('"User A" write {string} at the row {int} column {int} and "User B" write {string} at the row {int} column {int} at the same time in table real time collaboration steps', { timeout: STEP_TIMEOUT }, async function (userAText, userARow, userAColumn, userBText, userBRow, userBColumn) {
  try {
    const userACell = await getTableCell(pageA, tableColumnNum, tableRowNum, userARow, userAColumn);
    const userBCell = await getTableCell(pageB, tableColumnNum, tableRowNum, userBRow, userBColumn);

    await Promise.all([
      writeText(pageA, String(userACell), userAText),
      writeText(pageB, String(userBCell), userBText),
    ])
    // 병렬 실행 보장 => 프로미스 비동기적, 독립적으로 실행 
  } catch (e) {
    console.error("Error during simultaneous writing:", e);
  }
});

Then('"User B" should see the {string} at the row {int} column {int} and "User A" should see the {string} at the row {int} column {int} in table real time collaboration steps', { timeout: STEP_TIMEOUT }, async function (userAText, userARow, userAColumn, userBText, userBRow, userBColumn) {
  const userAFirstCell = await getTableCell(pageA, tableColumnNum, tableRowNum, userARow, userAColumn);
  const userASecondCell = await getTableCell(pageA, tableColumnNum, tableRowNum, userBRow, userBColumn);
  const userBFirstCell = await getTableCell(pageB, tableColumnNum, tableRowNum, userARow, userAColumn);
  const userBSecondCell = await getTableCell(pageB, tableColumnNum, tableRowNum, userBRow, userBColumn)

  if (userAFirstCell) {
    withErrorHandling(() => checkSingleMessageSynchronized(pageA, userAFirstCell, userAText, '↵'), "error occured while processing userAFirstCell Text");
  }
  if (userASecondCell) {
    withErrorHandling(() => checkSingleMessageSynchronized(pageA, userASecondCell, userBText, '↵'), "error occured while processing userASecondCell Text");
  }
  if (userBFirstCell) {
    withErrorHandling(() => checkSingleMessageSynchronized(pageA, userBFirstCell, userAText, '↵'), "error occured while processing userBFirstCell Text");
  }
  if (userBSecondCell) {
    withErrorHandling(() => checkSingleMessageSynchronized(pageA, userBSecondCell, userBText, '↵'), "error occured while processing userBSecondCell Text");
  }

});
