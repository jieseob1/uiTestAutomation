import { expect } from 'chai';
import puppeteer from 'puppeteer';
import { Given, When, Then, Before, After } from "@cucumber/cucumber";
import clearUp from '../util.js';

let browser, page;
Before(async function () {
  browser = await puppeteer.launch({ headless: true });
  page = await browser.newPage();
  await clearUp(page);
});

After(async function () {
  await clearUp(page);
  const disconnectDocumentButton = await page.waitForSelector('#pk-office-a-root > div.src-style-appbar-AppBar-module__container--e1mgO > div.src-style-appbar-AppBar-module__right--GX4AR > button');
  await disconnectDocumentButton.click();
  await browser.close();
});

Given('I am on the document page', async function () {
  await page.goto('http://localhost:8081/#/filelist?userId=seunghyun_baek&password=qwer1234!%40&personaId=');
});

When('I enter the document', async function () {
  const documentLink = await page.waitForSelector('#root > table > tbody > tr:nth-child(1) > td:nth-child(2)');
  await documentLink.click();
});

When('I write a message {string}', async function (message) {
  const inputField = await page.waitForSelector('#office-blink-caret');
  await inputField.type(message);
});

When('I exit the document', async function () {
  const disconnectDocumentButton = await page.waitForSelector('#pk-office-a-root > div.src-style-appbar-AppBar-module__container--e1mgO > div.src-style-appbar-AppBar-module__right--GX4AR > button');
  await disconnectDocumentButton.click();
});

When('I enter the document again', async function () {
  const documentLink = await page.waitForSelector('#root > table > tbody > tr:nth-child(1) > td:nth-child(2)');
  await documentLink.click();
});

Then('I should see the message {string}', async function (expectedMessage) {
  await page.waitForSelector('#root', { timeout: 30000 });
  // const messageElement = await page.waitForSelector('.pk-office-d-text.pk-office-Normal', { timeout: 30000 });

  //콘솔 이벤트 리스터 추가
  const messages = [];
  page.on('console', msg => {
    messages.push(msg.text());
  });

  await page.waitForSelector('.pk-office-d-text.pk-office-Normal');

  const actualMessage = await page.evaluate(() => {
    const element = document.querySelector('.pk-office-d-text.pk-office-Normal');
    return element ? element.textContent.trim() : '';
  });

  console.log(messages); // ['actualMessage Hello, World!']
  console.log('this is actualMessage:', actualMessage + "end of actual");

  expect(actualMessage).to.equal(expectedMessage);
});
