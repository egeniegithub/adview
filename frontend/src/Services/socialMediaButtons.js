import { handleLogoutIndicator } from "../utils/helper";
import { GetServerCall } from "./apiCall";

let id = localStorage.getItem("id");

export const handleGoogleRowLogout = async (
  getData,
  handleError,
  userData,
  handleOk,
  notify
) => {
  try {
    let res = await GetServerCall(
      "/google-ads-apis/logout-user/" + userData.email
    );
    if (res.data.status !== "success") return handleError();
    getData();
    // check is indicator exists
    handleLogoutIndicator(id, "google");
    handleOk();
    notify.success({
      description: "Logout Success.",
    });
  } catch (error) {
    handleError();
  }
};

export const handleFacebookRowLogout = async (
  getData,
  handleError,
  userData,
  handleOk,
  notify
) => {
  try {
    let res = await GetServerCall("/meta-ads/logout-user/" + userData.email);
    if (res.data.status !== "success") return handleError();
    getData();
    handleLogoutIndicator(id, "facebook");
    handleOk();
    notify.success({
      description: "Logout Success.",
    });
  } catch (error) {
    handleError();
  }
};

export const handleBingRowLogout = async (
  getData,
  handleError,
  userData,
  handleOk,
  notify
) => {
  try {
    let res = await GetServerCall("/bing-ads/logout-user/" + userData.email);
    if (res.data.status !== "success") return handleError();
    getData();
    // check is indicator exists
    handleLogoutIndicator(id, "bing");
    handleOk();
    notify.success({
      description: "Logout Success.",
    });
  } catch (error) {
    handleError();
  }
};

export const handleLinkedinRowLogout = async (
  getData,
  handleError,
  userData,
  handleOk,
  notify
) => {
  try {
    let res = await GetServerCall(
      "/linkedin-ads/logout-user/" + userData.email
    );
    if (res.data.status !== "success") return handleError();
    // check is indicator exists
    let id = localStorage.getItem("id");
    handleLogoutIndicator(id, "linkedin");
    getData();
    handleOk();
    return notify.success({
      description: "Logout Success.",
    });
  } catch (error) {
    handleError();
  }
};
