import PropTypes from "prop-types";
import React from "react";
import ReactDOM from "react-dom";
import { useState } from "react";

import "./index.css";

import {
  getGradientColorHex,
  getHourLabel,
  chooseColor,
  getDayOfWeek,
  generateFrequencyArray,
} from "./utils";

window.onload = function () {
  fetch("/data.json")
    .then((response) => response.json())
    .then((data) => {
      const app = React.createElement(HeatMapContainer, { data });
      const root = document.getElementById("root");
      ReactDOM.render(app, root);
    });
};

function HeatMapContainer({ data }) {
  const [isChecked, setChecked] = useState(false);
  const handleCheckboxChange = () => {
    setChecked((isChecked) => !isChecked);
  };

  const [selectedValue, setSelectedValue] = useState(12);

  const handleDropdownChange = (event) => {
    const newValue = Number(event.target.value);
    setSelectedValue(newValue);
  };

  const subtitle = `Found ${data.length.toLocaleString("en-US")} items!`;
  return (
    <>
      <div>
        <h1>Supercreator HeatMapExercise</h1>
        <h2>{subtitle}</h2>
      </div>
      <div>
        <HeatmapChart
          dates={data}
          segmentsPerDay={selectedValue}
          isInfinity={isChecked}
        ></HeatmapChart>
      </div>
      <div style={{ marginTop: "40px" }}>
        <label>
          <input
            type="checkbox"
            checked={isChecked}
            onChange={handleCheckboxChange}
          />
          {isChecked ? "Infinite Heat Levels" : "5 Heat Levels"}
        </label>
      </div>
      <div>
        <div>
          <label>
            Choose amount of buckets:
            <select value={selectedValue} onChange={handleDropdownChange}>
              <option value={3}>3</option>
              <option value={4}>4</option>
              <option value={6}>6</option>
              <option value={8}>8</option>
              <option value={12}>12</option>
              <option value={24}>24</option>
            </select>
          </label>
        </div>
      </div>
    </>
  );
}

HeatMapContainer.propTypes = {
  data: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
};

export default HeatMapContainer;

const ColorfulDot = ({ number, maxNumber, isInfinity }) => {
  const color = isInfinity
    ? getGradientColorHex(number, maxNumber)
    : chooseColor(number, maxNumber);

  const dotStyle = {
    width: "12px",
    height: "12px",
    borderRadius: "50%",
    backgroundColor: color,
    display: "inline-block",
  };

  return <div style={dotStyle}></div>;
};

const HeatmapChart = ({ dates, segmentsPerDay, isInfinity }) => {
  const { maxValue, result } = generateFrequencyArray(dates, segmentsPerDay);

  const rows = result.map((day, dayIndex) => (
    <tr key={dayIndex}>
      <td>{getDayOfWeek(dayIndex)}</td>
      {day.map((value, segmentIndex) => (
        <td key={segmentIndex} style={{ textAlign: "center" }}>
          <ColorfulDot
            number={value}
            maxNumber={maxValue}
            isInfinity={isInfinity}
          ></ColorfulDot>
        </td>
      ))}
    </tr>
  ));

  const headerRow = (
    <tr>
      <th style={{ textAlign: "center" }}></th>
      {Array.from({ length: segmentsPerDay }, (_, index) => (
        <th key={index} style={{ textAlign: "center", width: "90px" }}>
          {getHourLabel(index, segmentsPerDay)}
        </th>
      ))}
    </tr>
  );

  return (
    <table>
      <thead>{headerRow}</thead>
      <tbody>{rows}</tbody>
    </table>
  );
};
