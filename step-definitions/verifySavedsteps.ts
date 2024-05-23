import { expect } from 'chai';
import puppeteer, { Browser, Page } from 'puppeteer';
import { Given, When, Then, Before, After } from "@cucumber/cucumber";
import { clearUp, clearUpAndDisconnectPage } from 'utils/clearup';
import { FIRSTDOCUMENT, ISHEADLESS, URL } from 'constants/common';
import { DISCONNECT_BUTTON, PARAGRAPH, SELECTION } from 'constants/office_docx';
import { withErrorHandling } from 'utils/util';
import { pageLoadingComplete } from 'utils/navigation';
import { clickElement, writeText } from 'utils/elementActions';
import { checkMessageSynchronized } from 'utils/textEvaluation';

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

Given('I am on the document this.page', async function () {
  await this.page.goto(URL);
});

When('I enter the document', async function () {
  withErrorHandling(() => pageLoadingComplete(page, FIRSTDOCUMENT, SELECTION, URL), "opening the pageA has failed");
});

When('I write a message {string}', async function (message) {
  withErrorHandling(() => writeText(page, SELECTION, message), "writing the text has failed")
});

When('I exit the document', async function () {
  const disconnectDocumentButton = await this.page.waitForSelector('#pk-office-a-root > div.src-style-appbar-AppBar-module__container--e1mgO > div.src-style-appbar-AppBar-module__right--GX4AR > button');
  await disconnectDocumentButton.click();
});

When('I enter the document again', async function () {
  withErrorHandling(() => clickElement(page, DISCONNECT_BUTTON), "error occured while disconnecting");
});

Then('I should see the message {string}', async function (text) {
  const expectedMessages = [text];
  withErrorHandling(() => checkMessageSynchronized(page, expectedMessages, PARAGRAPH), "error occured while verifying text");
});
