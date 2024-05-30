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
import { FIRSTDOCUMENT, ISHEADLESS, STEP_TIMEOUT, URL } from '../../../constants/common.js';
import { SELECTION } from '../../../constants/office_docx.js';
import puppeteer from 'puppeteer';
import { clearUpAndDisconnectPage } from '../../../utils/clearup.js';
import { writeText } from '../../../utils/elementActions.js';
import { pageLoadingComplete } from '../../../utils/navigation.js';
import { createTable, getTableCell } from '../../../utils/tableActions.js';
import { checkSingleMessageSynchronized } from '../../../utils/textEvaluation.js';
import { withErrorHandling } from '../../../utils/util.js';
let browser;
let pageA;
let pageB;
let tableRowNum;
let tableColumnNum;
Before({ tags: '@same-table-editing', timeout: STEP_TIMEOUT }, function () {
    return __awaiter(this, void 0, void 0, function* () {
        browser = yield puppeteer.launch({ headless: ISHEADLESS });
        pageA = yield browser.newPage();
        pageB = yield browser.newPage();
    });
});
After({ tags: '@same-table-editing' }, function () {
    return __awaiter(this, void 0, void 0, function* () {
        yield clearUpAndDisconnectPage(pageA);
        yield clearUpAndDisconnectPage(pageB);
        yield browser.close();
    });
});
Given('"User A" and "User B" have opened the same document in same table collaboration steps', { timeout: STEP_TIMEOUT }, function () {
    return __awaiter(this, void 0, void 0, function* () {
        withErrorHandling(() => pageLoadingComplete(pageA, FIRSTDOCUMENT, SELECTION, URL), "opening the same document has failed at pageA");
        withErrorHandling(() => pageLoadingComplete(pageB, FIRSTDOCUMENT, SELECTION, URL), "opening the same document has failed at pageB");
    });
});
When('"User A" creates column {int} row {int} a new table in same table collaboration steps', { timeout: STEP_TIMEOUT }, function (column, row) {
    return __awaiter(this, void 0, void 0, function* () {
        withErrorHandling(() => createTable(pageA, column, row), "error occured while create table");
        tableColumnNum = column;
        tableRowNum = row;
    });
});
When('"User A" selects first cell and write {string} in same table collaboration steps', { timeout: STEP_TIMEOUT }, function (text) {
    return __awaiter(this, void 0, void 0, function* () {
        const cell = yield getTableCell(pageA, tableColumnNum, tableRowNum, 1, 1);
        if (cell) {
            withErrorHandling(() => writeText(pageA, cell, text), "error occured while selecting and write text at first cell");
        }
    });
});
When('"User B" selects second cell in the same table and write {string} in same table collaboration steps', { timeout: STEP_TIMEOUT }, function (text) {
    return __awaiter(this, void 0, void 0, function* () {
        const cell = yield getTableCell(pageB, tableColumnNum, tableRowNum, 1, 2);
        if (cell) {
            withErrorHandling(() => writeText(pageA, cell, text), "error occured while selecting and write text at second cell");
        }
    });
});
Then('The table should be merged correctly with both {string} and {string} in same table collaboration steps', function (textA, textB) {
    return __awaiter(this, void 0, void 0, function* () {
        const userAFirstCell = yield getTableCell(pageA, tableColumnNum, tableRowNum, 1, 1);
        const userASecondCell = yield getTableCell(pageA, tableColumnNum, tableRowNum, 1, 2);
        const userBFirstCell = yield getTableCell(pageB, tableColumnNum, tableRowNum, 1, 1);
        const userBSecondCell = yield getTableCell(pageB, tableColumnNum, tableRowNum, 1, 2);
        if (userAFirstCell) {
            withErrorHandling(() => checkSingleMessageSynchronized(pageA, userAFirstCell, textA, '↵'), "error occured while processing userAFirstCell Text");
        }
        if (userASecondCell) {
            withErrorHandling(() => checkSingleMessageSynchronized(pageA, userASecondCell, textB, '↵'), "error occured while processing userASecondCell Text");
        }
        if (userBFirstCell) {
            withErrorHandling(() => checkSingleMessageSynchronized(pageA, userBFirstCell, textA, '↵'), "error occured while processing userBFirstCell Text");
        }
        if (userBSecondCell) {
            withErrorHandling(() => checkSingleMessageSynchronized(pageA, userBSecondCell, textB, '↵'), "error occured while processing userBSecondCell Text");
        }
    });
});
//# sourceMappingURL=same-table-collaborationsteps.js.map