export interface MysqlSettings {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  serverId: number;
}

export interface DemoAutoChangesSettings {
  enabled: boolean;
  intervalMs: number;
}
