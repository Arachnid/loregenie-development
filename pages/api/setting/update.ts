import { Converter, db } from '@/lib/db';
import { Setting } from '@/types';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const {
    settingData,
    settingID,
  }: { settingData: Setting; settingID: string } = JSON.parse(request.body);
  try {
    await db
      .collection('settings')
      .doc(settingID)
      .withConverter(new Converter<Setting>())
      .update(settingData);
  } catch (error) {
    console.log('error updating setting in database: ', error);
    response.statusCode = 500;
    response.send({});
    return;
  }
  response.send({});
}
