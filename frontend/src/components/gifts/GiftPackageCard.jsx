import React, { useState } from 'react';
import { Star, Heart, ShoppingCart, Truck, Shield } from 'lucide-react';

const GiftPackageCard = ({ giftPackage, onAddToCart }) => {
    const [isLiked, setIsLiked] = useState(false);

    const handleAddToCart = () => {
        onAddToCart(giftPackage);
    };

    const renderStars = (rating) => {
        return [...Array(5)].map((_, i) => (
            <Star 
                key={i} 
                size={16} 
                className={i < rating ? "text-warning" : "text-muted"} 
                fill={i < rating ? "currentColor" : "none"}
            />
        ));
    };

    return (
        <div className="card h-100 gift-package-card">
            <div className="position-relative">
                <img 
                    src={giftPackage.image_url || '/vite.svg'} 
                    className="card-img-top" 
                    alt={giftPackage.name}
                    style={{ height: '250px', objectFit: 'cover' }}
                />
                {giftPackage.is_featured && (
                    <span className="position-absolute top-0 start-0 m-2 badge bg-warning">
                        Nổi bật
                    </span>
                )}
                {giftPackage.is_student_discount && (
                    <span className="position-absolute top-0 end-0 m-2 badge bg-success">
                        SV -10%
                    </span>
                )}
                <button 
                    className="position-absolute bottom-0 end-0 m-2 btn btn-sm btn-light rounded-circle"
                    onClick={() => setIsLiked(!isLiked)}
                >
                    <Heart size={16} className={isLiked ? "text-danger" : "text-muted"} fill={isLiked ? "currentColor" : "none"} />
                </button>
            </div>
            
            <div className="card-body d-flex flex-column">
                <h5 className="card-title">{giftPackage.name}</h5>
                
                <div className="mb-2">
                    <div className="rating d-flex align-items-center">
                        {renderStars(giftPackage.rating || 0)}
                        <small className="text-muted ms-2">({giftPackage.review_count || 0})</small>
                    </div>
                </div>

                <div className="mb-3">
                    <div className="price-info">
                        <span className="current-price h5 text-primary mb-0">
                            {new Intl.NumberFormat('vi-VN').format(giftPackage.price)}đ
                        </span>
                        {giftPackage.original_price && giftPackage.original_price > giftPackage.price && (
                            <span className="original-price text-muted text-decoration-line-through ms-2">
                                {new Intl.NumberFormat('vi-VN').format(giftPackage.original_price)}đ
                            </span>
                        )}
                    </div>
                    {giftPackage.discount_percentage > 0 && (
                        <div className="text-success small">
                            Tiết kiệm {giftPackage.discount_percentage}%
                        </div>
                    )}
                </div>

                <div className="mb-3">
                    <small className="text-muted">
                        {giftPackage.description?.substring(0, 100)}...
                    </small>
                </div>

                <div className="mt-auto">
                    <div className="row g-2 mb-3">
                        <div className="col-6">
                            <div className="d-flex align-items-center text-success small">
                                <Truck size={14} className="me-1" />
                                {giftPackage.delivery_time || '1-2 ngày'}
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="d-flex align-items-center text-info small">
                                <Shield size={14} className="me-1" />
                                {giftPackage.warranty_period || '7 ngày'}
                            </div>
                        </div>
                    </div>
                    
                    <div className="d-grid gap-2">
                        <button 
                            className="btn btn-primary"
                            onClick={handleAddToCart}
                        >
                            <ShoppingCart size={16} className="me-2" />
                            Thêm vào giỏ
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GiftPackageCard;
