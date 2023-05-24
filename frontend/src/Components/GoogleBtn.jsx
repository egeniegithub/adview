import React, { useEffect, useState } from 'react';
import { LoginSocialFacebook, LoginSocialGoogle } from "reactjs-social-login";
import { Button, Modal, Switch, Table } from 'antd';
import { getAccosiatedUstomers } from '../Services/googleLinkedUsers';
import { Input } from 'antd';

export const GoogleBtn = ({ fetchAdsData, handleOk }) => {
    const [linkedUsers, setLinkedUsers] = useState([])
    const [seacrhedName, setSeacrhedName] = useState([])
    const [filteredLinkedUsers, setfilteredLinkedUsers] = useState([])
    const [showLinkedUserModal, setshowLinkedUserModal] = useState(false)
    const [userName, setuserName] = useState('')
    const [access_token, setaccess_token] = useState('')
    const [selectedRow, setselectedRow] = useState({})


    const GResponseHandler = async (response) => {
        // console.log("Google", response)
        if(!response.access_token) 
            return
        let list =await getAccosiatedUstomers(response.access_token)
        if(list?.length){
            // loop through list and add key 
            list.forEach((ele,i)=>{
                ele.key = i+1
                ele.auto_track = false
            })
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

    useEffect(()=>{
        let temp = [...linkedUsers]
        let filterArr = temp.filter(el=>{
            if(el.descriptiveName.toLowerCase().includes(seacrhedName))
                return {...el}
        })
        setfilteredLinkedUsers(filterArr)
    },[seacrhedName])

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            let {id: customer_id, manager_id} = selectedRows[0]
            setselectedRow({customer_id,manager_id})
        },
        getCheckboxProps: (record) => ({
            name: record.descriptiveName,
        }),
    };

    const handleConnect =()=>{
        if(!selectedRow.customer_id)
            return
        setshowLinkedUserModal(false)
        fetchAdsData(access_token, 'google',userName,selectedRow.customer_id,selectedRow.manager_id)
        setSeacrhedName('')
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
            {!showLinkedUserModal && <LoginSocialGoogle
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
            </LoginSocialGoogle>}

            <Modal
                title="Linked Accounts"
                width={"60%"}
                open={showLinkedUserModal}
                onOk={()=>{setshowLinkedUserModal(false)}}
                closable = {false}
                footer={null}
            >
                <Input onChange={({target})=>{setSeacrhedName(target.value)}} placeholder="Search by name.." style={{width:"50%", float:'right',marginBottom:'.3rem'}} />
                <Table
                    rowSelection={{
                        type:'radio',
                        ...rowSelection,
                    }}
                    columns={[
                    {
                        title: "AD ACCOUNT",
                        dataIndex: "descriptiveName",
                        key: "descriptiveName",
                    },
                    {
                        title: "AD ACCOUNT ID",
                        dataIndex: "id",
                        key: "id"
                    },
                    {
                        title: "Status",
                        dataIndex: "status",
                        key: "status",
                    },
                    {
                        title: "AUTO TRACKING",
                        dataIndex: "status",
                        key: "status",
                        render: (text, record) => <Switch checked={record.auto_track} onChange={
                            ()=>{setLinkedUsers(
                            prevArray =>
                                prevArray.map(item => {
                                if (item.id == record.id) {
                                    return {
                                        ...item,
                                        auto_track : !item.auto_track
                                    };
                                }
                                else
                                    return { ...item };
                                })
                            )}
                        }/>
                    },
                    ]}
                    dataSource={seacrhedName != '' ? filteredLinkedUsers : linkedUsers}
                />
                <div style={{display :'flex',gap:'2%'}}>
                    <Button type='primary' onClick={handleConnect}>Connect</Button>
                    <Button onClick={()=>{setshowLinkedUserModal(false);setLinkedUsers([])}}>Cancel</Button>
                </div>
            </Modal>
        </>
    );
}
