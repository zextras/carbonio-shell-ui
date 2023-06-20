// SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
//
// SPDX-License-Identifier: AGPL-3.0-only

library(
    identifier: 'zapp-jenkins-lib@dependency-check-report',
    retriever: modernSCM([
        $class: 'GitSCMSource',
        remote: 'git@github.com:zextras/jenkins-zapp-lib.git',
        credentialsId: 'jenkins-integration-with-github-account'
    ])
)

zappPipeline(
  publishOnNpm: true,
  disableAutoTranslationsSync: true
)
