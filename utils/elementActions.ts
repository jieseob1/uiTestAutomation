import { TYPING_DELAY } from "../constants/common.js";
import { ElementHandle, NodeFor, Page } from "puppeteer";
import './customConsole.js'
// https://jungpaeng.tistory.com/86

export async function clickElement(page: Page, selector: string) {
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
    await inputField.type(textArray, { delay: TYPING_DELAY }); // for prevent lost article
  }
}

export async function replaceText(page: Page, sentence: string, targetWord: string, newWord: string, selector: string): Promise<string> {
  await page.bringToFront();

  // 지정된 셀렉터 내의 텍스트를 가져옴
  const elementHandle: ElementHandle | null = await page.waitForSelector(selector);
  if (!elementHandle) {
    return 'error';
  }

  const textContent = await elementHandle.evaluate(el => el.textContent);
  if (!textContent) {
    return 'error';
  }

  const sentenceIndex = textContent.indexOf(sentence);
  if (sentenceIndex === -1) {
    return 'error';
  }

  const startIndex = sentenceIndex + sentence.indexOf(targetWord);
  const endIndex = startIndex + targetWord.length;

  if (startIndex === -1 || endIndex === -1) {
    return 'error';
  }

  // 텍스트를 선택하고 삭제 후 새 텍스트 입력
  const success = await elementHandle.evaluate((el, start, end, newText) => {
    const range = document.createRange();
    const selection = window.getSelection();
    const textNode = el.firstChild;

    if (!textNode) {
      return 'error';
    }

    // 텍스트 노드를 기준으로 범위 설정
    range.setStart(textNode, start);
    range.setEnd(textNode, end);

    // 선택 영역을 지정
    if (selection) {
      selection.removeAllRanges();
      selection.addRange(range);

      // 선택된 텍스트 삭제
      range.deleteContents();

      // 새로운 텍스트 입력
      const textNodeNew = document.createTextNode(newText);
      range.insertNode(textNodeNew);

      // 커서를 텍스트 뒤로 이동
      range.setStartAfter(textNodeNew);
      range.setEndAfter(textNodeNew);
      selection.removeAllRanges();
      selection.addRange(range);

      return 'success';
    } else {
      return 'error';
    }
  }, startIndex, endIndex, newWord);

  return 'success';
}

export async function moveSpecificPosition(page: Page, selector: string, targetWord: string): Promise<void> {
  page.bringToFront();
  const elementHandle: ElementHandle | null = await page.waitForSelector(selector);
  if (!elementHandle) {
    throw new Error(`Element with selector "${selector}" not found.`);
  }

  await elementHandle.evaluate((el, targetWord) => {
    const textContent = el.textContent;
    if (!textContent) {
      throw new Error(`Text content not found in element with selector "${selector}".`);
    }

    const wordStartIndex = textContent.indexOf(targetWord);
    if (wordStartIndex === -1) {
      throw new Error(`Target word "${targetWord}" not found in the text content.`);
    }

    const wordEndIndex = wordStartIndex + targetWord.length;
    const range = document.createRange();
    const selection = window.getSelection();
    const textNode = el.firstChild;

    if (!textNode) {
      throw new Error('Text node not found.');
    }

    range.setStart(textNode, wordEndIndex);
    range.setEnd(textNode, wordEndIndex);

    if (selection) {
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }, targetWord);
}




export async function deleteText(page: Page, sentence: string, targetWord: string, selector: string): Promise<void> {
  await page.bringToFront();

  const element: ElementHandle | null = await page.waitForSelector(selector);
  if (!element) {
    throw new Error(`Element with selector "${selector}" not found.`);
  }

  const textContent = await element.evaluate(el => el.textContent);
  if (!textContent) {
    throw new Error(`Text content not found in element with selector "${selector}".`);
  }

  const sentenceIndex = textContent.indexOf(sentence);
  if (sentenceIndex === -1) {
    throw new Error(`Sentence "${sentence}" not found in the text content.`);
  }

  const startIndex = sentenceIndex + sentence.indexOf(targetWord);
  const endIndex = startIndex + targetWord.length;

  if (sentence.indexOf(targetWord) === -1) {
    throw new Error(`Target word "${targetWord}" not found in the sentence.`);
  }

  await element.evaluate((el, start, end) => {
    const textNode = el.firstChild;
    if (!textNode || textNode.nodeType !== Node.TEXT_NODE) {
      throw new Error('Text node not found.');
    }

    const range = document.createRange();
    const selection = window.getSelection();

    range.setStart(textNode, start);
    range.setEnd(textNode, end);

    if (selection) {
      console.log("셀렉션 내부")
      selection.removeAllRanges();
      selection.addRange(range);
      range.deleteContents();
    } else {
      throw new Error('Selection not supported.');
    }
  }, startIndex, endIndex);
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