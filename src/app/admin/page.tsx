"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminGuard from '@/components/admin-guard';
import UserManagement from '@/components/admin/user-management';
import ClassCompetitionManagement from '@/components/admin/class-competition-management';
import ContentManagement from '@/components/admin/content-management/ContentManagement';

// Prevent static generation
export const dynamic = 'force-dynamic';

interface VideoSubmission {
  id: string;
  class_name: string;
  competition_type: string;
  status: 'not-uploaded' | 'under-review' | 'published' | 'rejected';
  video_url?: string;
  video_file_name?: string;
  video_file_size?: number;
  pic_name: string;
  pic_email?: string;
  pic_phone?: string;
  upload_date?: string;
  reviewed_date?: string;
  reviewed_by?: string;
  review_notes?: string;
}

const AdminPanel = () => {
  const [submissions, setSubmissions] = useState<VideoSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<VideoSubmission | null>(null);
  const [reviewForm, setReviewForm] = useState({
    status: 'published' as 'published' | 'rejected',
    reviewNotes: ''
  });
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('submissions');
  const [competitionFilter, setCompetitionFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (activeTab === 'submissions') {
      fetchSubmissions();
    }
  }, [activeTab, competitionFilter, statusFilter]);

  const fetchSubmissions = async () => {
    try {
      const response = await fetch('/api/admin/submissions');
      const data = await response.json();
      
      if (data.success) {
        setSubmissions(data.submissions);
      } else {
        setMessage('Failed to fetch submissions');
      }
    } catch (error) {
      console.error('Error fetching submissions:', error);
      setMessage('Error fetching submissions');
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (submissionId: string) => {
    try {
      const response = await fetch(`/api/admin/submissions/${submissionId}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: reviewForm.status,
          review_notes: reviewForm.reviewNotes,
          reviewed_by: 'Admin'
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setMessage(`Submission ${reviewForm.status} successfully`);
        setSelectedSubmission(null);
        setReviewForm({ status: 'published', reviewNotes: '' });
        fetchSubmissions();
      } else {
        setMessage(`Failed to update submission: ${data.error}`);
      }
    } catch (error) {
      console.error('Error reviewing submission:', error);
      setMessage('Error updating submission');
    }
  };

  const handleDelete = async (submissionId: string) => {
    if (!confirm('Are you sure you want to delete this submission? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/submissions/${submissionId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (data.success) {
        setMessage('Submission deleted successfully');
        setSelectedSubmission(null);
        fetchSubmissions();
      } else {
        setMessage(`Failed to delete submission: ${data.error}`);
      }
    } catch (error) {
      console.error('Error deleting submission:', error);
      setMessage('Error deleting submission');
    }
  };

  const handleDownload = (videoUrl: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = videoUrl;
    link.download = fileName || 'video.mp4';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDeleteAll = async () => {
    if (!confirm('Are you sure you want to delete ALL submissions? This action cannot be undone and will delete all videos and records.')) {
      return;
    }

    try {
      const response = await fetch('/api/admin/submissions/delete-all', {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (data.success) {
        setMessage('All submissions deleted successfully');
        setSelectedSubmission(null);
        fetchSubmissions();
      } else {
        setMessage(`Failed to delete all submissions: ${data.error}`);
      }
    } catch (error) {
      console.error('Error deleting all submissions:', error);
      setMessage('Error deleting all submissions');
    }
  };

  const getStatusBadge = (status: VideoSubmission['status']) => {
    switch (status) {
      case 'not-uploaded':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-600">Not Uploaded</Badge>;
      case 'under-review':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">Under Review</Badge>;
      case 'published':
        return <Badge variant="secondary" className="bg-green-100 text-green-700">Published</Badge>;
      case 'rejected':
        return <Badge variant="secondary" className="bg-red-100 text-red-700">Rejected</Badge>;
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'N/A';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  // Filter submissions based on competition type, status, and search term
  const filteredSubmissions = submissions.filter(submission => {
    const matchesCompetition = competitionFilter === 'all' || submission.competition_type === competitionFilter;
    const matchesStatus = statusFilter === 'all' || submission.status === statusFilter;
    const matchesSearch = searchTerm === '' || 
      submission.class_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.pic_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.competition_type.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCompetition && matchesStatus && matchesSearch;
  });

  // Get competition types for filter
  const competitionTypes = Array.from(new Set(submissions.map(s => s.competition_type)));

  // Get competition badge color
  const getCompetitionBadge = (competition: string) => {
    switch (competition.toLowerCase()) {
      case 'short film drama':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-700">🎬 Short Film</Badge>;
      case 'vlog challenge':
        return <Badge variant="secondary" className="bg-purple-100 text-purple-700">📹 Vlog</Badge>;
      case 'mini documentary':
        return <Badge variant="secondary" className="bg-green-100 text-green-700">📗 Documentary</Badge>;
      default:
        return <Badge variant="secondary" className="bg-gray-100 text-gray-700">📁 {competition}</Badge>;
    }
  };

  if (loading && activeTab === 'submissions') {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">Loading submissions...</div>
      </div>
    );
  }

  return (
    <AdminGuard>
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🎬 Admin Panel
          </h1>
          <p className="text-xl text-gray-600">
            Manage submissions, competitions, users, and content
          </p>
        </div>

        {message && (
          <Alert className={`mb-6 ${
            message.includes('Failed') || message.includes('Error') 
              ? 'bg-red-50 border-red-200' 
              : 'bg-green-50 border-green-200'
          }`}>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="submissions">Video Submissions</TabsTrigger>
            <TabsTrigger value="class-competitions">All Registrations</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="content">Content Management</TabsTrigger>
          </TabsList>
          
          <TabsContent value="submissions" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Submissions List */}
              <Card className="shadow-lg">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-2xl text-gray-800 mb-2">Video Submissions</CardTitle>
                      <CardDescription>
                        Manage and review video submissions by competition type
                      </CardDescription>
                    </div>
                    <Button
                      variant="destructive"
                      onClick={handleDeleteAll}
                      disabled={submissions.length === 0}
                      size="sm"
                    >
                      🗑️ Delete All
                    </Button>
                  </div>
                  
                  {/* Filters */}
                  <div className="space-y-3 mt-4">
                    {/* Search */}
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search by class, PIC name, or competition..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
                    </div>
                    
                    {/* Competition Filter */}
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-gray-700">Competition Type</div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => setCompetitionFilter('all')}
                          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                            competitionFilter === 'all'
                              ? 'bg-gray-800 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          All ({submissions.length})
                        </button>
                        {competitionTypes.map(type => (
                          <button
                            key={type}
                            onClick={() => setCompetitionFilter(type)}
                            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                              competitionFilter === type
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {type} ({submissions.filter(s => s.competition_type === type).length})
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Status Filter */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium text-gray-700">Review Status</div>
                        {(competitionFilter !== 'all' || statusFilter !== 'all' || searchTerm) && (
                          <button
                            onClick={() => {
                              setCompetitionFilter('all');
                              setStatusFilter('all');
                              setSearchTerm('');
                            }}
                            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                          >
                            Clear All Filters
                          </button>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => setStatusFilter('all')}
                          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                            statusFilter === 'all'
                              ? 'bg-gray-800 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          All ({submissions.length})
                        </button>
                        <button
                          onClick={() => setStatusFilter('published')}
                          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                            statusFilter === 'published'
                              ? 'bg-green-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          ✅ Published ({submissions.filter(s => s.status === 'published').length})
                        </button>
                        <button
                          onClick={() => setStatusFilter('under-review')}
                          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                            statusFilter === 'under-review'
                              ? 'bg-yellow-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          ⏳ Under Review ({submissions.filter(s => s.status === 'under-review').length})
                        </button>
                        <button
                          onClick={() => setStatusFilter('not-uploaded')}
                          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                            statusFilter === 'not-uploaded'
                              ? 'bg-gray-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          📤 Not Uploaded ({submissions.filter(s => s.status === 'not-uploaded').length})
                        </button>
                        <button
                          onClick={() => setStatusFilter('rejected')}
                          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                            statusFilter === 'rejected'
                              ? 'bg-red-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          ❌ Rejected ({submissions.filter(s => s.status === 'rejected').length})
                        </button>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {filteredSubmissions.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">
                        {searchTerm || competitionFilter !== 'all' || statusFilter !== 'all'
                          ? 'No submissions match your filters' 
                          : 'No submissions found'
                        }
                      </p>
                    ) : (
                      filteredSubmissions.map((submission) => (
                        <div
                          key={submission.id}
                          className={`border rounded-lg p-4 transition-colors ${
                            selectedSubmission?.id === submission.id 
                              ? 'border-blue-500 bg-blue-50' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div 
                            className="cursor-pointer"
                            onClick={() => setSelectedSubmission(submission)}
                           >
                             <div className="flex justify-between items-start mb-2">
                               <div className="flex-1">
                                 <h3 className="font-semibold text-lg">{submission.class_name}</h3>
                                 <p className="text-sm text-gray-600">PIC: {submission.pic_name}</p>
                                 <div className="flex items-center gap-2 mt-1">
                                   {getCompetitionBadge(submission.competition_type)}
                                   {getStatusBadge(submission.status)}
                                 </div>
                               </div>
                             </div>
                             <div className="text-sm text-gray-500 mt-2">
                               <p>File: {submission.video_file_name}</p>
                               <p>Size: {formatFileSize(submission.video_file_size)}</p>
                               {submission.upload_date && (
                                 <p>Uploaded: {new Date(submission.upload_date).toLocaleDateString()}</p>
                               )}
                             </div>
                           </div>
                          
                          {/* Action Buttons */}
                          <div className="flex space-x-2 mt-3 pt-3 border-t">
                            {submission.video_url && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDownload(submission.video_url!, submission.video_file_name || 'video.mp4');
                                }}
                                className="flex-1"
                              >
                                📥 Download
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(submission.id);
                              }}
                              className="flex-1"
                            >
                              🗑️ Delete
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Review Panel */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl text-gray-800">Review Submission</CardTitle>
                  <CardDescription>
                    {selectedSubmission ? `Reviewing ${selectedSubmission.class_name}` : 'Select a submission to review'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedSubmission ? (
                    <div className="space-y-6">
                      {/* Video Preview */}
                      {selectedSubmission.video_url && (
                        <div>
                          <Label className="text-sm font-medium">Video Preview</Label>
                          <div className="aspect-video bg-gray-200 rounded mt-2">
                            <video 
                              src={selectedSubmission.video_url}
                              controls
                              preload="metadata"
                              className="w-full h-full rounded"
                            />
                          </div>
                        </div>
                      )}

                      {/* Submission Details */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium">Class</Label>
                          <p className="text-sm">{selectedSubmission.class_name}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Competition</Label>
                          <p className="text-sm">{selectedSubmission.competition_type}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">PIC Name</Label>
                          <p className="text-sm">{selectedSubmission.pic_name}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Email</Label>
                          <p className="text-sm">{selectedSubmission.pic_email || 'N/A'}</p>
                        </div>
                      </div>

                      {/* Review Form */}
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="status">Review Status</Label>
                          <Select 
                            value={reviewForm.status} 
                            onValueChange={(value) => setReviewForm(prev => ({ ...prev, status: value as 'published' | 'rejected' }))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="published">✅ Published</SelectItem>
                              <SelectItem value="rejected">❌ Rejected</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="reviewNotes">Review Notes</Label>
                          <Textarea
                            id="reviewNotes"
                            placeholder="Add review notes (optional)"
                            value={reviewForm.reviewNotes}
                            onChange={(e) => setReviewForm(prev => ({ ...prev, reviewNotes: e.target.value }))}
                            rows={3}
                          />
                        </div>

                        <div className="flex space-x-2">
                          <Button
                            onClick={() => handleReview(selectedSubmission.id)}
                            className="flex-1"
                          >
                            Submit Review
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setSelectedSubmission(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      Select a submission from the list to review it
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="class-competitions" className="mt-6">
            <ClassCompetitionManagement />
          </TabsContent>
          
          <TabsContent value="users" className="mt-6">
            <UserManagement />
          </TabsContent>
          
          <TabsContent value="content" className="mt-6">
            <ContentManagement />
          </TabsContent>
        </Tabs>
      </main>
    </AdminGuard>
  );
};

export default AdminPanel;