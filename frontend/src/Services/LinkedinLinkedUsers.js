import axios from "axios";
import { GetServerCall } from "./apiCall";

export const getLinkedAdsAccountsWithLinkedin = async (access_token) => {

    try {
        let res =await GetServerCall('/linkedin-ads/getManagerActDetails/'+access_token)
        return {...res.data}
    } catch (error) {

    }
} 