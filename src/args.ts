import { version } from '../package.json';

import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";
import { config } from './config';

export function getArgs() {
  return yargs(hideBin(process.argv))
    .scriptName(config.APP_NAME)
    .usage("$0 <command> [options]")
    .command(
      "install <nodeVersion>",
      "Install a specific Node.js version using nvm",
      (yargs) => {
        yargs.positional("nodeVersion", {
          describe: "Node.js version to install",
          type: "string",
          demandOption: true,
        });
      }
    )
    .command(
      "use <nodeVersion>",
      "Switch to a specific Node.js version using nvm",
      (yargs) => {
        yargs.positional("nodeVersion", {
          describe: "Node.js version to switch to",
          type: "string",
          demandOption: true,
        });
      }
    )
    .command(
      "auto",
      "Automatically install and use the Node.js version specified in the .nvmrc file"
    )
    .demandCommand(1, "You need to specify a command (install, use, auto)")
    .help()
    .alias("help", "h")
    .parse();
}
