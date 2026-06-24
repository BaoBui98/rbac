pipeline {
    agent any
    
    // Khai báo các biến môi trường dựa trên hạ tầng Terraform đã tạo
    environment {
        AWS_REGION   = 'ap-southeast-1'
        ECR_REPO     = '527055790396.dkr.ecr.ap-southeast-1.amazonaws.com/production-backend-repo'
        CLUSTER_NAME = 'production-cluster'
        SERVICE_NAME = 'production-service'
    }

    stages {
        stage('Checkout Source Code') {
            steps {
                // Sử dụng checkout scm để Jenkins luôn lấy đúng phiên bản code mới nhất từ Webhook
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    echo "Đang đóng gói ứng dụng bằng Docker..."
                    sh 'docker build -t production-backend-repo .'
                    sh 'docker tag production-backend-repo:latest ${ECR_REPO}:latest'
                }
            }
        }

        stage('Push to AWS ECR') {
            steps {
                script {
                    echo "Đang đăng nhập và đẩy Image lên kho lưu trữ AWS ECR..."
                    sh 'aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_REPO}'
                    sh 'docker push ${ECR_REPO}:latest'
                }
            }
        }

        stage('Deploy to AWS ECS') {
            steps {
                script {
                    echo "Ra lệnh cho ECS tải Image mới và cập nhật ứng dụng..."
                    // Force deployment để ECS kéo image latest mới nhất về và restart lại các container
                    sh 'aws ecs update-service --cluster ${CLUSTER_NAME} --service ${SERVICE_NAME} --force-new-deployment --region ${AWS_REGION}'
                }
            }
        }
    }
    
    post {
        success {
            echo "✅ Triển khai thành công lên AWS ECS!"
        }
        failure {
            echo "❌ Quá trình CI/CD bị lỗi. Vui lòng kiểm tra lại log."
        }
    }
}
