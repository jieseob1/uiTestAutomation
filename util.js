// import { Page } from "puppeteer";

// page: Promise<Page>
export default async function clearUp(page) {
  (await page).keyboard.down('Control');
  (await page).keyboard.press('A');
  (await page).keyboard.up('Control');
}