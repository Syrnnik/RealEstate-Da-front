import React from "react";

const ForCommercialAd = (props) => {
  return (
    <div className="column-2">
      {props?.totalArea && (
        <div className="specification fs-11">
          <div className="left">
            <span>Общая площадь: </span>
          </div>
          <div className="right">
            <span>
              {props?.totalArea} м<sup>2</sup>
            </span>
          </div>
        </div>
      )}
      {props?.buildingType && (
        <div className="specification fs-11">
          <div className="left">
            <span>Тип здания: </span>
          </div>
          <div className="right">
            <span>{props?.buildingType}</span>
          </div>
        </div>
      )}
      {props?.directionTypeForUser && (
        <div className="specification fs-11">
          <div className="left">
            <span>Направление: </span>
          </div>
          <div className="right">
            <span>{props?.directionTypeForUser}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForCommercialAd;
