#!/usr/bin/env node

import { exec } from "./exec";
import { readFile } from "node:fs/promises";
import { IConfig } from "./interfaces/config.interface";
import { Storage } from "./storage.class";

async function main() {
  const argvCommand = `${process.argv[2]}`.toLowerCase();
  const config: IConfig = JSON.parse(
    await readFile("./mtt-config.json", "utf8")
  );

  const rawCommand = exec.get(argvCommand);

  await Storage.createStorageFolder(config.storagePath);

  if (rawCommand) {
    console.log("argvCommand", process.argv.slice(3));
    const command = new rawCommand(config, process.argv.slice(3));
    await command.run();
  }

  if (!exec.has(argvCommand)) {
    console.log(`"${argvCommand}" is not a valid command.\n`);

    const rawCommand = exec.get("help");
    if (rawCommand) new rawCommand(config, []).run();
  }
}
main();
