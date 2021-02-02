library(
	identifier: 'zapp-jenkins-lib@v0.0.18',
	retriever: modernSCM([
		$class: 'GitSCMSource',
	 		remote: 'git@bitbucket.org:zextras/zapp-jenkins-lib.git',
		credentialsId: 'tarsier_bot-ssh-key'
	])
)

zappPipeline(
	buildScript: 'build:zimlet',
	onPublish: {
		withCredentials([
			usernamePassword(
				credentialsId: 'npm-zextras-bot-auth', 
				usernameVariable: 'NPM_USERNAME', 
				passwordVariable: 'NPM_PASSWORD'
			)
		]) {
			if ("${BRANCH_NAME}" ==~ /(release)/) {
				npm(
					install: true,
					username: "${NPM_USERNAME}",
					password: "${NPM_PASSWORD}",
					script: 'publish',
					varEnv: [
						NODE_ENV: 'production'
					]
				)
			} else {
				npm(
					install: true,
					username: "${NPM_USERNAME}",
					password: "${NPM_PASSWORD}",
					script: 'publish --tag beta',
					varEnv: [
						NODE_ENV: 'production'
					]
				)
			}
		}
	}
)
