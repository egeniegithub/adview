import axios from "axios";

export const getLinkedAdsAccounts = async (token) => {
  let headers = {
    Accept: "*/*",
    Connection: "Keep-Alive",
    Host: "graph.facebook.com",
  };
  try {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `https://graph.facebook.com/v16.0/Me?fields=adaccounts{name,business_name,account_status,id},businesses{client_ad_accounts{name,business_name,account_status,id}}&access_token=${token}`,
      headers: headers,
    };
    let res = await axios.request(config);
    let list =[]
    if(res.data.adaccounts)
      list = [...res.data.adaccounts.data]
    if(res.data?.businesses?.data){
      let busArr = res.data?.businesses?.data || []
      busArr.forEach(ele => {
        if(ele.client_ad_accounts)
          list = [...list,...ele.client_ad_accounts.data]
      });
    }
    return list;
  } catch (error) {}
};

export const getMetaRefreshToken = async (token) => {
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `https://graph.facebook.com/v16.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${process.env.REACT_APP_FB_CLIENT_ID}&client_secret=${process.env.REACT_APP_FB_CLIENT_SECRET}&fb_exchange_token=${token}`,
    headers: {},
  };

  try {
    let res = await axios.request(config);
    return res.data.access_token;
  } catch (error) {}
};
