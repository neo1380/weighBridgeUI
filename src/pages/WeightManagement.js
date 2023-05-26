import React, { useState, useEffect, useCallback, useContext } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  Typography,
  Space,
  Modal,
  InputNumber,
  Radio,
  Spin,
  Checkbox,
} from "antd";
import { useNavigate } from "react-router-dom";
import { Row, Col } from "antd";
import axios from "axios";
import { PlusOutlined } from "@ant-design/icons";
import "antd-css-utilities/utility.min.css";
import { API_ENDPOINTS, BASE_URL } from "../constants/api.constants";
// import { formatValue } from "../utils/format.utils";
/* import { SerialDataContext } from "../contexts/SerialDataContexts";
import { UserContext } from "../contexts/UserContexts"; */

import { UserContext } from "../contexts/UserContexts";

const { Title } = Typography;
const { TextArea } = Input;

export const WeighManagement = () => {
  const navigate = useNavigate();
  const user = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);
  const [transactionType, setTransactionType] = useState(null);
  const [vehicleType, setVehicleType] = useState("LT");
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

  const [tempTransactions, setTempTransactions] = useState([]);
  const [currentTransactionId, setCurrentTransactionId] = useState(null);
  const [enablePhoneNumber, setEnablePhoneNumber] = useState(false);
  const [enableCustName, setEnableCustName] = useState(false);
  const [enableVat, setEnableVat] = useState(false);

  const [isWeightReadFromDevice, setIsWeightReadFromDevice] = useState(true);
  const [rawWeightId, setRawWeightId] = useState(null);
  const [editMode, setEditMode] = useState(false);
  //   const [enableCustId, setEnableCustId] = useState(false);

  const transactionTypes = [
    { label: "Incoming", value: "INC" },
    { label: "Outgoing", value: "OUT" },
    // { label: "Weight Only", value: "WEIGH" },
  ];

  const vehicleTypes = [
    { label: "Light", value: "LT" },
    { label: "Heavy", value: "HV" },
  ];
  const priceTypes = [
    { label: "Loose", value: "L" },
    { label: "Bale", value: "B" },
  ];
  const formInitValues = {
    size: "default",
    transferType: "INC",
    vehicleType: "LT",
    customerType: transactionType === "OUT" ? 1 : 3,
    childTransactionDtoList: [
      {
        materialId: null,
        // firstWeight: null,
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
          disabled={disabled}
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
    if (transactionType === "WEIGH") {
      return null;
    }
    return (
      <Form.Item
        label="Customer Type"
        name="customerType"
        value={selectedCustType}
      >
        <Radio.Group buttonStyle="solid" disabled={disabled}>
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
    if (transactionType === "WEIGH") {
      return null;
    }
    return (
      <Form.Item
        label="Customer Name"
        name="customerName"
        rules={[
          {
            // required: transactionCreation === "IN_PROGRESS" ? true : false,
            required: false,
            message: "Please enter Customer's name",
          },
        ]}
      >
        <Input
          allowClear
          placeholder="Enter Customer Name"
          disabled={disabled && !enableCustName}
        />
      </Form.Item>
    );
  };

  const PhoneNumber = ({ disabled }) => {
    if (transactionType === "WEIGH") {
      return null;
    }

    return (
      <Form.Item
        label="Phone Number"
        name="phoneNumber"
        rules={[
          {
            // required: transactionCreation === "IN_PROGRESS" ? true : false,
            required: false,
            message: "Please enter Customer's Phone Number",
          },
        ]}
      >
        <InputNumber
          addonBefore="+966"
          style={{ width: "100%" }}
          placeholder="Enter Phone Number"
          disabled={disabled && !enablePhoneNumber}
        />
      </Form.Item>
    );
  };

  const CustomerID = ({ disabled }) => {
    if (transactionType === "WEIGH") {
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
            allowClear
            placeholder="Enter Customer ID"
            disabled={disabled}
          />
        </Form.Item>
      );
    } else {
      return null;
    }
  };

  const VehicleNumber = ({ disabled }) => {
    /*  if (transactionType === "WEIGH") {
      return null;
    } */

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
            allowClear
            placeholder="Enter Vehicle Number"
            onBlur={validateVehicleNumber}
            disabled={disabled}
          />
        </Form.Item>
      );
    } else {
      return null;
    }
  };

  const VehicleType = ({ disabled }) => {
    const onChangeVehicleType = (event) => {
      setVehicleType(event.target.value);
      if (event.target.value === "LT") {
        setIsWeightReadFromDevice(true);
      } else {
        setIsWeightReadFromDevice(false);
      }
    };
    if (transactionType === "WEIGH") {
      return null;
    }
    return (
      <Form.Item
        label="Vehicle type"
        name="vehicleType"
        rules={[
          {
            // required: true,
            required: false,
            message: "Please choose a vehicle type",
          },
        ]}
      >
        <Radio.Group
          buttonStyle="solid"
          value={vehicleType}
          disabled={disabled}
          onChange={onChangeVehicleType}
        >
          {vehicleTypes.map(({ label, value }) => (
            <Radio.Button value={value} key={value}>
              {label}
            </Radio.Button>
          ))}
        </Radio.Group>
      </Form.Item>
    );
  };

  const DriverCount = ({ disabled }) => {
    if (transactionType === "WEIGH") {
      return null;
    }
    if (selectedCustType !== 1) {
      return (
        <Form.Item
          label="Driver Count"
          name="driverCount"
          rules={[
            {
              //   required: true,
              required: true,
              message: "Please enter Driver Count",
            },
          ]}
        >
          <Input
            allowClear
            placeholder="Enter Driver Count"
            disabled={disabled === "IN_PROGRESS"}
          />
        </Form.Item>
      );
    } else {
      return null;
    }
  };

  const Materials = ({ field }) => {
    const [value, setValue] = useState();
    const [filteredMaterials, setfilteredMaterials] = useState([]);
    if (transactionType === "WEIGH") {
      return null;
    }

    const handleChange = (newValue) => {
      setValue(newValue);
    };

    const handleSearch = (value) => {
      const currentTransaction = tempTransactions.filter(
        (item) => item.id === currentTransactionId
      );
      let filteredMaterials = [];
      let filteredMat = [];
      if (currentTransaction.length) {
        const childTransactions = currentTransaction[0].childTransactionDtoList;
        const childTransactionsIds = childTransactions.map(
          (child) => child.materialName.value
        );
        filteredMaterials = materials.filter(
          (mat) => !childTransactionsIds.includes(mat.materialId)
        );
        filteredMat = filteredMaterials.filter(
          (mat) => mat.materialId === +value
        );
        console.log(filteredMat);
        setfilteredMaterials(filteredMat);
      } else {
        filteredMat = materials.filter((mat) => mat.materialId === +value);
        console.log(filteredMat);
        setfilteredMaterials(filteredMat);
      }
      return filteredMat;
    };

    // if (selectedCustType !== 3) {
    return (
      <Form.Item
        shouldUpdate
        label="Select Material"
        name={[field.name, "materialName"]}
        fieldKey={[field.fieldKey, "materialName"]}
        rules={[
          {
            required: true,
            message: "Please select material",
          },
        ]}
      >
        <Select
          placeholder="Type Material ID"
          showSearch
          allowClear
          value={value}
          labelInValue
          showArrow={false}
          filterOption={false}
          onSearch={handleSearch}
          notFoundContent={null}
          onChange={handleChange}
          loading={!materials.length}
          //   disabled={transaction?.transactionId}
        >
          {filteredMaterials.map((opt) => (
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

  const PriceType = ({ field }) => {
    if (transactionType === "WEIGH") {
      return null;
    }

    return (
      <Form.Item
        label="Material Collection Type"
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
    /*    if (transactionType === "WEIGH") {
      return null;
    } */

    const { index } = field;

    const calcFirstWeight = (index) => {
      if (index > 0) {
        const prevField = form.getFieldValue("childTransactionDtoList")[
          index - 1
        ];

        const currentFirstWeight = prevField.secondWeight;
        return currentFirstWeight;
      } else {
        return null;
      }
    };

    const hasFirstWeight =
      form.getFieldValue("childTransactionDtoList")[index].firstWeight || null;

    const disableField = hasFirstWeight || vehicleType === "LT";

    return (
      <>
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
            disabled={disableField}
            addonAfter="Kgs"
          />
        </Form.Item>
        {!hasFirstWeight && vehicleType === "LT" ? (
          <Form.Item>
            <Button
              type="primary"
              onClick={(event) => {
                event.preventDefault();
                getWeightFromDevice();
              }}
              className="mr-3"
            >
              Get Weight
            </Button>
          </Form.Item>
        ) : null}
      </>
    );
  };

  const SecondWeight = (field, key) => {
    const currentTransaction = field.transaction;
    if (
      !currentTransaction ||
      !currentTransaction.firstWeight ||
      !currentTransaction.transactionId
    )
      return null;
    const { index } = field;

    const calcSecondWeight = (index) => {
      let secondWeight = null;
      const currTransaction = form.getFieldValue("childTransactionDtoList")[
        index
      ];
      if (currTransaction.secondWeight) {
        secondWeight =
          form.getFieldValue("childTransactionDtoList")[index].secondWeight ||
          null;
      }
      return secondWeight;
    };

    const hasFirstWeight = form.getFieldValue("childTransactionDtoList")[index]
      .firstWeight;
    const hasSecondWeight = form.getFieldValue("childTransactionDtoList")[index]
      .secondWeight;

    const readWeightFromDevice =
      hasFirstWeight && !hasSecondWeight && vehicleType === "LT";

    const disableSecondWeight = () => {
      let isDisabled = false;

      if (vehicleType === "HV" && !hasSecondWeight) {
        return isDisabled;
      }

      if (vehicleType === "LT" || hasSecondWeight) {
        isDisabled = true;
      }

      return isDisabled;
    };

    if (transactionCreation === "IN_PROGRESS") {
      return (
        <>
          <Form.Item
            label="Second Weight"
            name={[field.name, "secondWeight"]}
            fieldKey={[field.fieldKey, key]}
            validateTrigger="onBlur"
            initialValue={calcSecondWeight(index)}
            rules={[
              () => ({
                validator(_, value) {
                  const fieldName = _.field;
                  let fieldNameArr = fieldName.split(".");
                  let firstWeight = form.getFieldValue(
                    "childTransactionDtoList"
                  )[fieldNameArr[1]].firstWeight;

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
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <InputNumber
              placeholder="Weight after unload"
              addonAfter="Kgs"
              disabled={disableSecondWeight(index)}
              onChange={(value) => onChangeSecondWeight(value)}
            />
          </Form.Item>
          {readWeightFromDevice ? (
            <Form.Item>
              <Button
                type="primary"
                onClick={(event) => {
                  event.preventDefault();
                  getWeightFromDevice();
                }}
                className="mr-3"
              >
                Get Weight
              </Button>
            </Form.Item>
          ) : null}
        </>
      );
    } else {
      return null;
    }
  };

  const Spinner = () => <Spin className="spinner" tip="Loading..." />;

  const Vat = () => {
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

  const CancellationReasons = ({ setButtonDisabled }) => {
    const [others, showOthers] = useState(false);
    const [allowEdit, setAllowEdit] = useState(false);

    const onSelectCanReason = (reason) => {
      if (reason?.toLowerCase() === "others") {
        showOthers(true);
      } else {
        showOthers(false);
      }

      if (reason?.toLowerCase().includes("error_data_entry")) {
        setAllowEdit(true);
      }
      setTimeout(() => {
        if (reason?.toLowerCase() === "others") {
          setButtonDisabled(!others);
        } else {
          setButtonDisabled(false);
        }
      }, 100);
    };

    const editCurrentTransaction = () => {
      console.log("Set Current Transaction to Edit mode...");
      //   setTransactionCreation(null);
      setEditMode(true);
      handleCancel();
    };

    return (
      <Form
        form={cancelForm}
        layout="vertical"
        shouldUpdate
        autoComplete="off"
        initialValues={{
          cancellationReason: null,
          otherReason: null,
        }}
        onFieldsChange={() => {
          setButtonDisabled(
            cancelForm.getFieldsError().some((field) => field.errors.length > 0)
          );
        }}
      >
        <Form.Item
          label="Select a Cancellation Reason"
          name="cancellationReason"
          rules={[
            {
              required: true,
              message: "Please select a reason",
            },
          ]}
        >
          <Select
            placeholder="Select Cancellation Reason"
            allowClear
            onChange={onSelectCanReason}
          >
            {cancelReasons.map((opt) => (
              <Select.Option
                key={opt.value}
                label={opt.label}
                value={opt.value}
              >
                {opt.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        {others ? (
          <Form.Item
            label="Enter reason for cancellation"
            name="otherReason"
            rules={[
              {
                required: true,
                message: "Please enter a valid reason",
              },
            ]}
          >
            <TextArea required allowClear showCount maxLength={100} />
          </Form.Item>
        ) : null}

        {allowEdit ? (
          <Form.Item>
            <Button
              type="primary"
              className="mr-3"
              onClick={() => editCurrentTransaction()}
            >
              Edit this transaction
            </Button>
          </Form.Item>
        ) : null}
      </Form>
    );
  };

  const ActionButtons = () => {
    if (
      areTransactionsInProgress() === 0 ||
      multipleTransactionEnabled ||
      !transactionCreation
    ) {
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

  //   const Spinner = () => <Spin className="spinner" tip="Loading Data ...." />;

  /** Event handlers */
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    const formData = form.getFieldValue();
    const { cancellationReason, otherReason } = cancelForm.getFieldValue();
    formData.cancelReason = otherReason ? otherReason : cancellationReason;
    formData.isTransactionCancelled = true;
    formData.isTransactionCompleted = 1;
    delete formData.size;
    delete formData.transactionStatus;
    delete formData.finalAmount;
    delete formData.totalWeight;
    delete formData.vatCost;

    // cleanChildTransactions(formData);

    const createTransaction = BASE_URL + API_ENDPOINTS.CREATE_TRANSACTION;

    axios.post(createTransaction, formData).then(() => {
      onReset();
      // openMessage();
      getTemporaryTransactions();
      setCurrentTransactionId(null);
      setTransactionCreation(null);
      setIsModalVisible(false);
    });
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
    const [buttonDisabled, setButtonDisabled] = useState(true);
    return (
      <Modal
        title="Cancel Transaction"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okButtonProps={{ disabled: buttonDisabled }}
      >
        <CancellationReasons setButtonDisabled={setButtonDisabled} />
      </Modal>
    );
  };

  // Keep the function reference
  const handlePriceTypes = useCallback(() => {
    setPriceType("L");
    form.setFieldsValue({
      priceType: "L",
    });
  }, [form]);

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

  const setWeightInForm = useCallback(
    (weightFromDevice) => {
      /*    const totalTransactions = form.getFieldValue(
        "childTransactionDtoList"
      ).length; */
      const childTransactions = form.getFieldValue("childTransactionDtoList");
      //New transaction created for the first time, Current Transaction ID will be null. So, directly assign first weight to device weight & second weight to null.
      // childTransactions[0].firstWeight = weightFromDevice;
      const firstWeightLists = childTransactions.map(
        (transaction) => transaction.firstWeight
      );
      const secondWeightLists = childTransactions.map(
        (transaction) => transaction.secondWeight
      );
      const emptyFirstWeightIndex = firstWeightLists.findIndex(
        (item) => item === "undefined" || item === null
      );
      const emptySecondWeightIndex = secondWeightLists.findIndex(
        (item) => item === "undefined" || item === null
      );

      if (emptyFirstWeightIndex > -1) {
        childTransactions[emptyFirstWeightIndex].firstWeight = weightFromDevice;
      } else if (emptySecondWeightIndex > -1) {
        childTransactions[emptySecondWeightIndex].secondWeight =
          weightFromDevice;
      }

      form.setFieldsValue({
        childTransactionDtoList: childTransactions,
      });
      setIsWeightReadFromDevice(true);
    },
    [form]
  );

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
    setVehicleType("LT");
    handlePriceTypes();
    return () => setMaterials([]);
  }, [handleCustomerTypes, handlePriceTypes]);

  const getWeightFromDevice = () => {
    setIsLoading(true);
    axios
      .get(BASE_URL + API_ENDPOINTS.GET_WEIGHT_FROM_DEVICE)
      .then(({ data }) => {
        setIsLoading(false);
        const { weight, id } = data;
        //   setWeightFromScale(weight);
        setRawWeightId(id);
        setWeightInForm(weight);
        console.log("Data from weight device");
        console.log(weight);
      })
      .catch(() => {
        setIsWeightReadFromDevice(false);
      });
  };

  const onChangeUserType = (event) => {
    setSelectedCustType(event.target.value);
  };

  const onReset = () => {
    form.resetFields();
    form.getFieldValue("childTransactionDtoList").length = 1;
  };

  const duplicateTransaction = (value) => {
    const filteredTransactions = tempTransactions.filter(
      (transaction) => transaction.vehicleNumber === value
    );
    if (filteredTransactions.length) {
      Modal.warning({
        title: "Ongoing Transaction",
        content: `There is an ongoing transaction with vehicle Number - ${value}. Please close the ongoing transaction or create this transaction with a new Vehicle Number !`,
      });
    }
    return filteredTransactions;
  };

  const onFinish = (values) => {
    const { vehicleNumber } = values;
    if (!currentTransactionId) {
      const duplicateTransactions = duplicateTransaction(vehicleNumber);
      if (duplicateTransactions.length) {
        return;
      }
    }

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

    const createTransaction = BASE_URL + API_ENDPOINTS.CREATE_TRANSACTION;
    const childTransactions = values.childTransactionDtoList || [];
    if (childTransactions.length) {
      childTransactions.map((child) => {
        if (transactionType !== "WEIGH") {
          child.materialType = child.materialName.value;
          child.vat = materials.find(
            (mat) => mat.materialId === child.materialType
          ).vat;
          delete child.materialName;
          delete child.materialId;
        } else {
          //For weight only. material will be chosen behind the scenes.
          child.materialType = 31;
          child.vat = 2.5;
          child.baleOrLoose = "B";
          delete child.materialId;
        }
        if (!child.secondWeight) {
          delete child.secondWeight;
        }

        delete child.transactionId;
        delete child.id;
        delete child.absoluteWeight;
        delete child.materialPricewithVat;
        delete child.materialPricewithoutVat;
        delete child.vatCost;
        return child;
      });
    }

    const getTransactionCompletion = () => {
      console.log(childTransactions);
      const hasAllFirstWeight = childTransactions.every(
        (item) =>
          item.firstWeight &&
          (item.firstWeight !== null || item.firstWeight !== undefined)
      );
      const hasAllSecondWeight = childTransactions.every(
        (item) =>
          item.secondWeight &&
          (item.secondWeight !== null || item.secondWeight !== undefined)
      );

      if (hasAllFirstWeight && hasAllSecondWeight) {
        return 1; // transaction is completed
      } else {
        return 0; //some transaction is in progress
      }
    };

    const payload = {
      customerName: values.customerName,
      customerId: values.customerId,
      vehicleNumber: values.vehicleNumber,
      customerType: values.customerType,
      phoneNumber: values.phoneNumber,
      driverCount: values.driverCount,
      transferType: values.transferType,
      vehicleType: values.vehicleType,
      childTransactionDtoList: [...childTransactions],
      cancelReason: cancelForm.cancelReason || "",
      isTransactionCompleted: getTransactionCompletion(),
      created_by: !currentTransactionId
        ? user.emp_id
        : tempTransactions.find((item) => item.id === currentTransactionId)
            .created_by,
      closed_by: user.emp_id,
    };
    if (currentTransactionId) {
      payload.id = currentTransactionId;
      payload.includeVat =
        transactionType === "OUT"
          ? true
          : transactionType === "WEIGH"
          ? false
          : Boolean(enableVat);
    }
    if (rawWeightId && isWeightReadFromDevice) {
      payload.rawWeightId = rawWeightId;
    }
    axios.post(createTransaction, payload).then(({ data }) => {
      if (data.isTransactionCompleted) {
        navigate(`/summary/${currentTransactionId}`);
      } else {
        onReset();
        getTemporaryTransactions();
        setCurrentTransactionId(null);
        setTransactionCreation(null);
        setTransactionType("INC");
        setIsLoading(false);
        setEditMode(false);
      }
    });
  };

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
      child.transactionId = transaction.id;
      delete child.materialType;
    });

    if (transaction.transferType === "INC") setTransactionType("INC");
    if (transaction.transferType === "OUT") setTransactionType("OUT");
    if (transaction.transferType === "WEIGH") setTransactionType("WEIGH");
    if (transaction.vehicleType) setVehicleType(transaction.vehicleType);
    setSelectedCustType(transaction.customerType);
    setTransactionCreation("IN_PROGRESS");
    if (!transaction.phoneNumber) setEnablePhoneNumber(true);
    if (!transaction.customerName) setEnableCustName(true);
    form.setFieldsValue(transaction);
  };

  const cancelTransaction = () => {
    if (transactionCreation === "IN_PROGRESS") {
      showModal();
    }
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
        content: "Please check second weight of previous transaction.",
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
        content: "Please check second weight of previous transaction.",
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

  const areTransactionsInProgress = () => {
    const childTransactions = form.getFieldValue("childTransactionDtoList");
    const newTransactions = childTransactions.filter(
      (item) => item.transactionId
    );
    return newTransactions.length;
  };

  const validateVehicleNumber = ($event) => {
    const value = $event.target.value;
    const count = duplicateTransaction(value);
    return count;
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
            <TransactionType
              disabled={transactionCreation === "IN_PROGRESS" && !editMode}
            />
            <CustomerType
              disabled={transactionCreation === "IN_PROGRESS" && !editMode}
            />
            <CustomerName />
            <PhoneNumber />
            <CustomerID />
            <VehicleType
              disabled={transactionCreation === "IN_PROGRESS" && !editMode}
            />
            <VehicleNumber
              disabled={transactionCreation === "IN_PROGRESS" && !editMode}
            />
            <DriverCount
              disabled={transactionCreation === "IN_PROGRESS" && !editMode}
            />

            <Form.List shouldUpdate name="childTransactionDtoList">
              {(fields, { add }) => (
                <>
                  {fields.map((field, index) => (
                    <>
                      {transactionType !== "WEIGH" ? (
                        <Col span={12} offset={2} className="mb-5">
                          <Typography.Title level={4} style={{ margin: 0 }}>
                            Transaction: {index + 1}
                          </Typography.Title>
                        </Col>
                      ) : null}

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
                        index={index}
                      />

                      <SecondWeight
                        {...field}
                        key={`secondWeight_${index}`}
                        firstWeightDetail={
                          form.getFieldValue("childTransactionDtoList")[index]
                        }
                        transaction={
                          form.getFieldValue("childTransactionDtoList")[index]
                        }
                        index={index}
                      />
                    </>
                  ))}

                  {!multipleTransactionEnabled ? (
                    <Form.Item>
                      <Button
                        type="dashed"
                        onClick={() => {
                          allowAnotherTransaction(add);
                        }}
                        block
                        icon={<PlusOutlined />}
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
                      Ongoing transactions
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

  //   return <>{isLoading ? <Spinner /> : <WeightForm />}</>;
  return <>{isLoading ? <Spinner /> : <WeightForm />}</>;
};

export default WeighManagement;
