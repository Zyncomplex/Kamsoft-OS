import { useState, useEffect, useCallback } from 'react';
import { useCrud } from './useCrud';
import { api } from '../lib/api';

export function useConversations() {
  const crud = useCrud<any>('/conversations');

  const getMessages = useCallback(async (conversationId: string) => {
    return await api.get<any[]>(`/conversations/${conversationId}/messages`);
  }, []);

  const sendMessage = async (conversationId: string, text: string, attachments: string[] = []) => {
    return await api.post(`/conversations/${conversationId}/messages`, {
      text,
      attachments
    });
  };

  return { ...crud, getMessages, sendMessage };
}
