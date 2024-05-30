var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Given, When, Then, Before, After } from '@cucumber/cucumber';
import puppeteer from 'puppeteer';
import { FIRSTDOCUMENT, ISHEADLESS, URL } from '../../constants/common.js';
import { clearUpAndDisconnectPage } from '../../utils/clearup.js';
import { pageLoadingComplete } from '../../utils/navigation.js';
import { PARAGRAPH, SELECTION } from '../../constants/office_docx.js';
import { writeText } from '../../utils/elementActions.js';
import { checkMessageSynchronized } from '../../utils/textEvaluation.js';
import { withErrorHandling } from '../../utils/util.js';
let browser;
let pageA;
let pageB;
Before({ tags: '@real-time' }, function () {
    return __awaiter(this, void 0, void 0, function* () {
        browser = yield puppeteer.launch({ headless: ISHEADLESS });
        pageA = yield browser.newPage();
        pageB = yield browser.newPage();
    });
});
After({ tags: '@real-time' }, function () {
    return __awaiter(this, void 0, void 0, function* () {
        withErrorHandling(() => clearUpAndDisconnectPage(pageA), "error occured while clearUpAndDisconnectPage at pageA");
        withErrorHandling(() => clearUpAndDisconnectPage(pageB), "error occured while clearUpAndDisconnectPage at pageB");
        yield withErrorHandling(() => browser.close(), "Error occured while closing broswer");
    });
});
Given('"User A" and "User B" has opened a document', function () {
    return __awaiter(this, void 0, void 0, function* () {
        withErrorHandling(() => pageLoadingComplete(pageA, FIRSTDOCUMENT, SELECTION, URL), "opening the pageA has failed");
        withErrorHandling(() => pageLoadingComplete(pageB, FIRSTDOCUMENT, SELECTION, URL), "opening the pageB has failed");
    });
});
When('"User A" types {string} in the first paragraph', function (text) {
    return __awaiter(this, void 0, void 0, function* () {
        withErrorHandling(() => writeText(pageA, SELECTION, text), "writing the text has failed");
    });
});
Then('"User B" should see the {string} made by "User A" in real-time', function (text) {
    return __awaiter(this, void 0, void 0, function* () {
        // pageB.bringToFront();
        // await clickUsingSelector(pageB, FIRSTDOCUMENT); // 문서 진입
        const expectedMessages = [text];
        withErrorHandling(() => checkMessageSynchronized(pageA, expectedMessages, PARAGRAPH), "error occured while verifying expect message and acutal message");
        withErrorHandling(() => checkMessageSynchronized(pageB, expectedMessages, PARAGRAPH), "error occured while verifying expect message and acutal message");
    });
});
//# sourceMappingURL=real-time-collaborationsteps.js.map