import { logger } from '@/lib/logger';
import { execSync } from "child_process";
import fs from 'fs';

type InstallType = 'nvm';

export class NodeVenv {
    private isWindows: boolean;
    private nvmrcPath: string = '.nvmrc';

    constructor() {
        this.isWindows = process.platform === 'win32';
    }

    set changeNvmrcFile(file: string) {
        if (!file) throw new Error('File path is required');
        if (!file.includes(".")) throw new Error('Invalid file path');
        this.nvmrcPath = file;
    }

    private isManagerInstalled(manager: InstallType): boolean {
        const command = this.isWindows ? `powershell.exe -Command "Get-Command ${manager}"` : `command -v ${manager}`;
        logger.info(`Checking if ${manager} is installed...`);
        try {
            execSync(command, { stdio: 'ignore' });
            return true;
        } catch (e) {
            return false;
        }
    }

    private checkNvmrcFile(version: string): boolean {
        const nvmrcPath = this.nvmrcPath;
        try {
            if (!fs.existsSync(nvmrcPath)) {
                logger.warn(`${nvmrcPath} file not found. Creating one with version ${version}...`);
                fs.writeFileSync(nvmrcPath, `v${version}`, 'utf-8');
                logger.info(`✔ Created ${nvmrcPath} file with version ${version}.`);
            }

            const nodeVersion = fs.readFileSync(nvmrcPath, 'utf-8').trim();
            if (!nodeVersion) {
                logger.error(`No version found in ${nvmrcPath} file. Please specify a Node.js version.`);
                return false;
            }

            return true;
        } catch (error) {
            logger.error(`Failed to create ${nvmrcPath} file. Make sure you have the necessary permissions.`);
            return false;
        }
    }

    private runInstallNodeCommand(version: string, type: InstallType) {
        const installCommand = this.isWindows ? `powershell -Command "${type} install ${version}"` : `${type} install ${version}`;
        const useCommand = this.isWindows ? `powershell -Command "${type} use ${version}"` : `${type} use ${version}`;
        try {
            logger.info(`Installing Node.js version ${version} using ${type}...`);
            execSync(installCommand, { stdio: 'inherit', windowsHide: true });
            execSync(useCommand, { stdio: 'inherit', windowsHide: true });
        } catch (error) {
            logger.error(`Failed to install Node.js with ${type}. Make sure ${type} is installed and the version is valid.`);
            process.exit(1);
        }
    }

    private manageNodeVersion(version: string, type: InstallType) {
        if (!this.isManagerInstalled(type)) {
            logger.error(`${type} is not installed. Please install ${type} and try again.`);
            return process.exit(1);
        }

        if (!this.checkNvmrcFile(version)) return process.exit(1);

        const nodeVersion = fs.readFileSync(this.nvmrcPath, 'utf-8').trim();
        logger.info(`✔ Found Node.js version ${nodeVersion} using ${type}...`);

        this.runInstallNodeCommand(version, type);

        logger.info(`\n🎉 Node.js Version Managed Successfully with ${type}!`);
    }

    public updateNvmrcFile(version: string, type: InstallType = 'nvm'): void {
        try {
            fs.writeFileSync(this.nvmrcPath, `v${version}`, 'utf-8');
            logger.info(`✔ Updated ${this.nvmrcPath} file with version ${version}.`);
            this.runInstallNodeCommand(version, type);
            logger.info(`\n🎉 Node.js Version Managed Successfully with ${type}!`);
        } catch (error) {
            logger.error(`Failed to update ${this.nvmrcPath} file. Make sure you have the necessary permissions.`);
        }
    }

    public installNode(version: string, type: InstallType = 'nvm') {
        this.manageNodeVersion(version, type);
    }

    public autoManageNode() {
        try {
            if (!fs.existsSync(this.nvmrcPath)) {
                logger.error(`No ${this.nvmrcPath} file found in the current directory. Please create one with a Node.js version.`);
                process.exit(1);
            }

            const nodeVersion = fs.readFileSync(this.nvmrcPath, 'utf-8').trim();
            if (!nodeVersion) {
                logger.error(`No version found in ${this.nvmrcPath} file. Please specify a Node.js version.`);
                process.exit(1);
            }

            this.runInstallNodeCommand(nodeVersion, 'nvm');
            logger.info(`\n🎉 Node.js Version Managed Successfully with nvm!`);
        } catch (error) {
            logger.error(`Failed to manage Node.js version with nvm. Make sure you have the necessary permissions.`);
        }
    }
}