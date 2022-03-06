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
        span: 4,
      }}
      wrapperCol={{
        span: 14,
      }}
      layout="horizontal"
      initialValues={{
        size: componentSize,
      }}
      onValuesChange={onFormLayoutChange}
      size={componentSize}
    >
      <Form.Item
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
      >
        <Title
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
          level={2}
        >
          Add Transaction
        </Title>
      </Form.Item>

      {/*  <Form.Item label="Form Size" name="size">
        <Radio.Group>
          <Radio.Button value="small">Small</Radio.Button>
          <Radio.Button value="default">Default</Radio.Button>
          <Radio.Button value="large">Large</Radio.Button>
        </Radio.Group>
      </Form.Item> */}
      <Form.Item label="Customer Name">
        <Input />
      </Form.Item>
      <Form.Item label="Customer Type">
        <Select>
          <Select.Option value="merchant">Merchant</Select.Option>
          <Select.Option value="Layman">Layman</Select.Option>
          <Select.Option value="vehicleOnly">Vehicle-Only</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item label="Customer ID">
        <Input />
      </Form.Item>
      <Form.Item label="Material">
        <Input />
      </Form.Item>
      <Form.Item label="Driver Count">
        <Input />
      </Form.Item>
      <Form.Item label="First Weight">
        <Input />
      </Form.Item>
      <Form.Item label="Second Weight">
        <Input />
      </Form.Item>

      <Form.Item
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
      >
        <Button type="primary" htmlType="submit">
          Save Transaction
        </Button>
      </Form.Item>
    </Form>
  );
};

export default WeighManagement;
