import { React, useState, useEffect, useContext } from "react";
import { Layout } from "antd";
import dayjs from "dayjs";
import { UserContext } from "./contexts/UserContexts";

const { Header } = Layout;

export const HeaderComp = () => {
  const user = useContext(UserContext);
  let now = dayjs();
  const [time, setTime] = useState(now.format("dddd, MMMM D YYYY HH:mm:ss"));

  useEffect(() => {
    setInterval(() => {
      let now = dayjs();
      setTime(now.format("dddd, MMMM D YYYY HH:mm:ss"));
    }, 1 * 1000);
  }, []);

  return (
    <Header className="header">
      <div className="logo">Al Dakheel Carton Factory</div>
      {user ? (
        <div>
          <span>
            {user?.firstname} | {time}
          </span>
        </div>
      ) : null}
    </Header>
  );
};
