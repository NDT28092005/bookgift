import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Upload } from 'lucide-react';

const EditGiftCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    is_active: true,
    sort_order: 0
  });
  const [icon, setIcon] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);

  // Lấy dữ liệu danh mục
  const fetchCategory = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/gift-categories/${id}`);
      if (!response.ok) throw new Error('Không thể tải danh mục');
      const data = await response.json();
      setFormData(data);
      
      if (data.icon_url) {
        setPreview(`http://localhost:8000${data.icon_url}`);
      }
    } catch (error) {
      console.error(error);
      alert('❌ Không thể tải dữ liệu danh mục');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  // Xử lý upload icon
  const handleIconChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIcon(file);
    setPreview(URL.createObjectURL(file)); // hiện ảnh xem trước
  };

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
    
    if (icon) sendData.append('icon', icon);

    console.log('Sending category data:', Object.fromEntries(sendData)); // Debug log

    try {
      const response = await fetch(`http://localhost:8000/api/gift-categories/${id}`, {
        method: 'PUT',
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

      alert('✅ Cập nhật danh mục thành công!');
      navigate('/admin/gift-categories');
    } catch (error) {
      console.error(error);
      alert(`❌ Có lỗi xảy ra khi cập nhật: ${error.message}`);
    }
  };

  if (loading) {
    return <div className="text-center p-5">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="container mt-5">
      <h2>Chỉnh Sửa Danh Mục 🎁</h2>

      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-3">
          <label className="form-label">Tên danh mục</label>
          <input
            type="text"
            name="name"
            className="form-control"
            value={formData.name || ''}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Mã code</label>
          <input
            type="text"
            name="code"
            className="form-control"
            value={formData.code || ''}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Mô tả</label>
          <textarea
            name="description"
            className="form-control"
            value={formData.description || ''}
            onChange={handleChange}
          ></textarea>
        </div>

        {/* Upload icon */}
        <div className="mb-3">
          <label className="form-label">Icon danh mục</label>
          <div className="d-flex align-items-center gap-3">
            {preview && (
              <img
                src={preview}
                alt="preview"
                style={{
                  width: '80px',
                  height: '80px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                }}
              />
            )}
            <div>
              <label className="btn btn-outline-primary">
                <Upload size={16} className="me-2" />
                Chọn icon
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleIconChange}
                />
              </label>
              {preview && (
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger ms-2"
                  onClick={() => {
                    setIcon(null);
                    setPreview(null);
                  }}
                >
                  Xóa
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Thứ tự hiển thị</label>
          <input
            type="number"
            name="sort_order"
            className="form-control"
            value={formData.sort_order || 0}
            onChange={handleChange}
          />
        </div>

        <div className="form-check mb-3">
          <input
            type="checkbox"
            name="is_active"
            className="form-check-input"
            checked={!!formData.is_active}
            onChange={handleChange}
          />
          <label className="form-check-label">Hoạt động</label>
        </div>

        <button type="submit" className="btn btn-primary">
          Cập nhật danh mục
        </button>
      </form>
    </div>
  );
};

export default EditGiftCategory;
