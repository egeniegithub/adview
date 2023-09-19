import React, { Fragment } from 'react'
import MonthlyLogTable from '../Components/MonthlyLogTable'
import Layout from '../Layout/Layout'

const MonthlyLogScreen = () => {
    return (
        <Fragment>
            <Layout />
            <MonthlyLogTable />
        </Fragment>
    )
}

export default MonthlyLogScreen