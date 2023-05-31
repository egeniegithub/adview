import { FacebookFilled, GoogleSquareFilled, LinkedinFilled, LoadingOutlined } from '@ant-design/icons'
import { Button, Collapse, Modal, Spin, Table } from 'antd'
import React, { useState } from 'react'
import { GetServerCall } from '../Services/apiCall';
import { BingIcon, GoogleIcon, LinkedinIcon, MetaIcon } from '../icons/Icons';
const { Panel } = Collapse;
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

export const LinkedAccountsToClient = ({ showClientLinkedActsModal, setshowModal, isMainLoading, currentProvider, client_name = '', userData: { google_client_linked_accounts, email }, refreshData }) => {
    const [isloading, setIsloading] = useState(isMainLoading)
    const gLinkedAccountsToClient = google_client_linked_accounts ? JSON.parse(google_client_linked_accounts) : []


    const handlelink = async (item, isRelink) => {
        setIsloading(true)
        let uri = isRelink ? '/google-ads-apis/relink-customer/' : '/google-ads-apis/unlink-customer/'
        const res = await GetServerCall(uri + item.id + '/' + email)
        refreshData()
        setIsloading(false)
    }


    let logedInUsers = JSON.parse(localStorage.getItem('LOGED_IN_USERS')) || {}
    let id = localStorage.getItem('id')
    let userExist = logedInUsers[id]
    console.log("check user  exists", userExist)
    if (!userExist?.google?.name)
        return null
    return (
        <div style={{ marginTop: '2vh' }} >
            <Spin indicator={antIcon} spinning={isloading} size="large" style={{ marginLeft: '2vw' }}>
                <Collapse defaultActiveKey={['1']} bordered={false} style={{ backgroundColor: 'transparent' }}>
                    <Panel header={getHeader('Google Ads',<GoogleIcon/>)} key="1" style={panelStyle}>
                        <h5>Accounts Currently Linked {currentProvider}</h5>
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
                                        render: (text, item) => !item.unlinked ? <Button onClick={() => handlelink(item)} style={{ ...btnStyle}}>
                                            Unlink
                                        </Button> : <Button onClick={() => handlelink(item, true)} style={{ ...btnStyle }}>
                                            Relink
                                        </Button>
                                    },
                                ]}
                                dataSource={gLinkedAccountsToClient}
                            />
                        </div>
                    </Panel>
                    <Panel header={getHeader('Bing Ads',<BingIcon/>)} key="2" style={panelStyle}>
                        <h5>Accounts Currently Linked {currentProvider}</h5>
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
                                        render: (text, item) => <Button onClick={() => handlelink(item)} style={{ ...btnStyle}}>
                                            Unlink
                                        </Button>
                                    },
                                ]}
                                dataSource={[]}
                            />
                        </div>
                    </Panel>
                    <Panel header={getHeader('Linkedin Ads',<LinkedinIcon/>)} key="3" style={panelStyle}>
                        <h5>Accounts Currently Linked {currentProvider}</h5>
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
                                        render: (text, item) => <Button style={{ ...btnStyle}}>
                                            Unlink
                                        </Button>
                                    },
                                ]}
                                dataSource={[]}
                            />
                        </div>
                    </Panel>
                    <Panel header={getHeader('Meta Ads',<MetaIcon/>)} key="4" style={panelStyle}>
                        <h5>Accounts Currently Linked {currentProvider}</h5>
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
                                        render: (text, item) => <Button style={{ ...btnStyle }}>
                                            Unlink
                                        </Button>
                                    },
                                ]}
                                dataSource={[]}
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