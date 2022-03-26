import React, { useState, useEffect } from "react";
import { Form, Input, Button, Select, Typography, Space, Card } from "antd";
import { Statistic, Row, Col } from "antd";
import "antd-css-utilities/utility.min.css";

const { Title, Text } = Typography;

export const WeighManagement = () => {
  const [componentSize, setComponentSize] = useState("default");
  const [selectedCustType, setSelectedCustType] = useState("merchant");
  const [transactionType, setTransactionType] = useState("temporary");
  const [customerType, setCustomerType] = useState([]);
  const [materials, setMaterials] = useState([]);

  const onFormLayoutChange = ({ size }) => {
    setComponentSize(size);
  };

  useEffect(() => {
    // GET request using fetch to load customer types
    fetch("https://api.npms.io/v2/search?q=react")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);

        const custtypes = [
          {
            value: 1,
            label: "Merchant",
          },
          {
            value: 2,
            label: "Layman",
          },
          {
            value: 3,
            label: "Vehicle-only",
          },
        ];
        setCustomerType(custtypes);
      });

    // GET request using fetch to load material types

    fetch("https://api.npms.io/v2/search?q=react")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);

        const materials = [
          {
            label: "Paper",
            value: "Paper",
          },
          {
            label: "Carton",
            value: "Carton",
          },
          {
            label: "Duplex",
            value: "Duplex",
          },
          {
            label: "Mix",
            value: "Mix",
          },
          {
            label: "Plastic",
            value: "Plastic",
          },
          {
            label: "Magazine",
            value: "Magazine",
          },
        ];
        setMaterials(materials);
      });

    // empty dependency array means this effect will only run once (like componentDidMount in classes)
  }, []);

  useEffect(() => {
    // GET request using fetch inside useEffect React hook
    // this.setState({setTransactionType:'final'});
    setTransactionType("temporary");
    setTransactionType("final");
    // empty dependency array means this effect will only run once (like componentDidMount in classes)
  }, []);

  const onChangeUserType = (type) => {
    console.log("from user type");
    console.log(type);
    setSelectedCustType(type);
  };
  const onChangeMaterialType = (type) => {
    console.log("from material type");
    console.log(type);
  };

  const ShowSecondWeight = () => {
    if (selectedCustType !== 3 && transactionType === "final") {
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
    if (selectedCustType !== "vehicleOnly") {
      return (
        <Form.Item label="Select Material" name="material">
          <Select
            placeholder="Select Material"
            onChange={onChangeMaterialType}
            loading={!materials.length}
          >
            {materials.map((opt) => (
              <Select.Option key={opt.value} value={opt.value}>
                {opt.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      );
    } else {
      return null;
    }
  };

  const ShowVehicleNumber = () => {
    if (selectedCustType !== 2) {
      return (
        <Form.Item label="Vehicle Number" name="vehicleNumber">
          <Input placeholder="Enter Vehicle Number" />
        </Form.Item>
      );
    } else {
      return null;
    }
  };

  const ShowCustomerID = () => {
    if (selectedCustType !== 2) {
      return (
        <Form.Item label="Customer ID" name="customerID">
          <Input placeholder="Enter Customer ID" />
        </Form.Item>
      );
    } else {
      return null;
    }
  };

  const ShowDriverCount = () => {
    if (selectedCustType !== 2) {
      return (
        <Form.Item label="Driver Count" name="driverCount">
          <Input placeholder="Enter Driver Count" />
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
    <>
      <Row>
        <Col span={12}>
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
                Add Weight before unload
              </Title>
            </Form.Item>
            <Form.Item label="Customer Type" name="customerType">
              <Select
                placeholder="Select a Customer Type"
                onChange={onChangeUserType}
                loading={!customerType.length}
              >
                {customerType.map((opt) => (
                  <Select.Option key={opt.value} value={opt.value}>
                    {opt.label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="Customer Name" name="customerName">
              <Input placeholder="Enter Customer Name" />
            </Form.Item>

            <ShowCustomerID />
            <ShowMaterial />
            <ShowVehicleNumber />
            <ShowDriverCount />

            <Form.Item label="First Weight" name="firstWeight">
              <Input placeholder="Enter weight before unload" />
            </Form.Item>
            <ShowSecondWeight />
            <Form.Item>
              <Button type="primary" htmlType="submit" className="mr-3">
                Create transaction
              </Button>
              <Button type="secondary" htmlType="submit">
                Cancel
              </Button>
            </Form.Item>
          </Form>
        </Col>
        <Col span={10} offset={2}>
          <div
            style={{
              marginLeft: "auto",
            }}
          >
            <Title type="primary" level={5}>
              Transaction History
            </Title>
            <Row gutter={16}>
              <Col span={12}>
                <Statistic title="Active" value={5} />
              </Col>
              <Col span={12}>
                <Statistic title="Completed" value={20} />
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={24}>
                <Space direction="vertical">
                  <Title type="primary" level={5} className="mt-2">
                    List of Active transactions
                  </Title>
                  <Button type="link">TN18R7498</Button>
                  <Button type="link">TN18AL3501</Button>
                </Space>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default WeighManagement;
