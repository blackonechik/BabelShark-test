import "reflect-metadata";
import { Mongo } from "meteor/mongo";
import { Meteor } from "meteor/meteor";
import { registerCustomersPublication } from "@/app/server/lib/register-customers-publication";
import { registerTranslatePositionMethod } from "@/app/server/lib/register-translate-position-method";
import { getMysqlSettings } from "@/app/server/model/mysql";

Mongo.setConnectionOptions({
  ssl: false,
  tls: false,
});

Meteor.startup(() => {
  registerCustomersPublication();
  registerTranslatePositionMethod();

  if (!getMysqlSettings()) {
    console.warn(
      "MySQL settings are missing. Publications will stay empty until MYSQL_* env vars or Meteor.settings.mysql are provided.",
    );
  }
});
