import React, { useState, useEffect, useCallback } from "react";
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
import { PlusOutlined } from "@ant-design/icons";
import "antd-css-utilities/utility.min.css";
import { API_ENDPOINTS, BASE_URL } from "../constants/api.constants";

const { Title, Text } = Typography;
const { TextArea } = Input;

export const WeighManagement = () => {
  const [transactionType, setTransactionType] = useState("incoming");
  const [componentSize, setComponentSize] = useState("default");
  const [selectedCustType, setSelectedCustType] = useState(null);
  const [customerTypeOptions, setCustomerTypeOptions] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [transactionCreation, setTransactionCreation] = useState(null);
  const [form] = Form.useForm();
  const [cancelForm] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [canReason, setCanReason] = useState("");
  const transactionTypes = [
    { label: "Incoming", value: "incoming" },
    { label: "Outgoing", value: "outgoing" },
  ];
  const formInitValues = {
    size: componentSize,
    transactionType: "incoming",
    customerType: transactionType === "outgoing" ? 1 : 3,
  };

  const cancelReasons = [
    {
      label: "Incorrect information from Customer",
      value: "incorrect_customer_info",
    },
    {
      label: "Cancellation requested by Customer",
      value: "cancel_request_customer",
    },
    {
      label: "Error in Data entry",
      value: "error_data_entry",
    },
    {
      label: "Others",
      value: "Others",
    },
  ];

  const weightInputs = {
    transactions: [
      {
        materialId: null,
        firstWeight: null,
        secondWeight: null,
      },
    ],
  };

  /** Component composition */

  const TransactionType = ({ disabled }) => {
    return (
      <Form.Item label="Transaction type" name="transactionType">
        <Radio.Group
          buttonStyle="solid"
          onChange={onChangeTransactionType}
          value={transactionType}
          disabled={disabled === "IN_PROGRESS"}
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
      </Form.Item>
    );
  };

  const FirstWeight = (field, key) => {
    console.log(field);
    return (
      <Form.Item
        label="First Weight"
        name={[field.name, "firstWeight"]}
        fieldKey={[field.fieldKey, key]}
        initialValue={field.weight}
        rules={[
          {
            required: true,
            message: "Please enter First Weight",
          },
        ]}
      >
        <InputNumber
          placeholder="Weight before unload"
          disabled={field.disabled}
          addonAfter="Kgs"
        />
      </Form.Item>
    );
  };
  const SecondWeight = (field, key) => {
    if (selectedCustType !== 3 && transactionCreation === "IN_PROGRESS") {
      return (
        <Form.Item
          label="Second Weight"
          name={[field.name, "secondWeight"]}
          fieldKey={[field.fieldKey, key]}
          rules={[
            {
              required: true,
              message: "Please enter Second Weight",
            },
          ]}
        >
          <InputNumber placeholder="Weight after unload" addonAfter="Kgs" />
        </Form.Item>
      );
    } else {
      return null;
    }
  };

  const Materials = ({ disabled, field }) => {
    // if (selectedCustType !== 3) {
    return (
      <Form.Item
        label="Select Material"
        name={[field.name, "materialName"]}
        fieldKey={[field.fieldKey, "materialName"]}
      >
        <Select
          placeholder="Select Material"
          onChange={onChangeMaterialType}
          loading={!materials.length}
          //   disabled={disabled === "IN_PROGRESS"}
        >
          {materials.map((opt, index) => (
            <Select.Option
              key={opt.label}
              value={opt.materialName}
              //   disabled={disabled === "IN_PROGRESS"}
            >
              {opt.label}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
    );
    // } else {
    //   return null;
    // }
  };

  const VehicleNumber = ({ disabled }) => {
    if (selectedCustType !== 2) {
      return (
        <Form.Item
          label="Vehicle Number"
          name="vehicleNumber"
          rules={[
            {
              required: true,
              message: "Please enter Vehicle Number",
            },
          ]}
        >
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

  const CustomerID = ({ disabled }) => {
    if (selectedCustType !== 2) {
      return (
        <Form.Item
          label="Customer ID"
          name="customerID"
          rules={[
            {
              required: false,
              message: "Please enter Customer's ID",
            },
          ]}
        >
          <Input
            placeholder="Enter Customer ID"
            disabled={disabled === "IN_PROGRESS"}
          />
        </Form.Item>
      );
    } else {
      return null;
    }
  };

  const DriverCount = ({ disabled }) => {
    if (selectedCustType !== 2) {
      return (
        <Form.Item
          label="Driver Count"
          name="driverCount"
          rules={[
            {
              required: true,
              message: "Please enter Driver Count",
            },
          ]}
        >
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

  const CustomerType = ({ disabled }) => {
    return (
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
    );
  };

  const CustomerName = ({ disabled }) => {
    return (
      <Form.Item
        label="Customer Name"
        name="customerName"
        rules={[
          {
            required: true,
            message: "Please enter Customer's name",
          },
        ]}
      >
        <Input
          placeholder="Enter Customer Name"
          disabled={disabled === "IN_PROGRESS"}
        />
      </Form.Item>
    );
  };

  const PhoneNumber = ({ disabled }) => {
    return (
      <Form.Item
        label="Phone Number"
        name="customerPhoneNo"
        rules={[
          {
            required: true,
            message: "Please enter Customer's Phone Number",
          },
        ]}
      >
        <InputNumber
          addonBefore="+966"
          style={{ width: "100%" }}
          placeholder="Enter Phone Number"
          disabled={disabled === "IN_PROGRESS"}
        />
      </Form.Item>
    );
  };

  const CancellationReasons = () => {
    const onSelectCanReason = (reason) => {
      console.log(reason);
      setCanReason(reason);
    };

    return (
      <Form form={cancelForm} layout="vertical" autoComplete="off">
        <Form.Item
          label="Select a Cancellation Reason"
          name="cancellationReason"
        >
          <Select
            placeholder="Select Cancellation Reason"
            onChange={onSelectCanReason}
          >
            {cancelReasons.map((opt) => (
              <Select.Option key={opt.value} value={opt.value}>
                {opt.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    );
  };

  const CancellationOthers = ({ change }) => {
    return (
      <Form.Item>
        <TextArea
          showCount
          maxLength={100}
          style={{ height: 120 }}
          onChange={change}
        />
        ,
      </Form.Item>
    );
  };

  const ActionButtons = ({ state }) => {
    if (state !== "IN_PROGRESS") {
      return (
        <Form.Item>
          <Button type="primary" htmlType="submit" className="mr-3">
            Create transaction
          </Button>
        </Form.Item>
      );
    } else {
      return (
        <Form.Item>
          <Button type="primary" htmlType="submit" className="mr-3">
            Close Current Transaction
          </Button>
          <Button
            danger
            type="secondary"
            htmlType="submit"
            onClick={() => cancelTransaction()}
          >
            Cancel
          </Button>
        </Form.Item>
      );
    }
  };

  /** Event handlers */
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

  const CancelModal = () => {
    const otherReason = (e) => {};

    return (
      <Modal
        title="Cancel Transaction"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <CancellationReasons />
        {canReason.toLowerCase() === "others" ? (
          <CancellationOthers change={otherReason} />
        ) : null}
      </Modal>
    );
  };

  // Keep the function reference
  const handleCustomerTypes = useCallback(
    (type) => {
      if (type === "incoming") {
        setSelectedCustType(3);
        const types = [
          {
            value: 3,
            label: "Vehicle",
          },
          {
            value: 1,
            label: "Layman",
          },
        ];
        setCustomerTypeOptions(types);
        form.setFieldsValue({
          customerType: 3,
        });
      } else {
        const types = [
          {
            value: 3,
            label: "Vehicle",
          },
        ];
        setSelectedCustType(3);
        setCustomerTypeOptions(types);
        form.setFieldsValue({
          customerType: 3,
        });
      }
    },
    [form]
  );

  useEffect(() => {
    handleCustomerTypes("incoming");
    const materialList = BASE_URL + API_ENDPOINTS.GET_MATERIAL;
    fetch(materialList)
      .then((response) => response.json())
      .then((materials) => {
        console.log(materials);
        setMaterials(materials);
      });
    setTransactionType("incoming");
  }, [handleCustomerTypes]);

  const onChangeUserType = (event) => {
    setSelectedCustType(event.target.value);
  };

  const onChangeMaterialType = (type) => {
    console.log("selec type", type);
    //add code to fetch price based on materials
  };

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
      firstWeight: "91100",
      material: "Plastic",
      customerPhoneNo: "9884978723",
      transactions: [
        {
          materialName: "Iron",
          materialId: "2",
          firstWeight: "11900",
          secondWeight: null,
        },
      ],
    };
    weightInputs.transactions = { ...mockData.transactions };
    form.setFieldsValue(mockData);
    setSelectedCustType(mockData.customerType);
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
            autoComplete="off"
            initialValues={formInitValues}
            onValuesChange={onFormLayoutChange}
            size={componentSize}
            onFinish={onFinish}
          >
            <TransactionType disabled={transactionCreation} />
            <CustomerType disabled={transactionCreation} />
            <CustomerName disabled={transactionCreation} />
            <PhoneNumber disabled={transactionCreation} />
            <CustomerID disabled={transactionCreation} />
            <VehicleNumber disabled={transactionCreation} />
            <DriverCount disabled={transactionCreation} />

            <Form.List
              name="transactions"
              initialValue={weightInputs?.transactions}
            >
              {(fields, { add, remove }) => (
                <>
                  {fields.map((field, index) => (
                    <>
                      {/* <p className="ant-col ant-col-16 ant-col-offset-2 ant-form-item-label">
                        Transaction: <b>{index + 1}</b>
                      </p> */}
                      <Col span={12} offset={2} className="mb-5">
                        <Typography.Title level={4} style={{ margin: 0 }}>
                          Transaction: {index + 1}
                        </Typography.Title>
                      </Col>

                      <Materials disabled={transactionCreation} field={field} />
                      <FirstWeight
                        {...field}
                        key={`firstWeight_${index}`}
                        weight={
                          index > 0
                            ? form.getFieldValue("transactions")[index - 1]
                                .secondWeight
                            : null
                        }
                        disabled={
                          transactionCreation === "IN_PROGRESS" && index > 0
                        }
                      />
                      <SecondWeight {...field} key={`secondWeight_${index}`} />
                      {/* <MinusCircleOutlined onClick={() => remove(field.name)} /> */}
                    </>
                  ))}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => {
                        add();
                      }}
                      block
                      icon={<PlusOutlined />}
                    >
                      Add Another Transaction
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>

            <ActionButtons state={transactionCreation} />
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
