import { By, WebDriver, until } from "selenium-webdriver";
import { startDriver, URL, ById, ByText } from "../setup";
import { prepareTestDatabase } from "../prepare-test-db";

let driver: WebDriver;

describe("Ver Usuario de Reseña (Admin)", () => {

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

    test("Debe permitir a un admin ver la información del usuario que hizo la reseña", async () => {
        
        await driver.get(URL);

        await driver.findElement(ById("btn-login")).click();

        await driver.wait(until.elementLocated(ById("login-email")), 5000);
        await driver.findElement(ById("login-email")).sendKeys("juan@gmail.com");
        await driver.findElement(ById("login-password")).sendKeys("12345678");

        await driver.findElement(By.css("button[type='submit']")).click();

        console.log(" Login como admin exitoso");

        await driver.sleep(6000);

        await driver.wait(until.elementLocated(ByText("Reseñas")), 10000);
        
        const reviewsButton = await driver.findElement(ByText("Reseñas"));
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", reviewsButton);
        await driver.sleep(1000);
        
        await driver.executeScript("arguments[0].click();", reviewsButton);

        console.log(" Navegando a la sección de Reseñas");

        const currentUrl = await driver.getCurrentUrl();
        console.log(" URL actual:", currentUrl);

        await driver.sleep(3000);

        try {
            await driver.wait(until.elementLocated(By.xpath("//th[contains(text(), 'ID')]")), 15000);
            console.log(" Tabla de reseñas cargada");
        } catch (error) {
            const pageSource = await driver.getPageSource();
            console.error(" No se encontró la tabla. HTML actual:");
            console.error(pageSource.substring(0, 500));
            throw error;
        }
        await driver.sleep(3000);

        const viewUserButtons = await driver.findElements(ByText("Ver usuario"));
        console.log(` Botones "Ver usuario" encontrados: ${viewUserButtons.length}`);
        expect(viewUserButtons.length).toBeGreaterThan(0);

        await driver.executeScript("arguments[0].scrollIntoView(true);", viewUserButtons[0]);
        await driver.sleep(1000);

        await driver.executeScript("arguments[0].click();", viewUserButtons[0]);
        console.log(" Click en 'Ver usuario' ejecutado");

        await driver.sleep(5000);

        const pageSource = await driver.getPageSource();

        if (pageSource.includes("Dilan Flores")) {
            console.log(" Nombre verificado: Dilan Flores");
            expect(pageSource).toContain("Dilan Flores");
        } else if (pageSource.includes("Cargando...")) {
            console.log(" El modal se abrió pero aún está cargando datos");
            await driver.sleep(3000);
            const newPageSource = await driver.getPageSource();
            expect(newPageSource).toContain("Dilan Flores");
            console.log(" Nombre verificado después de esperar: Dilan Flores");
        } else {
            console.error(" El modal no se abrió o no contiene la información esperada");
            console.error("HTML actual:", pageSource.substring(0, 500));
            throw new Error("El modal no contiene la información del usuario");
        }

        expect(pageSource).toContain("dilan.fl25@gmail.com");
        console.log(" Email verificado: dilan.fl25@gmail.com");
        
        expect(pageSource).toContain("703160299");
        console.log(" Documento verificado: 703160299");
        
        expect(pageSource).toContain("Costa Rica");
        console.log(" Nacionalidad verificada: Costa Rica");

        const closeButtons = await driver.findElements(ByText("Cerrar"));
        if (closeButtons.length > 0) {
            await closeButtons[closeButtons.length - 1].click();
            await driver.sleep(1000);
            console.log(" Modal cerrado correctamente");
        } else {
            console.log(" No se encontró el botón 'Cerrar', el modal puede no haberse abierto");
        }
    });
});