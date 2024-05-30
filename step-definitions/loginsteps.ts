import { expect } from "chai";
import { Given, When, Then, Before, After } from "@cucumber/cucumber";
import { LOCALHOST_URL, PASSWORD_INPUT, TYPING_DELAY, URL, USERID_INPUT } from "../constants/common.js";
import puppeteer, { Browser, Page } from 'puppeteer';

let browser: Browser;
let page: Page;

Before({ tags: '@login' }, async function () {
  console.log('Starting browser for login tests');
  browser = await puppeteer.launch({ headless: true });
  page = await browser.newPage();
});

After({ tags: '@login' }, async function () {
  await browser.close();
});

Given('I am on the login page', async function () {
  console.log('Starting browser for login tests');
  await page.goto(LOCALHOST_URL);
});

When('I enter valid credentials', async function () {
  await page.waitForNavigation();
  const userIdInput = await page.waitForSelector(USERID_INPUT);
  if (!userIdInput) return;
  await userIdInput.type('seunghyun_baek', { delay: TYPING_DELAY });
  const passwordInput = await page.waitForSelector(PASSWORD_INPUT);
  if (!passwordInput) return;
  await passwordInput.type('qwer1234!@', { delay: TYPING_DELAY });
});

When('I click the login button', async function () {
  const loginButton = await page.waitForSelector('#root > div > button');
  if (!loginButton) return;
  await loginButton.click();
});

When('make new Document', async function () {
  const clickDocxRadioButton = await page.waitForSelector('#root > div > div > span:nth-child(1)');
  if (!clickDocxRadioButton) return;
  await clickDocxRadioButton.click();
  const createNewDocumentInput = await page.waitForSelector('#root > div > div > div > input[type=text]');
  if (!createNewDocumentInput) return;
  await createNewDocumentInput.type('공동편집 UI 테스트', { delay: TYPING_DELAY });
  const createButton = await page.waitForSelector('#root > div > div > div > button');
  if (!createButton) return;
  await createButton.click();
});

Then('I should be redirected to the dashboard', async function () {
  const expectedURL = URL;
  await page.waitForSelector('#root', { timeout: 10 * 1000 });
  const currentURL = page.url();
  expect(currentURL).to.equal(expectedURL);
});