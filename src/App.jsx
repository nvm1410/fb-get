import React, { useState, useEffect } from "react";

const App = () => {
  const [isLoggedin, setIsLoggedin] = useState(false);

  const onLoginClick = () => {
    window.FB.login(
      function (response) {
        console.log(response);
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
        appId: "your-app-id",
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
