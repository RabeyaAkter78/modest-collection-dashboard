"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { mockProducts } from "@/lib/mock-data";
import { formatCurrency, getStatusColor } from "@/lib/utils";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import SearchInput from "@/components/ui/SearchInput";
import Pagination from "@/components/ui/Pagination";
import Modal from "@/components/ui/Modal";
import Select from "@/components/ui/Select";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import { useToast } from "@/context/toast-context";
import { Product } from "@/types";

const ITEMS_PER_PAGE = 6;

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModal, setDeleteModal] = useState<string | null>(null);
  const { addToast } = useToast();

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = categoryFilter === "all" || p.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, categoryFilter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleDelete = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setDeleteModal(null);
    addToast("Product deleted successfully", "success");
  };

  const categoryOptions = [
    { value: "all", label: "All Categories" },
    { value: "Borkha", label: "Borkha" },
    { value: "Abaya", label: "Abaya" },
    { value: "Hijab", label: "Hijab" },
    { value: "Innercap", label: "Innercap" },
    { value: "Accessories", label: "Accessories" },
  ];

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Products</h1>
          <p className="mt-1 text-sm text-slate-500">Manage your product catalog</p>
        </div>
        <Link href="/dashboard/products/new">
          <Button>
            <Plus size={16} />
            Add Product
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col gap-4 sm:flex-row">
          <SearchInput
            value={search}
            onChange={(v) => {
              setSearch(v);
              setCurrentPage(1);
            }}
            placeholder="Search products..."
            className="flex-1"
          />
          <Select
            options={categoryOptions}
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="sm:w-48"
          />
        </div>
      </Card>

      {/* Product Grid */}
      {paginated.length === 0 ? (
        <Card>
          <div className="py-12 text-center">
            <p className="text-lg font-medium text-slate-400">No products found</p>
            <p className="mt-1 text-sm text-slate-400">Try adjusting your search or filter</p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {paginated.map((product) => (
            <Card key={product.id} className="overflow-hidden p-0">
              {/* Product Image Placeholder */}
              <div className="flex h-40 items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary/20">{product.category.charAt(0)}</div>
                  <p className="text-xs text-slate-400">{product.category}</p>
                </div>
              </div>
              <div className="p-4">
                <div className="mb-2 flex items-start justify-between">
                  <h3 className="font-semibold text-slate-900">{product.name}</h3>
                  <Badge variant={getStatusColor(product.status)}>{product.status}</Badge>
                </div>
                <p className="mb-3 text-sm text-slate-500 line-clamp-2">{product.description}</p>
                <div className="mb-3 flex items-center justify-between text-sm">
                  <span className="font-bold text-primary">{formatCurrency(product.price)}</span>
                  <span className={product.stock > 0 ? "text-emerald-600" : "text-red-600"}>
                    {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                  </span>
                </div>
                <div className="flex gap-2 border-t border-slate-100 pt-3">
                  <Link href={`/dashboard/products/${product.id}`} className="flex-1">
                    <Button variant="ghost" size="sm" className="w-full">
                      <Edit size={14} />
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleteModal(product.id)}
                    className="text-red-600 hover:bg-red-50 hover:text-red-700"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

      {/* Delete Modal */}
      <Modal isOpen={!!deleteModal} onClose={() => setDeleteModal(null)} title="Delete Product" size="sm">
        <p className="text-sm text-slate-600">
          Are you sure you want to delete this product? This action cannot be undone.
        </p>
        <div className="mt-4 flex justify-end gap-3">
          <Button variant="secondary" size="sm" onClick={() => setDeleteModal(null)}>
            Cancel
          </Button>
          <Button variant="danger" size="sm" onClick={() => deleteModal && handleDelete(deleteModal)}>
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}
