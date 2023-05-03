import React, { useEffect, useState } from "react";
import useCustomSelect from "../hooks/useCustomSelect";

const MultiCheckboxSelect = ({
  mode = "titles",
  options = [],
  checkedOptions = [],
  btnClass,
  className,
  title,
  isShow,
  modificator,
  callback,
  align
}) => {
  const [dropdownItems, setDropdownItems] = useState([]);
  const [checkedCount, setCheckedCount] = useState(checkedOptions.length);
  const { isShowDropdown, toggleDropdown, ref } = useCustomSelect(isShow);

  const onSelectItem = (title, value) => {
    callback && callback({ title, value });
  };

  useEffect(() => {
    setDropdownItems(
      options.map((option) => ({
        ...option,
        isChecked:
          checkedOptions.length &&
          checkedOptions?.find(
            (checkedOption) =>
              checkedOption.value === option.value || checkedOption === option.value
          )
      }))
    );
  }, [options, checkedOptions]);

  useEffect(() => {
    setCheckedCount(checkedOptions.length);
  }, [checkedOptions]);

  return (
    <div
      className={`custom-select ${modificator ? "custom-select_" + modificator : ""} ${
        className ?? ""
      } ${isShowDropdown ? "show" : ""}`}
      ref={ref}
    >
      <button
        type="button"
        className={`custom-select__toggle ${
          modificator ? "custom-select__toggle_" + modificator : ""
        } ${btnClass ? btnClass : ""}`}
        onClick={() => toggleDropdown()}
      >
        <div>
          {(checkedCount && `Выбрано: ${checkedCount}`) || title || "Выберите значение"}
        </div>
        <svg className="ms-2" viewBox="0 0 23 12" xmlns="http://www.w3.org/2000/svg">
          <line x1="21.6832" y1="0.730271" x2="10.7468" y2="10.961" />
          <line
            y1="-1"
            x2="14.9757"
            y2="-1"
            transform="matrix(0.730271 0.683157 0.683157 -0.730271 2 0)"
          />
        </svg>
      </button>
      <div
        className={`dropdown-list ${
          modificator ? "dropdown-list_" + modificator : ""
        } options`}
        data-alignment={align}
      >
        <div className="dropdown-list__inner px-3 py-1 g-2">
          {dropdownItems?.length ? (
            dropdownItems.map((item) => (
              <label className="my-2 checkbox-line" key={item.value}>
                <input
                  type="checkbox"
                  onChange={() => onSelectItem(item.title, item.value)}
                  checked={item.isChecked}
                />
                <span className="fs-11 ms-2">{item.title}</span>
              </label>
            ))
          ) : (
            <div className="p-2">Нет доступных значений</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MultiCheckboxSelect;
