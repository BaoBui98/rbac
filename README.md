npm run migration:generate -- src/database/migrations/CreateUserTable
npm run migration:run
npm run seed:role
npm run seed:permission

Bước 2: Tìm Container đang chạy ứng dụng
Sau khi vào được server, bạn gõ lệnh để liệt kê các container đang sống:
sudo docker ps

Bước 3: "Chui" vào bên trong Container
Để thâm nhập vào thẳng thư mục chứa source code (/app) bên trong container, bạn gõ:


<!-- Deploy -->
aws ecr get-login-password --region ap-southeast-1 | docker login --username AWS --password-stdin 527055790396.dkr.ecr.ap-southeast-1.amazonaws.com/production-backend-repo

docker build -t production-backend-repo .

docker tag production-backend-repo:latest 527055790396.dkr.ecr.ap-southeast-1.amazonaws.com/production-backend-repo:latest

docker push 527055790396.dkr.ecr.ap-southeast-1.amazonaws.com/production-backend-repo:latest

aws ecs update-service --cluster production-cluster --service production-service --force-new-deployment --region ap-southeast-1


http://13.229.183.181:3000

<!-- Ci/cd auto push code -->
Bước 3: Tạo Pipeline và kết nối với Github
Tại trang chủ Jenkins, click vào nút "New Item" ở góc trên bên trái.
Nhập tên là rbac-backend-cicd, chọn "Pipeline" và bấm "OK".
Cuộn trang thẳng xuống dưới cùng phần Pipeline:
Ở ô Definition: Chọn Pipeline script from SCM (nghĩa là lấy kịch bản từ Git).
Ở ô SCM: Chọn Git.
Ở ô Repository URL: Dán link Github của bạn: https://github.com/BaoBui98/rbac.git
Ở ô Branch Specifier: Sửa thành */main (vì nhánh bạn vừa push lên tên là main).
Ô Script Path: Giữ nguyên là Jenkinsfile.
phần Build Triggers, đảm bảo bạn ĐÃ TÍCH CHỌN vào ô "GitHub hook trigger for GITScm polling"
Bấm "Save".




Bước 2: Báo cho GitHub biết địa chỉ của Jenkins
Mở trình duyệt vào trang Repo Github của bạn (https://github.com/BaoBui98/rbac).
Chọn tab Settings (Cài đặt của kho lưu trữ) ➔ Nhìn sang menu bên trái chọn Webhooks.
Bấm nút Add webhook (có thể GitHub sẽ yêu cầu bạn nhập mật khẩu để xác nhận).
Điền chính xác các thông tin sau:
Payload URL: http://[IP_ADDRESS]/github-webhook/ (Lưu ý: Bắt buộc phải có dấu gạch chéo / ở cuối cùng).
Content type: Nhấp vào và chọn application/json.
Secret: Bỏ trống.
Which events would you like to trigger this webhook?: Giữ nguyên mặc định là Just the push event (Chỉ báo khi có người push code).
Bấm nút Add webhook màu xanh ở dưới cùng.