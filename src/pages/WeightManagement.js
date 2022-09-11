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
  Checkbox,
  Spin,
} from "antd";
import { useNavigate } from "react-router-dom";
import { Row, Col } from "antd";
import axios from "axios";
import { PlusOutlined } from "@ant-design/icons";
import "antd-css-utilities/utility.min.css";
import { API_ENDPOINTS, BASE_URL } from "../constants/api.constants";

const { Title } = Typography;
const { TextArea } = Input;

export const WeighManagement = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [transactionType, setTransactionType] = useState(null);
  const [priceType, setPriceType] = useState("L");
  const [selectedCustType, setSelectedCustType] = useState(null);
  const [customerTypeOptions, setCustomerTypeOptions] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [transactionCreation, setTransactionCreation] = useState(null);
  const [multipleTransactionEnabled, setMultipleTransactionEnabled] =
    useState(true);
  const [form] = Form.useForm();
  const [cancelForm] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [canReason, setCanReason] = useState("");
  const [tempTransactions, setTempTransactions] = useState([]);
  const [currentTransactionId, setCurrentTransactionId] = useState(null);
  const [enablePhoneNumber, setEnablePhoneNumber] = useState(false);
  const [enableCustName, setEnableCustName] = useState(false);
  const [enableVat, setEnableVat] = useState(false);
  //   const [enableCustId, setEnableCustId] = useState(false);

  const transactionTypes = [
    { label: "Incoming", value: "INC" },
    { label: "Outgoing", value: "OUT" },
    { label: "Weight Only", value: "weightonly" },
  ];
  const priceTypes = [
    { label: "Loose", value: "L" },
    { label: "Bale", value: "B" },
  ];
  const formInitValues = {
    size: "default",
    transferType: "INC",
    customerType: transactionType === "OUT" ? 1 : 3,
    childTransactionDtoList: [
      {
        materialId: null,
        firstWeight: null,
        secondWeight: null,
        baleOrLoose: "L",
        transactionId: null,
      },
    ],
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

  /*   const weightInputs = {
    childTransactionDtoList: [
      {
        materialId: null,
        firstWeight: null,
        secondWeight: null,
        baleOrLoose: "L",
        transactionId: null,
      },
    ],
  }; */

  /** Component composition */

  const TransactionType = ({ disabled }) => {
    return (
      <Form.Item label="Transaction type" name="transferType">
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

  const CustomerType = ({ disabled }) => {
    if (transactionType === "weightonly") {
      return null;
    }
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
              //   disabled={transactionCreation === "IN_PROGRESS"}
            >
              {label}
            </Radio.Button>
          ))}
        </Radio.Group>
      </Form.Item>
    );
  };

  const CustomerName = ({ disabled }) => {
    if (transactionType === "weightonly") {
      return null;
    }
    return (
      <Form.Item
        label="Customer Name"
        name="customerName"
        rules={[
          {
            required: transactionCreation === "IN_PROGRESS" ? true : false,
            message: "Please enter Customer's name",
          },
        ]}
      >
        <Input
          placeholder="Enter Customer Name"
          disabled={disabled === "IN_PROGRESS" && !enableCustName}
        />
      </Form.Item>
    );
  };

  const PhoneNumber = ({ disabled }) => {
    if (transactionType === "weightonly") {
      return null;
    }

    return (
      <Form.Item
        label="Phone Number"
        name="phoneNumber"
        rules={[
          {
            required: transactionCreation === "IN_PROGRESS" ? true : false,
            message: "Please enter Customer's Phone Number",
          },
        ]}
      >
        <InputNumber
          addonBefore="+966"
          style={{ width: "100%" }}
          placeholder="Enter Phone Number"
          disabled={disabled === "IN_PROGRESS" && !enablePhoneNumber}
        />
      </Form.Item>
    );
  };

  const CustomerID = ({ disabled }) => {
    if (transactionType === "weightonly") {
      return null;
    }
    if (selectedCustType !== 2) {
      return (
        <Form.Item
          label="Customer ID"
          name="customerId"
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

  const VehicleNumber = ({ disabled }) => {
    if (transactionType === "weightonly") {
      return null;
    }
    if (selectedCustType !== 1) {
      //customer type 1 is Layman
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

  const DriverCount = ({ disabled }) => {
    if (transactionType === "weightonly") {
      return null;
    }
    if (selectedCustType !== 1) {
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

  const Materials = ({ field, transaction }) => {
    // if (selectedCustType !== 3) {
    return (
      <Form.Item
        shouldUpdate
        label="Select Material"
        name={[field.name, "materialName"]}
        fieldKey={[field.fieldKey, "materialName"]}
      >
        <Select
          placeholder="Select Material"
          labelInValue
          onChange={onChangeMaterialType}
          loading={!materials.length}
          //   disabled={transaction?.transactionId}
        >
          {materials.map((opt, index) => (
            <Select.Option
              key={opt.materialId}
              label={opt.label}
              value={opt.materialId}
              //   disabled={disabled === "IN_PROGRESS"}
            >
              {opt.materialName}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
    );
    // } else {
    //   return null;
    // }
  };

  const PriceType = ({ field, transaction }) => {
    if (transactionType === "weightonly") {
      return null;
    }

    return (
      <Form.Item
        label="Price type"
        name={[field.name, "baleOrLoose"]}
        fieldKey={[field.fieldKey, "baleOrLoose"]}
        initialValue={field.value || priceType}
      >
        <Radio.Group
          buttonStyle="solid"
          onChange={onChangePriceType}
          value={priceType}
          //   disabled={transaction?.transactionId}
        >
          {priceTypes.map(({ label, value }) => (
            <Radio.Button
              value={value}
              key={value}
              onChange={onChangePriceType}
            >
              {label}
            </Radio.Button>
          ))}
        </Radio.Group>
      </Form.Item>
    );
  };

  const FirstWeight = (field, key) => {
    if (transactionType === "weightonly") {
      return null;
    }

    const { index } = field;

    const calcFirstWeight = (index) => {
      if (index > 0) {
        const prevField = form.getFieldValue("childTransactionDtoList")[
          index - 1
        ];
        if (!prevField) return;
        const currentFirstWeight = prevField.secondWeight;
        return currentFirstWeight;
      } else {
        return null;
      }
    };

    return (
      <Form.Item
        label="First Weight"
        name={[field.name, "firstWeight"]}
        fieldKey={[field.fieldKey, key]}
        initialValue={calcFirstWeight(index)}
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
    const firstWeight =
      field.firstWeightDetail && field.firstWeightDetail.firstWeight
        ? field.firstWeightDetail.firstWeight
        : null;
    let allowedMaxWeight =
      transactionType === "INC" ? firstWeight : Number.MAX_SAFE_INTEGER;
    let allowedMinWeight = transactionType === "INC" ? 1 : firstWeight;
    console.log("transactionType", transactionType);
    console.log("allowedMaxWeight", allowedMaxWeight);
    console.log("allowedMinWeight,", allowedMinWeight);
    if (transactionType === "weightonly") {
      return null;
    }

    if (transactionCreation === "IN_PROGRESS") {
      return (
        <Form.Item
          label="Second Weight"
          name={[field.name, "secondWeight"]}
          fieldKey={[field.fieldKey, key]}
          validateTrigger="onBlur"
          rules={[
            (obj) => ({
              validator(_, value) {
                const fieldName = _.field;
                let fieldNameArr = fieldName.split(".");
                let firstWeight = form.getFieldValue("childTransactionDtoList")[
                  fieldNameArr[1]
                ].firstWeight;

                if (!value || value.length === 0) {
                  return Promise.reject("Please enter Second Weight");
                }
                if (transactionType === "INC") {
                  if (value < firstWeight) {
                    return Promise.resolve();
                  } else {
                    return Promise.reject(
                      "In Incoming transactions, second weight should be lesser than first weight.."
                    );
                  }
                }

                if (transactionType === "OUT") {
                  if (value > firstWeight) {
                    return Promise.resolve();
                  } else {
                    return Promise.reject(
                      "In Outgoing transactions, second weight should be greater than first weight.."
                    );
                  }
                }
              },
            }),
          ]}
        >
          <InputNumber
            placeholder="Weight after unload"
            addonAfter="Kgs"
            onChange={(value) => onChangeSecondWeight(value)}
          />
        </Form.Item>
      );
    } else {
      return null;
    }
  };

  const TotalWeight = (field, key) => {
    if (transactionType !== "weightonly") {
      return null;
    }
    return (
      <Form.Item
        label="Total Weight"
        name={[field.name, "totalWeight"]}
        fieldKey={[field.fieldKey, key]}
        initialValue={field.weight}
        rules={[
          {
            required: true,
            message: "Please enter Total Weight",
          },
        ]}
      >
        <InputNumber
          placeholder="Capture Weight"
          disabled={field.disabled}
          addonAfter="Kgs"
        />
      </Form.Item>
    );
  };

  const Vat = ({ disabled }) => {
    const onChangeVat = (event) => {
      setEnableVat(event.target.checked);
    };

    return (
      <Form.Item label="" name="includeVat">
        <Checkbox
          checked={enableVat}
          //   disabled={transactionCreation === "IN_PROGRESS"}
          onChange={onChangeVat}
        >
          Include VAT for this transaction
        </Checkbox>
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
    console.log("areTransactionsInProgress()", areTransactionsInProgress());
    if (areTransactionsInProgress() === 0 || multipleTransactionEnabled) {
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

  const Spinner = () => <Spin className="spinner" tip="Loading Data ...." />;

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

  const onChangeTransactionType = (event) => {
    setTransactionType(event.target.value);
    handleCustomerTypes(event.target.value);
  };

  const onChangePriceType = (event) => {
    setPriceType(event.target.value);
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
  const handlePriceTypes = useCallback(
    (type) => {
      setPriceType("L");
      form.setFieldsValue({
        priceType: "L",
      });
    },
    [form]
  );

  // Keep the function reference
  const handleCustomerTypes = useCallback(
    (type) => {
      if (type === "INC") {
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

  const getTemporaryTransactions = () => {
    setIsLoading(true);
    axios
      .get(BASE_URL + API_ENDPOINTS.TEMP_TRANSACTION)
      .then((tempTransactions) => {
        setIsLoading(false);
        setTempTransactions(tempTransactions.data || []);
      });
  };

  useEffect(() => {
    handleCustomerTypes("INC");
    getTemporaryTransactions();
    const materialList = BASE_URL + API_ENDPOINTS.GET_MATERIAL;
    fetch(materialList)
      .then((response) => response.json())
      .then((materials) => {
        setMaterials(materials);
        setIsLoading(false);
      });
    setTransactionType("INC");
    setPriceType("L");
    handlePriceTypes();
    return () => setMaterials([]);
  }, [handleCustomerTypes, handlePriceTypes]);

  const onChangeUserType = (event) => {
    setSelectedCustType(event.target.value);
  };

  const onChangeMaterialType = (type) => {
    //add code to fetch price based on materials
  };

  const onReset = () => {
    form.resetFields();
    form.getFieldValue("childTransactionDtoList").length = 1;
  };

  const onFinish = (values) => {
    if (
      typeof values.customerID === "undefined" &&
      values.customerName &&
      values.phoneNumber
    ) {
      setIsLoading(true);
      let newCustomerID = null;
      const { customerName, phoneNumber } = values;
      newCustomerID = { customerId: `${customerName}_${phoneNumber}` };
      values = { ...values, ...newCustomerID };
    }
    console.log("Received values of form: ", values);
    const message = {
      initiated: "Transaction creation is in progress.",
      completed: "Transaction successfully completed",
    };
    const createTransaction = BASE_URL + API_ENDPOINTS.CREATE_TRANSACTION;
    const childTransactions = values.childTransactionDtoList || [];
    if (childTransactions.length) {
      childTransactions.map((child) => {
        child.materialType = child.materialName.value;
        child.vat = materials.find(
          (mat) => mat.materialId === child.materialType
        ).vat;
        if (!child.secondWeight) {
          delete child.secondWeight;
        }
        delete child.materialName;
        delete child.materialId;
        return child;
      });
    }
    const data = {
      customerName: values.customerName,
      customerId: values.customerId,
      vehicleNumber: values.vehicleNumber,
      customerType: values.customerType,
      phoneNumber: values.phoneNumber,
      driverCount: values.driverCount,
      transferType: values.transferType,
      childTransactionDtoList: [...childTransactions],
      cancelReason: cancelForm.cancelReason || "",
      isTransactionCompleted: multipleTransactionEnabled ? 0 : 1,
    };
    if (currentTransactionId) {
      data.id = currentTransactionId;
      data.includeVat = transactionType === "OUT" ? true : enableVat;
    }
    axios.post(createTransaction, data).then(({ data }) => {
      openMessage(message);
      getTemporaryTransactions();
      setCurrentTransactionId(null);
      setTransactionCreation(null);
      if (data.isTransactionCompleted) {
        navigate(`/summary/${currentTransactionId}`);
      } else {
        setIsLoading(false);
        onReset();
      }
    });
  };

  /* const closeTransaction = ($event) => {
    console.log(calculateRemainingWeight());
    const remainingWeight = calculateRemainingWeight();
    if (remainingWeight) {
      Modal.warning({
        title: "Close Transaction",
        content:
          "Cannot Close transaction; Please check If all materials are unloaded !",
      });
    }
    $event.preventDefault();
  }; */

  const loadTempTransaction = (transaction) => {
    if (transaction.id) {
      setCurrentTransactionId(transaction.id);
      setMultipleTransactionEnabled(false);
    }
    transaction.childTransactionDtoList.forEach((child) => {
      const { materialName, materialId } = materials.find(
        (material) =>
          material.materialId ===
          (child.materialType || child.materialName.value)
      );
      child.materialName = {
        label: materialName,
        value: materialId,
        key: materialId,
      };
      child.secondWeight = null;
      child.transactionId = transaction.id;
      delete child.materialType;
    });

    if (transaction.transferType === "INC") setTransactionType("INC");
    if (transaction.transferType === "OUT") setTransactionType("OUT");
    if (transaction.transferType === "weighonly")
      setTransactionType("weighonly");
    setSelectedCustType(transaction.customerType);
    setTransactionCreation("IN_PROGRESS");
    if (!transaction.phoneNumber) setEnablePhoneNumber(true);
    if (!transaction.customerName) setEnableCustName(true);
    form.setFieldsValue(transaction);
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

  const allowAnotherTransaction = (add) => {
    const childTransactions = form.getFieldValue("childTransactionDtoList");
    let secondWeighEntered = 0;
    let materialSelected = 0;
    childTransactions.forEach((element) => {
      if (element.secondWeight) {
        secondWeighEntered++;
      }
      if (typeof element.materialName !== "undefined") {
        materialSelected++;
      }
    });

    if (
      form.getFieldsError().filter(({ errors }) => errors.length).length > 0
    ) {
      Modal.warning({
        title: "Add Another Transaction",
        content:
          "Please check second weight of previous transaction or total weight entered !",
      });
      return;
    }

    if (
      materialSelected < childTransactions.length &&
      secondWeighEntered === childTransactions.length
    ) {
      Modal.warning({
        title: "Add Another Transaction",
        content: "Please check if material is selected !",
      });
      return;
    }

    if (secondWeighEntered < childTransactions.length) {
      Modal.warning({
        title: "Add Another Transaction",
        content:
          "Please check second weight of previous transaction or total weight entered !",
      });
      return;
    }

    add();
    setMultipleTransactionEnabled(true);
    return true;
  };

  const onChangeSecondWeight = (value) => {
    if (value === null) {
      //   setDisableAnotherTransaction(true);
      return;
    }
    // setDisableAnotherTransaction(false);
  };

  /*  const calcInitialWeight = () => {
    const childTransactions = form.getFieldValue("childTransactionDtoList");
    return childTransactions[0].firstWeight;
  }; */

  /*  const calculateRemainingWeight = () => {
    let remainingWeight = 0;
    remainingWeight = calcInitialWeight() - calculateEnteredWeight();
    return remainingWeight;
  };
 */
  /* const calculateEnteredWeight = () => {
    let enteredWeight = 0;
    const childTransactions = form.getFieldValue("childTransactionDtoList");
    childTransactions.forEach((element) => {
      enteredWeight = enteredWeight + element.secondWeight;
    });
    return enteredWeight;
  }; */
  /*  const isTransactionCreated = (transaction) => {
    if (transaction && transaction.transactionId) {
      console.log(transaction);
      return true;
    } else {
      return false;
    }
  }; */

  const areTransactionsInProgress = () => {
    const childTransactions = form.getFieldValue("childTransactionDtoList");
    const newTransactions = childTransactions.filter(
      (item) => item.transactionId
    );
    return newTransactions.length;
  };

  const WeightForm = () => {
    return (
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
            onFinish={onFinish}
          >
            <TransactionType />
            <CustomerType />
            <CustomerName />
            <PhoneNumber />
            <CustomerID />
            <VehicleNumber disabled={transactionCreation} />
            <DriverCount disabled={transactionCreation} />

            <Form.List shouldUpdate name="childTransactionDtoList">
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
                      <Materials
                        field={field}
                        transaction={
                          form.getFieldValue("childTransactionDtoList")[index]
                        }
                      />
                      <PriceType
                        field={field}
                        transaction={
                          form.getFieldValue("childTransactionDtoList")[index]
                        }
                      />
                      <FirstWeight
                        {...field}
                        key={`firstWeight_${index}`}
                        weightInputs={
                          index > 0
                            ? form.getFieldValue("childTransactionDtoList")[
                                index - 1
                              ]
                            : null
                        }
                        index={index}
                        disabled={transactionCreation === "IN_PROGRESS"}
                      />
                      <SecondWeight
                        {...field}
                        key={`secondWeight_${index}`}
                        firstWeightDetail={
                          form.getFieldValue("childTransactionDtoList")[index]
                        }
                      />

                      <TotalWeight {...field} key={`totalWeight_${index}`} />

                      {/* <MinusCircleOutlined onClick={() => remove(field.name)} /> */}
                    </>
                  ))}

                  {transactionCreation === "IN_PROGRESS" ? (
                    <Form.Item>
                      <Button
                        type="dashed"
                        onClick={() => {
                          allowAnotherTransaction(add);
                        }}
                        block
                        icon={<PlusOutlined />}
                        // disabled={disableAnotherTransaction}
                      >
                        Add Another Transaction
                      </Button>
                    </Form.Item>
                  ) : null}
                </>
              )}
            </Form.List>

            {transactionType !== "OUT" ? (
              <Vat disabled={transactionCreation} />
            ) : null}
            <ActionButtons state={transactionCreation} />
          </Form>
        </Col>
        <Col span={10} offset={2}>
          <div
            style={{
              marginLeft: "auto",
            }}
          >
            {/*  <Title type="primary" level={5}>
      Transaction History {tempTransactions.length}
    </Title>
    <Row gutter={16}>
      <Col span={12}>
        <Statistic title="Active" value={5} />
      </Col>
      <Col span={12}>
        <Statistic title="Completed" value={20} />
      </Col>
    </Row> */}

            {tempTransactions.length > 0 ? (
              <Row gutter={24}>
                <Col span={24}>
                  <Space direction="vertical">
                    <Title type="primary" level={5} className="mt-2">
                      List of Active transactions
                    </Title>

                    {tempTransactions.map((transaction) => {
                      return (
                        <Button
                          type="link"
                          key={transaction.id}
                          className="pl-0"
                          onClick={() => loadTempTransaction(transaction)}
                        >
                          {transaction?.vehicleNumber
                            ? transaction.vehicleNumber
                            : transaction.customerName}
                        </Button>
                      );
                    })}
                  </Space>
                </Col>
              </Row>
            ) : null}
          </div>
        </Col>
      </Row>
    );
  };

  return <>{isLoading ? <Spinner /> : <WeightForm />}</>;
};

export default WeighManagement;
