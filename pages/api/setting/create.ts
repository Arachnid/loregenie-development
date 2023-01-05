import { Converter, db } from '@/lib/db';
import { Setting } from '@/types';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const settingData: Setting = JSON.parse(request.body);
  try {
    await db
      .collection('settings')
      .withConverter(new Converter<Setting>())
      .add(settingData);
  } catch (error) {
    console.log('error writing setting to database: ', error);
    response.statusCode = 500;
    response.send({});
    return;
  }
  response.send({});
}
