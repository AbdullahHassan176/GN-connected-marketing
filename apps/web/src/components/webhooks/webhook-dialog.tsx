'use client';

import { useState } from 'react';
import { Button } from '@repo/ui';
import { X, Plus, TestTube, ExternalLink } from 'lucide-react';

interface WebhookDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (webhook: any) => void;
}

export function WebhookDialog({ isOpen, onClose, onSave }: WebhookDialogProps) {
  const [formData, setFormData] = useState({
    url: '',
    secret: '',
    events: [] as string[],
    isActive: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const eventOptions = [
    { value: 'work_item.created', label: 'Work Item Created' },
    { value: 'approval.requested', label: 'Approval Requested' },
    { value: 'insights.updated', label: 'Insights Updated' },
    { value: 'export.completed', label: 'Export Completed' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    
    if (!formData.url) {
      newErrors.url = 'Webhook URL is required';
    } else if (!isValidUrl(formData.url)) {
      newErrors.url = 'Please enter a valid URL';
    }
    
    if (!formData.secret) {
      newErrors.secret = 'Webhook secret is required';
    }
    
    if (formData.events.length === 0) {
      newErrors.events = 'Please select at least one event type';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    const webhook = {
      id: `webhook_${Date.now()}`,
      ...formData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deliveryCount: 0,
      failureCount: 0
    };
    
    onSave(webhook);
    onClose();
    setFormData({ url: '', secret: '', events: [], isActive: true });
    setErrors({});
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleEventToggle = (eventValue: string) => {
    setFormData(prev => ({
      ...prev,
      events: prev.events.includes(eventValue)
        ? prev.events.filter(e => e !== eventValue)
        : [...prev.events, eventValue]
    }));
  };

  const generateSecret = () => {
    const secret = 'whsec_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    setFormData(prev => ({ ...prev, secret }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Create Webhook Endpoint</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Webhook URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Webhook URL *
            </label>
            <div className="flex items-center space-x-2">
              <ExternalLink className="h-4 w-4 text-gray-400" />
              <input
                type="url"
                value={formData.url}
                onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                className={`flex-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.url ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="https://hooks.zapier.com/hooks/catch/..."
              />
            </div>
            {errors.url && (
              <p className="mt-1 text-sm text-red-600">{errors.url}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              Enter the webhook URL from your integration platform (Zapier, n8n, etc.)
            </p>
          </div>

          {/* Webhook Secret */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Webhook Secret *
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={formData.secret}
                onChange={(e) => setFormData(prev => ({ ...prev, secret: e.target.value }))}
                className={`flex-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm ${
                  errors.secret ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="whsec_..."
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={generateSecret}
              >
                Generate
              </Button>
            </div>
            {errors.secret && (
              <p className="mt-1 text-sm text-red-600">{errors.secret}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              Secret key for webhook signature verification
            </p>
          </div>

          {/* Event Types */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Types *
            </label>
            <div className="grid grid-cols-2 gap-3">
              {eventOptions.map(option => (
                <label
                  key={option.value}
                  className="flex items-center space-x-2 p-3 border rounded-md hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={formData.events.includes(option.value)}
                    onChange={() => handleEventToggle(option.value)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
            {errors.events && (
              <p className="mt-1 text-sm text-red-600">{errors.events}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              Select which events should trigger this webhook
            </p>
          </div>

          {/* Status */}
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-sm font-medium text-gray-700">
                Active (webhook will be triggered)
              </span>
            </label>
          </div>

          {/* Test Section */}
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="flex items-center space-x-2 mb-2">
              <TestTube className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium text-gray-700">Test Webhook</span>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              After creating the webhook, you can send a test payload to verify the integration.
            </p>
            <div className="text-xs text-gray-500 font-mono bg-white p-2 rounded border">
              POST {formData.url || 'https://your-webhook-url.com'}<br/>
              X-Webhook-Signature: sha256=...<br/>
              X-Webhook-Event: test.ping<br/>
              Content-Type: application/json
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              <Plus className="h-4 w-4 mr-2" />
              Create Webhook
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
