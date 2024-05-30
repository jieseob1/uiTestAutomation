import { DISCONNECT_BUTTON, TABLE_WRAPPER } from "../constants/office_docx.js";
import { clickElement } from "./elementActions.js";
import { Page } from "puppeteer";
import { getCoordinateUsingSelector } from "./util.js";

export async function clearUp(page: Page) {
  await page.bringToFront();
  await page.keyboard.down('Control');
  await page.keyboard.press('A');
  await page.keyboard.up('Control');
  await page.keyboard.press('Backspace');
  // await tableClearUp(page);
}

export async function tableClearUp(page: Page) {
  // await getCoordinateUsingSelector(page, TABLE_WRAPPER)
  // page.keyboard.press('Backspace');
  //테이블 지우는 방법을 몰라서 모듈팀 추가 구현 요청
}
export async function clearUpAndDisconnectPage(page: Page) {
  await page.bringToFront();
  await clearUp(page);
  await clickElement(page, DISCONNECT_BUTTON);
}