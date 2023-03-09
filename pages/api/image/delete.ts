import { storage } from '@/lib/db';
import { PermissionLevel } from '@/types';
import { hasPermission } from '@/utils/validation/hasPermission';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const { filePath, worldID }: { filePath: string; worldID: string } =
    JSON.parse(request.body);
  try {
    if (
      !(await hasPermission(request, response, worldID, PermissionLevel.writer))
    ) {
      response.statusCode = 500;
      response.send({});
      return;
    }
    const fileRef = storage.bucket().file(filePath);
    const deleteImage = await fileRef.delete();
  } catch (error) {
    console.log('error deleting image from storage: ', error);
    response.statusCode = 500;
    response.send({});
    return;
  }
  response.send({});
}
