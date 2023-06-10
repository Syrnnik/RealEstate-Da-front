import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { getServiceType, getSubServicesTypes } from "../API/services";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const ServiceCard = (props) => {
  const axiosPrivate = useAxiosPrivate();
  const [serviceType, setServiceType] = useState({});
  const [subServices, setSubServices] = useState([]);

  useEffect(() => {
    getServiceType(axiosPrivate, props.serviceTypeId).then((serviceType) =>
      setServiceType(serviceType)
    );
  }, []);

  useEffect(() => {
    getSubServicesTypes(axiosPrivate, props.serviceTypeId).then(
      (servicesTypes) => {
        setSubServices(
          servicesTypes?.filter((type) =>
            props.subServices?.find(
              (subService) => type?.id === subService?.serviceTypeSubServiceId
            )
          )
        );
      }
    );
  }, []);

  const imgsUrl = `${process.env.REACT_APP_PHOTO_URL}/uploads`;

  return (
    <div className="service-card">
      <div className="title mb-3">
        <h4 className="w-100 fs-18 text-center mb-1 mb-xl-2 mb-xxl-0">
          {serviceType?.name}
        </h4>
      </div>

      {/* <div className="serv-list my-2 mt-md-3 mt-xxl-0">
        {props.labels.map((label) => (
          <div className="serv" key={label.id}>
            {label.name}
          </div>
        ))}
      </div> */}

      <h4 className="mb-3">Подуслуги:</h4>
      <div className="serv-list ms-4 my-2 mt-md-3 mt-xxl-0 mb-5">
        {subServices?.map((subService) => (
          <div className="serv" key={subService.id}>
            {subService.name}
          </div>
        ))}
      </div>

      <h4 className="mb-3">О себе:</h4>
      <div className="d-flex desc ms-4 my-2 mt-2 mb-1 mt-md-3 mb-5 mt-xxl-0">
        <div className="d-flex text rounded px-4 py-3">
          <span>{props.description}</span>
        </div>
      </div>

      <h4 className="mb-3">Примеры:</h4>
      <div className="d-flex photo ms-4 my-2 mt-md-3 mt-xxl-0 gap-4 flex-wrap">
        {props.images.map((serviceImage) => (
          <img className="rounded-0" src={`${imgsUrl}/${serviceImage.image}`} />
        ))}
      </div>
      <div className="row justify-content-end mt-5">
        <div className="col-sm-8">
          <div className="row row-cols-2 align-items-center g-2 g-sm-4">
            <div>
              <button
                type="button"
                className="w-100 fs-12 color-1 d-flex align-items-center"
              >
                <svg
                  width="11"
                  height="14"
                  viewBox="0 0 11 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0.785714 12.4444C0.785714 13.3 1.49286 14 2.35714 14H8.64286C9.50714 14 10.2143 13.3 10.2143 12.4444V3.11111H0.785714V12.4444ZM11 0.777778H8.25L7.46429 0H3.53571L2.75 0.777778H0V2.33333H11V0.777778Z"
                    fill="#146492"
                  />
                </svg>
                <span
                  className="ms-1 ms-sm-2"
                  onClick={() => {
                    props.callback && props.callback(props.id);
                  }}
                >
                  Удалить услугу
                </span>
              </button>
            </div>
            <div>
              <NavLink
                to={`create/${props.id}`}
                className="btn btn-1 fs-12 w-100"
              >
                Редактировать
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
