import axios from "axios";
import { PostServerCall } from "./apiCall";

export const getAssociatedCustomers = async (token) => {
  var config = {
    method: "get",
    url: "https://googleads.googleapis.com/v13/customers:listAccessibleCustomers",
    headers: {
      "developer-token": `${process.env.REACT_APP_GOOGLE_DEV_TOKEN}`,
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    let res = await axios(config);
    let details = await getActDetails(res.data.resourceNames, token);
    // console.log("check details ", details , res.data)
    return details;
  } catch (error) {
    // console.log(error);
  }
};

export const generateToken =async (code)=>{
  let response = await PostServerCall("/google-ads-apis/generate-tokens", {
    code,
  });
  if(response.data.tokens)
  return response.data.tokens
  else return null
}

const getActDetails = async (list, token) => {
  let details = [];
  if (!list.length) return [];
  for (let i = 0; i < list.length; i++) {
    const e = list[i];
    let arr = e.split("/");
    let id = arr[1];
    var data = {
      query:
        "SELECT customer.id,customer_client.descriptive_name,customer_client.id, customer.manager,customer.status,customer_client.status, customer.resource_name, customer.descriptive_name FROM customer_client WHERE customer_client.manager != TRUE",
    };
    var config = {
      method: "post",
      url: `https://googleads.googleapis.com/v13/customers/${id}/googleAds:search`,
      headers: {
        "developer-token": `${process.env.REACT_APP_GOOGLE_DEV_TOKEN}`,
        "login-customer-id": id,
        Authorization: `Bearer ${token}`,
      },
      data: data,
    };
    try {
      let res = await axios(config);
      // console.log("check in loop ", res.data)
      if (res.data?.results.length)
        res.data.results.forEach((el) => {
          details.push({ ...el.customerClient, manager_id: el.customer.id });
        });
    } catch (error) {}
  }
  return details;
};
