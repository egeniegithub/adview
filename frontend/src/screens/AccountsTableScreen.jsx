import React, { Fragment } from 'react'
import Layout from '../Layout/Layout'
import AccountsTable from '../Components/AccountsTable'

function AccountsTableScreen() {
    return (
        <Fragment>
            <Layout />
            <AccountsTable/>
        </Fragment>
    )
}

export default AccountsTableScreen