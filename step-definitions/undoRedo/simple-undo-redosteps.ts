import { Given, When, Then, After, Before } from '@cucumber/cucumber';
import { FIRSTDOCUMENT, ISHEADLESS, STEP_TIMEOUT, URL } from '../../constants/common.js';
import { PARAGRAPH, SELECTION } from '../../constants/office_docx.js';
import puppeteer, { Browser, Page } from 'puppeteer';
import { clearUpAndDisconnectPage } from '../../utils/clearup.js';
import { writeText } from '../../utils/elementActions.js';
import { redo, undo } from '../../utils/keyboardActions.js';
import { pageLoadingComplete } from '../../utils/navigation.js';
import { checkMessageSynchronized, checkMessageUnSynchronized } from '../../utils/textEvaluation.js';
import { withErrorHandling } from '../../utils/util.js';

let browser: Browser;
let pageA: Page;
let pageB: Page;

Before({ tags: '@simple-undo-redo', timeout: STEP_TIMEOUT }, async function () {
  browser = await puppeteer.launch({ headless: ISHEADLESS })
  pageA = await browser.newPage();
  pageB = await browser.newPage();
  // await pageA.setDefaultNavigationTimeout(0);
  // await pageB.setDefaultNavigationTimeout(0); // 탭의 시간 초과 정의 => 무제한
})

After({ tags: '@simple-undo-redo' }, async function () {
  withErrorHandling(() => clearUpAndDisconnectPage(pageA), "error occured while clearUpAndDisconnectPage at pageA");
  withErrorHandling(() => clearUpAndDisconnectPage(pageB), "error occured while clearUpAndDisconnectPage at pageB");
  await withErrorHandling(() => browser.close(), "Error occured while closing broswer");
})

Given('"User A" and "User B" have opened the same document in simple undo redo steps', { timeout: STEP_TIMEOUT }, async function () {
  withErrorHandling(() => pageLoadingComplete(pageA, FIRSTDOCUMENT, SELECTION, URL), "opening the pageA has failed");
  withErrorHandling(() => pageLoadingComplete(pageB, FIRSTDOCUMENT, SELECTION, URL), "opening the pageB has failed");
});

When('"User A" types {string} in simple undo redo steps', async function (text) {
  withErrorHandling(() => writeText(pageA, SELECTION, text), "writing the text has failed at pageA");
});

When('"User B" sees the {string} made by "User A" in simple undo redo steps', async function (text) {
  withErrorHandling(() => checkMessageSynchronized(pageB, [text], PARAGRAPH), "error occured while verifying expect message and acutal message");
});

When('"User A" undo their changes in simple undo redo steps', async function () {
  withErrorHandling(() => undo(pageA), "exception occur while undo text at pageA");
});
Then('"User B" text should different with {string} in simple undo redo steps', { timeout: STEP_TIMEOUT }, async function (text) {
  withErrorHandling(() => checkMessageSynchronized(pageB, [text], PARAGRAPH), "error occured while verifying expect message and acutal message");
})
When('"User A" redo their changes in simple undo redo steps', async function () {
  withErrorHandling(() => redo(pageA), "exception occur while redo text at pageA");
});

Then('"User B" should see the text {string} in simple undo redo steps', { timeout: STEP_TIMEOUT }, async function (text) {
  withErrorHandling(() => checkMessageSynchronized(pageB, [text], PARAGRAPH), "error occured while verifying expect message and acutal message");
});
