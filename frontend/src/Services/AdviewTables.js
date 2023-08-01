import { GetServerCall, PostServerCall } from "./apiCall";
import { getStatus } from "../utils/helper";

export const FetchAds = async (
  accessToken,
  provider_name,
  email,
  customer_ids,
  manager_id,
  handleOk,
  getData,
  notify
) => {
  switch (provider_name) {
    case "google":
      {
        let { refresh_token, access_token } = accessToken;
        const data = {
          email,
          customer_ids,
          access_token,
          manager_id,
          refresh_token,
        };
        await AdsData(
          `/google-ads-apis/ObtainAdsData`,
          data,
          provider_name,
          notify,
          getData
        );
        handleOk();
      }
      break;

    case "facebook":
      {
        let { refresh_token, access_token } = accessToken;
        const data = {
          email,
          customer_ids,
          access_token,
          customer_names: manager_id,
          refresh_token,
        };
        await AdsData(
          `/meta-ads/ObtainMetaAdsData`,
          data,
          provider_name,
          notify,
          getData
        );
        handleOk();
      }
      break;

    case "bing":
      {
        let { refresh_token, access_token } = accessToken;
        const data = {
          email,
          customer_ids,
          access_token,
          refresh_token,
          customer_names: manager_id,
        };
        await AdsData(
          `/bing-ads/ObtainBingAdsData`,
          data,
          provider_name,
          notify,
          getData
        );
        handleOk();
      }
      break;
    case "linkedin":
      {
        let { refresh_token, access_token } = accessToken;
        const data = {
          email,
          customer_ids,
          refresh_token,
          access_token,
          customer_names: manager_id,
        };
        await AdsData(
          `/linkedin-ads/ObtainLinkedinAdsData`,
          data,
          provider_name,
          notify,
          getData
        );
        handleOk();
      }
      break;
    default:
      break;
  }
};

export const AdsData = async (uri, obj, provider_name, notify, getData) => {
  let res = await PostServerCall(uri, obj);
  handleResponse(res, provider_name, notify, getData);
};

export const handleResponse = (res, provider_name, notify, getData) => {
  let id = localStorage.getItem("id");
  if (res.data.err) {
    let is_sync_users_with_ads =
      JSON.parse(localStorage.getItem("is_sync_users_with_ads")) || {};
    is_sync_users_with_ads = {
      ...is_sync_users_with_ads,
      [id]: { ...is_sync_users_with_ads[id], [provider_name]: false },
    };
    localStorage.setItem(
      "is_sync_users_with_ads",
      JSON.stringify(is_sync_users_with_ads)
    );
    notify.error({
      description: "Error in Ads api",
    });
  } else {
    let is_sync_users_with_ads =
      JSON.parse(localStorage.getItem("is_sync_users_with_ads")) || {};
    if (is_sync_users_with_ads[id])
      is_sync_users_with_ads[id].provider_name =
        !is_sync_users_with_ads[id].provider_name;
    localStorage.setItem(
      "is_sync_users_with_ads",
      JSON.stringify(is_sync_users_with_ads)
    );
    notify.success({
      description: "Updated",
    });
  }
  getData();
};

export const clientData = async () => {
  const response = await GetServerCall(`/client-data`);
  let data = response.data;
  for (let i = 0; i < data.length; i++) {
    let { facebook = 0, bing = 0, linkedin = 0, google = 0, email } = data[i];
    if (!email) continue;
    data[i]["key"] = i + 1;
    data[i]["Link"] = "Link";
    data[i].monthly_spent =
      (facebook > 0 ? parseInt(facebook) : 0) +
      (google > 0 ? parseInt(google) : 0) +
      (bing > 0 ? parseInt(bing) : 0) +
      (linkedin > 0 ? parseInt(linkedin) : 0);
    data[i].remaining =
      parseInt(data[i].monthly_budget) - data[i].monthly_spent;
    data[i].status = getStatus(data[i].remaining);
  }
  return data;
};

export const activeClients = async () => {
  const response = await GetServerCall(`/client-data/actives`);
  const data = response.data;
  for (let i = 0; i < data.length; i++) {
    let { facebook = 0, bing = 0, linkedin = 0, google = 0 } = data[i];
    data[i].monthly_spent =
      (facebook > 0 ? parseInt(facebook) : 0) +
      (google > 0 ? parseInt(google) : 0) +
      (bing > 0 ? parseInt(bing) : 0) +
      (linkedin > 0 ? parseInt(linkedin) : 0);
    data[i].remaining =
      parseInt(data[i].monthly_budget) - data[i].monthly_spent;
    data[i].status = getStatus(data[i].remaining);
  }
  return data;
};

export const underOverData =async ()=>{
  let monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const response = await GetServerCall(
    `/client-data/get-monthly-clients-data`
  );
  let data = []
  if (!response.data.error) {
    data = response.data.list
    for (let i = 0; i < data.length; i++) {
      data[i]["key"] = i + 1;
      data[i].month = monthNames[data[i].month - 1];
    }
  }
  return data
}

