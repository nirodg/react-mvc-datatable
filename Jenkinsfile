pipeline {
    agent any

    tools {
        nodejs 'v24.4.1'
    }

    environment {
        GIT_AUTHOR_NAME  = 'ci-bot (Brage Dorin)'
        GIT_AUTHOR_EMAIL = 'dorin.brage@gmail.com'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Verify Node Environment') {
            steps {
                sh '''
                  echo "✅ Node version:"
                  node -v
                  echo "✅ NPM version:"
                  npm -v
                '''
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Bump Patch Version & Tag') {
            when {
                expression {
                    sh(script: "git rev-parse --abbrev-ref HEAD", returnStdout: true).trim() == 'master'
                }
            }
            steps {
                sh '''
                  git config user.name "$GIT_AUTHOR_NAME"
                  git config user.email "$GIT_AUTHOR_EMAIL"

                  CURRENT_VERSION=$(node -p "require('./package.json').version")
                  echo "🔢 Current version: $CURRENT_VERSION"

                  npm version patch -m "🔖 Release %s [skip ci]"

                  git push origin HEAD:master --tags
                '''
            }
        }

        stage('Publish to NPM') {
            when {
                expression {
                    sh(script: "git rev-parse --abbrev-ref HEAD", returnStdout: true).trim() == 'master'
                }
            }
            steps {
                withCredentials([string(credentialsId: 'npm_token', variable: 'NPM_TOKEN')]) {
                    sh '''
                      echo "//registry.npmjs.org/:_authToken=$NPM_TOKEN" > ~/.npmrc
                      npm publish --access public
                    '''
                }
            }
        }

        stage('Bump to next -dev version') {
            when {
                expression {
                    sh(script: "git rev-parse --abbrev-ref HEAD", returnStdout: true).trim() == 'master'
                }
            }
            steps {
                sh '''
                  CURRENT_VERSION=$(node -p "require('./package.json').version")
                  NEXT_DEV_VERSION=$(echo $CURRENT_VERSION | awk -F. '{$NF+=1; print $1 "." $2 "." $3 "-dev"}')

                  npm version $NEXT_DEV_VERSION --no-git-tag-version
                  git add package.json package-lock.json
                  git commit -m "🚧 Prepare next development version $NEXT_DEV_VERSION [skip ci]"
                  git push origin HEAD:master
                '''
            }
        }
    }

    post {
        success {
            echo "🎉 Build and optional release (if on master) complete"
        }
        failure {
            echo "❌ Build failed"
        }
    }
}
