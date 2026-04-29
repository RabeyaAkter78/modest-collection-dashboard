"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { mockProducts } from "@/lib/mock-data";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import { ArrowLeft, Upload } from "lucide-react";
import { useToast } from "@/context/toast-context";

const categoryOptions = [
  { value: "Borkha", label: "Borkha" },
  { value: "Abaya", label: "Abaya" },
  { value: "Hijab", label: "Hijab" },
  { value: "Innercap", label: "Innercap" },
  { value: "Accessories", label: "Accessories" },
];

const statusOptions = [
  { value: "active", label: "Active" },
  { value: "draft", label: "Draft" },
  { value: "archived", label: "Archived" },
];

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;
  const product = mockProducts.find((p) => p.id === productId);
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: product?.name || "",
    price: product?.price?.toString() || "",
    category: product?.category || "Borkha",
    stock: product?.stock?.toString() || "",
    description: product?.description || "",
    status: product?.status || "active",
  });

  const updateForm = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    console.log("Updated product:", { ...product, ...form, price: Number(form.price), stock: Number(form.stock) });
    addToast("Product updated successfully", "success");
    setLoading(false);
    router.push("/dashboard/products");
  };

  if (!product) {
    return (
      <div className="animate-fade-in">
        <Card>
          <div className="py-12 text-center">
            <p className="text-lg font-medium text-slate-400">Product not found</p>
            <Button variant="outline" className="mt-4" onClick={() => router.push("/dashboard/products")}>
              Back to Products
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft size={16} />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Edit Product</h1>
          <p className="mt-1 text-sm text-slate-500">Update product details</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2 space-y-6">
            <Card>
              <h3 className="mb-4 text-base font-semibold text-slate-900">Product Information</h3>
              <div className="space-y-4">
                <Input id="name" label="Product Name" value={form.name} onChange={(e) => updateForm("name", e.target.value)} required />
                <Textarea id="description" label="Description" value={form.description} onChange={(e) => updateForm("description", e.target.value)} required />
              </div>
            </Card>

            <Card>
              <h3 className="mb-4 text-base font-semibold text-slate-900">Product Images</h3>
              <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 py-12 transition-colors hover:border-primary/50">
                <Upload size={32} className="text-slate-400" />
                <p className="mt-3 text-sm font-medium text-slate-600">Click to upload or drag and drop</p>
                <p className="mt-1 text-xs text-slate-400">PNG, JPG up to 5MB</p>
                <Button variant="outline" size="sm" className="mt-4" type="button">Choose Files</Button>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <h3 className="mb-4 text-base font-semibold text-slate-900">Pricing & Stock</h3>
              <div className="space-y-4">
                <Input id="price" label="Price (৳)" type="number" value={form.price} onChange={(e) => updateForm("price", e.target.value)} required />
                <Input id="stock" label="Stock Quantity" type="number" value={form.stock} onChange={(e) => updateForm("stock", e.target.value)} required />
              </div>
            </Card>

            <Card>
              <h3 className="mb-4 text-base font-semibold text-slate-900">Organization</h3>
              <div className="space-y-4">
                <Select id="category" label="Category" options={categoryOptions} value={form.category} onChange={(e) => updateForm("category", e.target.value)} />
                <Select id="status" label="Status" options={statusOptions} value={form.status} onChange={(e) => updateForm("status", e.target.value)} />
              </div>
            </Card>

            <div className="flex gap-3">
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </Button>
              <Button variant="secondary" type="button" onClick={() => router.back()}>Cancel</Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
