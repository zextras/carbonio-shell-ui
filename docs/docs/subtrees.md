---
title: Subtrees
---

Shell uses some projects as subtrees in order to improve the development.

In this page You will found the commands useful to manage them.

## @zextras/zapp-ui
### Pull
```bash
git fetch @zextras/zapp-ui
git subtree pull --prefix zapp-ui/ @zextras/zapp-ui release --squash
```
### Push
```bash
git subtree push --prefix=zapp-ui/ @zextras/zapp-ui my-feature-branch-for-PR
```
### Configure
#### Remote
```bash
git remote add -f @zextras/zapp-ui git@bitbucket.org:zextras/zapp-ui.git
```
#### Add
```bash
git subtree add --prefix zapp-ui/ @zextras/zapp-ui release --squash
```
