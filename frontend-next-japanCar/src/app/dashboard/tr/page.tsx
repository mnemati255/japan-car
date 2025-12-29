import { CONFIG } from '@/global-config';
import { ITranslation2 } from '@/types/translation';
import axios from 'axios';

const data: ITranslation2[] = [
  // {
  //   entityName: 'navbar_subheader',
  //   fieldName: '',
  //   translatedValue: '',
  // },
];

export default async function Page() {
  console.log(43);
  await axios.post(`${CONFIG.serverUrl}/Translation`, data);

  return (
    <div>
      <p>fsdfd</p>
    </div>
  );
}
