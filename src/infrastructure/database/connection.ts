import * as sql from "mssql";
import {  dbConfig, dbConfigAzure, } from "../config/database";

class Database {
  private static instance: sql.ConnectionPool;
  private static connecting: Promise<sql.ConnectionPool> | null = null;

  static async getConnection(): Promise<sql.ConnectionPool> {
    if (this.instance) return this.instance;

    if (this.connecting) return this.connecting;
  
    this.connecting = sql.connect(dbConfig).then((pool) => {
      this.instance = pool;
      this.connecting = null;
      return pool;
    });

    return this.connecting;
  }


}

export default Database;