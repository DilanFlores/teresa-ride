import { startDriver, URL, ById, ByText } from "./../setup";
import { By, WebDriver, until } from "selenium-webdriver";
import { prepareTestDatabase } from "../prepare-test-db";

let driver: WebDriver;
jest.setTimeout(88000);

async function loginIfNeeded() {
  try {
    await driver.findElement(ById("btn-login")).click(); 
    await driver.findElement(ById("login-email"));
    await driver.findElement(ById("login-email")).clear();
    await driver.findElement(ById("login-email")).sendKeys(process.env.TEST_USER_EMAIL || "juan@gmail.com");
    await driver.findElement(ById("login-password")).clear();
    await driver.findElement(ById("login-password")).sendKeys(process.env.TEST_USER_PASSWORD || "12345678");
    await driver.findElement(By.css("button[type='submit']")).click();
    await driver.wait(until.elementLocated(ByText("Notificaciones")), 15000);
  } catch (e) {

  }
}

describe("Notifications - create payment flows", () => {
  beforeAll(async () => {
    await prepareTestDatabase();
    driver = await startDriver();
  });

  afterAll(async () => {
    if (driver) await driver.quit();
  });

  test("create payment notification (flow) - payment confirmation", async () => {

    await driver.get(URL);
    await loginIfNeeded();

    const notifBtn = await driver.wait(until.elementLocated(ByText("Notificaciones")), 15000);
    await notifBtn.click();

    const newBtn = await driver.wait(until.elementLocated(ById("notification-create-button")), 15000);
    await newBtn.click();

    await driver.wait(until.elementLocated(ById("email_subject")), 15000);

    await driver.findElement(ById("email_subject")).sendKeys("Selenium Test Pago");
    await driver.findElement(ById("description")).sendKeys("Creación automatizada - Confirmación de pago");

    try { await driver.findElement(ById("payment_date")).sendKeys("2025-12-31"); } catch {}
    try { await driver.findElement(ById("payment_amount")).sendKeys("123.45"); } catch {}
    try { await driver.findElement(ById("payment_transactionId")).sendKeys(`TX-SEL-PAY-${Date.now()}`); } catch {}

    try {
      const userSelect = await driver.findElement(ById("user"));
      const opts = await userSelect.findElements(By.tagName("option"));
      for (const o of opts) {
        const txt = await o.getText();
        if (txt && !txt.toLowerCase().includes("seleccione")) { await o.click(); break; }
      }
    } catch {}

    await driver.findElement(ById("notification-create-submit")).click();

    await driver.sleep(15000);
    const page = await driver.getPageSource();
    expect(page).toContain("Selenium Test Pago");
    expect(page.toLowerCase()).toContain("confirmación de pago");
  });
});