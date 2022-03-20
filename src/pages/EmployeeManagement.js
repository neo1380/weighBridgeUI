import React from "react";
import { Form, Input, Button, Select, Typography } from "antd";
import { DatePicker, Space } from "antd";

const { Title } = Typography;

export const EmployeeManagement = () => {
  const onFinish = (values) => {
    console.log("Received values of form: ", values);
  };

  const onChange = (date, dateString) => {
    console.log(date, dateString);
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
          Add New Employee
        </Title>
      </Form.Item>

      <Form.Item label="Employee Type" name="employeeType">
        <Select placeholder="Select a Employee Type">
          <Select.Option value="permanent">Permanent</Select.Option>
          <Select.Option value="contract">Contract</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item label="Enter First Name" name="firstName">
        <Input placeholder="Enter First Name" />
      </Form.Item>
      <Form.Item label="Enter Middle Name" name="middleName">
        <Input placeholder="Enter Middle Name" />
      </Form.Item>
      <Form.Item label="Enter Last Name" name="lastName">
        <Input placeholder="Enter Last Name" />
      </Form.Item>
      <Form.Item label="Enter Email Address" name="email">
        <Input placeholder="Enter Email Address" />
      </Form.Item>
      <Form.Item label="Employee Status" name="employeeStatus">
        <Select placeholder="Select a Employee status">
          <Select.Option value="active">Active</Select.Option>
          <Select.Option value="onLeave">On leave</Select.Option>
          <Select.Option value="terminated">Terminated</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item label="Joining Date" name="joiningDate">
        <Space direction="vertical">
          <DatePicker onChange={onChange} />
        </Space>
      </Form.Item>
      <Form.Item label="Termination Date" name="terminationDate">
        <Space direction="vertical">
          <DatePicker onChange={onChange} />
        </Space>
      </Form.Item>
      <Form.Item label="Resident ID" name="residentID">
        <Input placeholder="Add Resident ID" />
      </Form.Item>
      <Form.Item label="Resident valid From" name="residentIDValidFrom">
        <Space direction="vertical">
          <DatePicker onChange={onChange} />
        </Space>
      </Form.Item>
      <Form.Item label="Resident valid until" name="residentIDValidUntil">
        <Space direction="vertical">
          <DatePicker onChange={onChange} />
        </Space>
      </Form.Item>
      <Form.Item label="Department ID" name="departmentID">
        <Input placeholder="Enter Department" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default EmployeeManagement;
