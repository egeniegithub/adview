// This file is not being used
import { PublicClientApplication } from '@azure/msal-browser';

const msalConfig = {
    auth: {
        clientId: process.env.REACT_APP_BING_CLIENT,
        authority: "https://login.microsoftonline.com/f8cdef31-a31e-4b4a-93e4-5f571e91255a",
        redirectUri: 'https://adview.io'
    }
};

const msalInstance = new PublicClientApplication(msalConfig);

export const loginWithBing = async () => {
    const loginRequest = {
        // scopes: ['openid', 'profile', 'https://ads.microsoft.com/Automation', 'https://ads.microsoft.com/CustomerManagement']
        scopes: ['profile',]
    };
    try {
        const authResult = await msalInstance.loginPopup(loginRequest);
        // console.log('Access token:', authResult.accessToken);
        // console.log('Refresh token:', authResult.refreshToken);
        return authResult;
    } catch (error) {
        // console.log(error, "erroroccured");
    }
};