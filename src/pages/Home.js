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
import { HeaderComp } from "../Header";
import { WeighManagement } from "./WeightManagement";
import { TransactionHistory } from "./TransactionHistory";
import { NotFound } from "./NotFound";
import { Login } from "./Login";
import { EmployeeManagement } from "./EmployeeManagement";
import { MaterialManagement } from "./MaterialManagement";
import { OrderSummary } from "./OrderSummary";
import { OnGoingTransactions } from "./OngoingTransactions";

const { Sider, Content } = Layout;

export class Home extends Component {
  state = {
    collapsed: false,
    isLoggedIn: false,
  };

  onCollapse = (collapsed) => {
    console.log(collapsed);
    this.setState({ collapsed });
  };

  loginHandler = (values) => {
    if (values.username === "admin" && values.password === "admin") {
      this.setState({ isLoggedIn: true });
    }
  };

  render() {
    const state = { ...this.state };
    console.log(state);
    return (
      <Layout style={{ minHeight: "100vh" }}>
        {!state.isLoggedIn ? (
          <Layout>
            <Content className="site-layout-background">
              <Login onLoginHandler={this.loginHandler} />
            </Content>
          </Layout>
        ) : (
          <Router>
            <HeaderComp />
            <Layout>
              <Sider
                width={250}
                breakpoint="lg"
                collapsedWidth="0"
                onBreakpoint={(broken) => {
                  console.log(broken);
                }}
                onCollapse={(collapsed, type) => {
                  console.log(collapsed, type);
                }}
                className="site-layout-background hide-print"
              >
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
                    <Link to="/employee">Employee Management</Link>
                  </Menu.Item>
                  <Menu.Item key="3" icon={<DollarOutlined />}>
                    <Link to="/transactions">Transactions</Link>
                  </Menu.Item>
                  <Menu.Item key="4" icon={<DeploymentUnitOutlined />}>
                    <Link to="/weighm">Weight Management</Link>
                  </Menu.Item>
                  <Menu.Item key="5" icon={<GlobalOutlined />}>
                    <Link to="/material"> Material Management</Link>
                  </Menu.Item>
                  <Menu.Item key="6" icon={<GlobalOutlined />}>
                    <Link to="/ongoing"> Ongoing Transactions</Link>
                  </Menu.Item>
                  {/*    <Menu.Item key="6" icon={<GlobalOutlined />}>
                    <Link to="/summary"> Order Summary</Link>
                  </Menu.Item> */}
                </Menu>
              </Sider>

              <Layout
                style={{
                  padding: "24px",
                }}
              >
                <Content
                  className="site-layout-background"
                  style={{
                    padding: 24,
                    margin: 0,
                  }}
                >
                  <Routes>
                    <Route exact path="/" element={<WeighManagement />} />
                    <Route
                      exact
                      path="/transactions"
                      element={<TransactionHistory />}
                    />
                    <Route
                      exact
                      path="/employee"
                      element={<EmployeeManagement />}
                    />
                    <Route exact path="/weighm" element={<WeighManagement />} />
                    <Route
                      exact
                      path="/material"
                      element={<MaterialManagement />}
                    />
                    <Route
                      exact
                      path="/summary/:id"
                      element={<OrderSummary />}
                    />
                    <Route
                      exact
                      path="/ongoing"
                      element={<OnGoingTransactions />}
                    />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Content>
              </Layout>
            </Layout>
          </Router>
        )}
      </Layout>
    );
  }
}

export default Home;
