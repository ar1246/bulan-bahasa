'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, Edit, Trash2, HelpCircle } from 'lucide-react';
import { useFAQ } from '@/hooks/use-faq';
import type { FAQItem } from '@/lib/content-types';

interface FAQManagementProps {
  onMessage: (message: string) => void;
}

const FAQManagement: React.FC<FAQManagementProps> = ({ onMessage }) => {
  const [saving, setSaving] = useState(false);
  const { faqItems, loading, refetch } = useFAQ();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FAQItem | null>(null);
  const [formData, setFormData] = useState<{
    question: string;
    answer: string;
    category: 'general' | 'registration' | 'competition' | 'technical' | 'other';
    is_active: boolean;
    sort_order: number;
  }>({
    question: '',
    answer: '',
    category: 'general',
    is_active: true,
    sort_order: 0
  });

  const categories = [
    { value: 'general', label: 'General' },
    { value: 'registration', label: 'Registration' },
    { value: 'competition', label: 'Competition' },
    { value: 'technical', label: 'Technical' },
    { value: 'other', label: 'Other' }
  ];



  const resetForm = () => {
    setFormData({
      question: '',
      answer: '',
      category: 'general',
      is_active: true,
      sort_order: 0
    });
    setEditingItem(null);
  };

  const handleSubmit = async () => {
    if (!formData.question || !formData.answer) {
      onMessage('Question and answer are required');
      return;
    }

    setSaving(true);
    try {
      const url = editingItem 
        ? `/api/admin/content/faq`
        : `/api/admin/content/faq`;
      
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
        onMessage(editingItem ? 'FAQ item updated successfully' : 'FAQ item created successfully');
        setIsDialogOpen(false);
        resetForm();
        refetch();
      } else {
        onMessage(`Failed to ${editingItem ? 'update' : 'create'} FAQ item: ${data.error}`);
      }
    } catch (error) {
      console.error('Error saving FAQ item:', error);
      onMessage(`Error ${editingItem ? 'updating' : 'creating'} FAQ item`);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item: FAQItem) => {
    setEditingItem(item);
    setFormData({
      question: item.question,
      answer: item.answer,
      category: item.category as 'general' | 'registration' | 'competition' | 'technical' | 'other',
      is_active: item.is_active,
      sort_order: item.sort_order
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this FAQ item?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/content/faq?id=${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.success) {
        onMessage('FAQ item deleted successfully');
        refetch();
      } else {
        onMessage(`Failed to delete FAQ item: ${data.error}`);
      }
    } catch (error) {
      console.error('Error deleting FAQ item:', error);
      onMessage('Error deleting FAQ item');
    }
  };

  const getCategoryLabel = (category: string) => {
    const categoryConfig = categories.find(c => c.value === category);
    return categoryConfig ? categoryConfig.label : category;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      general: 'bg-blue-100 text-blue-800',
      registration: 'bg-green-100 text-green-800',
      competition: 'bg-purple-100 text-purple-800',
      technical: 'bg-orange-100 text-orange-800',
      other: 'bg-gray-100 text-gray-800'
    };
    return colors[category as keyof typeof colors] || colors.other;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading FAQ items...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">FAQ Management</h3>
          <p className="text-sm text-gray-600">Manage frequently asked questions and answers</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add FAQ Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? 'Edit FAQ Item' : 'Add FAQ Item'}
              </DialogTitle>
              <DialogDescription>
                {editingItem ? 'Update the FAQ question and answer.' : 'Add new FAQ question and answer.'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value: 'general' | 'registration' | 'competition' | 'technical' | 'other') => setFormData(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
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
                <Label htmlFor="question">Question</Label>
                <Input
                  id="question"
                  value={formData.question}
                  onChange={(e) => setFormData(prev => ({ ...prev, question: e.target.value }))}
                  placeholder="e.g., How do I register for the competition?"
                />
              </div>

              <div>
                <Label htmlFor="answer">Answer</Label>
                <Textarea
                  id="answer"
                  value={formData.answer}
                  onChange={(e) => setFormData(prev => ({ ...prev, answer: e.target.value }))}
                  placeholder="Provide a detailed answer to the question..."
                  rows={4}
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

      <div className="space-y-4">
        {faqItems.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <HelpCircle className="h-5 w-5 text-blue-500" />
                  <div className="flex-1">
                    <CardTitle className="text-base">{item.question}</CardTitle>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge className={getCategoryColor(item.category)}>
                        {getCategoryLabel(item.category)}
                      </Badge>
                      {!item.is_active && (
                        <Badge variant="outline">Inactive</Badge>
                      )}
                      <Badge variant="outline">Order: {item.sort_order}</Badge>
                    </div>
                  </div>
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
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm text-gray-700 leading-relaxed">
                {item.answer}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FAQManagement;