import { After, Before, Given, Then, When } from "@cucumber/cucumber";
import { FIRSTDOCUMENT, ISHEADLESS, STEP_TIMEOUT, URL } from "../../constants/common.js";
import { PARAGRAPH, SELECTION } from "../../constants/office_docx.js";
import puppeteer, { Browser, Page } from "puppeteer";
import { clearUp, clearUpAndDisconnectPage } from "../../utils/clearup.js";
import { moveSpecificPosition, replaceText, writeText } from "../../utils/elementActions.js";
import { pageLoadingComplete } from "../../utils/navigation.js";
import { checkMessageSynchronized } from "../../utils/textEvaluation.js";
import { withErrorHandling } from "../../utils/util.js";

let browserA: Browser;
let browserB: Browser;
let pageA: Page;
let pageB: Page;
let targetSentence: string;


Before({ tags: '@conflict-real-time-same-position', timeout: STEP_TIMEOUT }, async function () {
  browserA = await puppeteer.launch({ headless: ISHEADLESS });
  browserB = await puppeteer.launch({ headless: ISHEADLESS });
  pageA = await browserA.newPage();
  pageB = await browserB.newPage();
});

After({ tags: '@conflict-real-time-same-position' }, async function () {
  withErrorHandling(() => clearUpAndDisconnectPage(pageA), "error occured while clearUpAndDisconnectPage at pageA");
  withErrorHandling(() => clearUpAndDisconnectPage(pageB), "error occured while clearUpAndDisconnectPage at pageB");

  await withErrorHandling(() => browserA.close(), "Error occured while closing broswerA");
  await withErrorHandling(() => browserB.close(), "Error occured while closing broswerB");
});

Given('"User A" and "User B" have opened the same document in conflict real time same position', { timeout: STEP_TIMEOUT }, async function () {
  await withErrorHandling(() => pageLoadingComplete(pageA, FIRSTDOCUMENT, SELECTION, URL), "opening the pageA has failed");
  await withErrorHandling(() => clearUp(pageA), "error occured while cleaning at pageA"); // 이부분은 추가해주는게 좋을듯
  await withErrorHandling(() => pageLoadingComplete(pageB, FIRSTDOCUMENT, SELECTION, URL), "opening the pageB has failed");
});
When('"User A" writes {string}', { timeout: STEP_TIMEOUT }, async function (text) {
  targetSentence = text;
  await withErrorHandling(() => writeText(pageA, SELECTION, text), "writing the text has failed");
})
When('both users simultaneously select {string} and changes it to {string} and {string} in conflict real time same position', { timeout: STEP_TIMEOUT }, async function (oldWord, userANewWord, userBNewWord) {
  await Promise.all([
    withErrorHandling(async () => {
      const successA = await replaceText(pageA, targetSentence, oldWord, userANewWord, PARAGRAPH);
      if (!successA) {
        moveSpecificPosition(pageB, PARAGRAPH, userBNewWord);
        writeText(pageA, PARAGRAPH, userANewWord);
      }
    }, "error occurred while replacing userA word"),
    withErrorHandling(async () => {
      const successB = await replaceText(pageB, targetSentence, oldWord, userBNewWord, PARAGRAPH);
      if (!successB) {
        moveSpecificPosition(pageB, PARAGRAPH, userANewWord);
        writeText(pageB, PARAGRAPH, userBNewWord);
      }
    }, "error occurred while replacing userB word")
  ]);

})
Then('The document should display {string} at {string} and {string} in conflict real time same position', async function (expectSentence, userA, userB) {
  await checkMessageSynchronized(pageA, [expectSentence], PARAGRAPH);
  await checkMessageSynchronized(pageB, [expectSentence], PARAGRAPH);
}) 