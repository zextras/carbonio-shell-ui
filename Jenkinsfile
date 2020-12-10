@Library("zextras-library@0.5.0") _

def nodeCmd(String cmd) {
	sh '. load_nvm && nvm install && nvm use && ' + cmd
}

def getCommitParentsCount() {
	return sh(script: '''
		COMMIT_ID=$(git log -1 --oneline | sed 's/ .*//')
		(git cat-file -p $COMMIT_ID | grep -w "parent" | wc -l)
	''', returnStdout: true).trim()
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
		NPM_AUTH_TOKEN = sh(script: """
            curl -s \
                -H "Accept: application/json" \
                -H "Content-Type:application/json" \
                -X PUT --data \'{"name": "${AUTH_USERNAME}", "password": "${AUTH_PASSWORD}"}\' \
                http://registry.npmjs.com/-/user/org.couchdb.user:${AUTH_USERNAME} 2>&1 | grep -Po \
                \'(?<="token":")[^"]*\';
            """,
			returnStdout: true
        ).trim()
		sh(script: """
           touch .npmrc;
           echo "//registry.npmjs.org/:_authToken=${NPM_AUTH_TOKEN}" > .npmrc
           """,
           returnStdout: true
		).trim()
	}
}

def createRelease(branchName) {
    def isRelease = branchName ==~ /(release)/
    println("Inside createRelease")
    sh(script: """#!/bin/bash
        git config user.email \"bot@zextras.com\"
        git config user.name \"Tarsier Bot\"
        git remote set-url origin \$(git remote -v | head -n1 | cut -d\$'\t' -f2 | cut -d\" \" -f1 | sed 's!https://bitbucket.org/zextras!git@bitbucket.org:zextras!g')
        git fetch --unshallow
    """)
    executeNpmLogin()
    nodeCmd "npm install"
    if (isRelease) {
        sh(script: """#!/bin/bash
            git subtree pull --squash --prefix translations/ git@bitbucket.org:$TRANSLATIONS_REPOSITORY_NAME\\.git master
        """)
        nodeCmd "npx pinst --enable"
        nodeCmd "npm run release -- --no-verify"
    } else {
        nodeCmd "NODE_ENV='production' npm run build"
        nodeCmd "npx pinst --enable"
        nodeCmd "npm run release -- --no-verify --prerelease beta"
        sh(script: """#!/bin/bash
            # git add translations
            # git commit -m 'Extracted translations'
            git subtree push --squash --prefix translations/ git@bitbucket.org:$TRANSLATIONS_REPOSITORY_NAME\\.git translations-updater/v${getCurrentVersion()}
        """)
        withCredentials([usernameColonPassword(credentialsId: 'tarsier-bot-pr-token', variable: 'PR_ACCESS')]) {
            def defaultReviewers = sh(script: """
                curl https://api.bitbucket.org/2.0/repositories/$REPOSITORY_NAME/default-reviewers \
                -u '$PR_ACCESS' \
                --request GET
            """, returnStdout: true).trim()
            println(defaultReviewers)
            sh(script: """#!/bin/bash
                curl https://api.bitbucket.org/2.0/repositories/$TRANSLATIONS_REPOSITORY_NAME/pullrequests \
                -u '$PR_ACCESS' \
                --request POST \
                --header 'Content-Type: application/json' \
                --data '{
                    \"title\": \"Updated translations in ${getCurrentVersion()}\",
                    \"source\": {
                        \"branch\": {
                            \"name\": \"translations-updater/v${getCurrentVersion()}\"
                        }
                    },
                    \"destination\": {
                        \"branch\": {
                            \"name\": \"master\"
                        }
                    },
                    \"close_source_branch\": true
                }'
            """)
        }
    }
    sh(script: """#!/bin/bash
        echo \"---\\ntitle: Change Log\\n---\"> docs/docs/CHANGELOG.md
        cat CHANGELOG.md >> docs/docs/CHANGELOG.md
    """)
    sh(script: """#!/bin/bash
      git push --follow-tags origin HEAD:$branchName
      git push origin HEAD:refs/heads/version-bumper/v${getCurrentVersion()}
    """)
    withCredentials([usernameColonPassword(credentialsId: 'tarsier-bot-pr-token', variable: 'PR_ACCESS')]) {
        def defaultReviewers = sh(script: """
            curl https://api.bitbucket.org/2.0/repositories/$REPOSITORY_NAME/default-reviewers \
            -u '$PR_ACCESS' \
            --request GET
        """, returnStdout: true).trim()
        println(defaultReviewers)
        sh(script: """
            curl https://api.bitbucket.org/2.0/repositories/$REPOSITORY_NAME/pullrequests \
            -u '$PR_ACCESS' \
            --request POST \
            --header 'Content-Type: application/json' \
            --data '{
                \"title\": \"Bumped version to ${getCurrentVersion()}\",
                \"source\": {
                    \"branch\": {
                        \"name\": \"version-bumper/v${getCurrentVersion()}\"
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

def createBuild(sign) {
    executeNpmLogin()
    nodeCmd "npm install"
    nodeCmd "NODE_ENV='production' npm run build:zimlet"
    if (sign) {
        dir("artifact-deployer") {
            git(
                branch: "master",
                credentialsId: "tarsier_bot-ssh-key",
                url: "git@bitbucket.org:zextras/artifact-deployer.git"
            )
            sh(script: """#!/bin/bash
                ./sign-zextras-zip ../pkg/com_zextras_zapp_shell.zip
            """)
        }
    }
}

def createDocumentation(branchName) {
    dir("docs/website") {
        executeNpmLogin()
        nodeCmd "npm install"
        nodeCmd "BRANCH_NAME=$branchName npm run build"
    }
}

def publishOnNpm(branchName) {
    def isRelease = branchName ==~ /(release)/
    executeNpmLogin()
    nodeCmd "npm install"
    if (isRelease) {
        nodeCmd "NODE_ENV='production' npm publish"
    } else {
        nodeCmd "NODE_ENV='production' npm publish --tag beta"
    }
}

pipeline {
	agent {
		node {
			label 'nodejs-agent-v2'
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
		TRANSLATIONS_REPOSITORY_NAME = "zextras/com_zextras_zapp_shell"
	}
	stages {

	    // ===== Tests =====

	    stage("Tests") {
            when {
                beforeAgent(true)
                allOf {
                    expression { BRANCH_NAME ==~ /PR-\d+/ }
                }
            }
            parallel {
                stage("Type Checking") {
                    agent {
                        node {
                            label "nodejs-agent-v2"
                        }
                    }
                    steps {
                        executeNpmLogin()
                        nodeCmd "npm install"
                        nodeCmd "npm run type-check"
                    }
                }
                stage("Unit Tests") {
                    agent {
                        node {
                            label "nodejs-agent-v2"
                        }
                    }
                    steps {
                        executeNpmLogin()
                        nodeCmd "npm install"
                        nodeCmd "npm run test"
                    }
                    post {
                        always {
                            junit "junit.xml"
                            // publishCoverage adapters: [coberturaAdapter('coverage/cobertura-coverage.xml')], calculateDiffForChangeRequests: true, failNoReports: true
                        }
                    }
                }
                stage("Linting") {
                    agent {
                        node {
                            label "nodejs-agent-v2"
                        }
                    }
                    steps {
                        executeNpmLogin()
                        nodeCmd "npm install"
                        nodeCmd "npm run lint"
                    }
                }
                stage("Build") {
                    agent {
                        node {
                            label "nodejs-agent-v2"
                        }
                    }
                    steps {
                        createBuild(false)
                    }
                }
            }
        }

        // ===== Release automation =====

		stage("Release automation") {
			when {
				beforeAgent(true)
				allOf {
					expression { BRANCH_NAME ==~ /(release|beta)/ }
					environment(
					    name: "COMMIT_PARENTS_COUNT",
					    value: "2"
                    )
				}
			}
            steps {
                createRelease("$BRANCH_NAME")
                archiveArtifacts(
                    artifacts: "README.md",
                    fingerprint: true
                )
                stash(
                    includes: "README.md",
                    name: 'readme'
                )
                createBuild(true)
                archiveArtifacts(
                    artifacts: "pkg/com_zextras_zapp_shell.zip",
                    fingerprint: true
                )
                stash(
                    includes: "pkg/com_zextras_zapp_shell.zip",
                    name: 'zimlet_package'
                )
                createDocumentation("$BRANCH_NAME")
                script {
                    doc.rm(file: "iris/zapp-shell/$BRANCH_NAME")
                    doc.mkdir(folder: "iris/zapp-shell/$BRANCH_NAME")
                    doc.upload(
                        file: "docs/website/build/com_zextras_zapp_shell/**",
                        destination: "iris/zapp-shell/$BRANCH_NAME"
                    )
                }
                publishOnNpm("$BRANCH_NAME")
            }
        }

		stage('Build DEB/RPM packages') {
		    when {
				beforeAgent(true)
				allOf {
					expression { BRANCH_NAME ==~ /(release|beta)/ }
					environment(
					    name: "COMMIT_PARENTS_COUNT",
					    value: "2"
                    )
				}
            }
			parallel {
				stage('Ubuntu') {
					agent {
						node {
							label 'base-agent-v1'
						}
					}
					options {
                        skipDefaultCheckout(true)
                    }
					steps {
						unstash 'zimlet_package'
						script {
							env.CONTAINER1_ID = sh(returnStdout: true, script: 'docker run -dt ${NETWORK_OPTS} ubuntu:18.04').trim()
						}
						sh "docker cp ${WORKSPACE} ${env.CONTAINER1_ID}:/u"
						sh "docker exec -t ${env.CONTAINER1_ID} bash -c \"cd /u; ./build-pkgs.sh shell\""
						sh "docker cp ${env.CONTAINER1_ID}:/u/artifacts/. ${WORKSPACE}"
						script {
							def server = Artifactory.server 'zextras-artifactory'
							def buildInfo = Artifactory.newBuildInfo()

							def uploadSpec = """{
								"files": [
									{
										"pattern": "*.deb",
										"target": "debian-local/pool/",
										"props": "deb.distribution=bionic;deb.component=main;deb.architecture=amd64"
									}
								]
							}"""
							server.upload spec: uploadSpec, buildInfo: buildInfo
							server.publishBuildInfo buildInfo
						}
					}
					post {
						success {
							archiveArtifacts artifacts: "*.deb", fingerprint: true
						}
						always {
							sh "docker kill ${env.CONTAINER1_ID}"
						}
					}
				}
				stage('CentOS') {
					agent {
						node {
							label 'base-agent-v1'
						}
					}
					options {
                        skipDefaultCheckout(true)
                    }
					steps {
						unstash 'zimlet_package'
						script {
							env.CONTAINER2_ID = sh(returnStdout: true, script: 'docker run -dt ${NETWORK_OPTS} centos:7').trim()
						}
						sh "docker cp ${WORKSPACE} ${env.CONTAINER2_ID}:/r"
						sh "docker exec -t ${env.CONTAINER2_ID} bash -c \"cd /r; ./build-pkgs.sh shell\""
						sh "docker cp ${env.CONTAINER2_ID}:/r/artifacts/. ${WORKSPACE}"
						script {
							def server = Artifactory.server 'zextras-artifactory'
							def buildInfo = Artifactory.newBuildInfo()

							def uploadSpec = """{
								"files": [
									{
										"pattern": "(*)-(*)-(*).rpm",
										"target": "rpm-local/zextras/{1}/{1}-{2}-{3}.rpm",
										"props": "rpm.metadata.arch=x86_64;rpm.metadata.vendor=Zextras"
									}
								]
							}"""
							server.upload spec: uploadSpec, buildInfo: buildInfo
							server.publishBuildInfo buildInfo
						}
					}
					post {
						success {
							archiveArtifacts artifacts: "*.rpm", fingerprint: true
						}
						always {
							sh "docker kill ${env.CONTAINER2_ID}"
						}
					}
				}
			}
		}

        // ===== Deploy =====

// 		stage("Deploy") {
// 			parallel {
// 				stage("Deploy Beta on demo server") {
// 					agent {
// 						node {
// 							label 'nodejs-agent-v2'
// 						}
// 					}
// 					options {
//                         skipDefaultCheckout(true)
//                     }
// 					when {
//                         beforeAgent(true)
//                         allOf {
//                             expression { BRANCH_NAME ==~ /(release|beta)/ }
//                             environment(
//                                 name: "COMMIT_PARENTS_COUNT",
//                                 value: "2"
//                             )
//                         }
// 					}
// 					steps {
// 					}
// 				}
// 			}
// 		}

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
