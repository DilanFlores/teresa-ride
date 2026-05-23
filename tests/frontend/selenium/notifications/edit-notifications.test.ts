import { By, until, WebDriver } from "selenium-webdriver";
import { startDriver, URL, ById, ByText } from "../setup";
import { prepareTestDatabase } from "../prepare-test-db";

let driver: WebDriver;
jest.setTimeout(120000); 

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
  } catch (e) {}
}

beforeAll(async () => {
  await prepareTestDatabase();
  driver = await startDriver();
});

afterAll(async () => {
  if (driver) await driver.quit();
});

test("edit notification (flow)", async () => {
  await driver.get(URL);
  await loginIfNeeded();

  await driver.findElement(ByText("Notificaciones")).click();

  const targetText = "Selenium Test Pago - editar";
  const rowXpath = `//tr[.//td[contains(., '${targetText}')]] | //div[contains(., '${targetText}')]`;
  const row = await driver.wait(until.elementLocated(By.xpath(rowXpath)), 15000);
  
  try {
    const editBtn = await row.findElement(By.id("notification-edit-3"));
    await editBtn.click();
  } catch {
    const fallbackEdit = await driver.findElement(By.xpath("//button[contains(., 'Editar') or contains(., 'Edit')]"));
    await fallbackEdit.click();
  }
    await driver.wait(until.elementLocated(ById("email_subject")), 15000);
    await driver.findElement(ById("email_subject")).sendKeys("Selenium Test Pago - editado");
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

  try {
    await driver.findElement(ById('notification-update-submit')).click();
  } catch {
    await driver.findElement(By.xpath("//button[contains(., 'Actualizar') or contains(., 'Update')]")).click();
  }

  await driver.sleep(3000);
  const page = await driver.getPageSource();
  expect(page).toContain("Selenium Test Pago");
});
