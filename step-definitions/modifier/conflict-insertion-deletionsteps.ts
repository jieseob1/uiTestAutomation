import { Given, When, Then, Before, After } from '@cucumber/cucumber';
import { FIRSTDOCUMENT, ISHEADLESS, STEP_TIMEOUT, URL } from '../../constants/common.js';
import { PARAGRAPH, SELECTION } from '../../constants/office_docx.js';
import puppeteer, { Browser, Page } from 'puppeteer';
import { clearUpAndDisconnectPage } from '../../utils/clearup.js';
import { writeText, deleteText } from '../../utils/elementActions.js';
import { pageLoadingComplete } from '../../utils/navigation.js';
import { checkMessageSynchronized } from '../../utils/textEvaluation.js';
import { withErrorHandling } from '../../utils/util.js';
import '../../utils/customConsole.js';

let browser: Browser;
let pageA: Page;
let pageB: Page;

Before({ tags: '@conflict-insertion-deletion' }, async function () {
  browser = await puppeteer.launch({ headless: ISHEADLESS });

  pageA = await browser.newPage();
  pageB = await browser.newPage();
});

After({ tags: '@conflict-insertion-deletion' }, async function () {
  withErrorHandling(() => clearUpAndDisconnectPage(pageA), "error occurred while clearUpAndDisconnectPage at pageA");
  withErrorHandling(() => clearUpAndDisconnectPage(pageB), "error occurred while clearUpAndDisconnectPage at pageB");

  await withErrorHandling(() => browser.close(), "Error occurred while closing browser");
});

Given('"User A" and "User B" have opened the same document in conflict insertion deleteion steps', { timeout: STEP_TIMEOUT }, async function () {
  await withErrorHandling(() => pageLoadingComplete(pageA, FIRSTDOCUMENT, SELECTION, URL), "opening the pageA has failed");
  await withErrorHandling(() => pageLoadingComplete(pageB, FIRSTDOCUMENT, SELECTION, URL), "opening the pageB has failed");
});

When('"User A" writes {string} in conflict insertion deleteion steps', async function (text) {
  await withErrorHandling(() => writeText(pageA, SELECTION, text), "wriring the text has failed");
});

When('"User B" deletes the word {string} in the sentence {string} in conflict insertion deleteion steps', async function (targetWord, sentence) {
  await withErrorHandling(() => deleteText(pageB, sentence, targetWord, PARAGRAPH), "deleting the text has failed");
});

Then('Both "User A" and "User B" should see the document content as {string} in conflict insertion deleteion steps', async function (expectedText) {
  withErrorHandling(() => checkMessageSynchronized(pageA, [expectedText], PARAGRAPH), "error occuered while verifying text at pageA");
  withErrorHandling(() => checkMessageSynchronized(pageB, [expectedText], PARAGRAPH), "error occuered while verifying text at pageB");
})
