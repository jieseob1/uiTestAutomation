import { DISCONNECT_BUTTON } from "constants/office_docx.js";
import { clickElement } from "./elementActions.js";
import { Page } from "puppeteer";

export async function clearUp(page: Page) {
  await page.bringToFront();
  await page.keyboard.down('Control');
  await page.keyboard.press('A');
  await page.keyboard.up('Control');
  await page.keyboard.press('Backspace');
}

export async function clearUpAndDisconnectPage(page: Page) {
  await page.bringToFront();
  await clearUp(page);
  await clickElement(page, DISCONNECT_BUTTON);
}