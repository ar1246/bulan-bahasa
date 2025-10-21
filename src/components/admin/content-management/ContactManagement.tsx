'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, Edit, Trash2, Phone, Mail, MapPin, Clock } from 'lucide-react';
import { useContactInfo } from '@/hooks/use-contact-info';
import type { ContactInfo } from '@/lib/content-types';

interface ContactManagementProps {
  onMessage: (message: string) => void;
}

const ContactManagement: React.FC<ContactManagementProps> = ({ onMessage }) => {
  const [saving, setSaving] = useState(false);
  const { contactInfo, loading, refetch } = useContactInfo();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ContactInfo | null>(null);
  const [formData, setFormData] = useState({
    type: 'phone' as 'phone' | 'whatsapp' | 'email' | 'address' | 'hours',
    label: '',
    value: '',
    is_active: true,
    sort_order: 0
  });

  const contactTypes = [
    { value: 'phone', label: 'Phone', icon: Phone },
    { value: 'whatsapp', label: 'WhatsApp', icon: Phone },
    { value: 'email', label: 'Email', icon: Mail },
    { value: 'address', label: 'Address', icon: MapPin },
    { value: 'hours', label: 'Office Hours', icon: Clock }
  ];



  const resetForm = () => {
    setFormData({
      type: 'phone',
      label: '',
      value: '',
      is_active: true,
      sort_order: 0
    });
    setEditingItem(null);
  };

  const handleSubmit = async () => {
    if (!formData.label || !formData.value) {
      onMessage('Label and value are required');
      return;
    }

    setSaving(true);
    try {
      const url = editingItem 
        ? `/api/admin/content/contact`
        : `/api/admin/content/contact`;
      
      const method = editingItem ? 'PUT' : 'POST';
      const body = editingItem 
        ? { id: editingItem.id, ...formData }
        : formData;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (data.success) {
        onMessage(editingItem ? 'Contact info updated successfully' : 'Contact info created successfully');
        setIsDialogOpen(false);
        resetForm();
        refetch();
      } else {
        onMessage(`Failed to ${editingItem ? 'update' : 'create'} contact info: ${data.error}`);
      }
    } catch (error) {
      console.error('Error saving contact info:', error);
      onMessage(`Error ${editingItem ? 'updating' : 'creating'} contact info`);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item: ContactInfo) => {
    setEditingItem(item);
    setFormData({
      type: item.type,
      label: item.label,
      value: item.value,
      is_active: item.is_active,
      sort_order: item.sort_order
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this contact info?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/content/contact?id=${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.success) {
        onMessage('Contact info deleted successfully');
        refetch();
      } else {
        onMessage(`Failed to delete contact info: ${data.error}`);
      }
    } catch (error) {
      console.error('Error deleting contact info:', error);
      onMessage('Error deleting contact info');
    }
  };

  const getTypeIcon = (type: string) => {
    const typeConfig = contactTypes.find(t => t.value === type);
    return typeConfig ? <typeConfig.icon className="h-4 w-4" /> : null;
  };

  const getTypeLabel = (type: string) => {
    const typeConfig = contactTypes.find(t => t.value === type);
    return typeConfig ? typeConfig.label : type;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading contact information...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Contact Information</h3>
          <p className="text-sm text-gray-600">Manage phone numbers, emails, addresses, and office hours</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Contact Info
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingItem ? 'Edit Contact Info' : 'Add Contact Info'}
              </DialogTitle>
              <DialogDescription>
                {editingItem ? 'Update the contact information details.' : 'Add new contact information.'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select value={formData.type} onValueChange={(value: 'phone' | 'whatsapp' | 'email' | 'address' | 'hours') => setFormData(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {contactTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center space-x-2">
                            <type.icon className="h-4 w-4" />
                            <span>{type.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="sort_order">Sort Order</Label>
                  <Input
                    id="sort_order"
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="label">Label</Label>
                <Input
                  id="label"
                  value={formData.label}
                  onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value }))}
                  placeholder="e.g., Phone & WhatsApp, General Email"
                />
              </div>

              <div>
                <Label htmlFor="value">Value</Label>
                <Input
                  id="value"
                  value={formData.value}
                  onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
                  placeholder="e.g., +62 812-3456-7890, info@example.com"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                  className="rounded"
                />
                <Label htmlFor="is_active">Active</Label>
              </div>

              <div className="flex space-x-2">
                <Button onClick={handleSubmit} disabled={saving} className="flex-1">
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  {editingItem ? 'Update' : 'Create'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                  disabled={saving}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {contactInfo.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    {getTypeIcon(item.type)}
                    <span className="font-medium">{item.label}</span>
                  </div>
                  <Badge variant={item.is_active ? 'default' : 'secondary'}>
                    {getTypeLabel(item.type)}
                  </Badge>
                  {!item.is_active && (
                    <Badge variant="outline">Inactive</Badge>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Order: {item.sort_order}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(item)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="mt-2 text-sm text-gray-700">
                {item.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ContactManagement;