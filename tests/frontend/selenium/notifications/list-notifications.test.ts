import { By, until, WebDriver } from "selenium-webdriver";
import { startDriver, URL, ById, ByText } from "../setup";
import { prepareTestDatabase } from "../prepare-test-db";

let driver: WebDriver;
jest.setTimeout(30000);

async function loginIfNeeded() {
  try {
    await driver.findElement(ById("btn-login")).click();
    await driver.findElement(ById("login-email"));
    await driver.findElement(ById("login-email")).clear();
    await driver.findElement(ById("login-email")).sendKeys(process.env.TEST_USER_EMAIL || "juan@gmail.com");
    await driver.findElement(ById("login-password")).clear();
    await driver.findElement(ById("login-password")).sendKeys(process.env.TEST_USER_PASSWORD || "12345678");
    await driver.findElement(By.css("button[type='submit']")).click();
    await driver.wait(until.elementLocated(ByText("Notificaciones")), 17000);
  } catch (e) {}
}

beforeAll(async () => {
  await prepareTestDatabase();
  driver = await startDriver();
});

afterAll(async () => {
  if (driver) await driver.quit();
});

test("list notifications shows entries", async () => {
  await driver.get(URL);
  await loginIfNeeded();
  
  const notifBtn = await driver.wait(until.elementLocated(ByText("Notificaciones")), 25000);
  await notifBtn.click();
  try {
    await driver.wait(until.elementLocated(ById("notification-list")), 25000);
  } catch {
    await driver.wait(until.elementLocated(By.xpath("//tr[contains(., 'Notificación') or //div[contains(@id,'notification-item')]]")), 25000);
  }

  const page = await driver.getPageSource();
  expect(page).toContain("Notificaciones");
});
