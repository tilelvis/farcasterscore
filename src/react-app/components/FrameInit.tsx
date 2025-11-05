'use client';

import { useEffect } from 'react';
import { initializeFrame } from '@/react-app/lib/frame';

export function FrameInit() {
  useEffect(() => {
    initializeFrame();
  }, []);

  return null;
}
