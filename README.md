# TRƯỜNG GPP V1.0.4

TRƯỜNG GPP là trợ lý nhập thông tin đăng ký tài khoản trên CSDL Dược.

## Giao diện một màn hình, không thanh cuộn

V1.0.4 tối giản giao diện cho người dùng không rành công nghệ:

- Toàn bộ ứng dụng nằm gọn trong một màn hình.
- Không dùng thanh cuộn trang.
- Chỉ hiển thị một nhóm cần nhập tại một thời điểm.
- Bỏ các khối Xuất hồ sơ / Nhập hồ sơ / Xóa bản nháp khỏi giao diện chính.
- Thông tin vẫn tự lưu trên máy khi người dùng nhập.
- Nhóm 7 được nén thành bảng tổng duyệt 6 khối để vẫn xem được toàn bộ dữ liệu trên cùng màn hình.
- Mỗi dòng có biểu tượng bút chì để quay nhanh về đúng thông tin cần sửa.

## 7 nhóm

1. Định danh cơ sở.
2. Vị trí địa lý.
3. Thông tin liên lạc.
4. Giấy chứng nhận đủ điều kiện kinh doanh dược.
5. Nhân thân người phụ trách chuyên môn.
6. Chứng chỉ hành nghề dược (CCHN).
7. Tổng duyệt & Khởi động.

Hỗ trợ ba loại hồ sơ đã xác nhận: Cơ sở bán lẻ, Cơ sở bán buôn, Chuỗi nhà thuốc. Với cơ sở bán lẻ, **Loại hình cơ sở** chỉ gồm **Nhà thuốc** và **Quầy thuốc**.

## Cách hoạt động

Sau khi tổng duyệt, người dùng bấm **Đồng ý & Bắt đầu điền**. Tiện ích mở `https://csdlduoc.com.vn/auth/register`, điền các trường có thể tự động hóa và kiểm tra lại giá trị.

V1 không tự đính kèm tài liệu, không nhập mã xác nhận và không bấm Đăng ký cuối cùng.

## Gói phát hành

- `TRUONG_GPP_V1.0.4_TRANG_NHAP_LIEU.zip`
- `TRUONG_GPP_V1.0.4_TIEN_ICH_TRINH_DUYET.zip`
- `TRUONG_GPP_V1.0.4_HOAN_CHINH.zip`
