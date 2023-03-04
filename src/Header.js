import { React, useState, useEffect } from "react";
import { Layout } from "antd";
import dayjs from "dayjs";

const { Header } = Layout;

export const HeaderComp = () => {
  let now = dayjs();
  const [time, setTime] = useState(now.format("dddd, MMMM D YYYY HH:mm:ss"));

  useEffect(() => {
    setInterval(() => {
      let now = dayjs();
      setTime(now.format("dddd, MMMM D YYYY HH:mm:ss"));
    }, 1 * 1000);
  }, [time]);

  return (
    <Header className="header">
      <div className="logo">Al Dakheel Carton Factory</div>
      <div className=""> Username | {time}</div>
    </Header>
  );
};
