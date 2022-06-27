const puppeteer = require("puppeteer");

//I am able to catch network req witch contain
/*
searchResult:{
  searchMerchants:[
    {
      latlng: {latitude: 1.2857211372800634, longitude: 103.84982956837393}
    }
  ]
}

Like this i found this in developer tool network tab

*/

//this is a self calling function

(async () => {
  const browser = await puppeteer.launch({
    //below is the proxy server so that we can scrap it from anywhere
    args: ["--no-sandbox", "--proxy-server=110.170.126.13:3128"],
    headless: false,
    ignoreHTTPSErrors: true,
  });
  const page = await browser.newPage();
  const webUrl = "https://food.grab.com/sg/en/";

  try {
    //here we got that url that is assign on webUrl line 30
    await page.goto(webUrl);
    //here we can take screenshot also
    await page.screenshot({ path: "screenshot.png", fullPage: true });

let location = "Singapore General Hospital - 1 Hospital Drive, Singapore, 169608";
    await page.type("#location-input", location);
    //here page.type type location in input tab on frontend

    await Promise.all([
      page.click(
        "#page-content > div.sectionContainer___3GDBD.searchSectionContainer___3Lhkk.ant-layout > div > button"
      ),
      //here search button is fired

      page.waitForNavigation(),
    ]);
    //here we are wating to fulfill

    await page.screenshot({ path: "restaurents.png", fullPage: true });

    //this is the event which is listening for every request from brower
    page.on("response", async (res) => {
      //we can recieve the data here if browser make any requests
      //we need to write some logic to get longitude and latitue
      if (res.url() == "https://portal.grab.com/foodweb/v2/search") {
        let respond = await res._request;
        console.log(respond);
        //here i got the request but won't able to find a way to extract
      }
      // now we need to write some logic to collect the data
    });
  } catch (error) {
    console.log(error.message);
  }
  // this will close the browser
  await page.close();
  await browser.close();
})();
