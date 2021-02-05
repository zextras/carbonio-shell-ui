library(
	identifier: 'zapp-jenkins-lib@v0.0.1',
	retriever: modernSCM([
		$class: 'GitSCMSource',
   		remote: 'git@bitbucket.org:zextras/zapp-jenkins-lib.git',
		credentialsId: 'tarsier_bot-ssh-key'
	])
)

zappTranslationsPipeline(
    translatedRepository: 'git@bitbucket.org:zextras/zapp-shell.git'
)
