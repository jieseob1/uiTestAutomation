// import { Page } from "puppeteer";

// page: Promise<Page>
export default async function clearUp(page) {
  (await page).keyboard.down('Control');
  (await page).keyboard.press('A');
  (await page).keyboard.up('Control');
  (await page).keyboard.press('Backspace');
}


export async function disconnectPage(page, selector) { // can use default selector
  const pageDisconnectDocumentButton = await page.waitForSelector(selector ? selector : "'#pk-office-a-root > div.src-style-appbar-AppBar-module__container--e1mgO > div.src-style-appbar-AppBar-module__right--GX4AR > button'");
  await pageDisconnectDocumentButton.click();
}

export async function clickUsingSelector(page, selector) {
  const selectorLink = await page.waitForSelector(selector);
  await selectorLink.click();
}

export async function writeDown(page, selector, text, callback) {
  await page.bringToFront();
  const inputField = await page.waitForSelector(selector);
  if (callback) {
    callback(); // 있으면 넣고 없으면 동작 안하도록
  }
  await inputField.type(text);
}

export async function evaluateTextUsingSelector(page, selector) {
  const paragraph = await page.evaluate(() => {
    return document.querySelector(selector).textContent;
  })
  return paragraph;
}

export async function pageNavigationAndBringToFront(page, url) {
  await page.goto(url);
  await page.waitForNavigation();
  await page.bringToFront();
}

export async function checkMessageSynchronized(page, expectedMessageLength, expectedMessages, selectorForSelectorAll) {
  await page.bringToFront();
  await page.waitForFunction((expectedMessageLength, expectedMessages) => {
    const elements = document.querySelectorAll(selectorForSelectorAll);
    if (elements.length < expectedMessageLength) return false;
    for (let i = 0; i < expectedMessageLength; i++) {
      console.log("elements[i].textContent.trim()", elements[i].textContent.trim());
      console.log("expectedMessages[i]", expectedMessages[i])
      if (elements[i].textContent.trim() !== expectedMessages[i]) return false;
    }
    return true;
  }, {}, expectedMessageLength, expectedMessages);

  const actualMessages = await page.evaluate(() => {
    const elements = document.querySelectorAll(selectorForSelectorAll);
    return Array.from(elements).map(el => el.textContent.trim());
  });

  expect(actualMessages).to.deep.equal(expectedMessages)
}