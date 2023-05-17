import React from "react";
import { localEstates } from "../../helpers/localEstates";

const AdTypeResidential = ({ estateTypeName, onChange, info, seterRadio }) => {
  return (
    <>
      {estateTypeName?.toLowerCase().includes(localEstates.kvartiri) && (
        <>
          <hr className="d-none d-md-block my-4" />
          <div className="row">
            <div className="col-md-3 fs-11 title-req mt-4 mt-sm-5 mb-3 m-md-0">
              <span data-for="rental-type" data-status={false}>
                Тип объекта:
              </span>
            </div>
            <div className="col-md-9">
              <div className="row row-cols-2 row-cols-sm-3 row-cols-xxl-4 gy-3">
                <div>
                  <label>
                    <input
                      type="radio"
                      name="estateType"
                      value={0}
                      checked={info?.estateType === 0}
                      onClick={(e) => seterRadio(e)}
                      onChange={(e) => onChange(e)}
                    />
                    <span className="fs-11 ms-2">Новостройка</span>
                  </label>
                </div>
                <div>
                  <label>
                    <input
                      type="radio"
                      name="estateType"
                      value={1}
                      checked={info?.estateType === 1}
                      onClick={(e) => seterRadio(e)}
                      onChange={(e) => onChange(e)}
                    />
                    <span className="fs-11 ms-2">Вторичка</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      {estateTypeName?.toLowerCase().includes(localEstates.dom) && (
        <>
          <hr className="d-none d-md-block my-4" />
          <div className="row">
            <div className="col-md-3 fs-11 title-req mt-4 mt-sm-5 mb-3 m-md-0">
              <span data-for="rental-type" data-status={false}>
                Площадь, соток*:
              </span>
            </div>
            <div className="col-md-9">
              <div>
                <label>
                  <input
                    type="number"
                    name="landArea"
                    placeholder="0"
                    className="area landArea fs-11"
                    value={info?.landArea || ""}
                    onChange={(e) => onChange(e)}
                  />
                </label>
              </div>
            </div>
          </div>
          <hr className="d-none d-md-block my-4" />
          <div className="row">
            <div className="col-md-3 fs-11 title-req mt-4 mt-sm-5 mb-3 m-md-0">
              <span data-for="rental-type" data-status={false}>
                Тип участка:
              </span>
            </div>
            <div className="col-md-9">
              <div className="row row-cols-2 row-cols-sm-3 row-cols-xxl-4 gy-3">
                <div>
                  <label>
                    <input
                      type="radio"
                      name="areaType"
                      value={0}
                      checked={info?.areaType === 0}
                      onClick={(e) => seterRadio(e)}
                      onChange={(e) => onChange(e)}
                    />
                    <span className="fs-11 ms-2">СНТ</span>
                  </label>
                </div>
                <div>
                  <label>
                    <input
                      type="radio"
                      name="areaType"
                      value={1}
                      checked={info?.areaType === 1}
                      onClick={(e) => seterRadio(e)}
                      onChange={(e) => onChange(e)}
                    />
                    <span className="fs-11 ms-2">ИЖС</span>
                  </label>
                </div>
                <div>
                  <label>
                    <input
                      type="radio"
                      name="areaType"
                      value={2}
                      checked={info?.areaType === 2}
                      onClick={(e) => seterRadio(e)}
                      onChange={(e) => onChange(e)}
                    />
                    <span className="fs-11 ms-2">ЛПХ</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default AdTypeResidential;
