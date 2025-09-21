import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/enhanced-button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useIssueReports } from '@/hooks/useIssueReports';
import { useWastePickups } from '@/hooks/useWastePickups';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle, FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export const ReportIssue: React.FC = () => {
  const { reports, createReport } = useIssueReports();
  const { pickups } = useWastePickups();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    issue_type: '',
    priority: 'medium',
    pickup_id: ''
  });

  const issueTypes = [
    { value: 'pickup_delay', label: 'Pickup Delay' },
    { value: 'missed_pickup', label: 'Missed Pickup' },
    { value: 'quality_issue', label: 'Quality Issue' },
    { value: 'driver_behavior', label: 'Driver Behavior' },
    { value: 'payment_issue', label: 'Payment Issue' },
    { value: 'other', label: 'Other' }
  ];

  const priorityLevels = [
    { value: 'low', label: 'Low', color: 'bg-blue-500' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-500' },
    { value: 'high', label: 'High', color: 'bg-orange-500' },
    { value: 'urgent', label: 'Urgent', color: 'bg-red-500' }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'in_progress': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'resolved': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'closed': return <CheckCircle className="w-4 h-4 text-gray-500" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.issue_type) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    try {
      await createReport.mutateAsync({
        title: formData.title,
        description: formData.description,
        issue_type: formData.issue_type,
        priority: formData.priority,
        pickup_id: formData.pickup_id || undefined
      });

      toast({
        title: "Issue Reported",
        description: "Your issue has been submitted successfully. We'll investigate and get back to you soon."
      });

      setFormData({
        title: '',
        description: '',
        issue_type: '',
        priority: 'medium',
        pickup_id: ''
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit issue report. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Report Form */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <AlertTriangle className="w-6 h-6 text-accent" />
          <div>
            <h2 className="text-2xl font-bold">Report an Issue</h2>
            <p className="text-muted-foreground">Help us improve our service by reporting any problems you've encountered.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Issue Type *</label>
              <Select value={formData.issue_type} onValueChange={(value) => setFormData(prev => ({ ...prev, issue_type: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select issue type" />
                </SelectTrigger>
                <SelectContent>
                  {issueTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Priority</label>
              <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {priorityLevels.map(priority => (
                    <SelectItem key={priority.value} value={priority.value}>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${priority.color}`} />
                        {priority.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Related Pickup (Optional)</label>
            <Select value={formData.pickup_id} onValueChange={(value) => setFormData(prev => ({ ...prev, pickup_id: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select a pickup if related" />
              </SelectTrigger>
              <SelectContent>
                {pickups?.map(pickup => (
                  <SelectItem key={pickup.id} value={pickup.id}>
                    {pickup.waste_type} - {pickup.pickup_date} ({pickup.status})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Title *</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Brief description of the issue"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description *</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Please provide detailed information about the issue..."
              rows={4}
              required
            />
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={createReport.isPending}
          >
            {createReport.isPending ? 'Submitting...' : 'Submit Issue Report'}
          </Button>
        </form>
      </Card>

      {/* Previous Reports */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Your Previous Reports</h3>
        <div className="space-y-4">
          {reports?.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No reports yet. We hope you never need to file any!</p>
          ) : (
            reports?.map(report => (
              <div key={report.id} className="border rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(report.status)}
                    <h4 className="font-medium">{report.title}</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={report.priority === 'urgent' ? 'destructive' : 'secondary'}>
                      {report.priority}
                    </Badge>
                    <Badge variant="outline">
                      {report.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{report.description}</p>
                <p className="text-xs text-muted-foreground">
                  Reported on {new Date(report.created_at).toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};