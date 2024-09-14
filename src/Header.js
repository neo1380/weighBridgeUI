import { React, useContext } from "react";

import { Layout } from "antd";
// import dayjs from "dayjs";
import { UserContext } from "./contexts/UserContexts";

const { Header } = Layout;

export const HeaderComp = (props) => {
  const user = useContext(UserContext);

  /*  let now = dayjs();
  const [time, setTime] = useState(now.format("dddd, MMMM D YYYY HH:mm:ss"));

  useEffect(() => {
    setInterval(() => {
      let now = dayjs();
      setTime(now.format("dddd, MMMM D YYYY HH:mm:ss"));
    }, 1 * 1000);
  }, []); */

  const triggerLogout = () => {
    props.onLogoutHandler();
  };

  return (
    <Header className="header">
      <div className="logo">Najmat Al-Beeah Industrial Company</div>
      {user ? (
        <div>
          <span>
            {user?.firstname} | {user?.emp_id} |{" "}
            <span className="cursor-pointer" onClick={() => triggerLogout()}>
              Logout
            </span>
          </span>
        </div>
      ) : null}
    </Header>
  );
};
