import React, { useEffect, useState } from "react";
import { Button, Modal, Switch, Table } from "antd";
import { generateToken, getAssociatedCustomers } from "../../Services/googleLinkedUsers";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useGoogleLogin } from "@react-oauth/google";
import { handleGoogleRowLogout } from "../../Services/socialMediaButtons";

export const GoogleBtn = ({
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

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => GResponseHandler(codeResponse.code),
    flow: "auth-code",
    scope: ["https://www.googleapis.com/auth/adwords"],
  });

  const GResponseHandler = async (code) => {
    let tokens = await generateToken(code)
    if (!tokens) return;
    let { access_token, refresh_token } = tokens;
    let list = await getAssociatedCustomers(access_token);
    if (list?.length) {
      list.forEach((ele, i) => {
        ele.key = i + 1;
        ele.auto_track = false;
      });
      setLinkedUsers(list);
      setShowLinkedUserModal(true);
      setUserName("name");
      setAccess_token(access_token);
      setRefresh_token_token(refresh_token);
    }
  };

  const handleRowLogout = async () => {
    handleGoogleRowLogout(getData,handleError,userData,handleOk,notify)
  };

  useEffect(() => {
    let temp = [...linkedUsers];
    let filterArr = temp.filter((el) => {
      if (el.descriptiveName?.toLowerCase().includes(searchedName))
        return { ...el };
      else return false;
    });
    setFilteredLinkedUsers(filterArr);
  }, [searchedName]);

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      let tempArr = [];
      selectedRows.forEach((el) => {
        tempArr.push(el.id);
      });
      if (!tempArr.length) return setSelectedRow({});
      // pick manager id form any of selected row
      let { manager_id } = selectedRows[0];
      setSelectedRow({ customer_ids: [...tempArr], manager_id });
    },
    getCheckboxProps: (record) => ({
      name: record.descriptiveName,
    }),
  };

  const handleConnect = () => {
    if (!selectedRow.manager_id || !selectedRow.customer_ids.length) return;
    let customer_ids = selectedRow.customer_ids.join(",");
    setShowLinkedUserModal(false);
    fetchAdsData(
      { access_token, refresh_token },
      "google",
      userName,
      customer_ids,
      selectedRow.manager_id
    );
    setSearchedName("");
  };

  const handleError = () => {
    notify.error({
      description: "Something went wrong...",
    });
  };

  if (userData?.is_google_login === "1")
    return (
      <div style={{ display: "flex", flexFlow: "column", gap: "1%" }}>
        <Button
          disabled
          className="ModalBtn"
          style={{ color: "#fff", backgroundColor: "#018F0F" }}
        >
          Google Ads
        </Button>
        <Button onClick={handleRowLogout}>Logout Google</Button>
      </div>
    );

  return (
    <>
      <div>
        <Button className="ModalBtn" type="primary" onClick={() => login()}>
          google Ads
        </Button>
      </div>
      <Modal
        title={
          <h5 style={{ padding: "2.5% 0% 0px 2.5%" }}>
            Select Google ad Accounts to link
          </h5>
        }
        width={"67%"}
        className="responsive_warper"
        open={showLinkedUserModal}
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
              dataIndex: "descriptiveName",
              key: "descriptiveName",
            },
            {
              title: "AD ACCOUNT ID",
              dataIndex: "id",
              key: "id",
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
