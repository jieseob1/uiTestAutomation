var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { TYPING_DELAY } from "../constants/common.js";
import './customConsole.js';
// https://jungpaeng.tistory.com/86
export function clickElement(page, selector) {
    return __awaiter(this, void 0, void 0, function* () {
        const element = yield page.waitForSelector(selector);
        if (element) {
            yield element.click();
        }
    });
}
export function clickUsingSelector(page, selector) {
    return __awaiter(this, void 0, void 0, function* () {
        const selectorLink = yield page.waitForSelector(selector);
        if (selectorLink) {
            yield selectorLink.click();
        }
    });
}
export function writeText(page, selector, textArray, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        yield page.bringToFront();
        const StringifySelector = String(selector);
        const inputField = yield page.waitForSelector(StringifySelector);
        if (inputField) {
            yield inputField.click(); // 포커스 주기
            if (callback) {
                yield callback(); // 있으면 넣고 없으면 동작 안하도록
            }
            yield inputField.type(textArray, { delay: TYPING_DELAY }); // for prevent lost article
        }
    });
}
export function replaceText(page, sentence, targetWord, newWord, selector) {
    return __awaiter(this, void 0, void 0, function* () {
        yield page.bringToFront();
        // 지정된 셀렉터 내의 텍스트를 가져옴
        const elementHandle = yield page.waitForSelector(selector);
        if (!elementHandle) {
            return 'error';
        }
        const textContent = yield elementHandle.evaluate(el => el.textContent);
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
        const success = yield elementHandle.evaluate((el, start, end, newText) => {
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
            }
            else {
                return 'error';
            }
        }, startIndex, endIndex, newWord);
        return 'success';
    });
}
export function moveSpecificPosition(page, selector, targetWord) {
    return __awaiter(this, void 0, void 0, function* () {
        page.bringToFront();
        const elementHandle = yield page.waitForSelector(selector);
        if (!elementHandle) {
            throw new Error(`Element with selector "${selector}" not found.`);
        }
        yield elementHandle.evaluate((el, targetWord) => {
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
    });
}
export function deleteText(page, sentence, targetWord, selector) {
    return __awaiter(this, void 0, void 0, function* () {
        yield page.bringToFront();
        const element = yield page.waitForSelector(selector);
        if (!element) {
            throw new Error(`Element with selector "${selector}" not found.`);
        }
        const textContent = yield element.evaluate(el => el.textContent);
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
        yield element.evaluate((el, start, end) => {
            const textNode = el.firstChild;
            if (!textNode || textNode.nodeType !== Node.TEXT_NODE) {
                throw new Error('Text node not found.');
            }
            const range = document.createRange();
            const selection = window.getSelection();
            range.setStart(textNode, start);
            range.setEnd(textNode, end);
            if (selection) {
                console.log("셀렉션 내부");
                selection.removeAllRanges();
                selection.addRange(range);
                range.deleteContents();
            }
            else {
                throw new Error('Selection not supported.');
            }
        }, startIndex, endIndex);
    });
}
export function evaluateAndClickElement(page, selector) {
    return __awaiter(this, void 0, void 0, function* () {
        yield page.waitForSelector(selector);
        yield page.evaluate((selector) => {
            const element = document.querySelector(selector); // Element에는 click 메서드 없음
            if (element) {
                element.click();
            }
        }, selector);
    });
}
//# sourceMappingURL=elementActions.js.map