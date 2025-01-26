import { getArgs } from "./args";
import { NodeVenv } from "@/node";

async function main(){
    const args = await getArgs();

    const venv = new NodeVenv();

    switch (args._[0]) {
        case "install":
            venv.installNode(args.nodeVersion as string);
            break;
        case "use":
            venv.changeNvmrcFile = '.nvmrc';
            venv.updateNvmrcFile(args.nodeVersion as string);
            break;
        case "auto":
            venv.autoManageNode();
            break;
        default:
            console.error("Invalid command. Use 'install', 'use', or 'auto'.");
            process.exit(1);
    }
}

main();