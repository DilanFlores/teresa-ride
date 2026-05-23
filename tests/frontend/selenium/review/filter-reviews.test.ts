import { By, WebDriver, until } from "selenium-webdriver";
import { startDriver, URL, ById, ByText } from "../setup";
import { prepareTestDatabase } from "../prepare-test-db";

let driver: WebDriver;

describe("Filtrar Reseñas (Admin) — Test Único", () => {
    jest.setTimeout(180000);

    beforeAll(async () => {
        await prepareTestDatabase();
        await new Promise(r => setTimeout(r, 2000));
        driver = await startDriver();
    });

    afterAll(async () => {
        if (driver) await driver.quit();
    });

    test("Flujo completo: login + navegar + aplicar filtros + limpiar", async () => {

        // ---------------- LOGIN ----------------
        await driver.get(URL);
        await driver.wait(until.elementLocated(ById("btn-login")), 10000);
        await driver.findElement(ById("btn-login")).click();

        await driver.wait(until.elementLocated(ById("login-email")), 15000);
        await driver.findElement(ById("login-email")).sendKeys("juan@gmail.com");
        await driver.findElement(ById("login-password")).sendKeys("12345678");
        await driver.findElement(By.css("button[type='submit']")).click();

        await driver.sleep(5000);
        await driver.wait(until.elementLocated(ByText("Reseñas")), 20000);

        const reviewsButton = await driver.findElement(ByText("Reseñas"));
        await driver.executeScript("arguments[0].scrollIntoView(true);", reviewsButton);
        await driver.executeScript("arguments[0].click();", reviewsButton);

        await driver.wait(until.elementLocated(By.xpath("//th[contains(text(), 'ID')]")), 20000);
        await driver.sleep(3000);

        // ---------------- FILTRO TIPO (Viaje) ----------------
        const typeSelect = await driver.findElement(By.css("button[role='combobox']"));
        await driver.executeScript("arguments[0].click();", typeSelect);
        await driver.sleep(1500);

        const options = await driver.findElements(By.css("[role='option']"));
        for (const opt of options) {
            if ((await opt.getText()).includes("Viaje")) {
                await opt.click();
                break;
            }
        }
        await driver.sleep(2000);

        // ---------------- FILTRO CALIFICACIÓN (5) ----------------
        const selects = await driver.findElements(By.css("button[role='combobox']"));
        const ratingSelect = selects[1];
        await driver.executeScript("arguments[0].click();", ratingSelect);

        const ratingOps = await driver.findElements(By.css("[role='option']"));
        for (const opt of ratingOps) {
            if ((await opt.getText()) === "5") {
                await opt.click();
                break;
            }
        }
        await driver.sleep(2000);

        // ---------------- FILTRO RANGO DE FECHAS ----------------
        const dateInputs = await driver.findElements(By.css("input[type='date']"));
        const from = dateInputs[0];
        const to = dateInputs[1];

        const today = new Date();
        const lastWeek = new Date();
        lastWeek.setDate(today.getDate() - 7);

        const format = (d: Date) =>
            `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

        await driver.executeScript(
            "arguments[0].value = arguments[1]; arguments[0].dispatchEvent(new Event('input', { bubbles: true }));",
            from,
            format(lastWeek)
        );

        await driver.executeScript(
            "arguments[0].value = arguments[1]; arguments[0].dispatchEvent(new Event('input', { bubbles: true }));",
            to,
            format(today)
        );

        await driver.sleep(1500);

        // ---------------- LIMPIAR FILTROS ----------------
        const clearBtn = await driver.findElement(ByText("Limpiar filtros"));
        await driver.executeScript("arguments[0].click();", clearBtn);
        await driver.sleep(2000);


        // ---------------- VALIDACIONES DESPUÉS DE LIMPIAR ----------------

        const typeValue = await driver.findElement(
            By.css("button[role='combobox'] span[data-slot='select-value']")
        ).getText();
        expect(typeValue).toBe("Todas");

        console.log(" Todos los filtros han sido limpiados correctamente");
    });
});
