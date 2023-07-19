import { useEffect, useState } from "react";
import PhoneInput from "react-phone-input-2";
import { useSelector } from "react-redux";
import { getDistricts } from "../API/catalog";
import CustomModal from "./CustomModal";
import CustomSelect from "./CustomSelect";

import PhoneIcon from "../img/icons/phone.svg";

import "../assets/styles/CallRieltorModal.css";

export const CallRieltorModal = ({
  showRieltorModal,
  setIsShowRieltorModal,
}) => {
  const selectedCity = useSelector((state) => state?.selectedCity);
  const [districts, setDistricts] = useState([]);
  const [district, setDistrict] = useState();
  const [phone, setPhone] = useState();
  const [name, setName] = useState();
  const [desc, setDesc] = useState();

  useEffect(() => {
    selectedCity &&
      getDistricts(selectedCity)
        .then(
          (result) =>
            result &&
            result.map((item) => ({ title: item.name, value: item.id }))
        )
        .then((result) => setDistricts(result));
  }, [selectedCity]);

  console.log(districts);

  return (
    <CustomModal
      isShow={showRieltorModal}
      setIsShow={setIsShowRieltorModal}
      closeButton={true}
      size="lg"
    >
      <h3 className="text-center">Вызов риэлтора</h3>

      <div className="d-flex flex-column align-items-center gap-3 px-5">
        <div className="w-100 d-flex flex-row align-items-center gap-5">
          <div className="w-25">
            <h5>Ваше имя:</h5>
          </div>
          <div className="w-75">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>

        <div className="w-100 d-flex flex-row align-items-center gap-5">
          <div className="w-25">
            <h5>Ваш телефон:</h5>
          </div>
          <PhoneInput
            className="w-75"
            specialLabel=""
            country="ru"
            value={phone}
            onChange={setPhone}
          />
        </div>

        <div className="w-100 d-flex flex-row align-items-center gap-5">
          <div className="w-25">
            <h5>Ваш район:</h5>
          </div>
          <CustomSelect
            className="w-75 rieltorModalInput"
            title="Выберите район"
            options={districts}
            callback={(dist) => {
              setDistrict(dist);
            }}
          />
        </div>

        <div className="w-100 d-flex flex-row align-items-center gap-5">
          <div className="w-25">
            <h5>Ваш вопрос:</h5>
          </div>
          <div className="w-75">
            <textarea
              type="text"
              value={desc}
              onChange={(e) => setName(e.target.value)}
            ></textarea>
          </div>
        </div>

        <button className="ms-md-4 btn btn-1 text-uppercase py-2 px-5 order-3 order-lg-4 fs-14 mt-4">
          Отправить
        </button>
        <button className="callRieltorBtn ms-md-4 btn py-2 px-4 order-3 order-lg-4 fs-11 mt-1 gap-3">
          <img src={PhoneIcon} />
          Сделать звонок
        </button>
      </div>
    </CustomModal>
  );
};
