import { Given, When, Then, Before, After } from "@cucumber/cucumber";
import { FIRSTDOCUMENT, ISHEADLESS, URL } from "constants/common";
import { PARAGRAPH, SELECTION } from "constants/office_docx";
import puppeteer, { Browser, Page } from 'puppeteer';
import { clearUpAndDisconnectPage } from "utils/clearup";
import { writeText } from "utils/elementActions";
import { pageLoadingComplete } from "utils/navigation";
import { checkMessageSynchronized } from "utils/textEvaluation";
import { withErrorHandling } from "utils/util";

let browser: Browser;
let pageA: Page;
let pageB: Page;

Before({ tags: '@collaboration' }, async function () {
  browser = await puppeteer.launch({ headless: ISHEADLESS });
  pageA = await browser.newPage();
  pageB = await browser.newPage();
});

After({ tags: '@collaboration' }, async function () {
  withErrorHandling(() => clearUpAndDisconnectPage(pageA), "error occured while clearUpAndDisconnectPage at pageA");
  withErrorHandling(() => clearUpAndDisconnectPage(pageB), "error occured while clearUpAndDisconnectPage at pageB");

  await withErrorHandling(() => browser.close(), "Error occured while closing broswer");
});

Given('"User A" and "User B" have opened the same document', async function () {
  withErrorHandling(() => pageLoadingComplete(pageA, FIRSTDOCUMENT, SELECTION, URL), "opening the pageA has failed");
  withErrorHandling(() => pageLoadingComplete(pageB, FIRSTDOCUMENT, SELECTION, URL), "opening the pageB has failed");
});

When('"User A" types {string} in the first paragraph', async function (text) {
  withErrorHandling(() => writeText(pageA, SELECTION, text, () => pageA.keyboard.press('Enter')), "writing the text has failed")
});

When('"User B" types {string} in the second paragraph', async function (text) {
  withErrorHandling(() => writeText(pageB, SELECTION, text, () => pageA.keyboard.press('Enter')), "writing the text has failed")
});


Then('The changes made by both users should be reflected on the screens of "User A" and "User B"', async function () {
  const expectedMessages = [
    'Real-time synchronization of changes enables efficient workflow.',
    'Collaborative document editing facilitates seamless communication among team members.'
  ]
  withErrorHandling(() => checkMessageSynchronized(pageA, expectedMessages, PARAGRAPH), "error occured while verifying expect message and acutal message");
  withErrorHandling(() => checkMessageSynchronized(pageB, expectedMessages, PARAGRAPH), "error occured while verifying expect message and acutal message");
});