pipeline {
    agent any

    tools {
        nodejs 'NodeJS'
    }

    environment {
        DOCKER_IMAGE_BACKEND = 'herab5/be-todo:02190108'
        DOCKER_IMAGE_FRONTEND = 'herab5/fe-todo:02190108'
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main',
                    credentialsId: 'github-creds',
                    url: 'https://github.com/nimas854/Sherab-Nima-Rigzin_02240358_DSO101_A1.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                dir('BAckend todo') {
                    bat 'npm install'
                }
            }
        }

        stage('Run Tests') {
            steps {
                dir('BAckend todo') {
                    bat 'npm test'
                }
            }
            post {
                always {
                    junit allowEmptyResults: true, testResults: 'BAckend todo/junit.xml'
                }
            }
        }

        stage('Build Backend Docker Image') {
            steps {
                dir('BAckend todo') {
                    script {
                        docker.build("${DOCKER_IMAGE_BACKEND}")
                    }
                }
            }
        }

        stage('Build Frontend Docker Image') {
            steps {
                dir('frontend') {
                    script {
                        docker.build("${DOCKER_IMAGE_FRONTEND}")
                    }
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script {
                    docker.withRegistry('https://registry.hub.docker.com', 'docker-hub-creds') {
                        docker.image("${DOCKER_IMAGE_BACKEND}").push()
                        docker.image("${DOCKER_IMAGE_FRONTEND}").push()
                    }
                }
            }
        }

    }

    post {
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}