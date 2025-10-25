import React from 'react'
import { useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import img1 from '../../assets/images/goal1.jpeg'
import { ChevronLeft, ChevronRight, Gift, Star, Truck, Shield } from 'lucide-react';
import PosterSlider from './PosterSlider';
import { featuredGifts, categories, testimonials } from './data';
const Content = () => {
    const [index, setIndex] = useState(0);

    const handleSelect = (selectedIndex) => {
        setIndex(selectedIndex);
    };
    return (
        <div className="home-container">
            {/* Hero Carousel */}
            <section className="section hero">
                <div className="container">
                    <Carousel
                        activeIndex={index}
                        onSelect={handleSelect}
                        prevIcon={<ChevronLeft size={40} color="white" />}
                        nextIcon={<ChevronRight size={40} color="white" />}
                    >
                        <Carousel.Item>
                            <div className="carousel-slide d-flex align-items-center" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '400px'}}>
                                <div className="container text-white text-center">
                                    <h1 className="display-4 mb-3">🎁 Gói Quà Cho Sinh Viên</h1>
                                    <p className="lead">Những món quà ý nghĩa, giá cả phải chăng dành riêng cho sinh viên</p>
                                    <button className="btn btn-light btn-lg">Khám phá ngay</button>
                                </div>
                            </div>
                        </Carousel.Item>
                        <Carousel.Item>
                            <div className="carousel-slide d-flex align-items-center" style={{background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', minHeight: '400px'}}>
                                <div className="container text-white text-center">
                                    <h1 className="display-4 mb-3">🎓 Ưu Đãi Sinh Viên</h1>
                                    <p className="lead">Giảm giá đặc biệt cho sinh viên với thẻ sinh viên hợp lệ</p>
                                    <button className="btn btn-light btn-lg">Xem ưu đãi</button>
                                </div>
                            </div>
                        </Carousel.Item>
                        <Carousel.Item>
                            <div className="carousel-slide d-flex align-items-center" style={{background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', minHeight: '400px'}}>
                                <div className="container text-white text-center">
                                    <h1 className="display-4 mb-3">🚚 Giao Hàng Tận Nơi</h1>
                                    <p className="lead">Miễn phí giao hàng trong thành phố, đóng gói đẹp mắt</p>
                                    <button className="btn btn-light btn-lg">Đặt hàng ngay</button>
                                </div>
                            </div>
                        </Carousel.Item>
                    </Carousel>
                </div>
            </section>

            {/* Quick Order Bar */}
            <section className="section quick-book">
                <div className="container">
                    <div className="quick-book__grid">
                        <select className="form-select">
                            <option>1. Chọn Danh Mục</option>
                        </select>
                        <select className="form-select">
                            <option>2. Chọn Gói Quà</option>
                        </select>
                        <select className="form-select">
                            <option>3. Chọn Ngày Giao</option>
                        </select>
                        <select className="form-select">
                            <option>4. Chọn Thời Gian</option>
                        </select>
                        <button className="btn btn-book">Đặt hàng ngay</button>
                    </div>
                </div>
            </section>

            {/* Featured Gifts */}
            <section className="section movies">
                <div className="container">
                    <h3 className="section__title">Gói Quà Nổi Bật</h3>
                    <PosterSlider
                        items={featuredGifts}
                        renderItem={(gift) => (
                            <div className="movie-card">
                                <img src={gift.image} alt={gift.name} />
                                <div className="movie-card__meta">
                                    <div className="movie-card__name">{gift.name}</div>
                                    <div className="price-info">
                                        <span className="current-price">{gift.price}đ</span>
                                        {gift.originalPrice && <span className="original-price">{gift.originalPrice}đ</span>}
                                    </div>
                                    <button className="btn btn-sm btn-book">Mua ngay</button>
                                </div>
                            </div>
                        )}
                    />
                </div>
            </section>

            {/* Categories */}
            <section className="section movies alt">
                <div className="container">
                    <h3 className="section__title">Danh Mục Quà Tặng</h3>
                    <PosterSlider
                        items={categories}
                        renderItem={(category) => (
                            <div className="movie-card">
                                <img src={category.image} alt={category.name} />
                                <div className="movie-card__meta">
                                    <div className="movie-card__name">{category.name}</div>
                                    <button className="btn btn-sm btn-outline">Xem tất cả</button>
                                </div>
                            </div>
                        )}
                    />
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="section promo">
                <div className="container">
                    <h3 className="section__title">Tại Sao Chọn Chúng Tôi?</h3>
                    <div className="row g-4">
                        <div className="col-md-3 col-6">
                            <div className="text-center">
                                <Gift size={48} className="text-primary mb-3" />
                                <h5>Gói Quà Đa Dạng</h5>
                                <p className="text-muted">Nhiều lựa chọn phù hợp với mọi dịp</p>
                            </div>
                        </div>
                        <div className="col-md-3 col-6">
                            <div className="text-center">
                                <Star size={48} className="text-warning mb-3" />
                                <h5>Chất Lượng Cao</h5>
                                <p className="text-muted">Sản phẩm chất lượng, giá cả hợp lý</p>
                            </div>
                        </div>
                        <div className="col-md-3 col-6">
                            <div className="text-center">
                                <Truck size={48} className="text-success mb-3" />
                                <h5>Giao Hàng Nhanh</h5>
                                <p className="text-muted">Giao hàng tận nơi, đúng giờ</p>
                            </div>
                        </div>
                        <div className="col-md-3 col-6">
                            <div className="text-center">
                                <Shield size={48} className="text-info mb-3" />
                                <h5>Bảo Hành</h5>
                                <p className="text-muted">Đổi trả trong 7 ngày</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Student Benefits */}
            <section className="section membership">
                <div className="container">
                    <h3 className="section__title">Ưu Đãi Sinh Viên</h3>
                    <div className="row g-3">
                        <div className="col-12 col-md-6">
                            <div className="member-card">
                                <img src={img1} alt="student-discount" />
                                <div className="member-card__content">
                                    <h5>Giảm Giá Sinh Viên</h5>
                                    <p>Giảm 10% cho tất cả sản phẩm khi có thẻ sinh viên</p>
                                    <button className="btn btn-outline">Tìm hiểu</button>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-md-6">
                            <div className="member-card">
                                <img src={img1} alt="free-shipping" />
                                <div className="member-card__content">
                                    <h5>Miễn Phí Giao Hàng</h5>
                                    <p>Miễn phí ship cho đơn hàng từ 200k</p>
                                    <button className="btn btn-outline">Tìm hiểu</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="section services">
                <div className="container">
                    <h3 className="section__title">Khách Hàng Nói Gì</h3>
                    <PosterSlider
                        items={testimonials}
                        renderItem={(testimonial) => (
                            <div className="service-card">
                                <div className="card h-100">
                                    <div className="card-body text-center">
                                        <img src={testimonial.avatar} alt={testimonial.name} className="rounded-circle mb-3" width="60" height="60" />
                                        <h6>{testimonial.name}</h6>
                                        <p className="text-muted">{testimonial.content}</p>
                                        <div className="rating">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={16} className={i < testimonial.rating ? "text-warning" : "text-muted"} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    />
                </div>
            </section>

            {/* Contact */}
            <section className="section contact">
                <div className="container contact__grid">
                    <div className="contact__socials">
                        <button className="btn btn-social">Facebook</button>
                        <button className="btn btn-social alt">Zalo Chat</button>
                    </div>
                    <div className="contact__form">
                        <div className="card p-3">
                            <h5 className="mb-3">Liên hệ với chúng tôi</h5>
                            <div className="row g-2">
                                <div className="col-12 col-md-6">
                                    <input className="form-control" placeholder="Họ và tên" />
                                </div>
                                <div className="col-12 col-md-6">
                                    <input className="form-control" placeholder="Số điện thoại" />
                                </div>
                                <div className="col-12">
                                    <input className="form-control" placeholder="Email" />
                                </div>
                                <div className="col-12">
                                    <textarea className="form-control" rows="4" placeholder="Nội dung"></textarea>
                                </div>
                                <div className="col-12">
                                    <button className="btn btn-book w-100">Gửi ngay</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Content
