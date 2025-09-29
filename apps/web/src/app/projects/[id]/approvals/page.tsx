'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui';
import { Button } from '@repo/ui';
import { Badge } from '@repo/ui';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { 
  Plus, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  User,
  Calendar,
  FileText,
  DollarSign,
  Filter,
  Search,
  Download,
  Eye,
  MessageSquare,
  History
} from 'lucide-react';

// Mock data for approvals
const mockApprovals = [
  {
    id: 'approval_1',
    title: 'Campaign Budget Increase',
    description: 'Request to increase Premium Hotels campaign budget by $25,000 for additional ad spend',
    type: 'budget',
    amount: 25000,
    status: 'pending',
    priority: 'high',
    requester: {
      id: 'user_1',
      name: 'Sarah Mitchell',
      role: 'Senior Marketing Manager',
      avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg'
    },
    reviewers: [
      {
        id: 'user_2',
        name: 'Marcus Chen',
        role: 'Campaign Specialist',
        avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg',
        status: 'pending'
      },
      {
        id: 'user_3',
        name: 'Emma Rodriguez',
        role: 'Content Creator',
        avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-4.jpg',
        status: 'approved'
      }
    ],
    submittedAt: '2024-01-28T09:30:00Z',
    dueDate: '2024-01-30T17:00:00Z',
    attachments: ['budget_proposal.pdf', 'roi_analysis.xlsx'],
    comments: [
      {
        id: 'comment_1',
        author: 'Sarah Mitchell',
        text: 'Based on current performance, we need additional budget to scale the campaign.',
        timestamp: '2024-01-28T09:30:00Z'
      },
      {
        id: 'comment_2',
        author: 'Emma Rodriguez',
        text: 'I support this request. The creative assets are ready for the additional spend.',
        timestamp: '2024-01-28T10:15:00Z'
      }
    ],
    auditTrail: [
      {
        action: 'created',
        user: 'Sarah Mitchell',
        timestamp: '2024-01-28T09:30:00Z',
        details: 'Approval request created'
      },
      {
        action: 'reviewer_assigned',
        user: 'System',
        timestamp: '2024-01-28T09:31:00Z',
        details: 'Marcus Chen and Emma Rodriguez assigned as reviewers'
      },
      {
        action: 'reviewed',
        user: 'Emma Rodriguez',
        timestamp: '2024-01-28T10:15:00Z',
        details: 'Approved by Emma Rodriguez'
      }
    ]
  },
  {
    id: 'approval_2',
    title: 'Creative Asset Approval',
    description: 'New video content for Premium Hotels seasonal campaign',
    type: 'content',
    amount: 0,
    status: 'approved',
    priority: 'medium',
    requester: {
      id: 'user_3',
      name: 'Emma Rodriguez',
      role: 'Content Creator',
      avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-4.jpg'
    },
    reviewers: [
      {
        id: 'user_1',
        name: 'Sarah Mitchell',
        role: 'Senior Marketing Manager',
        avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg',
        status: 'approved'
      }
    ],
    submittedAt: '2024-01-27T14:20:00Z',
    dueDate: '2024-01-29T17:00:00Z',
    attachments: ['video_concept.mp4', 'storyboard.pdf'],
    comments: [
      {
        id: 'comment_3',
        author: 'Emma Rodriguez',
        text: 'This video aligns with the brand guidelines and campaign objectives.',
        timestamp: '2024-01-27T14:20:00Z'
      },
      {
        id: 'comment_4',
        author: 'Sarah Mitchell',
        text: 'Approved! Great work on the creative direction.',
        timestamp: '2024-01-28T08:30:00Z'
      }
    ],
    auditTrail: [
      {
        action: 'created',
        user: 'Emma Rodriguez',
        timestamp: '2024-01-27T14:20:00Z',
        details: 'Approval request created'
      },
      {
        action: 'reviewer_assigned',
        user: 'System',
        timestamp: '2024-01-27T14:21:00Z',
        details: 'Sarah Mitchell assigned as reviewer'
      },
      {
        action: 'reviewed',
        user: 'Sarah Mitchell',
        timestamp: '2024-01-28T08:30:00Z',
        details: 'Approved by Sarah Mitchell'
      }
    ]
  },
  {
    id: 'approval_3',
    title: 'Vendor Contract Approval',
    description: 'New photography vendor contract for campaign photoshoot',
    type: 'vendor',
    amount: 15000,
    status: 'rejected',
    priority: 'low',
    requester: {
      id: 'user_2',
      name: 'Marcus Chen',
      role: 'Campaign Specialist',
      avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg'
    },
    reviewers: [
      {
        id: 'user_1',
        name: 'Sarah Mitchell',
        role: 'Senior Marketing Manager',
        avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg',
        status: 'rejected'
      }
    ],
    submittedAt: '2024-01-26T16:45:00Z',
    dueDate: '2024-01-28T17:00:00Z',
    attachments: ['vendor_contract.pdf', 'portfolio_samples.pdf'],
    comments: [
      {
        id: 'comment_5',
        author: 'Marcus Chen',
        text: 'This vendor has excellent portfolio and competitive pricing.',
        timestamp: '2024-01-26T16:45:00Z'
      },
      {
        id: 'comment_6',
        author: 'Sarah Mitchell',
        text: 'Rejected. Please provide more detailed justification and alternative options.',
        timestamp: '2024-01-27T09:30:00Z'
      }
    ],
    auditTrail: [
      {
        action: 'created',
        user: 'Marcus Chen',
        timestamp: '2024-01-26T16:45:00Z',
        details: 'Approval request created'
      },
      {
        action: 'reviewer_assigned',
        user: 'System',
        timestamp: '2024-01-26T16:46:00Z',
        details: 'Sarah Mitchell assigned as reviewer'
      },
      {
        action: 'reviewed',
        user: 'Sarah Mitchell',
        timestamp: '2024-01-27T09:30:00Z',
        details: 'Rejected by Sarah Mitchell'
      }
    ]
  }
];

