import { Component } from "react";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import { Layout, Menu } from "antd";
import {
  DeploymentUnitOutlined,
  DollarOutlined,
  AppstoreOutlined,
  GlobalOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import { HeaderComp } from "./Header";
import { WeighManagement } from "./WeightManagement";
import { TransactionHistory } from "./TransactionHistory";

// import { Login } from "./Login";

const { Sider, Content } = Layout;

export class Home extends Component {
  state = {
    collapsed: false,
  };

  onCollapse = (collapsed) => {
    console.log(collapsed);
    this.setState({ collapsed });
  };

  render() {
    return (
      <Layout style={{ height: "100vh" }}>
        {/* <Login /> */}
        <HeaderComp />
        <Layout>
          <Sider width={250} className="site-layout-background">
            <Menu
              mode="inline"
              defaultSelectedKeys={["4"]}
              defaultOpenKeys={["sub1"]}
              style={{ height: "100%", borderRight: 0 }}
            >
              <Menu.Item key="1" icon={<AppstoreOutlined />}>
                Dashboard
              </Menu.Item>
              <Menu.Item key="2" icon={<UsergroupAddOutlined />}>
                Employee Management
              </Menu.Item>
              <Menu.Item key="3" icon={<DollarOutlined />}>
                Transactions
              </Menu.Item>
              <Menu.Item key="4" icon={<DeploymentUnitOutlined />}>
                Weight Management
              </Menu.Item>
              <Menu.Item key="5" icon={<GlobalOutlined />}>
                Material Management
              </Menu.Item>
            </Menu>
          </Sider>
          <Layout
            style={{ padding: "0 24px 0", height: "100vh", overflow: "auto" }}
          >
            <Content
              className="site-layout-background"
              style={{
                padding: 24,
                margin: 0,
              }}
            >
              <TransactionHistory />
              {/* <WeighManagement /> */}
            </Content>
          </Layout>
        </Layout>
      </Layout>
    );
  }
}

export default Home;
