<!--
SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>

SPDX-License-Identifier: AGPL-3.0-only
-->
<div align="center">
  <h1>Carbonio Shell UI</h1>
</div>

The main Carbonio Web Client interface

<p align="center">
  <a href="https://github.com/zextras/carbonio-shell-ui/graphs/contributors" alt="Contributors">
  <img src="https://img.shields.io/github/contributors/zextras/carbonio-shell-ui" /></a>
  <a href="https://github.com/zextras/carbonio-shell-ui/pulse" alt="Activity">
  <img src="https://img.shields.io/github/commit-activity/m/zextras/carbonio-shell-ui" /></a>
  <img src="https://img.shields.io/badge/license-AGPL%203-green" alt="License AGPL 3">
  <img src="https://img.shields.io/badge/project-carbonio-informational" alt="Project Carbonio">
  <a href="https://twitter.com/intent/follow?screen_name=zextras">
  <img src="https://img.shields.io/twitter/follow/zextras?style=social&logo=twitter" alt="Follow on Twitter"></a>
</p>
<h3>How to build</h3>

<h4>Setup</h4>

- clone the repo

- install the dependencies:

```
nvm use
npm install
```

<h4>Watch Mode</h4>

```
npm run start -- -h <host>
```

The host parameter is required to proxy requests and content from an existing Carbonio installation.

<h4>Deploy</h4>

To deploy to a host:

```
npm run deploy -- -h <host>
```

The host parameter is required to proxy requests and content from an existing Carbonio installation.

<h4>Build</h4>

```
npm run build
```

<h2>License</h2>

Released under the AGPL-3.0-only license as specified here: LICENSES/AGPL-3.0-only.txt.
