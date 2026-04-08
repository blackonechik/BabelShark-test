import { Mongo } from "meteor/mongo";
import type { CustomerRow } from "./types";

export const CustomersCollection = new Mongo.Collection<CustomerRow>(
  "customersWithPositions",
);
