import { TextField } from "@mui/material";
import React, { useState, useEffect } from "react";
const App = () => {
  const [appId, setAppId] = useState("");
  const [appSecret, setAppSecret] = useState("");
  const [finalToken, setFinalToken] = useState("");
  const [error, setError] = useState("");
  const accessFlow = async (response) => {
    try {
      const accessToken = response.authResponse.accessToken;
      const longLivedUserTokenEndpoint = `https://graph.facebook.com/v17.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${appId}&client_secret=${appSecret}&fb_exchange_token=${accessToken}`;
      const { access_token: longLivedUserToken } = await fetch(
        longLivedUserTokenEndpoint
      ).then((res) => res.json());
      const userIdEndpoint = `https://graph.facebook.com/v17.0/me?access_token=${longLivedUserToken}`;
      const { id: userId } = await fetch(userIdEndpoint).then((res) =>
        res.json()
      );
      const longLivedPageTokenEndpoint = `https://graph.facebook.com/v17.0/${userId}/accounts?access_token=${longLivedUserToken}`;
      const { data } = await fetch(longLivedPageTokenEndpoint).then((res) =>
        res.json()
      );
      setFinalToken(data?.[0].access_token);
    } catch (e) {
      setError(e);
    }
  };
  const onLoginClick = () => {
    window.FB.init({
      appId: appId,
      autoLogAppEvents: true,
      xfbml: true,
      version: "v11.0",
    });
    window.FB.login(
      function (response) {
        accessFlow(response);
      },
      {
        scope:
          "pages_show_list,ads_management,leads_retrieval,pages_read_engagement,pages_manage_metadata,pages_manage_ads",
      }
    );
  };

  useEffect(() => {
    (function (d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement(s);
      js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    })(document, "script", "facebook-jssdk");
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        padding: "20px",
      }}>
      <TextField
        id="app-id"
        label="App Id"
        variant="standard"
        fullWidth
        value={appId}
        onChange={(e) => setAppId(e.target.value)}
      />
      <TextField
        id="app-secret"
        label="App Secret"
        variant="standard"
        fullWidth
        value={appSecret}
        onChange={(e) => setAppSecret(e.target.value)}
      />
      <button onClick={onLoginClick}>Login and get page access token</button>
      {finalToken && (
        <div>
          <p>Page Access Token:</p>
          <p style={{ fontStyle: "italic", wordBreak: "break-word" }}>
            {finalToken}
          </p>
        </div>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};
export default App;
