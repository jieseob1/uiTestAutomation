import { Page } from "puppeteer";

export async function undo(page: Page) {
  await page.bringToFront();
  await page.keyboard.down('Control');
  await page.keyboard.press('Z');
  await page.keyboard.up('Control');
}

export async function redo(page: Page) {
  await page.bringToFront();
  await page.keyboard.down('Control');
  await page.keyboard.press('Y');
  await page.keyboard.up('Control');
}

export async function enter(page: Page) {
  await page.keyboard.press('Enter');
}