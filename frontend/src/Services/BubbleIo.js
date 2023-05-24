import axios from "axios";


export const getBubbleUsers = () => {

    const site_uri = 'https://testgoogleads.bubbleapps.io/version-test/api/1.1/obj'
    const token = '68c574be9db0fe5aea000eb325eb28ae'
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: site_uri,
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };

    axios.request(config)
        .then((response) => {
            return response.data
            // console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
            // console.log(error.response.data);
        });

}
