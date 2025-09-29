'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui';
import { Button } from '@repo/ui';
import { Badge } from '@repo/ui';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Paperclip, 
  Smile, 
  AtSign, 
  Download,
  MoreVertical,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  Image,
  Video,
  Music,
  Archive,
  User,
  Calendar,
  MessageSquare
} from 'lucide-react';

// Mock data for the room
const mockRoomData = {
  projectId: 'proj_premium_hotels',
  projectName: 'Premium Hotels - Seasonal Campaign',
  participants: [
    {
      id: 'user_1',
      name: 'Sarah Mitchell',
      role: 'Senior Marketing Manager',
      avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg',
      status: 'online'
    },
    {
      id: 'user_2',
      name: 'Marcus Chen',
      role: 'Campaign Specialist',
      avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg',
      status: 'online'
    },
    {
      id: 'user_3',
      name: 'Emma Rodriguez',
      role: 'Content Creator',
      avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-4.jpg',
      status: 'away'
    },
    {
      id: 'user_4',
      name: 'David Kim',
      role: 'Analytics Specialist',
      avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg',
      status: 'offline'
    }
  ],
  messages: [
    {
      id: 'msg_1',
      author: {
        id: 'user_1',
        name: 'Sarah Mitchell',
        avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg'
      },
      content: 'Welcome everyone! Let\'s kick off the Premium Hotels campaign room. I\'ve uploaded the initial brief and creative assets.',
      timestamp: '2024-01-28T09:00:00Z',
      type: 'text',
      mentions: [],
      attachments: []
    },
    {
      id: 'msg_2',
      author: {
        id: 'user_2',
        name: 'Marcus Chen',
        avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg'
      },
      content: 'Thanks Sarah! I\'ve reviewed the brief. @Emma Rodriguez, could you start working on the video content?',
      timestamp: '2024-01-28T09:15:00Z',
      type: 'text',
      mentions: ['user_3'],
      attachments: []
    },
    {
      id: 'msg_3',
      author: {
        id: 'user_1',
        name: 'Sarah Mitchell',
        avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg'
      },
      content: 'Here are the brand guidelines and logo assets:',
      timestamp: '2024-01-28T09:30:00Z',
      type: 'text',
      mentions: [],
      attachments: [
        {
          id: 'att_1',
          name: 'brand_guidelines.pdf',
          type: 'pdf',
          size: '2.4 MB',
          url: '/api/files/brand_guidelines.pdf'
        },
        {
          id: 'att_2',
          name: 'logo_variations.zip',
          type: 'archive',
          size: '15.2 MB',
          url: '/api/files/logo_variations.zip'
        }
      ]
    },
    {
      id: 'msg_4',
      author: {
        id: 'user_3',
      name: 'Emma Rodriguez',
        avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-4.jpg'
      },
      content: 'Perfect! I\'ll start with the video concept. @Sarah Mitchell, should I focus on the luxury hotel experience or the seasonal campaign angle?',
      timestamp: '2024-01-28T10:00:00Z',
      type: 'text',
      mentions: ['user_1'],
      attachments: []
    },
    {
      id: 'msg_5',
      author: {
        id: 'user_4',
        name: 'David Kim',
        avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg'
      },
      content: 'I\'ve analyzed the target audience data. Here\'s the demographic breakdown:',
      timestamp: '2024-01-28T10:30:00Z',
      type: 'text',
      mentions: [],
      attachments: [
        {
          id: 'att_3',
          name: 'audience_analysis.xlsx',
          type: 'spreadsheet',
          size: '1.8 MB',
          url: '/api/files/audience_analysis.xlsx'
        }
      ]
    }
  ],
  recentFiles: [
    {
      id: 'file_1',
      name: 'campaign_brief_v2.pdf',
      type: 'pdf',
      size: '3.2 MB',
      uploadedBy: 'Sarah Mitchell',
      uploadedAt: '2024-01-28T08:45:00Z',
      url: '/api/files/campaign_brief_v2.pdf'
    },
    {
      id: 'file_2',
      name: 'creative_moodboard.jpg',
      type: 'image',
      size: '4.1 MB',
      uploadedBy: 'Emma Rodriguez',
      uploadedAt: '2024-01-28T09:15:00Z',
      url: '/api/files/creative_moodboard.jpg'
    },
    {
      id: 'file_3',
      name: 'budget_breakdown.xlsx',
      type: 'spreadsheet',
      size: '856 KB',
      uploadedBy: 'Marcus Chen',
      uploadedAt: '2024-01-28T09:30:00Z',
      url: '/api/files/budget_breakdown.xlsx'
    }
  ]
};

