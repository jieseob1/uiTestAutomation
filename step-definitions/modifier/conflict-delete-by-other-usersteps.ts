import { Given, When, Then, After, Before } from '@cucumber/cucumber';
import puppeteer, { Browser, Page } from 'puppeteer';
import { ISHEADLESS, DISCONNECT_BUTTON, URL, SELECTION, PARAGRAPH, FIRSTDOCUMENT } from '../../constants.js';
import clearUp, { writeText, undo, clickElement, pageLoadingComplete, pageNavigationAndBringToFront, checkMessageSynchronized, clickUsingSelector, waitTime, checkMessageUnSynchronized, enter } from '../../util.js';

let browser: Browser;
let pageA: Page;
let pageB: Page;

Before({ tags: '@conflict-delete-by-other-user', timeout: STEP_TIMEOUT }, async function () {
  browser = await puppeteer.launch({ headless: ISHEADLESS })
  pageA = await browser.newPage();
  pageB = await browser.newPage();
})

After({ tags: '@conflict-delete-by-other-user' }, async function () {
  pageA.bringToFront();
  await clearUp(pageA);
  await clickElement(pageA, DISCONNECT_BUTTON);

  pageB.bringToFront();
  await clearUp(pageB);
  await clickElement(pageB, DISCONNECT_BUTTON);

  await browser.close();
})
Given('"User A" and "User B" have opened the same document', async function () {

})

When('"User A" edits {string} in the document', async function (text) {

})

When('"User B" deletes the entire sentence edited by "User A"', async function () {

})

Then('Both "User A" and "User B" should see the same document content', async function () {

})