import React, { useState } from "react";
import { Form, Input, Button, Typography } from "antd";

const { Title } = Typography;

export const MaterialManagement = () => {
  const [componentSize, setComponentSize] = useState("default");

  const onFormLayoutChange = ({ size }) => {
    setComponentSize(size);
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
          Add Material
        </Title>
      </Form.Item>
      <Form.Item label="Add Material" name="materialName">
        <Input placeholder="Enter Material" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Add Material
        </Button>
      </Form.Item>
    </Form>
  );
};

export default MaterialManagement;
