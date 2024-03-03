import { IConfig } from "../interfaces/config.interface";

export abstract class AbstractCommand {
  protected readonly config: IConfig;
  protected readonly params: string[];

  constructor(config: IConfig, params: string[]) {
    this.config = config;
    this.params = params;
  }

  abstract run(): void | Promise<void>;
}
