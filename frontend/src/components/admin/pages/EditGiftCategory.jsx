import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../../../api/axiosClient";

export default function EditGiftCategory() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        code: "",
        description: "",
        is_active: true,
        sort_order: 0
    });
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

    // Fetch category data
    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const res = await axiosClient.get(`/gift-categories/${id}`);
                setFormData(res.data);
                setPreview(res.data.icon_url || null);
            } catch (error) {
                console.error('Error fetching category:', error);
                alert('Không thể tải dữ liệu danh mục');
            }
        };
        fetchCategory();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const form = new FormData();
            form.append("name", formData.name);
            form.append("code", formData.code);
            form.append("description", formData.description);
            form.append("is_active", formData.is_active ? "1" : "0");
            form.append("sort_order", formData.sort_order);
            
            if (selectedFile) {
                form.append("file", selectedFile);
                console.log('File selected and appended:', {
                    name: selectedFile.name,
                    size: selectedFile.size,
                    type: selectedFile.type
                });
            } else {
                console.log('No file selected');
            }

            console.log('Sending update request...', {
                id,
                hasFile: !!selectedFile,
                formData: Object.fromEntries(form.entries()),
                url: `http://localhost:8000/api/gift-categories/${id}`
            });

            console.log('FormData entries:');
            for (let [key, value] of form.entries()) {
                if (value instanceof File) {
                    console.log(key, {
                        name: value.name,
                        size: value.size,
                        type: value.type
                    });
                } else {
                    console.log(key, value);
                }
            }

            // Sử dụng POST cho upload file (Laravel không hỗ trợ FormData với PUT)
            const token = localStorage.getItem("token");
            console.log('Using token:', token);
            
            // Thử không dùng token trước để test
            const res = await fetch(`http://localhost:8000/api/gift-categories/${id}/upload`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    // Không set Content-Type để browser tự động set với boundary
                },
                body: form
            });
            
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            
            const data = await res.json();
            console.log('Update successful:', data);
            
            alert('Cập nhật thành công!');
            navigate("/admin/gift-categories");
        } catch (err) {
            console.error('Update error:', err);
            alert(`Cập nhật thất bại: ${err.response?.data?.message || err.message}`);
        }

        setLoading(false);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        console.log('File input changed:', file);
        if (file) {
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file));
            console.log('File set in state:', {
                name: file.name,
                size: file.size,
                type: file.type
            });
        } else {
            setSelectedFile(null);
            setPreview(null);
            console.log('No file selected');
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Chỉnh sửa danh mục 🎁</h2>

            <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
                <div>
                    <label className="block text-sm font-medium mb-2">Tên danh mục *</label>
                    <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Mã code *</label>
                    <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.code}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Mô tả</label>
                    <textarea
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows="3"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Ảnh icon</label>
                    {preview && (
                        <div className="mb-4">
                            <img
                                src={preview}
                                alt="Preview"
                                className="w-24 h-24 object-cover rounded-lg border"
                            />
                        </div>
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Thứ tự sắp xếp</label>
                    <input
                        type="number"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.sort_order}
                        onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                    />
                </div>

                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="is_active"
                        className="mr-2"
                        checked={formData.is_active}
                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    />
                    <label htmlFor="is_active" className="text-sm font-medium">
                        Hoạt động
                    </label>
                </div>

                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
                    >
                        {loading ? "Đang lưu..." : "Lưu thay đổi"}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate("/admin/gift-categories")}
                        className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                    >
                        Hủy
                    </button>
                </div>
            </form>
        </div>
    );
}