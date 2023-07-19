import React, { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import Rating from "react-rating";
import { Link } from "react-router-dom";
import { getServiceType, getSubServicesTypes } from "../API/services";
import { checkPhotoPath } from "../helpers/photo";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import ShowPhone from "./ShowPhone";

function UserCard(props) {
  const axiosPrivate = useAxiosPrivate();
  const [serviceType, setServiceType] = useState({});
  const [subServicesTypes, setSubServicesTypes] = useState([]);

  const setSendMessagePayloads = () => {
    if (props?.setSendMessagePayloads && props?.serviceId && props?.userId) {
      props.setSendMessagePayloads((prev) => ({
        ...prev,
        serviceId: props?.serviceId,
        userId: props?.userId,
      }));
    }
  };

  useEffect(() => {
    getServiceType(axiosPrivate, props.serviceTypeId).then((serviceTypes) => {
      setServiceType(serviceTypes);
    });
  }, []);

  useEffect(() => {
    getSubServicesTypes(axiosPrivate, props.serviceTypeId).then(
      (servicesTypes) => {
        setSubServicesTypes(
          servicesTypes?.filter((type) =>
            props.subServices?.find(
              (subService) => type?.id === subService?.serviceTypeSubServiceId
            )
          )
        );
      }
    );
  }, []);

  return (
    <>
      {isMobile ? (
        <div className="user-card">
          <div className="title">
            <div className="d-xxl-flex">
              <div className="photo small">
                <Link to={props.link}>
                  <img src={checkPhotoPath(props.photo)} alt={props.userName} />
                </Link>
              </div>
              <div className="rating mb-2 mb-xl-2 ms-xxl-4">
                <Rating
                  readonly={true}
                  initialRating={props?.rating}
                  fractions={2}
                  emptySymbol={<img src="/img/icons/star-gray.svg" alt="1" />}
                  fullSymbol={<img src="/img/icons/star-blue.svg" alt="1" />}
                />
              </div>
              <h5 className="text-center fw-bold mb-2 mb-xl-2 mb-xxl-0">
                <Link to={props.link}>{serviceType?.name}</Link>
              </h5>
              <h5 className="text-center fw-bold color-1 mb-1 mb-xl-2 mb-xxl-0">
                <Link to={props.link}>{props.userName}</Link>
              </h5>
            </div>
          </div>
          <div className="serv-list mt-2 mt-md-3 mt-xxl-0">
            {props?.labels?.map((i) => (
              <div className="serv" key={i.id}>
                {i.name}
              </div>
            ))}
          </div>
          <div className="btns mt-2 mt-md-3 mt-xxl-0">
            <ShowPhone phone={props.phone} />
            {props?.isShowMessage && (
              <button
                type="button"
                className="d-xxl-block btn btn-1 w-100 px-1 mt-2"
                onClick={() => setSendMessagePayloads()}
              >
                Написать сообщение
              </button>
            )}
            {props.inAddResponse && (
              <Link
                to={`/personal-account/responses/add/${props.userId}`}
                className="btn btn-2 w-100 px-1 mt-2 mt-xxl-0"
                state={{
                  labels: props.labels,
                  exp: props.exp,
                  subServices: props.subServices,
                  phone: props.phone,
                  description: props.description,
                  serviceId: props.serviceId,
                  prevUrl: props.prevUrl,
                }}
              >
                Откликнуться
              </Link>
            )}
          </div>
        </div>
      ) : (
        <div className="user-card d-flex flex-column align-items-center">
          <div className="title">
            <div className="">
              <h4 className="text-center color-1 mb-1 mb-xl-2 mb-xxl-0">
                <Link to={props.link}>{props.userName}</Link>
              </h4>
              <div className="d-flex align-items-center rating mb-1 mb-xl-2 mt-xxl-2">
                <Rating
                  readonly={true}
                  initialRating={props?.rating}
                  fractions={2}
                  emptySymbol={<img src="/img/icons/star-gray.svg" alt="1" />}
                  fullSymbol={<img src="/img/icons/star-blue.svg" alt="1" />}
                />
                <span className="ms-2">({props.rating})</span>
              </div>
            </div>
          </div>
          <div className="photo mt-2 mt-md-3 mt-xxl-0">
            <Link to={props.link}>
              <img src={checkPhotoPath(props.photo)} alt={props.userName} />
            </Link>
          </div>
          <div className="desc fs-11 mt-2 mt-md-3 mt-xxl-0">
            <div className="text">
              <p>{props.description}</p>
            </div>
          </div>
          <div className="serv-list mt-2 mt-md-3 mt-xxl-0">
            {subServicesTypes?.map((i) => (
              <div className="serv" key={i.id}>
                {i.name}
              </div>
            ))}
          </div>
          <div className="w-100 btns mt-2 mt-md-3 mt-xxl-2 g-4">
            <ShowPhone phone={props.phone} className="fs-11" />
            {props?.isShowMessage && (
              <button
                type="button"
                className="d-xxl-block btn btn-1 fs-11 w-100 px-1 mt-2"
                onClick={() => setSendMessagePayloads()}
              >
                Написать сообщение
              </button>
            )}
            {props.inAddResponse && (
              <Link
                to={`/personal-account/responses/add/${props.userId}`}
                className="btn btn-2 w-100 fs-11 px-1 mt-2"
                state={{
                  labels: props.labels,
                  exp: props.exp,
                  subServices: props.subServices,
                  phone: props.phone,
                  description: props.description,
                  serviceId: props.serviceId,
                  prevUrl: props.prevUrl,
                }}
              >
                Откликнуться
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default UserCard;
