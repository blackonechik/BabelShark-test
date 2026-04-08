import { createRoot } from "react-dom/client";
import { Meteor } from "meteor/meteor";
import "bootstrap/dist/css/bootstrap.min.css";
import "@/shared/styles/global.css";
import { App } from "@/app/app";

Meteor.startup(() => {
  const container = document.getElementById("react-target");

  if (!container) {
    throw new Error("React target container was not found.");
  }

  const root = createRoot(container);
  root.render(<App />);
});
