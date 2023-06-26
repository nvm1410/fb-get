import React, { useState, useEffect } from "react";
const APP_ID = "1388353131952099";
const APP_SECRET = "c46a85e5c6e353e3d5f215e5e4aee00a";
const App = () => {
  const [isLoggedin, setIsLoggedin] = useState(false);

  const onLoginClick = () => {
    window.FB.login(
      async function (response) {
        const accessToken = response.authResponse.accessToken;
        const longLivedUserTokenEndpoint = `https://graph.facebook.com/v17.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${APP_ID}&client_secret=${APP_SECRET}&fb_exchange_token=${accessToken}`;
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
        console.log("final token", data?.[0].access_token);
      },
      {
        scope:
          "pages_show_list,ads_management,leads_retrieval,pages_read_engagement,pages_manage_metadata,pages_manage_ads",
      }
    );
  };

  useEffect(() => {
    window.fbAsyncInit = () => {
      window.FB.init({
        appId: APP_ID,
        autoLogAppEvents: true,
        xfbml: true,
        version: "v11.0",
      });
    };
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
    <div>
      <button onClick={onLoginClick}>Login with Facebook</button>
    </div>
  );
};
export default App;
