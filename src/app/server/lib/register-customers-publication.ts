import { Meteor } from "meteor/meteor";
import { LiveMysqlKeySelector } from "meteor/vlasky:mysql";
import { CUSTOMERS_PUBLICATION } from "@/entities/customer";
import { getLiveMysql, getMysqlSettings } from "../model/mysql";

export const registerCustomersPublication = (): void => {
  Meteor.publish(CUSTOMERS_PUBLICATION, function publishCustomersWithPositions() {
    const liveMysql = getLiveMysql();
    const settings = getMysqlSettings();

    if (!liveMysql || !settings) {
      this.ready();
      return;
    }

    return liveMysql.select(
      `SELECT
          customers.id AS id,
          customers.full_name AS fullName,
          positions.name AS position
        FROM customers
        INNER JOIN positions ON positions.id = customers.position_id
        ORDER BY customers.id ASC`,
      [],
      LiveMysqlKeySelector.Columns(["id"]),
      [
        { database: settings.database, table: "customers" },
        { database: settings.database, table: "positions" },
      ],
    );
  });
};
