import { expect } from 'chai';
import { Given, When, Then, Before, After } from '@cucumber/cucumber';
import puppeteer from 'puppeteer';
import clearUp, { checkMessageSynchronized, disconnectPage, writeDown, pageNavigationAndBringToFront, clickUsingSelector } from '../util.js';

let browser, pageA, pageB;

Before(async function () {
  browser = await puppeteer.launch({ headless: false });

  pageA = await browser.newPage();
  pageB = await browser.newPage();
});

After(async function () {
  pageA.bringToFront();
  await clearUp(pageA);
  await disconnectPage(pageA);
  pageB.bringToFront();
  await disconnectPage(pageB);

  await browser.close();
});

Given('"User A" has opened a document and start editing', async function () {
  let url = 'http://localhost:8081/#/filelist?userId=seunghyun_baek&password=qwer1234!%40&personaId='; // 추후 parameter로 변경될 예정
  await pageNavigationAndBringToFront(pageA, url);
  await clickUsingSelector(pageA, '#root > table > tbody > tr:nth-child(1) > td:nth-child(2)'); // 문서 진입
  await pageNavigationAndBringToFront(pageB, url);
});


When('"User A" types {string} in the first paragraph', async function (text) {
  await writeDown(pageA, '#office-blink-caret', text);
});

Then('"User B" should see the {string} made by "User A" in real-time', async function (text) {
  pageB.bringToFront();
  await clickUsingSelector(pageB, '#root > table > tbody > tr:nth-child(1) > td:nth-child(2)'); // 문서 진입
  console.log("user B Text ", text);
  const expectedMessage = [text];
  await checkMessageSynchronized(pageB, expectedMessage.length, expectedMessage, '.pk-office-d-text.pk-office-Normal');
  await checkMessageSynchronized(pageA, expectedMessage.length, expectedMessage, '.pk-office-d-text.pk-office-Normal');
});
