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
import { Given, When, Then, Before, After } from "@cucumber/cucumber";
import { LOCALHOST_URL, PASSWORD_INPUT, TYPING_DELAY, URL, USERID_INPUT } from "../constants/common.js";
import puppeteer from 'puppeteer';
let browser;
let page;
Before({ tags: '@login' }, function () {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Starting browser for login tests');
        browser = yield puppeteer.launch({ headless: true });
        page = yield browser.newPage();
    });
});
After({ tags: '@login' }, function () {
    return __awaiter(this, void 0, void 0, function* () {
        yield browser.close();
    });
});
Given('I am on the login page', function () {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Starting browser for login tests');
        yield page.goto(LOCALHOST_URL);
    });
});
When('I enter valid credentials', function () {
    return __awaiter(this, void 0, void 0, function* () {
        yield page.waitForNavigation();
        const userIdInput = yield page.waitForSelector(USERID_INPUT);
        if (!userIdInput)
            return;
        yield userIdInput.type('seunghyun_baek', { delay: TYPING_DELAY });
        const passwordInput = yield page.waitForSelector(PASSWORD_INPUT);
        if (!passwordInput)
            return;
        yield passwordInput.type('qwer1234!@', { delay: TYPING_DELAY });
    });
});
When('I click the login button', function () {
    return __awaiter(this, void 0, void 0, function* () {
        const loginButton = yield page.waitForSelector('#root > div > button');
        if (!loginButton)
            return;
        yield loginButton.click();
    });
});
When('make new Document', function () {
    return __awaiter(this, void 0, void 0, function* () {
        const clickDocxRadioButton = yield page.waitForSelector('#root > div > div > span:nth-child(1)');
        if (!clickDocxRadioButton)
            return;
        yield clickDocxRadioButton.click();
        const createNewDocumentInput = yield page.waitForSelector('#root > div > div > div > input[type=text]');
        if (!createNewDocumentInput)
            return;
        yield createNewDocumentInput.type('공동편집 UI 테스트', { delay: TYPING_DELAY });
        const createButton = yield page.waitForSelector('#root > div > div > div > button');
        if (!createButton)
            return;
        yield createButton.click();
    });
});
Then('I should be redirected to the dashboard', function () {
    return __awaiter(this, void 0, void 0, function* () {
        const expectedURL = URL;
        yield page.waitForSelector('#root', { timeout: 10 * 1000 });
        const currentURL = page.url();
        expect(currentURL).to.equal(expectedURL);
    });
});
//# sourceMappingURL=loginsteps.js.map