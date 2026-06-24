npm run migration:generate -- src/database/migrations/CreateUserTable
npm run migration:run
npm run seed:role
npm run seed:permission


<!-- Deploy -->
aws ecr get-login-password --region ap-southeast-1 | docker login --username AWS --password-stdin 527055790396.dkr.ecr.ap-southeast-1.amazonaws.com/production-backend-repo

docker build -t production-backend-repo .

docker tag production-backend-repo:latest 527055790396.dkr.ecr.ap-southeast-1.amazonaws.com/production-backend-repo:latest

docker push 527055790396.dkr.ecr.ap-southeast-1.amazonaws.com/production-backend-repo:latest

aws ecs update-service --cluster production-cluster --service production-service --force-new-deployment --region ap-southeast-1


http://13.229.183.181:3000