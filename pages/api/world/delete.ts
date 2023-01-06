import { Converter, db } from '@/lib/db';
import { World } from '@/types';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const worldID: string = request.body;

  try {
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
