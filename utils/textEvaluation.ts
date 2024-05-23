import { expect } from "chai";
import { Page } from "puppeteer";

export async function evaluateTextUsingSelector(page: Page, selector: string, patternToRemove: string = '') {
  await page.bringToFront();
  const paragraph = await page.evaluate((selector) => {
    const documentSelector: Element | null = document.querySelector(selector);
    if (documentSelector) {
      return documentSelector.textContent;
    }
  }, selector);

  if (patternToRemove) {
    const regex = new RegExp(patternToRemove, 'g');
    if (paragraph) {
      return paragraph.replace(regex, '');
    }
  }

  return paragraph;
}

export async function checkSingleMessageSynchronized(page: Page, selector: string, expectText: string, patternToRemove: string = '') {
  const actualText = await evaluateTextUsingSelector(page, selector, patternToRemove);
  if (actualText) {
    expect(actualText.trim()).to.equal(expectText.trim());
  }
}

export async function checkMessageSynchronized(page: Page, expectedMessages: string[], selectorForSelectorAll: string) {
  await page.bringToFront();
  await waitForElements(page, expectedMessages, selectorForSelectorAll);
  const actualMessages = await getElementsText(page, selectorForSelectorAll);
  await checkElementsText(actualMessages, expectedMessages);
}

export async function checkMessageUnSynchronized(page: Page, expectedMessages: string[], selectorForSelectorAll: string) {
  await page.bringToFront();
  await waitForElements(page, expectedMessages, selectorForSelectorAll);
  const actualMessages = await getElementsText(page, selectorForSelectorAll);
  await checkDifferentElementsText(actualMessages, expectedMessages);
}

export async function waitForElements(page: Page, expectedMessages: string[], selectorForSelectorAll: string): Promise<void> {
  await page.waitForFunction(
    (expectedMessages, selectorForSelectorAll) => {
      const elements = document.querySelectorAll(selectorForSelectorAll);
      if (elements.length !== expectedMessages.length) {
        console.error('Number of elements does not match expected messages length');
        return 'error'; //
      }
      for (let i = 0; i < expectedMessages.length; i++) {
        const textContent = elements[i].textContent;
        if (!textContent || !textContent.trim().includes(expectedMessages[i])) {
          console.error(`Element at index ${i} does not include expected message: ${expectedMessages[i]}`);
          return 'error';
        }
      }
      return 'success';
    },
    {},
    expectedMessages,
    selectorForSelectorAll
  ).catch((error) => {
    if (error.message.includes('waiting for function failed: timeout')) {
      throw new Error('Timeout occurred while waiting for the condition');
    } else {
      throw error;
    }
  });
}

export async function getElementsText(page: Page, selectorForSelectorAll: string): Promise<string[]> {
  return await page.evaluate(
    (selectorForSelectorAll) => {
      const elements = document.querySelectorAll(selectorForSelectorAll);
      return Array.from(elements).map((el) => (el.textContent || "").trim());
    }, selectorForSelectorAll);
}

export async function checkElementsText(actualMessages: string[], expectedMessages: string[]) {
  for (let i = 0; i < expectedMessages.length; i++) {
    expect(actualMessages[i]).to.include(expectedMessages[i].trim());
  }
}

export async function checkDifferentElementsText(actualMessages: string[], expectedMessages: string[]) {
  expect(actualMessages).to.not.deep.equal(expectedMessages.map(msg => msg.trim()))
}