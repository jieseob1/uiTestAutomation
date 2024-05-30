import { Given, When, Then, Before, After } from '@cucumber/cucumber';
import { FIRSTDOCUMENT, ISHEADLESS, STEP_TIMEOUT, URL } from '../../constants/common.js';
import { PARAGRAPH, SELECTION } from '../../constants/office_docx.js';
import puppeteer, { Browser, Page } from 'puppeteer';
import { clearUpAndDisconnectPage } from '../../utils/clearup.js';
import { clickUsingSelector, writeText } from '../../utils/elementActions.js';
import { pageLoadingComplete } from '../../utils/navigation.js';
import { checkMessageSynchronized } from '../../utils/textEvaluation.js';
import { waitTime, withErrorHandling } from '../../utils/util.js';

interface UserEntry {
  User: string;
}

let browsers: { [key: string]: Browser } = {};
let users: string[] = [];
let pages: { [key: string]: Page } = {};

const paragraphs = [
  'First paragraph edited by User A',
  'Second paragraph edited by User B',
  'Third paragraph edited by User C',
  'Fourth paragraph edited by User D',
  'Fifth paragraph edited by User E',
];

Given('the following users Enter the DoucmentList:', { timeout: STEP_TIMEOUT }, async function (dataTable) {
  const userEntries: UserEntry[] = dataTable.hashes();
  users = userEntries.map(entry => entry.User);
  console.log("users:", users); // 사용자 목록 확인
  await Promise.all(users.map(async (user) => {
    const browser = await puppeteer.launch({ headless: ISHEADLESS });
    const page = await browser.newPage();
    browsers[user] = browser;
    pages[user] = page;
    await page.goto(URL);
    await page.bringToFront();
  }));
});

Before({ tags: '@multi-user' }, async function () {
  // Given 단계에서 처리
});

After({ tags: '@multi-user', timeout: STEP_TIMEOUT }, async function () {
  await Promise.all(Object.entries(pages).map(([user, page]) =>
    withErrorHandling(async () => clearUpAndDisconnectPage(page), `error occurred while clearing up and disconnecting page for ${user}`)
  ));
  await Promise.all(Object.entries(browsers).map(([user, browser]) =>
    withErrorHandling(async () => browser.close(), `error occurred while closing browser for ${user}`)
  ));
});

When('each user enters the document at {int}-second intervals and edits a different paragraph', { timeout: 50 * 1000 }, async function (interval) {
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    console.log("user:", user); // 현재 사용자 확인
    const page = pages[user];
    console.log("page:", page);
    await withErrorHandling(() => pageLoadingComplete(page, FIRSTDOCUMENT, SELECTION, URL), "page loading failed");
    await withErrorHandling(() => writeText(page, SELECTION, paragraphs[i], () => page.keyboard.press('Enter')), "failed");
  }
});

Then('all users should see the same screen with the changes made by each user', { timeout: STEP_TIMEOUT }, async function () {
  await Promise.all(users.map(user =>
    withErrorHandling(async () => checkMessageSynchronized(pages[user], paragraphs, PARAGRAPH), `error occurred while checking synchronization for ${user}`)
  ));
});
