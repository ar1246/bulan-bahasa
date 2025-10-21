"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';

interface ClassVideo {
  className: string;
  status: 'not-uploaded' | 'under-review' | 'published';
  videoUrl?: string;
  picName?: string;
  uploadDate?: string;
  submissionId?: string;
}

const ShortFilmDrama = () => {
  // Initialize with all classes immediately
  const initialClasses: ClassVideo[] = [];
  const grades = ['VII', 'VIII', 'IX'];
  const sections = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'];
  
  grades.forEach(grade => {
    sections.forEach(section => {
      const className = `${grade}-${section}`;
      initialClasses.push({ className, status: 'not-uploaded' });
    });
  });

  const [classes, setClasses] = useState<ClassVideo[]>(initialClasses);
  const [uploadForm, setUploadForm] = useState<{ [key: string]: { show: boolean; file: File | null; title: string; description: string } }>({});
  const [uploadMessage, setUploadMessage] = useState('');
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});

  // Fetch submissions to update status after component mounts
  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const response = await fetch('/api/video-upload?competitionType=short-film-drama');
      
      // Always generate all classes, regardless of API response
      const submissionMap = new Map();
      
      if (response.ok) {
        const data = await response.json();
        
        if (data.success) {
          // Transform submissions into class format
          data.submissions.forEach((submission: {
            id: string;
            class_name: string;
            status: string;
            video_url?: string;
            title: string;
            upload_date?: string;
          }) => {
            submissionMap.set(submission.class_name, {
              className: submission.class_name,
              status: submission.status,
              videoUrl: submission.video_url,
              picName: submission.title, // Using title as PIC name for now
              uploadDate: submission.upload_date ? new Date(submission.upload_date).toISOString().split('T')[0] : null,
              submissionId: submission.id
            });
          });
        }
      }

      // Update existing classes with submission data
      setClasses(prevClasses => 
        prevClasses.map(cls => {
          const submission = submissionMap.get(cls.className);
          return submission || cls;
        })
      );
    } catch (error) {
      console.error('Failed to fetch submissions:', error);
      setUploadMessage('Failed to load existing submissions');
    }
  };

  const getStatusBadge = (status: ClassVideo['status']) => {
    switch (status) {
      case 'not-uploaded':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-600">Not Uploaded</Badge>;
      case 'under-review':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">Under Review</Badge>;
      case 'published':
        return <Badge variant="secondary" className="bg-green-100 text-green-700">Published</Badge>;
    }
  };

  const handleUploadClick = (className: string) => {
    setUploadForm(prev => ({
      ...prev,
      [className]: { show: true, file: null, title: '', description: '' }
    }));
  };

  const handleFileChange = (className: string, file: File) => {
    setUploadForm(prev => ({
      ...prev,
      [className]: { ...prev[className], file }
    }));
  };

  const handleTitleChange = (className: string, title: string) => {
    setUploadForm(prev => ({
      ...prev,
      [className]: { ...prev[className], title }
    }));
  };

  const handleDescriptionChange = (className: string, description: string) => {
    setUploadForm(prev => ({
      ...prev,
      [className]: { ...prev[className], description }
    }));
  };

  const handleSubmitUpload = async (className: string) => {
    const form = uploadForm[className];
    if (!form?.file || !form?.title) {
      setUploadMessage('Please select a file and enter a title');
      return;
    }

    try {
      setUploadMessage('Uploading short film...');
      setUploadProgress(prev => ({ ...prev, [className]: 0 }));

      const formData = new FormData();
      formData.append('video', form.file);
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('className', className);
      formData.append('competitionType', 'short-film-drama');

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const current = prev[className] || 0;
          if (current < 90) {
            return { ...prev, [className]: current + 10 };
          }
          return prev;
        });
      }, 200);

      const response = await fetch('/api/video-upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(prev => ({ ...prev, [className]: 100 }));

      const data = await response.json();

      if (data.success) {
        // Update class status
        setClasses(prev => prev.map(cls => 
          cls.className === className 
            ? { 
                ...cls, 
                status: 'under-review', 
                picName: form.title, 
                uploadDate: new Date().toISOString().split('T')[0],
                submissionId: data.submission.id
              }
            : cls
        ));

        // Reset form
        setUploadForm(prev => ({
          ...prev,
          [className]: { show: false, file: null, title: '', description: '' }
        }));

        setUploadMessage('Short film uploaded successfully! It will be reviewed shortly.');
      } else {
        setUploadMessage(`Upload failed: ${data.error}`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadMessage('Upload failed. Please try again.');
    } finally {
      setUploadProgress(prev => ({ ...prev, [className]: 0 }));
      
      // Clear message after 5 seconds
      setTimeout(() => setUploadMessage(''), 5000);
    }
  };

  const groupedClasses = {
    'Grade VII': classes.filter(cls => cls.className.startsWith('VII')),
    'Grade VIII': classes.filter(cls => cls.className.startsWith('VIII')),
    'Grade IX': classes.filter(cls => cls.className.startsWith('IX')),
  };

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          🎭 Short Film Drama (Cerita Rakyat)
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Submit your class short film based on Indonesian folklore! Each class should create a compelling drama that showcases our cultural heritage.
        </p>
      </div>

      {uploadMessage && (
        <Alert className={`mb-6 ${
          uploadMessage.includes('failed') || uploadMessage.includes('Failed') 
            ? 'bg-red-50 border-red-200' 
            : 'bg-blue-50 border-blue-200'
        }`}>
          <AlertDescription>{uploadMessage}</AlertDescription>
        </Alert>
      )}



      <div className="space-y-8">
        {Object.entries(groupedClasses).map(([grade, gradeClasses]) => (
          <Card key={grade} className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-800">{grade}</CardTitle>
              <CardDescription>
                Click &ldquo;Upload Film&rdquo; to submit your class short film drama
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {gradeClasses.map((classItem) => (
                  <div key={classItem.className} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold text-lg text-gray-800">{classItem.className}</h3>
                      {getStatusBadge(classItem.status)}
                    </div>
                    
                    {classItem.status === 'published' && classItem.videoUrl && (
                      <div className="mb-3">
                        <div className="aspect-video bg-gray-200 rounded mb-2">
                          <video 
                            src={classItem.videoUrl}
                            className="w-full h-full rounded"
                            controls
                            preload="metadata"
                          />
                        </div>
                        <p className="text-sm text-gray-600">
                          PIC: {classItem.picName} • {classItem.uploadDate}
                        </p>
                      </div>
                    )}

                    {classItem.status === 'under-review' && (
                      <div className="mb-3 p-3 bg-yellow-50 rounded">
                        <p className="text-sm text-yellow-700">
                          🎬 Under review by {classItem.picName}
                        </p>
                        <p className="text-xs text-yellow-600">Uploaded: {classItem.uploadDate}</p>
                      </div>
                    )}

                    {uploadForm[classItem.className]?.show ? (
                      <div className="space-y-3">
                        <div>
                          <Label htmlFor={`file-${classItem.className}`} className="text-sm font-medium">
                            Film File
                          </Label>
                          <Input
                            id={`file-${classItem.className}`}
                            type="file"
                            accept="video/*"
                            onChange={(e) => e.target.files?.[0] && handleFileChange(classItem.className, e.target.files[0])}
                            className="mt-1"
                          />
                          <p className="text-xs text-gray-500 mt-1">Max size: 100MB. Formats: MP4, AVI, MOV, WMV, WebM</p>
                        </div>
                        <div>
                          <Label htmlFor={`title-${classItem.className}`} className="text-sm font-medium">
                            Film Title *
                          </Label>
                          <Input
                            id={`title-${classItem.className}`}
                            type="text"
                            placeholder="Enter film title"
                            value={uploadForm[classItem.className]?.title || ''}
                            onChange={(e) => handleTitleChange(classItem.className, e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`description-${classItem.className}`} className="text-sm font-medium">
                            Synopsis (Optional)
                          </Label>
                          <textarea
                            id={`description-${classItem.className}`}
                            placeholder="Brief synopsis of your folklore drama"
                            value={uploadForm[classItem.className]?.description || ''}
                            onChange={(e) => handleDescriptionChange(classItem.className, e.target.value)}
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={3}
                          />
                        </div>
                        
                        {uploadProgress[classItem.className] > 0 && (
                          <div className="space-y-2">
                            <div className="flex justify-between text-xs text-gray-600">
                              <span>Uploading...</span>
                              <span>{uploadProgress[classItem.className]}%</span>
                            </div>
                            <Progress value={uploadProgress[classItem.className]} className="h-2" />
                          </div>
                        )}
                        
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => handleSubmitUpload(classItem.className)}
                            className="flex-1"
                            disabled={uploadProgress[classItem.className] > 0}
                          >
                            {uploadProgress[classItem.className] > 0 ? 'Uploading...' : 'Submit'}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setUploadForm(prev => ({
                              ...prev,
                              [classItem.className]: { show: false, file: null, title: '', description: '' }
                            }))}
                            disabled={uploadProgress[classItem.className] > 0}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => handleUploadClick(classItem.className)}
                        className="w-full"
                        disabled={classItem.status !== 'not-uploaded'}
                      >
                        {classItem.status === 'not-uploaded' ? '📤 Upload Film' : 
                         classItem.status === 'under-review' ? '⏳ Under Review' : 
                         '✅ Published'}
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Button 
          variant="outline" 
          onClick={() => window.location.href = '/competitions'}
          className="mr-4"
        >
          ← Back to Competitions
        </Button>
        <Button 
          onClick={() => window.location.href = '/gallery'}
        >
          📷 View Gallery →
        </Button>
      </div>
    </main>
  );
};

export default ShortFilmDrama;