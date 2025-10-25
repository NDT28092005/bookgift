import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Upload } from 'lucide-react';

const EditGiftPackage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [categories, setCategories] = useState([]);
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
        warranty_period: ''
    });

    useEffect(() => {
        fetchCategories();
        if (id) {
            fetchGiftPackage();
        }
    }, [id]);

    const fetchCategories = async () => {
        try {
            const response = await fetch('/api/gift-categories');
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchGiftPackage = async () => {
        try {
            const response = await fetch(`/api/gift-packages/${id}`);
            const data = await response.json();
            setFormData({
                name: data.name || '',
                description: data.description || '',
                price: data.price || '',
                original_price: data.original_price || '',
                discount_percentage: data.discount_percentage || 0,
                category_id: data.category_id || '',
                status: data.status || 'active',
                is_featured: data.is_featured || false,
                is_student_discount: data.is_student_discount || false,
                target_audience: data.target_audience || '',
                delivery_time: data.delivery_time || '',
                warranty_period: data.warranty_period || ''
            });
        } catch (error) {
            console.error('Error fetching gift package:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const method = id ? 'PUT' : 'POST';
            const url = id ? `/api/gift-packages/${id}` : '/api/gift-packages';
            
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                navigate('/admin/gift-packages');
            } else {
                console.error('Error saving gift package');
            }
        } catch (error) {
            console.error('Error saving gift package:', error);
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    if (loading) {
        return <div className="d-flex justify-content-center p-5"><div className="spinner-border" role="status"></div></div>;
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

                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">Giá Bán *</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                name="price"
                                                value={formData.price}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">Giá Gốc</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                name="original_price"
                                                value={formData.original_price}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6">
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
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">Trạng Thái</label>
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

                                <div className="row">
                                    <div className="col-md-4">
                                        <div className="mb-3">
                                            <label className="form-label">Đối Tượng</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="target_audience"
                                                value={formData.target_audience}
                                                onChange={handleChange}
                                                placeholder="Ví dụ: Sinh viên, Trẻ em..."
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="mb-3">
                                            <label className="form-label">Thời Gian Giao Hàng</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="delivery_time"
                                                value={formData.delivery_time}
                                                onChange={handleChange}
                                                placeholder="Ví dụ: 1-2 ngày"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="mb-3">
                                            <label className="form-label">Bảo Hành</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="warranty_period"
                                                value={formData.warranty_period}
                                                onChange={handleChange}
                                                placeholder="Ví dụ: 7 ngày"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-4">
                                <div className="card">
                                    <div className="card-header">
                                        <h5>Cài Đặt</h5>
                                    </div>
                                    <div className="card-body">
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
                                            <label className="form-label">Giảm Giá (%)</label>
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
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="d-flex justify-content-end gap-2">
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
                                        <div className="spinner-border spinner-border-sm me-2" role="status"></div>
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
