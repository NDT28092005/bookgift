import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Upload } from 'lucide-react';

const EditGiftPackage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    original_price: '',
    discount_percentage: 0,
    category_id: '',
    status: 'active',
    is_featured: false,
    is_student_discount: false,
    target_audience: '',
    delivery_time: '',
    warranty_period: '',
    image: null, // ảnh upload
  });

  const API_URL = 'http://localhost:8000/api';

  useEffect(() => {
    fetchCategories();
    if (id) {
      fetchGiftPackage();
    }
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/gift-categories`);
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchGiftPackage = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/gift-packages/${id}`);
      
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const data = await response.json();

      setFormData(prev => ({
        ...prev,
        ...data,
        image: null, // tránh set ảnh cũ thành File
      }));

      if (data.image_url) {
        setImagePreview(`http://localhost:8000${data.image_url}`);
      }
    } catch (error) {
      console.error('Error fetching gift package:', error);
      alert('❌ Không thể tải thông tin gói quà');
    } finally {
      setLoading(false);
    }
  };

  // Xử lý thay đổi dữ liệu
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let updatedData = {
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    };

    // Tự động tính giá
    if (name === 'original_price' || name === 'discount_percentage') {
      const original = parseFloat(
        name === 'original_price' ? value : updatedData.original_price
      );
      const discount = parseFloat(
        name === 'discount_percentage' ? value : updatedData.discount_percentage
      );

      if (!isNaN(original) && !isNaN(discount)) {
        const newPrice = original - (original * discount) / 100;
        updatedData.price = newPrice.toFixed(2);
      }
    }

    setFormData(updatedData);
  };

  // Xử lý upload ảnh
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file)); // preview ảnh local
    }
  };

  // Gửi form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const method = id ? 'PUT' : 'POST';
      const url = id
        ? `${API_URL}/gift-packages/${id}`
        : `${API_URL}/gift-packages`;

      const data = new FormData();
      
      // Chỉ gửi các field có giá trị và không phải null/undefined
      Object.keys(formData).forEach(key => {
        const value = formData[key];
        if (value !== null && value !== undefined && value !== '') {
          // Xử lý đặc biệt cho boolean values
          if (typeof value === 'boolean') {
            data.append(key, value ? '1' : '0');
          } else {
            data.append(key, value);
          }
        }
      });

      console.log('Sending data:', Object.fromEntries(data)); // Debug log

      const response = await fetch(url, {
        method,
        body: data,
        // Không set Content-Type header, để browser tự động set với boundary
      });

      console.log('Response status:', response.status); // Debug log
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Lỗi ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      console.log('Success response:', result); // Debug log

      alert('🎁 Lưu gói quà thành công!');
      navigate('/admin/gift-packages');
    } catch (error) {
      console.error('Error saving gift package:', error);
      alert(`❌ Có lỗi xảy ra khi lưu gói quà: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center p-5">
        <div className="spinner-border" role="status"></div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="d-flex align-items-center mb-4">
        <button
          className="btn btn-outline-secondary me-3"
          onClick={() => navigate('/admin/gift-packages')}
        >
          <ArrowLeft size={20} />
        </button>
        <h2>{id ? 'Chỉnh Sửa Gói Quà' : 'Thêm Gói Quà Mới'}</h2>
      </div>

      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              {/* Form bên trái */}
              <div className="col-md-8">
                <div className="mb-3">
                  <label className="form-label">Tên Gói Quà *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Mô Tả *</label>
                  <textarea
                    className="form-control"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    required
                  />
                </div>

                {/* Giá */}
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Giá Gốc (VNĐ)</label>
                    <input
                      type="number"
                      className="form-control"
                      name="original_price"
                      value={formData.original_price}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Giảm giá (%)</label>
                    <input
                      type="number"
                      className="form-control"
                      name="discount_percentage"
                      value={formData.discount_percentage}
                      onChange={handleChange}
                      min="0"
                      max="100"
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Giá Bán</label>
                    <input
                      type="number"
                      className="form-control"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      readOnly
                      style={{ background: '#f8f9fa', fontWeight: 'bold' }}
                    />
                  </div>
                </div>

                {/* Upload ảnh */}
                <div className="mb-3">
                  <label className="form-label">Ảnh đại diện gói quà</label>
                  <div className="d-flex align-items-center gap-3">
                    {imagePreview && (
                      <img
                        src={imagePreview}
                        alt="preview"
                        style={{
                          width: '100px',
                          height: '100px',
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
                    </div>
                  </div>
                </div>
              </div>

              {/* Form bên phải */}
              <div className="col-md-4">
                <div className="card">
                  <div className="card-header">
                    <h5>Cài Đặt</h5>
                  </div>
                  <div className="card-body">
                    <div className="mb-3">
                      <label className="form-label">Danh Mục *</label>
                      <select
                        className="form-select"
                        name="category_id"
                        value={formData.category_id}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Chọn danh mục</option>
                        {categories.map(category => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-check mb-3">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="is_featured"
                        checked={formData.is_featured}
                        onChange={handleChange}
                      />
                      <label className="form-check-label">
                        Gói quà nổi bật
                      </label>
                    </div>

                    <div className="form-check mb-3">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="is_student_discount"
                        checked={formData.is_student_discount}
                        onChange={handleChange}
                      />
                      <label className="form-check-label">
                        Ưu đãi sinh viên
                      </label>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Trạng thái</label>
                      <select
                        className="form-select"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                      >
                        <option value="active">Hoạt động</option>
                        <option value="inactive">Không hoạt động</option>
                        <option value="out_of_stock">Hết hàng</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-end gap-2 mt-4">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/admin/gift-packages')}
              >
                Hủy
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <div
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                    ></div>
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <Save size={20} className="me-2" />
                    Lưu
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditGiftPackage;
