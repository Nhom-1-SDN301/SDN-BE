## Required
Node version `18.18.0`.

## 1. Config
Tạo file `.env` sau đó copy tất cả từ `.env.example` sang file `.env`.

## 2. Migrate data
- **Lưu ý**: Đây là thao tác seed data mẫu chỉ cần làm 1 lần duy nhất 
- **Thực hiện**: Trỏ tới thư mục `seeder` sau đó chạy:
- **Đường dẫn thư mục seeder**: `root > src > seeder`
``` migrate data
yarn seed
```

## 3. Run dev
Trỏ tới thư mục root sau đó chạy:
``` run dev
yarn start:dev
```
