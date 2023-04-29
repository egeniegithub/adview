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
	return res.data
} catch (error) {
	console.log(error);
}

} 