export default function ProjectRoom() {
  const t = useTranslations('ProjectRoom');
  const params = useParams();
  const projectId = params.id;
  
  const [newMessage, setNewMessage] = useState('');
  const [showMentions, setShowMentions] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [mockRoomData.messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() && selectedFiles.length === 0) return;

    // In a real app, this would send the message to the API
    console.log('Sending message:', newMessage);
    console.log('Files:', selectedFiles);
    
    // Reset form
    setNewMessage('');
    setSelectedFiles([]);
    setIsTyping(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleMention = (userId: string) => {
    const user = mockRoomData.participants.find(p => p.id === userId);
    if (user) {
      setNewMessage(prev => prev + `@${user.name} `);
      setShowMentions(false);
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="h-4 w-4 text-red-500" />;
      case 'image':
        return <Image className="h-4 w-4 text-blue-500" />;
      case 'video':
        return <Video className="h-4 w-4 text-purple-500" />;
      case 'audio':
        return <Music className="h-4 w-4 text-green-500" />;
      case 'archive':
        return <Archive className="h-4 w-4 text-orange-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Project Header */}
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">{mockRoomData.projectName}</h2>
          <p className="text-sm text-gray-600">Campaign Room</p>
        </div>

        {/* Participants */}
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Participants</h3>
          <div className="space-y-2">
            {mockRoomData.participants.map((participant) => (
              <div key={participant.id} className="flex items-center space-x-3">
                <div className="relative">
                  <img
                    src={participant.avatar}
                    alt={participant.name}
                    className="h-8 w-8 rounded-full"
                  />
                  <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                    participant.status === 'online' ? 'bg-green-500' :
                    participant.status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {participant.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {participant.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Files */}
        <div className="flex-1 p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Recent Files</h3>
          <div className="space-y-2">
            {mockRoomData.recentFiles.map((file) => (
              <div key={file.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                {getFileIcon(file.type)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {file.size} • {new Date(file.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
                <Button variant="ghost" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Campaign Room</h1>
              <p className="text-sm text-gray-600">
                {mockRoomData.participants.filter(p => p.status === 'online').length} online
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Meeting
              </Button>
              <Button variant="outline" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {mockRoomData.messages.map((message) => (
            <div key={message.id} className="flex items-start space-x-3">
              <img
                src={message.author.avatar}
                alt={message.author.name}
                className="h-8 w-8 rounded-full flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-sm font-medium text-gray-900">
                    {message.author.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(message.timestamp).toLocaleString()}
                  </span>
                </div>
                <div className="text-sm text-gray-900 whitespace-pre-wrap">
                  {message.content}
                </div>
                {message.mentions.length > 0 && (
                  <div className="mt-1">
                    {message.mentions.map((mentionId, index) => {
                      const user = mockRoomData.participants.find(p => p.id === mentionId);
                      return user ? (
                        <Badge key={index} variant="outline" className="text-xs mr-1">
                          @{user.name}
                        </Badge>
                      ) : null;
                    })}
                  </div>
                )}
                {message.attachments.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {message.attachments.map((attachment) => (
                      <div key={attachment.id} className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                        {getFileIcon(attachment.type)}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {attachment.name}
                          </p>
                          <p className="text-xs text-gray-500">{attachment.size}</p>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Composer */}
        <div className="bg-white border-t border-gray-200 p-4">
          {/* Selected Files */}
          {selectedFiles.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-2">
                    {getFileIcon(file.type.split('/')[0])}
                    <span className="text-sm text-gray-700 truncate max-w-32">
                      {file.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatFileSize(file.size)}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      className="h-4 w-4 p-0"
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Composer */}
          <div className="flex items-end space-x-2">
            <div className="flex-1 relative">
              <textarea
                value={newMessage}
                onChange={(e) => {
                  setNewMessage(e.target.value);
                  if (e.target.value.includes('@')) {
                    setShowMentions(true);
                  } else {
                    setShowMentions(false);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Type a message... Use @ to mention someone"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
              />
              
              {/* Mentions Dropdown */}
              {showMentions && (
                <div className="absolute bottom-full left-0 mb-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  <div className="p-2">
                    <div className="text-xs font-medium text-gray-500 mb-2">Mention someone:</div>
                    {mockRoomData.participants.map((participant) => (
                      <button
                        key={participant.id}
                        onClick={() => handleMention(participant.id)}
                        className="w-full flex items-center space-x-2 p-2 hover:bg-gray-50 rounded-lg text-left"
                      >
                        <img
                          src={participant.avatar}
                          alt={participant.name}
                          className="h-6 w-6 rounded-full"
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {participant.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {participant.role}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowMentions(!showMentions)}
              >
                <AtSign className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
              >
                <Smile className="h-4 w-4" />
              </Button>
              <Button
                onClick={handleSendMessage}
                disabled={!newMessage.trim() && selectedFiles.length === 0}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
