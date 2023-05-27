import React from "react";
// import { Form, Input, Button, Select, Typography, InputNumber } from "antd";
import { Form, Input, Button, Select, Typography } from "antd";
// import { DatePicker, Space, Row, Col } from "antd";
import { Row, Col } from "antd";
import axios from "axios";
import { API_ENDPOINTS, config } from "../constants/api.constants";

// import { getSerialData } from "../serialData";
import { EyeTwoTone, EyeInvisibleOutlined } from "@ant-design/icons";

const { Title } = Typography;

export const EmployeeManagement = () => {
  //   getSerialData();
  const [employeeForm] = Form.useForm();

  const onFinish = (payload) => {
    console.log("Received payload of form: ", payload);
    const createEmployee = config.url.AUTH_URL + API_ENDPOINTS.SIGN_UP;

    axios.post(createEmployee, payload).then(({ data }) => {
      console.log(data);
      console.log("Employee signed up successfully");
      employeeForm.resetFields();
    });
  };

  /*  const ShowPhoneNumber = () => {
    return (
      <Form.Item label="Phone Number" name="customerPhoneNo">
        <InputNumber
          addonBefore="+966"
          style={{ width: "100%" }}
          placeholder="Enter Phone Number"
        />
      </Form.Item>
    );
  };

  const onChange = (date, dateString) => {
    console.log(date, dateString);
  };
 */
  return (
    <Row>
      <Col span={12}>
        <Form
          labelCol={{
            span: 16,
          }}
          form={employeeForm}
          layout="vertical"
          onFinish={onFinish}
        >
          <Form.Item>
            <Title level={5}>Add New Employee</Title>
          </Form.Item>

          <Form.Item label="Employee Type" name="isAdmin">
            <Select placeholder="Select a Employee Type">
              <Select.Option value="true">Administrator</Select.Option>
              <Select.Option value="false">Operator</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Enter First Name" name="firstname">
            <Input placeholder="Enter First Name" allowClear />
          </Form.Item>
          {/*   <Form.Item label="Enter Middle Name" name="middleName">
            <Input placeholder="Enter Middle Name" allowClear />
          </Form.Item> */}
          <Form.Item label="Enter Last Name" name="lastname">
            <Input placeholder="Enter Last Name" allowClear />
          </Form.Item>
          <Form.Item label="Enter Email Address" name="email">
            <Input placeholder="Enter Email Address" allowClear />
          </Form.Item>
          <Form.Item label="Enter Password" name="password">
            <Input.Password
              placeholder="input password"
              allowClear
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>
          {/*   <ShowPhoneNumber />
          <Form.Item label="Employee Status" name="employeeStatus">
            <Select placeholder="Select a Employee status">
              <Select.Option value="active">Active</Select.Option>
              <Select.Option value="onLeave">On leave</Select.Option>
              <Select.Option value="terminated">Terminated</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Joining Date" name="joiningDate">
            <Space direction="vertical">
              <DatePicker onChange={onChange} style={{ width: "100%" }} />
            </Space>
          </Form.Item>
          <Form.Item label="Termination Date" name="terminationDate">
            <Space direction="vertical">
              <DatePicker onChange={onChange} />
            </Space>
          </Form.Item>
          <Form.Item label="Resident ID" name="residentID">
            <Input placeholder="Add Resident ID" allowClear />
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
            <Input placeholder="Enter Department" allowClear />
          </Form.Item> */}

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};

export default EmployeeManagement;
