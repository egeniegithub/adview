import React, { useState } from 'react';
import { LoginSocialFacebook, LoginSocialGoogle } from "reactjs-social-login";
import { Button, Modal, Table } from 'antd';
import { getAccosiatedUstomers } from '../Services/googleLinkedUsers';

export const GoogleBtn = ({ fetchAdsData, handleOk }) => {
    const [linkedUsers, setLinkedUsers] = useState([])
    const [showLinkedUserModal, setshowLinkedUserModal] = useState(false)
    const [userName, setuserName] = useState('')
    const [access_token, setaccess_token] = useState('')
    const [isloading, setIsloading] = useState(true)

    const GResponseHandler = async (response) => {
        console.log("Google", response)
        if(!response.access_token) 
            return
        let list =await getAccosiatedUstomers(response.access_token)
        if(list?.length){
            setLinkedUsers(list)
            setshowLinkedUserModal(true)
            setuserName(response.name)
            setaccess_token(response.access_token)
        }
    }

    let logedInUsers = JSON.parse(localStorage.getItem('LOGED_IN_USERS')) || {}
    let id = localStorage.getItem('id')
    let userExist = logedInUsers[id]

    const handleRowLogout = ()=>{
        delete userExist?.google;
        logedInUsers[id] = userExist
        localStorage.setItem("LOGED_IN_USERS", JSON.stringify(logedInUsers));
        handleOk()
    }

    if(userExist?.google?.name)
        return(
            <div style={{display:'flex',flexFlow:'column',gap:'1%'}}>
                <Button disabled className="ModalBtn" style={{color:'#646464'}} type="primary">
                    {userExist?.google?.name}
                </Button>
                <Button onClick={handleRowLogout}>Logout Google</Button>
            </div>
            
        )
    return (
        <>
            <LoginSocialGoogle
                    // client_id={'828028257241-vhnmormtqapi8j744f086ee5shoc5380.apps.googleusercontent.com'} client account
                    client_id={'828028257241-vhnmormtqapi8j744f086ee5shoc5380.apps.googleusercontent.com'}
                    scope="openid profile email https://www.googleapis.com/auth/adwords"
                    discoveryDocs="claims_supported"
                    access_type="offline"
                    redirect_uri={`https://adview.io/`}
                    onResolve={({ provider, data }) => {
                        GResponseHandler(data)
                    }}
                    onReject={err => {
                        GResponseHandler(err)
                    }}
                >
                    <Button className="ModalBtn" type="primary">
                        google Ads
                    </Button>
            </LoginSocialGoogle>

            <Modal
                title="Linked Accounts"
                width={"55%"}
                open={showLinkedUserModal}
                onOk={()=>{setshowLinkedUserModal(false)}}
                closable = {false}
                footer={null}
            >
                <Table
                    style={{ height: "auto" }}
                    pagination={false}
                    columns={[
                    {
                        title: "ID",
                        dataIndex: "id",
                        key: "id",
                        render: (text, record) => <a onClick={() => {
                        setshowLinkedUserModal(false)
                        let {id: customer_id, manager_id} = record
                        fetchAdsData(access_token, 'google',userName,customer_id,manager_id)
                        console.log("row clicked ", record)
                        }}>{text}</a>
                    },
                    {
                        title: "Name",
                        dataIndex: "descriptiveName",
                        key: "descriptiveName",
                    },
                    {
                        title: "Status",
                        dataIndex: "status",
                        key: "status",
                    },
                    ]}
                    dataSource={linkedUsers}
                />
            </Modal>
        </>
    );
}
