import { Given, When, Then, Before, After } from '@cucumber/cucumber';
import puppeteer, { Browser, Page } from 'puppeteer';
import { FIRSTDOCUMENT, ISHEADLESS, URL } from 'constants/common';
import { clearUpAndDisconnectPage } from 'utils/clearup';
import { pageLoadingComplete } from 'utils/navigation';
import { PARAGRAPH, SELECTION } from 'constants/office_docx';
import { clickUsingSelector, writeText } from 'utils/elementActions';
import { checkMessageSynchronized } from 'utils/textEvaluation';
import { withErrorHandling } from 'utils/util';

let browser: Browser;
let pageA: Page;
let pageB: Page;

Before({ tags: '@real-time' }, async function () {
  browser = await puppeteer.launch({ headless: ISHEADLESS });
  pageA = await browser.newPage();
  pageB = await browser.newPage();
});

After({ tags: '@real-time' }, async function () {
  withErrorHandling(() => clearUpAndDisconnectPage(pageA), "error occured while clearUpAndDisconnectPage at pageA");
  withErrorHandling(() => clearUpAndDisconnectPage(pageB), "error occured while clearUpAndDisconnectPage at pageB");

  await withErrorHandling(() => browser.close(), "Error occured while closing broswer");
});

Given('"User A" and "User B" has opened a document', async function () {
  withErrorHandling(() => pageLoadingComplete(pageA, FIRSTDOCUMENT, SELECTION, URL), "opening the pageA has failed");
  withErrorHandling(() => pageLoadingComplete(pageB, FIRSTDOCUMENT, SELECTION, URL), "opening the pageB has failed");
});


When('"User A" types {string} in the first paragraph', async function (text) {
  withErrorHandling(() => writeText(pageA, SELECTION, text), "writing the text has failed")
});

Then('"User B" should see the {string} made by "User A" in real-time', async function (text) {
  // pageB.bringToFront();
  // await clickUsingSelector(pageB, FIRSTDOCUMENT); // 문서 진입
  const expectedMessages = [text];
  withErrorHandling(() => checkMessageSynchronized(pageA, expectedMessages, PARAGRAPH), "error occured while verifying expect message and acutal message");
  withErrorHandling(() => checkMessageSynchronized(pageB, expectedMessages, PARAGRAPH), "error occured while verifying expect message and acutal message");
});
