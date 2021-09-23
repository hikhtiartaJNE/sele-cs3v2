const webdriver = require("selenium-webdriver");
const { By, until, Builder } = webdriver;
let duration = 10000;
let server = "http://34.101.70.250/cs3_v2/";

describe("CS3 Automation testing", function () {
  let driver;

  beforeAll(async () => {
    driver = await new Builder().forBrowser("chrome").build();
  });

  afterAll(async () => {
    // End of test use this.
    await driver.quit();
  });

  test("CS3_V2 Homepage should be accessed", async () => {
    await driver.get(server);
    await driver.getTitle().then((title) => {
      expect(title).toEqual("CS3");
    });
  });
});
