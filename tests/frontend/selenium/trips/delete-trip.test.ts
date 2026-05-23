import { startDriver, URL, ById, ByText } from "../setup";
import { By, WebDriver, until } from "selenium-webdriver";
import { prepareTestDatabase } from "../prepare-test-db";

let driver: WebDriver;

describe("Eliminar viaje existente (Admin)", () => {
    jest.setTimeout(120000);

    beforeAll(async () => {
        await prepareTestDatabase();
        await new Promise(resolve => setTimeout(resolve, 2000));

        driver = await startDriver();
        await driver.get(URL);

       
        const loginButton = await driver.wait(until.elementLocated(ById("btn-login")), 15000);
        await loginButton.click();

        await driver.findElement(ById("login-email")).sendKeys("juan@gmail.com");
        await driver.findElement(ById("login-password")).sendKeys("12345678");
        await driver.findElement(By.css("button[type='submit']")).click();

       
        await driver.wait(until.elementLocated(ByText("Viajes")), 20000);
    });

    afterAll(async () => {
        if (driver) await driver.quit();
    });

    afterEach(async () => {
        try {
            await driver.manage().deleteAllCookies();
            await driver.get(URL);
            console.log("Sesión limpiada");
        } catch (error) {
            console.log("error limpiando sesión:", error);
        }
    });

    test("Debe permitir a un admin eliminar el viaje existente", async () => {
        await driver.findElement(ByText("Viajes")).click();

     
        await driver.wait(until.elementLocated(By.css("tbody tr")), 15000);

        
        const deleteButton = await driver.findElement(By.id("btn-delete-trip-2"));
        await driver.executeScript("arguments[0].scrollIntoView(true);", deleteButton);
        await driver.executeScript("arguments[0].click();", deleteButton);

       
        const confirmDeleteButton = await driver.wait(
            until.elementLocated(By.id("btn-confirm-delete")),
            10000
        );
        await driver.executeScript("arguments[0].click();", confirmDeleteButton);

        await driver.wait(async () => {
            const rows = await driver.findElements(By.css("tbody tr"));
            for (const row of rows) {
                const rowId = await row.getAttribute("id") || row.getAttribute("data-row-id");
                if (rowId === "2" || rowId === "trip-2") return false;
            }
            return true;
        }, 15000);

        console.log("Viaje con ID 2 eliminado correctamente");
    });
});
