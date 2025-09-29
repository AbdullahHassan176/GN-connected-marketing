'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui';
import { Button } from '@repo/ui';
import { Badge } from '@repo/ui';
import { DataTable, renderStatusBadge, renderDate } from '@repo/ui';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { 
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
  RefreshCw
} from 'lucide-react';

// Mock data for approvals queue
const mockApprovals = [
  {
    id: 'approval_1',
    type: 'budget',
    title: 'Campaign Budget Increase',
    description: 'Request to increase Premium Hotels campaign budget by $25,000',
    requester: {
      name: 'Sarah Mitchell',
      role: 'Senior Marketing Manager',
      avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg'
    },
    project: 'Premium Hotels - Seasonal Campaign',
    amount: 25000,
    status: 'pending',
    priority: 'high',
    submittedAt: '2024-01-28T09:30:00Z',
    dueDate: '2024-01-30T17:00:00Z',
    attachments: ['budget_proposal.pdf', 'roi_analysis.xlsx'],
    comments: [
      {
        id: 'comment_1',
        author: 'Sarah Mitchell',
        text: 'Based on current performance, we need additional budget to scale the campaign.',
        timestamp: '2024-01-28T09:30:00Z'
      }
    ]
  },
  {
    id: 'approval_2',
    type: 'content',
    title: 'Creative Asset Approval',
    description: 'New video content for Tech Startup brand launch campaign',
    requester: {
      name: 'Emma Rodriguez',
      role: 'Content Creator',
      avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-4.jpg'
    },
    project: 'Tech Startup - Brand Launch',
    amount: 0,
    status: 'pending',
    priority: 'medium',
    submittedAt: '2024-01-28T11:15:00Z',
    dueDate: '2024-02-01T17:00:00Z',
    attachments: ['video_concept.mp4', 'storyboard.pdf'],
    comments: [
      {
        id: 'comment_2',
        author: 'Emma Rodriguez',
        text: 'This video aligns with the brand guidelines and campaign objectives.',
        timestamp: '2024-01-28T11:15:00Z'
      }
    ]
  },
  {
    id: 'approval_3',
    type: 'vendor',
    title: 'New Tool Subscription',
    description: 'Request to subscribe to AI Content Generator Pro for team',
    requester: {
      name: 'Marcus Chen',
      role: 'Campaign Specialist',
      avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg'
    },
    project: 'Multiple Projects',
    amount: 5000,
    status: 'approved',
    priority: 'low',
    submittedAt: '2024-01-27T14:20:00Z',
    dueDate: '2024-01-29T17:00:00Z',
    attachments: ['tool_evaluation.pdf'],
    comments: [
      {
        id: 'comment_3',
        author: 'Marcus Chen',
        text: 'This tool will significantly improve our content creation efficiency.',
        timestamp: '2024-01-27T14:20:00Z'
      },
      {
        id: 'comment_4',
        author: 'Admin User',
        text: 'Approved. Tool has been activated for the team.',
        timestamp: '2024-01-28T10:00:00Z'
      }
    ]
  },
  {
    id: 'approval_4',
    type: 'budget',
    title: 'Emergency Campaign Funding',
    description: 'Urgent budget request for crisis management campaign',
    requester: {
      name: 'David Kim',
      role: 'Analytics Specialist',
      avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg'
    },
    project: 'Crisis Management',
    amount: 15000,
    status: 'rejected',
    priority: 'high',
    submittedAt: '2024-01-26T16:45:00Z',
    dueDate: '2024-01-28T17:00:00Z',
    attachments: ['crisis_analysis.pdf'],
    comments: [
      {
        id: 'comment_5',
        author: 'David Kim',
        text: 'This is urgent - we need immediate funding for damage control.',
        timestamp: '2024-01-26T16:45:00Z'
      },
      {
        id: 'comment_6',
        author: 'Admin User',
        text: 'Rejected. Please provide more detailed justification and alternative solutions.',
        timestamp: '2024-01-27T09:30:00Z'
      }
    ]
  }
];

