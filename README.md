# Nightrunner Editor

This is the editor for the Nightrunner Interactive Fiction Engine.

## Developing

### Pre-requisites

Nightrunner Editor is developed using the **Tauri Project**.
Before starting you will need the following dependencies installed:

#### System Dependencies

```sh
sudo apt update && sudo apt install libwebkit2gtk-4.0-dev \
    build-essential \
    curl \
    wget \
    libssl-dev \
    libgtk-3-dev \
    libappindicator3-dev \
    patchelf \
    librsvg2-dev
```

I've been developing on a linux machine. If using Windows or Mac, please refer to:

- https://tauri.studio/en/docs/getting-started/setup-windows for Windows
- https://tauri.studio/en/docs/getting-started/setup-macos for macOS

#### Node and Yarn

Make sure Node is installed on your system. I personally use **ASDF** to manage my node versions:

```sh
sudo apt install curl git dirmngr gpg curl gawk
git clone https://github.com/asdf-vm/asdf.git ~/.asdf --branch v0.8.1

# Add the following to the end of your .bashrc or .zshrc
. $HOME/.asdf/asdf.sh
. $HOME/.asdf/completions/asdf.bash

# restart your shell or source ~/.bashrc or ~/.zshrc

asdf plugin add nodejs https://github.com/asdf-vm/asdf-nodejs.git
asdf install nodejs latest
asdf global nodejs latest
```

When NodeJS is installed, make sure to install Yarn as well:

```
npm install --global yarn
```

#### Rust

Install the latest stable version of rust:

```
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

#### Tauri CLI

To manage the project install the Tauri CLI tool for cargo:

```
cargo install tauri-cli --version ^1.0.0-beta
```

This allows you to start the dev server and build the Tauri app in development mode:

```
cargo tauri dev
```

For more information on the Tauri CLI please visit: https://tauri.studio/en/docs/usage/development/integration#Alternatively-install-Tauri-CLI-as-a-cargo-subcommand

### Download project dependencies

Inside the project root:

```
yarn install
cargo tauri dev
```

---

If everything up to this point progressed without issues, you should be looking at the current version of Nightrunner Editor. You can open the project root in your code editor of choice and start developing.

The two main folders where code resides are:

- / - Project root, where most configs reside.
- src/ - React root, where the front-end code resides. This project uses Vite for it's bundler
- src-tauri/ - Rust root, where backend and tauri specific config resides
