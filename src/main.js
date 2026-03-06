import { App } from "./app/App.js";
import "./styles/main.css";

const appRoot = document.querySelector("#app");

if (!appRoot) {
  throw new Error("App root element was not found.");
}

const app = new App(appRoot);
app.start();
