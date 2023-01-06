import { Converter, db } from '@/lib/db';
import { Lore } from '@/types';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const {
    loreData,
    loreID,
    worldID,
  }: { loreData: Lore; loreID: string; worldID: string } = JSON.parse(
    request.body
  );
  try {
    await db
      .collection('worlds')
      .doc(worldID)
      .collection('plotPoints')
      .doc(loreID)
      .withConverter(new Converter<Lore>())
      .update(loreData);
  } catch (error) {
    console.log('error updating lore to database: ', error);
    response.statusCode = 500;
    response.send({});
    return;
  }
  response.send({});
}
