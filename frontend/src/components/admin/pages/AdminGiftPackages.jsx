import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';

const AdminGiftPackages = () => {
    const [giftPackages, setGiftPackages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchGiftPackages();
    }, []);

    const fetchGiftPackages = async () => {
        try {
            const response = await fetch('/api/gift-packages');
            const data = await response.json();
            setGiftPackages(data);
        } catch (error) {
            console.error('Error fetching gift packages:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa gói quà này?')) {
            try {
                await fetch(`/api/gift-packages/${id}`, {
                    method: 'DELETE',
                });
                fetchGiftPackages();
            } catch (error) {
                console.error('Error deleting gift package:', error);
            }
        }
    };

    if (loading) {
        return <div className="d-flex justify-content-center p-5"><div className="spinner-border" role="status"></div></div>;
    }

    return (
        <div className="container-fluid">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Quản Lý Gói Quà</h2>
                <Link to="/admin/gift-packages/create" className="btn btn-primary">
                    <Plus size={20} className="me-2" />
                    Thêm Gói Quà
                </Link>
            </div>

            <div className="card">
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th>Hình Ảnh</th>
                                    <th>Tên Gói Quà</th>
                                    <th>Danh Mục</th>
                                    <th>Giá</th>
                                    <th>Trạng Thái</th>
                                    <th>Nổi Bật</th>
                                    <th>Hành Động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {giftPackages.map((giftPackage) => (
                                    <tr key={giftPackage.id}>
                                        <td>
                                            <img 
                                                src={giftPackage.image_url || '/vite.svg'} 
                                                alt={giftPackage.name}
                                                className="img-thumbnail"
                                                style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                                            />
                                        </td>
                                        <td>
                                            <div>
                                                <strong>{giftPackage.name}</strong>
                                                <br />
                                                <small className="text-muted">{giftPackage.slug}</small>
                                            </div>
                                        </td>
                                        <td>{giftPackage.category?.name || 'N/A'}</td>
                                        <td>
                                            <div>
                                                <span className="text-primary fw-bold">
                                                    {new Intl.NumberFormat('vi-VN').format(giftPackage.price)}đ
                                                </span>
                                                {giftPackage.original_price && (
                                                    <div>
                                                        <small className="text-muted text-decoration-line-through">
                                                            {new Intl.NumberFormat('vi-VN').format(giftPackage.original_price)}đ
                                                        </small>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`badge ${
                                                giftPackage.status === 'active' ? 'bg-success' : 
                                                giftPackage.status === 'inactive' ? 'bg-secondary' : 'bg-warning'
                                            }`}>
                                                {giftPackage.status === 'active' ? 'Hoạt động' :
                                                 giftPackage.status === 'inactive' ? 'Không hoạt động' : 'Hết hàng'}
                                            </span>
                                        </td>
                                        <td>
                                            {giftPackage.is_featured ? (
                                                <span className="badge bg-warning">Nổi bật</span>
                                            ) : (
                                                <span className="text-muted">-</span>
                                            )}
                                        </td>
                                        <td>
                                            <div className="btn-group" role="group">
                                                <Link 
                                                    to={`/admin/gift-packages/edit/${giftPackage.id}`}
                                                    className="btn btn-sm btn-outline-primary"
                                                    title="Chỉnh sửa"
                                                >
                                                    <Edit size={16} />
                                                </Link>
                                                <button 
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() => handleDelete(giftPackage.id)}
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

export default AdminGiftPackages;
