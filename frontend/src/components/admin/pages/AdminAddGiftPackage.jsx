import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload } from 'lucide-react';

const AdminAddGiftPackage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    original_price: '',
    discount_percentage: '',
    category_id: '',
    status: 'active',
    is_featured: false,
    is_student_discount: false,
    target_audience: '',
    delivery_time: '',
    warranty_period: ''
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const API_URL = 'http://localhost:8000/api';

  // 📦 Lấy danh mục từ API
  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/gift-categories`);
      if (!response.ok) throw new Error('Không tải được danh mục');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error(error);
      alert('Lỗi khi tải danh mục quà');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // 🧩 Cập nhật form và tính giá bán tự động
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let updatedData = {
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    };

    if (name === 'original_price' || name === 'discount_percentage') {
      const originalPrice = parseFloat(
        name === 'original_price' ? value : updatedData.original_price
      );
      const discount = parseFloat(
        name === 'discount_percentage' ? value : updatedData.discount_percentage
      );
      if (!isNaN(originalPrice) && !isNaN(discount)) {
        updatedData.price = (originalPrice - (originalPrice * discount) / 100).toFixed(2);
      }
    }

    setFormData(updatedData);
  };

  // 🖼 Xử lý upload ảnh (preview)
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file)); // hiện ảnh xem trước
  };

  // 🚀 Gửi form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const sendData = new FormData();
    
    // Chỉ gửi các field có giá trị và không phải null/undefined
    Object.keys(formData).forEach(key => {
      const value = formData[key];
      if (value !== null && value !== undefined && value !== '') {
        // Xử lý đặc biệt cho boolean values
        if (typeof value === 'boolean') {
          sendData.append(key, value ? '1' : '0');
        } else {
          sendData.append(key, value);
        }
      }
    });
    
    if (image) sendData.append('image', image);

    console.log('Sending data:', Object.fromEntries(sendData)); // Debug log

    try {
      const response = await fetch(`${API_URL}/gift-packages`, {
        method: 'POST',
        body: sendData,
      });

      console.log('Response status:', response.status); // Debug log

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Lỗi ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      console.log('Success response:', result); // Debug log

      alert('🎁 Thêm gói quà thành công!');
      navigate('/admin/gift-packages');
    } catch (error) {
      console.error(error);
      alert(`❌ Có lỗi xảy ra khi thêm gói quà: ${error.message}`);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Thêm Gói Quà Mới 🎁</h2>

      <form onSubmit={handleSubmit} className="mt-4">

        {/* Upload ảnh */}
        <div className="mb-4">
          <label className="form-label">Ảnh đại diện gói quà</label>
          <div className="d-flex align-items-center gap-3">
            {preview && (
              <img
                src={preview}
                alt="preview"
                style={{
                  width: '120px',
                  height: '120px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                }}
              />
            )}
            <div>
              <label className="btn btn-outline-primary">
                <Upload size={16} className="me-2" />
                Chọn ảnh
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleImageChange}
                />
              </label>
              {preview && (
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger ms-2"
                  onClick={() => {
                    setImage(null);
                    setPreview(null);
                  }}
                >
                  Xóa
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Thông tin cơ bản */}
        <div className="mb-3">
          <label className="form-label">Tên gói quà</label>
          <input
            type="text"
            name="name"
            className="form-control"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Mô tả</label>
          <textarea
            name="description"
            className="form-control"
            value={formData.description}
            onChange={handleChange}
          ></textarea>
        </div>

        {/* Giá */}
        <div className="row">
          <div className="col-md-4 mb-3">
            <label className="form-label">Giá gốc (VNĐ)</label>
            <input
              type="number"
              name="original_price"
              className="form-control"
              value={formData.original_price}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-4 mb-3">
            <label className="form-label">Giảm giá (%)</label>
            <input
              type="number"
              name="discount_percentage"
              className="form-control"
              value={formData.discount_percentage}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-4 mb-3">
            <label className="form-label">Giá bán</label>
            <input
              type="number"
              name="price"
              className="form-control"
              value={formData.price}
              readOnly
              style={{ backgroundColor: '#f8f9fa', fontWeight: 'bold' }}
            />
          </div>
        </div>

        {/* Danh mục */}
        <div className="mb-3">
          <label className="form-label">Danh mục</label>
          <select
            name="category_id"
            className="form-select"
            value={formData.category_id}
            onChange={handleChange}
            required
          >
            <option value="">-- Chọn danh mục --</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Thông tin thêm */}
        <div className="row">
          <div className="col-md-4 mb-3">
            <label className="form-label">Đối tượng</label>
            <input
              type="text"
              name="target_audience"
              className="form-control"
              value={formData.target_audience}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label">Thời gian giao</label>
            <input
              type="text"
              name="delivery_time"
              className="form-control"
              value={formData.delivery_time}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label">Bảo hành</label>
            <input
              type="text"
              name="warranty_period"
              className="form-control"
              value={formData.warranty_period}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Checkbox */}
        <div className="form-check mb-3">
          <input
            type="checkbox"
            name="is_featured"
            className="form-check-input"
            checked={formData.is_featured}
            onChange={handleChange}
          />
          <label className="form-check-label">Nổi bật</label>
        </div>

        <div className="form-check mb-4">
          <input
            type="checkbox"
            name="is_student_discount"
            className="form-check-input"
            checked={formData.is_student_discount}
            onChange={handleChange}
          />
          <label className="form-check-label">Giảm giá sinh viên</label>
        </div>

        <button type="submit" className="btn btn-primary">
          💾 Lưu gói quà
        </button>
      </form>
    </div>
  );
};

export default AdminAddGiftPackage;
