// multiple-users-undo-redo-steps.js
import { Given, When, Then, After, Before } from '@cucumber/cucumber';
import { FIRSTDOCUMENT, ISHEADLESS, STEP_TIMEOUT, URL } from '../../constants/common.js';
import { PARAGRAPH, SELECTION } from '../../constants/office_docx.js';
import puppeteer, { Browser, Page } from 'puppeteer';
import { clearUpAndDisconnectPage } from '../../utils/clearup.js';
import { writeText } from '../../utils/elementActions.js';
import { redo, undo } from '../../utils/keyboardActions.js';
import { pageLoadingComplete } from '../../utils/navigation.js';
import { checkMessageSynchronized } from '../../utils/textEvaluation.js';
import { withErrorHandling } from '../../utils/util.js';

let browser: Browser;
let pageA: Page;
let pageB: Page;
let pageC: Page;

Before({ tags: '@multiple-users-undo-redo', timeout: STEP_TIMEOUT }, async function () {
  browser = await puppeteer.launch({ headless: ISHEADLESS })
  pageA = await browser.newPage();
  pageB = await browser.newPage();
  pageC = await browser.newPage();

})

After({ tags: '@multiple-users-undo-redo' }, async function () {
  withErrorHandling(() => clearUpAndDisconnectPage(pageA), "error occured while clearUpAndDisconnectPage at pageA");
  withErrorHandling(() => clearUpAndDisconnectPage(pageB), "error occured while clearUpAndDisconnectPage at pageB");
  withErrorHandling(() => clearUpAndDisconnectPage(pageB), "error occured while clearUpAndDisconnectPage at pageC");
  await withErrorHandling(() => browser.close(), "Error occured while closing broswer");
})


Given('"User A", "User B", and "User C" have opened the same document in multiple users undo redo steps', { timeout: STEP_TIMEOUT }, async function () {
  withErrorHandling(() => pageLoadingComplete(pageA, FIRSTDOCUMENT, SELECTION, URL), "opening the pageA has failed");
  withErrorHandling(() => pageLoadingComplete(pageB, FIRSTDOCUMENT, SELECTION, URL), "opening the pageB has failed");
  withErrorHandling(() => pageLoadingComplete(pageC, FIRSTDOCUMENT, SELECTION, URL), "opening the pageC has failed");
});

When('"User A" types {string} in multiple users undo redo steps', async function (text) {
  withErrorHandling(() => writeText(pageA, SELECTION, text), "writing the text has failed at pageA");
});

When('"User B" types {string} in multiple users undo redo steps', async function (text) {
  withErrorHandling(() => writeText(pageB, SELECTION, text), "writing the text has failed at pageB");
});

When('"User C" types {string} in multiple users undo redo steps', async function (text) {
  withErrorHandling(() => writeText(pageB, SELECTION, text), "writing the text has failed at pageC");
});

When('"User A" undoes their changes in multiple users undo redo steps', async function () {
  withErrorHandling(() => undo(pageA), "exception occur while undo text at pageA");
});

When('"User B" undoes their changes in multiple users undo redo steps', async function () {
  withErrorHandling(() => undo(pageB), "exception occur while undo text at pageB");
});

When('"User A" redoes their changes in multiple users undo redo steps', async function () {
  withErrorHandling(() => redo(pageA), "exception occur while redo text at pageA");
});

When('"User B" redoes their changes in multiple users undo redo steps', async function () {
  withErrorHandling(() => redo(pageB), "exception occur while redo text at pageB");
});

Then('"User C" should see the text after User B redo {string} in multiple users undo redo steps', async function (text) {
  withErrorHandling(() => checkMessageSynchronized(pageC, [text], PARAGRAPH), "error occured while verifying expect message and acutal message");
});

When('"User C" undo their changes in multiple users undo redo steps', async function () {
  withErrorHandling(() => undo(pageC), "exception occur while undo text at pageC");
});

Then('"User C" should see the text after User C redo {string} in multiple users undo redo steps', async function (text) {
  withErrorHandling(() => checkMessageSynchronized(pageC, [text], PARAGRAPH), "error occured while verifying expect message and acutal message");
})