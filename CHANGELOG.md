# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [3.2.2](https://github.com/zextras/carbonio-shell-ui/compare/v3.2.1...v3.2.2) (2023-07-17)

### [3.2.1](https://github.com/zextras/carbonio-shell-ui/compare/v3.2.0...v3.2.1) (2023-07-14)


### Bug Fixes

* prevent click on board header only if a move occurs ([9aa05b4](https://github.com/zextras/carbonio-shell-ui/commit/9aa05b421ef6ce323ce7f2780204de6a8e7ec393))

## [3.2.0](https://github.com/zextras/carbonio-shell-ui/compare/v3.1.1...v3.2.0) (2023-07-06)


### Features

* allow the user to resize and move the board ([e266ca8](https://github.com/zextras/carbonio-shell-ui/commit/e266ca8b3f7333cf3ee504dc7bb00ee81797de5d)), closes [#262](https://github.com/zextras/carbonio-shell-ui/issues/262)
* enable cancel action when click outside the confirmation modal ([42e7fae](https://github.com/zextras/carbonio-shell-ui/commit/42e7fae277bbf9a701d31a2a0dab2d7febc19ebf)), closes [#264](https://github.com/zextras/carbonio-shell-ui/issues/264)


### Bug Fixes

* improve general and account settings ([42e757e](https://github.com/zextras/carbonio-shell-ui/commit/42e757e511d3a6cbf8a308bc3fdcb7c2893994e6)), closes [#268](https://github.com/zextras/carbonio-shell-ui/issues/268)
* open search module based on the module you come from ([2b12ec2](https://github.com/zextras/carbonio-shell-ui/commit/2b12ec2b717fb4cda73d9bd009c5b4de209d0a00)), closes [#270](https://github.com/zextras/carbonio-shell-ui/issues/270)
* **settings:** fix UI of out of office section ([2d5d44d](https://github.com/zextras/carbonio-shell-ui/commit/2d5d44d22fec460f4695c7cd2521fe163ad9fe00)), closes [#263](https://github.com/zextras/carbonio-shell-ui/issues/263)
* show a modal on failure of getInfo and getComponents ([2df0658](https://github.com/zextras/carbonio-shell-ui/commit/2df0658f5b4170f6302b764df5085595276a6360)), closes [#251](https://github.com/zextras/carbonio-shell-ui/issues/251)
* **types:** add the signal parameter to the SoapFetch exported type ([0192409](https://github.com/zextras/carbonio-shell-ui/commit/0192409da33cb0bc131f884f3b17ffb497ad7b63)), closes [#273](https://github.com/zextras/carbonio-shell-ui/issues/273)

### [3.1.1](https://github.com/zextras/carbonio-shell-ui/compare/v3.1.0...v3.1.1) (2023-06-05)


### Bug Fixes

* fix feedback board that shows blank page ([ef69922](https://github.com/zextras/carbonio-shell-ui/commit/ef69922f48bf38cc2705aec97aefc74ef17ce551)), closes [#258](https://github.com/zextras/carbonio-shell-ui/issues/258)

## [3.1.0](https://github.com/zextras/carbonio-shell-ui/compare/v3.0.2...v3.1.0) (2023-05-25)


### Features

* improve board tabs behavior ([a60331c](https://github.com/zextras/carbonio-shell-ui/commit/a60331ce3e91ece0c2f1c96b66b9bad5a080b943)), closes [#248](https://github.com/zextras/carbonio-shell-ui/issues/248)


### Bug Fixes

* do not unmount boards in mobile responsive mode ([697e1e0](https://github.com/zextras/carbonio-shell-ui/commit/697e1e08e210b24ce144145c336c7f084c4aeb4b)), closes [#239](https://github.com/zextras/carbonio-shell-ui/issues/239)

### [3.0.2](https://github.com/zextras/carbonio-shell-ui/compare/v3.0.1...v3.0.2) (2023-05-03)


### Bug Fixes

* reset polling interval to the user default setting when a request does not fail ([ea81c89](https://github.com/zextras/carbonio-shell-ui/commit/ea81c899491555452fc8b682cd553309e0380174))
* set a longer interval between failing NoOp requests ([846fe18](https://github.com/zextras/carbonio-shell-ui/commit/846fe18d04b2c59a95f19a1d51ac631d6da7f9a8))
* update noop interval management ([819376c](https://github.com/zextras/carbonio-shell-ui/commit/819376c61fe493590d46f7552c0a4e2a20684422))

### [3.0.1](https://github.com/zextras/carbonio-shell-ui/compare/v3.0.0...v3.0.1) (2023-04-27)

## [3.0.0](https://github.com/zextras/carbonio-shell-ui/compare/v2.1.1...v3.0.0) (2023-04-24)


### ⚠ BREAKING CHANGES

* **deps:** bump tinymce to v6
* **deps:** major bump of i18next and related deps (external dependency)
* **deps:** bump react-redux to v8 (external dependency)

### Bug Fixes

* call noOp request on update view action ([b698224](https://github.com/zextras/carbonio-shell-ui/commit/b698224c4a16e7e53f9839850a114ba227eb9297)), closes [#234](https://github.com/zextras/carbonio-shell-ui/issues/234)
* preserve location changing module ([29cf18a](https://github.com/zextras/carbonio-shell-ui/commit/29cf18a77a36d3b3abadfee0b0273c1411fe23ac)), closes [#235](https://github.com/zextras/carbonio-shell-ui/issues/235)
* remove click in favor of onClick ([72decaa](https://github.com/zextras/carbonio-shell-ui/commit/72decaadc1a50aaeaaa004eaa97e85f367d7ba28)), closes [#226](https://github.com/zextras/carbonio-shell-ui/issues/226)
* use fallback closing board tab ([e0357c3](https://github.com/zextras/carbonio-shell-ui/commit/e0357c3d83072746b4afa9fb0e69b86695a762d8)), closes [#232](https://github.com/zextras/carbonio-shell-ui/issues/232)


### build

* **deps:** update dependencies ([a7554b5](https://github.com/zextras/carbonio-shell-ui/commit/a7554b530b34cf5c71606b69fdd8e39d16c6ae8d)), closes [#209](https://github.com/zextras/carbonio-shell-ui/issues/209)

### [2.1.1](https://github.com/zextras/carbonio-shell-ui/compare/v2.1.0...v2.1.1) (2023-04-11)

## [2.1.0](https://github.com/zextras/carbonio-shell-ui/compare/v2.0.3...v2.1.0) (2023-03-29)


### Features

* move up board icon in primary bar ([5504915](https://github.com/zextras/carbonio-shell-ui/commit/5504915817a181fad5e0eb41c7a7fbc08a0fbda2)), closes [#221](https://github.com/zextras/carbonio-shell-ui/issues/221)
* **settings:** list delegated addresses of sendOfBehalfOf type ([3b29895](https://github.com/zextras/carbonio-shell-ui/commit/3b298953cc6cf8f868811db07fdef1b44754ef67)), closes [#227](https://github.com/zextras/carbonio-shell-ui/issues/227)
* **whitelabel:** use favicon loaded from configs as default for notifications ([e2ffcf6](https://github.com/zextras/carbonio-shell-ui/commit/e2ffcf66120db25dfbb1c8408d12f8eae0aa4470)), closes [#220](https://github.com/zextras/carbonio-shell-ui/issues/220)

### [2.0.3](https://github.com/zextras/carbonio-shell-ui/compare/v2.0.2...v2.0.3) (2023-03-17)


### Bug Fixes

* handle linkfolder created ([9ed09d3](https://github.com/zextras/carbonio-shell-ui/commit/9ed09d3978287661b080adf9af7ce3181bd3360c))

### [2.0.2](https://github.com/zextras/carbonio-shell-ui/compare/v2.0.1...v2.0.2) (2023-03-13)

### [2.0.1](https://github.com/zextras/carbonio-shell-ui/compare/v2.0.0...v2.0.1) (2023-03-02)


### Bug Fixes

* add space in suggested separators of search bar ([f74dfe2](https://github.com/zextras/carbonio-shell-ui/commit/f74dfe28bb7f36c3b43e608914c86461098af124)), closes [#216](https://github.com/zextras/carbonio-shell-ui/issues/216)

## [2.0.0](https://github.com/zextras/carbonio-shell-ui/compare/v1.1.1...v2.0.0) (2023-02-28)


### ⚠ BREAKING CHANGES

* remove [key: string] index signature in Action type and add deprecated click key
* remove registerHooks, removeHooks, getIntegratedHook and useIntegratedHook

### Features

* remove module package name from settings ([5f41cfa](https://github.com/zextras/carbonio-shell-ui/commit/5f41cfa8f2e200a87bfff81c84011122e0434078)), closes [#210](https://github.com/zextras/carbonio-shell-ui/issues/210)


### Bug Fixes

* clean integrations store ([29a8d4d](https://github.com/zextras/carbonio-shell-ui/commit/29a8d4df0fab854501c6379d90bdcbe400edf1d6)), closes [#207](https://github.com/zextras/carbonio-shell-ui/issues/207)
* **folders:** handle creation of link folders ([8160dcd](https://github.com/zextras/carbonio-shell-ui/commit/8160dcdf749b74a3e2443f1781ab77b10f31c539)), closes [#203](https://github.com/zextras/carbonio-shell-ui/issues/203)


* remove [key: string] index signature in Action type and add deprecated click key ([4706a54](https://github.com/zextras/carbonio-shell-ui/commit/4706a546370787f5b9433eb51f314a32c84345c4)), closes [#208](https://github.com/zextras/carbonio-shell-ui/issues/208)

### [1.1.1](https://github.com/zextras/carbonio-shell-ui/compare/v1.1.0...v1.1.1) (2023-02-13)

## [1.1.0](https://github.com/zextras/carbonio-shell-ui/compare/v1.0.0...v1.1.0) (2023-02-02)


### Features

* change the shell header multibutton to always display new ([29ceeea](https://github.com/zextras/carbonio-shell-ui/commit/29ceeea0c41420c620e722fa581f58e72ae19455)), closes [#197](https://github.com/zextras/carbonio-shell-ui/issues/197)
* **whitelabel:** set primary color on theme based on login config ([2ef5645](https://github.com/zextras/carbonio-shell-ui/commit/2ef564533dbfdbc235b415f7bdf2b94c067be76a)), closes [#178](https://github.com/zextras/carbonio-shell-ui/issues/178)


### Bug Fixes

* avoid loading fonts from ds to prevent slow loading of module ([e0621c3](https://github.com/zextras/carbonio-shell-ui/commit/e0621c34410fd2bb96223c5441616d695252df5e)), closes [#193](https://github.com/zextras/carbonio-shell-ui/issues/193)
* **Composer:** avoid transformation of links to relative urls ([da63bf9](https://github.com/zextras/carbonio-shell-ui/commit/da63bf9d731477e309db437996821c969df43b1f)), closes [#187](https://github.com/zextras/carbonio-shell-ui/issues/187)
* handle management of links when received from notify ([6eef7e7](https://github.com/zextras/carbonio-shell-ui/commit/6eef7e7be4bdb94b65e1e38d1434362c0adfda0c)), closes [#191](https://github.com/zextras/carbonio-shell-ui/issues/191)
* reinstated hook ([48763f9](https://github.com/zextras/carbonio-shell-ui/commit/48763f9cc2013754b88f36bc7f875e5d69e672cb)), closes [#190](https://github.com/zextras/carbonio-shell-ui/issues/190)
* **types:** fixup types ([#195](https://github.com/zextras/carbonio-shell-ui/issues/195)) ([ae3f2ca](https://github.com/zextras/carbonio-shell-ui/commit/ae3f2ca0c960065fb49bc611192f02e41ec5296e))
* updated standard colors ([#189](https://github.com/zextras/carbonio-shell-ui/issues/189)) ([dc9aef1](https://github.com/zextras/carbonio-shell-ui/commit/dc9aef11fd7c22d5b0c3d6692f94711b4d0a4b7a))
* use controlled mode select ([e8bacf4](https://github.com/zextras/carbonio-shell-ui/commit/e8bacf4596b97c00e4271b70813a757e808c51f1)), closes [#192](https://github.com/zextras/carbonio-shell-ui/issues/192)
* use DS local fonts instead of downloading them from third-party source ([4933726](https://github.com/zextras/carbonio-shell-ui/commit/493372668dc89caeaf88303ebe94250fb2731e2d)), closes [#184](https://github.com/zextras/carbonio-shell-ui/issues/184)

## [1.0.0](https://github.com/zextras/carbonio-shell-ui/compare/v0.4.46...v1.0.0) (2023-01-16)

### [0.4.46](https://github.com/zextras/carbonio-shell-ui/compare/v0.4.45...v0.4.46) (2023-01-05)


### Features

* added localization to tinymce editor ([#175](https://github.com/zextras/carbonio-shell-ui/issues/175)) ([de461ed](https://github.com/zextras/carbonio-shell-ui/commit/de461edf8dc7313d45895b959e81b31c324e6a28))
* register locales and set default for DateTimePickers ([349c9d6](https://github.com/zextras/carbonio-shell-ui/commit/349c9d64184912402784fdbf434e0ee901363fe1)), closes [#174](https://github.com/zextras/carbonio-shell-ui/issues/174)
* **settings:** choose the "from" address within all the available addresses ([ce36e6d](https://github.com/zextras/carbonio-shell-ui/commit/ce36e6d81cb2c3716bc1859a9815efbdfd53fdeb)), closes [#177](https://github.com/zextras/carbonio-shell-ui/issues/177)


### Bug Fixes

* fixing tag type ([#173](https://github.com/zextras/carbonio-shell-ui/issues/173)) ([c1f2e57](https://github.com/zextras/carbonio-shell-ui/commit/c1f2e57b051892f1a2645fdad2e7aecbef49861a))
* search button is enabled as soon as there is text in the search input ([#176](https://github.com/zextras/carbonio-shell-ui/issues/176)) ([0ada026](https://github.com/zextras/carbonio-shell-ui/commit/0ada0265e5c577db5f54e886cac06f9f8067cd72))

### [0.4.45](https://github.com/zextras/carbonio-shell-ui/compare/v0.4.44...v0.4.45) (2022-12-06)


### Bug Fixes

* edit roboto resource link to be non blocking ([98622a8](https://github.com/zextras/carbonio-shell-ui/commit/98622a84dd5f77bbcce19e7cffa2cbc41cc192e1)), closes [#169](https://github.com/zextras/carbonio-shell-ui/issues/169)

### [0.4.44](https://github.com/zextras/carbonio-shell-ui/compare/v0.4.43...v0.4.44) (2022-11-24)


### Features

* add setting to change base font size for scaling ([caff759](https://github.com/zextras/carbonio-shell-ui/commit/caff7594716655dff84c437753e175dd29a19092)), closes [#156](https://github.com/zextras/carbonio-shell-ui/issues/156)
* added abort signal to getsoapfetch ([#166](https://github.com/zextras/carbonio-shell-ui/issues/166)) ([3c039e1](https://github.com/zextras/carbonio-shell-ui/commit/3c039e1fa124d4efeec2f4f251193bbf27f8c8d5))
* added bottom padding to secondary bar ([#165](https://github.com/zextras/carbonio-shell-ui/issues/165)) ([58b07d4](https://github.com/zextras/carbonio-shell-ui/commit/58b07d40189bb74a23044c6a5d26ed0a76fbf361))
* added data-testid for E2E tests ([#155](https://github.com/zextras/carbonio-shell-ui/issues/155)) ([3042aa6](https://github.com/zextras/carbonio-shell-ui/commit/3042aa697c3ed7e55342d698e2d111451f5d1527))
* **whitelabel:** use configs to set logo, title, favicon and dark mode default ([9b1a235](https://github.com/zextras/carbonio-shell-ui/commit/9b1a235fb61a7ebf75eb760fe7aab4120a04a374)), closes [#162](https://github.com/zextras/carbonio-shell-ui/issues/162)


### Bug Fixes

* apply dark mode preview when changed to initial value ([e99e80f](https://github.com/zextras/carbonio-shell-ui/commit/e99e80ff4c9b64675062c8aff8e5d9da3ac2ba16)), closes [#163](https://github.com/zextras/carbonio-shell-ui/issues/163)
* fixed logout ([#164](https://github.com/zextras/carbonio-shell-ui/issues/164)) ([e75dca6](https://github.com/zextras/carbonio-shell-ui/commit/e75dca6d0d676237358d4276a1b037fad95e4fc2))
* remember to stop watching for the system color scheme ([#161](https://github.com/zextras/carbonio-shell-ui/issues/161)) ([a0c61ae](https://github.com/zextras/carbonio-shell-ui/commit/a0c61ae9d289b2be00ce05797bf4c42eca1c12b8))

### [0.4.43](https://github.com/zextras/carbonio-shell-ui/compare/v0.4.42...v0.4.43) (2022-11-15)


### Features

* convert px to rem ([#145](https://github.com/zextras/carbonio-shell-ui/issues/145)) ([79240e9](https://github.com/zextras/carbonio-shell-ui/commit/79240e98ea7195b13e20d467f116e20dfcd939d3))

### [0.4.42](https://github.com/zextras/carbonio-shell-ui/compare/v0.4.41...v0.4.42) (2022-11-10)


### Bug Fixes

* chips in search are splitted if typed ([#148](https://github.com/zextras/carbonio-shell-ui/issues/148)) ([81485a1](https://github.com/zextras/carbonio-shell-ui/commit/81485a138a577c0f8c45df069fbedd80db359fc2))

### [0.4.41](https://github.com/zextras/carbonio-shell-ui/compare/v0.4.40...v0.4.41) (2022-11-10)

### [0.4.40](https://github.com/zextras/carbonio-shell-ui/compare/v0.4.39...v0.4.40) (2022-10-26)


### Bug Fixes

* fixed translation function and contexts ([b1165d7](https://github.com/zextras/carbonio-shell-ui/commit/b1165d717aa370f2e79f360014827cdf1ae7d7af))

### [0.4.39](https://github.com/zextras/carbonio-shell-ui/compare/v0.4.38...v0.4.39) (2022-10-17)


### Bug Fixes

* exports fix ([#137](https://github.com/zextras/carbonio-shell-ui/issues/137)) ([cf4ca25](https://github.com/zextras/carbonio-shell-ui/commit/cf4ca2568599f7041741d3ef6a69c7e3dd1ded68))
* manage soap errors ([#138](https://github.com/zextras/carbonio-shell-ui/issues/138)) ([b26ed75](https://github.com/zextras/carbonio-shell-ui/commit/b26ed75a061a7b01e2e2c1205e5e8a33efa8904f))

### [0.4.38](https://github.com/zextras/carbonio-shell-ui/compare/v0.4.37...v0.4.38) (2022-10-12)

### [0.4.37](https://github.com/zextras/carbonio-shell-ui/compare/v0.4.36...v0.4.37) (2022-09-28)


### Features

* code and UI alignment to the design system's new version ([#94](https://github.com/zextras/carbonio-shell-ui/issues/94)) ([da1e62d](https://github.com/zextras/carbonio-shell-ui/commit/da1e62d29f8d4149baf56e31371425143e24e046))


### Bug Fixes

* providing modal manager and snackbar manager to shell routes ([46be7f6](https://github.com/zextras/carbonio-shell-ui/commit/46be7f64432f00f83e03df62a8c4a514a82b9503))
* using same modal and snackbar manager for apps and boards ([#132](https://github.com/zextras/carbonio-shell-ui/issues/132)) ([4715f80](https://github.com/zextras/carbonio-shell-ui/commit/4715f800f8ac6cf85ff6ff6bb1e198e6179a9f4d))

### [0.4.36](https://github.com/zextras/carbonio-shell-ui/compare/v0.4.35...v0.4.36) (2022-09-15)

### [0.4.35](https://github.com/zextras/carbonio-shell-ui/compare/v0.4.34...v0.4.35) (2022-09-14)

### [0.4.34](https://github.com/zextras/carbonio-shell-ui/compare/v0.4.33...v0.4.34) (2022-08-31)


### Features

* add sorting to mails folders ([4e8d9da](https://github.com/zextras/carbonio-shell-ui/commit/4e8d9daa46260b1a5385ec36b0040e4ee3f6902b))
* added inline support in composer ([fff3b3e](https://github.com/zextras/carbonio-shell-ui/commit/fff3b3e30f9cc70d1d2175bdf8e032b78b625681))
* composer prefilled with styles as per user settings ([#120](https://github.com/zextras/carbonio-shell-ui/issues/120)) ([cee27aa](https://github.com/zextras/carbonio-shell-ui/commit/cee27aa05819af49bf2eb4e8111395a6c8191eff))
* second row with account email ([75e80a9](https://github.com/zextras/carbonio-shell-ui/commit/75e80a9dc43978aa44b89163808a91caf92133a1))
* used multiline editor for out of office message ([9480c19](https://github.com/zextras/carbonio-shell-ui/commit/9480c199b139c6091bab0dc7fc0ffe1586d56e07))


### Bug Fixes

* apply the color to folder as per the parent folder color ([4303518](https://github.com/zextras/carbonio-shell-ui/commit/43035183a0abb1c41e469ebf3c625cbe61a9bc87))
* fix type SoapRetentionPolicy ([#119](https://github.com/zextras/carbonio-shell-ui/issues/119)) ([e12f3a3](https://github.com/zextras/carbonio-shell-ui/commit/e12f3a31ee9fecd8ebed490df3991f3767506463))
* integration composer ([ed0ad0f](https://github.com/zextras/carbonio-shell-ui/commit/ed0ad0f7765b25c6dbe98fc2963f955cf1e33aef))

### [0.4.33](https://github.com/zextras/carbonio-shell-ui/compare/v0.4.32...v0.4.33) (2022-08-02)


### Bug Fixes

* keep html format when replying to an email ([4920c37](https://github.com/zextras/carbonio-shell-ui/commit/4920c372d0179b16b4f8850813d7d935ae6bd980))

### [0.4.32](https://github.com/zextras/carbonio-shell-ui/compare/v0.4.31...v0.4.32) (2022-08-01)

### [0.4.31](https://github.com/zextras/carbonio-shell-ui/compare/v0.4.30...v0.4.31) (2022-07-28)


### Bug Fixes

* changing editor block formats options ([06de72e](https://github.com/zextras/carbonio-shell-ui/commit/06de72e18b7c32a9af45bedd7a853a9026f67d99))
* using br instead of p in editor composer ([55cb801](https://github.com/zextras/carbonio-shell-ui/commit/55cb801b944178d5bae191214bfc3f97ef7c082a))

### [0.4.30](https://github.com/zextras/carbonio-shell-ui/compare/v0.4.29...v0.4.30) (2022-07-21)


### Features

* palette and icons for shared and linked content ([#92](https://github.com/zextras/carbonio-shell-ui/issues/92)) ([8098e01](https://github.com/zextras/carbonio-shell-ui/commit/8098e01557c49fe419a41423a6ef9dfbd498ae00))


### Bug Fixes

* composer controlled mode ([d1cb3eb](https://github.com/zextras/carbonio-shell-ui/commit/d1cb3eb3bc994b2e467f5223ecc1c4de1344ad5a))
* using pre as editor block format ([1e2c5c9](https://github.com/zextras/carbonio-shell-ui/commit/1e2c5c933dcacb66e033de74fe62bc8d1329a6ac))

### [0.4.29](https://github.com/zextras/carbonio-shell-ui/compare/v0.4.28...v0.4.29) (2022-06-20)

### [0.4.28](https://github.com/zextras/carbonio-shell-ui/compare/v0.4.27...v0.4.28) (2022-06-14)


### Features

* enable vietname language support ([f3f4845](https://github.com/zextras/carbonio-shell-ui/commit/f3f48454d188b08e292e3a108bffd2ac6359c697))

### [0.4.27](https://github.com/zextras/carbonio-shell-ui/compare/v0.4.26...v0.4.27) (2022-06-09)


### Features

* standalone mode ([#79](https://github.com/zextras/carbonio-shell-ui/issues/79)) ([b904928](https://github.com/zextras/carbonio-shell-ui/commit/b904928220ff995311234a5d96745c6ad3443916))


### Bug Fixes

* app loading in non-standalone mode ([a64a024](https://github.com/zextras/carbonio-shell-ui/commit/a64a024615ce97ed405b84ddecf72254f7daf6f0))
* close suggestions in search on enter key ([b42c8c4](https://github.com/zextras/carbonio-shell-ui/commit/b42c8c4a052f22a25df50fa1319b33cd83136e7a))
* fixed unwanted trigger of navguard in settings ([65d7c1f](https://github.com/zextras/carbonio-shell-ui/commit/65d7c1f39cd9e7ccccaac8072932596793861de1))
* i18next json compatibility ([4d9816e](https://github.com/zextras/carbonio-shell-ui/commit/4d9816eddef95d0f2ecd6bbc5d50c053d41a165a))
* sdk 1.2.4 ([c8fd921](https://github.com/zextras/carbonio-shell-ui/commit/c8fd921f59d19dd0333ddec78759f8af5b6c0c3d))

### [0.4.26](https://github.com/zextras/carbonio-shell-ui/compare/v0.4.25...v0.4.26) (2022-05-25)


### Bug Fixes

* sdk 1.2.4 ([122eadb](https://github.com/zextras/carbonio-shell-ui/commit/122eadba9d661374668a1efb8498301a3910b259))

### [0.4.25](https://github.com/zextras/carbonio-shell-ui/compare/v0.4.24...v0.4.25) (2022-05-24)

### [0.4.24](https://github.com/zextras/carbonio-shell-ui/compare/v0.4.23...v0.4.24) (2022-05-24)


### Bug Fixes

* svg loader ([1e4f3d6](https://github.com/zextras/carbonio-shell-ui/commit/1e4f3d6e3aa862b561b2739f992c54e7099a971d))

### [0.4.23](https://github.com/zextras/carbonio-shell-ui/compare/v0.4.22...v0.4.23) (2022-05-24)

### [0.4.22](https://github.com/zextras/carbonio-shell-ui/compare/v0.4.21...v0.4.22) (2022-05-24)

### [0.4.21](https://github.com/zextras/carbonio-shell-ui/compare/v0.4.20...v0.4.21) (2022-05-24)

### [0.4.20](https://github.com/zextras/carbonio-shell-ui/compare/v0.4.19...v0.4.20) (2022-05-23)


### Bug Fixes

* theme is saving correctly ([5a5dc83](https://github.com/zextras/carbonio-shell-ui/commit/5a5dc83c12f1617bf66d6ca7b05f0c711f8f1cc3))

### [0.4.19](https://github.com/zextras/carbonio-shell-ui/compare/v0.4.18...v0.4.19) (2022-05-20)

### [0.4.18](https://github.com/zextras/carbonio-shell-ui/compare/v0.4.17...v0.4.18) (2022-05-20)


### Bug Fixes

* i18n handling of missing keys ([ed35bbd](https://github.com/zextras/carbonio-shell-ui/commit/ed35bbd06c743c4759fda82cb33f13851cce6032))

### [0.4.17](https://github.com/zextras/carbonio-shell-ui/compare/v0.4.16...v0.4.17) (2022-05-12)

### [0.4.16](https://github.com/zextras/carbonio-shell-ui/compare/v0.4.15...v0.4.16) (2022-05-12)


### Features

* added item customization callback to folder accordion hook ([94c0e03](https://github.com/zextras/carbonio-shell-ui/commit/94c0e039d897fcbf65da5778c39e5f474a3fd71c))


### Bug Fixes

* added exports to useUserSetting and getUserSetting ([1eb46cf](https://github.com/zextras/carbonio-shell-ui/commit/1eb46cfb8562273295835c13911e64744acc13a6))
* disableHover flag on root accordion items ([dff2ee0](https://github.com/zextras/carbonio-shell-ui/commit/dff2ee0dac9d2e5a2783289b65299222cc75dc98))
* useLocalStorage ([03bbc8e](https://github.com/zextras/carbonio-shell-ui/commit/03bbc8e1f9076094623258861bd011bb7f336558))

### [0.4.15](https://github.com/zextras/carbonio-shell-ui/compare/v0.4.14...v0.4.15) (2022-05-11)


### Features

* preserve pathname on route change ([a2c3252](https://github.com/zextras/carbonio-shell-ui/commit/a2c32527e80c720ce4f3fc2701112c50a78e31a5))


### Bug Fixes

* "out of office" options behaviour ([3d839f0](https://github.com/zextras/carbonio-shell-ui/commit/3d839f083612a2a1cd7a926043bd5a532e062d5a))
* added condition to skip undefined rendering ([7202394](https://github.com/zextras/carbonio-shell-ui/commit/72023946577d09b3e592e29411cef233f0230569))
* change search route when search module is change ([9edc83d](https://github.com/zextras/carbonio-shell-ui/commit/9edc83d7d3235fe88d46adaaddf46da911af6c9e))
* folder hooks and sorting ([c7b3879](https://github.com/zextras/carbonio-shell-ui/commit/c7b38792c299956cab418e59b16c9eb7e04e05bd))
* runSearch hook pushHistory arguments corrected ([4574af4](https://github.com/zextras/carbonio-shell-ui/commit/4574af47db43ab4d440a37471a5a723b27e65bc8))
* saveChanges modal trigger on switching settings apps ([2a874be](https://github.com/zextras/carbonio-shell-ui/commit/2a874be9dde4a5537ed8d142bf3a7e3a99cd7c21))
* searchbar queryFilter query fix onSearch ([7f5196f](https://github.com/zextras/carbonio-shell-ui/commit/7f5196feb915e8ea10c0ef98b94c55df807a382d))

### [0.4.14](https://github.com/zextras/carbonio-shell-ui/compare/v0.4.13...v0.4.14) (2022-05-02)


### Bug Fixes

* routing inside search module ([b66206e](https://github.com/zextras/carbonio-shell-ui/commit/b66206e5039801e7be4d1533ea9ce1671012b75d))

### [0.4.13](https://github.com/zextras/carbonio-shell-ui/compare/v0.4.12...v0.4.13) (2022-04-27)

### [0.4.12](https://github.com/zextras/carbonio-shell-ui/compare/v0.4.11...v0.4.12) (2022-04-26)

### [0.4.11](https://github.com/zextras/carbonio-shell-ui/compare/v0.4.10...v0.4.11) (2022-04-22)


### Features

* added runSearch function, renamed search folder hooks ([16ca9b9](https://github.com/zextras/carbonio-shell-ui/commit/16ca9b987ba458a463cc1a2ca4422b954a697e3e))


### Bug Fixes

* container alignment in composer ([f97a61f](https://github.com/zextras/carbonio-shell-ui/commit/f97a61f9ff1a1790adce3146cf0c02eb0c7cfa4e))
* disabled password recovery settings ([08898f1](https://github.com/zextras/carbonio-shell-ui/commit/08898f14a9107c77513a2855e0eb60d98bf92b6b))
* missing rte files ([3762d8b](https://github.com/zextras/carbonio-shell-ui/commit/3762d8b36e54bf81f2b3e73fa2e5d5847328068e))
* object assignation on folder notify ([c61287c](https://github.com/zextras/carbonio-shell-ui/commit/c61287cb6fe22cd6e68436ab0ba746d0fede3359))

### [0.4.10](https://github.com/zextras/carbonio-shell-ui/compare/v0.4.9...v0.4.10) (2022-04-14)

### [0.4.9](https://github.com/zextras/carbonio-shell-ui/compare/v0.4.8...v0.4.9) (2022-04-12)

### [0.4.8](https://github.com/zextras/carbonio-shell-ui/compare/v0.4.7...v0.4.8) (2022-04-12)

### [0.4.7](https://github.com/zextras/carbonio-shell-ui/compare/v0.4.6...v0.4.7) (2022-04-12)


### Bug Fixes

* tag worker sync, accordion folder hook syntax ([e462b9b](https://github.com/zextras/carbonio-shell-ui/commit/e462b9bb60f7c688b2031a198b8ecfdfb7bfa392))

### [0.4.6](https://github.com/zextras/carbonio-shell-ui/compare/v0.4.5...v0.4.6) (2022-04-12)


### Features

* account name in  topbar dropdown ([dea2584](https://github.com/zextras/carbonio-shell-ui/commit/dea2584b6aee8bd0fadc8b7cbc83a10aea606854))
* adding data-testid to icons ([31d6857](https://github.com/zextras/carbonio-shell-ui/commit/31d6857e9758850c53e6c2c9526837ed359d7424))


### Bug Fixes

* timezone list replaced with  zimbra timezone enum ([#60](https://github.com/zextras/carbonio-shell-ui/issues/60)) ([ae547bb](https://github.com/zextras/carbonio-shell-ui/commit/ae547bbcaa79589429e154a8db1c955e8d9cba0d))
* updated ds dep ([cb181db](https://github.com/zextras/carbonio-shell-ui/commit/cb181dbe8875d998489227b97a6dc755f70702a2))

### [0.4.5](https://github.com/zextras/carbonio-shell-ui/compare/v0.4.3-rc.0...v0.4.5) (2022-04-01)


### Features

* added tag management ([a989935](https://github.com/zextras/carbonio-shell-ui/commit/a989935fe10954bbbb353ed5fce9c66e08aeb986))
* added updateTag function ([7492c57](https://github.com/zextras/carbonio-shell-ui/commit/7492c57ad4cc4a7f0712a2abfda313383680683a))
* network functions improvement ([99c93d3](https://github.com/zextras/carbonio-shell-ui/commit/99c93d35d6c5606a8357ea1d542b1f25c7537f0a))
* tag webWorker ([a4a7944](https://github.com/zextras/carbonio-shell-ui/commit/a4a7944b113d7a4c329405c087172acfeffa44b8))


### Bug Fixes

* indentation ([631e023](https://github.com/zextras/carbonio-shell-ui/commit/631e023c6f0075c1232b7411bbdec50dac89d42f))
* removed hardcoded labels ([b27113f](https://github.com/zextras/carbonio-shell-ui/commit/b27113f9d6a266ed379b43f7930291ebe482c906))
* removed hardcoded labels ([1d03c2b](https://github.com/zextras/carbonio-shell-ui/commit/1d03c2b00bc81c19af5f68ec4aed3ef04eeae476))
* reset externals in webpack config ([93812a0](https://github.com/zextras/carbonio-shell-ui/commit/93812a0e0bd3c5b97b32e48a90f14532ae2be95f))
* undefined reading 'app' ([8d9069f](https://github.com/zextras/carbonio-shell-ui/commit/8d9069feba2b0cc23fe1a7d775c27626aa7a2ab8))

### [0.4.3-rc.0](https://github.com/zextras/carbonio-shell-ui/compare/v0.4.1-rc.8...v0.4.3-rc.0) (2022-03-18)

### [0.4.1-rc.8](https://github.com/zextras/carbonio-shell-ui/compare/v0.4.1-rc.7...v0.4.1-rc.8) (2022-03-18)

### [0.4.1-rc.7](https://github.com/zextras/carbonio-shell-ui/compare/v0.4.1-rc.6...v0.4.1-rc.7) (2022-03-18)


### Features

* added update view ([734d97c](https://github.com/zextras/carbonio-shell-ui/commit/734d97c436450320513a7b92411ce73d0903f99a))
* enhancements to account settings ([e0549a1](https://github.com/zextras/carbonio-shell-ui/commit/e0549a1d80a45770c3066ab445263a4e9c000ad9))
* few features added to tinymce ([7479a21](https://github.com/zextras/carbonio-shell-ui/commit/7479a2140200f292cbecde81329c945c954367ef))


### Bug Fixes

* added special '500' case to the polling interval handling ([e283a78](https://github.com/zextras/carbonio-shell-ui/commit/e283a78fb10c986ec78be03dc92b84ccf93fd72a))
* catcher throw errors ([eafc584](https://github.com/zextras/carbonio-shell-ui/commit/eafc5847e99158968b3143a7766a5776db28ccf8))
* composer occupying available space ([#30](https://github.com/zextras/carbonio-shell-ui/issues/30)) ([9d6e8bf](https://github.com/zextras/carbonio-shell-ui/commit/9d6e8bf827a60227f5f946d4bf2374c46f2be3ed))
* fixed behaviour of subsections accordion ([fdffddf](https://github.com/zextras/carbonio-shell-ui/commit/fdffddfd88b98ff49b6fd04a0ce3916789794b34))
* fixed nav-guard behaviour around settings subsection ([2205529](https://github.com/zextras/carbonio-shell-ui/commit/220552925999be7ad5100ca2d131b5884d66c7e5))
* remove print button ([a0c3d9e](https://github.com/zextras/carbonio-shell-ui/commit/a0c3d9e2975a26c44e99ed01530c66031a0ec448))

### [0.4.1-rc.6](https://github.com/zextras/carbonio-shell-ui/compare/v0.4.1-rc.5...v0.4.1-rc.6) (2022-03-07)


### Features

* changed behaviour of new button for search and settings modules ([a49d589](https://github.com/zextras/carbonio-shell-ui/commit/a49d589781da33ae83389d26647ce9b8d91af60b))

### [0.4.1-rc.5](https://github.com/zextras/carbonio-shell-ui/compare/v0.4.1-rc.4...v0.4.1-rc.5) (2022-03-04)


### Bug Fixes

* fixed badge on primary bar and collapser postion ([3129236](https://github.com/zextras/carbonio-shell-ui/commit/3129236a973908533aa152982a1a6610c32a3632))

### [0.4.1-rc.4](https://github.com/zextras/carbonio-shell-ui/compare/v0.4.1-rc.1...v0.4.1-rc.4) (2022-02-24)


### Bug Fixes

* badge text color ([72addae](https://github.com/zextras/carbonio-shell-ui/commit/72addae73405a6d4fe2725d795887cadd955b7a9))

### [0.4.1-rc.1](https://github.com/zextras/carbonio-shell-ui/compare/v0.4.1-rc.0...v0.4.1-rc.1) (2022-02-24)


### Bug Fixes

* badge color and selectability ([e053dd0](https://github.com/zextras/carbonio-shell-ui/commit/e053dd04fbecac32512eef247504a0b563ed973b))

### [0.4.1-rc.0](https://github.com/zextras/carbonio-shell-ui/compare/v0.3.0-rc.8...v0.4.1-rc.0) (2022-02-24)


### Bug Fixes

* dev build for the npm prepublish script ([5ea0a37](https://github.com/zextras/carbonio-shell-ui/commit/5ea0a37cf98a8c60d70137bab5c77b683a808cdb))

## [0.3.0-rc.8](https://github.com/zextras/carbonio-shell-ui/compare/v0.3.0-rc.7...v0.3.0-rc.8) (2022-02-24)


### ⚠ BREAKING CHANGES

* **api:** there are significant changes to the api exported to the modules, a complete documentation will be available next sprint

Co-authored-by: Giuliano Caregnato <giuliano.caregnato@zextras.com>

### Features

* added new identities section on account settings ([056912b](https://github.com/zextras/carbonio-shell-ui/commit/056912baf020d8a321aeefbbe13bfc723c377c7e))
* **api:** app management refactor, admin panel entrypoint ([31b667c](https://github.com/zextras/carbonio-shell-ui/commit/31b667c90e7eecffa60bb85886b599f20efb3cf3))


### Bug Fixes

* cleared input debounce on search chip input to avoid race conditions ([4a9de94](https://github.com/zextras/carbonio-shell-ui/commit/4a9de94d5c4e486819b4808d568e11023aa39866))
* update board height ([b080e95](https://github.com/zextras/carbonio-shell-ui/commit/b080e9521b22586b56f8442675167456a58cad45))

## [0.3.0-rc.7](https://github.com/zextras/carbonio-shell-ui/compare/v0.3.0-rc.6...v0.3.0-rc.7) (2022-02-10)


### Features

* french language support added to language settings ([76e89f9](https://github.com/zextras/carbonio-shell-ui/commit/76e89f9661c873f08ddcb25757d28d6f7b898555))

## [0.3.0-rc.6](https://github.com/zextras/carbonio-shell-ui/compare/v0.3.0-rc.5...v0.3.0-rc.6) (2022-01-21)

## [0.3.0-rc.5](https://github.com/zextras/carbonio-shell-ui/compare/v0.3.0-rc.4...v0.3.0-rc.5) (2022-01-21)


### Features

* added beta mark to header logo ([dff28a6](https://github.com/zextras/carbonio-shell-ui/commit/dff28a62942f49134c601e44a8b14071f936b2f7))

## 0.3.0-rc.4 (2022-01-20)


### Features

* first commit ([19b5137](https://github.com/zextras/carbonio-shell-ui/commit/19b5137e21a075f897fb2741f172a1a5fce47fe0))
* implemented search settings in general settings ([d788780](https://github.com/zextras/carbonio-shell-ui/commit/d788780e062e01c2f383b65bd25733d687a2d75b))


### Bug Fixes

* erroneously named chatbar integration ([1304df8](https://github.com/zextras/carbonio-shell-ui/commit/1304df8eea801557a97c297dd78b6e7d7c080978))

# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.
