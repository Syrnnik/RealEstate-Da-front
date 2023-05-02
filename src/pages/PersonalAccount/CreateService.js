import React, { useCallback, useEffect, useState } from "react";
import { AddressSuggestions } from "react-dadata";
import ImageUploading from "react-images-uploading";
import { useDispatch } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { bindActionCreators } from "redux";
import { dadataFias } from "../../API/dadata";
import { dadataReAddress } from "../../API/dadataReAddress";
import {
  createService,
  getService,
  getServicesTypes,
  getSubServicesTypes,
  updateService
} from "../../API/services";
import CustomSelect from "../../components/CustomSelect";
import MultiCheckboxSelect from "../../components/MultiCheckboxSelect";
import env from "../../config/env";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import alertActions from "../../store/actions/alert";
import { useAccessToken, useCurrentUser } from "../../store/reducers";

export default function CreateService() {
  const axiosPrivate = useAxiosPrivate();
  const currentUser = useCurrentUser();
  const currentToken = useAccessToken();
  const { id } = useParams();
  const navigate = useNavigate();
  const [tags, setTags] = useState([]);
  const [loadService, setLoadService] = useState({});
  const [servicesType, setServicesType] = useState([]);
  const [subServiceType, setSubServiceType] = useState([]);
  const [subServiceSelect, setSubServiceSelect] = useState([]);
  const [serviceSelect, setServiceSelect] = useState({
    value: null,
    title: ""
  });

  const [payloads, setPayloads] = useState({});
  const dispatch = useDispatch();
  const { setAlert } = bindActionCreators(alertActions, dispatch);
  const [address, setAddress] = useState({});
  const [district, setDistrict] = useState({});
  const [imgs, setImages] = useState([]);
  const maxNumber = 24;
  const { uuid } = useParams();
  const token = useAccessToken();

  useEffect(() => {
    setPayloads((prevState) => ({
      ...prevState,
      userId: currentUser?.id,
      token: currentToken,
      labels: tags.join(", ")
    }));
  }, [currentUser, currentToken, tags]);

  useEffect(() => {
    getServicesTypes(axiosPrivate).then((res) => {
      setServicesType(res.map((i) => ({ title: i.name, value: i.id })));
    });
  }, []);

  useEffect(() => {
    serviceSelect?.value &&
      getSubServicesTypes(axiosPrivate, serviceSelect?.value).then((res) => {
        setSubServiceType(res.map((i) => ({ title: i.name, value: i.id })));
      });
  }, [serviceSelect?.value]);

  const fields = {
    isInValidServicesTypesSubServiceId: false,
    isInValidDescription: false,
    isInValidAddress: false
  };

  const [valid, setValid] = useState(fields);

  const createNewService = (e) => {
    e.preventDefault();

    const isInValidServicesTypesSubServiceId =
      subServiceSelect === undefined || subServiceSelect?.length < 1;
    const isInValidDescription =
      payloads.description === undefined || payloads.description.length < 5;
    const isInValidAddress = address?.address === undefined;

    if (isInValidServicesTypesSubServiceId) {
      setValid({ ...valid, isInValidServicesTypesSubServiceId: true });
    } else if (isInValidDescription) {
      setValid({ ...valid, isInValidDescription: true });
    } else if (isInValidAddress) {
      setValid({ ...valid, isInValidAddress: true });
    } else {
      const formData = new FormData();
      formData.append("address", address.address);
      formData.append("district[][city]", district["city"]);
      formData.append("district[][name]", district["name"]);
      for (let key in payloads) {
        formData.append(key, payloads[key]);
      }
      for (let key in subServiceSelect) {
        formData.append("subServices[]", subServiceSelect[key]["value"]);
      }
      if (imgs?.length > 0) {
        imgs.forEach((i, index) => {
          formData.append("images[]", i.file);
        });
      }
      createService(axiosPrivate, formData)
        .then(() => {
          setAlert("success", true, "Услуга успешно создана, переход в мои услуги");
          setTimeout(() => {
            navigate("/personal-account/my-services");
          }, 2000);
        })
        .catch(() => {
          setAlert("danger", true, "Произошла ошибка сервера");
        });
    }
  };

  const resetFieldVal = (newState, field) => {
    setValid({ ...valid, [field]: false });
  };

  const updateServiceFun = () => {
    const formData = new FormData();
    formData.append("address", address.address);
    formData.append("district[][city]", district["city"]);
    formData.append("district[][name]", district["name"]);
    for (let key in payloads) {
      formData.append(key, payloads[key]);
    }
    for (let key in subServiceSelect) {
      formData.append("subServices[]", subServiceSelect[key]);
    }
    updateService(axiosPrivate, formData, id)
      .then(() => {
        setAlert("success", true, "Услуга успешно создана, переход в мои услуги");
        setTimeout(() => {
          navigate("/personal-account/my-services");
        }, 2000);
      })
      .catch(() => {
        setAlert("danger", true, "Произошла ошибка сервера");
      });
  };

  useEffect(() => {
    id &&
      getService(axiosPrivate, id).then((res) => {
        setLoadService(res);
      });
  }, []);

  useEffect(() => {
    if (id) {
      setPayloads((prevState) => ({
        ...prevState,
        description: loadService?.description,
        experienceTypeForUser: loadService?.experienceTypeForUser
      }));
      setAddress((prevState) => ({
        ...prevState,
        address: loadService?.address
      }));
    }
  }, [loadService, id]);

  useEffect(() => {
    setServiceSelect(servicesType?.find((i) => i?.value === loadService?.id));
  }, [servicesType, loadService]);

  useEffect(() => {
    setSubServiceSelect(
      subServiceType?.filter((type) =>
        loadService?.subServices?.find(
          (subService) => type?.value === subService?.serviceTypeSubServiceId
        )
      )
    );
  }, [subServiceType, loadService]);

  useEffect(() => {
    if (address?.address && id) {
      dadataReAddress({ query: address?.address, count: 5 }).then((res) => {
        setAddress((prevState) => ({
          ...prevState,
          address: res[0]?.value,
          fias_id: res[0]?.data?.fias_id,
          latitude: res[0]?.data?.geo_lat,
          longitude: res[0]?.data?.geo_lon,
          city: res[0]?.data?.city
        }));
      });
    }
  }, [address?.address]);

  useEffect(() => {
    address?.fias_id &&
      dadataFias(address?.fias_id).then((res) =>
        setDistrict({
          city: res?.suggestions[0]?.data?.city,
          name: res?.suggestions[0]?.data?.city_district
        })
      );
  }, [address]);

  const suggestionsRef = useCallback(
    (node) => {
      if (node !== null) {
        node.setInputValue(address?.address);
      }
    },
    [address?.address]
  );

  const onChangeForOtherImages = (imageList) => {
    setImages(imageList);
  };

  return (
    <div className="px-2 px-sm-4 px-xxl-5 pb-4 pb-xxl-5">
      <nav className="d-block d-lg-none mt-3 mb-3 mb-sm-5" aria-label="breadcrumb">
        <Link to="/personal-account" className="gray-3">
          &#10094; Назад
        </Link>
      </nav>
      <h4 className="text-center color-1 mb-3 mb-sm-4 mb-xl-5">Мои услуги</h4>
      <form>
        <div className="row align-items-center mb-3 mb-sm-4 mb-xl-5">
          <div className="col-sm-4">
            <div className="fs-11 mb-1">Вид услуг:</div>
          </div>
          <div className="col-sm-8">
            <CustomSelect
              className="w-100 fs-11"
              btnClass="inp"
              checkedOptions={[serviceSelect?.title]}
              options={servicesType}
              callback={({ title, value }) => {
                setServiceSelect({ value, title });
              }}
            />
          </div>
        </div>
        <div className="row align-items-center mb-3 mb-sm-4 mb-xl-5">
          <div className="col-sm-4">
            <div
              className="fs-11 mb-1"
              style={{
                color: valid.isInValidServicesTypesSubServiceId ? "#DA1E2A" : ""
              }}
            >
              Подуслуга:
            </div>
          </div>
          <div className="col-sm-8">
            {subServiceSelect && (
              <MultiCheckboxSelect
                className="w-100 fs-11"
                btnClass="inp"
                checkedOptions={subServiceSelect}
                options={subServiceType}
                callback={({ title, value, e }) => {
                  if (subServiceSelect.find((subService) => subService.value === value)) {
                    setSubServiceSelect((prevSubServiceSelect) =>
                      prevSubServiceSelect.filter(
                        (subService) => subService.value !== value
                      )
                    );
                  } else {
                    setSubServiceSelect((prevSubServiceSelect) => [
                      ...prevSubServiceSelect,
                      { title, value }
                    ]);
                  }
                  resetFieldVal(e, "isInValidServicesTypesSubServiceId");
                }}
              />
            )}
          </div>
        </div>

        <div className="row mb-3 mb-sm-4 mb-xl-5">
          <div className="col-sm-4">
            <div
              className="fs-11 mb-1"
              style={{ color: valid.isInValidDescription ? "#DA1E2A" : "" }}
            >
              О себе*:
            </div>
          </div>
          <div className="col-sm-8">
            <textarea
              placeholder="Введите текст"
              rows="5"
              style={{ fontSize: 16 + "px" }}
              value={payloads?.description || ""}
              onChange={(e) => {
                setPayloads((prevState) => ({
                  ...prevState,
                  description: e.target.value
                }));
                resetFieldVal(e, "isInValidDescription");
              }}
            />
            <span style={{ color: "#828282" }}>Не меньше 5 символов</span>
          </div>
        </div>
        <div className="row mb-3 mb-sm-4 mb-xl-5">
          <div className="col-sm-4">
            <div
              className="fs-11 mb-1"
              style={{ color: valid.isInValidAddress ? "#DA1E2A" : "" }}
            >
              Адрес*:
            </div>
          </div>
          <div className="col-sm-8">
            <AddressSuggestions
              delay={1000}
              httpCache={true}
              minChars={3}
              defaultQuery={address?.address}
              containerClassName="advertise__address"
              inputProps={{
                style: {
                  borderColor: valid?.isInValidAddress ? "#DA1E2A" : ""
                },
                placeholder: "Адрес"
              }}
              ref={suggestionsRef}
              token={env.DADATA_TOKEN}
              onChange={(e) => {
                setAddress({
                  address: e.value,
                  latitude: e.data?.geo_lat,
                  longitude: e.data?.geo_lon,
                  fias_id: e.data?.fias_id,
                  city: e.data?.city
                });
                resetFieldVal(e, "isInValidAddress");
              }}
            />
          </div>
        </div>
        <div className="row mb-3 mb-sm-4 mb-xl-5">
          <div className="col-sm-4">
            <span
              className="fs-11 mb-1"
              data-for="imgs"
              data-status={false}
              style={{
                color: valid.isInValidImage ? "#DA1E2A" : ""
              }}
            >
              Фото:
            </span>
          </div>
          <div className="col-md-8">
            <ImageUploading
              multiple
              value={imgs}
              onChange={onChangeForOtherImages}
              maxNumber={maxNumber}
              dataURLKey="data_url"
              acceptType={["JPG", "JPEG", "PNG", "WEBP"]}
            >
              {({
                imageList,
                onImageUpload,
                onImageRemoveAll,
                onImageUpdate,
                onImageRemove,
                isDragging,
                dragProps,
                errors
              }) => (
                <>
                  <div className="upload__image-wrapper">
                    <div className="imgs-box">
                      {imageList.map((image, index) => (
                        <div key={index} className="image-item">
                          <img src={image.data_url} alt="" />
                          <div className="image-item__btn-wrapper">
                            <button
                              type="button"
                              onClick={() => {
                                onImageRemove(index);
                                // uuid &&
                                //     deleteImage(
                                //         axiosPrivate,
                                //         image.id,
                                //         token
                                //     )
                                //         .then(() =>
                                //             setAlert(
                                //                 "success",
                                //                 true,
                                //                 "Картинка успешно удалена"
                                //             )
                                //         )
                                //         .catch(() =>
                                //             setAlert(
                                //                 "danger",
                                //                 true,
                                //                 "Произошла ошибка"
                                //             )
                                //         );
                              }}
                            >
                              <img src="/img/icons/delete.svg" alt="Удалить" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="d-flex justify-content-center">
                      <button
                        type="button"
                        className="btn btn-1 px-3 px-sm-4 me-3 me-sm-4"
                        style={isDragging ? { color: "red" } : null}
                        onClick={onImageUpload}
                        {...dragProps}
                      >
                        <svg
                          width="21"
                          height="21"
                          viewBox="0 0 21 21"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <line
                            x1="10.75"
                            x2="10.75"
                            y2="21"
                            stroke="white"
                            strokeWidth="1.5"
                          />
                          <line
                            y1="10.25"
                            x2="21"
                            y2="10.25"
                            stroke="white"
                            strokeWidth="1.5"
                          />
                        </svg>
                        <span className="ms-2">Добавить фотографии</span>
                      </button>
                    </div>
                  </div>
                  <span className="text-danger">
                    {errors?.acceptType && "Поддерживаемые форматы файла: JPEG, JPG, PNG"}
                  </span>
                </>
              )}
            </ImageUploading>
          </div>
        </div>
        <div className="row justify-content-end">
          <div className="col-sm-8">
            <div className="row row-cols-2">
              <div>
                <Link
                  to="/personal-account/my-services"
                  className="btn btn-2 w-100 fs-11"
                >
                  Отмена
                </Link>
              </div>
              <div>
                <button
                  type="button"
                  className="btn btn-1 w-100 fs-11"
                  onClick={(e) => {
                    id ? updateServiceFun(e) : createNewService(e);
                  }}
                >
                  Сохранить
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
