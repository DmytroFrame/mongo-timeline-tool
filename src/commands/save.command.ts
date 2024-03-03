import { MongoDBQuery } from "../mongodb-query.class";
import { IConfig } from "../interfaces/config.interface";
import { AbstractCommand } from "./abstract.command";
import { Storage } from "../storage.class";
import { Collection } from "mongodb";
import { getIgnoreList } from "../utils/get-ignore-list";

export class SaveCommand extends AbstractCommand {
  private query: MongoDBQuery;
  private storage: Storage;
  private shortDbName: string;
  private snapshotName: string;

  constructor(config: IConfig, params: string[]) {
    super(config, params);
    this.storage = new Storage(this.config.storagePath);
    this.shortDbName = this.paraseParamsShortNaem();
    this.query = new MongoDBQuery(this.config.databases, this.shortDbName);
    this.snapshotName =
      this.parseParamsOptionalName() ?? this.query.db.namespace;
  }

  async run(): Promise<void> {
    console.time(
      `\n\nDownload and save from the: '${this.shortDbName}' database took`
    );

    const collections = await this.query.db.collections();

    const ignoreCols = this.query.currentDbConfig.ignoreCollections;
    const filterArr = getIgnoreList({ ...ignoreCols, input: [] });

    console.log("Ingore collections:", filterArr);

    const dowloadedCollections = await Promise.all(
      collections
        .filter((col) => !filterArr.includes(col.collectionName))
        .map(this.dowloadCollection)
    );

    const snapshotName = await this.storage.createSnapshot(this.snapshotName);
    await this.storage.save(snapshotName, dowloadedCollections);

    console.timeEnd(
      `\n\nDownload and save from the: '${this.shortDbName}' database took`
    );
    await this.query.close();
  }

  private async dowloadCollection(collection: Collection) {
    console.time(`\nDownload collection: '${collection.collectionName}'`);
    const data = await collection.find().toArray();
    console.timeEnd(`\nDownload collection: '${collection.collectionName}'`);
    console.log(
      ` - collection '${collection.collectionName}' have '${data.length}' documents`
    );
    return { name: collection.collectionName, data };
  }

  private paraseParamsShortNaem(): string {
    if (this.params.length < 1) {
      throw new Error("You not writed database name.");
    }

    return this.params[0];
  }

  private parseParamsOptionalName(): string | null {
    if (this.params.length < 2) {
      return null;
    }

    if (this.params[1] !== "--name") {
      throw new Error("Suport only tag --name");
    }

    if (this.params[2] === undefined) {
      throw new Error("You not writed custom snapshot name.");
    }

    return this.params[2];
  }
}
