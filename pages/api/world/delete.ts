import { Converter, db } from '@/lib/db';
import { World } from '@/types';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const { worldID, permissions }: { worldID: string; permissions: string[] } =
    JSON.parse(request.body);

  try {
    if (!permissions.includes('admin')) {
      console.log('user does not have permission for that action.');
      return;
    }
    await db
      .collection('worlds')
      .doc(worldID)
      .withConverter(new Converter<World>())
      .delete();
  } catch (error) {
    console.log('error deleting world from database: ', error);
    response.statusCode = 500;
    response.send({});
    return;
  }
  response.send({});
}
