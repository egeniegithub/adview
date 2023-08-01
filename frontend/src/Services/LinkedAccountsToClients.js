import { GetServerCall } from "./apiCall";

export const HandleServerCall = async (id, uri,email, isRelink, handleError) => {
  try {
    let res = await GetServerCall(uri + id + "/" + email);
    if (res.data.status !== "success") return handleError(isRelink);
  } catch (error) {
    handleError(isRelink);
  }
};
