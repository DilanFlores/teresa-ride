import { By, until, WebDriver, Key } from "selenium-webdriver";
import { startDriver, URL, ById, ByText } from "../setup";
import { prepareTestDatabase } from "../prepare-test-db";

let driver: WebDriver;
jest.setTimeout(45000);

async function loginIfNeeded() {
  try {
    await driver.findElement(ById("btn-login")).click();
    await driver.findElement(ById("login-email"));
    await driver.findElement(ById("login-email")).clear();
    await driver.findElement(ById("login-email")).sendKeys(process.env.TEST_USER_EMAIL || "juan@gmail.com");
    await driver.findElement(ById("login-password")).clear();
    await driver.findElement(ById("login-password")).sendKeys(process.env.TEST_USER_PASSWORD || "12345678");
    await driver.findElement(By.css("button[type='submit']")).click();
    await driver.wait(until.elementLocated(ByText("Notificaciones")), 7000);
  } catch (e) {
  }
}

beforeAll(async () => {
  await prepareTestDatabase();
  driver = await startDriver();
});

afterAll(async () => {
  if (driver) await driver.quit();
});

test("search notifications finds created item", async () => {
  const subject = "Selenium Test Pago";
  await driver.get(URL);
  await loginIfNeeded();
  await driver.findElement(ByText("Notificaciones")).click();

  await driver.wait(until.elementLocated(ByText(subject)), 25000);
  const searchInput = await driver.findElement(ById("notification-search"));
  await searchInput.clear();
  await searchInput.sendKeys(subject, Key.RETURN);
  await driver.wait(until.elementLocated(ByText(subject)), 25000);
  const page = await driver.getPageSource();
  expect(page).toContain(subject);
  await driver.sleep(1000);
  const pageAfter = await driver.getPageSource();
  expect(pageAfter).toContain(subject);
});