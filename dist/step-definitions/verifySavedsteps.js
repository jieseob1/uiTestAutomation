var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import puppeteer from 'puppeteer';
import { Given, When, Then, Before, After } from "@cucumber/cucumber";
import { clearUpAndDisconnectPage } from '../utils/clearup.js';
import { FIRSTDOCUMENT, ISHEADLESS, URL } from '../constants/common.js';
import { DISCONNECT_BUTTON, PARAGRAPH, SELECTION } from '../constants/office_docx.js';
import { withErrorHandling } from '../utils/util.js';
import { pageLoadingComplete, pageNavigationAndBringToFront } from '../utils/navigation.js';
import { clickElement, writeText } from '../utils/elementActions.js';
import { checkMessageSynchronized } from '../utils/textEvaluation.js';
let browser;
let page;
Before({ tags: '@verify-saved' }, function () {
    return __awaiter(this, void 0, void 0, function* () {
        browser = yield puppeteer.launch({ headless: ISHEADLESS });
        page = yield browser.newPage();
    });
});
After({ tags: '@verify-saved' }, function () {
    return __awaiter(this, void 0, void 0, function* () {
        withErrorHandling(() => clearUpAndDisconnectPage(page), "error occured while clearUpAndDisconnectPage at page");
        yield withErrorHandling(() => browser.close(), "Error occured while closing broswer");
    });
});
Given('I am on the document page', function () {
    return __awaiter(this, void 0, void 0, function* () {
        yield pageNavigationAndBringToFront(page, URL);
    });
});
When('I enter the document', function () {
    return __awaiter(this, void 0, void 0, function* () {
        withErrorHandling(() => pageLoadingComplete(page, FIRSTDOCUMENT, SELECTION, URL), "opening the pageA has failed");
    });
});
When('I write a message {string}', function (message) {
    return __awaiter(this, void 0, void 0, function* () {
        withErrorHandling(() => writeText(page, SELECTION, message), "writing the text has failed");
    });
});
When('I exit the document', function () {
    return __awaiter(this, void 0, void 0, function* () {
        withErrorHandling(() => clickElement(page, DISCONNECT_BUTTON), "error occured while disconnecting");
    });
});
When('I enter the document again', function () {
    return __awaiter(this, void 0, void 0, function* () {
        withErrorHandling(() => pageLoadingComplete(page, FIRSTDOCUMENT, SELECTION, URL), "opening the pageA has failed");
    });
});
Then('I should see the message {string}', function (text) {
    return __awaiter(this, void 0, void 0, function* () {
        const expectedMessages = [text];
        withErrorHandling(() => checkMessageSynchronized(page, expectedMessages, PARAGRAPH), "error occured while verifying text");
    });
});
//# sourceMappingURL=verifySavedsteps.js.map