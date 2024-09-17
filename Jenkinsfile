// SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
//
// SPDX-License-Identifier: AGPL-3.0-only

library(
    identifier: 'zapp-jenkins-lib@github-pipeline-v4',
    retriever: modernSCM([
        $class: 'GitSCMSource',
        remote: 'git@github.com:zextras/jenkins-zapp-lib.git',
        credentialsId: 'jenkins-integration-with-github-account'
    ])
)

withCredentials([string(credentialsId: 'posthog-api-token', variable: 'POSTHOG_API_KEY')]) {
    zappPipeline(
      publishOnNpm: true,
      disableAutoTranslationsSync: true
    )
}
