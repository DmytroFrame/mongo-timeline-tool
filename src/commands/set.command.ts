import { IConfig } from "../interfaces/config.interface";
import { MongoDBQuery } from "../mongodb-query.class";
import { Storage } from "../storage.class";
import { CollectionType } from "../types/collection.type";
import { getIgnoreList } from "../utils/get-ignore-list";
import { AbstractCommand } from "./abstract.command";

export class SetCommand extends AbstractCommand {
  private query: MongoDBQuery;
  private storage: Storage;
  private snapshotName: string;
  private shortDbName: string;

  constructor(config: IConfig, params: string[]) {
    super(config, params);
    this.snapshotName = this.parseSnapshotName();
    this.shortDbName = this.paraseShortName();
    this.storage = new Storage(this.config.storagePath);
    this.query = new MongoDBQuery(this.config.databases, this.shortDbName);
  }

  async run() {
    console.time(
      `\n\nLoad and upload from the: '${this.snapshotName}' to database: '${this.shortDbName}' took`
    );

    const ignoreCols = this.query.currentDbConfig.ignoreCollections;
    const filterArr = getIgnoreList({ ...ignoreCols, output: [] });
    console.log("Ingore collections:", filterArr);

    const collections = await this.storage.getCollections(this.snapshotName);

    await Promise.all(
      collections
        .filter((col) => !filterArr.includes(col.name))
        .map((col) => this.uploadCollection(col))
    );

    console.timeEnd(
      `\n\nLoad and upload from the: '${this.snapshotName}' to database: '${this.shortDbName}' took`
    );
    await this.query.close();
  }

  private async uploadCollection({ name, data }: CollectionType) {
    const collection = this.query.db.collection(name);

    if (data.length === 0) {
      let deletedCount = 0;

      if ((await collection.find().toArray()).length) {
        deletedCount = (await collection.deleteMany()).deletedCount;
      }

      return console.log(
        `\nCollection '${collection.collectionName}' is empty, delete: '${deletedCount}'`
      );
    }

    console.time(`\nUpload collection: '${collection.collectionName}'`);
    const deleteResult = await collection.deleteMany();
    const insertResult = await collection.insertMany(data);
    console.timeEnd(`\nUpload collection: '${collection.collectionName}'`);

    console.log(
      ` - collection '${collection.collectionName}' delete: '${deleteResult.deletedCount}' and insert: '${insertResult.insertedCount}'`
    );
  }

  private parseSnapshotName(): string {
    if (this.params[0] === undefined)
      throw new Error("You not writed snapshot_name");

    return this.params[0];
  }

  private paraseShortName(): string {
    if (this.params[1] === undefined)
      throw new Error("You not writed short_database_name");

    return this.params[1];
  }
}