export default function AdminApprovalsPage() {
  const t = useTranslations('AdminApprovals');
  const [selectedApproval, setSelectedApproval] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');

  const handleApprove = async (approvalId: string) => {
    console.log(`Approving ${approvalId}`);
    // In a real app, this would call the API
  };

  const handleReject = async (approvalId: string) => {
    console.log(`Rejecting ${approvalId}`);
    // In a real app, this would call the API
  };

  const filteredApprovals = mockApprovals.filter(approval => {
    const statusMatch = filterStatus === 'all' || approval.status === filterStatus;
    const typeMatch = filterType === 'all' || approval.type === filterType;
    return statusMatch && typeMatch;
  });

  const columns = [
    {
      key: 'title' as const,
      label: 'Request',
      sortable: true,
      render: (value: string, row: any) => (
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className={`w-3 h-3 rounded-full ${
              row.priority === 'high' ? 'bg-red-500' : 
              row.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
            }`} />
          </div>
          <div>
            <div className="font-medium text-gray-900">{value}</div>
            <div className="text-sm text-gray-500">{row.description}</div>
            <div className="text-xs text-gray-400 mt-1">{row.project}</div>
          </div>
        </div>
      )
    },
    {
      key: 'requester' as const,
      label: 'Requester',
      render: (value: any) => (
        <div className="flex items-center space-x-2">
          <img src={value.avatar} alt={value.name} className="h-6 w-6 rounded-full" />
          <div>
            <div className="text-sm font-medium">{value.name}</div>
            <div className="text-xs text-gray-500">{value.role}</div>
          </div>
        </div>
      ),
      sortable: true
    },
    {
      key: 'amount' as const,
      label: 'Amount',
      render: (value: number) => (
        <div className="text-sm">
          {value > 0 ? `$${value.toLocaleString()}` : 'N/A'}
        </div>
      ),
      sortable: true
    },
    {
      key: 'status' as const,
      label: 'Status',
      render: (value: string) => renderStatusBadge(value),
      sortable: true
    },
    {
      key: 'submittedAt' as const,
      label: 'Submitted',
      render: (value: string) => (
        <div className="text-sm text-gray-600">
          {new Date(value).toLocaleDateString()}
        </div>
      ),
      sortable: true
    },
    {
      key: 'id' as const,
      label: 'Actions',
      render: (value: any, row: any) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedApproval(row)}
          >
            <FileText className="h-4 w-4" />
          </Button>
          {row.status === 'pending' && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleApprove(row.id)}
                className="text-green-600 hover:text-green-700"
              >
                <CheckCircle className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleReject(row.id)}
                className="text-red-600 hover:text-red-700"
              >
                <XCircle className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      )
    }
  ];

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
          <Button>
            <RefreshCw className="h-4 w-4 mr-2" />
            {t('refresh')}
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
            <CardTitle>{t('approvalsQueue')}</CardTitle>
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
          <DataTable
            data={filteredApprovals}
            columns={columns}
            onSort={(key, direction) => {
              console.log('Sort:', key, direction);
            }}
          />
        </CardContent>
      </Card>

      {/* Approval Details Modal */}
      {selectedApproval && (
        <Card className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <Card className="w-full max-w-4xl mx-4">
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
                      <span className="text-gray-600">{t('project')}:</span>
                      <span>{selectedApproval.project}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t('amount')}:</span>
                      <span>${selectedApproval.amount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t('priority')}:</span>
                      <Badge variant={selectedApproval.priority === 'high' ? 'destructive' : 'secondary'}>
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
                  <h3 className="font-medium mb-3">{t('attachments')}</h3>
                  <div className="space-y-2">
                    {selectedApproval.attachments.map((attachment: string, index: number) => (
                      <div key={index} className="flex items-center space-x-2 text-sm">
                        <FileText className="h-4 w-4 text-gray-400" />
                        <span>{attachment}</span>
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
