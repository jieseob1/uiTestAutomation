import { Given, When, Then, Before, After } from '@cucumber/cucumber';
import { FIRSTDOCUMENT, ISHEADLESS } from 'constants/common';
import { PARAGRAPH, SELECTION } from 'constants/office_docx';
import puppeteer, { Browser, Page } from 'puppeteer';
import { clearUpAndDisconnectPage } from 'utils/clearup';
import { clickUsingSelector } from 'utils/elementActions';
import { checkMessageSynchronized } from 'utils/textEvaluation';
import { waitTime, withErrorHandling } from 'utils/util';

let browser: { [key: string]: Browser } = {};
// broswer들도 여러가지
let pages: { [key: string]: Page } = {};

const paragraphs = [
  'First paragraph edited by User A',
  'Second paragraph edited by User B',
  'Third paragraph edited by User C',
  'Fourth paragraph edited by User D',
  'Fifth paragraph edited by User E',
];

Before({ tags: '@multi-user' }, async function () {
  browser = await puppeteer.launch({ headless: ISHEADLESS });
});

After({ tags: '@multi-user' }, async function () {
  await browser.close();
  for (const [user, page] of Object.entries(pages)) {
    withErrorHandling(() => clearUpAndDisconnectPage(page), "error occured while clearUpAndDisconnectPage at page");
  }
});

Given("the following users Enter the DoucmentList: ", async function (dataTable) {
  // 해당 부분 추가로 변경하기
  const users = dataTable.hashes();
  for (const user of users) {
    const page = await browser.newPage();
    pages[user.User] = page; // 각 유저들의 페이지 추가
    await page(page, URL); // URL로 이동 //이동 하는거 다른거 보기
  }
})

When('When each user enters the document at {int}-second intervals and edits a different paragraph', async (interval) => {
  let index = 0;
  for (const [user, page] of Object.entries(pages)) {
    await clickUsingSelector(page, FIRSTDOCUMENT); // 첫번째 문서 들어가는거
    await waitTime(1);
    writeText(page, SELECTION, paragraphs[index], await page.keyboard.press('Enter'));
    await waitTime(interval);
    index++;
  }
})

Then('all users should see the same screen with the changes made by each user', async function () {
  for (const [user, page] of Object.entries(pages)) {
    await checkMessageSynchronized(page, paragraphs, PARAGRAPH);
  }
})