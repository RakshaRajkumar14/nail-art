import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Plus, Image as ImageIcon, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatCurrency, formatDuration } from '@/utils/admin-helpers';

interface Service {
  id: string;
  title: string;
  description?: string;
  price: number;
  duration: number;
  imageUrl?: string;
  category?: string;
}

interface ServiceManagementProps {
  adminToken: string;
}

export default function ServiceManagement({ adminToken }: ServiceManagementProps) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    duration: '',
    category: '',
    imageUrl: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/services');
      const result = await res.json();

      if (result.success) {
        setServices(result.data);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.price || !formData.duration || !formData.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        duration: parseInt(formData.duration),
        category: formData.category,
        imageUrl: formData.imageUrl || imagePreview,
      };

      const url = editingId ? `/api/services/${editingId}` : '/api/services';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': adminToken,
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (result.success) {
        toast.success(editingId ? 'Service updated!' : 'Service created!');
        resetForm();
        await fetchServices();
      } else {
        toast.error(result.error || 'Failed to save service');
      }
    } catch (error) {
      console.error('Error saving service:', error);
      toast.error('Failed to save service');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    try {
      setLoading(true);
      const res = await fetch(`/api/services/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': adminToken,
        },
      });

      const result = await res.json();

      if (result.success) {
        toast.success('Service deleted!');
        await fetchServices();
      } else {
        toast.error(result.error || 'Failed to delete service');
      }
    } catch (error) {
      console.error('Error deleting service:', error);
      toast.error('Failed to delete service');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (service: Service) => {
    setFormData({
      title: service.title,
      description: service.description || '',
      price: service.price.toString(),
      duration: service.duration.toString(),
      category: service.category || '',
      imageUrl: service.imageUrl || '',
    });
    setImagePreview(service.imageUrl || '');
    setEditingId(service.id);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      price: '',
      duration: '',
      category: '',
      imageUrl: '',
    });
    setImageFile(null);
    setImagePreview('');
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#2e211c]">Services</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 rounded-full bg-[linear-gradient(135deg,#d7a095,#e2b3ab)] px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white transition-colors"
        >
          <Plus size={20} />
          <span>Add Service</span>
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(56,38,28,0.3)] px-4">
          <div className="mx-4 max-h-[85vh] w-full max-w-md overflow-y-auto rounded-[1.75rem] border border-[#ead8cf] bg-white p-8 shadow-[0_24px_50px_rgba(103,69,53,0.12)]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-[#2e211c]">
                {editingId ? 'Edit Service' : 'Add New Service'}
              </h3>
              <button onClick={resetForm} className="text-[#897168] hover:text-[#2e211c]">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-[#897168]">
                  Service Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full rounded-2xl border border-[#d9c1b5] bg-white px-3 py-3 text-[#2e211c] outline-none"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-[#897168]">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-2xl border border-[#d9c1b5] bg-white px-3 py-3 text-[#2e211c] outline-none"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-[#897168]">
                    Price (€) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full rounded-2xl border border-[#d9c1b5] bg-white px-3 py-3 text-[#2e211c] outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-[#897168]">
                    Duration (min) *
                  </label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full rounded-2xl border border-[#d9c1b5] bg-white px-3 py-3 text-[#2e211c] outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-[#897168]">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full rounded-2xl border border-[#d9c1b5] bg-white px-3 py-3 text-[#2e211c] outline-none"
                  required
                >
                  <option value="">Select category</option>
                  <option value="manicure">Manicure</option>
                  <option value="pedicure">Pedicure</option>
                  <option value="gel">Gel</option>
                  <option value="acrylic">Acrylic</option>
                  <option value="design">Design</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-[#897168]">
                  Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full"
                />
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full mt-2 rounded-lg h-32 object-cover"
                  />
                )}
              </div>

              <div className="flex space-x-2 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 rounded-full bg-[#b47958] py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white transition-colors disabled:bg-[#d6c7bf]"
                >
                  {loading ? 'Saving...' : editingId ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 rounded-full bg-[#f3e4dc] py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#945b3b] transition-colors hover:bg-[#ead4c7]"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-[1.75rem] border border-[#ead8cf] bg-white/90 shadow-[0_16px_36px_rgba(103,69,53,0.06)]">
        {loading && services.length === 0 ? (
          <div className="p-8 text-center text-[#897168]">Loading services...</div>
        ) : services.length === 0 ? (
          <div className="p-8 text-center text-[#897168]">No services yet. Create one to get started!</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-[#efe1d9] bg-[#fffaf7]">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-[#2e211c]">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-[#2e211c]">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-[#2e211c]">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-[#2e211c]">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-[#2e211c]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0e4de]">
                {services.map((service) => (
                  <tr key={service.id} className="hover:bg-[#fffaf7]">
                    <td className="px-6 py-4 text-sm text-[#2e211c]">{service.title}</td>
                    <td className="px-6 py-4 text-sm text-[#2e211c]">
                      {formatCurrency(service.price)}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#2e211c]">
                      {formatDuration(service.duration)}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#897168]">
                      {service.category || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleEdit(service)}
                          className="text-[#b47958] transition-colors hover:text-[#945b3b]"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(service.id)}
                          className="text-[#a55a50] transition-colors hover:text-[#7f4037]"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
