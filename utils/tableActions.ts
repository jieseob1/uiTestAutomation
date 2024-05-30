import { Page } from "puppeteer";
import { evaluateAndClickElement } from "./elementActions.js";
import { INSERT_BUTTON, INSERT_TABLE_COLUMN_INPUT, INSERT_TABLE_CONFIRM_BUTTON, INSERT_TABLE_GROUP, INSERT_TABLE_MENU, INSERT_TABLE_ROW_INPUT } from "../constants/office_docx.js";

export async function createTable(page: Page, columnNumber: number, rowNumber: number) {
  page.bringToFront();
  evaluateAndClickElement(page, INSERT_BUTTON)
  evaluateAndClickElement(page, INSERT_TABLE_GROUP)
  evaluateAndClickElement(page, INSERT_TABLE_MENU)

  const columnInputField = await page.waitForSelector(INSERT_TABLE_COLUMN_INPUT);
  if (columnInputField) {
    await columnInputField.click(); // 포커스 주기
    (await page).keyboard.press('Backspace');
    await columnInputField.type(String(columnNumber), { delay: 70 }); // 숫자로 넘겨주면 문제가 생김
  }

  const rowInputField = await page.waitForSelector(INSERT_TABLE_ROW_INPUT);
  if (rowInputField) {
    await rowInputField.click(); // 포커스 주기
    (await page).keyboard.press('Backspace');
    await rowInputField.type(String(rowNumber), { delay: 70 }); // for prevent lost article
  }

  const confirmButton = await page.waitForSelector(INSERT_TABLE_CONFIRM_BUTTON);
  if (confirmButton) {
    await confirmButton.click();
  }
}

export async function getTableCell(page: Page, column: number, row: number, selectRow: number, selectColumn: number) { //1행 1열, 2행 1열
  page.bringToFront();
  try {
    const selector = `.pk-office-d-table-cell:nth-child(${column * (selectRow - 1) + selectColumn})`;
    return selector;
  } catch (e) {
    console.error("exception occured while selecting cell in getTableCell Method", e);
  }
}