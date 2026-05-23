import { startDriver, URL, ById, ByText } from "../setup";
import { By, WebDriver, until } from "selenium-webdriver";
import { prepareTestDatabase } from "../prepare-test-db";

let driver: WebDriver;

describe("Actualizar viaje existente (Admin)", () => {
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

    test("Debe permitir a un admin actualizar un viaje específico", async () => {
        await driver.findElement(ByText("Viajes")).click();

        // Espera a que los viajes estén cargados
        await driver.wait(until.elementLocated(By.css("tbody tr")), 15000);

        // Seleccionamos el botón de editar para el viaje con ID 2
        const editButton = await driver.findElement(By.id("btn-edit-trip-2"));
        await driver.executeScript("arguments[0].scrollIntoView(true);", editButton);
        await driver.executeScript("arguments[0].click();", editButton);

        // Cambiamos el destino del viaje
        const destination = await driver.wait(until.elementLocated(ById("trip-destination")), 10000);
        await destination.clear();
        await destination.sendKeys("Panamá");

        // Guardamos los cambios
        const saveButton = await driver.findElement(ById("btn-save-trip"));
        await driver.executeScript("arguments[0].click();", saveButton);

        // Esperamos mensaje de éxito
        await driver.wait(until.elementLocated(ByText("Viaje actualizado exitosamente")), 15000);

        console.log("Viaje con ID 2 actualizado correctamente");
    });
});
