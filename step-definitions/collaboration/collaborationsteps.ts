import { Given, When, Then, Before, After } from "@cucumber/cucumber";
import { FIRSTDOCUMENT, ISHEADLESS, STEP_TIMEOUT, URL } from "../../constants/common.js";
import { PARAGRAPH, SELECTION } from "../../constants/office_docx.js";
import puppeteer, { Browser, Page } from 'puppeteer';
import { clearUpAndDisconnectPage } from "../../utils/clearup.js";
import { writeText } from "../../utils/elementActions.js";
import { pageLoadingComplete } from "../../utils/navigation.js";
import { checkMessageSynchronized } from "../../utils/textEvaluation.js";
import { withErrorHandling } from "../../utils/util.js";

console.log("collaborationsteps.ts 파일 로드됨");

let browser: Browser;
let pageA: Page;
let pageB: Page;
console.log("함수");
Before({ tags: '@collaboration' }, async function () {
  browser = await puppeteer.launch({ headless: ISHEADLESS });
  pageA = await browser.newPage();
  pageB = await browser.newPage();
  console.log("Before 끝나구");
});

After({ tags: '@collaboration' }, async function () {
  withErrorHandling(() => clearUpAndDisconnectPage(pageA), "error occured while clearUpAndDisconnectPage at pageA");
  withErrorHandling(() => clearUpAndDisconnectPage(pageB), "error occured while clearUpAndDisconnectPage at pageB");

  await withErrorHandling(() => browser.close(), "Error occured while closing broswer");
  console.log("After 끝나구");
});

Given('{string} and {string} have opened the same document in collaborationsteps', { timeout: STEP_TIMEOUT }, async function (userA, userB) {
  console.log(`Given step started with users: ${userA}, ${userB}`);
  await withErrorHandling(() => pageLoadingComplete(pageA, FIRSTDOCUMENT, SELECTION, URL), "opening the pageA has failed");
  await withErrorHandling(() => pageLoadingComplete(pageB, FIRSTDOCUMENT, SELECTION, URL), "opening the pageB has failed");
  console.log("Given step completed");
});

When('"User A" types {string} in the first paragraph in collaborationsteps', async function (text) {
  await withErrorHandling(() => writeText(pageA, SELECTION, text, () => pageA.keyboard.press('Enter')), "writing the text has failed");
  console.log("When step completed");
});

When('{string} types {string} in the second paragraph in collaborationsteps', async function (userB, text) {
  console.log(`When step started with user: ${userB} and text: ${text}`);
  await withErrorHandling(() => writeText(pageB, SELECTION, text, () => pageA.keyboard.press('Enter')), "writing the text has failed");
  console.log("When step completed");
});

Then('The changes made by both users should be reflected on the screens of {string} and {string} in collaborationsteps', async function (userA, userB) {
  console.log(`Then step started with users: ${userA}, ${userB}`);
  const expectedMessages = [
    'Real-time synchronization of changes enables efficient workflow.',
    'Collaborative document editing facilitates seamless communication among team members.'
  ];
  await withErrorHandling(() => checkMessageSynchronized(pageA, expectedMessages, PARAGRAPH), "error occured while verifying expect message and acutal message");
  await withErrorHandling(() => checkMessageSynchronized(pageB, expectedMessages, PARAGRAPH), "error occured while verifying expect message and acutal message");
  console.log("Then step completed");
});
