import Chart from "@/components/Base/Chart";
import { selectColorScheme } from "@/stores/colorSchemeSlice";
import { selectDarkMode } from "@/stores/darkModeSlice";
import { useAppSelector } from "@/stores/hooks";
import { useMemo, useRef } from "react";
import { getColor } from "@/utils/colors";
import _ from "lodash";


function Main({ width = "auto", height = "auto", className = "", labels = [], data = [] }) {
  const props = {
    width: width,
    height: height,
    className: className,
  };
  const reportLineChartRef = useRef();
  const colorScheme = useAppSelector(selectColorScheme);
  const darkMode = useAppSelector(selectDarkMode);

  const getBackground = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const gradient = ctx?.createLinearGradient(0, 0, 0, 210);
    gradient?.addColorStop(0, getColor("primary", 0.3));
    gradient?.addColorStop(1, darkMode ? "#28344e00" : "#ffffff01");
    return gradient;
  };

  const myChartData = useMemo(() => {
    return {
      labels: labels,
      datasets: [
        {
          data: data,
          borderWidth: 1.3,
          borderColor: colorScheme ? getColor("primary", 0.7) : "",
          pointRadius: 0,
          tension: 0.3,
          backgroundColor: getBackground(),
          fill: true,
        },
      ],
    };
  }, [reportLineChartRef.current, colorScheme, darkMode]);

  const options = useMemo(() => {
    return {
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        x: {
          ticks: {
            autoSkipPadding: 15,
            color: getColor("slate.400", 0.8),
          },
          grid: {
            display: false,
          },
          border: {
            display: false,
          },
        },
        y: {
          ticks: {
            autoSkipPadding: 20,
            color: getColor("slate.400", 0.8),
          },
          grid: {
            color: darkMode
              ? getColor("slate.400", 0.1)
              : getColor("slate.200", 0.7),
          },
          border: {
            display: false,
          },
        },
      },
    };
  }, [reportLineChartRef.current, colorScheme, darkMode]);

  return (
    <>
      <Chart
        type="line"
        width={props.width}
        height={props.height}
        data={myChartData}
        options={options}
        className={props.className}
        getRef={(el) => {
          reportLineChartRef.current = el;
        }}
      />
    </>
  );
}

export default Main;
