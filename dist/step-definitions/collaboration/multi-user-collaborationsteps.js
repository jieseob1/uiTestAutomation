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
import { FIRSTDOCUMENT, ISHEADLESS, STEP_TIMEOUT, URL } from '../../constants/common.js';
import { PARAGRAPH, SELECTION } from '../../constants/office_docx.js';
import puppeteer from 'puppeteer';
import { clearUpAndDisconnectPage } from '../../utils/clearup.js';
import { writeText } from '../../utils/elementActions.js';
import { pageLoadingComplete } from '../../utils/navigation.js';
import { checkMessageSynchronized } from '../../utils/textEvaluation.js';
import { withErrorHandling } from '../../utils/util.js';
let browsers = {};
let users = [];
let pages = {};
const paragraphs = [
    'First paragraph edited by User A',
    'Second paragraph edited by User B',
    'Third paragraph edited by User C',
    'Fourth paragraph edited by User D',
    'Fifth paragraph edited by User E',
];
Given('the following users Enter the DoucmentList:', { timeout: STEP_TIMEOUT }, function (dataTable) {
    return __awaiter(this, void 0, void 0, function* () {
        const userEntries = dataTable.hashes();
        users = userEntries.map(entry => entry.User);
        console.log("users:", users); // 사용자 목록 확인
        yield Promise.all(users.map((user) => __awaiter(this, void 0, void 0, function* () {
            const browser = yield puppeteer.launch({ headless: ISHEADLESS });
            const page = yield browser.newPage();
            browsers[user] = browser;
            pages[user] = page;
            yield page.goto(URL);
            yield page.bringToFront();
        })));
    });
});
Before({ tags: '@multi-user' }, function () {
    return __awaiter(this, void 0, void 0, function* () {
        // Given 단계에서 처리
    });
});
After({ tags: '@multi-user', timeout: STEP_TIMEOUT }, function () {
    return __awaiter(this, void 0, void 0, function* () {
        yield Promise.all(Object.entries(pages).map(([user, page]) => withErrorHandling(() => __awaiter(this, void 0, void 0, function* () { return clearUpAndDisconnectPage(page); }), `error occurred while clearing up and disconnecting page for ${user}`)));
        yield Promise.all(Object.entries(browsers).map(([user, browser]) => withErrorHandling(() => __awaiter(this, void 0, void 0, function* () { return browser.close(); }), `error occurred while closing browser for ${user}`)));
    });
});
When('each user enters the document at {int}-second intervals and edits a different paragraph', { timeout: 50 * 1000 }, function (interval) {
    return __awaiter(this, void 0, void 0, function* () {
        for (let i = 0; i < users.length; i++) {
            const user = users[i];
            console.log("user:", user); // 현재 사용자 확인
            const page = pages[user];
            console.log("page:", page);
            yield withErrorHandling(() => pageLoadingComplete(page, FIRSTDOCUMENT, SELECTION, URL), "page loading failed");
            yield withErrorHandling(() => writeText(page, SELECTION, paragraphs[i], () => page.keyboard.press('Enter')), "failed");
        }
    });
});
Then('all users should see the same screen with the changes made by each user', { timeout: STEP_TIMEOUT }, function () {
    return __awaiter(this, void 0, void 0, function* () {
        yield Promise.all(users.map(user => withErrorHandling(() => __awaiter(this, void 0, void 0, function* () { return checkMessageSynchronized(pages[user], paragraphs, PARAGRAPH); }), `error occurred while checking synchronization for ${user}`)));
    });
});
//# sourceMappingURL=multi-user-collaborationsteps.js.map