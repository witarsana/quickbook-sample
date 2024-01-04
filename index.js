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
      Authorization: `Bearer ${oauth2_token_json.access_token}`,
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
