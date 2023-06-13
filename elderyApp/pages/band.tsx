import express from "express";
const url = require('url');
const axios = require('axios');
const urlParse = require('url-parse');
const bodyParser = require('body-parser');
const request = require('request');
const querystring = require('querystring');
const { google } = require("googleapis");

interface DataObject {
  [date: string]: number;
}

const router = express.Router();

router.get("/getSteps", (req, res) => {
  const oauth2Client = new google.auth.OAuth2(
    //client id
    "59463143891-j5k7c9loabghrkdbacb92gpprfrkheed.apps.googleusercontent.com",
    //secret
    "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",
    //link to redirect to
    "https://elderyresearch.cs.bgu.ac.il/steps"
  );

  const scopes = ["https://www.googleapis.com/auth/fitness.activity.read profile email openid"];

  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    state: JSON.stringify({
      callbackUrl: req.body.callbackUrl,
      userID: req.body.userid
    })
  });
  request(url, (err: any, response: any, body: any) => {
    console.log("error: ", err);
    console.log("response: ", response && response.statusCode);
    res.send({ url });
  });
});

router.get("/steps", async (req, res) => {
  const queryURL = new urlParse(req.url);
  const code = querystring.parse(queryURL.query).code;
  const oauth2Client = new google.auth.OAuth2(
    //client id
    "59463143891-j5k7c9loabghrkdbacb92gpprfrkheed.apps.googleusercontent.com",
    //secret
    "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",
    //link to redirect to
    "https://elderyresearch.cs.bgu.ac.il/steps"
  );
  const tokens = await oauth2Client.getToken(code);
  const stepData: DataObject = {};

  try {
    const result = await axios(
      {
        method: "POST",
        headers: {
          authorization: "Bearer " + tokens.tokens.access_token,
        },
        url: 'https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate',
        data: {
          aggregateBy: [
            {
              dataTypeName: "com.google.step_count.delta",
              dataSourceId: "derived:com.google.step_count.delta:com.google.android.gms:estimated_steps",
            },
          ],
          bucketByTime: { durationMillis: 86400000 },
          startTimeMillis: 1672092000000,
          endTimeMillis: 1673301600000,
        },
      }
    );
    for (const dataSet of result.data.bucket) {
      for (const points of dataSet.dataset) {
        for (const steps of points.point) {
          const date = new Date(steps.startTimeNanos / 1000000).toISOString().slice(0, 10);
          stepData[date] = steps.value;
        }
      }
    }
    console.log(stepData);
    res.status(200).send(stepData);
  }
  catch (e) {
    console.log(e);
  }
});

export default router;