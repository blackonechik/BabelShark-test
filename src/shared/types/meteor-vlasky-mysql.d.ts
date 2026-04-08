declare module "meteor/vlasky:mysql" {
  interface MysqlTrigger {
    database: string;
    table: string;
  }

  class LiveMysql {
    constructor(settings: unknown);
    select(
      query: string,
      params: unknown[],
      keySelector: unknown,
      triggers: MysqlTrigger[],
    ): any;
  }

  const LiveMysqlKeySelector: {
    Columns(columns: string[]): unknown;
  };

  export { LiveMysql, LiveMysqlKeySelector };
}
