import axios from "axios";

export const GetServerCall =async (url)=>{
    return  await axios.get(
        `https://adview.io${url}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
}
export const PostServerCall =async (url,data)=>{
  return  await axios.post(`https://adview.io${url}`,data);
}