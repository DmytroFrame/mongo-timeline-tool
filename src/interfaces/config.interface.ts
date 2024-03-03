import { IConfigDatabase } from "./config-database.interface";

export interface IConfig {
  databases: IConfigDatabase[];
  storagePath: string;
}
