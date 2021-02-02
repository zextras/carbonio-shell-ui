library(
	identifier: 'zapp-jenkins-lib@v0.0.10',
	retriever: modernSCM([
		$class: 'GitSCMSource',
	 		remote: 'git@bitbucket.org:zextras/zapp-jenkins-lib.git',
		credentialsId: 'tarsier_bot-ssh-key'
	])
)

zappPipeline(
	onlyCustomBuild: true,
	onBuild: {
		withCredentials([
			usernamePassword(
				credentialsId: 'npm-zextras-bot-auth', 
				usernameVariable: 'NPM_USERNAME', 
				passwordVariable: 'NPM_PASSWORD'
			)
		]) {
			npm(
				install: true,
				username: "${NPM_USERNAME}",
				password: "${NPM_PASSWORD}",
				script: 'build:zimlet',
				varEnv: [
					NODE_ENV: 'production'
				]
			)
		}
		dir('pkg') {
			stash(
				includes: "${zipName}.zip",
				name: 'zimbra_app_package'
			)
		}
	},
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
