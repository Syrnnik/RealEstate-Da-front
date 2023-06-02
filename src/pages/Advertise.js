import React, { useCallback, useEffect, useRef, useState } from "react";
import { AddressSuggestions } from "react-dadata";
import ImageUploading from "react-images-uploading";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import Scroll, { Link, animateScroll as scroll } from "react-scroll";
import { bindActionCreators } from "redux";
import { getAdsPage } from "../API/adspage";
import { addAdvertise } from "../API/config/advertise";
import { dadataFias } from "../API/dadata";
import { dadataReAddress } from "../API/dadataReAddress";
import { deleteImage } from "../API/deleteImage";
import { getTypesEstate } from "../API/typesEstate";
import { updateAd } from "../API/users";
import CustomModal from "../components/CustomModal";
import CustomSelect from "../components/CustomSelect";
import AboutBuildingCommercial from "../components/advertiseComponents/AboutBuildingCommercial";
import AboutBuildingParking from "../components/advertiseComponents/AboutBuildingParking";
import AboutBuildingResidential from "../components/advertiseComponents/AboutBuildingResidential";
import AboutCommercial from "../components/advertiseComponents/AboutCommercial";
import AboutParking from "../components/advertiseComponents/AboutParking";
import AboutResidential from "../components/advertiseComponents/AboutResidential";
import AboutStead from "../components/advertiseComponents/AboutStead";
import AdTypeCommercial from "../components/advertiseComponents/AdTypeCommercial";
import AdTypeResidential from "../components/advertiseComponents/AdTypeResidential";
import { fields } from "../components/advertiseComponents/fields";
import env from "../config/env";
import { localEstates } from "../helpers/localEstates";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import actionsAlert from "../store/actions/alert";
import { useAccessToken, useCurrentUser } from "../store/reducers";
// import AdTypeLandPlot from "../components/advertiseComponents/AdTypeLandPlot";

