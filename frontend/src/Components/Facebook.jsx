import React, { useEffect, useState } from "react";
import { LoginSocialFacebook } from "reactjs-social-login";
import { Button, Input, Modal, Switch, Table } from "antd";
import { handleLogoutIndicator } from "../utils/helper";
import {
  getLinkedAdsAccounts,
  getMetaRefreshToken,
} from "../Services/MetaLinkedUsers";
import { SearchOutlined } from "@ant-design/icons";
import { GetServerCall } from "../Services/apiCall";

export const Facebook = ({
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
  const [userName, setUserName] = useState("");
  const [access_token, setAccess_token] = useState("");
  const [refresh_token, setRefresh_token_token] = useState("");
  const [selectedRow, setSelectedRow] = useState({});

  const FbResponseHandler = async (response) => {
    // console.log("facebook", response)
    if (!response.accessToken) return;
    let list = await getLinkedAdsAccounts(response.accessToken);
    let refreshToken = await getMetaRefreshToken(response.accessToken);
    if (!refreshToken) return;
    if (list?.length) {
      // loop through list and add key
      list.forEach((ele, i) => {
        ele.key = i + 1;
        ele.auto_track = false;
        ele.account_status = ele.account_status === 1 ? "Active" : "Disabled";
      });
      setLinkedUsers(list);
      setShowLinkedUserModal(true);
      setUserName(response.name);
      setAccess_token(response.accessToken);
      setRefresh_token_token(refreshToken);
    }
    // fetchAdsData(response.accessToken, 'facebook', response.name)
  };

  const handleConnect = () => {
    if (!selectedRow.customer_ids.length) return;
    let customer_ids = selectedRow.customer_ids.join(",");
    let customer_names = selectedRow.customer_names.join(",");
    setShowLinkedUserModal(false);
    fetchAdsData(
      { access_token, refresh_token },
      "facebook",
      userName,
      customer_ids,
      customer_names
    );
    // fetchAdsData(access_token, 'google', userName, customer_ids, selectedRow.manager_id)
    setSearchedName("");
  };

  useEffect(() => {
    let temp = [...linkedUsers];
    let filterArr = temp.filter((el) => {
      if (el.name?.toLowerCase().includes(searchedName)) return { ...el };
      else return false;
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
      // pick manager id form any of selected row
      setSelectedRow({
        customer_ids: [...tempArr],
        customer_names: [...namesArr],
      });
    },
    getCheckboxProps: (record) => ({
      name: record.name,
    }),
  };

  let id = localStorage.getItem("id");

  const handleRowLogout = async () => {
    try {
      let res = await GetServerCall("/meta-ads/logout-user/" + userData.email);
      if (res.data.status !== "success") return handleError();
      getData();
      handleLogoutIndicator(id, "facebook");
      handleOk();
      notify.success({
        description: "Logout Success.",
      });
    } catch (error) {
      handleError();
    }
    // check is indicator exists
  };

  const handleError = () => {
    notify.error({
      description: "Something went wrong...",
    });
  };

  if (userData?.is_meta_login === "1")
    return (
      <div style={{ display: "flex", flexFlow: "column" }}>
        <Button
          disabled
          className="ModalBtn"
          style={{ color: "#fff", backgroundColor: "#018F0F" }}
        >
          Meta Ads
        </Button>
        <Button onClick={handleRowLogout}>Logout Meta</Button>
      </div>
    );

  return (
    <>
      <LoginSocialFacebook
        appId={process.env.REACT_APP_FB_CLIENT_ID}
        fieldsProfile={"id,name"}
        scope="ads_read,read_insights,ads_management"
        redirect_uri={`https://adview.io/`}
        onResolve={({ provider, data }) => {
          FbResponseHandler(data);
        }}
        onReject={(err) => {
          FbResponseHandler(err);
        }}
      >
        <Button className="ModalBtn" type="primary">
          Meta Ads
        </Button>
      </LoginSocialFacebook>

      <Modal
        title={
          <h5 style={{ padding: "2.5% 0% 0px 2.5%" }}>
            Select Meta ad Accounts to link
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
          bordered
          scroll={{ x: 700 }}
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
