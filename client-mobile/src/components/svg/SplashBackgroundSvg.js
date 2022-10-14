import { View, Text } from "react-native";
import React from "react";
import Svg, { Path, Rect } from "react-native-svg";

export default function SplashBackgroundSvg({
  scale = 1,
  width = 1415,
  height = 1980,
}) {
  return (
    <Svg
      width={width * scale}
      height={height * scale}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Rect width="1415" height="1980" fill="white" />
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M0 1647.48L78.7478 1592.9C157.222 1537.24 314.444 1425.92 471.667 1481.58C628.889 1537.24 786.111 1758.8 943.333 1647.48C1100.56 1537.24 1257.78 1094.12 1336.53 872.56L1415 651V1980.36H1336.53C1257.78 1980.36 1100.56 1980.36 943.333 1980.36C786.111 1980.36 628.889 1980.36 471.667 1980.36C314.444 1980.36 157.222 1980.36 78.7478 1980.36H0V1647.48Z"
        fill="#E4D9ED"
      />
    </Svg>
  );
}
