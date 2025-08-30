import { setLanguage } from "@/stores/authReducer";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import clsx from "clsx";

function LanguageSelector() {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const changeLanguage = (e) => {
    dispatch(setLanguage(e));
    i18n.changeLanguage(e);
  };
  return (
    <div className="pt-5 w-full flex justify-start items-center gap-2">
      <button
        className={clsx([
          "h-10 p-1 px-3 rounded-full cursor-pointer box",
          "[&.active]:border-2 [&.active]:border-theme-1/60 font-bold",
        ])}
        onClick={() => changeLanguage("am")}
      >
        {t("Amharic")}
      </button>
      <button
        className={clsx([
          "h-10 p-1 px-3 rounded-full cursor-pointer box",
          "[&.active]:border-2 [&.active]:border-theme-1/60 font-bold",
        ])}
        onClick={() => changeLanguage("en")}
      >
        {t("English")}
      </button>
    </div>
  );
}

export default LanguageSelector;
