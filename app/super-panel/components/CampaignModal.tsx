'use client';
import { useState } from 'react';

interface CampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscribers: any[];
}

export function CampaignModal({ isOpen, onClose, subscribers }: CampaignModalProps) {
  const [campaignData, setCampaignData] = useState({ headerText: '', imageUrl: '', description: '', linkUrl: '' });
  const [sendResult, setSendResult] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  if (!isOpen) return null;

  const sendNewsletter = async () => {
    setSendResult('sending');
    try {
      const res = await fetch('/api/send-newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscribers,
          ...campaignData,
        }),
      });
      const result = await res.json();
      if (result.success) {
        setSendResult('success');
        setTimeout(() => {
          onClose();
          setSendResult('idle');
          setCampaignData({ headerText: '', imageUrl: '', description: '', linkUrl: '' });
        }, 1500);
      } else {
        setSendResult('error');
      }
    } catch {
      setSendResult('error');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-8 z-50">
      <div className="bg-[#111] border border-[#333] p-8 w-full max-w-md">
        <h2 className="text-xl font-bold mb-6">NEW CAMPAIGN</h2>
        <input
          value={campaignData.headerText}
          className="w-full bg-[#222] p-2 mb-4 outline-none border border-transparent focus:border-white"
          placeholder="Header Text"
          onChange={(e) => setCampaignData({ ...campaignData, headerText: e.target.value })}
        />
        <input
          value={campaignData.imageUrl}
          className="w-full bg-[#222] p-2 mb-4 outline-none border border-transparent focus:border-white"
          placeholder="Image URL"
          onChange={(e) => setCampaignData({ ...campaignData, imageUrl: e.target.value })}
        />
        <textarea
          value={campaignData.description}
          className="w-full bg-[#222] p-2 mb-4 outline-none border border-transparent focus:border-white h-24 resize-none"
          placeholder="Description"
          onChange={(e) => setCampaignData({ ...campaignData, description: e.target.value })}
        />
        <input
          value={campaignData.linkUrl}
          className="w-full bg-[#222] p-2 mb-6 outline-none border border-transparent focus:border-white"
          placeholder="Link URL"
          onChange={(e) => setCampaignData({ ...campaignData, linkUrl: e.target.value })}
        />

        <div className="flex gap-4">
          <button
            onClick={sendNewsletter}
            disabled={sendResult === 'sending' || sendResult === 'success'}
            className={`flex-1 p-3 font-bold uppercase text-xs tracking-wider transition-colors duration-200 ${
              sendResult === 'sending'
                ? 'bg-yellow-600 text-white cursor-wait'
                : sendResult === 'success'
                ? 'bg-green-600 text-white'
                : sendResult === 'error'
                ? 'bg-red-600 text-white'
                : 'bg-white text-black hover:bg-gray-200'
            }`}
          >
            {sendResult === 'sending' && 'SENDING...'}
            {sendResult === 'success' && 'SUCCESSFUL!'}
            {sendResult === 'error' && 'ERROR! TRY AGAIN'}
            {sendResult === 'idle' && 'SEND TO FILTERED'}
          </button>
          <button
            onClick={() => {
              onClose();
              setSendResult('idle');
            }}
            className="border border-[#444] p-3 text-xs uppercase hover:border-white transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}