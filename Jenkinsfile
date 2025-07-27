pipeline {
  agent any

  environment {
    NODE_VERSION = '22.17.1'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install Node') {
      steps {
        sh '''
          source ~/.nvm/nvm.sh
          nvm install $NODE_VERSION
          nvm use $NODE_VERSION
          node -v
          npm -v
        '''
      }
    }

    stage('Install deps') {
      steps {
        sh 'npm ci'
      }
    }

    stage('Build') {
      steps {
        sh 'npm run build'
      }
    }

    stage('Test') {
      steps {
        sh 'echo "TODO: Add tests"'
      }
    }

    stage('Publish to NPM') {
      when {
        branch 'main'
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
  }

  post {
    success {
      echo '✅ Build successful'
    }
    failure {
      echo '❌ Build failed'
    }
  }
}
