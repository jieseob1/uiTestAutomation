import { OFFICE_SECTION, TABLE_WRAPPER } from "constants/office_docx";
import { evaluateTextUsingSelector } from "./textEvaluation";
import { Page } from "puppeteer";

export async function syncSingleMessageSynchronized(page: Page, selector: string) {
  await evaluateTextUsingSelector(page, selector);
}

export async function waitTime(second: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, second * 1000));
  // 이부분 확인 필요
}

export async function getOfficeSesctionArea(page: Page): Promise<{ width: number, height: number, top: number, left: number } | void> {
  await page.evaluate(() => {
    const shapeArea: HTMLElement | null = document.querySelector(OFFICE_SECTION);
    if (shapeArea) {
      const shapeAreaRect = shapeArea.getBoundingClientRect();
      return {
        width: shapeArea.offsetWidth,
        height: shapeArea.offsetHeight,
        top: shapeAreaRect.top,
        left: shapeAreaRect.left
      };
    }
  });
}

export async function getCoordinateUsingSelector(page: Page, selector: string) {
  // 좌표 받아오는 역할 => mouse로 핸들링시 필요
  const element = await page.$(selector);
  if (!element) {
    throw new Error(`Element with selector "${selector}" not found`);
  }
  const rect = await page.evaluate((el) => {
    const { left, top } = el.getBoundingClientRect();
    return { left, top };
  }, element);
  return {
    x: rect.left + window.scrollX,
    y: rect.top + window.scrollY
  }
}

export async function graphicMove(page: Page, xPosition: number, yPosition: number): Promise<void> {
  const tableWrapper = await page.$(TABLE_WRAPPER);
  if (!tableWrapper) {
    throw new Error(`Element with selector "${TABLE_WRAPPER}" not found`);
  }

  const boundingBox = await tableWrapper.boundingBox();
  if (!boundingBox) {
    throw new Error(`Element with selector "${TABLE_WRAPPER}" does not have a bounding box`);
  }

  // 테두리 위치 계산 (예: 상단 중앙 테두리)
  const startX = boundingBox.x + boundingBox.width / 2;
  const startY = boundingBox.y;

  // 마우스 이동 및 드래그
  await page.mouse.move(startX, startY);
  await page.mouse.down();
  await page.mouse.move(xPosition, yPosition, { steps: 10 });
  await page.mouse.up();
}

export async function graphicSizeTransform(page: Page, newWidth: number, newHeight: number): Promise<void> {
  const tableWrapper = await page.$(TABLE_WRAPPER);
  if (!tableWrapper) {
    throw new Error(`Element with selector "${TABLE_WRAPPER}" not found`);
  }

  const boundingBox = await tableWrapper.boundingBox(); //요소 위치, 크기 정보
  if (!boundingBox) {
    throw new Error(`Element with selector "${TABLE_WRAPPER}" does not have a bounding box`);
  }

  // 현재 크기
  const currentWidth = boundingBox.width;
  const currentHeight = boundingBox.height;

  // 오른쪽 아래 모서리 위치 계산
  const startX = boundingBox.x + currentWidth;
  const startY = boundingBox.y + currentHeight;

  // 목표 위치 계산 (오른쪽 아래 모서리를 드래그하여 새로운 크기로 조정)
  const endX = boundingBox.x + newWidth;
  const endY = boundingBox.y + newHeight;

  // 마우스 이동 및 드래그
  await page.mouse.move(startX, startY);
  await page.mouse.down();
  await page.mouse.move(endX, endY, { steps: 10 });
  await page.mouse.up();
}

export async function withErrorHandling(cb: () => Promise<void>, errorString: string) { //함수, 에러정보
  try {
    await cb();
  } catch (e) {
    console.error(errorString, e);
  }
}