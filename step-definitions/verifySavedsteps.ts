import puppeteer, { Browser, Page } from 'puppeteer';
import { Given, When, Then, Before, After } from "@cucumber/cucumber";
import { clearUp, clearUpAndDisconnectPage } from '../utils/clearup.js';
import { FIRSTDOCUMENT, ISHEADLESS, URL } from '../constants/common.js';
import { DISCONNECT_BUTTON, PARAGRAPH, SELECTION } from '../constants/office_docx.js';
import { withErrorHandling } from '../utils/util.js';
import { pageLoadingComplete, pageNavigationAndBringToFront } from '../utils/navigation.js';
import { clickElement, writeText } from '../utils/elementActions.js';
import { checkMessageSynchronized } from '../utils/textEvaluation.js';

let browser: Browser;
let page: Page;

Before({ tags: '@verify-saved' }, async function () {
  browser = await puppeteer.launch({ headless: ISHEADLESS });
  page = await browser.newPage();
});

After({ tags: '@verify-saved' }, async function () {
  withErrorHandling(() => clearUpAndDisconnectPage(page), "error occured while clearUpAndDisconnectPage at page");
  await withErrorHandling(() => browser.close(), "Error occured while closing broswer");
});

Given('I am on the document page', async function () {
  await pageNavigationAndBringToFront(page, URL);
});

When('I enter the document', async function () {
  withErrorHandling(() => pageLoadingComplete(page, FIRSTDOCUMENT, SELECTION, URL), "opening the pageA has failed");
});

When('I write a message {string}', async function (message) {
  withErrorHandling(() => writeText(page, SELECTION, message), "writing the text has failed")
});

When('I exit the document', async function () {
  withErrorHandling(() => clickElement(page, DISCONNECT_BUTTON), "error occured while disconnecting");
});

When('I enter the document again', async function () {
  withErrorHandling(() => pageLoadingComplete(page, FIRSTDOCUMENT, SELECTION, URL), "opening the pageA has failed");
});

Then('I should see the message {string}', async function (text) {
  const expectedMessages = [text];
  withErrorHandling(() => checkMessageSynchronized(page, expectedMessages, PARAGRAPH), "error occured while verifying text");
});
