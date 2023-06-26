import { Spin, Table } from 'antd'
import React, { Fragment, useEffect, useState } from 'react'
import { GetServerCall } from '../Services/apiCall'
import { LoadingOutlined } from '@ant-design/icons'


const UnderOverTable = () => {
    const [isloading, setIsloading] = useState(true)
    const [list, setList] = useState([])
    useEffect(() => { getdata() }, [])

    const getdata = async () => {
        setIsloading(true)
        try {
            const response = await GetServerCall(`/client-data/get-monthly-clients-data`)
            if (!response.data.error) {
                let data = response.data.list || [];
                for (let i = 0; i < data.length; i++) {
                    data[i]["key"] = i + 1;
                    data[i].month = monthNames[data[i].month - 1]
                }
                setList(data || [])
            }
            setIsloading(false)
        } catch (error) {
            setIsloading(false)
        }
    }
    const columns = [
        {
            title: "Year",
            dataIndex: "year",
            key: "year",
        },
        {
            title: "Month",
            dataIndex: "month",
            key: "month",
        },
        {
            title: "Frequency",
            dataIndex: "frequency",
            key: "frequency",
        },
        {
            title: "Account",
            dataIndex: "client",
            key: "client",
        },
        {
            title: "Buyer",
            dataIndex: "buyer",
            key: "buyer",
        },
        {
            title: "Budget",
            dataIndex: "monthly_budget",
            key: "monthly_budget",
            render: (text) => text > 0 ? '$' + parseInt(text).toLocaleString() : '-'
        },
        {
            title: "Spend",
            dataIndex: "monthly_spent",
            key: "monthly_spent",
            render: (text) => text > 0 ? '$' + parseInt(text).toLocaleString() : '-'
        },
        {
            title: "Under/Over",
            dataIndex: "remaining",
            key: "remaining",
            render: (text) => !isNaN(text) ? '$' + parseInt(text).toLocaleString() : '-'
        },
    ]

    const antIcon = <LoadingOutlined style={{ fontSize: 22 }} spin />;

    return (
        <Fragment>
            <Spin tip="Loading..." indicator={antIcon} spinning={isloading} size="large" style={{ marginLeft: '2vw' }}>
                <div className="TableMain">
                    <Table
                        style={{ height: "auto" }}
                        scroll={{ x: 900 }}
                        className="adviewTable"
                        columns={columns}
                        dataSource={list}
                        pagination={false}
                    />
                </div>
            </Spin>
        </Fragment>
    )
}

export default UnderOverTable


var monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];