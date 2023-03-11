import { Component } from "react";
import { HashRouter as Router, Route, Link, Routes } from "react-router-dom";
import axios from "axios";
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
import { UserContext } from "../contexts/UserContexts";
import { SerialDataContext } from "../contexts/SerialDataContexts";
import { formatValue } from "../utils/format.utils";
import { API_ENDPOINTS, AUTH_URL } from "../constants/api.constants";

const { Sider, Content } = Layout;
let weightFromScale = null;
const getWeightFromScale = () => {
  var port,
    textEncoder,
    // eslint-disable-next-line no-unused-vars
    writableStreamClosed,
    // eslint-disable-next-line no-unused-vars
    writer;

  // const serialResultsDiv = document.getElementById("serialResults");
  async function connectSerial() {
    try {
      // Prompt user to select any serial port.
      port = await navigator.serial.requestPort();
      await port.open({ baudRate: 9600 });
      // eslint-disable-next-line no-undef
      textEncoder = new TextEncoderStream();
      writableStreamClosed = textEncoder.readable.pipeTo(port.writable);
      writer = textEncoder.writable.getWriter();
      await listenToPort();
    } catch (e) {
      console.error("Serial Connection Failed" + e);
    }
  }

  async function listenToPort() {
    console.log("HOME PAGE:Listening to port");
    // eslint-disable-next-line no-undef
    const textDecoder = new TextDecoderStream();
    // eslint-disable-next-line no-unused-vars
    const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
    const reader = textDecoder.readable.getReader();

    // Listen to data coming from the serial device.
    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        // Allow the serial port to be closed later.
        console.log("[readLoop] DONE", done);
        reader.releaseLock();
        break;
      }
      // value is a string.
      console.log("HOME PAGE:value from port", value);
      appendToTerminal(value);
    }
  }

  function appendToTerminal(newStuff) {
    weightFromScale = formatValue(newStuff);
    console.log("HOME PAGE:Weight from scale", weightFromScale);
  }
  connectSerial();
};

export class Home extends Component {
  hasToken = window.localStorage.getItem("token");
  state = {
    collapsed: false,
    isLoggedIn: this.hasToken ? true : false,
    user: null,
  };

  componentDidMount() {
    this.initApplication();
  }

  onCollapse = (collapsed) => {
    this.setState({ collapsed });
  };

  initApplication() {
    if (this.state.isLoggedIn) {
      const emp_id = window.localStorage.getItem("emp_id");
      this.getUserDetails({ emp_id });
    }
  }

  loginHandler = (values) => {
    const loginUrl = AUTH_URL + API_ENDPOINTS.LOGIN;
    axios.post(loginUrl, values).then(({ data }) => {
      if (data && typeof data.token !== "undefined") {
        this.getUserDetails(values);
        window.localStorage.setItem("token", data.token);
      }
    });
  };

  logoutHandler = () => {
    window.localStorage.clear();
    this.setState({ isLoggedIn: false });
    this.hasToken = null;
  };

  getUserDetails = ({ emp_id }) => {
    const url = AUTH_URL + API_ENDPOINTS.USER + `${emp_id}`;
    axios.get(url).then(({ data }) => {
      this.setState({ user: data.user });
      this.setState({ isLoggedIn: true });
      getWeightFromScale();
      window.localStorage.setItem("emp_id", `${emp_id}`);
    });
  };

  render() {
    return (
      <Layout style={{ minHeight: "100vh" }}>
        {!this.state.isLoggedIn ? (
          <Layout>
            <Content className="site-layout-background">
              <Login onLoginHandler={this.loginHandler} />
            </Content>
          </Layout>
        ) : (
          <UserContext.Provider value={this.state.user}>
            <SerialDataContext.Provider
              value={weightFromScale ? weightFromScale : null}
            >
              <Router>
                <HeaderComp onLogoutHandler={this.logoutHandler} />
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
                        <Route
                          exact
                          path="/weighm"
                          element={<WeighManagement />}
                        />
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
            </SerialDataContext.Provider>
          </UserContext.Provider>
        )}
      </Layout>
    );
  }
}

export default Home;
