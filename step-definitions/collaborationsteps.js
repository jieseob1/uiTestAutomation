import { expect } from 'chai';
import { Given, When, Then, Before, After, setDefaultTimeout } from "@cucumber/cucumber";
import puppeteer from 'puppeteer';
import clearUp, { checkMessageSynchronized, pageNavigationAndBringToFront } from '../util.js';

let browser, pageA, pageB;

Before(async function () {
  browser = await puppeteer.launch({ headless: false });

  pageA = await browser.newPage();
  pageB = await browser.newPage();
});

After(async function () {
  pageA.bringToFront();
  await clearUp(pageA);
  pageA.bringToFront();
  const pageAdisconnectDocumentButton = await pageA.waitForSelector('#pk-office-a-root > div.src-style-appbar-AppBar-module__container--e1mgO > div.src-style-appbar-AppBar-module__right--GX4AR > button', { timeout: 60000 });
  await pageAdisconnectDocumentButton.click();

  pageB.bringToFront();
  await clearUp(pageB);
  const pageBdisconnectDocumentButton = await pageB.waitForSelector('#pk-office-a-root > div.src-style-appbar-AppBar-module__container--e1mgO > div.src-style-appbar-AppBar-module__right--GX4AR > button', { timeout: 60000 });
  await pageBdisconnectDocumentButton.click();

  await browser.close();
});

Given('"User A" and "User B" have opened the same document', async function () {
  let url = 'http://localhost:8081/#/filelist?userId=seunghyun_baek&password=qwer1234!%40&personaId='; // 추후 parameter로 변경될 예정
  await pageA.goto(url);
  await pageA.waitForNavigation();
  await pageA.bringToFront();
  // pageNavigationAndBringToFront(page, url);
  const userADocumentLink = await pageA.waitForSelector('#root > table > tbody > tr:nth-child(1) > td:nth-child(2)');
  await userADocumentLink.click();

  await pageB.goto(url);
  await pageB.bringToFront();
  const userBDocumentLink = await pageB.waitForSelector('#root > table > tbody > tr:nth-child(1) > td:nth-child(2)');
  await userBDocumentLink.click();
});

When('"User A" types {string} in the first paragraph', async function (text) {
  await pageA.bringToFront();
  await clearUp(pageA);
  const inputField = await pageA.waitForSelector('#office-blink-caret');
  await pageA.keyboard.press('Enter');
  await inputField.type(text);

  // 입력한 텍스트가 포함되었는지 확인
  await pageA.waitForFunction((expectedText) => {
    const element = document.querySelector('.pk-office-d-text.pk-office-Normal');
    return element && element.textContent.includes(expectedText);
  }, {}, text);

  const firstParagraph = await pageA.evaluate(() => {
    return document.querySelector('.pk-office-d-text.pk-office-Normal').textContent;
  });
  expect(firstParagraph).to.include(text);
});

When('"User B" types {string} in the second paragraph', async function (text) {
  await pageB.bringToFront();
  const inputField = await pageB.waitForSelector('#office-blink-caret');
  await inputField.type(text);

  // 입력한 텍스트가 포함되었는지 확인
  await pageB.waitForFunction((expectedText) => {
    const element = document.querySelector('.pk-office-d-text.pk-office-Normal');
    return element.textContent.includes(expectedText);
  }, {}, text);
  const secondParagraph = await pageB.evaluate(() => {
    return document.querySelector('.pk-office-d-text.pk-office-Normal').textContent;
  });

  expect(secondParagraph).to.include(text);
});


Then('The changes made by both users should be reflected on the screens of "User A" and "User B"', async function () {
  // Page A에서 문자열 가져오기
  const expectedMessages = [ // 추후 파라미터로 받아서 동작하게끔 변경
    'Real-time synchronization of changes enables efficient workflow.',
    'Collaborative document editing facilitates seamless communication among team members.',
  ]
  checkMessageSynchronized(pageA, expectedMessages.length, expectedMessages, '.pk-office-d-text.pk-office-Normal');
  checkMessageSynchronized(pageB, expectedMessages.length, expectedMessages, '.pk-office-d-text.pk-office-Normal');
  // await pageA.bringToFront();
  // await pageA.waitForFunction(() => {
  //   const elements = document.querySelectorAll('.pk-office-d-text.pk-office-Normal');
  //   return elements.length >= 2 &&
  //     elements[0].textContent.trim() === 'Real-time synchronization of changes enables efficient workflow.' &&
  //     elements[1].textContent.trim() === 'Collaborative document editing facilitates seamless communication among team members.';
  // });

  // const paragraphsA = await pageA.evaluate(() => {
  //   const elements = document.querySelectorAll('.pk-office-d-text.pk-office-Normal');
  //   return Array.from(elements).map(el => el.textContent.trim());
  // });

  // const [firstParagraphA, secondParagraphA] = paragraphsA;
  // console.log("firstParagraphA:", firstParagraphA);
  // console.log("secondParagraphA:", secondParagraphA);

  // expect(firstParagraphA).to.equal('Real-time synchronization of changes enables efficient workflow.');
  // expect(secondParagraphA).to.equal('Collaborative document editing facilitates seamless communication among team members.');

  // // Page B로 전환 및 대기 시간 추가
  // await pageB.bringToFront();
  // // Page B에서 문자열 가져오기
  // await pageB.waitForFunction(() => {
  //   const elements = document.querySelectorAll('.pk-office-d-text.pk-office-Normal');
  //   return elements.length >= 2 &&
  //     elements[0].textContent.trim() === 'Real-time synchronization of changes enables efficient workflow.' &&
  //     elements[1].textContent.trim() === 'Collaborative document editing facilitates seamless communication among team members.';
  // });

  // const paragraphsB = await pageB.evaluate(() => {
  //   const elements = document.querySelectorAll('.pk-office-d-text.pk-office-Normal');
  //   return Array.from(elements).map(el => el.textContent.trim());
  // });

  // const [firstParagraphB, secondParagraphB] = paragraphsB;
  // console.log("firstParagraphB:", firstParagraphB);
  // console.log("secondParagraphB:", secondParagraphB);

  // expect(firstParagraphB).to.equal('Real-time synchronization of changes enables efficient workflow.');
  // expect(secondParagraphB).to.equal('Collaborative document editing facilitates seamless communication among team members.');
});