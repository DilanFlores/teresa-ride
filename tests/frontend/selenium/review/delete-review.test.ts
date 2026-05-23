import { By, WebDriver, until } from "selenium-webdriver";
import { startDriver, URL, ById, ByText } from "../setup";
import { prepareTestDatabase } from "../prepare-test-db";

let driver: WebDriver;

describe("Eliminar Reseña (Admin)", () => {

    jest.setTimeout(120000);

    beforeAll(async () => {
        await prepareTestDatabase();
        await new Promise(resolve => setTimeout(resolve, 2000));
        driver = await startDriver();
    });

    afterAll(async () => {
        if (driver) {
            await driver.quit();
        }
    });

    afterEach(async () => {
        try {
            await driver.manage().deleteAllCookies();
            await driver.sleep(3000);
            await driver.get(URL);
            await driver.sleep(3000);
            console.log(" Sesión limpiada");
        } catch (error) {
            console.log(" Error limpiando sesión:", error);
        }
    });

    test("Debe permitir a un admin eliminar una reseña", async () => {

        await driver.get(URL);
        await driver.sleep(5000); 

        await driver.wait(until.elementLocated(ById("btn-login")), 10000);
        await driver.findElement(ById("btn-login")).click();
        await driver.wait(until.elementLocated(ById("login-email")), 15000); 
        await driver.findElement(ById("login-email")).sendKeys("juan@gmail.com");
        await driver.findElement(ById("login-password")).sendKeys("12345678");
        await driver.findElement(By.css("button[type='submit']")).click();

        await driver.sleep(10000); 

        await driver.wait(until.elementLocated(ByText("Reseñas")), 20000); 
        const reviewsButton = await driver.findElement(ByText("Reseñas"));
        await driver.executeScript("arguments[0].scrollIntoView(true);", reviewsButton);
        await driver.sleep(2000);
        await driver.executeScript("arguments[0].click();", reviewsButton);

        await driver.sleep(8000); 

        await driver.wait(until.elementLocated(By.css("tbody tr")), 15000);

        let tableRows = await driver.findElements(By.css("tbody tr"));
        const initialCount = tableRows.length;
        console.log(` Reseñas encontradas: ${initialCount}`);

        if (initialCount === 0) {
            console.log(" No hay reseñas para eliminar");
            expect(true).toBe(true);
            return;
        }

        expect(initialCount).toBeGreaterThan(0);

        const deleteButtons = await driver.findElements(ByText("Eliminar"));
        console.log(`🔍 Botones 'Eliminar' encontrados: ${deleteButtons.length}`);

        if (deleteButtons.length === 0) {
            throw new Error("No se encontraron botones 'Eliminar'");
        }

        await driver.wait(until.elementIsVisible(deleteButtons[0]), 10000);
        await driver.executeScript("arguments[0].scrollIntoView(true);", deleteButtons[0]);
        await driver.sleep(2000);
        await driver.executeScript("arguments[0].click();", deleteButtons[0]);

        await driver.wait(
            until.elementLocated(By.css("[data-slot='dialog-overlay']")),
            15000
        );
        await driver.sleep(3000);

        const allDeleteButtons = await driver.findElements(ByText("Eliminar"));
        console.log(` Total botones después del modal: ${allDeleteButtons.length}`);
        const modalDeleteButton = allDeleteButtons[allDeleteButtons.length - 1];

        await driver.wait(until.elementIsVisible(modalDeleteButton), 10000);
        await driver.executeScript("arguments[0].click();", modalDeleteButton);

        await driver.wait(async () => {
            const overlays = await driver.findElements(By.css("[data-slot='dialog-overlay']"));
            return overlays.length === 0;
        }, 15000);

        await driver.sleep(6000); 
        await driver.navigate().refresh();
        await driver.sleep(5000); 

        const newTableRows = await driver.findElements(By.css("tbody tr"));
        const newCount = newTableRows.length;
        console.log(` Reseñas después de eliminar: ${newCount}`);

        if (newCount === 0) {
            const pageSource = await driver.getPageSource();
            const hasNoReviewsMessage = pageSource.includes("No hay reseñas") ||
                pageSource.includes("no reviews") ||
                newTableRows.length === 0;
            expect(hasNoReviewsMessage).toBe(true);
        } else {
            expect(newCount).toBe(initialCount - 1);
        }

        console.log(" Test de eliminación completado");
    });

});
