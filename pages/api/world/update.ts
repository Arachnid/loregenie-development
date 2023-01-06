import { Converter, db } from '@/lib/db';
import { World } from '@/types';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const {
    worldData,
    worldID,
  }: { worldData: World; worldID: string } = JSON.parse(request.body);
  try {
    await db
      .collection('worlds')
      .doc(worldID)
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
