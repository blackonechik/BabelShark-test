import "reflect-metadata";
import { Meteor } from "meteor/meteor";
import { registerCustomersPublication } from "@/app/server/lib/register-customers-publication";
import { registerTranslatePositionMethod } from "@/app/server/lib/register-translate-position-method";
import { getMysqlSettings } from "@/app/server/model/mysql";

Meteor.startup(() => {
  registerCustomersPublication();
  registerTranslatePositionMethod();

  if (!getMysqlSettings()) {
    console.warn(
      "MySQL settings are missing. Publications will stay empty until MYSQL_* env vars or Meteor.settings.mysql are provided.",
    );
  }
});
