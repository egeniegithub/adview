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


export const getMetaRefreshToken = async (token) => {
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `https://graph.facebook.com/v16.0/oauth/access_token?grant_type=fb_exchange_token&client_id=266566095742191&client_secret=da51f303c48b7fa2411f269ab064a1b7&fb_exchange_token=${token}`,
        headers: {}
    };

    try {
        let res = await axios.request(config)
        console.log("cehck refrsh responce ", res.data)
        return res.data.access_token
    } catch (error) {
        console.log("cehck refrsh error ", error)
    }

} 