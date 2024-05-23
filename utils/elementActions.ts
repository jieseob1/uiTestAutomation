import { ElementHandle, NodeFor, Page } from "puppeteer";


export async function clickElement(page: Page, selector: string) { // can use default selector
  const element = await page.waitForSelector(selector);
  if (element) {
    await element.click();
  }
}

export async function clickUsingSelector(page: Page, selector: string): Promise<void> {
  const selectorLink = await page.waitForSelector(selector);
  if (selectorLink) {
    await selectorLink.click();
  }
}

export async function writeText(page: Page, selector: string, textArray: string, callback?: () => void): Promise<void> {
  await page.bringToFront();
  const StringifySelector = String(selector);
  const inputField: ElementHandle<NodeFor<string>> | null = await page.waitForSelector(StringifySelector);
  if (inputField) {
    await inputField.click(); // 포커스 주기
    if (callback) {
      await callback(); // 있으면 넣고 없으면 동작 안하도록
    }
    await inputField.type(textArray, { delay: 70 }); // for prevent lost article
  }
}

export async function evaluateAndClickElement(page: Page, selector: string) {
  await page.waitForSelector(selector);
  await page.evaluate((selector) => {
    const element: HTMLElement | null = document.querySelector(selector); // Element에는 click 메서드 없음
    if (element) {
      element.click();
    }
  }, selector);
}