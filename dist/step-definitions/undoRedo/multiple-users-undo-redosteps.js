var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// multiple-users-undo-redo-steps.js
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
let pageC;
Before({ tags: '@multiple-users-undo-redo', timeout: STEP_TIMEOUT }, function () {
    return __awaiter(this, void 0, void 0, function* () {
        browser = yield puppeteer.launch({ headless: ISHEADLESS });
        pageA = yield browser.newPage();
        pageB = yield browser.newPage();
        pageC = yield browser.newPage();
    });
});
After({ tags: '@multiple-users-undo-redo' }, function () {
    return __awaiter(this, void 0, void 0, function* () {
        withErrorHandling(() => clearUpAndDisconnectPage(pageA), "error occured while clearUpAndDisconnectPage at pageA");
        withErrorHandling(() => clearUpAndDisconnectPage(pageB), "error occured while clearUpAndDisconnectPage at pageB");
        withErrorHandling(() => clearUpAndDisconnectPage(pageB), "error occured while clearUpAndDisconnectPage at pageC");
        yield withErrorHandling(() => browser.close(), "Error occured while closing broswer");
    });
});
Given('"User A", "User B", and "User C" have opened the same document in multiple users undo redo steps', { timeout: STEP_TIMEOUT }, function () {
    return __awaiter(this, void 0, void 0, function* () {
        withErrorHandling(() => pageLoadingComplete(pageA, FIRSTDOCUMENT, SELECTION, URL), "opening the pageA has failed");
        withErrorHandling(() => pageLoadingComplete(pageB, FIRSTDOCUMENT, SELECTION, URL), "opening the pageB has failed");
        withErrorHandling(() => pageLoadingComplete(pageC, FIRSTDOCUMENT, SELECTION, URL), "opening the pageC has failed");
    });
});
When('"User A" types {string} in multiple users undo redo steps', function (text) {
    return __awaiter(this, void 0, void 0, function* () {
        withErrorHandling(() => writeText(pageA, SELECTION, text), "writing the text has failed at pageA");
    });
});
When('"User B" types {string} in multiple users undo redo steps', function (text) {
    return __awaiter(this, void 0, void 0, function* () {
        withErrorHandling(() => writeText(pageB, SELECTION, text), "writing the text has failed at pageB");
    });
});
When('"User C" types {string} in multiple users undo redo steps', function (text) {
    return __awaiter(this, void 0, void 0, function* () {
        withErrorHandling(() => writeText(pageB, SELECTION, text), "writing the text has failed at pageC");
    });
});
When('"User A" undoes their changes in multiple users undo redo steps', function () {
    return __awaiter(this, void 0, void 0, function* () {
        withErrorHandling(() => undo(pageA), "exception occur while undo text at pageA");
    });
});
When('"User B" undoes their changes in multiple users undo redo steps', function () {
    return __awaiter(this, void 0, void 0, function* () {
        withErrorHandling(() => undo(pageB), "exception occur while undo text at pageB");
    });
});
When('"User A" redoes their changes in multiple users undo redo steps', function () {
    return __awaiter(this, void 0, void 0, function* () {
        withErrorHandling(() => redo(pageA), "exception occur while redo text at pageA");
    });
});
When('"User B" redoes their changes in multiple users undo redo steps', function () {
    return __awaiter(this, void 0, void 0, function* () {
        withErrorHandling(() => redo(pageB), "exception occur while redo text at pageB");
    });
});
Then('"User C" should see the text after User B redo {string} in multiple users undo redo steps', function (text) {
    return __awaiter(this, void 0, void 0, function* () {
        withErrorHandling(() => checkMessageSynchronized(pageC, [text], PARAGRAPH), "error occured while verifying expect message and acutal message");
    });
});
When('"User C" undo their changes in multiple users undo redo steps', function () {
    return __awaiter(this, void 0, void 0, function* () {
        withErrorHandling(() => undo(pageC), "exception occur while undo text at pageC");
    });
});
Then('"User C" should see the text after User C redo {string} in multiple users undo redo steps', function (text) {
    return __awaiter(this, void 0, void 0, function* () {
        withErrorHandling(() => checkMessageSynchronized(pageC, [text], PARAGRAPH), "error occured while verifying expect message and acutal message");
    });
});
//# sourceMappingURL=multiple-users-undo-redosteps.js.map