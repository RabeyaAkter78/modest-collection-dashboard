"use client";

import { useState, useMemo } from "react";
import { mockAdmins } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import SearchInput from "@/components/ui/SearchInput";
import Pagination from "@/components/ui/Pagination";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { Plus, Edit, Trash2, Shield } from "lucide-react";
import { useToast } from "@/context/toast-context";
import { User } from "@/types";
import { generateId } from "@/lib/utils";

const ITEMS_PER_PAGE = 8;

const roleOptions = [
  { value: "admin", label: "Admin" },
  { value: "super_admin", label: "Super Admin" },
];

export default function AdminsPage() {
  const [admins, setAdmins] = useState<User[]>(mockAdmins);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editAdmin, setEditAdmin] = useState<User | null>(null);
  const [deleteAdmin, setDeleteAdmin] = useState<string | null>(null);
  const { addToast } = useToast();

  const [form, setForm] = useState({ name: "", email: "", phone: "", role: "admin" });

  const filtered = useMemo(() => {
    return admins.filter(
      (a) =>
        a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.email.toLowerCase().includes(search.toLowerCase())
    );
  }, [admins, search]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const resetForm = () => setForm({ name: "", email: "", phone: "", role: "admin" });

  const handleAdd = () => {
    if (!form.name || !form.email) return;
    const newAdmin: User = {
      id: generateId(),
      name: form.name,
      email: form.email,
      phone: form.phone,
      role: form.role as User["role"],
      isBlocked: false,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setAdmins((prev) => [...prev, newAdmin]);
    setShowAddModal(false);
    resetForm();
    addToast("Admin account created successfully", "success");
  };

  const handleEdit = () => {
    if (!editAdmin || !form.name || !form.email) return;
    setAdmins((prev) =>
      prev.map((a) =>
        a.id === editAdmin.id
          ? { ...a, name: form.name, email: form.email, phone: form.phone, role: form.role as User["role"] }
          : a
      )
    );
    setEditAdmin(null);
    resetForm();
    addToast("Admin account updated successfully", "success");
  };

  const handleDelete = (id: string) => {
    setAdmins((prev) => prev.filter((a) => a.id !== id));
    setDeleteAdmin(null);
    addToast("Admin account deleted", "success");
  };

  const openEdit = (admin: User) => {
    setForm({ name: admin.name, email: admin.email, phone: admin.phone || "", role: admin.role });
    setEditAdmin(admin);
  };

  const getRoleBadge = (role: string) => {
    if (role === "super_admin") return "bg-purple-100 text-purple-700";
    return "bg-blue-100 text-blue-700";
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Management</h1>
          <p className="mt-1 text-sm text-slate-500">Manage admin accounts and roles</p>
        </div>
        <Button onClick={() => { resetForm(); setShowAddModal(true); }}>
          <Plus size={16} />
          Add Admin
        </Button>
      </div>

      <Card>
        <SearchInput
          value={search}
          onChange={(v) => { setSearch(v); setCurrentPage(1); }}
          placeholder="Search admins..."
        />
      </Card>

      <Card padding={false}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="px-6 py-4 text-left font-medium text-slate-500">Name</th>
                <th className="px-6 py-4 text-left font-medium text-slate-500">Email</th>
                <th className="px-6 py-4 text-left font-medium text-slate-500">Role</th>
                <th className="px-6 py-4 text-left font-medium text-slate-500">Created</th>
                <th className="px-6 py-4 text-left font-medium text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">No admins found</td>
                </tr>
              ) : (
                paginated.map((admin) => (
                  <tr key={admin.id} className="transition-colors hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                          {admin.name.charAt(0)}
                        </div>
                        <span className="font-medium text-slate-900">{admin.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{admin.email}</td>
                    <td className="px-6 py-4">
                      <Badge variant={getRoleBadge(admin.role)}>
                        <Shield size={12} className="mr-1" />
                        {admin.role.replace("_", " ")}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-slate-500">{formatDate(admin.createdAt)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => openEdit(admin)}>
                          <Edit size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:bg-red-50"
                          onClick={() => setDeleteAdmin(admin.id)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

      {/* Add/Edit Admin Modal */}
      <Modal
        isOpen={showAddModal || !!editAdmin}
        onClose={() => { setShowAddModal(false); setEditAdmin(null); resetForm(); }}
        title={editAdmin ? "Edit Admin" : "Add New Admin"}
        size="md"
      >
        <div className="space-y-4">
          <Input id="admin-name" label="Full Name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required />
          <Input id="admin-email" label="Email" type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} required />
          <Input id="admin-phone" label="Phone" value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} />
          <Select id="admin-role" label="Role" options={roleOptions} value={form.role} onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))} />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" size="sm" onClick={() => { setShowAddModal(false); setEditAdmin(null); resetForm(); }}>Cancel</Button>
            <Button size="sm" onClick={editAdmin ? handleEdit : handleAdd}>
              {editAdmin ? "Save Changes" : "Create Admin"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={!!deleteAdmin} onClose={() => setDeleteAdmin(null)} title="Delete Admin" size="sm">
        <p className="text-sm text-slate-600">Are you sure you want to delete this admin account? This action cannot be undone.</p>
        <div className="mt-4 flex justify-end gap-3">
          <Button variant="secondary" size="sm" onClick={() => setDeleteAdmin(null)}>Cancel</Button>
          <Button variant="danger" size="sm" onClick={() => deleteAdmin && handleDelete(deleteAdmin)}>Delete</Button>
        </div>
      </Modal>
    </div>
  );
}
