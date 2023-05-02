import React, { Fragment } from "react";
import AdviewTable from "../Components/AdviewTable";
import Layout from "../Layout/Layout";
import { Button, Checkbox, Form, Input } from "antd";
import { useNavigate } from "react-router-dom";

function Login() {
	const navigate = useNavigate();
  const onFinish = ({email,password}) => {
		let user = {email, password }
			localStorage.setItem('user',JSON.stringify(user))
			navigate('/')
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Fragment>
      {/* <Layout /> */}
      <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: "#EBEBEB" }}>
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
          <h1 style={{ marginLeft: "15vw", color:"grey" }}>Adview</h1>
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
    </Fragment>
  );
}

export default Login;
