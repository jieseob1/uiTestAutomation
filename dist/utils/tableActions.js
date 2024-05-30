var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { evaluateAndClickElement } from "./elementActions.js";
import { INSERT_BUTTON, INSERT_TABLE_COLUMN_INPUT, INSERT_TABLE_CONFIRM_BUTTON, INSERT_TABLE_GROUP, INSERT_TABLE_MENU, INSERT_TABLE_ROW_INPUT } from "../constants/office_docx.js";
export function createTable(page, columnNumber, rowNumber) {
    return __awaiter(this, void 0, void 0, function* () {
        page.bringToFront();
        evaluateAndClickElement(page, INSERT_BUTTON);
        evaluateAndClickElement(page, INSERT_TABLE_GROUP);
        evaluateAndClickElement(page, INSERT_TABLE_MENU);
        const columnInputField = yield page.waitForSelector(INSERT_TABLE_COLUMN_INPUT);
        if (columnInputField) {
            yield columnInputField.click(); // 포커스 주기
            (yield page).keyboard.press('Backspace');
            yield columnInputField.type(String(columnNumber), { delay: 70 }); // 숫자로 넘겨주면 문제가 생김
        }
        const rowInputField = yield page.waitForSelector(INSERT_TABLE_ROW_INPUT);
        if (rowInputField) {
            yield rowInputField.click(); // 포커스 주기
            (yield page).keyboard.press('Backspace');
            yield rowInputField.type(String(rowNumber), { delay: 70 }); // for prevent lost article
        }
        const confirmButton = yield page.waitForSelector(INSERT_TABLE_CONFIRM_BUTTON);
        if (confirmButton) {
            yield confirmButton.click();
        }
    });
}
export function getTableCell(page, column, row, selectRow, selectColumn) {
    return __awaiter(this, void 0, void 0, function* () {
        page.bringToFront();
        try {
            const selector = `.pk-office-d-table-cell:nth-child(${column * (selectRow - 1) + selectColumn})`;
            return selector;
        }
        catch (e) {
            console.error("exception occured while selecting cell in getTableCell Method", e);
        }
    });
}
//# sourceMappingURL=tableActions.js.map