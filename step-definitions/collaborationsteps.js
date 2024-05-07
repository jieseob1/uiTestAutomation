import { expect } from 'chai';
import { Given, When, Then, Before, After, setDefaultTimeout } from "@cucumber/cucumber";
import puppeteer from 'puppeteer';
import clearUp from '../util.js';

let browser, pageA, pageB;

Before(async function () {
  browser = await puppeteer.launch({ headless: false });
  pageA = await browser.newPage();
  pageB = await browser.newPage();
  // await clearUp(pageA);
  // await clearUp(pageB);
});

After(async function () {
  await clearUp(pageA);
  await clearUp(pageB);

  const pageAdisconnectDocumentButton = await pageA.waitForSelector('#pk-office-a-root > div.src-style-appbar-AppBar-module__container--e1mgO > div.src-style-appbar-AppBar-module__right--GX4AR > button', { timeout: 60000 });
  await pageAdisconnectDocumentButton.click();

  const pageBdisconnectDocumentButton = await pageB.waitForSelector('#pk-office-a-root > div.src-style-appbar-AppBar-module__container--e1mgO > div.src-style-appbar-AppBar-module__right--GX4AR > button', { timeout: 60000 });
  await pageBdisconnectDocumentButton.click();
  await browser.close();
});

Given('"User A" and "User B" have opened the same document', async function () {
  let url = 'http://localhost:8081/#/filelist?userId=seunghyun_baek&password=qwer1234!%40&personaId=';
  await pageA.goto(url);
  await pageA.waitForNavigation();
  await pageA.bringToFront();
  const userADocumentLink = await pageA.waitForSelector('#root > table > tbody > tr:nth-child(1) > td:nth-child(2)');
  await userADocumentLink.click();

  await pageB.goto(url);
  await pageB.waitForNavigation();
  await pageB.bringToFront();
  const userBDocumentLink = await pageB.waitForSelector('#root > table > tbody > tr:nth-child(1) > td:nth-child(2)');
  await userBDocumentLink.click();
});

When('"User A" types {string} in the first paragraph', async function (text) {
  await pageA.bringToFront()// https://pptr.dev/api/puppeteer.keyinput
  const inputField = await pageA.waitForSelector('#office-blink-caret');
  await pageA.keyboard.press('Enter')
  await inputField.type(text);
});

When('"User B" types {string} in the second paragraph', async function (text) {
  await pageB.bringToFront();
  const inputField = await pageB.waitForSelector('#office-blink-caret');
  await inputField.type(text);
});

Then('The changes made by both users should be reflected on the screens of "User A" and "User B"', async function () {
  await pageA.bringToFront()
  const firstParagraphA = await pageA.evaluate(() => {
    return document.querySelector('#document-content > p:nth-child(1)').textContent;
  });
  console.log("firstParagraphA:", firstParagraphA);
  expect(firstParagraphA).to.equal('Collaborative document editing facilitates seamless communication among team members.');
  const secondParagraphA = await pageA.evaluate(() => {
    return document.querySelector('#document-content > p:nth-child(2)').textContent;
  });
  console.log("secondParagraphA:", secondParagraphA);
  expect(secondParagraphA).to.equal('Real-time synchronization of changes enables efficient workflow.');
  await pageB.bringToFront();
  const firstParagraphB = await pageB.evaluate(() => {
    return document.querySelector('#document-content > p:nth-child(1)').textContent;
  });
  console.log("firstParagraphB:", firstParagraphB);
  expect(firstParagraphB).to.equal('Collaborative document editing facilitates seamless communication among team members.');
  const secondParagraphB = await pageB.evaluate(() => {
    return document.querySelector('#document-content > p:nth-child(2)').textContent;
  });
  console.log("secondParagraphB:", secondParagraphB);
  expect(secondParagraphB).to.equal('Real-time synchronization of changes enables efficient workflow.');
});