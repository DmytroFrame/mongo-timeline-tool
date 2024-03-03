import fs from "node:fs/promises";
import { createSnapshotName } from "./utils/create-snapshot-name";
import { Dirent } from "node:fs";
import { CollectionType } from "./types/collection.type";
import { EJSON } from "bson";

export class Storage {
  private storagePath: string;
  private encoding: BufferEncoding = "utf8";

  constructor(storagePath: string) {
    this.storagePath = storagePath;
  }

  static async createStorageFolder(storagePath: string) {
    await fs.mkdir(storagePath, { recursive: true });
  }

  async getSnapshots(): Promise<string[]> {
    const folder = await fs.readdir(this.storagePath, { withFileTypes: true });
    return folder.filter((el) => el.isDirectory()).map((el) => el.name);
  }

  async createSnapshot(snapshotName: string) {
    const snapshot = createSnapshotName(snapshotName);
    await fs.mkdir(`${this.storagePath}/${snapshot}`);
    return snapshot;
  }

  async save(snapshotName: string, collections: CollectionType[]) {
    await Promise.all(
      collections.map((el) =>
        fs.writeFile(
          `${this.storagePath}/${snapshotName}/${el.name}.json`,
          EJSON.stringify(el.data),
          this.encoding
        )
      )
    );
  }

  async getCollections(snapshotName: string) {
    const folder = await fs.readdir(`${this.storagePath}/${snapshotName}`, {
      withFileTypes: true,
    });

    return await Promise.all(
      folder.filter((el) => el.isFile()).map((file) => this.readOneFile(file))
    );
  }

  private async readOneFile(file: Dirent): Promise<CollectionType> {
    const data = await fs.readFile(`${file.path}/${file.name}`, this.encoding);

    return {
      name: file.name.replace(".json", ""),
      data: EJSON.parse(data),
    };
  }

  async remove(snapshotName: string) {
    await fs.rm(`${this.storagePath}/${snapshotName}`, { recursive: true });
  }
}
