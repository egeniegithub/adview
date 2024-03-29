import React, { Fragment, useEffect } from "react";
import { Button, Form, Input, notification } from "antd";
import { useNavigate } from "react-router-dom";
import { getLocalStorage, setLocalStorage } from "../utils/helper";

function Login() {
  const navigate = useNavigate();
  const [api, contextHolder] = notification.useNotification();
  useEffect(() => {
    let token = getLocalStorage("token");
    if (token) navigate("/");
  }, []);

  const onFinish = ({ email, password }) => {
    let user = { email, password };
    if (user?.email === "admin" && user?.password === "admin") {
      let token = Math.floor(1000 + Math.random() * 9000000);
      setLocalStorage("token", token)
      navigate("/");
    } else {
      openNotification();
    }
  };

  const openNotification = () => {
    api.error({
      description: "Invalid Credentials",
    });
  };

  const onFinishFailed = (errorInfo) => {
    // console.log("Failed:", errorInfo);
  };

  return (
    <Fragment>
      {/* <Layout /> */}
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#EBEBEB",
        }}
      >
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ width: 600, fontSize: "16px", fontWeight: "500" }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <h1 style={{ marginLeft: "15vw", color: "grey" }}>Adview</h1>
          <Form.Item
            label="Username"
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
      {contextHolder}
    </Fragment>
  );
}

export default Login;
