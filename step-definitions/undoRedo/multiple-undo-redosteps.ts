// multiple-undo-redo-steps.js
import { Given, When, Then, Before, After } from '@cucumber/cucumber';
import { FIRSTDOCUMENT, ISHEADLESS, STEP_TIMEOUT, URL } from '../../constants/common.js';
import { PARAGRAPH, SELECTION } from '../../constants/office_docx.js';
import puppeteer, { Browser, Page } from 'puppeteer';
import { clearUpAndDisconnectPage } from '../../utils/clearup.js';
import { writeText } from '../../utils/elementActions.js';
import { redo, undo } from '../../utils/keyboardActions.js';
import { pageLoadingComplete } from '../../utils/navigation.js';
import { checkElementsText, checkMessageSynchronized, checkSingleMessageSynchronized } from '../../utils/textEvaluation.js';
import { withErrorHandling } from '../../utils/util.js';

let browser: Browser;
let pageA: Page;
let pageB: Page;

Before({ tags: '@multiple-undo-redo' }, async function () {
  browser = await puppeteer.launch({ headless: ISHEADLESS });

  pageA = await browser.newPage();
  pageB = await browser.newPage();
});

After({ tags: '@multiple-undo-redo' }, async function () {
  withErrorHandling(() => clearUpAndDisconnectPage(pageA), "error occured while clearUpAndDisconnectPage at pageA");
  withErrorHandling(() => clearUpAndDisconnectPage(pageB), "error occured while clearUpAndDisconnectPage at pageB");

  await withErrorHandling(() => browser.close(), "Error occured while closing broswer");
})
Given('"User A" and "User B" have opened the same document in multiple undo redo steps', async function () {
  withErrorHandling(() => pageLoadingComplete(pageA, FIRSTDOCUMENT, SELECTION, URL), "opening the pageA has failed");
  withErrorHandling(() => pageLoadingComplete(pageB, FIRSTDOCUMENT, SELECTION, URL), "opening the pageB has failed");
});

When('"User A" types {string} in multiple undo redo steps', async function (text) {
  withErrorHandling(() => writeText(pageA, SELECTION, text), "writing the text has failed")
});


When('"User A" undoes their changes twice in multiple undo redo steps', async function () {
  await undo(pageA);
  await undo(pageA);
});

When('"User A" redoes their changes twice in multiple undo redo steps', async function () {
  await redo(pageA);
  await redo(pageA);
});

Then('"User B" should see the text {string} in multiple undo redo steps', async function (expectedText) {
  await checkSingleMessageSynchronized(pageB, PARAGRAPH, expectedText);
});