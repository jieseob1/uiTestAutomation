import { Given, When, Then, After, Before } from '@cucumber/cucumber';
import { ISHEADLESS, STEP_TIMEOUT } from 'constants/common';
import { DISCONNECT_BUTTON } from 'constants/office_docx';
import puppeteer, { Browser, Page } from 'puppeteer';
import { clearUp, clearUpAndDisconnectPage } from 'utils/clearup';
import { clickElement } from 'utils/elementActions';
import { withErrorHandling } from 'utils/util';


let browser: Browser;
let pageA: Page;
let pageB: Page;

Before({ tags: '@conflict-delete-by-other-user', timeout: STEP_TIMEOUT }, async function () {
  browser = await puppeteer.launch({ headless: ISHEADLESS })
  pageA = await browser.newPage();
  pageB = await browser.newPage();
})

After({ tags: '@conflict-delete-by-other-user' }, async function () {
  withErrorHandling(() => clearUpAndDisconnectPage(pageA), "error occured while clearUpAndDisconnectPage at pageA");
  withErrorHandling(() => clearUpAndDisconnectPage(pageB), "error occured while clearUpAndDisconnectPage at pageB");

  await withErrorHandling(() => browser.close(), "Error occured while closing broswer");
})
Given('"User A" and "User B" have opened the same document', async function () {

})

When('"User A" inserts a new rectangle shape', async function (text) {

})

When('"User A" resizes the shape', async function () {

})

When('"User B" changes the position of the same shape', async function () {

})
Then('Both "User A" and "User B" should see the same document content', async function () {

})
