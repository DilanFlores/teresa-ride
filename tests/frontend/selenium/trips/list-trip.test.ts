import { startDriver, URL, ById, ByText } from "./../setup";
import { By, WebDriver, until } from "selenium-webdriver";
import { prepareTestDatabase } from "../prepare-test-db";

let driver: WebDriver;

describe("Listar Trips", () => {
    jest.setTimeout(60000);

    beforeAll(async () => {
        await prepareTestDatabase();
        driver = await startDriver();
        await driver.get(URL);

        
        const loginButton = await driver.wait(
            until.elementLocated(By.id("btn-login")), 
            30000
        );
        await loginButton.click();

        await driver.findElement(ById("login-email")).sendKeys("juan@gmail.com");
        await driver.findElement(ById("login-password")).sendKeys("12345678");
        await driver.findElement(By.css("button[type='submit']")).click();

        await driver.wait(until.elementLocated(ByText("Viajes")), 10000);
    });

    afterAll(async () => { 
        if (driver) await driver.quit(); 
    });

    test("Debe listar viajes correctamente", async () => {
  
        await driver.findElement(ByText("Viajes")).click();

        
        await driver.sleep(3000);

        const tableRows = await driver.findElements(By.css("tbody tr"));
       
        expect(tableRows.length).toBeGreaterThan(0);
        
        console.log(` Se encontraron ${tableRows.length} viajes en la lista`);
    });
});