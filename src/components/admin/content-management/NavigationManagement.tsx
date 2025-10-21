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
import { Loader2, Plus, Edit, Trash2, Menu, ExternalLink, ArrowUp, ArrowDown } from 'lucide-react';
import { useNavigation } from '@/hooks/use-navigation';
import type { NavigationItem } from '@/lib/content-types';

interface NavigationManagementProps {
  onMessage: (message: string) => void;
}

const NavigationManagement: React.FC<NavigationManagementProps> = ({ onMessage }) => {
  const [saving, setSaving] = useState(false);
  const { navigationItems, loading, refetch } = useNavigation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<NavigationItem | null>(null);
  const [formData, setFormData] = useState({
    label: '',
    href: '',
    target_new_tab: false,
    is_active: true,
    sort_order: 0
  });



  const resetForm = () => {
    setFormData({
      label: '',
      href: '',
      target_new_tab: false,
      is_active: true,
      sort_order: 0
    });
    setEditingItem(null);
  };

  const handleSubmit = async () => {
    if (!formData.label || !formData.href) {
      onMessage('Label and URL are required');
      return;
    }

    setSaving(true);
    try {
      const url = editingItem 
        ? `/api/admin/content/navigation`
        : `/api/admin/content/navigation`;
      
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
        onMessage(editingItem ? 'Navigation item updated successfully' : 'Navigation item created successfully');
        setIsDialogOpen(false);
        resetForm();
        refetch();
      } else {
        onMessage(`Failed to ${editingItem ? 'update' : 'create'} navigation item: ${data.error}`);
      }
    } catch (error) {
      console.error('Error saving navigation item:', error);
      onMessage(`Error ${editingItem ? 'updating' : 'creating'} navigation item`);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item: NavigationItem) => {
    setEditingItem(item);
    setFormData({
      label: item.label,
      href: item.href,
      target_new_tab: item.target_new_tab,
      is_active: item.is_active,
      sort_order: item.sort_order
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this navigation item?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/content/navigation?id=${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.success) {
        onMessage('Navigation item deleted successfully');
        refetch();
      } else {
        onMessage(`Failed to delete navigation item: ${data.error}`);
      }
    } catch (error) {
      console.error('Error deleting navigation item:', error);
      onMessage('Error deleting navigation item');
    }
  };

  const moveItem = async (item: NavigationItem, direction: 'up' | 'down') => {
    const sortedItems = [...navigationItems].sort((a, b) => a.sort_order - b.sort_order);
    const currentIndex = sortedItems.findIndex(i => i.id === item.id);
    
    if (direction === 'up' && currentIndex === 0) return;
    if (direction === 'down' && currentIndex === sortedItems.length - 1) return;
    
    const swapIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const swapItem = sortedItems[swapIndex];
    
    // Update sort orders
    const updatedItems = navigationItems.map(navItem => {
      if (navItem.id === item.id) {
        return { ...navItem, sort_order: swapItem.sort_order };
      }
      if (navItem.id === swapItem.id) {
        return { ...navItem, sort_order: item.sort_order };
      }
      return navItem;
    });
    
    setNavigationItems(updatedItems);
    
    // Update in database
    try {
      await Promise.all([
        fetch('/api/admin/content/navigation', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: item.id, sort_order: swapItem.sort_order })
        }),
        fetch('/api/admin/content/navigation', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: swapItem.id, sort_order: item.sort_order })
        })
      ]);
      onMessage('Navigation order updated successfully');
    } catch (error) {
      console.error('Error updating navigation order:', error);
      onMessage('Error updating navigation order');
      fetchNavigationItems(); // Revert on error
    }
  };

  const getTargetLabel = (target_new_tab: boolean) => {
    return target_new_tab ? 'New Window' : 'Same Window';
  };

  const getTargetIcon = (target_new_tab: boolean) => {
    return target_new_tab ? <ExternalLink className="h-3 w-3" /> : null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading navigation items...</span>
      </div>
    );
  }

  const sortedItems = [...navigationItems].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Navigation Management</h3>
          <p className="text-sm text-gray-600">Manage website navigation menu items</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Navigation Item
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingItem ? 'Edit Navigation Item' : 'Add Navigation Item'}
              </DialogTitle>
              <DialogDescription>
                {editingItem ? 'Update the navigation menu item.' : 'Add new navigation menu item.'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="target_new_tab">Target</Label>
                  <Select value={formData.target_new_tab ? '_blank' : '_self'} onValueChange={(value) => setFormData(prev => ({ ...prev, target_new_tab: value === '_blank' }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="_self">Same Window</SelectItem>
                      <SelectItem value="_blank">New Window</SelectItem>
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
                  placeholder="e.g., Home, About, Contact"
                />
              </div>

              <div>
                <Label htmlFor="href">URL</Label>
                <Input
                  id="href"
                  value={formData.href}
                  onChange={(e) => setFormData(prev => ({ ...prev, href: e.target.value }))}
                  placeholder="e.g., /, /about, https://example.com"
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
        {sortedItems.map((item, index) => (
          <Card key={item.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Menu className="h-4 w-4 text-gray-400" />
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{item.label}</span>
                    <Badge variant={item.is_active ? 'default' : 'secondary'}>
                      {item.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                    <Badge variant="outline" className="flex items-center space-x-1">
                      {getTargetIcon(item.target_new_tab)}
                      <span>{getTargetLabel(item.target_new_tab)}</span>
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1 mr-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => moveItem(item, 'up')}
                      disabled={index === 0}
                    >
                      <ArrowUp className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => moveItem(item, 'down')}
                      disabled={index === sortedItems.length - 1}
                    >
                      <ArrowDown className="h-3 w-3" />
                    </Button>
                  </div>
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
              <div className="mt-2 text-sm text-gray-600 flex items-center space-x-2">
                <span>URL: {item.href}</span>
                <span>•</span>
                <span>Order: {item.sort_order}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default NavigationManagement;