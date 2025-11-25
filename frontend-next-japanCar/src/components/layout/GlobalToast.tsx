'use client';

import { useEffect } from 'react';
import { useToastStore } from '@/stores/toastStore';
import { toast } from 'react-toastify';

export default function GlobalToast() {
  const { message, type, clearToast } = useToastStore();

  useEffect(() => {
    if (message) {
      toast[type](message);
      clearToast();
    }
  }, [clearToast, message, type]);

  return null;
}
