import * as Google from "./model";
import fetch from "node-fetch";

async function getAuthData(
  authToken: string
): Promise<Google.GoogleAuthTokenData | null> {
  try {
    const TOKEN_API_URL = "https://www.googleapis.com/oauth2/v1/tokeninfo";
    const response = await fetch(`${TOKEN_API_URL}?access_token=${authToken}`);
    const tokenJson = await response.json();
    return Google.decodeGoogleAuthTokenData(tokenJson);
  } catch (error) {
    console.log(error);
    return null;
  }
}

async function getUserData(
  authToken: string
): Promise<Google.GoogleUserData | null> {
  try {
    const USER_DATA_API_URL = "https://www.googleapis.com/oauth2/v2/userinfo";
    const response = await fetch(
      `${USER_DATA_API_URL}?access_token=${authToken}`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
    const userDataJson = await response.json();
    return Google.decodeGoogleUserData(userDataJson);
  } catch (error) {
    console.log(error);
    return null;
  }
}

export default {
  getAuthData,
  getUserData,
};
