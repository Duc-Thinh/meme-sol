"use client";
import { useState } from "react";
import { palette } from "./theme";

const DEFAULT_VALUES = {
  numSlices: 6,
  title: "",
  titleMaxWidth: 80,
  titleOffset: -30,
  backgroundColor: "#1f2937",
  innerRadius: 2,
  outerRadius: 150,
  cornerRadius: 0,
  padAngle: 0.05,
  allHeights: 0.5,
  environmentFile: "venice_sunset_1k.hdr",
  spotLightIntensity: 1.2,
  ambientLightIntensity: 1.6,
  roughness: 0.01,
  metalness: 0.2,
  valueLabelPosition: 0.65,
  showBloom: false,
  bloomStrength: 1,
  bloomRadius: 1.5,
  bloomThreshold: 0.15,
  spinSpeed: 0,
  showValues: true,
  valuesAsPercent: true,
};

const defaultPie = [
  { value: 0.2, label: "Public Sale 1" },
  { value: 0.2, label: "Public Sale 2" },
  { value: 0.1, label: "Airdrop" },
  { value: 0.1, label: "Ecosystem & Partners" },
  { value: 0.1, label: "Listing" },
  { value: 0.3, label: "Staking" },
];

function useInputControls() {
  // State explode cho từng slice
  const [explodeArr, setExplodeArr] = useState(Array(DEFAULT_VALUES.numSlices).fill(false));

  // Hàm set cho phép toggle explode từng slice
  const set = (update) => {
    // Nếu update là { [`explode${i}`]: true/false }
    const keys = Object.keys(update);
    if (keys.length === 1 && keys[0].startsWith("explode")) {
      const idx = parseInt(keys[0].replace("explode", ""), 10);
      setExplodeArr((prev) => {
        const next = prev.slice();
        next[idx] = update[keys[0]];
        return next;
      });
    }
  };

  const controlValues = {
    ...DEFAULT_VALUES,
  };
  for (let i = 0; i < controlValues.numSlices; ++i) {
    controlValues[`value${i}`] = defaultPie[i]?.value ?? 0.1;
    controlValues[`label${i}`] = defaultPie[i]?.label ?? "";
    controlValues[`color${i}`] = palette[i % palette.length];
    controlValues[`explode${i}`] = explodeArr[i];
    controlValues[`height${i}`] = controlValues.allHeights;
    controlValues[`offset${i}`] = 0;
  }

  return [controlValues, set];
}

export default useInputControls;

export function pieDataFromControls(controlValues) {
  const data = [];
  for (let i = 0; i < controlValues.numSlices; ++i) {
    data.push({
      value: +controlValues[`value${i}`],
      color: controlValues[`color${i}`],
      label: controlValues[`label${i}`],
      explode: controlValues[`explode${i}`],
      height: +controlValues[`height${i}`],
      offset: +controlValues[`offset${i}`],
    });
  }
  return data;
}