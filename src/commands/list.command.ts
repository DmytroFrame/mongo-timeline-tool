import { IConfig } from "../interfaces/config.interface";
import { Storage } from "../storage.class";
import { AbstractCommand } from "./abstract.command";

export class ListCommand extends AbstractCommand {
  private storage: Storage;

  constructor(config: IConfig, params: string[]) {
    super(config, params);
    this.storage = new Storage(this.config.storagePath);
  }

  async run() {
    const snapshots = await this.storage.getSnapshots();
    this.printSnapshotNames(snapshots);
  }

  private printSnapshotNames(snapshotNames: string[]) {
    this.printBreakLine();
    console.log(
      "|INDEX\t|DATE\t\t|TIME\t\t|NAME\t\t\t|SNAPSHOT NAME\t\t\t\t\t|"
    );
    this.printBreakLine();

    snapshotNames
      .sort()
      .map((name, index) => ({ name, index }))
      .reverse()
      .forEach((el) => this.printName(el));
  }

  private printName({ name, index }: { name: string; index: number }) {
    const arr = name.split("_");
    const date = `${arr[0].slice(0, 4)}-${arr[0].slice(4, 6)}-${arr[0].slice(
      6,
      8
    )}`;
    const time = arr[1];
    const database = arr.slice(2).join("_");

    console.log(
      `|${index}\t|${date}\t|${time}\t|${database}\t\t|${name}`
    );
    this.printBreakLine();
  }

  private printBreakLine() {
    console.log(
      "+-------+---------------+---------------+-----------------------+-----------------------------------------------+"
    );
  }
}
