import React from "react";

const ForSteadAd = (props) => {
  return (
    <div className="column-2">
      {props?.acres !== null && (
        <div className="specification fs-11">
          <div className="left">
            <span>Площадь, соток: </span>
          </div>
          <div className="right">
            <span>{props?.acres} a</span>
          </div>
        </div>
      )}
      {props?.cityDistance !== null && (
        <div className="specification fs-11">
          <div className="left">
            <span>Расстояние до города: </span>
          </div>
          <div className="right">
            <span>{props?.cityDistance} км</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForSteadAd;
