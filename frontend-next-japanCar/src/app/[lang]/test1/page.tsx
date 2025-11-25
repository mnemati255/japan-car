'use client';

import { useLang } from '@/contexts/LangContext';

export default function Test1() {
  const { dict } = useLang();
  return (
    <div>
      <p>{dict.home}</p>
    </div>
  );
}
