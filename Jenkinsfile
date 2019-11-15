
def nodeCmd(String cmd) {
    sh '. load_nvm && nvm use && ' + cmd
}

def getCommitParentsCount() {
    return sh(script: '''
        COMMIT_ID=$(git log -1 --oneline | sed 's/ .*//')
        (git cat-file -p $COMMIT_ID | grep -w "parent" | wc -l)
    ''', returnStdout: true).trim()
}

def getCommitVersion() {
    return sh(script: 'git log -1 | grep \'version:\' | sed -n \'s/version://p\' ', returnStdout: true).trim()
}

def getCurrentVersion() {
    return sh(script: 'grep \'"version":\' package.json | sed -n --regexp-extended \'s/.*"version": "([^"]+).*/\\1/p\' ', returnStdout: true).trim()
}

def getRepositoryName() {
    return sh(script: '''#!/bin/bash
            git remote -v | head -n1 | cut -d$'\t' -f2 | cut -d' ' -f1 | sed -e 's!https://bitbucket.org/!!g' -e 's!git@bitbucket.org:!!g' -e 's!.git!!g'
        ''', returnStdout: true).trim()
}

def executeNpmLogin() {
    withCredentials([usernamePassword(credentialsId: 'npm-zextras-bot-auth', usernameVariable: 'AUTH_USERNAME', passwordVariable: 'AUTH_PASSWORD')]) {
        NPM_AUTH_TOKEN = sh(
                script: """
                                            curl -s \
                                                -H "Accept: application/json" \
                                                -H "Content-Type:application/json" \
                                                -X PUT --data \'{"name": "${AUTH_USERNAME}", "password": "${${AUTH_USERNAME}}"}\' \
                                                http://registry.npmjs.com/-/user/org.couchdb.user:${AUTH_USERNAME} 2>&1 | grep -Po \
                                                \'(?<="token": ")[^"]*\'
                                            """,
                returnStdout: true
        ).trim()
    }
    nodeCmd "npm  set //registry.npmjs.com/:_authToken ${NPM_AUTH_TOKEN}"
}

def calculateNextVersion() {
    def currentVersion = getCurrentVersion()
    def commitVersion = getCommitVersion()
    return sh(script: """#!/bin/bash
           if [ x\"$commitVersion\" != x ]; then
               echo \"$commitVersion\"
           else
               MICRO_VERSION=\$( echo $currentVersion | sed --regexp-extended 's/^.*\\.//' )
               NEXT_MICRO_VERSION=\$(( \${MICRO_VERSION} + 1 ))
               MAJOR_MINOR_VERSION=\$( echo $currentVersion | sed --regexp-extended 's/[0-9]+\$//' )
               echo \"\${MAJOR_MINOR_VERSION}\${NEXT_MICRO_VERSION}\"
           fi
       """,
            returnStdout: true).trim()
}

