import React, { useState } from "react";
import { Form, Input, Button, Select, Typography } from "antd";

const { Title } = Typography;

export const WeighManagement = () => {
  const [componentSize, setComponentSize] = useState("default");

  const onFormLayoutChange = ({ size }) => {
    setComponentSize(size);
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
      <Form.Item label="Customer Name">
        <Input placeholder="Enter Customer Name" />
      </Form.Item>
      <Form.Item label="Customer Type">
        <Select placeholder="Select a Customer Type">
          <Select.Option value="merchant">Merchant</Select.Option>
          <Select.Option value="Layman">Layman</Select.Option>
          <Select.Option value="vehicleOnly">Vehicle-Only</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item label="Customer ID">
        <Input placeholder="Enter Customer ID" />
      </Form.Item>
      <Form.Item label="Material">
        <Input placeholder="Enter Material" />
      </Form.Item>
      <Form.Item label="Driver Count">
        <Input placeholder="Enter Driver Count" />
      </Form.Item>
      <Form.Item label="First Weight">
        <Input placeholder="Enter weight before unload" />
      </Form.Item>
      <Form.Item label="Second Weight">
        <Input placeholder="Enter weight after unload" />
      </Form.Item>

      <Form.Item>
        <Button type="primary">Submit</Button>
      </Form.Item>
    </Form>
  );
};

export default WeighManagement;
