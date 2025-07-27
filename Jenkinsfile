pipeline {
    agent any
    tools {
        nodejs 'v24.4.1'
    }
    environment {
        GIT_AUTHOR_NAME = 'ci-bot (Brage Dorin)'
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
              def branch = env.BRANCH_NAME ?: env.GIT_BRANCH
              return branch?.endsWith('master')
            }
          }
          steps {
            withCredentials([sshUserPrivateKey(
              credentialsId: env.GIT_CREDENTIAL_ID,
              keyFileVariable: 'SSH_KEY'
            )]) {
              sh '''
                set -e

                echo "🔐 Setting up SSH credentials"
                eval "$(ssh-agent -s)"
                ssh-add $SSH_KEY

                echo "📝 Configuring Git author"
                git config user.name "$GIT_AUTHOR_NAME"
                git config user.email "$GIT_AUTHOR_EMAIL"

                echo "🔢 Reading current version from package.json"
                CURRENT_VERSION=$(node -p "require('./package.json').version")
                echo "🔢 Current version: $CURRENT_VERSION"

                echo "⬆️ Bumping patch version and tagging it"
                npm version patch -m "🔖 Release %s [skip ci]"

                echo "🔗 Switching Git remote to SSH"
                git remote set-url origin git@github.com:nirodg/react-mvc-datatable.git

                echo "📤 Pushing to GitHub"
                git push origin HEAD:master --tags
              '''
            }
          }
        }
        stage('Publish to NPM') {
            when {
                expression {
                    def branch = env.BRANCH_NAME ?: env.GIT_BRANCH
                    return branch?.endsWith('master')
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
                    def branch = env.BRANCH_NAME ?: env.GIT_BRANCH
                    return branch?.endsWith('master')
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
            echo '🎉 Build and optional release (if on master) complete'
        }
        failure {
            echo '❌ Build failed'
        }
    }
}
