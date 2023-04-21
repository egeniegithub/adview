import axios from "axios";

export const GetServerCall =async (url)=>{
    return  await axios.get(
        `${process.env.REACT_APP_API_URL}${url}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
}