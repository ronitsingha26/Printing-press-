import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Card from "../../components/UI/Card";
import Button from "../../components/UI/Button";
import Modal from "../../components/UI/Modal";
import Input from "../../components/UI/Input";
import * as api from "../../mock/api";
import Loader from "../../components/UI/Loader";

export default function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "" });
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const data = await api.listCustomers();
      setCustomers(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function openAdd() {
    setEditing(null);
    setForm({ name: "", phone: "", email: "", address: "" });
    setOpen(true);
  }

  function openEdit(c) {
    setEditing(c);
    setForm({
      name: c.name || "",
      phone: c.phone || "",
      email: c.email || "",
      address: c.address || "",
    });
    setOpen(true);
  }

  async function save() {
    try {
      if (!form.name.trim()) return toast.error("Name required");
      if (editing) {
        await api.updateCustomer(editing.id, form);
        toast.success("Updated");
      } else {
        await api.createCustomer(form);
        toast.success("Created");
      }
      setOpen(false);
      load();
    } catch (e) {
      toast.error(e?.message || "Save failed");
    }
  }

  async function remove(id) {
    if (!confirm("Delete customer?")) return;
    try {
      await api.deleteCustomer(id);
      toast.success("Deleted");
      load();
    } catch {
      toast.error("Delete failed");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Customers</div>
          <div className="text-sm sm:text-[15px] font-medium text-gray-500 mt-1">Manage customer directory</div>
        </div>
        <Button className="w-full sm:w-auto font-bold py-3 shadow-md" onClick={openAdd}>Add Customer</Button>
      </div>

      <Card className="p-0 border-t-4 border-t-[#3E8B6F] overflow-hidden">
        {loading ? (
          <div className="p-10"><Loader /></div>
        ) : (
          <div className="overflow-x-auto px-6 pb-6">
            <table className="w-full text-left text-sm mt-4 whitespace-nowrap">
              <thead>
                <tr className="text-gray-400 font-bold border-b border-gray-100">
                  <th className="pb-3 pr-4 uppercase tracking-wider text-xs">Name</th>
                  <th className="pb-3 pr-4 uppercase tracking-wider text-xs">Phone</th>
                  <th className="pb-3 pr-4 uppercase tracking-wider text-xs">Email</th>
                  <th className="pb-3 pr-4 uppercase tracking-wider text-xs">Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 pr-4 font-bold text-gray-900">{c.name}</td>
                    <td className="py-4 pr-4 font-medium text-gray-700">{c.phone || "-"}</td>
                    <td className="py-4 pr-4 font-medium text-gray-600">{c.email || "-"}</td>
                    <td className="py-4 pr-4">
                      <div className="flex flex-wrap gap-2">
                        <Button variant="ghost" onClick={() => openEdit(c)}>
                          Edit
                        </Button>
                        <Button variant="danger" onClick={() => remove(c.id)}>
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!customers.length ? (
                  <tr>
                    <td className="py-8 text-center text-gray-500 font-medium" colSpan={4}>
                      No customers yet.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal
        title={editing ? "Edit Customer" : "Add Customer"}
        open={open}
        onClose={() => setOpen(false)}
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={save}>Save</Button>
          </>
        }
      >
        <div className="grid grid-cols-1 gap-4">
          <Input 
             label="Name" 
             value={form.name} 
             onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
             className="w-full rounded-[16px] bg-gray-50 border border-gray-200 px-4 py-3 text-[15px] font-medium text-gray-900 outline-none focus:border-[#3E8B6F] focus:ring-4 focus:ring-[#3E8B6F]/10 focus:bg-white transition-all shadow-sm block mt-1"
             labelClassName="text-sm font-semibold text-gray-500 mb-1" 
          />
          <Input 
             label="Phone" 
             value={form.phone} 
             onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} 
             className="w-full rounded-[16px] bg-gray-50 border border-gray-200 px-4 py-3 text-[15px] font-medium text-gray-900 outline-none focus:border-[#3E8B6F] focus:ring-4 focus:ring-[#3E8B6F]/10 focus:bg-white transition-all shadow-sm block mt-1"
             labelClassName="text-sm font-semibold text-gray-500 mb-1"
          />
          <Input 
             label="Email" 
             value={form.email} 
             onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} 
             className="w-full rounded-[16px] bg-gray-50 border border-gray-200 px-4 py-3 text-[15px] font-medium text-gray-900 outline-none focus:border-[#3E8B6F] focus:ring-4 focus:ring-[#3E8B6F]/10 focus:bg-white transition-all shadow-sm block mt-1"
             labelClassName="text-sm font-semibold text-gray-500 mb-1"
          />
          <label className="block">
            <div className="text-sm font-semibold text-gray-500 mb-1">Address</div>
            <textarea
              className="w-full rounded-[16px] bg-gray-50 border border-gray-200 px-4 py-3 text-[15px] font-medium text-gray-900 outline-none focus:border-[#3E8B6F] focus:ring-4 focus:ring-[#3E8B6F]/10 focus:bg-white transition-all shadow-sm"
              rows={3}
              value={form.address}
              onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
            />
          </label>
        </div>
      </Modal>
    </div>
  );
}
