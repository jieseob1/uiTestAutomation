var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { After, Before, Given, Then, When } from "@cucumber/cucumber";
import { FIRSTDOCUMENT, ISHEADLESS, STEP_TIMEOUT, URL } from "../../constants/common.js";
import { PARAGRAPH, SELECTION } from "../../constants/office_docx.js";
import puppeteer from "puppeteer";
import { clearUp, clearUpAndDisconnectPage } from "../../utils/clearup.js";
import { moveSpecificPosition, replaceText, writeText } from "../../utils/elementActions.js";
import { pageLoadingComplete } from "../../utils/navigation.js";
import { checkMessageSynchronized } from "../../utils/textEvaluation.js";
import { withErrorHandling } from "../../utils/util.js";
let browserA;
let browserB;
let pageA;
let pageB;
let targetSentence;
Before({ tags: '@conflict-real-time-same-position', timeout: STEP_TIMEOUT }, function () {
    return __awaiter(this, void 0, void 0, function* () {
        browserA = yield puppeteer.launch({ headless: ISHEADLESS });
        browserB = yield puppeteer.launch({ headless: ISHEADLESS });
        pageA = yield browserA.newPage();
        pageB = yield browserB.newPage();
    });
});
After({ tags: '@conflict-real-time-same-position' }, function () {
    return __awaiter(this, void 0, void 0, function* () {
        withErrorHandling(() => clearUpAndDisconnectPage(pageA), "error occured while clearUpAndDisconnectPage at pageA");
        withErrorHandling(() => clearUpAndDisconnectPage(pageB), "error occured while clearUpAndDisconnectPage at pageB");
        yield withErrorHandling(() => browserA.close(), "Error occured while closing broswerA");
        yield withErrorHandling(() => browserB.close(), "Error occured while closing broswerB");
    });
});
Given('"User A" and "User B" have opened the same document in conflict real time same position', { timeout: STEP_TIMEOUT }, function () {
    return __awaiter(this, void 0, void 0, function* () {
        yield withErrorHandling(() => pageLoadingComplete(pageA, FIRSTDOCUMENT, SELECTION, URL), "opening the pageA has failed");
        yield withErrorHandling(() => clearUp(pageA), "error occured while cleaning at pageA"); // 이부분은 추가해주는게 좋을듯
        yield withErrorHandling(() => pageLoadingComplete(pageB, FIRSTDOCUMENT, SELECTION, URL), "opening the pageB has failed");
    });
});
When('"User A" writes {string}', { timeout: STEP_TIMEOUT }, function (text) {
    return __awaiter(this, void 0, void 0, function* () {
        targetSentence = text;
        yield withErrorHandling(() => writeText(pageA, SELECTION, text), "writing the text has failed");
    });
});
When('both users simultaneously select {string} and changes it to {string} and {string} in conflict real time same position', { timeout: STEP_TIMEOUT }, function (oldWord, userANewWord, userBNewWord) {
    return __awaiter(this, void 0, void 0, function* () {
        yield Promise.all([
            withErrorHandling(() => __awaiter(this, void 0, void 0, function* () {
                const successA = yield replaceText(pageA, targetSentence, oldWord, userANewWord, PARAGRAPH);
                if (!successA) {
                    moveSpecificPosition(pageB, PARAGRAPH, userBNewWord);
                    writeText(pageA, PARAGRAPH, userANewWord);
                }
            }), "error occurred while replacing userA word"),
            withErrorHandling(() => __awaiter(this, void 0, void 0, function* () {
                const successB = yield replaceText(pageB, targetSentence, oldWord, userBNewWord, PARAGRAPH);
                if (!successB) {
                    moveSpecificPosition(pageB, PARAGRAPH, userANewWord);
                    writeText(pageB, PARAGRAPH, userBNewWord);
                }
            }), "error occurred while replacing userB word")
        ]);
    });
});
Then('The document should display {string} at {string} and {string} in conflict real time same position', function (expectSentence, userA, userB) {
    return __awaiter(this, void 0, void 0, function* () {
        yield checkMessageSynchronized(pageA, [expectSentence], PARAGRAPH);
        yield checkMessageSynchronized(pageB, [expectSentence], PARAGRAPH);
    });
});
//# sourceMappingURL=conflict-real-time-same-positionsteps.js.map