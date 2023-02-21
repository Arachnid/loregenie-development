import { Converter, db } from '@/lib/db';
import { PermissionLevel, World } from '@/types';
import { hasPermission } from '@/utils/hasPermission';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const { worldData }: { worldData: World } = JSON.parse(request.body);
  
  try {
    if (
      !(await hasPermission(
        request,
        response,
        worldData.id,
        PermissionLevel.writer
      ))
    ) {
      response.statusCode = 500;
      response.send({});
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
