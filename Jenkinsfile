// SPDX-FileCopyrightText: 2025 Zextras <https://www.zextras.com>
//
// SPDX-License-Identifier: AGPL-3.0-only

library(
    identifier: 'jenkins-lib-ui@1.0.9',
    retriever: modernSCM([
        $class: 'GitSCMSource',
        credentialsId: 'jenkins-integration-with-github-account',
        remote: 'git@github.com:zextras/jenkins-lib-ui.git',
    ])
)

withCredentials([string(credentialsId: 'posthog-api-token', variable: 'POSTHOG_API_KEY')]) {
    zappPipeline(
      publishOnNpm: true,
      disableAutoTranslationsSync: true
    )
}
