'use client';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function Roles() {
  return (
    <div className="p-6">
      <Button variant={'outline'}>
        <Plus />
        Add role
      </Button>
    </div>
  );
}
