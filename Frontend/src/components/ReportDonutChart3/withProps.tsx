import Chart from "@/components/Base/Chart";
import { ChartData, ChartOptions } from "chart.js/auto";
import { getColor } from "@/utils/colors";
import { selectColorScheme } from "@/stores/colorSchemeSlice";
import { selectDarkMode } from "@/stores/darkModeSlice";
import { useAppSelector } from "@/stores/hooks";
import { useMemo } from "react";

interface MainProps extends React.ComponentPropsWithoutRef<"canvas"> {
  width?: number | "auto";
  height?: number | "auto";
  labels: string[]; // Array of labels for the chart
  values: number[]; // Array of values corresponding to the labels
  className?: string;
}

function Main({ width = "auto", height = "auto", labels, values, className = "" }: MainProps) {
  const props = {
    width: width,
    height: height,
    className: className,
  };
  const colorScheme = useAppSelector(selectColorScheme);
  const darkMode = useAppSelector(selectDarkMode);

  const data: ChartData = useMemo(() => {
    const colors = labels.map((_, index) =>
      getColor(index % 2 === 0 ? "danger" : "theme.2", 0.6)
    );

    return {
      labels: labels,
      datasets: [
        {
          data: values,
          backgroundColor: colors,
          hoverBackgroundColor: colors,
          borderWidth: 1,
          borderColor: colors,
        },
      ],
    };
  }, [labels, values, colorScheme, darkMode]);

  const options: ChartOptions = useMemo(() => {
    return {
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false  , // Show legend for better readability
        },
      },
      cutout: "89%",
      rotation: -90,
      circumference: 180,
    };
  }, [colorScheme, darkMode]);

  return (
    <Chart
      type="doughnut"
      width={props.width}
      height={props.height}
      data={data}
      options={options}
      className={props.className}
    />
  );
}

export default Main;
