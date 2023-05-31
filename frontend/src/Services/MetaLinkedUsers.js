import axios from "axios";

export const getLinkedAdsAccounts = async (token) => {
    let headers = {
        'Accept': '*/*',
        'Connection': 'Keep-Alive',
        'Host': 'graph.facebook.com'
    }
    try {
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `https://graph.facebook.com/v16.0/Me/adaccounts?fields=name,business_name,account_status,id&access_token=${token}`,
            headers: headers
        };

        let res = await axios.request(config)
        console.log("cehck facebook ", res.data.data)
        return res.data.data

    } catch (error) {
        
    }
} 