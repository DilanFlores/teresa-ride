import { By, WebDriver, until } from "selenium-webdriver";
import { startDriver, URL, ById, ByText } from "../setup";
import { prepareTestDatabase } from "../prepare-test-db";

let driver: WebDriver;

describe("Listar Reseñas (Admin)", () => {

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

    test("Debe permitir a un admin ver el listado de reseñas", async () => {
        
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
            await driver.wait(until.elementLocated(By.xpath("//h1[contains(text(), 'Reseñas')]")), 15000);
            console.log(" Título 'Reseñas' encontrado");
        } catch (error) {
            const pageSource = await driver.getPageSource();
            console.error(" No se encontró el título 'Reseñas'. HTML actual:");
            console.error(pageSource.substring(0, 500));
            throw error;
        }

        await driver.wait(until.elementLocated(By.xpath("//th[contains(text(), 'ID')]")), 15000);
        console.log(" Tabla de reseñas encontrada");

        await driver.sleep(3000);

        const pageSource = await driver.getPageSource();

        expect(pageSource).toContain("ID");
        console.log(" Columna 'ID' verificada");
        
        expect(pageSource).toContain("Calificación");
        console.log(" Columna 'Calificación' verificada");
        
        expect(pageSource).toContain("Comentario");
        console.log(" Columna 'Comentario' verificada");
        
        expect(pageSource).toContain("Tipo");
        console.log(" Columna 'Tipo' verificada");

        const viewButtons = await driver.findElements(ByText("Ver usuario"));
        console.log(` Botones 'Ver usuario' encontrados: ${viewButtons.length}`);
        expect(viewButtons.length).toBeGreaterThan(0);

        const deleteButtons = await driver.findElements(ByText("Eliminar"));
        console.log(` Botones 'Eliminar' encontrados: ${deleteButtons.length}`);
        expect(deleteButtons.length).toBeGreaterThan(0);

        console.log(" Test completado exitosamente");
    });
});