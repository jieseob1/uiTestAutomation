import { Page } from "puppeteer";
import { clickElement } from "./elementActions.js";
import { dragAndDropElement } from "./mouseActions.js";
import { INSERT_BUTTON, SHAPE_GROUP } from "constants/office_docx.js";

export async function createShape(page: Page,
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  shapeSelector: string) {
  await clickElement(page, INSERT_BUTTON);
  await clickElement(page, SHAPE_GROUP);
  await clickElement(page, shapeSelector);
  await dragAndDropElement(page, startX, startY, endX, endY);
}
