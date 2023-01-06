import { Converter, db } from '@/lib/db';
import { Lore } from '@/types';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const { loreID, worldID }: { loreID: string; worldID: string } = JSON.parse(
    request.body
  );

  try {
    await db
      .collection('worlds')
      .doc(worldID)
      .collection('plotPoints')
      .doc(loreID)
      .withConverter(new Converter<Lore>())
      .delete();
  } catch (error) {
    console.log('error deleting lore from database: ', error);
    response.statusCode = 500;
    response.send({});
    return;
  }
  response.send({});
}
