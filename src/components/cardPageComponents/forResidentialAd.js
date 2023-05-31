import React from "react";

const forResidentialAd = (props) => {
  return (
    <div className="column-2">
      {props?.rooms !== null && (
        <div className="specification fs-11">
          <div className="left">
            <span>Комнат: </span>
          </div>
          <div className="right">
            <span>{props?.rooms}</span>
          </div>
        </div>
      )}
      {props?.totalArea !== null && (
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
      {props?.acres !== null && (
        <div className="specification fs-11">
          <div className="left">
            <span>Площадь, соток: </span>
          </div>
          <div className="right">
            <span>{props?.acres} соток</span>
          </div>
        </div>
      )}
      {(props?.livingArea !== null || props?.livingAreaForUser !== null) && (
        <div className="specification fs-11">
          <div className="left">
            <span>Жилая площадь: </span>
          </div>
          {props?.livingArea !== null ? (
            <div className="right">
              <span>
                {props?.livingArea} м<sup>2</sup>
              </span>
            </div>
          ) : (
            <div className="right">
              <span>{props?.livingAreaForUser}</span>
            </div>
          )}
        </div>
      )}
      {(props?.kitchenArea !== null || props?.kitchenAreaForUser !== null) && (
        <div className="specification fs-11">
          <div className="left">
            <span>Площадь кухни: </span>
          </div>
          {props?.kitchenArea !== null ? (
            <div className="right">
              <span>
                {props?.kitchenArea} м<sup>2</sup>
              </span>
            </div>
          ) : (
            <div className="right">
              <span>{props?.kitchenAreaForUser}</span>
            </div>
          )}
        </div>
      )}
      {props?.floor !== null && (
        <div className="specification fs-11">
          <div className="left">
            <span>Этаж: </span>
          </div>
          <div className="right">
            <span>
              {props?.floor}/{props?.maxFloorForUser}
            </span>
          </div>
        </div>
      )}
      {props?.layoutForUser !== null && (
        <div className="specification fs-11">
          <div className="left">
            <span>Планировка: </span>
          </div>
          <div className="right">
            <span>{props?.layoutForUser}</span>
          </div>
        </div>
      )}
      {props?.repairTypeForUser !== null && (
        <div className="specification fs-11">
          <div className="left">
            <span>Ремонт: </span>
          </div>
          <div className="right">
            <span>{props?.repairTypeForUser}</span>
          </div>
        </div>
      )}
      {props?.WCTypeForUser !== null && (
        <div className="specification fs-11">
          <div className="left">
            <span>Санузел: </span>
          </div>
          <div className="right">
            <span>{props?.WCTypeForUser}</span>
          </div>
        </div>
      )}
      {props?.balconyTypeForUser !== null && (
        <div className="specification fs-11">
          <div className="left">
            <span>Балкон/Лоджия: </span>
          </div>
          <div className="right">
            <span>{props?.balconyTypeForUser}</span>
          </div>
        </div>
      )}
      {props?.window !== null && (
        <div className="specification fs-11">
          <div className="left">
            <span>Окно: </span>
          </div>
          <div className="right">
            <span>{props?.window}</span>
          </div>
        </div>
      )}
      {props?.windowType !== null && (
        <div className="specification fs-11">
          <div className="left">
            <span>Тип окна: </span>
          </div>
          <div className="right">
            <span>{props?.windowType}</span>
          </div>
        </div>
      )}
      {props?.windRoseDirectionType !== null && (
        <div className="specification fs-11">
          <div className="left">
            <span>Направление по розе ветров: </span>
          </div>
          <div className="right">
            <span>{props?.windRoseDirectionType}</span>
          </div>
        </div>
      )}
      {(props?.estateName?.toLowerCase().includes("квартира") ||
        props?.estateType?.toLowerCase().includes("дом") ||
        props?.estateType?.toLowerCase().includes("дача") ||
        props?.estateType?.toLowerCase().includes("коттедж")) &&
        props?.estateTypeForUser !== null && (
          <div className="specification fs-11">
            <div className="left">
              <span>Тип объекта: </span>
            </div>
            <div className="right">
              <span>{props?.estateTypeForUser}</span>
            </div>
          </div>
        )}
      {(props?.estateType?.toLowerCase().includes("дом") ||
        props?.estateType?.toLowerCase().includes("дача") ||
        props?.estateType?.toLowerCase()?.includes("коттедж")) && (
        <>
          {props?.outBuildingType !== null && (
            <div className="specification fs-11">
              <div className="left">
                <span>Хозпостройки: </span>
              </div>
              <div className="right">
                <span>{props?.outBuildingType}</span>
              </div>
            </div>
          )}
          {props?.hasBasement !== null && (
            <div className="specification fs-11">
              <div className="left">
                <span>Подвал: </span>
              </div>
              <div className="right">
                <span>{props?.hasBasement ? "есть" : "нет"}</span>
              </div>
            </div>
          )}
          {props?.landArea !== null && (
            <div className="specification fs-11">
              <div className="left">
                <span>Площадь, соток: </span>
              </div>
              <div className="right">
                <span>{props?.landArea}</span>
              </div>
            </div>
          )}
          {props?.areaTypeForUser !== null && (
            <div className="specification fs-11">
              <div className="left">
                <span>Тип участка: </span>
              </div>
              <div className="right">
                <span>{props?.areaTypeForUser}</span>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default forResidentialAd;
