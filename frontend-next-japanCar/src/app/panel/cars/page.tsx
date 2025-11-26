import { MTable } from '@/components/shared/MTable';
import { Button } from '@/components/ui/button';
import { ICar } from '@/lib/interfaces/car';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default function CarsPage() {
  const columns = [{ header: '', accessor: '', width: '' }];

  return (
    <div>
      <Link href="./cars/0">
        <Button variant={'outline'}>
          <Plus />
          Create car
        </Button>
      </Link>

      <MTable<ICar> data={[]} columns={columns} actions={[]} className='mt-8'/>
    </div>
  );
}
