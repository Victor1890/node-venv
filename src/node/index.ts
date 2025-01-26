import { logger } from '@/lib/logger';
import { execSync } from 'child_process';
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
    if (!file.includes('.')) throw new Error('Invalid file path');
    this.nvmrcPath = file;
  }

  private isManagerInstalled(manager: InstallType): boolean {
    try {
      if (this.isWindows) {
        execSync(`powershell.exe -Command "Get-Command ${manager}"`, { stdio: 'ignore' });
      } else {
        execSync(`command -v ${manager}`, { stdio: 'ignore' });
      }
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
      logger.error(
        `Failed to create ${nvmrcPath} file. Make sure you have the necessary permissions.`
      );
      return false;
    }
  }

  private runInstallNodeCommand(version: string, type: InstallType) {
    if (this.isWindows) {
      try {
        logger.info(`Installing Node.js version ${version} using ${type} on Windows...`);
        execSync(`powershell -Command "${type} install ${version}"`, {
          stdio: 'inherit',
          windowsHide: true,
        });
        execSync(`powershell -Command "${type} use ${version}"`, {
          stdio: 'inherit',
          windowsHide: true,
        });
      } catch (error) {
        logger.error(
          `Failed to install Node.js with ${type} on Windows. Make sure ${type} is installed and the version is valid.`
        );
        process.exit(1);
      }
    } else {
      try {
        logger.info(`Installing Node.js version ${version} using ${type}...`);
        execSync(`${type} install ${version}`, { stdio: 'inherit' });
        execSync(`${type} use ${version}`, { stdio: 'inherit' });
      } catch (error) {
        logger.error(
          `Failed to install Node.js with ${type}. Make sure ${type} is installed and the version is valid.`
        );
        process.exit(1);
      }
    }
  }

  public updateNvmrcFile(version: string, type: InstallType = 'nvm'): void {
    const nvmrcPath = this.nvmrcPath;
    try {
      fs.writeFileSync(nvmrcPath, `v${version}`, 'utf-8');
      logger.info(`✔ Updated ${nvmrcPath} file with version ${version}.`);

      this.runInstallNodeCommand(version, type);

      logger.info(`\n🎉 Node.js Version Managed Successfully with ${type}!`);
    } catch (error) {
      logger.error(
        `Failed to update ${nvmrcPath} file. Make sure you have the necessary permissions.`
      );
    }
  }

  public installNode(version: string, type: InstallType = 'nvm') {
    if (!this.isManagerInstalled(type)) {
      logger.error(`${type} is not installed. Please install ${type} and try again.`);
      return process.exit(1);
    }

    if (!this.checkNvmrcFile(version)) return process.exit(1);

    const envPath = this.nvmrcPath;

    const nodeVersion = fs.readFileSync(envPath, 'utf-8').trim();
    logger.info(`✔ Found Node.js version ${nodeVersion} using ${type}...`);

    this.runInstallNodeCommand(version, type);

    logger.info(`\n🎉 Node.js Version Managed Successfully with ${type}!`);
  }

  public autoManageNode() {
    const nvmrcPath = this.nvmrcPath;
    try {
      if (!fs.existsSync(nvmrcPath)) {
        logger.error(
          `No ${nvmrcPath} file found in the current directory. Please create one with a Node.js version.`
        );
        process.exit(1);
      }

      const nodeVersion = fs.readFileSync(nvmrcPath, 'utf-8').trim();
      if (!nodeVersion) {
        logger.error(`No version found in ${nvmrcPath} file. Please specify a Node.js version.`);
        process.exit(1);
      }

      this.runInstallNodeCommand(nodeVersion, 'nvm');

      logger.info(`\n🎉 Node.js Version Managed Successfully with nvm!`);
    } catch (error) {
      logger.error(
        `Failed to manage Node.js version with nvm. Make sure you have the necessary permissions.`
      );
    }
  }
}