pipeline {
    agent {
        node {
            label 'nodejs-agent-v1'
        }
    }
    options {
        timeout(time: 20, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '50'))
    }
    environment {
        BUCKET_NAME = "zextras-artifacts"
        PUPPETEER_DOWNLOAD_HOST = "https://chromirror.zextras.com"
        LOCAL_REGISTRY = "https://npm.zextras.com"
        COMMIT_PARENTS_COUNT = getCommitParentsCount()
        REPOSITORY_NAME = getRepositoryName()
    }
    stages {

// Not needed from 05/07/2019 Agent build, kept for reference
//        stage('Install missing packages') {
//            steps {
//                sh '''
//sudo apt-get update -yqq && sudo apt-get install -yqq gnupg2
//sudo sh -c 'wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -'
//sudo sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list'
//sudo apt-get update -yqq
//sudo apt-get install -yqq --no-install-recommends \
//google-chrome-stable \
//fonts-ipafont-gothic \
//fonts-wqy-zenhei \
//fonts-thai-tlwg \
//fonts-kacst \
//'''
//            }
//        }

//============================================ Release Automation ======================================================

        stage('Bump Version') {
            when {
                beforeAgent true
                allOf {
                    expression { BRANCH_NAME ==~ /(release|beta)/ }
                    environment name: 'COMMIT_PARENTS_COUNT', value: '2'
                }
            }
            steps {
                script {
                    def nextVersion = calculateNextVersion()
                    def tempBranchName = sh(script: """#!/bin/bash
                            echo \"version-bumper/v$nextVersion\"\$( { [[ $BRANCH_NAME == 'beta' ]] && echo '-beta'; } || echo '' )
                        """, returnStdout: true).trim()
                    sh(script: """#!/bin/bash
                        git config user.email \"bot@zextras.com\"
                        git config user.name \"Tarsier Bot\"
                        git remote set-url origin \$(git remote -v | head -n1 | cut -d\$'\t' -f2 | cut -d\" \" -f1 | sed 's!https://bitbucket.org/zextras!git@bitbucket.org:zextras!g')
                        sed --in-place --regexp-extended 's/\"version\": +\"[0-9]+\\.[0-9]+\\.[0-9]+\"/\"version\": \"$nextVersion\"/' package.json
                        git add package.json
                        git commit -m \"Bumped version to $nextVersion\$( { [[ $BRANCH_NAME == 'beta' ]] && echo ' Beta'; } || echo '' )\"
                        git tag -a v$nextVersion\$( { [[ $BRANCH_NAME == 'beta' ]] && echo '-beta'; } || echo '' ) -m \"Version $nextVersion\$( { [[ $BRANCH_NAME == 'beta' ]] && echo ' Beta'; } || echo '' )\"
                        git push --tags
                        git push origin HEAD:$BRANCH_NAME
                        git push origin HEAD:refs/heads/$tempBranchName
                    """)
                    withCredentials([usernameColonPassword(credentialsId: 'tarsier-bot-pr-token', variable: 'PR_ACCESS')]) {
                        sh(script: """
                            curl https://api.bitbucket.org/2.0/repositories/$REPOSITORY_NAME/pullrequests \
                            -u '$PR_ACCESS' \
                            --request POST \
                            --header 'Content-Type: application/json' \
                            --data '{
                                    \"title\": \"Bumped version to $nextVersion into $BRANCH_NAME\",
                                    \"source\": {
                                        \"branch\": {
                                            \"name\": \"$tempBranchName\"
                                        }
                                    },
                                    \"destination\": {
                                        \"branch\": {
                                            \"name\": \"devel\"
                                        }
                                    },
                                    \"close_source_branch\": true
                                }'
                            """)

                    }
                }
            }
        }

//============================================ Tests ===================================================================

        stage('Tests') {
            when {
                beforeAgent true
                allOf{
                    expression { BRANCH_NAME ==~ /PR-\d+/ }
                }
            }
            parallel {
                stage('Type Checking') {
                    steps {
                        executeNpmLogin()
                        nodeCmd "npm set //registry.npmjs.com/:_authToken ${NPM_AUTH_TOKEN}"
                        nodeCmd 'npm install'
                        nodeCmd 'npm run type-check'
                    }
                }
            }
        }

//============================================ Build ===================================================================

        stage('Build Zimlet Package') {
            when {
                beforeAgent true
                not {
                    allOf {
                        expression { BRANCH_NAME ==~ /(release|beta)/ }
                        environment name: 'COMMIT_PARENTS_COUNT', value: '2'
                    }
                }
            }
            parallel {
                stage('Build Zimbra Zimlet') {
                    agent {
                        node {
                            label 'nodejs-agent-v1'
                        }
                    }
                    steps {
                        executeNpmLogin()
                        nodeCmd 'npm install'
                        nodeCmd 'NODE_ENV="production" npx zapp package'
                        stash includes: 'pkg/com_zextras_zapp_shell.zip', name: 'zimlet_package_unsigned'
                    }
                }
            }

            stage('Sign Zimlet Package') {
                when {
                    beforeAgent true
                    not {
                        allOf {
                            expression { BRANCH_NAME ==~ /(release|beta)/ }
                            environment name: 'COMMIT_PARENTS_COUNT', value: '2'
                        }
                    }
                }
                steps {
                    dir('artifact-deployer') {
                        git branch: 'master',
                                credentialsId: 'tarsier_bot-ssh-key',
                                url: 'git@bitbucket.org:zextras/artifact-deployer.git'
                        unstash "zimlet_package_unsigned"
                        sh './sign-zextras-zip pkg/com_zextras_zapp_shell.zip'
                        stash includes: 'pkg/com_zextras_zapp_shell.zip', name: 'zimlet_package'
                        archiveArtifacts artifacts: 'pkg/com_zextras_zapp_shell.zip', fingerprint: true
                    }
                }
            }

//============================================ Deploy ==================================================================

            stage('Release') {
                when {
                    beforeAgent true
                    allOf {
                        expression { BRANCH_NAME ==~ /(release)/ }
                        environment name: 'COMMIT_PARENTS_COUNT', value: '1'
                    }
                }
                parallel {
                    stage('Publish on NPM') {
                        steps {
                            script {
                                executeNpmLogin()
                                nodeCmd "npm install"
                                nodeCmd 'NODE_ENV="production" npm publish'
                            }
                        }
                    }
                }
            }
        }
        post {
            always {
                script {
                    GIT_COMMIT_EMAIL = sh(
                            script: 'git --no-pager show -s --format=\'%ae\'',
                            returnStdout: true
                    ).trim()
                }
                emailext attachLog: true, body: '$DEFAULT_CONTENT', recipientProviders: [requestor()], subject: '$DEFAULT_SUBJECT', to: "${GIT_COMMIT_EMAIL}"
            }
        }
    }
}
