const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

const RedirectionUrl = "http://localhost:8080/oauthCallback";

const oauth2Client = new OAuth2(
  "522599487334-mvk1efm1lg79rm32k10n6fqatuhmucfq.apps.googleusercontent.com",
  "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",
  RedirectionUrl
);
(async () => {
  const token = await oauth2Client.getToken(
    "4/0AdQt8qgrviClI3HIfxb6x2nPK3gd7zP2ys_HsBFVS-IE2Ygm66H-87Or8NIM5nFsOtGOdw"
  );
  console.log(token);
})();
