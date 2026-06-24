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
                // Kéo code mới nhất từ nhánh main
                git branch: 'main', url: 'https://github.com/BaoBui98/rbac.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    echo "Đang đóng gói ứng dụng bằng Docker..."
                    // Build image và đánh tag là latest và build number
                    sh 'docker build -t ${ECR_REPO}:latest .'
                    sh 'docker tag ${ECR_REPO}:latest ${ECR_REPO}:${BUILD_NUMBER}'
                }
            }
        }

        stage('Push to AWS ECR') {
            steps {
                script {
                    echo "Đang đăng nhập và đẩy Image lên kho lưu trữ AWS ECR..."
                    // Tự động đăng nhập vào ECR nhờ vào IAM Role đã gắn (Không cần lộ Access Key)
                    sh 'aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_REPO}'
                    
                    // Push Image lên AWS
                    sh 'docker push ${ECR_REPO}:latest'
                    sh 'docker push ${ECR_REPO}:${BUILD_NUMBER}'
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
