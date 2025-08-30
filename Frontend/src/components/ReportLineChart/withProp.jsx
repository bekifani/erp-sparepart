import Chart from "@/components/Base/Chart";
import { selectColorScheme } from "@/stores/colorSchemeSlice";
import { selectDarkMode } from "@/stores/darkModeSlice";
import { useAppSelector } from "@/stores/hooks";
import { useRef } from "react";
import { getColor } from "@/utils/colors";

function Main({
  width = "auto",
  height = "auto",
  className = "",
  index = 0,
  backgroundColor = "",
  borderColor = "",
  chartData = [],
  labels = []
}) {
  const reportLineChartRef = useRef();
  const colorScheme = useAppSelector(selectColorScheme);
  const darkMode = useAppSelector(selectDarkMode);

  const getBackground = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const gradient = ctx?.createLinearGradient(0, 0, 0, 100);
    gradient?.addColorStop(0, backgroundColor);
    gradient?.addColorStop(1, darkMode ? "#28344e00" : "#ffffff01");
    return gradient;
  };

  const getSecondaryBackground = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const gradient = ctx?.createLinearGradient(0, 0, 0, 100);
    gradient?.addColorStop(0, darkMode ? "#28344e00" : getColor("slate.50"));
    gradient?.addColorStop(1, darkMode ? "#28344e00" : "#ffffff01");
    return gradient;
  };

  const data = {
    labels: labels, // Dynamic labels
    datasets: [
      {
        data: chartData, // Dynamic chart data
        borderWidth: 1.1,
        borderColor: colorScheme ? borderColor : "",
        pointRadius: 0,
        backgroundColor: getBackground(),
        tension: 0.3,
        fill: true,
      },
      {
        data: chartData, // Another dataset (if needed)
        borderWidth: 1.1,
        borderColor: colorScheme ? getColor("slate.400") : "",
        pointRadius: 0,
        borderDash: [1, 1],
        backgroundColor: getSecondaryBackground(),
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        ticks: {
          display: false,
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
          display: false,
        },
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
      },
    },
  };

  return (
    <Chart
      type="line"
      width={width}
      height={height}
      data={data}
      options={options}
      className={className}
      getRef={(el) => {
        reportLineChartRef.current = el;
      }}
    />
  );
}

export default Main;
