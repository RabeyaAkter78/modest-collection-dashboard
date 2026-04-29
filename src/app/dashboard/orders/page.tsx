"use client";

import { useState, useMemo } from "react";
import { mockOrders } from "@/lib/mock-data";
import { formatCurrency, formatDate, getStatusColor } from "@/lib/utils";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import SearchInput from "@/components/ui/SearchInput";
import Select from "@/components/ui/Select";
import Pagination from "@/components/ui/Pagination";
import Modal from "@/components/ui/Modal";
import { Eye, ChevronDown } from "lucide-react";
import { useToast } from "@/context/toast-context";
import { Order } from "@/types";

const ITEMS_PER_PAGE = 8;

const statusOptions = [
  { value: "all", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

const updateStatusOptions = [
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewOrder, setViewOrder] = useState<Order | null>(null);
  const [editStatus, setEditStatus] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState("");
  const { addToast } = useToast();

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const matchesSearch =
        o.id.toLowerCase().includes(search.toLowerCase()) ||
        o.userName.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || o.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleStatusUpdate = () => {
    if (!editStatus || !newStatus) return;
    setOrders((prev) =>
      prev.map((o) => (o.id === editStatus.id ? { ...o, status: newStatus as Order["status"] } : o))
    );
    setEditStatus(null);
    setNewStatus("");
    addToast("Order status updated successfully", "success");
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Orders</h1>
        <p className="mt-1 text-sm text-slate-500">Manage and track customer orders</p>
      </div>

      <Card>
        <div className="flex flex-col gap-4 sm:flex-row">
          <SearchInput
            value={search}
            onChange={(v) => { setSearch(v); setCurrentPage(1); }}
            placeholder="Search by order ID or customer..."
            className="flex-1"
          />
          <Select
            options={statusOptions}
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="sm:w-48"
          />
        </div>
      </Card>

      <Card padding={false}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="px-6 py-4 text-left font-medium text-slate-500">Order ID</th>
                <th className="px-6 py-4 text-left font-medium text-slate-500">Customer</th>
                <th className="px-6 py-4 text-left font-medium text-slate-500">Items</th>
                <th className="px-6 py-4 text-left font-medium text-slate-500">Total</th>
                <th className="px-6 py-4 text-left font-medium text-slate-500">Status</th>
                <th className="px-6 py-4 text-left font-medium text-slate-500">Date</th>
                <th className="px-6 py-4 text-left font-medium text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">No orders found</td>
                </tr>
              ) : (
                paginated.map((order) => (
                  <tr key={order.id} className="transition-colors hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-900">{order.id}</td>
                    <td className="px-6 py-4 text-slate-600">{order.userName}</td>
                    <td className="px-6 py-4 text-slate-600">{order.items.length} items</td>
                    <td className="px-6 py-4 font-medium text-slate-900">{formatCurrency(order.total)}</td>
                    <td className="px-6 py-4">
                      <Badge variant={getStatusColor(order.status)}>{order.status}</Badge>
                    </td>
                    <td className="px-6 py-4 text-slate-500">{formatDate(order.createdAt)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setViewOrder(order)}>
                          <Eye size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => { setEditStatus(order); setNewStatus(order.status); }}
                        >
                          <ChevronDown size={14} />
                          Status
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

      {/* View Order Modal */}
      <Modal isOpen={!!viewOrder} onClose={() => setViewOrder(null)} title={`Order ${viewOrder?.id}`} size="lg">
        {viewOrder && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-medium text-slate-500">Customer</p>
                <p className="text-sm font-medium text-slate-900">{viewOrder.userName}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Payment Method</p>
                <p className="text-sm text-slate-900">{viewOrder.paymentMethod}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Status</p>
                <Badge variant={getStatusColor(viewOrder.status)}>{viewOrder.status}</Badge>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Date</p>
                <p className="text-sm text-slate-900">{formatDate(viewOrder.createdAt)}</p>
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Shipping Address</p>
              <p className="text-sm text-slate-900">{viewOrder.shippingAddress}</p>
            </div>
            <div className="border-t border-slate-200 pt-4">
              <p className="mb-3 text-xs font-medium text-slate-500">Order Items</p>
              {viewOrder.items.map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{item.productName}</p>
                    <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-medium text-slate-900">{formatCurrency(item.price * item.quantity)}</p>
                </div>
              ))}
              <div className="border-t border-slate-200 pt-3">
                <div className="flex justify-between">
                  <p className="text-sm font-bold text-slate-900">Total</p>
                  <p className="text-sm font-bold text-primary">{formatCurrency(viewOrder.total)}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Update Status Modal */}
      <Modal isOpen={!!editStatus} onClose={() => setEditStatus(null)} title="Update Order Status" size="sm">
        <div className="space-y-4">
          <Select
            id="newStatus"
            label="New Status"
            options={updateStatusOptions}
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
          />
          <div className="flex justify-end gap-3">
            <Button variant="secondary" size="sm" onClick={() => setEditStatus(null)}>Cancel</Button>
            <Button size="sm" onClick={handleStatusUpdate}>Update Status</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
