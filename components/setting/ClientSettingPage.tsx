'use client';

import { Setting } from '@/types';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useRouter } from 'next/navigation';

type Props = {
  setting: Setting;
};

const SettingPage = ({ setting }: Props) => {
  const router = useRouter();
  const onDelete = async () => {
    try {
      await fetch('/api/setting/delete', {
        method: 'POST',
        body: setting.id,
      });
      router.push('/');
      router.refresh();
    } catch (error) {
      console.log('error deleting setting: ', error);
    }
  };
  return (
    <>
      <h1>{setting.name}</h1>
      <div>{setting.description}</div>
      <Button
        variant='contained'
        color='error'
        sx={{ margin: '8px' }}
        onClick={() => onDelete()}
      >
        Delete Setting
      </Button>
      <Button
        sx={{ margin: '8px' }}
        onClick={() => router.push(`/setting/${setting.id}/edit`)}
      >
        Edit Setting
      </Button>
    </>
  );
};

export default SettingPage;
