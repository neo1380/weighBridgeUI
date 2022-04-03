import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  Typography,
  Space,
  Modal,
  InputNumber,
  message,
  Radio,
} from "antd";
import { Statistic, Row, Col } from "antd";
import "antd-css-utilities/utility.min.css";

const { Title } = Typography;
const { TextArea } = Input;

export const WeighManagement = () => {
  const [transactionType, setTransactionType] = useState("outgoing");
  const [componentSize, setComponentSize] = useState("default");
  const [selectedCustType, setSelectedCustType] = useState(null);
  const [customerTypeOptions, setCustomerTypeOptions] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [transactionCreation, setTransactionCreation] = useState(null);
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const transactionTypes = [
    { label: "Outgoing", value: "outgoing" },
    { label: "Incoming", value: "incoming" },
  ];
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onFormLayoutChange = ({ size }) => {
    setComponentSize(size);
  };

  const onChangeTransactionType = (event) => {
    setTransactionType(event.target.value);
    handleCustomerTypes(event.target.value);
  };

  const handleCustomerTypes = (type) => {
    if (type === "incoming") {
      const types = [
        {
          value: 3,
          label: "Vehicle Only",
        },
      ];
      setSelectedCustType(3);
      setCustomerTypeOptions(types);
      form.setFieldsValue({
        customerType: 3,
      });
    } else {
      const types = [
        {
          value: 1,
          label: "Merchant",
        },
        {
          value: 2,
          label: "Layman",
        },
      ];
      setSelectedCustType(1);
      setCustomerTypeOptions(types);
      form.setFieldsValue({
        customerType: 1,
      });
    }
  };

  const TransactionType = () => {
    return (
      <Form.Item label="Transaction type" name="transactionType">
        <Radio.Group
          buttonStyle="solid"
          onChange={onChangeTransactionType}
          value={transactionType}
        >
          {transactionTypes.map(({ label, value }) => (
            <Radio.Button
              value={value}
              key={value}
              onChange={onChangeTransactionType}
            >
              {label}
            </Radio.Button>
          ))}
        </Radio.Group>
        {/* <Radio.Group
          buttonStyle="solid"
          options={transactionTypes}
          onChange={onChangeTransactionType}
          value={transactionType}
        /> */}
      </Form.Item>
    );
  };

  const ShowSecondWeight = (props) => {
    if (selectedCustType !== 3 && transactionCreation === "IN_PROGRESS") {
      return (
        <Form.Item label="Second Weight" name="secondWeight">
          <Input placeholder="Enter weight after unload" />
        </Form.Item>
      );
    } else {
      return null;
    }
  };

  const ShowMaterial = ({ disabled }) => {
    if (selectedCustType !== 3) {
      return (
        <Form.Item label="Select Material" name="material">
          <Select
            placeholder="Select Material"
            onChange={onChangeMaterialType}
            loading={!materials.length}
            disabled={disabled === "IN_PROGRESS"}
          >
            {materials.map((opt) => (
              <Select.Option
                key={opt.value}
                value={opt.value}
                disabled={disabled === "IN_PROGRESS"}
              >
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

  const ShowVehicleNumber = ({ disabled }) => {
    if (selectedCustType !== 2) {
      return (
        <Form.Item label="Vehicle Number" name="vehicleNumber">
          <Input
            placeholder="Enter Vehicle Number"
            disabled={disabled === "IN_PROGRESS"}
          />
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

  const ShowDriverCount = ({ disabled }) => {
    if (selectedCustType !== 2) {
      return (
        <Form.Item label="Driver Count" name="driverCount">
          <Input
            placeholder="Enter Driver Count"
            disabled={disabled === "IN_PROGRESS"}
          />
        </Form.Item>
      );
    } else {
      return null;
    }
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

  const CancelModal = () => {
    const onChange = (e) => {};

    return (
      <Modal
        title="Cancel Transaction"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form.Item>
          <TextArea
            showCount
            maxLength={100}
            style={{ height: 120 }}
            onChange={onChange}
          />
          ,
        </Form.Item>
      </Modal>
    );
  };

  useEffect(() => {
    // GET request using fetch to load customer types
    fetch("https://api.npms.io/v2/search?q=react")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        handleCustomerTypes("outgoing");
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

    setTransactionType("outgoing");

    // empty dependency array means this effect will only run once (like componentDidMount in classes)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChangeUserType = (event) => {
    setSelectedCustType(event.target.value);
  };

  const onChangeMaterialType = (type) => {};

  const onFinish = (values) => {
    if (typeof values.customerID === "undefined") {
      let newCustomerID = null;
      const { customerName, customerPhoneNo } = values;
      newCustomerID = { customerID: `${customerName}_${customerPhoneNo}` };
      values = { ...values, ...newCustomerID };
    }
    console.log("Received values of form: ", values);
    const message = {
      initiated: "Transaction creation is in progress.",
      completed: "Transaction successfully completed",
    };
    openMessage(message);
  };

  const loadTempTransaction = (id) => {
    //Make API call to load temp transaction
    setTransactionCreation("IN_PROGRESS");
    const mockData = {
      customerName: "Gowtham Asokan",
      customerType: 1,
      customerID: "AA",
      vehicleNumber: "3589",
      driverCount: "2",
      firstWeight: "900",
      material: "Plastic",
      customerPhoneNo: "9884978723",
    };
    form.setFieldsValue(mockData);
  };

  const cancelTransaction = (id) => {
    if (transactionCreation === "IN_PROGRESS") {
      showModal();
    }
  };

  const openMessage = ({ initiated, completed }) => {
    console.log("message");
    const key = "updatable";

    message.loading({ content: initiated, key });
    setTimeout(() => {
      message.success({ content: completed, key, duration: 2 }).then(() => {
        setTransactionCreation(null);
        form.resetFields();
      });
    }, 1000);
  };

  return (
    <>
      <Row>
        <Col span={12}>
          <CancelModal />
          <Form
            form={form}
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
              transactionType: "outgoing",
              customerType: transactionType === "outgoing" ? 1 : 3,
            }}
            onValuesChange={onFormLayoutChange}
            size={componentSize}
            onFinish={onFinish}
          >
            {/* <Form.Item>
              <Title
                wrapperCol={{
                  offset: 4,
                  span: 16,
                }}
                level={5}
              >
                {transactionCreation === "IN_PROGRESS"
                  ? "Add Weight After unload"
                  : "Add Weight Before unload"}
              </Title>
            </Form.Item> */}

            <TransactionType />
            <Form.Item
              label="Customer Type"
              name="customerType"
              value={selectedCustType}
            >
              <Radio.Group buttonStyle="solid">
                {customerTypeOptions.map(({ label, value }) => (
                  <Radio.Button
                    value={value}
                    key={value}
                    onChange={onChangeUserType}
                    disabled={transactionCreation === "IN_PROGRESS"}
                  >
                    {label}
                  </Radio.Button>
                ))}
              </Radio.Group>
            </Form.Item>

            <Form.Item label="Customer Name" name="customerName">
              <Input placeholder="Enter Customer Name" />
            </Form.Item>
            <ShowPhoneNumber />
            <ShowCustomerID />
            <ShowMaterial disabled={transactionCreation} />
            <ShowVehicleNumber disabled={transactionCreation} />
            <ShowDriverCount disabled={transactionCreation} />

            <Form.Item label="First Weight" name="firstWeight">
              <Input
                placeholder="Enter weight before unload"
                disabled={transactionCreation === "IN_PROGRESS"}
              />
            </Form.Item>
            <ShowSecondWeight />
            <Form.Item>
              <Button type="primary" htmlType="submit" className="mr-3">
                Create transaction
              </Button>
              <Button
                type="secondary"
                htmlType="submit"
                onClick={() => cancelTransaction()}
              >
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
                  <Button
                    type="link"
                    className="pl-0"
                    onClick={() => loadTempTransaction("7")}
                  >
                    TN18R7498
                  </Button>
                  <Button type="link" className="pl-0">
                    TN18AL3501
                  </Button>
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
