import { storage } from '@/lib/db';
import { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '4mb',
    },
  },
};

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const {
    base64,
    filePath,
    permissions,
  }: { base64: string; filePath: string; permissions: string[] } = JSON.parse(
    request.body
  );
  try {
    if (!permissions.includes('writer')) {
      console.log('user does not have permission for that action.');
      return;
    }
    const fileRef = storage.bucket().file(filePath);
    const uploadImage = await fileRef
      .save(
        Buffer.from(
          base64.replace(/^data:image\/(png|jpeg);base64,/, ''),
          'base64'
        )
      )
      .then(() => {
        const publicUrl = fileRef.publicUrl();
        response.json(publicUrl);
      });
  } catch (error) {
    console.log('error writing image to storage: ', error);
    response.statusCode = 500;
    response.send({});
    return;
  }
}
