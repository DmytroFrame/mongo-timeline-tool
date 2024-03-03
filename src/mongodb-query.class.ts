import { Db, MongoClient } from "mongodb";
import { IConfigDatabase } from "./interfaces/config-database.interface";

export class MongoDBQuery {
  private client: MongoClient;
  db: Db;
  currentDbConfig: IConfigDatabase;

  constructor(databases: IConfigDatabase[], shortName: string) {
    this.currentDbConfig = this.getCurrentDatabase(databases, shortName);
    this.client = new MongoClient(this.currentDbConfig.url);
    this.db = this.client.db(this.currentDbConfig.db);

    console.log("Connected successfully to database:", this.db.namespace);
  }

  private getCurrentDatabase(databases: IConfigDatabase[], shortName: string) {
    const dbs = databases.filter((db) => db.shortName === shortName);

    if (!dbs.length) {
      throw new Error("No find database specified by name: " + shortName);
    }

    return dbs[0];
  }

  async close() {
    await this.client.close();
  }
}
