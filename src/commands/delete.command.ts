import { IConfig } from "../interfaces/config.interface";
import { Storage } from "../storage.class";
import { AbstractCommand } from "./abstract.command";

export class DeleteCommand extends AbstractCommand {
  private storage: Storage;

  constructor(config: IConfig, params: string[]) {
    super(config, params);
    this.storage = new Storage(this.config.storagePath);
  }

  async run() {
    const snapshots = await this.storage.getSnapshots();

    if (!snapshots.includes(this.params[0])) {
      console.error(`Snapshot ${this.params[0]} not found.`);
    }

    if (snapshots.includes(this.params[0])) {
      await this.storage.remove(this.params[0]);
      console.log(`Snapshot ${this.params[0]} deleted.`);
    }
  }
}
