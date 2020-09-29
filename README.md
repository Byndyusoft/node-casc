# node-casc

[![npm@latest](https://img.shields.io/npm/v/@byndyusoft/casc/latest.svg)](https://www.npmjs.com/package/@byndyusoft/casc)
[![test workflow](https://github.com/Byndyusoft/node-casc/workflows/test%20workflow/badge.svg)](https://github.com/Byndyusoft/node-casc/actions)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

_Configuration as Code_ solution for _Node.js_ (_and not just_) :pencil: :gear:

<!-- @import "[TOC]" {cmd="toc" depthFrom=1 depthTo=6 orderedList=false} -->

<!-- code_chunk_output -->

- [node-casc](#node-casc)
  - [Introduction](#introduction)
    - [Comparison with Helm](#comparison-with-helm)
  - [Requirements](#requirements)
  - [Install](#install)
    - [Releases](#releases)
  - [Quick start](#quick-start)
    - [CASC directory structure](#casc-directory-structure)
      - [Add files to `.gitignore`](#add-files-to-gitignore)
    - [config.yaml](#configyaml)
    - [settings.yaml](#settingsyaml)
      - [`file` private or public key reading strategies](#file-private-or-public-key-reading-strategies)
      - [`env` private key reading strategy](#env-private-key-reading-strategy)
    - [values.yaml and values.override.yaml](#valuesyaml-and-valuesoverrideyaml)
  - [Usage](#usage)
    - [CLI](#cli)
      - [Build config](#build-config)
      - [Init CASC directory](#init-casc-directory)
      - [Init RSA keys](#init-rsa-keys)
      - [Decrypt values](#decrypt-values)
      - [Encrypt values](#encrypt-values)
    - [Library](#library)
      - [How to build config](#how-to-build-config)
  - [Maintainers](#maintainers)

<!-- /code_chunk_output -->

## Introduction

Source code of the microservice and its configuration for different environments must be versioned and deployed from the same commit. This project takes care of generating config from a template and managing values for different environments.

### Comparison with Helm

Why don't we just use Helm? Helm is heavily dependent on Kubernetes and this creates problems for various local scripts and migrating applications from Kubernetes to PaaS.

| Feature                          | Helm         | node-casc    |
| -------------------------------- | ------------ | ------------ |
| Container Orchestration Platform | Kubernetes   | No limits    |
| Microservice runtime             | No limits    | No limits    |
| Runtime for configuration        | No limits    | Node.js      |
| Template language                | Go templates | Handlebars   |
| Output config format             | No limits    | YAML or JSON |
| Support secret variables         | Plugin       | Built-in     |
| Cryptography algorithm           | No limits    | RSA          |
| Plugins                          | Yes          | No           |

## Requirements

- Node.js v12 LTS or later
- npm or yarn

## Install

```bash
npm install @byndyusoft/casc
```

or

```bash
yarn add @byndyusoft/casc
```

### Releases

From [releases](https://github.com/Byndyusoft/node-casc/releases/latest) you can download:

- standalone version for Linux, Alpine, Windows and macOS
- npm package tarball

## Quick start

Execute in your terminal to initialize CASC directory:

```bash
casc init:dir
```

By default CASC directory is `$(pwd)/.casc`.

### CASC directory structure

- `keys/` - directory with public and private keys for encrypting and decrypting secret values
- `.env` - override `values.override.yaml` through `process.env` (see [dotenv](https://www.npmjs.com/package/dotenv) for syntax)
- `config.yaml` - application config (see [Handlebars](https://www.npmjs.com/package/handlebars) for syntax)
- `settings.yaml` - CASC settings
- `values.yaml` - values for `config.yaml`
- `values.override.yaml` - override `values.yaml`

#### Add files to `.gitignore`

- your private key
- `.env`
- `values.override.yaml`

### config.yaml

Handlebars helpers:

- `exists` - checks that all values exists

### settings.yaml

Default settings:

```yaml
crypto:
  strategy: rsa

privateKey:
  format: pkcs8-private-pem
  strategies:
    file: private.pem
    env: CASC_PRIVATE_KEY

publicKey:
  format: pkcs8-public-pem
  strategies:
    file: public.pem
```

Properties:

- `crypto.strategy` - asymmetric cryptography algorithm, only `rsa` supported
- `privateKey.format` - private key format, `rsa` supports only `pkcs8-private-pem`
- `privateKey.strategies`
  - key of this object is name of private key reading strategy (the order of the keys depends on the order in which the strategies are applied)
  - value of this object is settings for strategy
- `publicKey.format` - public key format, `rsa` supports only `pkcs8-public-pem`
- `publicKey.strategies`
  - key of this object is name of public key reading strategy (the order of the keys depends on the order in which the strategies are applied)
  - value of this object is settings for strategy

#### `file` private or public key reading strategies

Strategy settings are a string or an array of strings, where each item is a path to a private or public key. The first found key will be read. If the path is relative, then it will be relative to the `keys/` directory.

#### `env` private key reading strategy

Strategy settings are a string or an array of strings, where each item is a key of `process.env`. The first found key will be read.

### values.yaml and values.override.yaml

Example structure:

```yaml
VALUE_NAME:
  env_name: some value
  other_env_name:
    - some host 1
    - some host 2
    - some host 3
  env_name_with_encrypted_value*: 6JM8YlugHyjnzatv/nOB7A==
  env_name_with_decrypted_value!: secret value
  default: default value if current environment is not found
```

Only english letters, digits and underscores are allowed in value names and environments. The digits at the beginning is prohibited. Values can only be strings, numbers, booleans, nulls, or their arrays.

## Usage

### CLI

We do recommend using this project as a CLI in order to avoid inadvertently affecting your application.

#### Build config

```text
USAGE
  $ casc config:build

OPTIONS
  -c, --cascDir=cascDir    [default: /app/.casc] CASC directory
  -e, --env=env            (required) environment
  -o, --override=override  [default: true] override values
  -y, --yaml=yaml          [default: false] YAML output instead JSON
```

#### Init CASC directory

```text
USAGE
  $ casc init:dir

OPTIONS
  -c, --cascDir=cascDir  [default: /app/.casc] CASC directory
```

#### Init RSA keys

```text
USAGE
  $ casc init:keys:rsa

OPTIONS
  -b, --bits=bits           [default: 2048] RSA key size in bits
  -c, --cascDir=cascDir     [default: /app/.casc] CASC directory
  -f, --format=(pkcs8-pem)  [default: pkcs8-pem] keys format
```

#### Decrypt values

```text
USAGE
  $ casc values:decrypt

OPTIONS
  -c, --cascDir=cascDir  [default: /app/.casc] CASC directory
  -y, --yaml=yaml        [default: true] YAML output instead JSON
```

#### Encrypt values

```text
USAGE
  $ casc values:encrypt

OPTIONS
  -c, --cascDir=cascDir  [default: /app/.casc] CASC directory
  -y, --yaml=yaml        [default: true] YAML output instead JSON
```

### Library

We do not recommend using this project as a library in order to avoid inadvertently affecting your application.

#### How to build config

```typescript
import "reflect-metadata";

import {
  container,
  IConfigBuilder,
  IConfigBuilderToken,
  IContextBuilder,
  IContextBuilderToken,
  IValuesReader,
  IValuesReaderToken,
} from "@byndyusoft/casc";

const configBuilder = container.resolve<IConfigBuilder>(IConfigBuilderToken);
const contextBuilder = container.resolve<IContextBuilder>(IContextBuilderToken);
const valuesReader = container.resolve<IValuesReader>(IValuesReaderToken);

const config = await configBuilder.build(
  await contextBuilder.build(
    process.env.NODE_ENV,
    await valuesReader.read(true),
  ),
);

console.log(config);
```

## Maintainers

- [@Byndyusoft/owners](https://github.com/orgs/Byndyusoft/teams/owners) <<github.maintain@byndyusoft.com>>
- [@Byndyusoft/team](https://github.com/orgs/Byndyusoft/teams/team)
