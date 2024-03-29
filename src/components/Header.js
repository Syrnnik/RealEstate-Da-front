import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useLocation } from "react-router-dom";
import { bindActionCreators } from "redux";

import { getQuestion } from "../API/question";
import { conversationListeners } from "../API/socketConversations";
import { socketInstance } from "../API/socketInstance";
import useSocket from "../hooks/socket";
import alertActions from "../store/actions/alert";
import conversationCountActions from "../store/actions/conversationsCount";
import CityContainer from "./CityContainer";
import CustomModal from "./CustomModal";
import CustomOffcanvas from "./CustomOffcanvas";

import ArticlesIcon from "../assets/styles/bg-imgs/menu-articles.svg";
import FavoriteIcon from "../assets/styles/bg-imgs/menu-favorite.svg";
import HypotecIcon from "../assets/styles/bg-imgs/menu-hypothec.svg";
import MainPageIcon from "../assets/styles/bg-imgs/menu-main.svg";
import QuestionIcon from "../assets/styles/bg-imgs/menu-question.svg";
import ServicesIcon from "../assets/styles/bg-imgs/menu-services.svg";
import PhoneIcon from "../img/icons/phone.svg";
import { CallRieltorModal } from "./CallRieltorModal";

const Header = () => {
  const { isConnected } = useSocket();
  const conversationCount = useSelector((state) => state?.conversationCount);
  const [isShowMenu, setIsShowMenu] = useState(false);
  const location = useLocation();
  const pathname = location.pathname;
  const dispatch = useDispatch();
  const { setAlert } = bindActionCreators(alertActions, dispatch);
  const { setConversationCount } = bindActionCreators(
    conversationCountActions,
    dispatch
  );
  const initialData = {
    name: "",
    email: "",
    question: "",
  };
  const [data, setData] = useState({ ...initialData });
  const [isShowQuestionModal, setIsShowQuestionModal] = useState(false);
  const fields = {
    isInValidName: false,
    isInValidEmail: false,
    isInValidQuestions: false,
  };

  const [valid, setValid] = useState(fields);
  const [showRieltorModal, setIsShowRieltorModal] = useState(false);

  const mailSample = Object.values(data).find((i) =>
    i?.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isInValidName =
      data?.name === undefined ||
      data.name?.length < 1 ||
      data.name?.length > 55;
    const isInValidEmail =
      data?.email === undefined || mailSample === undefined;
    const { question } = data;
    const isInValidQuestions =
      question?.length === undefined ||
      question?.length < 5 ||
      question?.length > 1024;

    if (isInValidName) {
      setValid({ ...valid, isInValidName: true });
    } else if (isInValidEmail) {
      setValid({ ...valid, isInValidEmail: true });
    } else if (isInValidQuestions) {
      setValid({ ...valid, isInValidQuestions: true });
    } else {
      const formData = new FormData();
      const req = { ...data };
      for (const key in req) {
        formData.append(key, req[key]);
      }
      getQuestion(formData)
        .then(() => {
          setData(initialData);
          setIsShowMenu(false);
          setIsShowQuestionModal(false);
          setAlert(
            "success",
            true,
            "Вопрос успешно отправлен нашим консультантам, ждите ответа"
          );
        })
        .catch(() => {
          setAlert("danger", true, "Произошла ошибка сервера");
        });
    }
  };

  const resetFieldVal = (newState, field) => {
    setValid({ ...valid, [field]: false });
  };

  const closeCanvas = () => {
    setIsShowMenu((prevIsShowMenu) => !prevIsShowMenu);
  };

  useEffect(() => {
    if (isConnected) {
      socketInstance.on(conversationListeners.countNewMessages, (count) =>
        setConversationCount(+count)
      );
    }
  }, [isConnected]);

  return (
    <>
      <header>
        <div className="container">
          <Link to="/" className="order-1 me-lg-auto">
            <img
              src={
                window.innerWidth < 576
                  ? "/img/icons/miniLogo.svg"
                  : "/img/icons/logo.svg"
              }
              alt="Название сайта"
              className="logo"
            />
          </Link>
          <nav className="d-none d-lg-flex order-2">
            <NavLink to="/" className={`${pathname === "/" ? "active" : ""}`}>
              Главная
            </NavLink>
            <NavLink to="/services">Услуги</NavLink>
            <NavLink to="/hypothec">Ипотека</NavLink>
            <button
              className="button-header-question"
              onClick={() => setIsShowQuestionModal(true)}
              style={{ whiteSpace: "nowrap" }}
            >
              <img src={QuestionIcon} alt="Задать вопрос" />
            </button>
          </nav>
          <div className="d-none d-md-flex order-4 order-lg-3">
            <Link to="/personal-account/my-messages" className="counter ms-4">
              <img src="/img/icons/email.svg" alt="сообщения" />
              {conversationCount > 0 && <span>{conversationCount}</span>}
            </Link>
            <Link to="/personal-account/favorites" className="ms-3 ms-xl-4">
              <img src="/img/icons/favorite.svg" alt="избранное" />
            </Link>
            <Link to="/personal-account" className="ms-3 ms-xl-4">
              <img src="/img/icons/user.svg" alt="аккаунт" />
            </Link>
          </div>
          <NavLink
            to="/advertise"
            className="ms-md-4 btn btn-1 text-uppercase p-2 order-3 order-lg-4"
            style={{ whiteSpace: "nowrap" }}
          >
            Подать объявление
          </NavLink>
          <CityContainer />
          <button
            type="button"
            className="d-block d-lg-none order-5"
            onClick={() => setIsShowMenu((prevIsShowMenu) => !prevIsShowMenu)}
          >
            <img src="/img/icons/menu.svg" alt="меню" />
          </button>

          <button
            type="button"
            className="d-none d-md-flex ms-md-4 btn btn-1 text-uppercase p-2 order-3 order-lg-4"
            onClick={() => setIsShowRieltorModal(true)}
          >
            Вызвать риелтора
          </button>
        </div>
      </header>

      <CustomOffcanvas
        isShow={isShowMenu}
        setIsShow={setIsShowMenu}
        className="offcanvas-menu"
        placement="end"
        scroll={true}
        backdrop={true}
        closeButton={true}
      >
        <nav className="d-flex justify-content-center">
          <ul className="offcanvas-menu__list">
            <li>
              <NavLink
                to="/"
                className={`${
                  pathname === "/" ? "active" : ""
                } d-flex p-2 justify-content-start align-items-center gap-2`}
                onClick={() => {
                  closeCanvas();
                }}
              >
                <img className="icon" src={MainPageIcon} alt="Главная" />
                Главная
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/services"
                className={`${
                  pathname === "/services" ? "active" : ""
                } d-flex p-2 justify-content-start align-items-center gap-2`}
                onClick={() => {
                  closeCanvas();
                }}
              >
                <img className="icon" src={ServicesIcon} alt="Услуги" />
                Услуги
              </NavLink>
            </li>
            <li>
              <button
                className="button-header-question__offcanvas w-100 d-flex p-2 justify-content-start align-items-center gap-2"
                onClick={() => {
                  closeCanvas();
                  setIsShowQuestionModal(true);
                }}
              >
                <img className="icon" src={QuestionIcon} alt="Задать вопрос" />
                Задать вопрос
              </button>
            </li>
            <li>
              <NavLink
                to="/personal-account/favorites"
                className={`${
                  pathname === "/personal-account/favorites" ? "active" : ""
                } d-flex p-2 justify-content-start align-items-center gap-2`}
                onClick={() => {
                  closeCanvas();
                }}
              >
                <img className="icon" src={FavoriteIcon} alt="Избранное" />
                Избранное
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/hypothec"
                className={`${
                  pathname === "/hypothec" ? "active" : ""
                } d-flex p-2 justify-content-start align-items-center gap-2`}
                onClick={() => {
                  closeCanvas();
                }}
              >
                <img className="icon" src={HypotecIcon} alt="Ипотека" />
                Ипотека
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/articles"
                className={`${
                  pathname === "/articles" ? "active" : ""
                } d-flex p-2 justify-content-start align-items-center gap-2`}
                onClick={() => {
                  closeCanvas();
                }}
              >
                <img className="icon" src={ArticlesIcon} alt="Статьи" />
                Статьи
              </NavLink>
            </li>
            <li>
              <button
                className="button-header-question__offcanvas w-100 d-flex p-2 justify-content-start align-items-center gap-2"
                onClick={() => {
                  closeCanvas();
                  setIsShowRieltorModal(true);
                }}
              >
                <img className="icon" src={PhoneIcon} alt="Вызвать риелтора" />
                Вызвать риелтора
              </button>
            </li>
          </ul>
        </nav>
      </CustomOffcanvas>

      <CustomModal
        isShow={isShowQuestionModal}
        setIsShow={setIsShowQuestionModal}
        closeButton={true}
        size="lg"
      >
        <div>
          <h3 className="text-center">Задать вопрос</h3>
          <form className="message-form">
            <div className="text-center">
              <div>
                <div className="fs-11 fw-5">Вам ответит администратор</div>
              </div>
            </div>
            <div className="row align-items-center fs-11 mt-3">
              <div className="col-sm-3 mb-1 mb-sm-3">
                <label
                  className="gray-3"
                  htmlFor="name"
                  style={{
                    color: valid.isInValidName ? "#DA1E2A" : "",
                  }}
                >
                  Ваше имя:
                </label>
              </div>
              <div className="col-sm-9 mb-3">
                <input
                  style={{
                    borderColor: valid.isInValidName ? "#DA1E2A" : "",
                  }}
                  type="text"
                  placeholder="Имя"
                  value={data.name}
                  id="name"
                  onChange={(e) => {
                    setData({ ...data, name: e.target.value });
                    resetFieldVal(e, "isInValidName");
                  }}
                />
              </div>
              <div className="col-sm-3 mb-1 mb-sm-3">
                <label
                  className="gray-3"
                  htmlFor="email"
                  style={{
                    color: valid.isInValidEmail ? "#DA1E2A" : "",
                  }}
                >
                  Ваш Email:
                </label>
              </div>
              <div className="col-sm-9 mb-3">
                <input
                  style={{
                    borderColor: valid.isInValidEmail ? "#DA1E2A" : "",
                  }}
                  type="text"
                  placeholder="Email"
                  value={data.email}
                  id="email"
                  onChange={(e) => {
                    setData({ ...data, email: e.target.value });
                    resetFieldVal(e, "isInValidEmail");
                  }}
                />
              </div>
              <div className="col-sm-3 mb-1 mb-sm-3">
                <label
                  className="gray-3"
                  htmlFor="question"
                  style={{
                    color: valid.isInValidQuestions ? "#DA1E2A" : "",
                  }}
                >
                  Ваш вопрос:
                </label>
                <span className="fs-08 gray-3 mt-2">От 5 символов</span>
              </div>
              <div className="col-sm-9 mb-sm-3">
                <input
                  style={{
                    borderColor: valid.isInValidQuestions ? "#DA1E2A" : "",
                  }}
                  type="text"
                  placeholder="Вопрос"
                  value={data.question}
                  id="question"
                  onChange={(e) => {
                    setData({ ...data, question: e.target.value });
                    resetFieldVal(e, "isInValidQuestions");
                  }}
                />
              </div>
            </div>
            <button
              type="submit"
              className="btn btn-1 mx-auto fs-12 mt-4"
              onClick={handleSubmit}
            >
              ОТПРАВИТЬ
            </button>
          </form>
        </div>
      </CustomModal>

      <CallRieltorModal
        showRieltorModal={showRieltorModal}
        setIsShowRieltorModal={setIsShowRieltorModal}
      />
    </>
  );
};

export default Header;
