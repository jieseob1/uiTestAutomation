var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Given, When, Then, Before, After } from "@cucumber/cucumber";
import { FIRSTDOCUMENT, ISHEADLESS, STEP_TIMEOUT, URL } from "../../constants/common.js";
import { PARAGRAPH, SELECTION } from "../../constants/office_docx.js";
import puppeteer from 'puppeteer';
import { clearUpAndDisconnectPage } from "../../utils/clearup.js";
import { writeText } from "../../utils/elementActions.js";
import { pageLoadingComplete } from "../../utils/navigation.js";
import { checkMessageSynchronized } from "../../utils/textEvaluation.js";
import { withErrorHandling } from "../../utils/util.js";
console.log("collaborationsteps.ts 파일 로드됨");
let browser;
let pageA;
let pageB;
console.log("함수");
Before({ tags: '@collaboration' }, function () {
    return __awaiter(this, void 0, void 0, function* () {
        browser = yield puppeteer.launch({ headless: ISHEADLESS });
        pageA = yield browser.newPage();
        pageB = yield browser.newPage();
        console.log("Before 끝나구");
    });
});
After({ tags: '@collaboration' }, function () {
    return __awaiter(this, void 0, void 0, function* () {
        withErrorHandling(() => clearUpAndDisconnectPage(pageA), "error occured while clearUpAndDisconnectPage at pageA");
        withErrorHandling(() => clearUpAndDisconnectPage(pageB), "error occured while clearUpAndDisconnectPage at pageB");
        yield withErrorHandling(() => browser.close(), "Error occured while closing broswer");
        console.log("After 끝나구");
    });
});
Given('{string} and {string} have opened the same document in collaborationsteps', { timeout: STEP_TIMEOUT }, function (userA, userB) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`Given step started with users: ${userA}, ${userB}`);
        yield withErrorHandling(() => pageLoadingComplete(pageA, FIRSTDOCUMENT, SELECTION, URL), "opening the pageA has failed");
        yield withErrorHandling(() => pageLoadingComplete(pageB, FIRSTDOCUMENT, SELECTION, URL), "opening the pageB has failed");
        console.log("Given step completed");
    });
});
When('"User A" types {string} in the first paragraph in collaborationsteps', function (text) {
    return __awaiter(this, void 0, void 0, function* () {
        yield withErrorHandling(() => writeText(pageA, SELECTION, text, () => pageA.keyboard.press('Enter')), "writing the text has failed");
        console.log("When step completed");
    });
});
When('{string} types {string} in the second paragraph in collaborationsteps', function (userB, text) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`When step started with user: ${userB} and text: ${text}`);
        yield withErrorHandling(() => writeText(pageB, SELECTION, text, () => pageA.keyboard.press('Enter')), "writing the text has failed");
        console.log("When step completed");
    });
});
Then('The changes made by both users should be reflected on the screens of {string} and {string} in collaborationsteps', function (userA, userB) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`Then step started with users: ${userA}, ${userB}`);
        const expectedMessages = [
            'Real-time synchronization of changes enables efficient workflow.',
            'Collaborative document editing facilitates seamless communication among team members.'
        ];
        yield withErrorHandling(() => checkMessageSynchronized(pageA, expectedMessages, PARAGRAPH), "error occured while verifying expect message and acutal message");
        yield withErrorHandling(() => checkMessageSynchronized(pageB, expectedMessages, PARAGRAPH), "error occured while verifying expect message and acutal message");
        console.log("Then step completed");
    });
});
//# sourceMappingURL=collaborationsteps.js.map