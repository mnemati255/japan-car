import { CONFIG } from '@/global-config';
import { ITranslation2 } from '@/types/translation';
import axios from 'axios';

const data: ITranslation2[] = [
  {
    entityName: 'messages',
    fieldName: 'mes_selectImageType',
    translatedValue: 'Select image type',
    category: null,
  },
];

export default async function Page() {
  await axios.post(`${CONFIG.serverUrl}/Translation`, data);

  return (
    <div>
      <p>fsdfd</p>
    </div>
  );
}
