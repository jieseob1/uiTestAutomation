var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Given, When, Then, After, Before } from '@cucumber/cucumber';
import { FIRSTDOCUMENT, ISHEADLESS, STEP_TIMEOUT, URL } from '../../constants/common.js';
import { PARAGRAPH, SELECTION } from '../../constants/office_docx.js';
import puppeteer from 'puppeteer';
import { clearUpAndDisconnectPage } from '../../utils/clearup.js';
import { writeText } from '../../utils/elementActions.js';
import { redo, undo } from '../../utils/keyboardActions.js';
import { pageLoadingComplete } from '../../utils/navigation.js';
import { checkMessageSynchronized } from '../../utils/textEvaluation.js';
import { withErrorHandling } from '../../utils/util.js';
let browser;
let pageA;
let pageB;
Before({ tags: '@simple-undo-redo', timeout: STEP_TIMEOUT }, function () {
    return __awaiter(this, void 0, void 0, function* () {
        browser = yield puppeteer.launch({ headless: ISHEADLESS });
        pageA = yield browser.newPage();
        pageB = yield browser.newPage();
        // await pageA.setDefaultNavigationTimeout(0);
        // await pageB.setDefaultNavigationTimeout(0); // 탭의 시간 초과 정의 => 무제한
    });
});
After({ tags: '@simple-undo-redo' }, function () {
    return __awaiter(this, void 0, void 0, function* () {
        withErrorHandling(() => clearUpAndDisconnectPage(pageA), "error occured while clearUpAndDisconnectPage at pageA");
        withErrorHandling(() => clearUpAndDisconnectPage(pageB), "error occured while clearUpAndDisconnectPage at pageB");
        yield withErrorHandling(() => browser.close(), "Error occured while closing broswer");
    });
});
Given('"User A" and "User B" have opened the same document in simple undo redo steps', { timeout: STEP_TIMEOUT }, function () {
    return __awaiter(this, void 0, void 0, function* () {
        withErrorHandling(() => pageLoadingComplete(pageA, FIRSTDOCUMENT, SELECTION, URL), "opening the pageA has failed");
        withErrorHandling(() => pageLoadingComplete(pageB, FIRSTDOCUMENT, SELECTION, URL), "opening the pageB has failed");
    });
});
When('"User A" types {string} in simple undo redo steps', function (text) {
    return __awaiter(this, void 0, void 0, function* () {
        withErrorHandling(() => writeText(pageA, SELECTION, text), "writing the text has failed at pageA");
    });
});
When('"User B" sees the {string} made by "User A" in simple undo redo steps', function (text) {
    return __awaiter(this, void 0, void 0, function* () {
        withErrorHandling(() => checkMessageSynchronized(pageB, [text], PARAGRAPH), "error occured while verifying expect message and acutal message");
    });
});
When('"User A" undo their changes in simple undo redo steps', function () {
    return __awaiter(this, void 0, void 0, function* () {
        withErrorHandling(() => undo(pageA), "exception occur while undo text at pageA");
    });
});
Then('"User B" text should different with {string} in simple undo redo steps', { timeout: STEP_TIMEOUT }, function (text) {
    return __awaiter(this, void 0, void 0, function* () {
        withErrorHandling(() => checkMessageSynchronized(pageB, [text], PARAGRAPH), "error occured while verifying expect message and acutal message");
    });
});
When('"User A" redo their changes in simple undo redo steps', function () {
    return __awaiter(this, void 0, void 0, function* () {
        withErrorHandling(() => redo(pageA), "exception occur while redo text at pageA");
    });
});
Then('"User B" should see the text {string} in simple undo redo steps', { timeout: STEP_TIMEOUT }, function (text) {
    return __awaiter(this, void 0, void 0, function* () {
        withErrorHandling(() => checkMessageSynchronized(pageB, [text], PARAGRAPH), "error occured while verifying expect message and acutal message");
    });
});
//# sourceMappingURL=simple-undo-redosteps.js.map