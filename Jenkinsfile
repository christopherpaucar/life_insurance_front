pipeline {
    agent {
        docker {
            image 'node:18' // Usa la versión de Node que prefieras
        }
    }
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('Install dependencies') {
            steps {
                sh 'npm install'
            }
        }
        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
        stage('Docker Build') {
            steps {
                sh 'docker build -t life_insurance_front .'
            }
        }
        // Puedes agregar más stages para test, deploy, etc.
    }
} 