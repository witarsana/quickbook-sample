const express = require("express");
require("dotenv").config();
const app = express();
const port = 3000;
const axios = require("axios");

// quikbook integration
const baseUrl = process.env.BASE_URL;
const companyId = process.env.COMPANY_ID;

const clientId = process.env.CLIENT_ID;
const secretId = process.env.CLIENT_SECRET;

const QuickBooks = require("node-quickbooks");
const OAuthClient = require("intuit-oauth");

let oauthClient = null;
let oauth2_token_json = null;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/retrieveToken", function (req, res) {
  res.send(oauth2_token_json);
});

app.get("/request-token", async (req, res) => {
  oauthClient = new OAuthClient({
    clientId: clientId,
    clientSecret: secretId,
    environment: process.env.ENVIRONMENT,
    redirectUri: process.env.REDIRECT_URI,
  });

  const authUri = oauthClient.authorizeUri({
    scope: [OAuthClient.scopes.Accounting],
    state: "intuit-test",
  });

  res.send(authUri);
});

app.get("/callback", (req, res) => {
  oauthClient
    .createToken(req.url)
    .then(function (authResponse) {
      oauth2_token_json = JSON.stringify(authResponse.getJson(), null, 2);
    })
    .catch(function (e) {
      console.error(e);
    });

  res.send("hello");
});

app.get("/invoice/:id", async (req, res) => {
  const id = req.params.id;
  const url = `${baseUrl}/v3/company/${companyId}/invoice/${id}?minorversion=69`;

  try {
    const response = await axios.get(url, {
      Authorization: `Bearer eyJlbmMiOiJBMTI4Q0JDLUhTMjU2IiwiYWxnIjoiZGlyIn0..mAzYwWezs9lzyujN-_QWuw.VHp_RAB_drZo4GNcgagE1PiOYXr0OTMbD_I6tFFv3O63s08RR2O19lvebq7RNE02MC2ZUsi_IXHumpBRbLfedz0rmEuOirvjiED0Z1pUqArSamw8r01cBj5qRd_dBrknsuXkvfAu5R1X6DSxvBXALkLHCsddqs8dDa04y8gOl5WzHi3pu0afGy1LaFhPHeaWF_38OltCya8J4bIsNXPWh5O_MGtNWtS30Pfs_7Oi8NTcu1VZ-3mDvjt20eusCbBzqBnscSZVJqhXKiWB_uWJwNEe4H_Kyp-gLpl1lTjCG6zeuHuluDC5mFTNbmSZBTcLSP7Oi6OtCbP5iJayFusBRNC5ncAplEXgNGv9Xae0egq9ZP2i4PJ4zzwexSqwYZdd_dSPeWHZXFMtxNTd0To3QKZ4aL4Fj4PZNmpevphPIcUhm5sw5WhHBm-xwaKyxswDg1cFykENzR52dztdhgbfWYMifOz_mIXOXd7EVbY8LcEgPF4NUaszr3GF8lp0gKkTl63MLgWevg230Xb2aiSipJJissryT5wgpD2qAjNn-6s4-uxctYQO5HEwIDTeKQXlA6jDdDhHkexNKLi01UwzThUd8S5ZO5Tbiuc5A6Nsabl2U99Burhgs0C3ggEdWpZ8ZANFsdFtlN42POyBfFouTavd75-ZX2jKPqgWXXJe_dVBmlkMMJKD80Tq7Lzw-EyoD35Bswsstt9KqSYDVcPR-5vzrQH0Jb8zplnTuM-Uw_bqtzBboc_Apy5M7Wf_pRZU.KFLvKQjDF3OnCWJzU05VEQ`,
      "Content-Type": "application/json",
    });
    console.log(response);
    return res.send("okay");
  } catch (error) {
    // console.log(error);
    throw error;
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
