import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';

const AdminGiftCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/gift-categories');
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
            try {
                await fetch(`http://localhost:8000/api/gift-categories/${id}`, {
                    method: 'DELETE',
                });
                fetchCategories();
            } catch (error) {
                console.error('Error deleting category:', error);
            }
        }
    };

    if (loading) {
        return <div className="d-flex justify-content-center p-5"><div className="spinner-border" role="status"></div></div>;
    }

    return (
        <div className="container-fluid">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Quản Lý Danh Mục Gói Quà</h2>
                <Link to="/admin/gift-categories/create" className="btn btn-primary">
                    <Plus size={20} className="me-2" />
                    Thêm Danh Mục
                </Link>
            </div>

            <div className="card">
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th>Icon</th>
                                    <th>Tên Danh Mục</th>
                                    <th>Mã Code</th>
                                    <th>Mô Tả</th>
                                    <th>Trạng Thái</th>
                                    <th>Thứ Tự</th>
                                    <th>Hành Động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map((category) => (
                                    <tr key={category.id}>
                                        <td>
                                            {category.icon_url ? (
                                                <img 
                                                    src={`http://localhost:8000${category.icon_url}`} 
                                                    alt={category.name}
                                                    className="img-thumbnail"
                                                    style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                                />
                                            ) : (
                                                <div className="bg-light rounded d-flex align-items-center justify-content-center" 
                                                     style={{ width: '40px', height: '40px' }}>
                                                    📦
                                                </div>
                                            )}
                                        </td>
                                        <td>
                                            <strong>{category.name}</strong>
                                        </td>
                                        <td>
                                            <code>{category.code}</code>
                                        </td>
                                        <td>
                                            <small className="text-muted">
                                                {category.description || 'Không có mô tả'}
                                            </small>
                                        </td>
                                        <td>
                                            <span className={`badge ${category.is_active ? 'bg-success' : 'bg-secondary'}`}>
                                                {category.is_active ? 'Hoạt động' : 'Không hoạt động'}
                                            </span>
                                        </td>
                                        <td>{category.sort_order}</td>
                                        <td>
                                            <div className="btn-group" role="group">
                                                <Link 
                                                    to={`/admin/gift-categories/edit/${category.id}`}
                                                    className="btn btn-sm btn-outline-primary"
                                                    title="Chỉnh sửa"
                                                >
                                                    <Edit size={16} />
                                                </Link>
                                                <button 
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() => handleDelete(category.id)}
                                                    title="Xóa"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminGiftCategories;
