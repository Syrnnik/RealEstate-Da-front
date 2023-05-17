import React from "react";

const AboutCommercial = ({
  onChange,
  activeField,
  seterActiveField,
  isValid,
  valid,
  resetValid,
  info,
  seterRadio
}) => {
  return (
    <fieldset
      data-show={activeField === 2 ? "true" : "false"}
      name="anchor-2"
      className="element frame p-lg-4 mb-4 mb-lg-5"
    >
      <legend className="text-center text-lg-start title-font fw-7 fs-15 mb-md-4">
        Об объекте
      </legend>
      <div className="row row-cols-2 row-cols-md-4 align-items-center mt-4 mt-sm-5">
        <div className="fs-11 title-req">
          <span
            data-for="total-area"
            data-status={false}
            style={{ color: valid.isInValidTotalArea ? "#DA1E2A" : "" }}
          >
            Общая площадь*:
          </span>
        </div>
        <div>
          <input
            type="number"
            name="totalArea"
            value={info?.totalArea || ""}
            placeholder="0"
            style={{ borderColor: valid.isInValidTotalArea ? "#DA1E2A" : "" }}
            className="fs-11 area w-100"
            onChange={(e) => {
              onChange(e);
              resetValid(e, "isInValidTotalArea");
            }}
          />
        </div>
      </div>
      <hr className="d-none d-md-block my-4" />
      <div className="row">
        <div className="col-md-3 fs-11 title-req mt-4 mt-sm-5 mb-3 m-md-0">
          <span
            data-for="housing-type"
            data-status={false}
            style={{ color: valid.isInValidBuildingType ? "#DA1E2A" : "" }}
          >
            Тип здания*:
          </span>
        </div>
        <div className="col-md-9">
          <div className="d-flex flex-wrap align-items-stretch flex-column">
            <div>
              <label>
                <input
                  type="radio"
                  name="buildingType"
                  value={0}
                  onClick={(e) => seterRadio(e)}
                  checked={info?.buildingType === 0}
                  onChange={(e) => {
                    onChange(e);
                    resetValid(e, "isInValidBuildingType");
                  }}
                />
                <span className="fs-11 ms-2">Бизнес-центр</span>
              </label>
            </div>
            <div>
              <label>
                <input
                  type="radio"
                  name="buildingType"
                  value={1}
                  onClick={(e) => seterRadio(e)}
                  checked={info?.buildingType === 1}
                  onChange={(e) => {
                    onChange(e);
                    resetValid(e, "isInValidBuildingType");
                  }}
                />
                <span className="fs-11 ms-2">Торговый центр</span>
              </label>
            </div>
            <div>
              <label>
                <input
                  type="radio"
                  name="buildingType"
                  value={2}
                  onClick={(e) => seterRadio(e)}
                  checked={info?.buildingType === 2}
                  onChange={(e) => {
                    onChange(e);
                    resetValid(e, "isInValidBuildingType");
                  }}
                />
                <span className="fs-11 ms-2">Административное здание</span>
              </label>
            </div>
            <div>
              <label>
                <input
                  type="radio"
                  name="buildingType"
                  value={3}
                  onClick={(e) => seterRadio(e)}
                  checked={info?.buildingType === 3}
                  onChange={(e) => {
                    onChange(e);
                    resetValid(e, "isInValidBuildingType");
                  }}
                />
                <span className="fs-11 ms-2">Жилой дом</span>
              </label>
            </div>
            <div>
              <label>
                <input
                  type="radio"
                  name="buildingType"
                  value={4}
                  onClick={(e) => seterRadio(e)}
                  checked={info?.buildingType === 4}
                  onChange={(e) => {
                    onChange(e);
                    resetValid(e, "isInValidBuildingType");
                  }}
                />
                <span className="fs-11 ms-2">Другое</span>
              </label>
            </div>
          </div>
        </div>
      </div>
      {/* для мобильных устроийств */}
      <div className="d-lg-none row row-cols-2 row-cols-md-3 gx-2 gx-sm-4 justify-content-center mt-4 mt-sm-5">
        <div>
          <button
            type="button"
            className="btn btn-2 w-100"
            onClick={() => seterActiveField(1)}
          >
            Назад
          </button>
        </div>
        <div>
          <button
            type="button"
            className="btn btn-1 w-100"
            onClick={() => {
              if (isValid(activeField)) seterActiveField(3);
            }}
          >
            Далее
          </button>
        </div>
      </div>
    </fieldset>
  );
};

export default AboutCommercial;
