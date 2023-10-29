import { GetServerCall } from "./apiCall";
const redirect_uri_ver = 'https://adview.io/linkedin'
// const redirect_uri_ver = "http://localhost:3000/linkedin";

export const getLinkedAdsAccountsWithLinkedin = async (access_token) => {
  try {
    let res = await GetServerCall(
      "/linkedin-ads/getManagerActDetails/" + access_token
    );
    return { ...res.data };
  } catch (error) {}
};

export const handleAuth = (code,setStates,setUserName) => {
  let redirect_uri = redirect_uri_ver;
  let client_id = `${process.env.REACT_APP_LI_CLIENT_ID}`;
  let client_secret = `${process.env.REACT_APP_LI_CLIENT_SECRET}`;
  const params = {
    code,
    grant_type: "authorization_code",
    redirect_uri,
    client_id,
    client_secret,
  };
  const headers = new Headers({
    "Content-Type": "application/x-www-form-urlencoded",
    "x-cors-grida-api-key": "875c0462-6309-4ddf-9889-5227b1acc82c",
  });

  fetch(
    `https://cors.bridged.cc/https://www.linkedin.com/oauth/v2/accessToken`,
    {
      method: "POST",
      headers,
      body: new URLSearchParams(params),
    }
  )
    .then((response) => response.json())
    .then(function (response) {
      getUserInfo(response, code,setStates,setUserName);
    })
    .catch(function (error) {
      console.log(error);
    });
};

export  const getUserInfo = async (tokens, code,setStates,setUserName) => {
  linkedMultiLogin();
  let LinkedUsers = await getLinkedAdsAccountsWithLinkedin(
    tokens.access_token
  );
  if (LinkedUsers?.list?.length) {
    LinkedUsers.list.forEach((ele, i) => {
      ele.key = i + 1;
      ele.auto_track = false;
      ele.account_status = ele.status;
    });
    setStates(LinkedUsers,tokens,code)
  }
  fetch(
    `https://api.allorigins.win/get?url=${encodeURIComponent(
      "https://api.linkedin.com/v2/me?oauth2_access_token=" +
        tokens.refresh_token +
        "&projection=(id,profilePicture(displayImage~digitalmediaAsset:playableStreams),localizedLastName, firstName,lastName,localizedFirstName)"
    )}`,
    {
      method: "GET",
    }
  )
    .then((response) => response.json())
    .then((res) => {
      if (res.contents) {
        const response = JSON.parse(res.contents);
        let name =
          response.localizedFirstName + " " + response.localizedLastName;
        setUserName(name);
      }
    })
    .catch((err) => {});
};

export const linkedMultiLogin = () => {
  const popup = window.open(
    `https://linkedin.com/m/logout`,
    "linkedin-login",
    "width=1,height=1"
  );

  setTimeout(() => {
    popup.close();
  }, 5000);
};
