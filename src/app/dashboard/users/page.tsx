"use client";

import { useState, useMemo } from "react";
import { mockUsers } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import SearchInput from "@/components/ui/SearchInput";
import Pagination from "@/components/ui/Pagination";
import Modal from "@/components/ui/Modal";
import { Eye, Ban, CheckCircle } from "lucide-react";
import { useToast } from "@/context/toast-context";
import { User } from "@/types";

const ITEMS_PER_PAGE = 8;

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewUser, setViewUser] = useState<User | null>(null);
  const { addToast } = useToast();

  const filtered = useMemo(() => {
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );
  }, [users, search]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const toggleBlock = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, isBlocked: !u.isBlocked } : u))
    );
    const user = users.find((u) => u.id === userId);
    addToast(
      user?.isBlocked ? `${user.name} has been unblocked` : `${user?.name} has been blocked`,
      user?.isBlocked ? "success" : "warning"
    );
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Users</h1>
        <p className="mt-1 text-sm text-slate-500">Manage registered users</p>
      </div>

      <Card>
        <SearchInput
          value={search}
          onChange={(v) => { setSearch(v); setCurrentPage(1); }}
          placeholder="Search by name or email..."
        />
      </Card>

      <Card padding={false}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="px-6 py-4 text-left font-medium text-slate-500">Name</th>
                <th className="px-6 py-4 text-left font-medium text-slate-500">Email</th>
                <th className="px-6 py-4 text-left font-medium text-slate-500">Phone</th>
                <th className="px-6 py-4 text-left font-medium text-slate-500">Status</th>
                <th className="px-6 py-4 text-left font-medium text-slate-500">Joined</th>
                <th className="px-6 py-4 text-left font-medium text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">No users found</td>
                </tr>
              ) : (
                paginated.map((user) => (
                  <tr key={user.id} className="transition-colors hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                          {user.name.charAt(0)}
                        </div>
                        <span className="font-medium text-slate-900">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{user.email}</td>
                    <td className="px-6 py-4 text-slate-600">{user.phone || "—"}</td>
                    <td className="px-6 py-4">
                      <Badge variant={user.isBlocked ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"}>
                        {user.isBlocked ? "Blocked" : "Active"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-slate-500">{formatDate(user.createdAt)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setViewUser(user)}>
                          <Eye size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleBlock(user.id)}
                          className={user.isBlocked ? "text-emerald-600 hover:bg-emerald-50" : "text-red-600 hover:bg-red-50"}
                        >
                          {user.isBlocked ? <CheckCircle size={14} /> : <Ban size={14} />}
                          {user.isBlocked ? "Unblock" : "Block"}
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

      {/* View User Modal */}
      <Modal isOpen={!!viewUser} onClose={() => setViewUser(null)} title="User Details" size="md">
        {viewUser && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
                {viewUser.name.charAt(0)}
              </div>
              <div>
                <p className="text-lg font-semibold text-slate-900">{viewUser.name}</p>
                <p className="text-sm text-slate-500">{viewUser.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 rounded-lg bg-slate-50 p-4">
              <div>
                <p className="text-xs font-medium text-slate-500">Phone</p>
                <p className="text-sm text-slate-900">{viewUser.phone || "Not provided"}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Address</p>
                <p className="text-sm text-slate-900">{viewUser.address || "Not provided"}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Joined</p>
                <p className="text-sm text-slate-900">{formatDate(viewUser.createdAt)}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Status</p>
                <Badge variant={viewUser.isBlocked ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"}>
                  {viewUser.isBlocked ? "Blocked" : "Active"}
                </Badge>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
