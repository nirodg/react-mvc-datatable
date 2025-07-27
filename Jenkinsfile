pipeline {
  agent any

  environment {
    NODE_VERSION = '22.17.1'
    GIT_AUTHOR_NAME = 'ci-bot (Brage Dorin)'
    GIT_AUTHOR_EMAIL = 'dorin.brage@gmail.com'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Set Up Node') {
      steps {
        sh '''
          source ~/.nvm/nvm.sh
          nvm use $NODE_VERSION
        '''
      }
    }

    stage('Install Deps') {
      steps {
        sh 'npm ci'
      }
    }

    stage('Bump Patch Version & Tag') {
      when {
        branch 'main'
      }
      steps {
        sh '''
          CURRENT_VERSION=$(node -p "require('./package.json').version")
          echo "🔢 Current version: $CURRENT_VERSION"

          # Bump version and create git tag
          npm version patch -m "🔖 Release %s [skip ci]"
          NEW_VERSION=$(node -p "require('./package.json').version")
          echo "🆕 New version: $NEW_VERSION"

          git push origin HEAD:main --tags
        '''
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

    stage('Bump to next -dev') {
      when {
        branch 'main'
      }
      steps {
        sh '''
          # Bump to next pre-release version (e.g., 1.0.3 → 1.0.4-dev)
          CURRENT_VERSION=$(node -p "require('./package.json').version")
          NEXT_DEV_VERSION=$(echo $CURRENT_VERSION | awk -F. '{$NF+=1; print $1 "." $2 "." $3 "-dev"}')

          npm version $NEXT_DEV_VERSION --no-git-tag-version
          git add package.json package-lock.json
          git commit -m "🚧 Prepare next development version $NEXT_DEV_VERSION [skip ci]"
          git push origin HEAD:main
        '''
      }
    }
  }

  post {
    success {
      echo "🎉 Build + publish complete"
    }
    failure {
      echo "❌ Build failed"
    }
  }
}
