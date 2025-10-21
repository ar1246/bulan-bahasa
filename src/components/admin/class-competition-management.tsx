'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Download, Printer, Plus, Search, SortAsc } from 'lucide-react';

interface ClassRegistration {
  id: string;
  pic_name: string;
  class: string;
  phone_number: string;
  competition_category: string;
  registration_date: string;
  status: 'confirmed' | 'pending';
}

const ClassCompetitionManagement = () => {
  const [registrations, setRegistrations] = useState<ClassRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'class' | 'name'>('date');
  const [competitionFilter, setCompetitionFilter] = useState('all');
  const [message, setMessage] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newRegistration, setNewRegistration] = useState({
    pic_name: '',
    class: '',
    phone_number: '',
    competition_category: ''
  });

  const competitions = [
    'Arabic Creative Comic',
    'Sundanese Pop Cover', 
    'Market Day'
  ];

  const classes = [
    'VII-A', 'VII-B', 'VII-C', 'VII-D', 'VII-E', 'VII-F', 'VII-G', 'VII-H', 'VII-I', 'VII-J', 'VII-K',
    'VIII-A', 'VIII-B', 'VIII-C', 'VIII-D', 'VIII-E', 'VIII-F', 'VIII-G', 'VIII-H', 'VIII-I', 'VIII-J', 'VIII-K',
    'IX-A', 'IX-B', 'IX-C', 'IX-D', 'IX-E', 'IX-F', 'IX-G', 'IX-H', 'IX-I', 'IX-J', 'IX-K'
  ];

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const response = await fetch('/api/register');
      const data = await response.json();
      
      if (data.success) {
        setRegistrations(data.registrations);
      } else {
        setMessage('Failed to fetch registrations');
      }
    } catch (error) {
      console.error('Error fetching registrations:', error);
      setMessage('Error fetching registrations');
    } finally {
      setLoading(false);
    }
  };

  const handleAddRegistration = async () => {
    try {
      const response = await fetch('/api/admin/class-registrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRegistration),
      });

      const data = await response.json();
      
      if (data.success) {
        setMessage('Registration added successfully');
        setIsAddDialogOpen(false);
        setNewRegistration({ pic_name: '', class: '', phone_number: '', competition_category: '' });
        fetchRegistrations();
      } else {
        setMessage(`Failed to add registration: ${data.error}`);
      }
    } catch (error) {
      console.error('Error adding registration:', error);
      setMessage('Error adding registration');
    }
  };

  const handleDelete = async (registrationId: string) => {
    if (!confirm('Are you sure you want to delete this registration? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/class-registrations?id=${registrationId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (data.success) {
        setMessage('Registration deleted successfully');
        fetchRegistrations();
      } else {
        setMessage(`Failed to delete registration: ${data.error}`);
      }
    } catch (error) {
      console.error('Error deleting registration:', error);
      setMessage('Error deleting registration');
    }
  };

  // Filter and sort registrations
  const filteredRegistrations = registrations
    .filter(registration => {
      const matchesSearch = searchTerm === '' || 
        registration.pic_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        registration.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
        registration.phone_number.includes(searchTerm) ||
        registration.competition_category.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCompetition = competitionFilter === 'all' || registration.competition_category === competitionFilter;
      
      return matchesSearch && matchesCompetition;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.registration_date).getTime() - new Date(a.registration_date).getTime();
        case 'class':
          return a.class.localeCompare(b.class);
        case 'name':
          return a.pic_name.localeCompare(b.pic_name);
        default:
          return 0;
      }
    });

  const getCompetitionBadge = (category: string) => {
    switch (category) {
      case 'Arabic Creative Comic':
        return <Badge variant="secondary" className="bg-purple-100 text-purple-700">🎨 Arabic Comic</Badge>;
      case 'Sundanese Pop Cover':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-700">🎤 Pop Cover</Badge>;
      case 'Market Day':
        return <Badge variant="secondary" className="bg-orange-100 text-orange-700">🛍️ Market Day</Badge>;
      default:
        return <Badge variant="secondary" className="bg-gray-100 text-gray-700">📁 {category}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    return status === 'confirmed' 
      ? <Badge variant="secondary" className="bg-green-100 text-green-700">✅ Confirmed</Badge>
      : <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">⏳ Pending</Badge>;
  };

  const handleExport = () => {
    // Create CSV content
    const headers = ['PIC Name', 'Class', 'Phone Number', 'Competition Category', 'Registration Date', 'Status'];
    const csvContent = [
      headers.join(','),
      ...filteredRegistrations.map(reg => [
        reg.pic_name,
        reg.class,
        reg.phone_number,
        reg.competition_category,
        new Date(reg.registration_date).toLocaleDateString(),
        reg.status
      ].join(','))
    ].join('\n');

    // Create and download CSV file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `class-registrations-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    setMessage('Registrations exported successfully');
  };

  const handlePrint = () => {
    const printContent = `
      <html>
        <head>
          <title>Class Competition Registrations</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { text-align: center; color: #333; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; font-weight: bold; }
            tr:nth-child(even) { background-color: #f9f9f9; }
            .date { text-align: center; font-size: 12px; color: #666; margin-top: 10px; }
          </style>
        </head>
        <body>
          <h1>Class Competition Registrations</h1>
          <div class="date">Printed on ${new Date().toLocaleDateString()}</div>
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>PIC Name</th>
                <th>Class</th>
                <th>Phone Number</th>
                <th>Competition</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${filteredRegistrations.map((reg, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td>${reg.pic_name}</td>
                  <td>${reg.class}</td>
                  <td>${reg.phone_number}</td>
                  <td>${reg.competition_category}</td>
                  <td>${new Date(reg.registration_date).toLocaleDateString()}</td>
                  <td>${reg.status}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;

    const printWindow = window.open('', '', 'width=800,height=600');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div>Loading class competition registrations...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {message && (
        <Alert className={`${
          message.includes('Failed') || message.includes('Error') 
            ? 'bg-red-50 border-red-200' 
            : 'bg-green-50 border-green-200'
        }`}>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      {/* Header with Actions */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <CardTitle className="text-2xl text-gray-800">All Competition Registrations</CardTitle>
              <CardDescription>
                Manage all competition registrations including video submissions, market day, and other categories
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={handleExport}
                className="flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </Button>
              <Button
                variant="outline"
                onClick={handlePrint}
                className="flex items-center space-x-2"
              >
                <Printer className="w-4 h-4" />
                <span>Print</span>
              </Button>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center space-x-2">
                    <Plus className="w-4 h-4" />
                    <span>Add Registration</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Registration</DialogTitle>
                    <DialogDescription>
                      Enter the registration details for a class-based competition
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="pic_name">PIC Name *</Label>
                      <Input
                        id="pic_name"
                        value={newRegistration.pic_name}
                        onChange={(e) => setNewRegistration(prev => ({ ...prev, pic_name: e.target.value }))}
                        placeholder="Enter PIC name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="class">Class *</Label>
                      <Select value={newRegistration.class} onValueChange={(value) => setNewRegistration(prev => ({ ...prev, class: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select class" />
                        </SelectTrigger>
                        <SelectContent>
                          {classes.map(cls => (
                            <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="phone_number">Phone Number *</Label>
                      <Input
                        id="phone_number"
                        value={newRegistration.phone_number}
                        onChange={(e) => setNewRegistration(prev => ({ ...prev, phone_number: e.target.value }))}
                        placeholder="Enter phone number"
                      />
                    </div>
                    <div>
                      <Label htmlFor="competition_category">Competition Category *</Label>
                      <Select value={newRegistration.competition_category} onValueChange={(value) => setNewRegistration(prev => ({ ...prev, competition_category: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select competition" />
                        </SelectTrigger>
                        <SelectContent>
                          {competitions.map(comp => (
                            <SelectItem key={comp} value={comp}>{comp}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        onClick={handleAddRegistration}
                        disabled={!newRegistration.pic_name || !newRegistration.class || !newRegistration.phone_number || !newRegistration.competition_category}
                        className="flex-1"
                      >
                        Save Registration
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setIsAddDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by PIC name, class, phone, or competition..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Competition Filter */}
            <Select value={competitionFilter} onValueChange={setCompetitionFilter}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Filter by competition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Competitions</SelectItem>
                {competitions.map(comp => (
                  <SelectItem key={comp} value={comp}>{comp}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={(value: 'date' | 'class' | 'name') => setSortBy(value)}>
              <SelectTrigger className="w-full lg:w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Sort by Date</SelectItem>
                <SelectItem value="class">Sort by Class</SelectItem>
                <SelectItem value="name">Sort by Name</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Registrations Table */}
      <Card>
        <CardContent className="p-6">
          {filteredRegistrations.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              {searchTerm || competitionFilter !== 'all' 
                ? 'No registrations match your filters' 
                : 'No registrations found'
              }
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">PIC Name</th>
                    <th className="text-left py-3 px-4">Class</th>
                    <th className="text-left py-3 px-4">Phone Number</th>
                    <th className="text-left py-3 px-4">Competition</th>
                    <th className="text-left py-3 px-4">Registration Date</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRegistrations.map((registration) => (
                    <tr key={registration.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{registration.pic_name}</td>
                      <td className="py-3 px-4">{registration.class}</td>
                      <td className="py-3 px-4">{registration.phone_number}</td>
                      <td className="py-3 px-4">
                        {getCompetitionBadge(registration.competition_category)}
                      </td>
                      <td className="py-3 px-4">
                        {new Date(registration.registration_date).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        {getStatusBadge(registration.status)}
                      </td>
                      <td className="py-3 px-4">
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(registration.id)}
                        >
                          🗑️ Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ClassCompetitionManagement;