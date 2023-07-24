import { useCallback, useEffect, useState } from "react";
import PhoneInput from "react-phone-input-2";
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import { getDistricts } from "../API/catalog";
import { sendRieltorRequest } from "../API/rieltorCalls";
import actionsAlert from "../store/actions/alert";
import CustomModal from "./CustomModal";
import CustomSelect from "./CustomSelect";
import ShowPhone from "./ShowPhone";

import "../assets/styles/CallRieltorModal.css";

export const CallRieltorModal = ({
  showRieltorModal,
  setIsShowRieltorModal,
}) => {
  const selectedCity = useSelector((state) => state?.selectedCity);
  const dispatch = useDispatch();
  const { setAlert } = bindActionCreators(actionsAlert, dispatch);

  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState({});
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  const [valid, setValid] = useState({
    isInValidName: false,
    isInValidPhone: false,
    isInValidDesc: false,
    isInValidDistrict: false,
  });

  const resetValid = useCallback(
    (newState, field) => {
      setValid({ ...valid, [field]: false });
    },
    [valid]
  );

  const agentPhone = "79xxxxxxxxx";

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isInValidName = name?.length === 0;
    const isInValidPhone = phone?.length < 10;
    const isInValidDesc = desc?.length === 0;
    // const isInValidDistrict = selectedDistrict?.title === undefined;

    if (isInValidName) {
      setValid({ ...valid, isInValidName: true });
    } else if (isInValidPhone) {
      setValid({ ...valid, isInValidPhone: true });
      // } else if (isInValidDistrict) {
      //   setValid({ ...valid, isInValidDistrict: true });
    } else if (isInValidDesc) {
      setValid({ ...valid, isInValidDesc: true });
    } else {
      const formData = new FormData();
      const req = { name, phone, desc, selectedDistrict };
      for (const key in req) {
        formData.append(key, req[key]);
      }

      sendRieltorRequest(formData)
        .then(() => {
          setIsShowRieltorModal(false);
          setName("");
          setPhone("");
          setDesc("");
          setSelectedDistrict(undefined);

          setAlert(
            "success",
            true,
            "Вопрос успешно отправлен нашим риелторам, ждите ответа"
          );
        })
        .catch(() => {
          setAlert("danger", true, "Произошла ошибка сервера");
        });
    }
  };

  return (
    <CustomModal
      isShow={showRieltorModal}
      setIsShow={setIsShowRieltorModal}
      closeButton={true}
      size="lg"
    >
      <h3 className="text-center">Вызов риэлтора</h3>

      <div className="d-flex flex-column align-items-center gap-3 px-md-5">
        <div
          className="w-100 d-flex flex-column flex-md-row"
          style={{
            color: valid?.isInValidName ? "#DA1E2A" : "",
          }}
        >
          <h5 className="w-50">Ваше имя:</h5>
          <div className="w-100">
            <input
              style={{
                borderColor: valid?.isInValidName ? "#DA1E2A" : "",
              }}
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                resetValid(e, "isInValidName");
              }}
            />
          </div>
        </div>

        <div
          className="w-100 d-flex flex-column flex-md-row"
          style={{
            color: valid?.isInValidPhone ? "#DA1E2A" : "",
          }}
        >
          <h5 className="w-50">Ваш телефон:</h5>
          <PhoneInput
            style={{
              borderColor: valid?.isInValidPhone ? "#DA1E2A" : "",
            }}
            className="w-100"
            specialLabel=""
            country="ru"
            value={phone}
            onChange={(value, data, e) => {
              setPhone(value);
              resetValid(e, "isInValidPhone");
            }}
          />
        </div>

        <div
          className="w-100 d-flex flex-column flex-md-row"
          style={{
            color: valid?.isInValidDistrict ? "#DA1E2A" : "",
          }}
        >
          <h5 className="w-50">Ваш район:</h5>
          <CustomSelect
            style={{
              borderColor: valid?.isInValidDistrict ? "#DA1E2A" : "",
            }}
            className="w-100 rieltorModalInput"
            // title="Выберите район"
            options={districts}
            checkedOptions={[selectedDistrict?.title]}
            callback={(dist) => {
              setSelectedDistrict(dist);
              resetValid({}, "isInValidDistrict");
            }}
          />
        </div>

        <div
          className="w-100 d-flex flex-column flex-md-row"
          style={{
            color: valid?.isInValidDesc ? "#DA1E2A" : "",
          }}
        >
          <h5 className="w-50">Ваш вопрос:</h5>
          <div className="w-100">
            <textarea
              style={{
                borderColor: valid?.isInValidDesc ? "#DA1E2A" : "",
              }}
              type="text"
              value={desc}
              onChange={(e) => {
                setDesc(e.target.value);
                resetValid(e, "isInValidDesc");
              }}
            ></textarea>
          </div>
        </div>

        <div className="modalBtns mt-4 gap-2">
          <button
            className="w-100 btn btn-1 text-uppercase py-2 px-5 order-3 order-lg-4 fs-14"
            onClick={handleSubmit}
          >
            Отправить
          </button>

          <ShowPhone className="w-100 fs-11" phone={agentPhone} />
        </div>
      </div>
    </CustomModal>
  );
};
