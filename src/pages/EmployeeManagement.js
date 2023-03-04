import React from "react";
import { Form, Input, Button, Select, Typography, InputNumber } from "antd";
import { DatePicker, Space, Row, Col } from "antd";

const { Title } = Typography;

export const EmployeeManagement = () => {
  const onFinish = (values) => {
    console.log("Received values of form: ", values);
  };

  const ShowPhoneNumber = () => {
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

  const ReadWriteSerialData = () => {
    if ("serial" in navigator) {
      console.log("Awesome, The serial port is supported.");
      // The Web Serial API is supported.
    }

    const openSerialPort = async () => {
      let port = await navigator.serial.requestPort();
      await port.open({
        baudRate: 6000,
      });
      while (port.readable) {
        try {
          // eslint-disable-next-line no-undef
          const textDecoder = new TextDecoderStream();
          // eslint-disable-next-line
          const readableStreamClosed = port.readable.pipeTo(
            textDecoder.writable
          );
          const reader = textDecoder.readable.getReader();
          while (true) {
            const { value, done } = await reader.read();
            if (done) {
              // Allow the serial port to be closed later.
              reader.releaseLock();
              break;
            }
            // value is a string will be streaming here.
            console.log(value);
          }
        } catch (error) {
          // TODO: Handle non-fatal read error.
        }
      }
    };
    openSerialPort();
    return (
      <div>
        <button onClick={() => openSerialPort()}> Open Serial Port </button>
      </div>
    );
  };

  return (
    <Row>
      <Col span={12}>
        <ReadWriteSerialData />

        <Form
          labelCol={{
            offset: 2,
            span: 16,
          }}
          wrapperCol={{
            offset: 2,
            span: 24,
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
            <Input placeholder="Enter First Name" allowClear />
          </Form.Item>
          <Form.Item label="Enter Middle Name" name="middleName">
            <Input placeholder="Enter Middle Name" allowClear />
          </Form.Item>
          <Form.Item label="Enter Last Name" name="lastName">
            <Input placeholder="Enter Last Name" allowClear />
          </Form.Item>
          <Form.Item label="Enter Email Address" name="email">
            <Input placeholder="Enter Email Address" allowClear />
          </Form.Item>
          <ShowPhoneNumber />
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
          </Form.Item>

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
