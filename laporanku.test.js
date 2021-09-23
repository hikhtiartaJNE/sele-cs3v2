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

  test("Login to admin page should be failed : account not registered", async () => {
    let data = {
      username: "dasdas@gmail.com",
      password: "087777555870",
    };
    await driver.get(`${server}/login`);
    await driver.wait(until.elementLocated(By.id("username")), duration);
    await driver.findElement(By.id("username")).sendKeys(data.username);
    await driver.findElement(By.id("password")).sendKeys(data.password);
    await driver.findElement(By.xpath("//button[@type='submit']")).click();
    await driver.wait(
      until.elementIsVisible(
        driver.findElement(By.className("alert alert-info"))
      ),
      duration
    );
    await driver
      .findElement(By.className("alert alert-info"))
      .getText()
      .then((text) => {
        expect(text).toEqual("Akun tidak terdaftar");
      });
  });

  test("Login to admin page should be success", async () => {
    let data = {
      username: "dayifiiadi@gmail.com",
      password: "087777555870",
    };

    await driver.get(`${server}/login`);
    await driver.wait(until.elementLocated(By.id("username")), duration);
    await driver.findElement(By.id("username")).sendKeys(data.username);
    await driver.findElement(By.id("password")).sendKeys(data.password);
    await driver.findElement(By.xpath("//button[@type='submit']")).click();
    await driver.wait(until.titleIs("Beranda Kamu"), duration);
    await driver.getTitle().then((title) => {
      expect(title).toEqual("Beranda Kamu");
    });
  });

  test("Create new ticket should be failed : cnote & category exist", async () => {
    let data = {
      awb: "MDTI-YE218943816",
      subject: "Tes Subject",
      message: "Tes Message",
      priority: true,
    };

    await driver.get(`${server}/hubungi/buat_laporan`);
    await driver.wait(until.titleIs("Buat Tiket Laporan"), duration);
    await driver.findElement(By.id("awb")).sendKeys(data.awb);
    await driver.findElement(By.id("subject")).sendKeys(data.subject);
    await driver.findElement(By.id("message")).sendKeys(data.message);
    if (data.priority) {
      await driver.findElement(By.id("priority")).click();
    }
    await driver.findElement(By.id("kirim")).click();
    await driver.wait(
      until.elementIsVisible(
        driver.findElement(By.className("alert alert-danger"))
      ),
      duration
    );
    await driver
      .findElement(By.className("alert alert-danger"))
      .getText()
      .then((text) => {
        expect(text).toEqual(
          "Tiket dengan no MDTI-YE218943816 dan kategori Isi Kiriman Kurang Koli sudah ada"
        );
      });
  });

  // // test("Create new ticket should be success", async () => {
  // //   let data = {
  // //     awb: "MDTI-YE218943816",
  // //     subject: "test from jest",
  // //     message: "test from jest",
  // //     priority: true,
  // //   };

  // //   await driver.get(`${server}/hubungi/buat_laporan`);
  // //   await driver.wait(until.titleIs("Buat Tiket Laporan"), duration);
  // //   await driver.findElement(By.id("awb")).sendKeys(data.awb);
  // //   await driver.findElement(By.id("subject")).sendKeys(data.subject);
  // //   await driver.findElement(By.id("message")).sendKeys(data.message);
  // //   if (data.priority) {
  // //     await driver.findElement(By.id("priority")).click();
  // //   }

  // //   await driver
  // //     .findElement(By.className("btn dropdown-toggle btn-light"))
  // //     .click();
  // //   await driver.wait(
  // //     until.elementIsVisible(
  // //       driver.findElement(By.className("dropdown-menu show"))
  // //     ),
  // //     duration
  // //   );
  // //   await driver.wait(
  // //     until.elementIsVisible(driver.findElement(By.id("bs-select-1-5"))),
  // //     duration
  // //   );
  // //   await driver.findElement(By.id("bs-select-1-5")).click();
  // //   await driver.findElement(By.id("kirim")).click();
  // //   await driver.wait(until.titleIs("Laporanku"), duration);
  // //   await driver.getTitle().then((title) => {
  // //     expect(title).toEqual("Laporanku");
  // //   });
  // // });

  test("Upload ulang with existing ticket should be success ", async () => {
    await driver.get(`${server}/hubungi/laporan`);
    await driver.wait(until.titleIs("Laporanku"), duration);

    await driver.findElement(By.id("ticket_no_0_laporulang")).click();
    await driver.wait(until.titleIs("Buat Tiket Laporan"), duration);
    await driver.findElement(By.id("subject")).sendKeys("test from jest");
    await driver.findElement(By.id("message")).sendKeys("test from jest");
    await driver.findElement(By.id("kirim")).click();
    await driver.wait(until.titleIs("Laporanku"), duration);
    await driver.getTitle().then((title) => {
      expect(title).toEqual("Laporanku");
    });
  });

  test("Filter feature should be success : date (01/01/2021 - 01/01/2021) return zero ticket ", async () => {
    await driver.get(`${server}/hubungi/laporan`);
    await driver.wait(until.titleIs("Laporanku"), duration);
    await driver.findElement(By.id("filterStartDate")).sendKeys("01-01-2021");
    await driver.findElement(By.id("filterEndDate")).sendKeys("01-01-2021");
    await driver.findElement(By.id("filterBtn")).click();
    await driver.getCurrentUrl().then((url) => {
      expect(url).toEqual(
        `${server}/hubungi/laporan?startDate=2021-01-01&endDate=2021-01-01`
      );
    });
    await driver
      .findElement(By.id("semua-laporan"))
      .getText()
      .then((laporan) => {
        expect(parseInt(laporan)).toEqual(0);
      });
  });

  test("Filter feature should be success : date (22/09/2021 - 22/22/2021) return three tickets ", async () => {
    await driver.get(`${server}/hubungi/laporan`);
    await driver.wait(until.titleIs("Laporanku"), duration);
    await driver.findElement(By.id("filterStartDate")).sendKeys("22-09-2021");
    await driver.findElement(By.id("filterEndDate")).sendKeys("22-09-2021");
    await driver.findElement(By.id("filterBtn")).click();
    await driver.getCurrentUrl().then((url) => {
      expect(url).toEqual(
        `${server}/hubungi/laporan?startDate=2021-09-22&endDate=2021-09-22`
      );
    });
    await driver
      .findElement(By.id("semua-laporan"))
      .getText()
      .then((laporan) => {
        expect(parseInt(laporan)).toEqual(3);
      });
  });

  test("Validation should be success when someone change the url of ticket details", async () => {
    await driver.get(`${server}/hubungi/buat_laporan/2021-08-23-614c41b471cef`);
    await driver.wait(until.titleIs("Laporanku"), duration);
    await driver.getTitle().then((title) => {
      expect(title).toEqual("Laporanku");
    });
  });

  test("Obrolan section should be visible with subject: test from jest and message: test from jest", async () => {
    await driver.get(`${server}/hubungi/buat_laporan/2021-09-23-614c41b471cef`);
    await driver.wait(until.titleIs("Buat Tiket Laporan"), duration);
    await driver
      .findElement(By.id("message-value-0"))
      .getText()
      .then((text) => {
        expect(text).toEqual(
          "Subject: test from jest\nMessage: test from jest"
        );
      });
  });

  test("Selesai feature should be success", async () => {
    await driver.get(`${server}/hubungi/laporan`);
    await driver.wait(until.titleIs("Laporanku"), duration);
    await driver.findElement(By.id("ticket_no_0_selesai")).click();
    await driver.wait(
      until.elementIsVisible(driver.findElement(By.className("swal-modal"))),
      duration
    );
    await driver
      .findElement(
        By.className("swal-button swal-button--confirm swal-button--danger")
      )
      .click();
    await driver.wait(
      until.elementIsVisible(driver.findElement(By.className("swal-modal"))),
      duration
    );
    await driver
      .findElement(By.className("swal-button swal-button--confirm"))
      .click();
    await driver.wait(until.titleIs("Laporanku"), duration);
    await driver.getTitle().then((title) => {
      expect(title).toEqual("Laporanku");
    });
  });
});
