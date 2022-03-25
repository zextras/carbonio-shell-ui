// SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
//
// SPDX-License-Identifier: AGPL-3.0-only

library(
    identifier: 'zapp-jenkins-lib@github-pipeline-v3',
    retriever: modernSCM([
        $class: 'GitSCMSource',
        remote: 'git@bitbucket.org:zextras/zapp-jenkins-lib.git',
        credentialsId: 'tarsier_bot-ssh-key'
    ])
)

zappPipeline(
  publishOnNpm: true
)
