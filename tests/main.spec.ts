import { test, _electron as electron, expect } from "@playwright/test";
import { BrowserWindow } from "electron";
import type { ElectronApplication, Page } from "playwright";

process.env.CI = "true";

export async function openDevtools(app: ElectronApplication, page: Page): void {
  const browserWindow = await app.browserWindow(page);
  await browserWindow.evaluate(async (app: BrowserWindow) => {
    app.webContents.openDevTools({ mode: "detach" });
  });
}

test.setTimeout(6_000);

test.describe("create a board", async () => {
  let app: ElectronApplication;
  let page: Page;

  test.beforeAll(async () => {
    app = await electron.launch({ args: ["."] });
    page = await app.firstWindow();
    await page.getByTestId("app").waitFor();
  });

  test.afterAll(async () => {
    await app.close();
  });

  test("app name", async () => {
    const title = await page.title();
    expect(title).toBe("Swimlanes.app");
  });

  test("home page", async () => {
    await expect(page.getByRole("heading", { name: "Join a board" })).toBeVisible();
    await page.getByTestId("create-button").click();
  });

  test("create board", async () => {
    await page.getByTestId("create-board").waitFor();
    await expect(page.getByRole("heading", { name: "Creating board..." })).toBeVisible();
  });

  test("new board loaded", async () => {
    await page.getByTestId("swimlane").first().waitFor();
    const lanes = await page.getByTestId("swimlane").all();
    expect(lanes.length).toEqual(3);
  });

  test("drag & drop", async () => {
    const lanes = page.getByTestId(`swimlane`);
    const todos = lanes.nth(0);
    await todos.waitFor();
    const doing = lanes.nth(1);
    const draggable1 = page.getByTestId(`draggable-task`).last();
    const draggable2 = todos.getByTestId(`draggable-task`).last();
    await draggable1.dragTo(doing);
    await draggable2.dragTo(doing);
    await page.waitForTimeout(600);
    expect(await doing.getByTestId("draggable-task").count()).toEqual(2);
  });
});
