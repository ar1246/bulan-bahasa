'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, Edit, Trash2, ExternalLink } from 'lucide-react';
import { useSocialMedia } from '@/hooks/use-social-media';
import type { SocialMedia } from '@/lib/content-types';

interface SocialMediaManagementProps {
  onMessage: (message: string) => void;
}

const SocialMediaManagement: React.FC<SocialMediaManagementProps> = ({ onMessage }) => {
  const [saving, setSaving] = useState(false);
  const { socialMedia, loading, refetch } = useSocialMedia();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SocialMedia | null>(null);
  const [formData, setFormData] = useState<{
    platform: 'instagram' | 'youtube' | 'facebook' | 'twitter' | 'tiktok';
    url: string;
    display_name: string;
    is_active: boolean;
    sort_order: number;
  }>({
    platform: 'instagram',
    url: '',
    display_name: '',
    is_active: true,
    sort_order: 0
  });

  const platforms = [
    { value: 'instagram', label: 'Instagram', color: 'bg-pink-500' },
    { value: 'youtube', label: 'YouTube', color: 'bg-red-500' },
    { value: 'facebook', label: 'Facebook', color: 'bg-blue-500' },
    { value: 'twitter', label: 'Twitter', color: 'bg-sky-500' },
    { value: 'tiktok', label: 'TikTok', color: 'bg-black' }
  ];



  const resetForm = () => {
    setFormData({
      platform: 'instagram',
      url: '',
      display_name: '',
      is_active: true,
      sort_order: 0
    });
    setEditingItem(null);
  };

  const handleSubmit = async () => {
    if (!formData.url) {
      onMessage('URL is required');
      return;
    }

    setSaving(true);
    try {
      const url = editingItem 
        ? `/api/admin/content/social-media`
        : `/api/admin/content/social-media`;
      
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
        onMessage(editingItem ? 'Social media updated successfully' : 'Social media created successfully');
        setIsDialogOpen(false);
        resetForm();
        refetch();
      } else {
        onMessage(`Failed to ${editingItem ? 'update' : 'create'} social media: ${data.error}`);
      }
    } catch (error) {
      console.error('Error saving social media:', error);
      onMessage(`Error ${editingItem ? 'updating' : 'creating'} social media`);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item: SocialMedia) => {
    setEditingItem(item);
    setFormData({
      platform: item.platform,
      url: item.url,
      display_name: item.display_name || '',
      is_active: item.is_active,
      sort_order: item.sort_order
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this social media link?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/content/social-media?id=${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.success) {
        onMessage('Social media deleted successfully');
        refetch();
      } else {
        onMessage(`Failed to delete social media: ${data.error}`);
      }
    } catch (error) {
      console.error('Error deleting social media:', error);
      onMessage('Error deleting social media');
    }
  };

  const getPlatformInfo = (platform: string) => {
    return platforms.find(p => p.value === platform) || platforms[0];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading social media links...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Social Media Links</h3>
          <p className="text-sm text-gray-600">Manage social media profiles and links</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Social Media
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingItem ? 'Edit Social Media' : 'Add Social Media'}
              </DialogTitle>
              <DialogDescription>
                {editingItem ? 'Update the social media link details.' : 'Add new social media link.'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="platform">Platform</Label>
                  <Select value={formData.platform} onValueChange={(value: 'instagram' | 'youtube' | 'facebook' | 'twitter' | 'tiktok') => setFormData(prev => ({ ...prev, platform: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {platforms.map(platform => (
                        <SelectItem key={platform.value} value={platform.value}>
                          {platform.label}
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
                <Label htmlFor="display_name">Display Name (Optional)</Label>
                <Input
                  id="display_name"
                  value={formData.display_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, display_name: e.target.value }))}
                  placeholder="e.g., Follow us on Instagram"
                />
              </div>

              <div>
                <Label htmlFor="url">URL</Label>
                <Input
                  id="url"
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                  placeholder="https://instagram.com/username"
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {socialMedia.map((item) => {
          const platformInfo = getPlatformInfo(item.platform);
          return (
            <Card key={item.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${platformInfo.color}`}></div>
                    <span className="font-medium">{platformInfo.label}</span>
                  </div>
                  <div className="flex space-x-1">
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
                
                <div className="space-y-2">
                  {item.display_name && (
                    <div className="text-sm font-medium">{item.display_name}</div>
                  )}
                  <div className="text-xs text-gray-600 truncate">{item.url}</div>
                  <div className="flex items-center justify-between">
                    <Badge variant={item.is_active ? 'default' : 'secondary'}>
                      {item.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                    <Badge variant="outline">Order: {item.sort_order}</Badge>
                  </div>
                  {item.url && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full mt-2"
                      onClick={() => window.open(item.url, '_blank')}
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Visit
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default SocialMediaManagement;