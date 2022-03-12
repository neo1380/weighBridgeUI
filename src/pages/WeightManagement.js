import React, { useState } from "react";
import { Form, Input, Button, Select, Typography } from "antd";

const { Title } = Typography;

export const WeighManagement = () => {
  const [componentSize, setComponentSize] = useState("default");
  const [userType, setUserType] = useState("merchant");

  const onFormLayoutChange = ({ size }) => {
    setComponentSize(size);
  };

  const onChangeUserType = (type) => {
    console.log("from user type");
    console.log(type);
    setUserType(type);
  };

  const ShowSecondWeight = () => {
    if (userType !== "vehicleOnly") {
      return (
        <Form.Item label="Second Weight" name="secondWeight">
          <Input placeholder="Enter weight after unload" />
        </Form.Item>
      );
    } else {
      return null;
    }
  };

  const ShowMaterial = () => {
    if (userType !== "vehicleOnly") {
      return (
        <Form.Item label="Material" name="material">
          <Input placeholder="Enter Material" />
        </Form.Item>
      );
    } else {
      return null;
    }
  };

  const onFinish = (values) => {
    console.log("Received values of form: ", values);
  };

  return (
    <Form
      labelCol={{
        offset: 2,
        span: 16,
      }}
      wrapperCol={{
        offset: 2,
        span: 8,
      }}
      layout="vertical"
      initialValues={{
        size: componentSize,
      }}
      onValuesChange={onFormLayoutChange}
      size={componentSize}
      onFinish={onFinish}
    >
      <Form.Item>
        <Title
          wrapperCol={{
            offset: 4,
            span: 16,
          }}
          level={5}
        >
          Add Transaction
        </Title>
      </Form.Item>
      <Form.Item label="Customer Name" name="customerName">
        <Input placeholder="Enter Customer Name" />
      </Form.Item>

      <Form.Item label="Customer Type" name="customerType">
        <Select
          placeholder="Select a Customer Type"
          onChange={onChangeUserType}
        >
          <Select.Option value="merchant">Merchant</Select.Option>
          <Select.Option value="Layman">Layman</Select.Option>
          <Select.Option value="vehicleOnly">Vehicle-Only</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item label="Customer ID" name="customerID">
        <Input placeholder="Enter Customer ID" />
      </Form.Item>
      <ShowMaterial />
      <Form.Item label="Driver Count" name="driverCount">
        <Input placeholder="Enter Driver Count" />
      </Form.Item>
      <Form.Item label="First Weight" name="firstWeight">
        <Input placeholder="Enter weight before unload" />
      </Form.Item>
      <ShowSecondWeight />
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default WeighManagement;
