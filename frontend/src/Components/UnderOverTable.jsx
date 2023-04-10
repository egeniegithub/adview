import { Table } from 'antd'
import React, { Fragment } from 'react'

const UnderOverTable = () => {
    const columns = [
        {
            title: "Year",
            dataIndex: "Year",
            key: "Year",
        },
        {
            title: "Month",
            dataIndex: "Month",
            key: "Month",
        },
        {
            title: "Client",
            dataIndex: "Client",
            key: "Client",
        },
        {
            title: "Budget",
            dataIndex: "Budget",
            key: "Budget",
        },
        {
            title: "Actuall",
            dataIndex: "Actuall",
            key: "Actuall",
        },
        {
            title: "Remaining",
            dataIndex: "Remaining",
            key: "Remaining",
        },
    ]
    const data = [
        {
            key: "1",
            Year: "2022",
            Month: "December",
            Client: "7 Oil",
            Budget: "$1000.00",
            Actuall: "$983.90",
            Remaining: "$16.10",
        },
        {
            key: "1",
            Year: "2022",
            Month: "December",
            Client: "7 Oil",
            Budget: "$1000.00",
            Actuall: "$983.90",
            Remaining: "$16.10",
        },
        {
            key: "1",
            Year: "2022",
            Month: "December",
            Client: "7 Oil",
            Budget: "$1000.00",
            Actuall: "$983.90",
            Remaining: "$16.10",
        },
        {
            key: "1",
            Year: "2022",
            Month: "December",
            Client: "7 Oil",
            Budget: "$1000.00",
            Actuall: "$983.90",
            Remaining: "$16.10",
        },
    ]
    return (
        <Fragment>
            <div className="TableMain">
            <Table
                style={{ height: "auto" }}
                className="adviewTable"
                columns={columns}
                dataSource={data}
            />
            </div>
        </Fragment>
    )
}

export default UnderOverTable