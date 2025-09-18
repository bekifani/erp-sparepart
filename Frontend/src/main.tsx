import ScrollToTop from "@/components/Base/ScrollToTop";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./stores/store";
import Router from "./router";
import "./assets/css/app.css";
import "./index.css";
import './Translation/i18n'
import WrapperComponent from "@/wrapper/index";
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <BrowserRouter>
    <Provider store={store}>
      <WrapperComponent>
      <Router />
      </WrapperComponent>
    </Provider>
    <ScrollToTop />
  </BrowserRouter>
);
