import React from "react";
import { Route, Routes } from "react-router-dom";

import Articles from "../components/Articles";
import WelcomeScreen from "../components/WelcomeScreen";
import AppLayout from "../layouts/AppLayout";
import Advertise from "../pages/Advertise";
import AllServices from "../pages/AllServices";
import ArticlePage from "../pages/ArticlePage";
import CardPage from "../pages/CardPage";
import Catalog from "../pages/Catalog";
import CatalogList from "../pages/CatalogList";
import Hypothec from "../pages/Hypothec";
import Insurance from "../pages/Insurance";
import Login from "../pages/Login";
import MainPage from "../pages/MainPage";
import NotFound from "../pages/NotFound";
import Password1 from "../pages/Password1";
import Password2 from "../pages/Password2";
import PersonalAccount from "../pages/PersonalAccount";
import Policy from "../pages/Policy";
import Registration from "../pages/Registration";
import Services from "../pages/Services";
import UserPage from "../pages/UserPage";
import WaitAccountActivation from "../pages/WaitAccountActivation";
import AuthProtector from "./AuthProtector";

const AppRouter = () => {
  return (
    <Routes>
      <Route exact path="/" element={<AppLayout />}>
        <Route index path="/" element={<MainPage />} />
        <Route path="catalog" element={<Catalog routeName="Каталог" />} />
        <Route path="card-page" element={<CardPage />}>
          <Route path=":uuid" element={<CardPage />} />
        </Route>
        <Route path="services" element={<AllServices routeName="Услуги" />} />
        <Route path="service" element={<Services />}>
          <Route path=":slug" element={<Services />} />
        </Route>

        <Route path="hypothec" element={<Hypothec routeName="Ипотека" />} />
        <Route
          path="insurance"
          element={<Insurance routeName="Страхование" />}
        />
        <Route element={<AuthProtector />}>
          <Route path="user" element={<UserPage routeName="Пользователь" />}>
            <Route path=":userId" element={<UserPage />} />
          </Route>
          <Route path="advertise" element={<Advertise />}>
            <Route path=":uuid" element={<Advertise />} />
          </Route>
          <Route path="personal-account/*" element={<PersonalAccount />} />
        </Route>
        <Route path="login" element={<Login />} />
        <Route path="registration" element={<Registration />} />
        <Route
          path="articles/:slug"
          element={<ArticlePage routeName="Название статьи" />}
        />
        <Route path="articles" element={<Articles routeName="Статьи" />} />
        <Route path="password-1" element={<Password1 />} />
        <Route path="password-2/:token" element={<Password2 />} />
        <Route path="catalog-list" element={<CatalogList />} />
        <Route
          path="waitAccountActivation/:uuid"
          element={<WaitAccountActivation />}
        />
        <Route path="policy" element={<Policy />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;
