import axios from "axios";

export const GetServerCall =async (url)=>{
    return  await axios.get(
        `https://api.adview.io${url}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
}
export const PostServerCall =async (url,data)=>{
  return  await axios.post(`https://api.adview.io${url}`,data);
}