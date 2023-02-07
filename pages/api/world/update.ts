import { Converter, db } from '@/lib/db';
import { World } from '@/types';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const {
    worldData,
    permissions,
  }: { worldData: World; permissions: string[] } = JSON.parse(request.body);
  try {
    if (!permissions.includes('writer')) {
      console.log('user does not have permission for that action.');
      return;
    }
    await db
      .collection('worlds')
      .doc(worldData.id)
      .withConverter(new Converter<World>())
      .update(worldData);
  } catch (error) {
    console.log('error updating world in database: ', error);
    response.statusCode = 500;
    response.send({});
    return;
  }
  response.send({});
}
