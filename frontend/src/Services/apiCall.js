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