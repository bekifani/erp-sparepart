// import Chart, { ChartElement } from "@/components/Base/Chart";
// import { ChartData, ChartOptions } from "chart.js/auto";
// import { selectColorScheme } from "@/stores/colorSchemeSlice";
// import { selectDarkMode } from "@/stores/darkModeSlice";
// import { useAppSelector } from "@/stores/hooks";
// import { useMemo, useRef } from "react";
// import { getColor } from "@/utils/colors";
// import _ from "lodash";

// interface MainProps extends React.ComponentPropsWithoutRef<"canvas"> {
//   width?: number | "auto";
//   height?: number | "auto";
//   data?: Array<Number> | "auto";
//   labels?: Array<Number> ;
// }

// function Main({ width = "auto", height = "auto", className = "", labels = [], data = [] }: MainProps) {
//   const props = {
//     width: width,
//     height: height,
//     className: className,
//   };
//   const reportLineChartRef = useRef<ChartElement | null>();
//   const colorScheme = useAppSelector(selectColorScheme);
//   const darkMode = useAppSelector(selectDarkMode);

//   const getBackground = () => {
//     const canvas = document.createElement("canvas");
//     const ctx = canvas.getContext("2d");
//     const gradient = ctx?.createLinearGradient(0, 0, 0, 210);
//     gradient?.addColorStop(0, getColor("primary", 0.3));
//     gradient?.addColorStop(1, darkMode ? "#28344e00" : "#ffffff01");
//     return gradient;
//   };

//   const myChartData: ChartData = useMemo(() => {
//     return {
//       labels: labels,
//       datasets: [
//         {
//           data: data[0],
//           borderWidth: 1.3,
//           borderColor: colorScheme ? getColor("primary", 0.7) : "",
//           pointRadius: 0,
//           tension: 0.3,
//           backgroundColor: getBackground(),
//           fill: true,
//         },
//         {
//           data: data[1],
//           borderWidth: 1.2,
//           borderColor: colorScheme ? getColor("slate.500", 0.5) : "",
//           pointRadius: 0,
//           tension: 0.3,
//           borderDash: [3, 2],
//           backgroundColor: "transparent",
//           fill: true,
//         },
//       ],
//     };
//   }, [reportLineChartRef.current, colorScheme, darkMode]);

//   const options: ChartOptions = useMemo(() => {
//     return {
//       maintainAspectRatio: false,
//       plugins: {
//         legend: {
//           display: false,
//         },
//       },
//       scales: {
//         x: {
//           ticks: {
//             autoSkipPadding: 15,
//             color: getColor("slate.400", 0.8),
//           },
//           grid: {
//             display: false,
//           },
//           border: {
//             display: false,
//           },
//         },
//         y: {
//           ticks: {
//             autoSkipPadding: 20,
//             color: getColor("slate.400", 0.8),
//           },
//           grid: {
//             color: darkMode
//               ? getColor("slate.400", 0.1)
//               : getColor("slate.200", 0.7),
//           },
//           border: {
//             display: false,
//           },
//         },
//       },
//     };
//   }, [reportLineChartRef.current, colorScheme, darkMode]);

//   return (
//     <>
//       <Chart
//         type="line"
//         width={props.width}
//         height={props.height}
//         data={myChartData}
//         options={options}
//         className={props.className}
//         getRef={(el) => {
//           reportLineChartRef.current = el;
//         }}
//       />
//     </>
//   );
// }

// export default Main;
import React from 'react'

const index = () => {
  return (
    <div>index</div>
  )
}

export default index
