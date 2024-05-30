import { Given, When, Then, After, Before } from '@cucumber/cucumber';
import puppeteer, { Browser, Page } from 'puppeteer';
import { FIRSTDOCUMENT, ISHEADLESS, STEP_TIMEOUT, URL } from '../../constants/common.js';
import { withErrorHandling } from '../../utils/util.js';
import { clearUpAndDisconnectPage } from '../../utils/clearup.js';
import { PARAGRAPH, SELECTION } from '../../constants/office_docx.js';
import { deleteText, writeText } from '../../utils/elementActions.js';
import { pageLoadingComplete } from '../../utils/navigation.js';
import { checkMessageSynchronized } from '../../utils/textEvaluation.js';

let browser: Browser;
let pageA: Page;
let pageB: Page;

Before({ tags: '@conflict-delete-by-other-user', timeout: STEP_TIMEOUT }, async function () {
  browser = await puppeteer.launch({ headless: ISHEADLESS });
  pageA = await browser.newPage();
  pageB = await browser.newPage();
});

After({ tags: '@conflict-delete-by-other-user' }, async function () {
  await withErrorHandling(() => clearUpAndDisconnectPage(pageA), "Error occurred while clearing up and disconnecting pageA");
  await withErrorHandling(() => clearUpAndDisconnectPage(pageB), "Error occurred while clearing up and disconnecting pageB");
  await withErrorHandling(() => browser.close(), "Error occurred while closing browser");
});

Given('"User A" and "User B" have opened the same document in conflict delete by other user steps', { timeout: STEP_TIMEOUT }, async function () {
  await withErrorHandling(() => pageLoadingComplete(pageA, FIRSTDOCUMENT, SELECTION, URL), "Opening pageA has failed");
  await withErrorHandling(() => pageLoadingComplete(pageB, FIRSTDOCUMENT, SELECTION, URL), "Opening pageB has failed");
});

When('"User A" writes {string} in conflict delete by other user steps', async function (text) {
  await withErrorHandling(() => writeText(pageA, SELECTION, text), "Writing the text has failed");
});

When('"User B" deletes the word {string} in the sentence {string} in conflict delete by other user steps', async function (targetWord, sentence) {
  await withErrorHandling(() => deleteText(pageB, sentence, targetWord, PARAGRAPH), "deleting the text has failed");
});

Then('Both "User A" and "User B" should see the document content as {string} in conflict delete by other user steps', async function (expectedText) {
  await checkMessageSynchronized(pageA, [expectedText], PARAGRAPH);
  await checkMessageSynchronized(pageB, [expectedText], PARAGRAPH);
});