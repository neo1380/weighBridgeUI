import { Component } from "react";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
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
import { NotFound } from "./NotFound";

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
        <Router>
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
                  <Link to="/transactions">Transactions</Link>
                </Menu.Item>
                <Menu.Item key="4" icon={<DeploymentUnitOutlined />}>
                  <Link to="/weighm">Weight Management</Link>
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
                <Routes>
                  <Route exact path="/" element={<TransactionHistory />} />
                  <Route
                    exact
                    path="/transactions"
                    element={<TransactionHistory />}
                  />
                  <Route exact path="/weighm" element={<WeighManagement />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
                {/* <TransactionHistory /> */}
                {/* <WeighManagement /> */}
              </Content>
            </Layout>
          </Layout>
        </Router>
      </Layout>
    );
  }
}

export default Home;
