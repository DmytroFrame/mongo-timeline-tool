import { AbstractCommand } from "./abstract.command";

export class HelpCommand extends AbstractCommand {
    run() {
        console.log("Commands list: save, set, list, delete, help");
        console.log(`  save {DATABASE_SHORT_NAME} - create new snapshot from database, you can used custom name with flag --name {NAME}`);
        console.log(`  set {SNAPSHOT_NAME} {DATABASE_SHORT_NAME} - use to set snapshot data in database`);
        console.log(`  list - list of snapshots`);
        console.log(`  delete {SNAPSHOT_NAME} - delete snapshot`);
        console.log(`  help - list of commands`);
    }
    
}
