import { expect } from 'chai';
import { Given, When, Then, Before, After } from "@cucumber/cucumber";
import puppeteer from 'puppeteer';

let browser, page;

Before(async function () { // Beforeeach 개념
  browser = await puppeteer.launch({ headless: true });
  page = await browser.newPage();
});

After(async function () {
  await browser.close();
});

Given('I am on the login page', async function () {
  await page.goto("http://localhost:8081");
});

When('I enter valid credentials', async function () {
  await page.waitForNavigation();
  const userIdInput = await page.waitForSelector('#root > div > table > tr:nth-child(1) > td:nth-child(2) > input[type=string]');
  await userIdInput.type('seunghyun_baek');
  const passwordInput = await page.waitForSelector('#root > div > table > tr:nth-child(2) > td:nth-child(2) > input[type="string"]');
  await passwordInput.type('qwer1234!@');
});

When('I click the login button', async function () {
  const loginButton = await page.waitForSelector('#root > div > button');
  await loginButton.click();
});

When('make new Document', async function () {
  const clickDocxRadioButton = await page.waitForSelector('#root > div > div > span:nth-child(1)');
  await clickDocxRadioButton.click();
  const createNewDocumentInput = await page.waitForSelector('#root > div > div > div > input[type=text]');
  await createNewDocumentInput.type('공동편집');
  const createButton = await page.waitForSelector('#root > div > div > div > button');
  await createButton.click();
});

Then('I should be redirected to the dashboard', async function () {
  const expectedURL = 'http://localhost:8081/#/filelist?userId=seunghyun_baek&password=qwer1234!%40&personaId=';
  await page.waitForSelector('#root', { timeout: 30000 });
  const currentURL = page.url();
  console.log("currentURL", currentURL);
  console.log("currentURL.startsWith(expectedURL)", currentURL.startsWith(expectedURL));
  expect(currentURL).to.equal(expectedURL);
});