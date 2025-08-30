import { useGetPageViewsQuery } from "@/stores/apiSlice";
import React, { useState, useEffect } from "react";

const CounterFlip = () => {
  const [count, setCount] = useState(0);
  const [prevCount, setPrevCount] = useState(0);
  const [countStr, setCounterString] = useState("");
  const [prevCountStr, setPrevCounterString] = useState("");

  const { data: page_views } = useGetPageViewsQuery(undefined, {
    pollingInterval: 5000, // Refresh data every 5 seconds
  });

  useEffect(() => {
    if (page_views?.data !== undefined) {
      setPrevCount(count);
      setCount(page_views.data);
      setCounterString(page_views.data.toString());
      setPrevCounterString(count.toString());
    }
  }, [page_views]);

  const stat = {
    suffix: "+",
    title: "Page Views",
    description: "Trusted by businesses across the country",
    icon: (
      <svg
        className="w-12 h-12 text-orange-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
    ),
  };

  return (
    <div className="w-[400px] relative p-2 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
   

      {prevCountStr && countStr && (
        <div className="mt-1 space-y-1">
          <div className="flex items-end space-x-2">
            <div
              style={{
                fontSize: "1rem",
                fontFamily: "monospace",
                display: "flex",
                position: "relative",
              }}
            >
              {countStr.split("").map((digit, index) => {
                const prevDigit = prevCountStr[index] || "0";
                const isChanged = prevDigit !== digit;

                return (
                  <div
                    key={`${digit}-${index}`}
                    className="text-md md:text-5xl font-bold text-gray-900 dark:text-white border-[1px] mx-[0.2] bg-gray-950 text-white rounded-md"
                    style={{
                      position: "relative",
                      width: "0.7em",
                      height: "1.5em",
                      overflow: "hidden",
                      display: "inline-block",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        transform: isChanged ? "rotateX(90deg)" : "rotateX(0deg)",
                        transition: "transform 0.5s ease-in-out",
                      }}
                    >
                      {prevDigit}
                    </div>
                    <div
                      style={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        transform: isChanged ? "rotateX(0deg)" : "rotateX(-90deg)",
                        transition: "transform 0.5s ease-in-out",
                      }}
                    >
                      {digit}
                    </div>
                  </div>
                );
              })}
            </div>
            {/* <span className="text-4xl font-bold text-orange-500">{stat.suffix}</span> */}
          </div>

          <h3 className="text-md font-semibold text-gray-900 dark:text-white">
            {stat.title}
          </h3>

          <p className="text-gray-600 dark:text-gray-300">{stat.description}</p>
        </div>
      )}

      {/* Decorative Element */}
      {/* <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-orange-600 rounded-b-2xl"></div> */}
    </div>
  );
};

export default CounterFlip;