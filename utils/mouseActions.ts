import { Page } from "puppeteer";

export async function dragAndDropElement(page: Page,
  startX: number,
  startY: number,
  endX: number,
  endY: number) {
  await page.mouse.move(startX, startY);
  await page.mouse.down();
  await page.mouse.move(endX, endY); // steps:10이건 뭐지?
  await page.mouse.up();
}