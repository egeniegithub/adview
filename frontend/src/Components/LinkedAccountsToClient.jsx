import { FacebookFilled, GoogleSquareFilled, LinkedinFilled, LoadingOutlined } from '@ant-design/icons'
import { Button, Collapse, Modal, Spin, Table } from 'antd'
import React, { useState } from 'react'
import { GetServerCall } from '../Services/apiCall';
import { BingIcon, GoogleIcon, LinkedinIcon, MetaIcon } from '../icons/Icons';
const { Panel } = Collapse;
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

export const LinkedAccountsToClient = ({ showClientLinkedActsModal, setshowModal, isMainLoading, client_name = '', userData: { google_client_linked_accounts, email,facebook_client_linked_accounts,linkedin_client_linked_accounts,bing_client_linked_accounts,is_meta_login,is_google_login,is_bing_login,is_linkedin_login }, refreshData }) => {
    const [isloading, setIsloading] = useState(isMainLoading)
    const gLinkedAccountsToClient = google_client_linked_accounts ? JSON.parse(google_client_linked_accounts) : []
    const fLinkedAccountsToClient = facebook_client_linked_accounts ? JSON.parse(facebook_client_linked_accounts) : []
    const LLinkedAccountsToClient = linkedin_client_linked_accounts ? JSON.parse(linkedin_client_linked_accounts) : []
    const BingLinkedAccountsToClient = bing_client_linked_accounts ? JSON.parse(bing_client_linked_accounts) : []



    const handlelinkGoogle = async (item, isRelink) => {
        setIsloading(true)
        let uri = isRelink ? '/google-ads-apis/relink-customer/' : '/google-ads-apis/unlink-customer/'
        const res = await GetServerCall(uri + item.id + '/' + email)
        refreshData()
        setIsloading(false)
    }

    const handlelinkMeta = async (item, isRelink) => {
        setIsloading(true)
        let uri = isRelink ? '/meta-ads/relink-customer/' : '/meta-ads/unlink-customer/'
        const res = await GetServerCall(uri + item.id + '/' + email)
        refreshData()
        setIsloading(false)
    }

    const handlelinkLinkedin = async (item, isRelink) => {
        setIsloading(true)
        let uri = isRelink ? '/linkedin-ads/relink-customer/' : '/linkedin-ads/unlink-customer/'
        const res = await GetServerCall(uri + item.id + '/' + email)
        setIsloading(false)
        refreshData()
    }
    const handlelinkBing = async (item, isRelink) => {
        setIsloading(true)
        let uri = isRelink ? '/bing-ads/relink-customer/' : '/bing-ads/unlink-customer/'
        const res = await GetServerCall(uri + item.id + '/' + email)
        setIsloading(false)
        refreshData()
    }



    let logedInUsers = JSON.parse(localStorage.getItem('LOGED_IN_USERS')) || {}
    let id = localStorage.getItem('id')
    let userExist = logedInUsers[id]
    if (!userExist?.google?.name && !userExist?.facebook?.name && !userExist?.linkedin?.name)
        return null
    return (
        <div style={{ marginTop: '2vh' }} >
            <Spin indicator={antIcon} spinning={isloading} size="large" style={{ marginLeft: '2vw' }}>
                <Collapse defaultActiveKey={['1']} bordered={false} style={{ backgroundColor: 'transparent' }}>
                    <Panel header={getHeader('Google Ads',<GoogleIcon/>)} key="1" style={panelStyle}>
                        <h5>Accounts Currently Linked </h5>
                        <div style={{ border: "1px",borderColor:'#3e3e3e2e', borderBottom: "0px", borderStyle: 'solid' }}>
                            <Table
                                className='rowCustomeClassName'
                                pagination={false}
                                columns={[
                                    {
                                        title: "AD ACCOUNT",
                                        dataIndex: "descriptiveName",
                                        key: "descriptiveName",
                                        render: (text, item) => text ? text : '-'
                                    },
                                    {
                                        title: "AD ACCOUNT ID",
                                        dataIndex: "id",
                                        key: "id",
                                        render: (text, item) => text
                                    },
                                    {
                                        title: "Action",
                                        dataIndex: "status",
                                        key: "status",
                                        render: (text, item) => !item.unlinked ? <Button onClick={() => handlelinkGoogle(item)} style={{ ...btnStyle}}>
                                            Unlink
                                        </Button> : <Button onClick={() => handlelinkGoogle(item, true)} style={{ ...btnStyle }}>
                                            Relink
                                        </Button>
                                    },
                                ]}
                                dataSource={is_google_login == "1" ? gLinkedAccountsToClient :[]}
                            />
                        </div>
                    </Panel>
                    <Panel header={getHeader('Bing Ads',<BingIcon/>)} key="2" style={panelStyle}>
                        <h5>Accounts Currently Bing </h5>
                        <div style={{ border: "1px", borderBottom: "0px", borderStyle: 'solid' }}>
                            <Table
                                className='rowCustomeClassName'
                                pagination={false}
                                columns={[
                                    {
                                        title: "AD ACCOUNT",
                                        dataIndex: "descriptiveName",
                                        key: "descriptiveName",
                                        render: (text, item) => text
                                    },
                                    {
                                        title: "AD ACCOUNT ID",
                                        dataIndex: "id",
                                        key: "id",
                                        render: (text, item) => text
                                    },
                                    {
                                        title: "",
                                        dataIndex: "status",
                                        key: "status",
                                        render: (text, item) => !item.unlinked ? <Button onClick={() => handlelinkBing(item)} style={{ ...btnStyle}}>
                                            Unlink
                                        </Button> : <Button onClick={() => handlelinkBing(item, true)} style={{ ...btnStyle }}>
                                            Relink
                                        </Button>
                                    },
                                ]}
                                dataSource={is_bing_login == "1" ? BingLinkedAccountsToClient :[]}
                            />
                        </div>
                    </Panel>
                    <Panel header={getHeader('Linkedin Ads',<LinkedinIcon/>)} key="3" style={panelStyle}>
                        <h5>Accounts Currently Linked </h5>
                        <div style={{ border: "1px", borderBottom: "0px", borderStyle: 'solid' }}>
                            <Table
                                className='rowCustomeClassName'
                                pagination={false}
                                columns={[
                                    {
                                        title: "AD ACCOUNT",
                                        dataIndex: "descriptiveName",
                                        key: "descriptiveName",
                                        render: (text, item) => text
                                    },
                                    {
                                        title: "AD ACCOUNT ID",
                                        dataIndex: "id",
                                        key: "id",
                                        render: (text, item) => text
                                    },
                                    {
                                        title: "",
                                        dataIndex: "status",
                                        key: "status",
                                        render: (text, item) => !item.unlinked ? <Button onClick={() => handlelinkLinkedin(item)} style={{ ...btnStyle}}>
                                            Unlink
                                        </Button> : <Button onClick={() => handlelinkLinkedin(item, true)} style={{ ...btnStyle }}>
                                            Relink
                                        </Button>
                                    },
                                ]}
                                dataSource={is_linkedin_login == '1'? LLinkedAccountsToClient :[]}
                            
                            />
                        </div>
                    </Panel>
                    <Panel header={getHeader('Meta Ads',<MetaIcon/>)} key="4" style={panelStyle}>
                        <h5>Accounts Currently Linked </h5>
                        <div style={{ border: "1px", borderBottom: "0px", borderStyle: 'solid' }}>
                            <Table
                                className='rowCustomeClassName'
                                pagination={false}
                                columns={[
                                    {
                                        title: "AD ACCOUNT",
                                        dataIndex: "descriptiveName",
                                        key: "descriptiveName",
                                        render: (text, item) => text
                                    },
                                    {
                                        title: "AD ACCOUNT ID",
                                        dataIndex: "id",
                                        key: "id",
                                        render: (text, item) => text
                                    },
                                    {
                                        title: "",
                                        dataIndex: "status",
                                        key: "status",
                                        render: (text, item) => !item.unlinked ? <Button onClick={() => handlelinkMeta(item)} style={{ ...btnStyle}}>
                                            Unlink
                                        </Button> : <Button onClick={() => handlelinkMeta(item, true)} style={{ ...btnStyle }}>
                                            Relink
                                        </Button>
                                    },
                                ]}
                                dataSource={is_meta_login == '1' ? fLinkedAccountsToClient :[]}
                            />
                        </div>
                    </Panel>
                </Collapse>
            </Spin>
        </div>
    )
}

const getHeader = (label, icons) => <div style={{display:'flex',alignItems:'center',gap:'4px'}}>{icons} {label}</div>


const btnStyle = {
    color: '#fff', backgroundColor: '#808080', flexBasis: '17%', height: "2.8vh",margin: "4px 0",    padding: "0px 20px"
}
const panelStyle = {
    border: 'none',
};