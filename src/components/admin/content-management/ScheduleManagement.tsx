'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Loader2, Save, Plus, Trash2, Edit, Calendar, MapPin } from 'lucide-react';
import { useAdminScheduleEvents } from '@/hooks/use-admin-schedule-events';
import type { ScheduleEvent } from '@/lib/content-types';

interface ScheduleManagementProps {
  onMessage: (message: string) => void;
}

const ScheduleManagement: React.FC<ScheduleManagementProps> = ({ onMessage }) => {
  const { events, loading, refetch } = useAdminScheduleEvents();
  const [saving, setSaving] = useState(false);
  const [editingEvent, setEditingEvent] = useState<ScheduleEvent | null>(null);
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_date: '',
    event_type: 'online' as 'online' | 'offline' | 'deadline' | 'event',
    venue: '',
    is_active: true,
    sort_order: 0
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      event_date: '',
      event_type: 'online',
      venue: '',
      is_active: true,
      sort_order: 0
    });
    setEditingEvent(null);
    setShowForm(false);
  };

  const handleEdit = (event: ScheduleEvent) => {
    setFormData({
      title: event.title,
      description: event.description || '',
      event_date: event.event_date ? new Date(event.event_date).toISOString().slice(0, 16) : '',
      event_type: event.event_type,
      venue: event.venue || '',
      is_active: event.is_active,
      sort_order: event.sort_order
    });
    setEditingEvent(event);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = editingEvent 
        ? `/api/admin/content/schedule/${editingEvent.id}`
        : '/api/admin/content/schedule';
      
      const method = editingEvent ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        onMessage(editingEvent ? 'Schedule event updated successfully!' : 'Schedule event created successfully!');
        resetForm();
        refetch();
      } else {
        const error = await response.json();
        onMessage(`Error: ${error.error || 'Failed to save schedule event'}`);
      }
    } catch (error) {
      onMessage('Error: Failed to save schedule event');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this schedule event?')) return;

    try {
      const response = await fetch(`/api/admin/content/schedule/${eventId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        onMessage('Schedule event deleted successfully!');
        refetch();
      } else {
        const error = await response.json();
        onMessage(`Error: ${error.error || 'Failed to delete schedule event'}`);
      }
    } catch (error) {
      onMessage('Error: Failed to delete schedule event');
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'online': return 'bg-blue-100 text-blue-800';
      case 'offline': return 'bg-green-100 text-green-800';
      case 'deadline': return 'bg-red-100 text-red-800';
      case 'event': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Schedule Events</h3>
          <p className="text-sm text-gray-600">Manage competition schedule and important dates</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Event
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingEvent ? 'Edit Event' : 'Add New Event'}</CardTitle>
            <CardDescription>
              {editingEvent ? 'Update the schedule event details' : 'Create a new schedule event'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Event Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="event_type">Event Type *</Label>
                  <select
                    id="event_type"
                    value={formData.event_type}
                    onChange={(e) => setFormData({ ...formData, event_type: e.target.value as any })}
                    className="w-full p-2 border rounded-md"
                    required
                  >
                    <option value="online">Online</option>
                    <option value="offline">Offline</option>
                    <option value="deadline">Deadline</option>
                    <option value="event">Event</option>
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="event_date">Date & Time *</Label>
                  <Input
                    id="event_date"
                    type="datetime-local"
                    value={formData.event_date}
                    onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="venue">Venue</Label>
                  <Input
                    id="venue"
                    value={formData.venue}
                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                    placeholder="e.g., Campus 1, Online Platform"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sort_order">Sort Order</Label>
                  <Input
                    id="sort_order"
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="rounded"
                  />
                  <Label htmlFor="is_active">Active</Label>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={saving} className="flex items-center gap-2">
                  {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                  <Save className="h-4 w-4" />
                  {editingEvent ? 'Update' : 'Create'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {events.map((event) => (
          <Card key={event.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold">{event.title}</h4>
                    <Badge className={getEventTypeColor(event.event_type)}>
                      {event.event_type.toUpperCase()}
                    </Badge>
                    {!event.is_active && (
                      <Badge variant="secondary">Inactive</Badge>
                    )}
                  </div>
                  
                  {event.description && (
                    <p className="text-gray-600 mb-2">{event.description}</p>
                  )}
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(event.event_date)}
                    </div>
                    {event.venue && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {event.venue}
                      </div>
                    )}
                    <div>Order: {event.sort_order}</div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(event)}
                    className="flex items-center gap-1"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(event.id)}
                    className="flex items-center gap-1 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {events.length === 0 && (
          <Alert>
            <AlertDescription>
              No schedule events found. Create your first event to get started.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};

export default ScheduleManagement;