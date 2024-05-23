// multiple-undo-redo-steps.js
import { Given, When, Then, Before, After } from '@cucumber/cucumber';
import { FIRSTDOCUMENT, ISHEADLESS, URL } from 'constants/common';
import { PARAGRAPH, SELECTION } from 'constants/office_docx';
import puppeteer, { Browser, Page } from 'puppeteer';
import { clearUpAndDisconnectPage } from 'utils/clearup';
import { writeText } from 'utils/elementActions';
import { redo, undo } from 'utils/keyboardActions';
import { pageLoadingComplete } from 'utils/navigation';
import { checkElementsText, checkMessageSynchronized } from 'utils/textEvaluation';
import { withErrorHandling } from 'utils/util';

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
Given('"User A" and "User B" have opened the same document', async function () {
  withErrorHandling(() => pageLoadingComplete(pageA, FIRSTDOCUMENT, SELECTION, URL), "opening the pageA has failed");
  withErrorHandling(() => pageLoadingComplete(pageB, FIRSTDOCUMENT, SELECTION, URL), "opening the pageB has failed");
});

When('"User A" types {string}', async function (text) {
  withErrorHandling(() => writeText(pageA, SELECTION, text), "writing the text has failed")
});

When('"User B" sees the changes made by "User A"', async function () {
  await pageB.waitForSelector('.editor');
});

When('"User A" undoes their changes twice', async function () {
  await undo(pageA);
  await undo(pageA);
});

When('"User A" redoes their changes twice', async function () {
  await redo(pageA);
  await redo(pageA);
});

Then('"User B" should see the text {string}', async function (expectedText) {
  await checkMessageSynchronized(pageB, expectedText, PARAGRAPH);
});