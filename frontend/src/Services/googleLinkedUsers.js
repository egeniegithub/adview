import axios from "axios";

export const getAccosiatedUstomers =async (token)=>{
var config = {
  method: 'get',
  url: 'https://googleads.googleapis.com/v13/customers:listAccessibleCustomers',
  headers: { 
    'developer-token': 'NTipfGy1nGO2oAFRaSdFiw', 
    'Authorization': `Bearer ${token}`}
};
  try {
    let res = await axios(config)
    let details = await getActDetails(res.data.resourceNames,token)
    console.log("check details ", details , res.data)
    return details
  } catch (error) {
      console.log(error);
    }
} 

const getActDetails  =async(list,token) =>{
  let details = []
  if(!list.length)
  return []
  for (let i = 0; i < list.length; i++) {
    const e = list[i];
    let arr = e.split("/");
    let id= arr[1]
    var data = {"query":"SELECT customer.id, customer.manager, customer.resource_name, customer.descriptive_name FROM customer"};
    var config = {
          method: 'post',
          url: `https://googleads.googleapis.com/v13/customers/${id}/googleAds:search`,
          headers: { 
            'developer-token': 'NTipfGy1nGO2oAFRaSdFiw', 
            'login-customer-id': id, 
            'Authorization': `Bearer ${token}`
          },
          data : data
        };
        try {
          let res = await axios(config)
          console.log("check in loop ", res.data)
          details.push(res.data.results[0].customer)
        } catch (error) {
          
        }
  }
  return details
}