export default function Advertise() {
  const { uuid } = useParams();
  const city = useSelector((state) => state?.selectedCity);
  const ref = useRef(null); // Form
  const [deal, setDeal] = useState(1); // тип сделки (по умолчанию - продажа)
  const [proptype, setProptype] = useState("1"); // тип недвижимости (по умолчанию - Жилая)
  const [requiredElems, setRequired] = useState([]);
  let navigate = useNavigate();
  const [isShow, setIsShow] = useState(false);
  const [types, setTypes] = useState([]); // result require api
  const [es, setEs] = useState([]); // state estates in types
  const [res, setRes] = useState(""); // check id in array id's
  const [imgs, setImages] = useState([]);
  const [mainImg, setMainImg] = useState(0);
  const [activeField, setActiveField] = useState(1); //для мобильных устройств
  const [mainImage, setMainImage] = useState([]);
  const f = mainImage[mainImg];
  const image = f?.file;
  const axiosPrivate = useAxiosPrivate();
  const token = useAccessToken();
  const currentUser = useCurrentUser();
  const [district, setDistrict] = useState({});
  const [data, setData] = useState({
    transactionType: 1,
    pledge: 0,
    commission: 0,
    rentalPeriod: 0,
    acres: 0,
    cityDistance: 0,
    isMortgage: 0,
    isEncumbrances: 0,
    sellerType: 3,
    saleType: 2,
    totalArea: 0
  });
  const [prepTypeText, setPrepTypeText] = useState("");
  const [valid, setValid] = useState(fields);
  const scroller = Scroll.scroller;
  const [statusRequest, setStatusRequest] = useState({
    error: false,
    good: false
  });
  const maxNumber = 24;
  const dispatch = useDispatch();
  const { setAlert } = bindActionCreators(actionsAlert, dispatch);
  const [loadData, setLoadData] = useState({});
  const [btnRadio, setBtnRadio] = useState({
    transactionType: null,
    rentalType: 0,
    estateTypeId: null,
    estateId: null,
    houseType: null,
    roomType: null,
    wcType: null,
    balconyType: null,
    layoutType: null,
    repairType: null,
    houseBuildingType: null,
    elevatorType: null,
    hasRamp: null,
    hasGarbage: null,
    isMortgage: 0,
    isEncumbrances: 0,
    landArea: 0,
    prepaymentType: 0,
    rentalPeriod: 0,
    sellerType: 3,
    saleType: 2
  });
  const [ad, setAd] = useState({});
  const [outBuildingTypes, setOutBuildingTypes] = useState([]);
  const [windRoseDirectionType, setWindRoseDirectionType] = useState([]);

  useEffect(() => {
    setLoadData({
      transactionType: ad?.transactionType,
      address: ad?.address,
      residentalComplex: ad?.residentalComplex,
      totalArea: ad?.totalArea || 0,
      floor: ad["floor"] || 0,
      hasBathroom: ad?.hasBathroom,
      hasConditioner: ad?.hasConditioner,
      hasDishWasher: ad?.hasDishWasher,
      hasFurniture: ad?.hasFurniture,
      hasInternet: ad?.hasInternet,
      hasKitchenFurniture: ad?.hasKitchenFurniture,
      hasRefrigerator: ad?.hasRefrigerator,
      hasShowerCabin: ad?.hasShowerCabin,
      hasTv: ad?.hasTv,
      hasWashingMachine: ad?.hasWashingMachine,
      description: ad?.description,
      yearOfConstruction: ad?.yearOfConstructionForUser,
      ceilingHeight: ad?.ceilingHeight || 3,
      hasGroundParking: ad?.hasGroundParking,
      hasMoreLayerParking: ad?.hasMoreLayerParking,
      hasUnderGroundParking: ad?.hasUnderGroundParking,
      price: ad?.price,
      communalPrice: ad?.communalPrice || 0,
      pledge: ad?.pledge,
      commission: ad?.commission,
      prepaymentType: ad?.prepaymentType || 0,
      withKids: ad?.withKids,
      withPets: ad?.withPets,
      longitude: ad?.longitude,
      latitude: ad?.latitude,
      livingArea: ad?.livingArea || 0,
      kitchenArea: ad?.kitchenArea || 0,
      maxFloor: ad?.maxFloor || 0,
      cadastralNumber: ad?.cadastralNumber,
      landСadastralNumber: ad?.landСadastralNumber,
      estateName: ad?.estate?.name,
      estateTypeName: ad?.estate?.realEstateType?.name,
      landArea: ad?.landArea || 0,
      acres: ad?.acres || 0,
      cityDistance: ad?.cityDistance || 0,
      hasBarrierParking: ad?.hasBarrierParking,
      hasYardParking: ad?.hasYardParking
    });
    setBtnRadio({
      transactionType: ad?.transactionType,
      rentalPeriod: ad?.rentalPeriod || 0,
      estateTypeId: ad?.estate?.realEstateTypeId,
      estateId: ad?.estateId,
      houseType: ad?.houseType || 0,
      roomType: ad?.roomType || 0,
      WCType: ad?.wcType || 0,
      balconyType: ad?.balconyType || 0,
      layoutType: ad?.layoutType || 0,
      repairType: ad?.repairType || 0,
      houseBuildingType: ad?.houseBuildingType || 0,
      elevatorType: ad?.elevatorType || 0,
      hasRamp: Number(ad?.hasRamp),
      hasGarbage: Number(ad?.hasGarbage),
      isMortgage: Number(ad?.isMortgage),
      isEncumbrances: Number(ad?.isEncumbrances),
      estateType: Number(ad?.estateType),
      areaType: Number(ad?.areaType),
      hasVentilation: Number(ad?.hasVentilation),
      directionType: Number(ad?.directionType),
      hasFireAlarm: Number(ad?.hasFireAlarm),
      hasSecurityAlarm: Number(ad?.hasSecurityAlarm),
      gradeType: Number(ad?.gradeType),
      window: Number(ad?.window),
      windowType: Number(ad?.windowType),
      hasBasement: Number(ad?.hasBasement),
      buildingType: Number(ad?.buildingType),
      locationType: Number(ad?.locationType),
      hasSecurity: Number(ad?.hasSecurity),
      sellerType: Number(ad?.sellerType),
      saleType: Number(ad?.saleType)
    });
    // setWindRoseDirectionType(ad?.windRoseDirectionType.);
    //! add same for outBuildingType
    // setWindRoseDirectionType(ad?.windRoseDirectionType.);
    setDeal(ad?.transactionType);
    setMainImage([
      { data_url: `${process.env.REACT_APP_PHOTO_URL}/uploads/${ad.image}` }
    ]);
    setImages(
      ad?.images?.map((i) => {
        return {
          id: i.id,
          data_url: `${process.env.REACT_APP_PHOTO_URL}/uploads/${i.image}`
        };
      })
    );
  }, [ad]);

  useEffect(() => {
    if (uuid === undefined) {
      setData({
        transactionType: 1,
        pledge: 0,
        commission: 0,
        rentalPeriod: 0,
        acres: 0,
        cityDistance: 0,
        isMortgage: 0,
        isEncumbrances: 0,
        sellerType: 3,
        saleType: 2,
        totalArea: 0
      });
      setBtnRadio({
        transactionType: 1,
        estateTypeId: null,
        estateId: null,
        houseType: null,
        roomType: null,
        wcType: null,
        balconyType: null,
        layoutType: null,
        repairType: null,
        houseBuildingType: null,
        elevatorType: null,
        hasRamp: null,
        hasGarbage: null,
        isMortgage: 0,
        isEncumbrances: 0,
        landArea: 0,
        prepaymentType: 0,
        rentalPeriod: 0,
        sellerType: 3,
        saleType: 2
      });
      setDeal(1);
      setMainImage([]);
      setImages([]);
    }
  }, [uuid]);

  useEffect(() => {
    const adsget = async () => {
      try {
        const result =
          currentUser?.id && uuid ? await getAdsPage(uuid, currentUser?.id) : "";
        if (result) {
          setAd(result);
        }
      } catch (error) {
        console.log(error);
      }
    };
    adsget();
  }, []);

  useEffect(() => {
    function updateState() {
      let arrNames = Array.from(ref.current.querySelectorAll(`[data-for]`)).map(function (
        el
      ) {
        if (el.dataset.status === "false") {
          return el.dataset.for;
        }
      });
      setRequired(arrNames);
    }

    ref?.current?.addEventListener("change", updateState);
  }, [ref]);

  useEffect(() => {
    const typess = async () => {
      try {
        let result = await getTypesEstate();
        if (result) {
          setTypes(result);
        }
      } catch (error) {
        console.log(error);
      }
    };
    typess();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const ids = types?.map((i) => i.id);
    setRes(ids.find((t) => t === +proptype));
  }, [types, proptype]);

  useEffect(() => {
    data["fias_id"] &&
      dadataFias(data["fias_id"]).then((res) =>
        setDistrict({
          city: res?.suggestions[0]?.data?.city,
          name: res?.suggestions[0]?.data?.city_district
            ? res?.suggestions[0]?.data?.city_district
            : "Не важно"
        })
      );
  }, [data]);

  useEffect(() => {
    setPrepTypeText(ad?.prepaymentTypeForUser);
  }, []);

  useEffect(() => {
    loadData.address && setData({ ...loadData, ...btnRadio });
  }, [loadData, btnRadio]);

  useEffect(() => {
    if (loadData) {
      setProptype(btnRadio?.estateTypeId);
      types.forEach((i) => i.id === btnRadio?.estateTypeId && setEs(i.estates));
    }
  }, [btnRadio, types]);

  useEffect(() => {
    if (data?.address) {
      dadataReAddress({ query: data?.address, count: 5 }).then((res) => {
        setData((prevState) => ({
          ...prevState,
          address: res[0]?.value,
          fias_id: res[0]?.data?.fias_id,
          latitude: res[0]?.data?.geo_lat,
          longitude: res[0]?.data?.geo_lon,
          city: res[0]?.data?.city
        }));
      });
    }
  }, [data?.address]);

  useEffect(() => {
    if (data?.residentalComplex === null || data?.residentalComplex === undefined) {
      delete data?.residentalComplex;
    }
  }, []);

  const onChangeForOtherImages = (imageList) => {
    setImages(imageList);
  };

  const onChangeForMainImage = (imageList, e) => {
    resetFieldVal(e, "isInValidImage");
    setMainImage(imageList);
  };

  const onRent = (e) => {
    setDeal(+e.target.value); //переключение типа
  };
  const onSale = (e) => {
    setDeal(+e.target.value); //переключение типа
  };

  const handleCheckbox = (e) => {
    const { target } = e;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const { name } = target;
    setData((prevData) => {
      return { ...prevData, [name]: value };
    });
  };

  const yearsForValidation = () => {
    let startYear = new Date().getFullYear();
    const years = [];
    for (startYear; startYear >= 1850; startYear--) {
      years.push(startYear);
    }
    return years.find((i) => i === +data?.yearOfConstruction);
  };

  const isValid = (curField) => {
    const isInValidEstateId = data.estateId === undefined || data.estateId === 0;
    const isInValidTransactionType = data.transactionType === undefined;
    const isInValidAddress = data.address?.length < 5 || data.address === undefined;
    const isInValidHouseType = data.houseType === undefined;
    const isInValidRoomType = data.roomType === undefined;
    const isInValidTotalArea = data.totalArea === undefined || data.totalArea <= 0;
    const isInValidLivingArea = data?.livingArea < 0;
    const isInValidKitchenArea = data?.kitchenArea < 0;
    const isInValidFloor = data.floor === undefined || data.floor <= 0;
    const isInValidMaxFloor = data?.maxFloor < 0;
    const isInValidDescription =
      data.description?.length < 30 || data.description === undefined;
    const isInValidImage = f === undefined;
    const isInValidPrice = data.price === undefined || data?.price < 0;
    const isInValidEstateTypeId =
      data.estateTypeId === undefined || data.estateTypeId === 0;
    const isInValidYear =
      data?.yearOfConstruction?.length > 4 ||
      data?.yearOfConstruction?.length <= 3 ||
      yearsForValidation() === undefined;
    const isInValidCeilingHeight = data.ceilingHeight < 0 || data.ceilingHeight > 100;
    const isInValidCommission =
      data?.commission < 0 || data?.commission > 100 || data?.commission === undefined;
    const isInValidCadastralNumber = data?.cadastralNumber === undefined;
    const isInValidLandCadastralNumber = data?.landСadastralNumber === undefined;
    const isInValidAcres = data?.acres === undefined || data?.acres <= 0;
    const isInValidBuildingType = data?.buildingType === undefined;
    const isInValidParking =
      data?.hasGroundParking === undefined || data?.hasUnderGroundParking === undefined;

    // Step 1
    if (curField === 1) {
      if (isInValidTransactionType) {
        scroll.scrollTo("anchor-1", { offset: -80 });
        setValid({ ...valid, isInValidTransactionType: true });
      } else if (isInValidEstateTypeId) {
        scroll.scrollTo("anchor-1", { offset: -80 });
        setValid({ ...valid, isInValidEstateTypeId: true });
      } else if (isInValidEstateId) {
        scroll.scrollTo("anchor-1", { offset: -80 });
        setValid({ ...valid, isInValidEstateId: true });
      } else return true;
    }

    // Step 2
    else if (curField === 2) {
      if (
        data?.estateTypeName?.toLowerCase()?.includes(localEstates.kvartiri) &&
        isInValidHouseType
      ) {
        scroller.scrollTo("anchor-2", { offset: -80 });
        setValid({ ...valid, isInValidHouseType: true });
        return false;
      } else if (
        data?.estateTypeName?.toLowerCase().includes(localEstates.commer) &&
        isInValidBuildingType
      ) {
        scroller.scrollTo("anchor-2", { offset: -80 });
        setValid({ ...valid, isInValidBuildingType: true });
        return false;
      } else if (
        (data?.estateTypeName?.toLowerCase().includes(localEstates.kvartiri) ||
          data?.estateTypeName?.toLowerCase().includes(localEstates.dom)) &&
        isInValidRoomType
      ) {
        scroller.scrollTo("anchor-2", { offset: -80 });
        setValid({ ...valid, isInValidRoomType: true });
        return false;
      } else if (
        (data?.estateTypeName?.toLowerCase().includes(localEstates.kvartiri) ||
          data?.estateTypeName?.toLowerCase().includes(localEstates.parking) ||
          data?.estateTypeName?.toLowerCase().includes(localEstates.dom)) &&
        isInValidTotalArea
      ) {
        scroller.scrollTo("anchor-2", { offset: -80 });
        setValid({ ...valid, isInValidTotalArea: true });
        return false;
      } else if (
        data?.estateTypeName?.toLowerCase().includes(localEstates.kvartiri) &&
        isInValidLivingArea
      ) {
        scroller.scrollTo("anchor-2", { offset: -80 });
        setValid({ ...valid, isInValidLivingArea: true });
        return false;
      } else if (
        data?.estateTypeName?.toLowerCase().includes(localEstates.kvartiri) &&
        isInValidKitchenArea
      ) {
        scroller.scrollTo("anchor-2", { offset: -80 });
        setValid({ ...valid, isInValidKitchenArea: true });
        return false;
      } else if (
        (data?.estateTypeName?.toLowerCase().includes(localEstates.kvartiri) ||
          data?.estateTypeName?.toLowerCase().includes(localEstates.dom)) &&
        isInValidFloor
      ) {
        scroller.scrollTo("anchor-2", { offset: -80 });
        setValid({ ...valid, isInValidFloor: true });
        return false;
      } else if (
        data?.estateTypeName?.toLowerCase().includes(localEstates.kvartiri) &&
        isInValidMaxFloor
      ) {
        scroller.scrollTo("anchor-2", { offset: -80 });
        setValid({ ...valid, isInValidMaxFloor: true });
        return false;
      } else if (
        data?.estateTypeName?.toLowerCase().includes(localEstates.zemelia) &&
        isInValidAcres
      ) {
        scroller.scrollTo("anchor-2", { offset: -80 });
        setValid({ ...valid, isInValidAcres: true });
        return false;
      } else return true;
    }

    // Step 3
    else if (curField === 3) {
      if (isInValidAddress) {
        scroller.scrollTo("anchor-3", { offset: -80 });
        setValid({ ...valid, isInValidAddress: true });
      } else if (isInValidDescription) {
        scroller.scrollTo("anchor-3", { offset: -80 });
        setValid({ ...valid, isInValidDescription: true });
      } else if (isInValidImage) {
        scroller.scrollTo("anchor-3", { offset: -80 });
        setValid({ ...valid, isInValidImage: true });
      } else return true;
    }

    // Step 4
    else if (curField === 4) {
      if (
        (data?.estateTypeName?.toLowerCase()?.includes(localEstates.kvartiri) ||
          data?.estateTypeName?.toLowerCase()?.includes(localEstates.parking)) &&
        isInValidYear
      ) {
        scroller.scrollTo("anchor-4", { offset: -80 });
        setValid({ ...valid, isInValidYear: true });
      } else if (
        data?.estateTypeName?.toLowerCase().includes(localEstates.kvartiri) &&
        isInValidCeilingHeight
      ) {
        scroller.scrollTo("anchor-4", { offset: -80 });
        setValid({ ...valid, isInValidCeilingHeight: true });
      } else if (data?.estateName.toLowerCase().includes("паркинг") && isInValidParking) {
        scroller.scrollTo("anchor-4", { offset: -80 });
        setValid({ ...valid, isInValidParking: true });
      } else return true;
    }

    // Step 5
    else if (curField === 5) {
      if (isInValidPrice) {
        scroller.scrollTo("anchor-5", { offset: -80 });
        setValid({ ...valid, isInValidPrice: true });
      } else if (isInValidCommission) {
        scroller.scrollTo("anchor-5", { offset: -80 });
        setValid({ ...valid, isInValidCommission: true });
      } else if (isInValidCadastralNumber) {
        scroller.scrollTo("anchor-5", { offset: -80 });
        setValid({ ...valid, isInValidCadastralNumber: true });
      } else if (
        data?.estateTypeName?.toLowerCase().includes(localEstates.dom) &&
        isInValidLandCadastralNumber
      ) {
        scroller.scrollTo("anchor-5", { offset: -80 });
        setValid({ ...valid, isInValidLandCadastralNumber: true });
      } else return true;
    }

    return false;
  };

  const handleSub = (e) => {
    e.preventDefault();

    if (isValid(1) && isValid(2) && isValid(3) && isValid(4) && isValid(5)) {
      const userId = currentUser?.id;
      const formData = new FormData();
      let req;

      if (image === undefined) {
        req = { ...data, token, userId };
        for (const key in req) {
          formData.append(key, req[key]);
        }
      } else {
        req = { ...data, token, userId, image };
        for (const key in req) {
          formData.append(key, req[key]);
        }
        formData.append("outBuildingType", outBuildingTypes.toString());
        formData.append("windRoseDirectionType", windRoseDirectionType.toString());
      }

      formData.append("district[][city]", district["city"]);
      formData.append("district[][name]", district["name"]);

      if (imgs?.length >= 1) {
        imgs.forEach((i, index) => {
          if (i.file?.name !== image.name) {
            formData.append("images[]", i.file);
          }
        });
      } else {
        imgs.forEach((i, index) => {
          if (i.file?.name !== image.name) {
            formData.append("images", i.file);
          }
        });
      }

      addAdvertise(axiosPrivate, formData)
        .then(() => {
          setAlert(
            "success",
            true,
            "Объявление успешно опубликовано, переход в ваши объявления"
          );
          setTimeout(() => {
            navigate("/personal-account/my-ads", { replace: true });
          }, 2000);
        })
        .catch((error) => {
          setAlert("danger", true, "Произошла ошибка сервера");
        });
    }
  };

  const onSubmitUpdateAd = (e) => {
    e.preventDefault();

    if (isValid(1) && isValid(2) && isValid(3) && isValid(4) && isValid(5)) {
      const userId = currentUser?.id;
      const formData = new FormData();
      let req;

      if (image === undefined) {
        req = { ...data, token, userId };
        for (const key in req) {
          formData.append(key, req[key]);
        }
      } else {
        req = { ...data, token, userId, image };
        for (const key in req) {
          formData.append(key, req[key]);
        }
      }

      formData.append("district[][city]", district["city"]);
      formData.append("district[][name]", district["name"]);

      if (imgs.hasOwnProperty("file")) {
        if (imgs?.length >= 1) {
          imgs.forEach((i, index) => {
            if (i.file?.name !== image.name) {
              formData.append("images[]", i.file);
            }
          });
        } else {
          imgs.forEach((i, index) => {
            if (i.file?.name !== image?.name) {
              formData.append("images", i.file);
            }
          });
        }
      }

      updateAd(axiosPrivate, uuid, formData)
        .then(() => {
          setAlert(
            "success",
            true,
            "Объявление успешно отредактировано, переход в мои объявления"
          );
          setTimeout(() => {
            navigate("/personal-account/my-ads", { replace: true });
          }, 2000);
        })
        .catch(() => {
          setAlert("danger", true, "Произошла ошибка сервера");
        });
    }
  };

  const suggestionsRef = useCallback((node) => {
    if (node !== null) {
      node.setInputValue(data?.address);
    }
  }, []);

  const resetFieldVal = (newState, field) => {
    setValid({ ...valid, [field]: false });
  };

  const seterDataInComponent = useCallback((e) => {
    const name = e.target.name;
    setData((prevState) => ({
      ...prevState,
      [name]: e.target.value ? e.target.value : undefined
    }));
    if (e.target.type === "checkbox") {
      setData((prevState) => ({ ...prevState, [name]: e.target.checked }));
    }
  }, []);

  const seterForDaData = useCallback((e) => {
    setData((prevState) => ({
      ...prevState,
      address: e.value,
      latitude: e.data?.geo_lat,
      longitude: e.data?.geo_lon,
      fias_id: e.data?.fias_id,
      city: e.data?.city
    }));
  }, []);

  const seterActiveField = useCallback((number) => {
    setActiveField(number);
  }, []);

  const resetValid = useCallback(
    (newState, field) => {
      setValid({ ...valid, [field]: false });
    },
    [valid]
  );

  const seterRadioBtns = useCallback((e) => {
    const name = e.target.name;
    setBtnRadio((prevState) => ({ ...prevState, [name]: +e.target.value }));
  });

  const advertiseSteps = [
    { title: "Тип объявления" },
    { title: "Об объекте" },
    { title: "Описание и фото" },
    { title: "О здании" },
    { title: "Условия сделки" }
  ];

  return (
    <main>
      <div className="container py-3 py-sm-4 py-lg-5">
        <nav aria-label="breadcrumb">
          <NavLink to="/" className="d-block d-md-none gray-3">
            &#10094; Назад
          </NavLink>
          <ol className="d-none d-md-flex breadcrumb">
            <li className="breadcrumb-item">
              <NavLink to="/">Главная</NavLink>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {uuid === undefined ? "Подача объявления" : "Редактирование объявления"}
            </li>
          </ol>
        </nav>
      </div>
      <section id="sec-11" className="container mb-6">
        <h1 className="text-center text-lg-start">
          {uuid === undefined ? "Подача объявления" : "Редактирование объявления"}
        </h1>
        <form
          ref={ref}
          className="row gx-xxl-5 position-relative"
          name="postingAd"
          noValidate
        >
          <div className="mob-indicator">
            {advertiseSteps?.map(({ title }, index) => {
              if (
                data?.estateTypeName?.toLowerCase().includes(localEstates.zemelia) &&
                title === advertiseSteps[3].title
              )
                advertiseSteps.splice(index, 1);

              return (
                <div
                  className={
                    activeField === index + 1 ||
                    (data?.estateTypeName?.toLowerCase().includes(localEstates.zemelia) &&
                      activeField === 5 && index === 3)
                      ? "active"
                      : ""
                  }
                  onClick={() => {
                    if ((index <= activeField) && (isValid(activeField))) {                      
                      if (
                        data?.estateTypeName
                          ?.toLowerCase()
                          .includes(localEstates.zemelia) &&
                        index === 3
                      ) {
                        setActiveField(index + 2);
                      } else {
                        setActiveField(index + 1);
                      }
                    }
                    
                  }}
                >
                  {index + 1}
                </div>
              );
            })}
          </div>
          <div className="col-lg-9">
            <fieldset
              data-show={activeField === 1 ? "true" : "false"}
              name="anchor-1"
              className="element frame p-lg-4 mb-4 mb-lg-5"
            >
              <legend className="text-center text-lg-start title-font fw-7 fs-15 mb-md-4">
                Тип объявления
              </legend>
              <div className="row">
                <div className="col-md-3 fs-11 title-req mt-4 mt-sm-5 mb-3 m-md-0">
                  <span
                    data-for="deal"
                    data-status={false}
                    style={{
                      color: valid?.isInValidTransactionType ? "#DA1E2A" : ""
                    }}
                  >
                    Сделка*:
                  </span>
                </div>
                <div className="col-md-9">
                  <div className="row row-cols-3 row-cols-xxl-4">
                    <div>
                      <label>
                        <input
                          type="radio"
                          name="deal"
                          value={0}
                          checked={btnRadio?.transactionType === 0}
                          onClick={() =>
                            setBtnRadio((prevState) => ({
                              ...prevState,
                              transactionType: 0
                            }))
                          }
                          onChange={(e) => {
                            onRent(e);
                            setData((prevData) => {
                              return {
                                ...prevData,
                                transactionType: +e.target.value
                              };
                            });
                            resetFieldVal(e, "isInValidTransactionType");
                          }}
                        />
                        <span className="fs-11 ms-2">Аренда</span>
                      </label>
                    </div>
                    <div>
                      <label>
                        <input
                          type="radio"
                          name="deal"
                          value={1}
                          checked={btnRadio.transactionType === 1}
                          onClick={() =>
                            setBtnRadio((prevState) => ({
                              ...prevState,
                              transactionType: 1
                            }))
                          }
                          onChange={(e) => {
                            onSale(e);
                            setData((prevData) => {
                              return {
                                ...prevData,
                                transactionType: +e.target.value
                              };
                            });
                          }}
                        />
                        <span className="fs-11 ms-2">Продажа</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <hr className="d-none d-md-block my-4" />
              {deal === 0 && (
                <>
                  <div className="row">
                    <div className="col-md-3 fs-11 title-req mt-4 mt-sm-5 mb-3 m-md-0">
                      <span
                        data-for="rental-type"
                        data-status={false}
                        style={{
                          color: valid.isInValidRentalTypes ? "#DA1E2A" : ""
                        }}
                      >
                        Тип аренды*:
                      </span>
                    </div>
                    <div className="col-md-9">
                      <div className="row row-cols-3 row-cols-xxl-4">
                        <div>
                          <label>
                            <input
                              type="radio"
                              name="rental-type"
                              value="1"
                              checked={btnRadio.rentalPeriod === 1}
                              onClick={() =>
                                setBtnRadio((prevState) => ({
                                  ...prevState,
                                  rentalPeriod: 1
                                }))
                              }
                              onChange={(e) => {
                                setData((prevData) => {
                                  return {
                                    ...prevData,
                                    rentalPeriod: e.target.value
                                  };
                                });
                                resetFieldVal(e, "isInValidRentalTypes");
                              }}
                            />
                            <span className="fs-11 ms-2">Длительно</span>
                          </label>
                        </div>
                        <div>
                          <label>
                            <input
                              type="radio"
                              name="rental-type"
                              value="3"
                              checked={btnRadio.rentalPeriod === 3}
                              onClick={() =>
                                setBtnRadio((prevState) => ({
                                  ...prevState,
                                  rentalPeriod: 3
                                }))
                              }
                              onChange={(e) => {
                                setData((prevData) => {
                                  return {
                                    ...prevData,
                                    rentalPeriod: e.target.value
                                  };
                                });
                              }}
                            />
                            <span className="fs-11 ms-2">Краткосрочно</span>
                          </label>
                        </div>
                        <div>
                          <label>
                            <input
                              type="radio"
                              name="rental-type"
                              value="0"
                              checked={btnRadio.rentalPeriod === 0}
                              onClick={() =>
                                setBtnRadio((prevState) => ({
                                  ...prevState,
                                  rentalPeriod: 0
                                }))
                              }
                              onChange={(e) => {
                                setData((prevData) => {
                                  return {
                                    ...prevData,
                                    rentalPeriod: e.target.value
                                  };
                                });
                              }}
                            />
                            <span className="fs-11 ms-2">Посуточно</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <hr className={deal === 0 ? "d-none d-md-block my-4" : "d-none"} />
                </>
              )}
              <div className="row">
                <div className="col-md-3 fs-11 title-req mt-4 mt-sm-5 mb-3 m-md-0">
                  <span
                    data-for="property-type"
                    data-status={false}
                    style={{
                      color: valid.isInValidEstateTypeId ? "#DA1E2A" : ""
                    }}
                  >
                    Тип недвижимости*:
                  </span>
                </div>
                <div className="col-md-9">
                  <div className="row row-cols-2 row-cols-sm-3 row-cols-xxl-4 gy-3">
                    {types.map((i) => (
                      <div key={i.id}>
                        <label>
                          <input
                            type="radio"
                            name="property-type"
                            value={i.id}
                            checked={btnRadio.estateTypeId === i.id}
                            onClick={() =>
                              setBtnRadio((prevState) => ({
                                ...prevState,
                                estateTypeId: i.id
                              }))
                            }
                            onChange={(e) => {
                              setProptype(i.id);
                              setData({
                                ...data,
                                estateTypeId: e.target.value,
                                estateTypeName: i.name
                              });
                              setEs(i.estates);
                              resetFieldVal(e, "isInValidEstateTypeId");
                            }}
                          />
                          <span className="fs-11 ms-2">{i.name}</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {proptype === res && (
                <>
                  <hr className="d-none d-md-block my-4" />
                  <div className="row">
                    <div className="col-md-3 fs-11 title-req mt-4 mt-sm-5 mb-3 m-md-0">
                      <span
                        data-for="estate"
                        data-status={false}
                        style={{
                          color: valid.isInValidEstateId ? "#DA1E2A" : ""
                        }}
                      >
                        Объект*:
                      </span>
                    </div>
                    <div className="col-md-9">
                      <div className="row row-cols-2 row-cols-sm-3 row-cols-xxl-4 gy-3">
                        {es?.length > 0 &&
                          es.map((i) => (
                            <div key={i.id}>
                              <label>
                                <input
                                  type="radio"
                                  name="estate"
                                  value={i.id}
                                  onClick={() =>
                                    setBtnRadio((prevState) => ({
                                      ...prevState,
                                      estateId: i.id
                                    }))
                                  }
                                  checked={btnRadio.estateId === i.id}
                                  onChange={(e) => {
                                    setData((prevData) => ({
                                      ...prevData,
                                      estateId: e.target.value,
                                      estateName: i.name
                                    }));
                                    resetFieldVal(e, "isInValidEstateId");
                                  }}
                                />
                                <span className="fs-11 ms-2">{i.name}</span>
                              </label>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </>
              )}
              {(data?.estateTypeName?.toLowerCase()?.includes(localEstates.kvartiri) ||
                data?.estateTypeName?.toLowerCase()?.includes(localEstates.dom)) && (
                <AdTypeResidential
                  estateTypeName={data?.estateTypeName}
                  onChange={seterDataInComponent}
                  info={{
                    estateType: btnRadio?.estateType,
                    landArea: data?.landArea,
                    areaType: btnRadio?.areaType
                  }}
                  seterRadio={seterRadioBtns}
                />
              )}
              {data?.estateTypeName?.toLowerCase()?.includes("коммерческая ") &&
                data?.estateName?.toLowerCase()?.includes("готовый бизнес") && (
                  <AdTypeCommercial
                    estateName={data?.estateName}
                    seterRadio={seterRadioBtns}
                    info={{
                      directionType: btnRadio?.directionType,
                      hasVentilation: btnRadio?.hasVentilation,
                      hasFireAlarm: btnRadio?.hasFireAlarm,
                      hasSecurityAlarm: btnRadio?.hasSecurityAlarm,
                      gradeType: btnRadio?.gradeType
                    }}
                    onChange={seterDataInComponent}
                  />
                )}
              {/*{(data?.estateTypeName?.toLowerCase()?.includes(localEstates.zemelia) && data?.estateName?.toLowerCase()?.includes('земельный участок')) &&
                                <AdTypeLandPlot
                                    seterRadio={seterRadioBtns}
                                    onChange={seterDataInComponent}
                                    info={{
                                        areaType: btnRadio?.areaType
                                    }}
                                />
                            }*/}

              {/* для мобильных устроийств */}
              <div className="d-lg-none row row-cols-2 row-cols-md-3 gx-2 gx-sm-4 justify-content-center mt-4 mt-sm-5">
                <div>
                  <button
                    type="button"
                    className="btn btn-2 w-100"
                    onClick={() => navigate("/personal-account/my-ads")}
                  >
                    Отменить
                  </button>
                </div>
                <div>
                  <button
                    type="button"
                    className="btn btn-1 w-100"
                    onClick={() => {
                      if (isValid(activeField)) setActiveField(2);
                    }}
                  >
                    Далее
                  </button>
                </div>
              </div>
            </fieldset>

            {(data?.estateTypeName?.toLowerCase()?.includes(localEstates.kvartiri) ||
              data?.estateTypeName?.toLowerCase()?.includes(localEstates.dom)) && (
              <AboutResidential
                transactionType={data?.transactionType}
                valid={valid}
                resetValid={resetValid}
                activeField={activeField}
                info={{
                  residentalComplex: data?.residentalComplex,
                  houseType: btnRadio?.houseType,
                  roomType: btnRadio?.roomType,
                  totalArea: data?.totalArea,
                  livingArea: data?.livingArea,
                  kitchenArea: data?.kitchenArea,
                  floor: data?.floor,
                  maxFloor: data?.maxFloor,
                  WCType: btnRadio?.WCType,
                  balconyType: btnRadio?.balconyType,
                  layoutType: btnRadio?.layoutType,
                  repairType: btnRadio?.repairType,
                  window: btnRadio?.window,
                  windowType: btnRadio?.windowType,
                  outBuildingType: outBuildingTypes,
                  hasBasement: btnRadio?.hasBasement,
                  hasKitchenFurniture: data?.hasKitchenFurniture,
                  hasFurniture: data?.hasFurniture,
                  hasRefrigerator: data?.hasRefrigerator,
                  hasWashingMachine: data?.hasWashingMachine,
                  hasDishWasher: data?.hasDishWasher,
                  hasTv: data?.hasTv,
                  hasConditioner: data?.hasConditioner,
                  hasInternet: data?.hasInternet,
                  hasBathroom: data?.hasBathroom,
                  hasShowerCabin: data?.hasShowerCabin,
                  withKids: data?.withKids,
                  withPets: data?.withPets
                }}
                seterRadio={seterRadioBtns}
                estateTypeName={data?.estateTypeName}
                onChange={seterDataInComponent}
                onBuldingTypeChange={(e) => {
                  const value = e.target.value;
                  if (outBuildingTypes.includes(value)) {
                    setOutBuildingTypes((prevBuildingTypes) =>
                      prevBuildingTypes.filter((buildingType) => buildingType !== value)
                    );
                  } else {
                    setOutBuildingTypes((prevBuildingTypes) => [
                      ...prevBuildingTypes,
                      value
                    ]);
                  }
                }}
                onWindRoseDirectionTypeChange={(e) => {
                  const value = e.target.value;
                  if (windRoseDirectionType.includes(value)) {
                    setWindRoseDirectionType((prevWindDirectionType) =>
                      prevWindDirectionType.filter(
                        (directionType) => directionType !== value
                      )
                    );
                  } else {
                    setWindRoseDirectionType((prevWindDirectionTypes) => [
                      ...prevWindDirectionTypes,
                      value
                    ]);
                  }
                }}
                seterActiveField={seterActiveField}
                isValid={isValid}
              />
            )}
            {data?.estateTypeName?.toLowerCase()?.includes(localEstates.commer) && (
              <AboutCommercial
                valid={valid}
                resetValid={resetValid}
                activeField={activeField}
                seterActiveField={seterActiveField}
                isValid={isValid}
                onChange={seterDataInComponent}
                info={{
                  totalArea: data?.totalArea,
                  buildingType: btnRadio?.buildingType
                }}
                seterRadio={seterRadioBtns}
              />
            )}
            {data?.estateTypeName?.toLowerCase().includes(localEstates.parking) && (
              <AboutParking
                estateName={data?.estateName}
                valid={valid}
                resetValid={resetValid}
                activeField={activeField}
                info={{
                  residentalComplex: data?.residentalComplex,
                  locationType: btnRadio?.locationType,
                  totalArea: data?.totalArea,
                  hasSecurity: btnRadio?.hasSecurity
                }}
                seterRadio={seterRadioBtns}
                seterActiveField={seterActiveField}
                isValid={isValid}
                onChange={seterDataInComponent}
              />
            )}
            {data?.estateTypeName?.toLowerCase()?.includes(localEstates.zemelia) && (
              <AboutStead
                valid={valid}
                resetValid={resetValid}
                activeField={activeField}
                info={{
                  acres: data?.acres,
                  cityDistance: data?.cityDistance
                }}
                seterActiveField={seterActiveField}
                isValid={isValid}
                onChange={seterDataInComponent}
              />
            )}

            <fieldset
              data-show={activeField === 3 ? "true" : "false"}
              name="anchor-3"
              className="element frame p-lg-4 mb-4 mb-lg-5"
            >
              <legend className="title-font fw-7 fs-15 mb-4">Описание и фото</legend>
              <div className="row mb-2">
                <div className="col-md-3 fs-11 title-req mt-4 mt-sm-5 mb-3 m-md-0">
                  <span
                    data-for="address"
                    data-status={false}
                    style={{
                      color: valid?.isInValidAddress ? "#DA1E2A" : ""
                    }}
                  >
                    Адрес*:
                  </span>
                </div>
                <div className="col-md-9">
                  <AddressSuggestions
                    delay={1000}
                    httpCache={true}
                    minChars={3}
                    defaultQuery={data?.address}
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
                      seterForDaData(e);
                      resetValid(e, "isInValidAddress");
                    }}
                  />
                </div>
              </div>
              <div className="row mb-2">
                <div className="col-md-3 fs-11 title-req mb-3 m-md-0">
                  <span
                    data-for="description"
                    data-status={false}
                    style={{
                      color: valid.isInValidDescription ? "#DA1E2A" : ""
                    }}
                  >
                    Описание*:
                  </span>
                </div>
                <div className="col-md-9">
                  <textarea
                    style={{
                      borderColor: valid.isInValidDescription ? "#DA1E2A" : ""
                    }}
                    name="description"
                    rows="5"
                    className="fs-11"
                    value={data?.description || ""}
                    placeholder="Расскажите подробне об объекте и условиях сделки."
                    onChange={(e) => {
                      setData((prevData) => {
                        return {
                          ...prevData,
                          description: e.target.value ? e.target.value : undefined
                        };
                      });
                      resetFieldVal(e, "isInValidDescription");
                    }}
                  />
                  <div className="fs-08 gray-3 mt-2">Минимум 30 символов</div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-3 fs-11 title-req mb-3 m-md-0">
                  <span
                    data-for="imgs"
                    data-status={false}
                    style={{
                      color: valid.isInValidImage ? "#DA1E2A" : ""
                    }}
                  >
                    Фото и планировка*:
                  </span>
                </div>
                <div className="col-md-9">
                  <ImageUploading
                    value={mainImage}
                    onChange={onChangeForMainImage}
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
                                    onClick={() => onImageUpdate(index)}
                                  >
                                    <img src="/img/icons/update.svg" alt="Обновить" />
                                  </button>
                                </div>
                                {index === mainImg && (
                                  <div className="mark">Главное фото</div>
                                )}
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
                              <span className="ms-2">Добавить главное фото</span>
                            </button>
                          </div>
                        </div>
                        <span className="text-danger">
                          {errors?.acceptType &&
                            "Поддерживаемые форматы файла: JPEG, JPG, PNG"}
                        </span>
                      </>
                    )}
                  </ImageUploading>
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
                                      uuid &&
                                        deleteImage(axiosPrivate, image.id, token)
                                          .then(() =>
                                            setAlert(
                                              "success",
                                              true,
                                              "Картинка успешно удалена"
                                            )
                                          )
                                          .catch(() =>
                                            setAlert("danger", true, "Произошла ошибка")
                                          );
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
                          {errors?.acceptType &&
                            "Поддерживаемые форматы файла: JPEG, JPG, PNG"}
                        </span>
                      </>
                    )}
                  </ImageUploading>
                  <div className="fs-08 gray-3 mt-2">
                    Не допускаются к размещению фотографии с водяными знаками, чужих
                    объектов и рекламные баннеры. Допустимы JPG, PNG, JPEG или WEBP.
                    Загрузка от 2 штук и более.
                  </div>
                </div>
              </div>
              {/* для мобильных устроийств */}
              <div className="d-lg-none row row-cols-2 row-cols-md-3 gx-2 gx-sm-4 justify-content-center mt-4">
                <div>
                  <button
                    type="button"
                    className="btn btn-2 w-100"
                    onClick={() => setActiveField(activeField - 1)}
                  >
                    Назад
                  </button>
                </div>
                <div>
                  <button
                    type="button"
                    className="btn btn-1 w-100"
                    onClick={() => {
                      if (isValid(activeField))
                        setActiveField(
                          data?.estateTypeName?.toLowerCase() === localEstates.zemelia
                            ? 5
                            : 4
                        );
                    }}
                  >
                    Далее
                  </button>
                </div>
              </div>
            </fieldset>

            {(data?.estateTypeName?.toLowerCase().includes(localEstates.kvartiri) ||
              data?.estateTypeName?.toLowerCase().includes(localEstates.dom)) && (
              <AboutBuildingResidential
                resetValid={resetValid}
                valid={valid}
                activeField={activeField}
                seterActiveField={seterActiveField}
                estateTypeName={data?.estateTypeName}
                isValid={isValid}
                onChange={seterDataInComponent}
                info={{
                  yearOfConstruction: data?.yearOfConstruction,
                  houseBuildingType: btnRadio?.houseBuildingType,
                  elevatorType: btnRadio?.elevatorType,
                  ceilingHeight: data?.ceilingHeight,
                  hasRamp: btnRadio?.hasRamp,
                  hasGarbage: btnRadio?.hasGarbage,
                  hasGroundParking: data?.hasGroundParking,
                  hasUnderGroundParking: data?.hasUnderGroundParking,
                  hasMoreLayerParking: data?.hasMoreLayerParking,
                  hasYardParking: data?.hasYardParking,
                  hasBarrierParking: data?.hasBarrierParking
                }}
                seterRadio={seterRadioBtns}
              />
            )}
            {data?.estateTypeName?.toLowerCase().includes(localEstates.commer) && (
              <AboutBuildingCommercial
                activeField={activeField}
                seterActiveField={seterActiveField}
                isValid={isValid}
                onChange={seterDataInComponent}
                info={{
                  yearOfConstruction: data?.yearOfConstruction,
                  houseBuildingType: btnRadio?.houseBuildingType,
                  elevatorType: btnRadio?.elevatorType,
                  ceilingHeight: data?.ceilingHeight,
                  hasRamp: btnRadio?.hasRamp,
                  hasGarbage: btnRadio?.hasGarbage,
                  hasGroundParking: data?.hasGroundParking,
                  hasUnderGroundParking: data?.hasUnderGroundParking,
                  hasMoreLayerParking: data?.hasMoreLayerParking,
                  hasYardParking: data?.hasYardParking,
                  hasBarrierParking: data?.hasBarrierParking
                }}
                seterRadio={seterRadioBtns}
              />
            )}
            {data?.estateTypeName?.toLowerCase().includes(localEstates.parking) && (
              <AboutBuildingParking
                estateName={data?.estateName}
                valid={valid}
                resetValid={resetValid}
                activeField={activeField}
                seterActiveField={seterActiveField}
                isValid={isValid}
                onChange={seterDataInComponent}
                info={{
                  yearOfConstruction: data?.yearOfConstruction,
                  hasGroundParking: data?.hasGroundParking,
                  hasUnderGroundParking: data?.hasUnderGroundParking,
                  hasMoreLayerParking: data?.hasMoreLayerParking,
                  hasYardParking: data?.hasYardParking,
                  hasBarrierParking: data?.hasBarrierParking
                }}
              />
            )}

            <fieldset
              data-show={activeField === 5 ? "true" : "false"}
              name="anchor-5"
              className="element frame p-lg-4 mb-4 mb-lg-5"
            >
              <legend className="title-font fw-7 fs-15 mb-5">Условия сделки</legend>
              {
                /* условия ПРОДАЖИ */
                deal === 1 && (
                  <div>
                    <div className="row align-items-center mt-4 mt-sm-5 mb-4">
                      <div className="col-md-3 fs-11 title-req mb-3 m-md-0">
                        <span
                          data-for="price"
                          data-status={false}
                          style={{
                            color: valid.isInValidPrice ? "#DA1E2A" : ""
                          }}
                        >
                          Цена*:
                        </span>
                      </div>
                      <div className="col-md-9">
                        <input
                          style={{
                            borderColor: valid.isInValidPrice ? "#DA1E2A" : ""
                          }}
                          type="number"
                          name="price"
                          value={data?.price || ""}
                          className="fs-11 price"
                          onChange={(e) => {
                            setData((prevData) => {
                              return {
                                ...prevData,
                                price: e.target.value ? e.target.value : undefined
                              };
                            });
                            resetFieldVal(e, "isInValidPrice");
                          }}
                        />
                      </div>
                    </div>
                    <div className="row align-items-center mt-4 mt-sm-5 mb-4">
                      <div className="col-md-3 fs-11 title-req mb-3 m-md-0">
                        <span
                          data-for="hypothec"
                          data-status={false}
                          style={{
                            color: valid.isInValidHypothec ? "#DA1E2A" : ""
                          }}
                        >
                          Ипотека*:
                        </span>
                      </div>
                      <div className="col-md-9 d-flex">
                        <label className="me-5">
                          <input
                            type="radio"
                            name="hypothec"
                            value={1}
                            checked={btnRadio?.isMortgage === 1}
                            onClick={() =>
                              setBtnRadio((prevState) => ({
                                ...prevState,
                                isMortgage: 1
                              }))
                            }
                            onChange={(e) => {
                              setData((prevData) => {
                                return {
                                  ...prevData,
                                  isMortgage: e.target.value
                                };
                              });
                              resetFieldVal(e, "isInValidHypothec");
                            }}
                          />
                          <span className="fs-11 ms-2">Да</span>
                        </label>
                        <label>
                          <input
                            type="radio"
                            name="hypothec"
                            value={0}
                            checked={btnRadio?.isMortgage === 0}
                            onClick={() =>
                              setBtnRadio((prevState) => ({
                                ...prevState,
                                isMortgage: 0
                              }))
                            }
                            onChange={(e) => {
                              setData((prevData) => {
                                return {
                                  ...prevData,
                                  isMortgage: e.target.value
                                };
                              });
                            }}
                          />
                          <span className="fs-11 ms-2">Нет</span>
                        </label>
                      </div>
                    </div>
                    <div className="row align-items-center mt-4 mt-sm-5 mb-4">
                      <div className="col-md-3 fs-11 title mb-3 m-md-0">Обременения:</div>
                      <div className="col-md-9 d-flex">
                        <label className="me-5">
                          <input
                            type="radio"
                            name="isEncumbrances"
                            checked={btnRadio?.isEncumbrances === 1}
                            onClick={() =>
                              setBtnRadio((prevState) => ({
                                ...prevState,
                                isEncumbrances: 1
                              }))
                            }
                            value={1}
                            onChange={(e) => {
                              setData((prevData) => {
                                return {
                                  ...prevData,
                                  isEncumbrances: e.target.value
                                };
                              });
                            }}
                          />
                          <span className="fs-11 ms-2">Да</span>
                        </label>
                        <label>
                          <input
                            type="radio"
                            name="isEncumbrances"
                            checked={btnRadio?.isEncumbrances === 0}
                            onClick={() =>
                              setBtnRadio((prevState) => ({
                                ...prevState,
                                isEncumbrances: 0
                              }))
                            }
                            value={0}
                            onChange={(e) => {
                              setData((prevData) => {
                                return {
                                  ...prevData,
                                  isEncumbrances: e.target.value
                                };
                              });
                            }}
                          />
                          <span className="fs-11 ms-2">Нет</span>
                        </label>
                      </div>
                    </div>
                    <div className="row align-items-start mt-4 mt-sm-5 mb-4">
                      <div className="col-md-3 fs-11 title mb-3 m-md-0">Продавцы:</div>
                      <div className="col-md-9">
                        <div className="row row-cols-2 row-cols-sm-3 row-cols-xxl-4 gy-3">
                          <label>
                            <input
                              type="radio"
                              name="sellerType"
                              value={0}
                              checked={btnRadio?.sellerType === 0}
                              onClick={() =>
                                setBtnRadio((prevState) => ({
                                  ...prevState,
                                  sellerType: 0
                                }))
                              }
                              onChange={(e) => {
                                setData((prevData) => {
                                  return {
                                    ...prevData,
                                    sellerType: e.target.value
                                  };
                                });
                              }}
                            />
                            <span className="fs-11 ms-2">Собственник</span>
                          </label>
                          <label>
                            <input
                              type="radio"
                              name="sellerType"
                              value={1}
                              checked={btnRadio?.sellerType === 1}
                              onClick={() =>
                                setBtnRadio((prevState) => ({
                                  ...prevState,
                                  sellerType: 1
                                }))
                              }
                              onChange={(e) => {
                                setData((prevData) => {
                                  return {
                                    ...prevData,
                                    sellerType: e.target.value
                                  };
                                });
                              }}
                            />
                            <span className="fs-11 ms-2">Застройщик</span>
                          </label>
                          <label>
                            <input
                              type="radio"
                              name="sellerType"
                              value={2}
                              checked={btnRadio?.sellerType === 2}
                              onClick={() =>
                                setBtnRadio((prevState) => ({
                                  ...prevState,
                                  sellerType: 2
                                }))
                              }
                              onChange={(e) => {
                                setData((prevData) => {
                                  return {
                                    ...prevData,
                                    sellerType: e.target.value
                                  };
                                });
                              }}
                            />
                            <span className="fs-11 ms-2 text-nowrap">Агенство</span>
                          </label>
                          <label>
                            <input
                              type="radio"
                              name="sellerType"
                              value={3}
                              checked={btnRadio?.sellerType === 3}
                              onClick={() =>
                                setBtnRadio((prevState) => ({
                                  ...prevState,
                                  sellerType: 3
                                }))
                              }
                              onChange={(e) => {
                                setData((prevData) => {
                                  return {
                                    ...prevData,
                                    sellerType: e.target.value
                                  };
                                });
                              }}
                            />
                            <span className="fs-11 ms-2 text-nowrap">Не важно</span>
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="row align-items-start mt-4 mt-sm-5 mb-4">
                      <div className="col-md-3 fs-11 title-req mt-4 mt-sm-5 mb-3 m-md-0">
                        <span
                          style={{
                            color: valid?.isInValidCadastralNumber ? "#DA1E2A" : ""
                          }}
                        >
                          Кадастровый номер
                          {data?.estateTypeName?.toLowerCase().includes(localEstates.dom)
                            ? " дома"
                            : ""}
                          *:
                        </span>
                      </div>
                      <div className="col-md-9">
                        <div>
                          <label>
                            <input
                              type="text"
                              style={{
                                borderColor: valid?.isInValidCadastralNumber
                                  ? "#DA1E2A"
                                  : ""
                              }}
                              value={data?.cadastralNumber || ""}
                              onChange={(e) => {
                                setData((prevState) => ({
                                  ...prevState,
                                  cadastralNumber: e.target.value
                                    ? e.target.value
                                    : undefined
                                }));
                                resetFieldVal(e, "isInValidCadastralNumber");
                              }}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                    {data?.estateTypeName?.toLowerCase().includes(localEstates.dom) && (
                      <div className="row align-items-start mt-4 mt-sm-5 mb-4">
                        <div className="col-md-3 fs-11 title-req mt-4 mt-sm-5 mb-3 m-md-0">
                          <span
                            style={{
                              color: valid?.isInValidLandCadastralNumber ? "#DA1E2A" : ""
                            }}
                          >
                            Кадастровый номер земли*:
                          </span>
                        </div>
                        <div className="col-md-9">
                          <div>
                            <label>
                              <input
                                type="text"
                                style={{
                                  borderColor: valid?.isInValidLandCadastralNumber
                                    ? "#DA1E2A"
                                    : ""
                                }}
                                value={data?.landСadastralNumber || ""}
                                onChange={(e) => {
                                  setData((prevState) => ({
                                    ...prevState,
                                    landСadastralNumber: e.target.value
                                      ? e.target.value
                                      : undefined
                                  }));
                                  resetFieldVal(e, "isInValidLandCadastralNumber");
                                }}
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="row align-items-center mt-4 mt-sm-5 mb-4">
                      <div className="col-md-3 fs-11 title mb-3 m-md-0">
                        Условия сделки:
                        <div className="fs-08 gray-3 mt-2">
                          * В прямой продаже участвуете вы и продавец. В альтернативной
                          сделке продавец планирует покупку нового жилья одновременно с
                          продажей старого. Обычно обе сделки проходят в один день.
                        </div>
                      </div>
                      <div className="col-md-9 d-flex flex-wrap">
                        <label className="me-5">
                          <input
                            type="radio"
                            name="saleType"
                            value={0}
                            checked={btnRadio?.saleType === 0}
                            onClick={() =>
                              setBtnRadio((prevState) => ({
                                ...prevState,
                                saleType: 0
                              }))
                            }
                            onChange={(e) => {
                              setData((prevData) => ({
                                ...prevData,
                                saleType: e.target.value
                              }));
                            }}
                          />
                          <span className="fs-11 ms-2">Прямая</span>
                        </label>
                        <label className="me-5">
                          <input
                            type="radio"
                            name="saleType"
                            value={1}
                            checked={btnRadio?.saleType === 1}
                            onClick={() =>
                              setBtnRadio((prevState) => ({
                                ...prevState,
                                saleType: 1
                              }))
                            }
                            onChange={(e) => {
                              setData((prevData) => ({
                                ...prevData,
                                saleType: e.target.value
                              }));
                            }}
                          />
                          <span className="fs-11 ms-2">Альтернативная</span>
                        </label>
                        <label>
                          <input
                            type="radio"
                            name="saleType"
                            value={2}
                            checked={btnRadio?.saleType === 2}
                            onClick={() =>
                              setBtnRadio((prevState) => ({
                                ...prevState,
                                saleType: 2
                              }))
                            }
                            onChange={(e) => {
                              setData((prevData) => ({
                                ...prevData,
                                saleType: e.target.value
                              }));
                            }}
                          />
                          <span className="fs-11 ms-2 text-nowrap">Не важно</span>
                        </label>
                      </div>
                    </div>
                  </div>
                )
              }
              {
                /* условия АРЕНДЫ */
                deal === 0 && (
                  <div>
                    <div className="row align-items-center mb-4">
                      <div className="col-md-3 mb-3 m-md-0">
                        <div className="fs-11 title-req">
                          <span
                            data-for="rental"
                            data-status={false}
                            style={{
                              color: valid.isInValidPrice ? "#DA1E2A" : ""
                            }}
                          >
                            Арендная плата*:
                          </span>
                        </div>
                        <small className="gray-3 fs-08">Без коммунальных услуг</small>
                      </div>
                      <div className="col-md-9">
                        <input
                          style={{
                            borderColor: valid.isInValidPrice ? "#DA1E2A" : ""
                          }}
                          type="number"
                          name="rental"
                          value={data?.price || ""}
                          placeholder="0"
                          className="fs-11 price"
                          onChange={(e) => {
                            setData((prevData) => {
                              return {
                                ...prevData,
                                price: e.target.value
                              };
                            });
                            resetFieldVal(e, "isInValidPrice");
                          }}
                        />
                      </div>
                    </div>
                    <div className="row mb-4">
                      <div className="col-md-3 mb-3 m-md-0 fs-11 title-req">
                        Коммунальные платежи:
                      </div>
                      <div className="col-md-9">
                        <input
                          type="number"
                          value={data?.communalPrice || ""}
                          className="fs-11 price"
                          onChange={(e) => {
                            setData((prevData) => {
                              return {
                                ...prevData,
                                communalPrice: e.target.value
                              };
                            });
                          }}
                        />
                        <div className="d-flex mt-2">
                          <input
                            type="checkbox"
                            name="isCountersSeparately"
                            onChange={(e) => handleCheckbox(e)}
                          />
                          <span className="ms-2">Счетчики оплачиваются отдельно</span>
                        </div>
                      </div>
                    </div>
                    <div className="row mb-4">
                      <div className="col-md-3 mb-3 m-md-0 fs-11 title-req">
                        <span data-for="deposit" data-status={false}>
                          Залог*:
                        </span>
                      </div>
                      <div className="col-md-9">
                        <input
                          type="number"
                          name="deposit"
                          placeholder="0"
                          className="fs-11 price"
                          value={data.pledge || ""}
                          disabled={data.isPledge}
                          onChange={(e) => {
                            setData((prevData) => {
                              return {
                                ...prevData,
                                pledge: e.target.value
                              };
                            });
                            resetFieldVal(e, "isInValidPledge");
                          }}
                        />
                        <div className="d-flex mt-2">
                          <input
                            type="checkbox"
                            name="isPledge"
                            onChange={(e) => {
                              handleCheckbox(e);
                              setData((prevData) => {
                                return {
                                  ...prevData,
                                  pledge: 0
                                };
                              });
                            }}
                          />
                          <span className="ms-2">Без залога</span>
                        </div>
                      </div>
                    </div>
                    <div className="row align-items-center mb-4">
                      <div className="col-md-3 mb-3 m-md-0 fs-11 title-req">
                        <span data-for="prepayment" data-status={false}>
                          Предоплата:
                        </span>
                      </div>
                      <div className="col-md-9">
                        <CustomSelect
                          modificator="prepayment"
                          btnClass="inp"
                          name="prepayment"
                          checkedOptions={[prepTypeText]}
                          options={[
                            "нет",
                            "1 месяц",
                            "2 месяца",
                            "3 месяца",
                            "4 месяца",
                            "5 месяцев",
                            "6 месяцев",
                            "7 месяцев",
                            "8 месяцев",
                            "9 месяцев",
                            "10 месяцев",
                            "11 месяцев"
                          ]}
                          callback={({ title, value }) => {
                            setData((prevData) => {
                              return {
                                ...prevData,
                                prepaymentType: value
                              };
                            });
                            setPrepTypeText(title);
                          }}
                        />
                      </div>
                    </div>
                    <div className="row mb-4">
                      <div
                        className="col-md-3 mb-3 m-md-0 fs-11 title-req"
                        style={{
                          color: valid.isInValidCommission && "#DA1E2A"
                        }}
                      >
                        Комиссия агента:
                      </div>
                      <div className="col-md-9">
                        <input
                          type="number"
                          className="percent fs-11"
                          placeholder="0-100"
                          value={data.commission || ""}
                          disabled={data.isCommission}
                          onChange={(e) => {
                            setData((prevData) => {
                              return {
                                ...prevData,
                                commission: e.target.value
                              };
                            });
                            resetFieldVal(e, "isInValidCommission");
                          }}
                        />
                        <div className="d-flex mt-2">
                          <input
                            type="checkbox"
                            name="isCommission"
                            onChange={(e) => {
                              handleCheckbox(e);
                              setData((prevData) => {
                                return {
                                  ...prevData,
                                  commission: "0"
                                };
                              });
                            }}
                          />
                          <span className="ms-2">Без комиссии</span>
                        </div>
                      </div>
                    </div>
                    <div className="row align-items-start mt-4 mt-sm-5 mb-4">
                      <div className="col-md-3 fs-11 title mb-3 m-md-0">Продавцы:</div>
                      <div className="col-md-9 d-flex flex-wrap gap-3">
                        <label>
                          <input
                            type="radio"
                            name="sellerType"
                            value={0}
                            checked={btnRadio?.sellerType === 0}
                            onClick={() =>
                              setBtnRadio((prevState) => ({
                                ...prevState,
                                sellerType: 0
                              }))
                            }
                            onChange={(e) => {
                              setData((prevData) => {
                                return {
                                  ...prevData,
                                  sellerType: e.target.value
                                };
                              });
                            }}
                          />
                          <span className="fs-11 ms-2">Собственник</span>
                        </label>
                        <label>
                          <input
                            type="radio"
                            name="sellerType"
                            value={1}
                            checked={btnRadio?.sellerType === 1}
                            onClick={() =>
                              setBtnRadio((prevState) => ({
                                ...prevState,
                                sellerType: 1
                              }))
                            }
                            onChange={(e) => {
                              setData((prevData) => {
                                return {
                                  ...prevData,
                                  sellerType: e.target.value
                                };
                              });
                            }}
                          />
                          <span className="fs-11 ms-2">Застройщики</span>
                        </label>
                        <label>
                          <input
                            type="radio"
                            name="sellerType"
                            value={2}
                            checked={btnRadio?.sellerType === 2}
                            onClick={() =>
                              setBtnRadio((prevState) => ({
                                ...prevState,
                                sellerType: 2
                              }))
                            }
                            onChange={(e) => {
                              setData((prevData) => {
                                return {
                                  ...prevData,
                                  sellerType: e.target.value
                                };
                              });
                            }}
                          />
                          <span className="fs-11 ms-2 text-nowrap">Агенства</span>
                        </label>
                        <label>
                          <input
                            type="radio"
                            name="sellerType"
                            value={3}
                            checked={btnRadio?.sellerType === 3}
                            onClick={() =>
                              setBtnRadio((prevState) => ({
                                ...prevState,
                                sellerType: 3
                              }))
                            }
                            onChange={(e) => {
                              setData((prevData) => {
                                return {
                                  ...prevData,
                                  sellerType: e.target.value
                                };
                              });
                            }}
                          />
                          <span className="fs-11 ms-2 text-nowrap">Не важно</span>
                        </label>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-3 fs-11 title-req mt-4 mt-sm-5 mb-3 m-md-0">
                        <span
                          style={{
                            color: valid?.isInValidCadastralNumber ? "#DA1E2A" : ""
                          }}
                        >
                          Кадастровый номер*:
                        </span>
                      </div>
                      <div className="col-md-9">
                        <div>
                          <label>
                            <input
                              type="text"
                              style={{
                                borderColor: valid?.isInValidCadastralNumber
                                  ? "#DA1E2A"
                                  : ""
                              }}
                              value={data?.cadastralNumber || ""}
                              onChange={(e) => {
                                setData((prevState) => ({
                                  ...prevState,
                                  cadastralNumber: e.target.value
                                    ? e.target.value
                                    : undefined
                                }));
                                resetFieldVal(e, "isInValidCadastralNumber");
                              }}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="row align-items-center mt-4 mt-sm-5 mb-4">
                      <div className="col-md-3 fs-11 title mb-3 m-md-0">
                        Условия сделки:
                        <div className="fs-08 gray-3 mt-2">
                          * В прямой продаже участвуете вы и продавец. В альтернативной
                          сделке продавец планирует покупку нового жилья одновременно с
                          продажей старого. Обычно обе сделки проходят в один день.
                        </div>
                      </div>
                      <div className="col-md-9 d-flex flex-wrap">
                        <label className="me-5">
                          <input
                            type="radio"
                            name="saleType"
                            value={0}
                            checked={btnRadio?.saleType === 0}
                            onClick={() =>
                              setBtnRadio((prevState) => ({
                                ...prevState,
                                saleType: 0
                              }))
                            }
                            onChange={(e) => {
                              setData((prevData) => ({
                                ...prevData,
                                saleType: e.target.value
                              }));
                            }}
                          />
                          <span className="fs-11 ms-2">Прямая</span>
                        </label>
                        <label className="me-5">
                          <input
                            type="radio"
                            name="saleType"
                            value={1}
                            checked={btnRadio?.saleType === 1}
                            onClick={() =>
                              setBtnRadio((prevState) => ({
                                ...prevState,
                                saleType: 1
                              }))
                            }
                            onChange={(e) => {
                              setData((prevData) => ({
                                ...prevData,
                                saleType: e.target.value
                              }));
                            }}
                          />
                          <span className="fs-11 ms-2">Альтернативная</span>
                        </label>
                        <label>
                          <input
                            type="radio"
                            name="saleType"
                            value={2}
                            checked={btnRadio?.saleType === 2}
                            onClick={() =>
                              setBtnRadio((prevState) => ({
                                ...prevState,
                                saleType: 2
                              }))
                            }
                            onChange={(e) => {
                              setData((prevData) => ({
                                ...prevData,
                                saleType: e.target.value
                              }));
                            }}
                          />
                          <span className="fs-11 ms-2 text-nowrap">Не важно</span>
                        </label>
                      </div>
                    </div>
                  </div>
                )
              }
              {/* для мобильных устроийств */}
              <div className="d-lg-none row row-cols-2 row-cols-sm-3 justify-content-center gx-2 gx-sm-4 mt-4">
                <div>
                  <button
                    type="button"
                    className="btn btn-2 w-100"
                    onClick={() =>
                      setActiveField(
                        data?.estateTypeName?.toLowerCase() === localEstates.zemelia
                          ? activeField - 2
                          : activeField - 1
                      )
                    }
                  >
                    Назад
                  </button>
                </div>
                <div>
                  <button
                    type="submit"
                    className="btn btn-1 w-100"
                    onClick={(e) => {
                      if (uuid) {
                        onSubmitUpdateAd(e);
                      } else {
                        handleSub(e);
                      }
                    }}
                  >
                    {uuid === undefined ? "Разместить объявление" : "Сохранить изменения"}
                  </button>
                </div>
              </div>
            </fieldset>

            <CustomModal
              isShow={isShow}
              setIsShow={setIsShow}
              closeButton={false}
              centre={true}
            >
              {statusRequest.good && (
                <div style={{ textAlign: "center" }}>
                  <p>Объявление создано, переход в "Мои объявления"</p>
                </div>
              )}
              {statusRequest.error && (
                <div style={{ textAlign: "center" }}>
                  <p>Произошла ошибка</p>
                </div>
              )}
            </CustomModal>

            <button
              type="submit"
              className="d-none d-lg-block btn btn-1 fs-15 mx-auto"
              onClick={(e) => {
                if (uuid) {
                  onSubmitUpdateAd(e);
                } else {
                  handleSub(e);
                }
              }}
            >
              {uuid === undefined ? "Разместить объявление" : "Сохранить изменения"}
            </button>
            <div className="d-none d-lg-block gray-3 text-center mt-3">
              Нажимая кнопку “Разместить объявление”, Вы соглашаетесь с{" "}
              <a href="/" className="color-1">
                условиями сайта
              </a>
            </div>
          </div>
          <div className="d-none d-lg-block col-lg-3 position-relative">
            <aside>
              <nav className="contents mb-4 mb-lg-5">
                <ol>
                  {advertiseSteps?.map(({ title }, index) => {
                    if (
                      data?.estateTypeName?.toLowerCase().includes(localEstates.zemelia)
                    )
                      index++;

                    return (
                      <li data-target={`anchor-${index + 1}`}>
                        <Link
                          activeClass="active"
                          to={`anchor-${index + 1}`}
                          spy={true}
                          smooth={true}
                          hashSpy={true}
                          offset={-80}
                          duration={300}
                          isDynamic={true}
                        >
                          <span>{title}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ol>
              </nav>
              <div className="faster">
                <img src="/img/img5.jpg" alt="" className="img-fluid" />
                <div className="title">Хотите найти покупателя/арендатора быстрее?</div>
                <button type="button" className="btn btn-1 px-3">
                  Узнать о преимуществах
                </button>
              </div>
            </aside>
          </div>
        </form>
      </section>
    </main>
  );
}