export default function ProjectApprovals() {
  const t = useTranslations('ProjectApprovals');
  const params = useParams();
  const projectId = params.id;
  
  const [selectedApproval, setSelectedApproval] = useState<any>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [newComment, setNewComment] = useState('');

  const handleApprove = async (approvalId: string) => {
    console.log(`Approving ${approvalId}`);
    // In a real app, this would call the API
  };

  const handleReject = async (approvalId: string) => {
    console.log(`Rejecting ${approvalId}`);
    // In a real app, this would call the API
  };

  const handleAddComment = async (approvalId: string) => {
    if (!newComment.trim()) return;
    console.log(`Adding comment to ${approvalId}:`, newComment);
    setNewComment('');
    // In a real app, this would call the API
  };

  const filteredApprovals = mockApprovals.filter(approval => {
    if (filterStatus === 'all') return true;
    return approval.status === filterStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-600 bg-green-100';
      case 'rejected':
        return 'text-red-600 bg-red-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
          <p className="text-gray-600 mt-2">{t('subtitle')}</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            {t('exportReport')}
          </Button>
          <Button onClick={() => setShowCreateForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            {t('createRequest')}
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('pendingApprovals')}</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockApprovals.filter(a => a.status === 'pending').length}
            </div>
            <p className="text-xs text-gray-500">Awaiting review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('approvedToday')}</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockApprovals.filter(a => a.status === 'approved').length}
            </div>
            <p className="text-xs text-gray-500">This week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('totalValue')}</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${mockApprovals
                .filter(a => a.status === 'pending')
                .reduce((sum, a) => sum + a.amount, 0)
                .toLocaleString()}
            </div>
            <p className="text-xs text-gray-500">Pending value</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('avgResponseTime')}</CardTitle>
            <Calendar className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.3h</div>
            <p className="text-xs text-gray-500">Average response</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{t('approvalsList')}</CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant={filterStatus === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('all')}
              >
                {t('all')}
              </Button>
              <Button
                variant={filterStatus === 'pending' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('pending')}
              >
                {t('pending')}
              </Button>
              <Button
                variant={filterStatus === 'approved' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('approved')}
              >
                {t('approved')}
              </Button>
              <Button
                variant={filterStatus === 'rejected' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('rejected')}
              >
                {t('rejected')}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredApprovals.map((approval) => (
              <div
                key={approval.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {approval.title}
                      </h3>
                      <Badge className={getStatusColor(approval.status)}>
                        {approval.status}
                      </Badge>
                      <Badge className={getPriorityColor(approval.priority)}>
                        {approval.priority}
                      </Badge>
                    </div>
                    
                    <p className="text-gray-600 mb-3">{approval.description}</p>
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <span>{approval.requester.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(approval.submittedAt).toLocaleDateString()}</span>
                      </div>
                      {approval.amount > 0 && (
                        <div className="flex items-center space-x-2">
                          <DollarSign className="h-4 w-4" />
                          <span>${approval.amount.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedApproval(approval)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {approval.status === 'pending' && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleApprove(approval.id)}
                          className="text-green-600 hover:text-green-700"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReject(approval.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Approval Details Modal */}
      {selectedApproval && (
        <Card className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <Card className="w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{selectedApproval.title}</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">{selectedApproval.description}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedApproval(null)}
                >
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Request Details */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-3">{t('requestDetails')}</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t('requester')}:</span>
                      <span>{selectedApproval.requester.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t('amount')}:</span>
                      <span>${selectedApproval.amount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t('priority')}:</span>
                      <Badge className={getPriorityColor(selectedApproval.priority)}>
                        {selectedApproval.priority}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t('submitted')}:</span>
                      <span>{new Date(selectedApproval.submittedAt).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t('dueDate')}:</span>
                      <span>{new Date(selectedApproval.dueDate).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-3">{t('reviewers')}</h3>
                  <div className="space-y-2">
                    {selectedApproval.reviewers.map((reviewer: any) => (
                      <div key={reviewer.id} className="flex items-center space-x-2">
                        <img
                          src={reviewer.avatar}
                          alt={reviewer.name}
                          className="h-6 w-6 rounded-full"
                        />
                        <span className="text-sm">{reviewer.name}</span>
                        <Badge className={getStatusColor(reviewer.status)}>
                          {reviewer.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Comments */}
              <div>
                <h3 className="font-medium mb-3">{t('comments')}</h3>
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {selectedApproval.comments.map((comment: any) => (
                    <div key={comment.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <User className="h-4 w-4 text-gray-400 mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-sm">{comment.author}</span>
                          <span className="text-xs text-gray-500">
                            {new Date(comment.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">{comment.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Add Comment */}
                <div className="mt-4 flex space-x-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Button
                    onClick={() => handleAddComment(selectedApproval.id)}
                    disabled={!newComment.trim()}
                  >
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Audit Trail */}
              <div>
                <h3 className="font-medium mb-3">{t('auditTrail')}</h3>
                <div className="space-y-2">
                  {selectedApproval.auditTrail.map((event: any, index: number) => (
                    <div key={index} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                      <History className="h-4 w-4 text-gray-400" />
                      <div className="flex-1">
                        <div className="text-sm font-medium">{event.details}</div>
                        <div className="text-xs text-gray-500">
                          {event.user} • {new Date(event.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              {selectedApproval.status === 'pending' && (
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setSelectedApproval(null)}>
                    {t('close')}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleReject(selectedApproval.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    {t('reject')}
                  </Button>
                  <Button onClick={() => handleApprove(selectedApproval.id)}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {t('approve')}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </Card>
      )}
    </div>
  );
}
