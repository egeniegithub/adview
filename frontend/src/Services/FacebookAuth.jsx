export const FacebookAuthResponse = async (response) => {
    console.log('facebook response:', response)
    await fetch(
        `${process.env.REACT_APP_API_URL}/platform-tokens`, {
        method: "post",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: response.email,
            m_token: response.accessToken
        })
    }
    ).then((res) => res.json())
        .then((data) => {
            localStorage.setItem('m_token', data.isemailExist.m_token)
            localStorage.setItem('loggedIn_by', 'Facebook')
        });
    return response
}