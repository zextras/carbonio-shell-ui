library(
	identifier: 'zapp-jenkins-lib@fix/junit',
	retriever: modernSCM([
		$class: 'GitSCMSource',
		remote: 'git@bitbucket.org:zextras/zapp-jenkins-lib.git',
		credentialsId: 'tarsier_bot-ssh-key'
	])
)

zappPipeline(
	buildScript: 'build:zimlet',
	publishOnNpm: true
)
