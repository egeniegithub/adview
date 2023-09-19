import React, { Fragment } from "react";
import Layout from "../Layout/Layout";
import AccountsTable from "../Components/AccountsTable";

function AccountsScreen() {
  return (
    <Fragment>
      <Layout />
      <AccountsTable />
    </Fragment>
  );
}

export default AccountsScreen;
