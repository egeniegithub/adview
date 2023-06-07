import axios from "axios";
import { GetServerCall } from "./apiCall";

export const getAccountDetails = async (access_token) => {
    let res =await GetServerCall('/bing-ads/getManagerActDetails/'+access_token)
    let name = res.data.data?.User["a:Name"]['a:FirstName']+ ' '+ res.data.data?.User["a:Name"]['a:LastName']
    let manager_id = res.data.data?.User['a:CustomerId']
    let connected_acc = res.data.linked_accounts?.AccountsInfo["a:AccountInfo"] || []
    let connected_accounts = []
    if(connected_acc)
        connected_acc.forEach(e => {
            connected_accounts.push({id:e['a:Id'], name: e['a:Name'], status: e['a:AccountLifeCycleStatus']})
        });
    return {name,connected_accounts,manager_id}
} 
