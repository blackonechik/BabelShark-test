import { Meteor } from "meteor/meteor";
import type { Pool, RowDataPacket } from "mysql2/promise";
import {
  getDemoAutoChangesSettings,
  getMysqlPool,
} from "../model/mysql";

interface PositionRow extends RowDataPacket {
  id: number;
  name: string;
}

interface CustomerRow extends RowDataPacket {
  id: number;
  full_name: string;
  position_id: number;
}

const DEMO_NAMES: readonly string[] = [
  "Marta Bellini",
  "Nikolai Sorrenti",
  "Lara Ventresca",
  "Enzo Morelli",
  "Giulia Rinaldi",
  "Owen Carletti",
];

let demoTimer: ReturnType<typeof Meteor.setInterval> | null = null;
let tickCount = 0;
let nextDemoNameIndex = 0;

const selectPositions = async (pool: Pool): Promise<PositionRow[]> => {
  const [rows] = await pool.query<PositionRow[]>(
    "SELECT id, name FROM positions ORDER BY id ASC",
  );

  return rows;
};

const selectCustomers = async (pool: Pool): Promise<CustomerRow[]> => {
  const [rows] = await pool.query<CustomerRow[]>(
    "SELECT id, full_name, position_id FROM customers ORDER BY id ASC",
  );

  return rows;
};

const pickNextPositionId = (
  positions: readonly PositionRow[],
  currentPositionId: number,
): number | null => {
  if (positions.length < 2) {
    return null;
  }

  const currentIndex = positions.findIndex(
    (position) => position.id === currentPositionId,
  );
  const nextIndex = currentIndex >= 0
    ? (currentIndex + 1) % positions.length
    : 0;

  return positions[nextIndex]?.id ?? null;
};

const buildDemoCustomerName = (): string => {
  const baseName = DEMO_NAMES[nextDemoNameIndex % DEMO_NAMES.length] ?? "Demo User";
  nextDemoNameIndex += 1;

  return `${baseName} #${nextDemoNameIndex}`;
};

const runDemoChange = async (pool: Pool): Promise<void> => {
  const [positions, customers] = await Promise.all([
    selectPositions(pool),
    selectCustomers(pool),
  ]);

  if (!positions.length) {
    return;
  }

  tickCount += 1;

  const shouldInsert = tickCount % 2 === 1;

  if (shouldInsert) {
    const firstPositionId = positions[0]?.id;

    if (!firstPositionId) {
      return;
    }

    await pool.execute(
      "INSERT INTO customers (full_name, position_id) VALUES (?, ?)",
      [buildDemoCustomerName(), firstPositionId],
    );

    return;
  }

  const minimumDemoCustomers = 3;

  if (customers.length > minimumDemoCustomers) {
    const customerToDelete = customers[customers.length - 1];

    if (customerToDelete) {
      await pool.execute(
        "DELETE FROM customers WHERE id = ?",
        [customerToDelete.id],
      );
      return;
    }
  }

  const customerToUpdate = customers[(tickCount - 1) % Math.max(customers.length, 1)];

  if (!customerToUpdate) {
    await pool.execute(
      "INSERT INTO customers (full_name, position_id) VALUES (?, ?)",
      [buildDemoCustomerName(), positions[0]?.id ?? 1],
    );
    return;
  }

  const nextPositionId = pickNextPositionId(
    positions,
    customerToUpdate.position_id,
  );

  if (!nextPositionId) {
    return;
  }

  await pool.execute(
    "UPDATE customers SET position_id = ? WHERE id = ?",
    [nextPositionId, customerToUpdate.id],
  );
};

export const registerDemoAutoChanges = (): void => {
  if (demoTimer) {
    return;
  }

  const demoSettings = getDemoAutoChangesSettings();

  if (!demoSettings.enabled) {
    return;
  }

  const pool = getMysqlPool();

  if (!pool) {
    console.warn("Demo auto changes are enabled, but MySQL settings are missing.");
    return;
  }

  demoTimer = Meteor.setInterval(() => {
    void runDemoChange(pool).catch((error: unknown) => {
      console.error("Demo auto change failed:", error);
    });
  }, demoSettings.intervalMs);
};
