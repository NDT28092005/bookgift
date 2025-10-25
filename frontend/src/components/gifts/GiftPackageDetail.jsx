import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Star, Heart, ShoppingCart, Truck, Shield, ArrowLeft, Share2 } from 'lucide-react';

const GiftPackageDetail = () => {
    const { id } = useParams();
    const [giftPackage, setGiftPackage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [isLiked, setIsLiked] = useState(false);

    useEffect(() => {
        fetchGiftPackage();
    }, [id]);

    const fetchGiftPackage = async () => {
        try {
            const response = await fetch(`/api/gift-packages/${id}`);
            const data = await response.json();
            setGiftPackage(data);
        } catch (error) {
            console.error('Error fetching gift package:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = () => {
        // Logic thêm vào giỏ hàng
        console.log('Added to cart:', giftPackage.name, 'Quantity:', quantity);
    };

    const handleBuyNow = () => {
        // Logic mua ngay
        console.log('Buy now:', giftPackage.name, 'Quantity:', quantity);
    };

    const renderStars = (rating) => {
        return [...Array(5)].map((_, i) => (
            <Star 
                key={i} 
                size={20} 
                className={i < rating ? "text-warning" : "text-muted"} 
                fill={i < rating ? "currentColor" : "none"}
            />
        ));
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center p-5">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (!giftPackage) {
        return (
            <div className="container">
                <div className="text-center py-5">
                    <h3>Không tìm thấy gói quà</h3>
                    <p className="text-muted">Gói quà bạn tìm kiếm không tồn tại hoặc đã bị xóa.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="mb-3">
                <button className="btn btn-outline-secondary">
                    <ArrowLeft size={16} className="me-2" />
                    Quay lại
                </button>
            </div>

            <div className="row">
                {/* Product Images */}
                <div className="col-md-6">
                    <div className="card">
                        <div className="position-relative">
                            <img 
                                src={giftPackage.image_url || '/vite.svg'} 
                                className="card-img-top" 
                                alt={giftPackage.name}
                                style={{ height: '400px', objectFit: 'cover' }}
                            />
                            {giftPackage.is_featured && (
                                <span className="position-absolute top-0 start-0 m-3 badge bg-warning fs-6">
                                    Nổi bật
                                </span>
                            )}
                            {giftPackage.is_student_discount && (
                                <span className="position-absolute top-0 end-0 m-3 badge bg-success fs-6">
                                    SV -10%
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Product Info */}
                <div className="col-md-6">
                    <div className="card h-100">
                        <div className="card-body">
                            <h1 className="card-title">{giftPackage.name}</h1>
                            
                            <div className="mb-3">
                                <div className="rating d-flex align-items-center">
                                    {renderStars(giftPackage.rating || 0)}
                                    <span className="ms-2 text-muted">
                                        ({giftPackage.review_count || 0} đánh giá)
                                    </span>
                                </div>
                            </div>

                            <div className="mb-4">
                                <div className="price-info">
                                    <span className="current-price h3 text-primary mb-0">
                                        {new Intl.NumberFormat('vi-VN').format(giftPackage.price)}đ
                                    </span>
                                    {giftPackage.original_price && giftPackage.original_price > giftPackage.price && (
                                        <>
                                            <span className="original-price text-muted text-decoration-line-through ms-3 fs-5">
                                                {new Intl.NumberFormat('vi-VN').format(giftPackage.original_price)}đ
                                            </span>
                                            <span className="badge bg-danger ms-2">
                                                -{giftPackage.discount_percentage}%
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="mb-4">
                                <h5>Mô tả sản phẩm</h5>
                                <p className="text-muted">{giftPackage.description}</p>
                            </div>

                            <div className="row mb-4">
                                <div className="col-6">
                                    <div className="d-flex align-items-center text-success">
                                        <Truck size={20} className="me-2" />
                                        <div>
                                            <div className="fw-bold">Giao hàng</div>
                                            <small>{giftPackage.delivery_time || '1-2 ngày'}</small>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="d-flex align-items-center text-info">
                                        <Shield size={20} className="me-2" />
                                        <div>
                                            <div className="fw-bold">Bảo hành</div>
                                            <small>{giftPackage.warranty_period || '7 ngày'}</small>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {giftPackage.target_audience && (
                                <div className="mb-4">
                                    <h6>Đối tượng:</h6>
                                    <span className="badge bg-primary">{giftPackage.target_audience}</span>
                                </div>
                            )}

                            <div className="mb-4">
                                <div className="row align-items-center">
                                    <div className="col-auto">
                                        <label className="form-label">Số lượng:</label>
                                    </div>
                                    <div className="col-auto">
                                        <div className="input-group" style={{ width: '120px' }}>
                                            <button 
                                                className="btn btn-outline-secondary"
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            >
                                                -
                                            </button>
                                            <input 
                                                type="number" 
                                                className="form-control text-center"
                                                value={quantity}
                                                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                                min="1"
                                            />
                                            <button 
                                                className="btn btn-outline-secondary"
                                                onClick={() => setQuantity(quantity + 1)}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="d-grid gap-2 mb-3">
                                <button 
                                    className="btn btn-primary btn-lg"
                                    onClick={handleBuyNow}
                                >
                                    <ShoppingCart size={20} className="me-2" />
                                    Mua ngay
                                </button>
                                <button 
                                    className="btn btn-outline-primary"
                                    onClick={handleAddToCart}
                                >
                                    Thêm vào giỏ hàng
                                </button>
                            </div>

                            <div className="d-flex gap-2">
                                <button 
                                    className="btn btn-outline-danger"
                                    onClick={() => setIsLiked(!isLiked)}
                                >
                                    <Heart size={16} className="me-2" />
                                    {isLiked ? 'Đã thích' : 'Thích'}
                                </button>
                                <button className="btn btn-outline-secondary">
                                    <Share2 size={16} className="me-2" />
                                    Chia sẻ
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reviews Section */}
            <div className="row mt-5">
                <div className="col-12">
                    <div className="card">
                        <div className="card-header">
                            <h5>Đánh giá sản phẩm</h5>
                        </div>
                        <div className="card-body">
                            <div className="text-center py-4">
                                <p className="text-muted">Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá!</p>
                                <button className="btn btn-primary">Viết đánh giá</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GiftPackageDetail;
