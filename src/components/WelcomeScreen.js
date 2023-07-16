import { useEffect, useState } from "react";

import { useCurrentUser } from "../store/reducers";

import "../assets/styles/WelcomeScreen.css";

function WelcomeScreen() {
  const currentUser = useCurrentUser();

  const [userName, setUserName] = useState("");
  const [timeType, setTimeType] = useState();

  const welcomeTexts = [
    "Доброе утро",
    "Добрый день",
    "Добрый вечер",
    "Доброй ночи",
  ];

  const containerClasses = ["morning", "day", "evening", "night"];

  useEffect(() => {
    setUserName(currentUser?.firstName);
  }, [currentUser]);

  useEffect(() => {
    setUserName(currentUser?.firstName);
  }, [timeType]);

  useEffect(() => {
    let date = new Date();
    let h = Math.round(date.getHours());

    if (h >= 6 && h < 12) {
      setTimeType(0);
    }
    if (h >= 12 && h < 18) {
      setTimeType(1);
    }
    if (h >= 18 && h < 24) {
      setTimeType(2);
    }
    if (h >= 0 && h < 6) {
      setTimeType(3);
    }
  }, []);

  return (
    <div className={`welcomeContainer ${containerClasses[timeType]}`}>
      <div className="welcomeText">
        <span>{`${welcomeTexts[timeType]}`}</span>
        <br />
        {userName && <span className="userNameText">{userName}</span>}
      </div>
    </div>
  );
}

export default WelcomeScreen;
