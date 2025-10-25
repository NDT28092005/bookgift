import React, { useState, useEffect } from 'react';
import GiftPackageCard from './GiftPackageCard';
import { Search, Filter, Grid, List } from 'lucide-react';

const GiftPackageList = () => {
    const [giftPackages, setGiftPackages] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [viewMode, setViewMode] = useState('grid');
    const [cart, setCart] = useState([]);

    useEffect(() => {
        fetchGiftPackages();
        fetchCategories();
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

    const fetchCategories = async () => {
        try {
            const response = await fetch('/api/gift-categories');
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleAddToCart = (giftPackage) => {
        setCart(prev => [...prev, giftPackage]);
        // Có thể thêm toast notification ở đây
        console.log('Added to cart:', giftPackage.name);
    };

    const filteredPackages = giftPackages.filter(pkg => {
        const matchesSearch = pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            pkg.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = !selectedCategory || pkg.category_id === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const sortedPackages = [...filteredPackages].sort((a, b) => {
        switch (sortBy) {
            case 'price_low':
                return a.price - b.price;
            case 'price_high':
                return b.price - a.price;
            case 'rating':
                return (b.rating || 0) - (a.rating || 0);
            case 'name':
            default:
                return a.name.localeCompare(b.name);
        }
    });

    if (loading) {
        return (
            <div className="d-flex justify-content-center p-5">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid">
            <div className="row">
                {/* Sidebar Filters */}
                <div className="col-md-3">
                    <div className="card">
                        <div className="card-header">
                            <h5 className="mb-0">Bộ Lọc</h5>
                        </div>
                        <div className="card-body">
                            {/* Search */}
                            <div className="mb-3">
                                <label className="form-label">Tìm kiếm</label>
                                <div className="input-group">
                                    <span className="input-group-text">
                                        <Search size={16} />
                                    </span>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Tìm gói quà..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Category Filter */}
                            <div className="mb-3">
                                <label className="form-label">Danh mục</label>
                                <select
                                    className="form-select"
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                >
                                    <option value="">Tất cả danh mục</option>
                                    {categories.map(category => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Sort */}
                            <div className="mb-3">
                                <label className="form-label">Sắp xếp</label>
                                <select
                                    className="form-select"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                >
                                    <option value="name">Tên A-Z</option>
                                    <option value="price_low">Giá thấp đến cao</option>
                                    <option value="price_high">Giá cao đến thấp</option>
                                    <option value="rating">Đánh giá cao nhất</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="col-md-9">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2>Gói Quà Tặng</h2>
                        <div className="btn-group" role="group">
                            <button
                                className={`btn btn-outline-secondary ${viewMode === 'grid' ? 'active' : ''}`}
                                onClick={() => setViewMode('grid')}
                            >
                                <Grid size={16} />
                            </button>
                            <button
                                className={`btn btn-outline-secondary ${viewMode === 'list' ? 'active' : ''}`}
                                onClick={() => setViewMode('list')}
                            >
                                <List size={16} />
                            </button>
                        </div>
                    </div>

                    <div className="mb-3">
                        <small className="text-muted">
                            Tìm thấy {sortedPackages.length} gói quà
                        </small>
                    </div>

                    {sortedPackages.length === 0 ? (
                        <div className="text-center py-5">
                            <div className="text-muted">
                                <Filter size={48} className="mb-3" />
                                <h5>Không tìm thấy gói quà nào</h5>
                                <p>Hãy thử thay đổi bộ lọc để tìm kiếm</p>
                            </div>
                        </div>
                    ) : (
                        <div className={`row ${viewMode === 'list' ? 'g-3' : 'g-4'}`}>
                            {sortedPackages.map((giftPackage) => (
                                <div 
                                    key={giftPackage.id} 
                                    className={viewMode === 'list' ? 'col-12' : 'col-lg-4 col-md-6'}
                                >
                                    <GiftPackageCard 
                                        giftPackage={giftPackage}
                                        onAddToCart={handleAddToCart}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GiftPackageList;
