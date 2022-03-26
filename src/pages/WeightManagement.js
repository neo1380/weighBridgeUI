import React, { useState,useEffect } from "react";
import { Form, Input, Button, Select, Typography } from "antd";

const { Title } = Typography;

export const WeighManagement = () => {
  const [componentSize, setComponentSize] = useState("default");
  const [userType, setUserType] = useState("merchant");
  const [transactionType, setTransactionType] = useState("temporary");
  const [customerType,setCustomerType] = useState([]);
  const [materials,setMaterials] = useState([]);

  

  const onFormLayoutChange = ({ size }) => {
    setComponentSize(size);
  };

  useEffect(() => {
    // GET request using fetch to load customer types
     fetch('https://api.npms.io/v2/search?q=react')
        .then(response => response.json())
        .then(data =>{ console.log(data)
            
            const custtypes = [
                {
                    "value":1,
                    "label":"Merchant"
                },
                {
                    "value":2,
                    "label":"Layman"
                },
                {
                    "value":3,
                    "label":"Vehicle-only"
                }
            ];
            setCustomerType(custtypes);            
        });

    // GET request using fetch to load material types

        fetch('https://api.npms.io/v2/search?q=react')
        .then(response => response.json())
        .then(data =>{ console.log(data)
            
            const materials = [
                {
                    "label":"Paper",
                    "value":"Paper"
                },
                {
                    "label":"Carton",
                    "value":"Carton"
                },   {
                    "label":"Duplex",
                    "value":"Duplex"
                },   {
                    "label":"Mix",
                    "value":"Mix"
                },   {
                    "label":"Plastic",
                    "value":"Plastic"
                },
                {
                    "label":"Magazine",
                    "value":"Magazine"
                },
            ]
            setMaterials(materials);            
        });

// empty dependency array means this effect will only run once (like componentDidMount in classes)
}, []);


useEffect(() => {
    // GET request using fetch inside useEffect React hook
    // this.setState({setTransactionType:'final'});
    setTransactionType('temporary');
    setTransactionType('final');
// empty dependency array means this effect will only run once (like componentDidMount in classes)
}, []);

  const onChangeUserType = (type) => {
    console.log("from user type");
    console.log(type);
    setUserType(type);
  };
  const onChangeMaterialType = (type) => {
    console.log("from material type");
    console.log(type);
  };

  const ShowSecondWeight = () => {
    if (userType !== 3 && transactionType === 'final') {
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
    if (userType !== "vehicleOnly") {
      return (
      
        <Form.Item label="Select Material" name="material">
        <Select
          placeholder="Select Material"
          onChange={onChangeMaterialType}
          loading={!materials.length}
        >
        {materials.map(opt => (
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
          Add Transaction
        </Title>
      </Form.Item>
      <Form.Item label="Customer Name" name="customerName">
        <Input placeholder="Enter Customer Name" />
      </Form.Item>

      <Form.Item label="Customer Type" name="customerType">
        <Select
          placeholder="Select a Customer Type"
          onChange={onChangeUserType}
          loading={!customerType.length}
        >
        {customerType.map(opt => (
            <Select.Option key={opt.value} value={opt.value}>
              {opt.label}
            </Select.Option>
          ))}

       
        </Select>
      </Form.Item>
      <Form.Item label="Customer ID" name="customerID">
        <Input placeholder="Enter Customer ID" />
      </Form.Item>
      <ShowMaterial />
      <Form.Item label="Vehicle Number" name="vehicleNumber">
        <Input placeholder="Enter Vehicle Number" />
      </Form.Item>
      <Form.Item label="Driver Count" name="driverCount">
        <Input placeholder="Enter Driver Count" />
      </Form.Item>
      <Form.Item label="First Weight" name="firstWeight">
        <Input placeholder="Enter weight before unload" />
      </Form.Item>
      <ShowSecondWeight />
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default WeighManagement;
