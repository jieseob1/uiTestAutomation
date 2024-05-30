var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { expect } from "chai";
export function evaluateTextUsingSelector(page_1, selector_1) {
    return __awaiter(this, arguments, void 0, function* (page, selector, patternToRemove = '') {
        yield page.bringToFront();
        const paragraph = yield page.evaluate((selector) => {
            const documentSelector = document.querySelector(selector);
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
    });
}
export function checkSingleMessageSynchronized(page_1, selector_1, expectText_1) {
    return __awaiter(this, arguments, void 0, function* (page, selector, expectText, patternToRemove = '') {
        const actualText = yield evaluateTextUsingSelector(page, selector, patternToRemove);
        if (actualText) {
            expect(actualText.trim()).to.equal(expectText.trim());
        }
    });
}
export function checkMessageSynchronized(page, expectedMessages, selectorForSelectorAll) {
    return __awaiter(this, void 0, void 0, function* () {
        yield page.bringToFront();
        yield waitForElements(page, expectedMessages, selectorForSelectorAll);
        const actualMessages = yield getElementsText(page, selectorForSelectorAll);
        console.log("actualMessages", actualMessages);
        console.log("expectedMessages", expectedMessages);
        yield checkElementsText(actualMessages, expectedMessages);
    });
}
export function checkMessageUnSynchronized(page, expectedMessages, selectorForSelectorAll) {
    return __awaiter(this, void 0, void 0, function* () {
        yield page.bringToFront();
        yield waitForElements(page, expectedMessages, selectorForSelectorAll);
        const actualMessages = yield getElementsText(page, selectorForSelectorAll);
        yield checkDifferentElementsText(actualMessages, expectedMessages);
    });
}
export function waitForElements(page, expectedMessages, selectorForSelectorAll) {
    return __awaiter(this, void 0, void 0, function* () {
        yield page.waitForFunction((expectedMessages, selectorForSelectorAll) => {
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
        }, {}, expectedMessages, selectorForSelectorAll).catch((error) => {
            if (error.message.includes('waiting for function failed: timeout')) {
                throw new Error('Timeout occurred while waiting for the condition');
            }
            else {
                throw error;
            }
        });
    });
}
export function getElementsText(page, selectorForSelectorAll) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield page.evaluate((selectorForSelectorAll) => {
            const elements = document.querySelectorAll(selectorForSelectorAll);
            return Array.from(elements).map((el) => (el.textContent || "").trim());
        }, selectorForSelectorAll);
    });
}
export function checkElementsText(actualMessages, expectedMessages) {
    return __awaiter(this, void 0, void 0, function* () {
        for (let i = 0; i < expectedMessages.length; i++) {
            expect(actualMessages[i]).to.include(expectedMessages[i].trim());
        }
    });
}
export function checkDifferentElementsText(actualMessages, expectedMessages) {
    return __awaiter(this, void 0, void 0, function* () {
        expect(actualMessages).to.not.deep.equal(expectedMessages.map(msg => msg.trim()));
    });
}
//# sourceMappingURL=textEvaluation.js.map