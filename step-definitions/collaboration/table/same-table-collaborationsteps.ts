import { Given, When, Then, After, Before } from '@cucumber/cucumber';
import { FIRSTDOCUMENT, ISHEADLESS, STEP_TIMEOUT, URL } from '../../../constants/common.js';
import { SELECTION } from '../../../constants/office_docx.js';
import puppeteer, { Browser, Page } from 'puppeteer';
import { clearUpAndDisconnectPage } from '../../../utils/clearup.js';
import { writeText } from '../../../utils/elementActions.js';
import { pageLoadingComplete } from '../../../utils/navigation.js';
import { createTable, getTableCell } from '../../../utils/tableActions.js';
import { checkSingleMessageSynchronized } from '../../../utils/textEvaluation.js';
import { withErrorHandling } from '../../../utils/util.js';

let browser: Browser;
let pageA: Page;
let pageB: Page;
let tableRowNum: number;
let tableColumnNum: number;

Before({ tags: '@same-table-editing', timeout: STEP_TIMEOUT }, async function () {
  browser = await puppeteer.launch({ headless: ISHEADLESS })
  pageA = await browser.newPage();
  pageB = await browser.newPage();
})

After({ tags: '@same-table-editing' }, async function () {
  await clearUpAndDisconnectPage(pageA);
  await clearUpAndDisconnectPage(pageB);
  await browser.close();
})

Given('"User A" and "User B" have opened the same document in same table collaboration steps', { timeout: STEP_TIMEOUT }, async function () {
  withErrorHandling(() => pageLoadingComplete(pageA, FIRSTDOCUMENT, SELECTION, URL), "opening the same document has failed at pageA");
  withErrorHandling(() => pageLoadingComplete(pageB, FIRSTDOCUMENT, SELECTION, URL), "opening the same document has failed at pageB");
});
When('"User A" creates column {int} row {int} a new table in same table collaboration steps', { timeout: STEP_TIMEOUT }, async function (column, row) {
  withErrorHandling(() => createTable(pageA, column, row), "error occured while create table");
  tableColumnNum = column;
  tableRowNum = row;
})

When('"User A" selects first cell and write {string} in same table collaboration steps', { timeout: STEP_TIMEOUT }, async function (text) {
  const cell = await getTableCell(pageA, tableColumnNum, tableRowNum, 1, 1);
  if (cell) {
    withErrorHandling(() => writeText(pageA, cell, text), "error occured while selecting and write text at first cell")
  }
})

When('"User B" selects second cell in the same table and write {string} in same table collaboration steps', { timeout: STEP_TIMEOUT }, async function (text) {
  const cell = await getTableCell(pageB, tableColumnNum, tableRowNum, 1, 2);
  if (cell) {
    withErrorHandling(() => writeText(pageA, cell, text), "error occured while selecting and write text at second cell")
  }
})
Then('The table should be merged correctly with both {string} and {string} in same table collaboration steps', async function (textA, textB) {
  const userAFirstCell = await getTableCell(pageA, tableColumnNum, tableRowNum, 1, 1);
  const userASecondCell = await getTableCell(pageA, tableColumnNum, tableRowNum, 1, 2);
  const userBFirstCell = await getTableCell(pageB, tableColumnNum, tableRowNum, 1, 1);
  const userBSecondCell = await getTableCell(pageB, tableColumnNum, tableRowNum, 1, 2)

  if (userAFirstCell) {
    withErrorHandling(() => checkSingleMessageSynchronized(pageA, userAFirstCell, textA, '↵'), "error occured while processing userAFirstCell Text");
  }
  if (userASecondCell) {
    withErrorHandling(() => checkSingleMessageSynchronized(pageA, userASecondCell, textB, '↵'), "error occured while processing userASecondCell Text");
  }
  if (userBFirstCell) {
    withErrorHandling(() => checkSingleMessageSynchronized(pageA, userBFirstCell, textA, '↵'), "error occured while processing userBFirstCell Text");
  }
  if (userBSecondCell) {
    withErrorHandling(() => checkSingleMessageSynchronized(pageA, userBSecondCell, textB, '↵'), "error occured while processing userBSecondCell Text");
  }
})