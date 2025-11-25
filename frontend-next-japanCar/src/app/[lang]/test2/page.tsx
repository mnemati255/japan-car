import { LangType } from '@/types/LangType';
import { getDictionary } from '../dictionaries';

export default async function Test2({ params }: { params: Promise<{ lang: LangType }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <div>
      <p>{dict.home}</p>
    </div>
  );
}
