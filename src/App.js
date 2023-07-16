import fingerprint from "@fingerprintjs/fingerprintjs";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { YMaps } from "react-yandex-maps";
import { bindActionCreators } from "redux";
import apiRoutes from "./API/config/apiRoutes";
import { setSocketConnection } from "./API/socketInstance";
import "./assets/styles/fonts.css";
import "./assets/styles/style.css";
import WelcomeScreen from "./components/WelcomeScreen";
import env from "./config/env";
import useInitialAuth from "./hooks/initialAuth";
import useAxiosPrivate from "./hooks/useAxiosPrivate";
import AppRouter from "./routes/AppRouter";
import accessTokenActions from "./store/actions/accessToken";
import currentUserActions from "./store/actions/currentUser";

function App() {
  const isLoading = useInitialAuth();
  const dispatch = useDispatch();
  const { resetToken } = bindActionCreators(accessTokenActions, dispatch);
  const { resetCurrentUser } = bindActionCreators(currentUserActions, dispatch);
  const axiosPrivate = useAxiosPrivate();
  const [visitor, setVisitor] = useState("");
  const user = useSelector((state) => state?.currentUser);
  const [show, setShow] = useState(true);

  const handleLogout = async () => {
    const response = await axiosPrivate.post(
      `${process.env.REACT_APP_BASE_URL}${apiRoutes.LOGOUT}`
    );
    if (
      response &&
      response.status === 200 &&
      localStorage.getItem("fingerprint")
    ) {
      resetToken();
      resetCurrentUser();
    }
  };

  const onUnloadHandler = () => {
    const isNotRemember = localStorage.getItem("isNotRemember");
    if (isNotRemember === "true") {
      handleLogout();
      localStorage.removeItem("isNotRemember");
    }
  };

  useEffect(() => {
    user && user?.id && setSocketConnection(user?.id || 0);
  }, [user]);

  useEffect(() => {
    fingerprint
      .load()
      .then((fp) => fp.get())
      .then((result) => {
        setVisitor(result.visitorId);
      });
  }, []);

  useEffect(() => {
    localStorage.setItem("fingerprint", visitor);
  }, [visitor]);

  useEffect(() => {
    window.addEventListener("beforeunload", onUnloadHandler);
  }, []);

  if (isLoading) return <></>;

  // Hide welcome screen after 2 sec
  setTimeout(() => {
    setShow(false);
  }, 3000);

  return (
    <>
      {show ? (
        <WelcomeScreen />
      ) : (
        <BrowserRouter>
          <YMaps query={{ apikey: env.YMAPS_TOKEN, load: "package.full" }}>
            <AppRouter />
          </YMaps>
        </BrowserRouter>
      )}
    </>
  );
}

export default App;
