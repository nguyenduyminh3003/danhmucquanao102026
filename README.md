# Danh Mục Quần Áo 2026 — Phiên Bản 3 (v3)

## Giới thiệu
Phiên bản v3 được tối ưu toàn diện theo yêu cầu đào tạo nhân viên và thuyết trình cấu trúc sản phẩm của YaMe:
- **Folder độc lập 100%**: Lưu trữ toàn bộ tài sản (`index.html`, `products_mindmap_data.js`, `assets/logo.jpg`, `data/ao.csv`, `data/quan.csv`, `server.js`, `build_mindmap_data.js`). Không dùng chung tài sản với `v1` và `v2`.

## Các điểm cải tiến mới trong v3:
1. **Bộ lọc Tình trạng sản phẩm trên Header**:
   - Lọc nhanh theo 4 tình trạng: `Đang Bán Sẽ Tái Sản Xuất`, `Đang Bán Ngừng TSX Chờ Thanh Lý`, `Chờ Mở Bán`, `Đang SR`.
   - Tự động cập nhật số liệu counting (đếm số mẫu & SKU), ẩn các mục không có sản phẩm ở tình trạng được chọn trên cả 3 tab: **Sơ đồ**, **Sản phẩm**, và **Định nghĩa**.
2. **Nút "Bung hết" & "Thu gọn" ở Sơ đồ & Định nghĩa**:
   - Dễ dàng thao tác mở toàn bộ cây hoặc thu gọn lại chỉ với 1 click khi trình diễn / đào tạo.
3. **Cấu trúc Cây Sơ đồ 5 Cấp (Heading Levels & Paragraph Indentation)**:
   - **Cấp 1 - Chủng loại (Heading 1)**: Sát lề chuẩn (0px), font 26px, in đậm nhất (#000000).
   - **Cấp 2 - Kiểu sản phẩm (Heading 2)**: Thụt lề cấp 2 (14px), font 18px in đậm, có đường line chỉ dẫn. Mặc định thu gọn, click vào CHỈ mở các Dòng sản phẩm.
   - **Cấp 3 - Dòng sản phẩm (Heading 3)**: Thụt lề cấp 3 (18px), font 15.5px, có vạch nhấn vàng `#fbb118`. **Hiển thị định nghĩa của từng dòng ngay bên dưới tên dòng**. Mặc định thu gọn, click vào CHỈ mở các Phiên bản.
   - **Cấp 4 - Phiên bản (Heading 4)**: Thụt lề cấp 4 (20px), font 14px, màu chữ vừa phải. **Hiển thị định nghĩa của từng phiên bản ngay bên dưới tên phiên bản**. Mặc định thu gọn, click vào MỚI mở danh sách sản phẩm.
   - **Cấp 5 - Sản phẩm (Body Grid)**: Thụt lề sâu nhất (đường nét đứt), hiển thị hình ảnh auto scale (không crop), mã ID in đậm, số màu. Bấm vào sản phẩm để mở Drawer chi tiết.
4. **Tab Định nghĩa bổ sung Kiểu sản phẩm áp dụng**:
   - Mỗi phiên bản liệt kê chi tiết các **Kiểu sản phẩm đang có** (ví dụ: phiên bản *Giả Da* có Kiểu sản phẩm áp dụng là *Áo Khoác Da (3 mẫu · 3 SKU)*).

## Cách chạy
1. Trong thư mục `v3`:
   ```bash
   node server.js
   ```
2. Mở trên máy tính: `http://localhost:3000`
3. Mở trên điện thoại (cùng mạng Wi-Fi): `http://192.168.7.28:3000`
