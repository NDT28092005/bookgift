import React, { useEffect, useState } from "react";
import packageApi from "../../../api/packageApi";
import categoryApi from "../../../api/categoryApi";
import Button  from "../../ui/Button";

export default function PackageList() {
  const [packages, setPackages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category_id: "",
  });

  const fetchData = async () => {
    const [pkgRes, catRes] = await Promise.all([
      packageApi.getAll(),
      categoryApi.getAll(),
    ]);
    setPackages(pkgRes.data);
    setCategories(catRes.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await packageApi.create(formData);
    setFormData({ name: "", price: "", category_id: "" });
    fetchData();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Xóa gói quà này?")) {
      await packageApi.delete(id);
      fetchData();
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Quản lý gói quà 🎈</h2>

      <form onSubmit={handleSubmit} className="mb-6 space-y-2">
        <input
          className="border p-2 w-full"
          placeholder="Tên gói quà"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <input
          className="border p-2 w-full"
          placeholder="Giá (VND)"
          type="number"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
        />
        <select
          className="border p-2 w-full"
          value={formData.category_id}
          onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
        >
          <option value="">-- Chọn danh mục --</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <Button type="submit">Thêm gói quà</Button>
      </form>

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 text-left">Tên</th>
            <th className="p-2 text-left">Giá</th>
            <th className="p-2 text-left">Danh mục</th>
            <th className="p-2 text-left">Trạng thái</th>
            <th className="p-2 text-left">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {packages.map((pkg) => (
            <tr key={pkg.id} className="border-b">
              <td className="p-2">{pkg.name}</td>
              <td className="p-2">{pkg.price}</td>
              <td className="p-2">{pkg.category?.name}</td>
              <td className="p-2">{pkg.status}</td>
              <td className="p-2">
                <Button variant="destructive" onClick={() => handleDelete(pkg.id)}>
                  Xóa
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
