import { Page } from "puppeteer";
import { clickUsingSelector } from "./elementActions.js";

export async function pageNavigationAndBringToFront(page: Page, url: string) {
  await page.goto(url);
  await page.waitForNavigation();
  await page.bringToFront();
}

export async function pageLoadingComplete(page: Page, documentSelector: string, waitSelector: string, url: string) {
  await pageNavigationAndBringToFront(page, url);
  await clickUsingSelector(page, documentSelector);
  try {
    await page.waitForSelector(waitSelector, { visible: true, timeout: 20 * 1000 });
  } catch (e) {
    console.error("pageLoading error Occured", e);
  }
}