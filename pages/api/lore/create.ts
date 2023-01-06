import { Converter, db } from '@/lib/db';
import { LoreForm, Forms } from '@/types';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const { loreData, worldID }: { loreData: LoreForm; worldID: string } =
    JSON.parse(request.body);
  try {
    const lore = await db
      .collection('worlds')
      .doc(worldID)
      .collection('plotPoints')
      .withConverter(new Converter<Forms>())
      .add(loreData);
    response.json(lore.id);
  } catch (error) {
    console.log('error writing lore to database: ', error);
    response.statusCode = 500;
    response.send({});
    return;
  }
}
