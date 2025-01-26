# Node.js Virtual Environment Tool

This tool helps you manage Node.js versions using `nvm` (Node Version Manager). It allows you to install, switch, and automatically manage Node.js versions based on a `.nvmrc` file.

## Description

Managing multiple Node.js versions can be challenging, especially when working on different projects that require different versions. This tool simplifies the process by leveraging `nvm` to create isolated Node.js environments. With this tool, you can easily install specific Node.js versions, switch between them, and automatically use the version specified in a `.nvmrc` file.

## Summary

- **Install Node.js versions**: Easily install specific Node.js versions using `nvm`.
- **Switch Node.js versions**: Switch between different Node.js versions and update the `.nvmrc` file.
- **Automatic management**: Automatically install and use the Node.js version specified in the `.nvmrc` file.
- **Cross-platform**: Supports Windows, Linux, and macOS.

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/Victor1890/node-venv.git
    cd node-env
    ```

2. Install dependencies using `pnpm`:
    ```sh
    pnpm install
    ```

    If you don't have `pnpm` installed, you can install it using `npm`:
    ```sh
    npm install -g pnpm
    ```

3. Make sure `nvm` is installed on your system. You can follow the instructions below for your operating system:

### Windows

1. Download the `nvm-setup.exe` from the [nvm-windows releases page](https://github.com/coreybutler/nvm-windows/releases).
2. Run `nvm-setup.exe`.
3. Follow the installation instructions.

### Linux and macOS

1. Open your terminal.
2. Run the following command to install `nvm`:
    ```sh
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
    ```
3. Add the following lines to your profile (`~/.bashrc`, `~/.zshrc`, `~/.profile`, or `~/.bash_profile`):
    ```sh
    export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
    ```
4. Restart your terminal or run the following command to apply the changes:
    ```sh
    source ~/.bashrc
    ```

For more details, visit the [official nvm GitHub page](https://github.com/nvm-sh/nvm).

## Usage

You can use the tool with the following commands:

### Install a Specific Node.js Version

To install a specific Node.js version using `nvm`, run:
```sh
node-env install <nodeVersion>
```
Example:
```sh
node-env install 14.17.0
```

### Switch to a Specific Node.js Version

To switch to a specific Node.js version and update the `.nvmrc` file, run:
```sh
node-env use <nodeVersion>
```
Example:
```sh
node-env use 16.13.0
```

### Automatically Manage Node.js Version

To automatically install and use the Node.js version specified in the `.nvmrc` file, run:
```sh
node-env auto
```

## Configuration

You can configure the application name by setting the `APP_NAME` environment variable. The default value is `node-venv`.

## License

This project is licensed under the MIT License.
