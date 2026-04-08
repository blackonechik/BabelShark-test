import { Meteor } from "meteor/meteor";
import { LiveMysql } from "meteor/vlasky:mysql";
import type { DataSourceOptions } from "typeorm";
import { coerceNumber } from "../lib/coerce-number";
import type { MysqlSettings } from "./types";

export const getMysqlSettings = (): MysqlSettings | null => {
  const settings = (Meteor.settings as { mysql?: Partial<MysqlSettings> }).mysql ?? {};

  const host = String(settings.host ?? process.env.MYSQL_HOST ?? "");
  const user = String(settings.user ?? process.env.MYSQL_USER ?? "");
  const password = String(settings.password ?? process.env.MYSQL_PASSWORD ?? "");
  const database = String(settings.database ?? process.env.MYSQL_DATABASE ?? "");
  const port = coerceNumber(settings.port ?? process.env.MYSQL_PORT, 3306);
  const serverId = coerceNumber(
    settings.serverId ?? process.env.MYSQL_SERVER_ID,
    1,
  );

  if (!host || !user || !database) {
    return null;
  }

  return {
    host,
    port,
    user,
    password,
    database,
    serverId,
  };
};

let liveMysqlInstance: LiveMysql | null = null;

export const getLiveMysql = (): LiveMysql | null => {
  if (liveMysqlInstance) {
    return liveMysqlInstance;
  }

  const settings = getMysqlSettings();

  if (!settings) {
    return null;
  }

  liveMysqlInstance = new LiveMysql(settings);
  return liveMysqlInstance;
};

export const getTypeOrmOptions = (): DataSourceOptions | null => {
  const settings = getMysqlSettings();

  if (!settings) {
    return null;
  }

  return {
    type: "mysql",
    host: settings.host,
    port: settings.port,
    username: settings.user,
    password: settings.password,
    database: settings.database,
    synchronize: false,
    logging: false,
  };
};
