import { Builder, By, WebDriver } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome";
import * as chromedriver from "chromedriver";

export async function startDriver(): Promise<WebDriver> {
    const options = new chrome.Options();

    options.addArguments("--start-maximized");
    options.addArguments("--disable-gpu");
    options.addArguments("--no-sandbox");
    options.addArguments("--disable-dev-shm-usage");
    options.addArguments("--window-size=1920,1080");

    console.log("Using ChromeDriver path:", chromedriver.path);

    const service = new chrome.ServiceBuilder(chromedriver.path);

    const driver = await new Builder()
        .forBrowser("chrome")
        .setChromeService(service)
        .setChromeOptions(options)
        .build();

    return driver;
}

export const URL = "http://localhost:3000/";
export const ById = (id: string) => By.id(id);
export const ByText = (text: string) =>
    By.xpath(`//*[contains(text(), '${text}')]`);
