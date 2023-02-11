import React from "react";
import { Form, Input, Button } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { HeaderComp } from "../Header";
import { Layout } from "antd";

export const Login = (props) => {
  const onFinish = (values) => {
    console.log("Received values of form: ", values);
    console.log(props);
    props.onLoginHandler(values);
  };

  return (
    <Layout>
      <HeaderComp />
      <Layout
        style={{
          padding: 24,
          margin: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "calc(100vh - 64px)",
        }}
      >
        {" "}
        <Form
          name="normal_login"
          labelCol={{
            offset: 2,
            span: 16,
          }}
          wrapperCol={{
            offset: 2,
            span: 24,
          }}
          layout="vertical"
          className="login-form"
          onFinish={onFinish}
        >
          <Form.Item
            name="firstname"
            rules={[
              {
                required: true,
                message: "Please input your Username!",
              },
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Enter firstname"
            />
          </Form.Item>
          <Form.Item
            name="lastname"
            rules={[
              {
                required: true,
                message: "Please input your last name!",
              },
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Enter lastname"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your Password!",
              },
            ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              Log in
            </Button>
          </Form.Item>
        </Form>
      </Layout>
    </Layout>
  );
};

export default Login;
