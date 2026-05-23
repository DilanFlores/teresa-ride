import { By, until,WebDriver } from "selenium-webdriver";
import { startDriver, URL, ById, ByText } from "./../setup";
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
    await driver.wait(until.elementLocated(ByText("Notificaciones")), 25000);
  } catch (e) {}
}

beforeAll(async () => {
  await prepareTestDatabase();
  driver = await startDriver();
});

afterAll(async () => {
  if (driver) await driver.quit();
});

it("delete notification (flow)", async () => {
  await driver.get(URL);
  await loginIfNeeded();
  const notifBtn = await driver.wait(until.elementLocated(ByText("Notificaciones")), 25000);
  await notifBtn.click();
  const targetText = "Selenium Test Pago - Eliminar";

  const target = await driver.findElement(By.xpath(`//td[contains(., "${targetText}")]`));

  const deleteBtn = await driver.findElement(By.id("notification-delete-2"));
  await driver.executeScript("arguments[0].scrollIntoView(true);", deleteBtn);
  await driver.executeScript("arguments[0].click();", deleteBtn);

  let confirmBtnEl;
  try {
    confirmBtnEl = await driver.wait(
      until.elementLocated(By.id("notification-delete-button-confirm")),
      30000
    );
  } catch (e) {
    confirmBtnEl = await driver.wait(
      until.elementLocated(
        By.xpath("//div[@role='alertdialog']//button[normalize-space()='Eliminar' or contains(., 'Eliminar')]")
      ),
      30000
    );
  }
  await driver.wait(until.elementIsVisible(confirmBtnEl), 20000);
  await driver.executeScript("arguments[0].click();", confirmBtnEl);

  await driver.wait(async () => {
    const rows = await driver.findElements(By.css("tbody tr"));
    for (const row of rows) {
      const text = await row.getText();
      if (text.includes(targetText)) return false;
    }
    return true;
  }, 30000);
 
   const page = await driver.getPageSource();
   expect(page).not.toContain(targetText);
});
