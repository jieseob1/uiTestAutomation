var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// multiple-undo-redo-steps.js
import { Given, When, Then, Before, After } from '@cucumber/cucumber';
import { FIRSTDOCUMENT, ISHEADLESS, URL } from '../../constants/common.js';
import { PARAGRAPH, SELECTION } from '../../constants/office_docx.js';
import puppeteer from 'puppeteer';
import { clearUpAndDisconnectPage } from '../../utils/clearup.js';
import { writeText } from '../../utils/elementActions.js';
import { redo, undo } from '../../utils/keyboardActions.js';
import { pageLoadingComplete } from '../../utils/navigation.js';
import { checkSingleMessageSynchronized } from '../../utils/textEvaluation.js';
import { withErrorHandling } from '../../utils/util.js';
let browser;
let pageA;
let pageB;
Before({ tags: '@multiple-undo-redo' }, function () {
    return __awaiter(this, void 0, void 0, function* () {
        browser = yield puppeteer.launch({ headless: ISHEADLESS });
        pageA = yield browser.newPage();
        pageB = yield browser.newPage();
    });
});
After({ tags: '@multiple-undo-redo' }, function () {
    return __awaiter(this, void 0, void 0, function* () {
        withErrorHandling(() => clearUpAndDisconnectPage(pageA), "error occured while clearUpAndDisconnectPage at pageA");
        withErrorHandling(() => clearUpAndDisconnectPage(pageB), "error occured while clearUpAndDisconnectPage at pageB");
        yield withErrorHandling(() => browser.close(), "Error occured while closing broswer");
    });
});
Given('"User A" and "User B" have opened the same document in multiple undo redo steps', function () {
    return __awaiter(this, void 0, void 0, function* () {
        withErrorHandling(() => pageLoadingComplete(pageA, FIRSTDOCUMENT, SELECTION, URL), "opening the pageA has failed");
        withErrorHandling(() => pageLoadingComplete(pageB, FIRSTDOCUMENT, SELECTION, URL), "opening the pageB has failed");
    });
});
When('"User A" types {string} in multiple undo redo steps', function (text) {
    return __awaiter(this, void 0, void 0, function* () {
        withErrorHandling(() => writeText(pageA, SELECTION, text), "writing the text has failed");
    });
});
When('"User A" undoes their changes twice in multiple undo redo steps', function () {
    return __awaiter(this, void 0, void 0, function* () {
        yield undo(pageA);
        yield undo(pageA);
    });
});
When('"User A" redoes their changes twice in multiple undo redo steps', function () {
    return __awaiter(this, void 0, void 0, function* () {
        yield redo(pageA);
        yield redo(pageA);
    });
});
Then('"User B" should see the text {string} in multiple undo redo steps', function (expectedText) {
    return __awaiter(this, void 0, void 0, function* () {
        yield checkSingleMessageSynchronized(pageB, PARAGRAPH, expectedText);
    });
});
//# sourceMappingURL=multiple-undo-redosteps.js.map