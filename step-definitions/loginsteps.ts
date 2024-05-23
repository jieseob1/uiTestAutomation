import { expect } from "chai";
import { Given, When, Then, Before, After } from "@cucumber/cucumber";
import { LOCALHOST_URL, PASSWORD_INPUT, TYPING_DELAY, URL, USERID_INPUT } from "constants/common";
import puppeteer from 'puppeteer';

Before({ tags: '@login' }, async function () { // Beforeeach 개념
  this.browser = await puppeteer.launch({ headless: true });
  this.page = await this.browser.newPage();
});

After({ tags: '@login' }, async function () {
  await this.browser.close();
});

Given('I am on the login this.page', async function () {
  await this.page.goto(LOCALHOST_URL);
});

When('I enter valid credentials', async function () {
  await this.page.waitForNavigation();
  const userIdInput = await this.page.waitForSelector(USERID_INPUT);
  await userIdInput.type('seunghyun_baek', { delay: TYPING_DELAY });
  const passwordInput = await this.page.waitForSelector(PASSWORD_INPUT);
  await passwordInput.type('qwer1234!@', { delay: TYPING_DELAY });
});

When('I click the login button', async function () {
  const loginButton = await this.page.waitForSelector('#root > div > button');
  await loginButton.click();
});

When('make new Document', async function () {
  const clickDocxRadioButton = await this.page.waitForSelector('#root > div > div > span:nth-child(1)');
  await clickDocxRadioButton.click();
  const createNewDocumentInput = await this.page.waitForSelector('#root > div > div > div > input[type=text]');
  await createNewDocumentInput.type('공동편집 UI 테스트', { delay: TYPING_DELAY });
  const createButton = await this.page.waitForSelector('#root > div > div > div > button');
  await createButton.click();
});

Then('I should be redirected to the dashboard', async function () {
  const expectedURL = URL;
  await this.page.waitForSelector('#root', { timeout: 10 * 1000 });
  const currentURL = this.page.url();
  console.log("currentURL", currentURL);
  console.log("currentURL.startsWith(expectedURL)", currentURL.startsWith(expectedURL));
  expect(currentURL).to.equal(expectedURL);
});