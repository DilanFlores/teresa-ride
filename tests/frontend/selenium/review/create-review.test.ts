import { startDriver, URL, ById, ByText } from "./../setup";
import { By, WebDriver, until } from "selenium-webdriver";
import { prepareTestDatabase } from "../prepare-test-db";

let driver: WebDriver;

describe("Crear Reseña", () => {

    jest.setTimeout(60000);

    beforeAll(async () => {
        await prepareTestDatabase();
        
        await new Promise(resolve => setTimeout(resolve, 1000));
                
        driver = await startDriver();
    });

    afterAll(async () => {
        if (driver) {
            await driver.quit();
        }
    });

    test("Debe permitir crear una reseña correctamente", async () => {

        await driver.get(URL);

        await driver.findElement(ById("btn-login")).click();

        await driver.findElement(ById("login-email")).sendKeys("dilan.fl25@gmail.com");
        await driver.findElement(ById("login-password")).sendKeys("123456789");

        await driver.findElement(By.css("button[type='submit']")).click();

        await driver.wait(until.elementLocated(ByText("Sí, evaluar")), 10000);
        await driver.findElement(ByText("Sí, evaluar")).click();

        await driver.findElement(ById("rating")).sendKeys("5");
        await driver.findElement(ById("type")).sendKeys("Viaje");
        await driver.findElement(ById("comment")).sendKeys("Excelente servicio");

        await driver.findElement(ByText("Enviar reseña")).click();

        await driver.wait(
            until.elementLocated(ByText("¡Gracias por tu reseña!")),
            15000
        );
    });
});
