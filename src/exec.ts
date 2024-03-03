import { SaveCommand, SetCommand, ListCommand, DeleteCommand, HelpCommand } from "./commands";

export const exec = new Map([
  ["save", SaveCommand],
  ["set", SetCommand],
  ["list", ListCommand],
  ["delete", DeleteCommand],
  ["help", HelpCommand],
]);
