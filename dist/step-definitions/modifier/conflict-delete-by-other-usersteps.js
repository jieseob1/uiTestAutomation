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
import puppeteer from 'puppeteer';
import { FIRSTDOCUMENT, ISHEADLESS, STEP_TIMEOUT, URL } from '../../constants/common.js';
import { withErrorHandling } from '../../utils/util.js';
import { clearUpAndDisconnectPage } from '../../utils/clearup.js';
import { PARAGRAPH, SELECTION } from '../../constants/office_docx.js';
import { deleteText, writeText } from '../../utils/elementActions.js';
import { pageLoadingComplete } from '../../utils/navigation.js';
import { checkMessageSynchronized } from '../../utils/textEvaluation.js';
let browser;
let pageA;
let pageB;
Before({ tags: '@conflict-delete-by-other-user', timeout: STEP_TIMEOUT }, function () {
    return __awaiter(this, void 0, void 0, function* () {
        browser = yield puppeteer.launch({ headless: ISHEADLESS });
        pageA = yield browser.newPage();
        pageB = yield browser.newPage();
    });
});
After({ tags: '@conflict-delete-by-other-user' }, function () {
    return __awaiter(this, void 0, void 0, function* () {
        yield withErrorHandling(() => clearUpAndDisconnectPage(pageA), "Error occurred while clearing up and disconnecting pageA");
        yield withErrorHandling(() => clearUpAndDisconnectPage(pageB), "Error occurred while clearing up and disconnecting pageB");
        yield withErrorHandling(() => browser.close(), "Error occurred while closing browser");
    });
});
Given('"User A" and "User B" have opened the same document in conflict delete by other user steps', { timeout: STEP_TIMEOUT }, function () {
    return __awaiter(this, void 0, void 0, function* () {
        yield withErrorHandling(() => pageLoadingComplete(pageA, FIRSTDOCUMENT, SELECTION, URL), "Opening pageA has failed");
        yield withErrorHandling(() => pageLoadingComplete(pageB, FIRSTDOCUMENT, SELECTION, URL), "Opening pageB has failed");
    });
});
When('"User A" writes {string} in conflict delete by other user steps', function (text) {
    return __awaiter(this, void 0, void 0, function* () {
        yield withErrorHandling(() => writeText(pageA, SELECTION, text), "Writing the text has failed");
    });
});
When('"User B" deletes the word {string} in the sentence {string} in conflict delete by other user steps', function (targetWord, sentence) {
    return __awaiter(this, void 0, void 0, function* () {
        yield withErrorHandling(() => deleteText(pageB, sentence, targetWord, PARAGRAPH), "deleting the text has failed");
    });
});
Then('Both "User A" and "User B" should see the document content as {string} in conflict delete by other user steps', function (expectedText) {
    return __awaiter(this, void 0, void 0, function* () {
        yield checkMessageSynchronized(pageA, [expectedText], PARAGRAPH);
        yield checkMessageSynchronized(pageB, [expectedText], PARAGRAPH);
    });
});
//# sourceMappingURL=conflict-delete-by-other-usersteps.js.map