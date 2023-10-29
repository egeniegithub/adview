import { Button, Input, Modal, Switch, Table } from "antd";
import React, { useEffect, useState } from "react";
import { LinkedInCallback } from "react-linkedin-login-oauth2";
import { useLinkedIn } from "react-linkedin-login-oauth2";
import { handleAuth } from "../../Services/LinkedinLinkedUsers";
import { SearchOutlined } from "@ant-design/icons";
import { handleLinkedinRowLogout } from "../../Services/socialMediaButtons";

export const LinkedinBtn = ({
  fetchAdsData,
  handleOk,
  userData,
  getData,
  notify,
}) => {
  const [linkedUsers, setLinkedUsers] = useState([]);
  const [searchedName, setSearchedName] = useState("");
  const [filteredLinkedUsers, setFilteredLinkedUsers] = useState([]);
  const [showLinkedUserModal, setShowLinkedUserModal] = useState(false);
  const [userName, setUserName] = useState("linkedUser");
  const [access_token, setAccess_token] = useState("");
  const [refresh_token, setRefresh_token_token] = useState("");
  const [selectedRow, setSelectedRow] = useState({});
  const [authCodeMultiLogin, setAuthCodeMultiLogin] = useState("");

  const handleConnect = () => {
    if (!selectedRow.customer_ids.length) return;
    let customer_ids = selectedRow.customer_ids.join(",");
    let customer_names = selectedRow.customer_names.join(",");
    setShowLinkedUserModal(false);
    fetchAdsData(
      { access_token, refresh_token },
      "linkedin",
      userName,
      customer_ids,
      customer_names,
      authCodeMultiLogin
    );
    setSearchedName("");
  };
  useEffect(() => {
    let temp = [...linkedUsers];
    let filterArr = temp.filter((el) => {
      if (el.name?.toLowerCase().includes(searchedName)) return { ...el };
      else return false
    });
    setFilteredLinkedUsers(filterArr);
  }, [searchedName]);

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      let tempArr = [];
      let namesArr = [];
      selectedRows.forEach((el) => {
        tempArr.push(el.id);
        namesArr.push(el.name);
      });
      if (!tempArr.length) return setSelectedRow({});
      setSelectedRow({
        customer_ids: [...tempArr],
        customer_names: [...namesArr],
      });
    },
    getCheckboxProps: (record) => ({
      name: record.name,
    }),
  };

  //http://localhost:3000/linkedin?error=unauthorized_scope_error&error_description=Scope+%26quot%3Br_liteprofile%26quot%3B+is+not+authorized+for+your+application&state=gKivQapCTNK6jlxympdu 

  const { linkedInLogin } = useLinkedIn({
    clientId: `${process.env.REACT_APP_LI_CLIENT_ID}`,
    redirectUri: `${window.location.origin}/linkedin`,
    scope: "r_liteprofile,rw_ads,r_ads,r_ads_reporting",
    onSuccess: (code) => {
      console.log(`${window.location.origin}/linkedin`, "linkedIn");
      console.log(`${process.env.REACT_APP_LI_CLIENT_ID}`, "clientId");
      throttledFunction(code);
    },
    onError: (error) => {
      console.log("error",error);
      console.log("m running dont worry");
      console.log(`${process.env.REACT_APP_LI_CLIENT_ID}`, "clientId");
      console.log(`${window.location.origin}/linkedin`, "linkedIn");
    },
  });

  function doSomething(code) {
    handleAuth(code,setStates,setUserName);
  }
  // throttled used to prevent multi api calls
  const throttledFunction = throttle(doSomething, 1000);

  const setStates = (LinkedUsers,tokens,code)=>{
    setLinkedUsers(LinkedUsers.list);
    setShowLinkedUserModal(true);
    setAccess_token(tokens.access_token);
    setRefresh_token_token(tokens.refresh_token);
    setAuthCodeMultiLogin(code);
  }

  const handleRowLogout = async () => {
    handleLinkedinRowLogout(getData,handleError,userData,handleOk,notify)
  };

  const handleError = () => {
    notify.error({
      description: "Something went wrong...",
    });
  };

  if (userData?.is_linkedin_login === "1")
    return (
      <div style={{ display: "flex", flexFlow: "column" }}>
        <Button
          disabled
          className="ModalBtn"
          style={{ color: "#fff", backgroundColor: "#018F0F" }}
        >
          LI Ads
        </Button>
        <Button onClick={handleRowLogout}>Logout Linkedin</Button>
      </div>
    );

  const popupWindowURL = new URL(window.location.href);
  const code = popupWindowURL.searchParams.get("code");
  if (code) return <LinkedInCallback />;
  return (
    <>
      <div>
        <Button onClick={linkedInLogin} className="ModalBtn" type="primary">
          LI Ads
        </Button>
      </div>
      <Modal
        title={
          <h5 style={{ padding: "2.5% 0% 0px 2.5%" }}>
            Select Linkedin ad Accounts to link
          </h5>
        }
        width={"67%"}
        open={showLinkedUserModal}
        className="responsive_warper"
        onOk={() => {
          setShowLinkedUserModal(false);
        }}
        closable={false}
        bodyStyle={{ padding: "2.5% 3.5%" }}
        footer={null}
      >
        <Table
          scroll={{ x: 700 }}
          bordered
          className="rowCustomerClassName2"
          rowSelection={{
            type: "checkbox",
            ...rowSelection,
          }}
          columns={[
            {
              title: "AD ACCOUNT",
              dataIndex: "name",
              key: "name",
            },
            {
              title: "AD ACCOUNT ID",
              dataIndex: "id",
              key: "id",
            },
            {
              title: "Status",
              dataIndex: "account_status",
              key: "account_status",
            },
            {
              title: "AUTO TRACKING",
              dataIndex: "status",
              key: "status",
              width: "15%",
              render: (text, record) => (
                <Switch
                  checked={record.auto_track}
                  onChange={() => {
                    setLinkedUsers((prevArray) =>
                      prevArray.map((item) => {
                        if (item.id === record.id) {
                          return {
                            ...item,
                            auto_track: !item.auto_track,
                          };
                        } else return { ...item };
                      })
                    );
                  }}
                />
              ),
            },
            {
              title: () => (
                <div style={{ position: "relative" }}>
                  <Input
                    onChange={({ target }) => {
                      setSearchedName(target.value);
                    }}
                    placeholder="Search by name.."
                    style={{
                      width: "90%",
                      marginBottom: ".3rem",
                      borderRadius: "30px",
                    }}
                  />
                  <SearchOutlined
                    style={{
                      color: "#0c0808",
                      position: "absolute",
                      right: "13%",
                      top: "25%",
                    }}
                  />
                </div>
              ),
              dataIndex: "",
              key: "",
              width: "20%",
            },
          ]}
          dataSource={searchedName !== "" ? filteredLinkedUsers : linkedUsers}
        />
        <div style={{ display: "flex", gap: "2%" }}>
          <Button
            style={{ flexBasis: "20%" }}
            type="primary"
            onClick={handleConnect}
          >
            Connect
          </Button>
          <Button
            style={{ flexBasis: "20%" }}
            onClick={() => {
              setShowLinkedUserModal(false);
              setLinkedUsers([]);
            }}
          >
            Cancel
          </Button>
        </div>
      </Modal>
    </>
  );
};

function throttle(func, delay) {
  let lastExecTime = 0;
  return function () {
    const now = new Date().getTime();
    if (now - lastExecTime >= delay) {
      lastExecTime = now;
      func.apply(this, arguments);
    }
  };
}
