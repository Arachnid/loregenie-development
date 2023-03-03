import { db } from '@/lib/db';
import { PermissionLevel } from '@/types';
import { hasPermission } from '@/utils/validation/hasPermission';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const { worldID }: { worldID: string } = JSON.parse(request.body);

  try {
    if (
      !(await hasPermission(request, response, worldID, PermissionLevel.admin))
    ) {
      response.statusCode = 500;
      response.send({});
      return;
    }
    await db.recursiveDelete(db.collection('worlds').doc(worldID));
  } catch (error) {
    console.log('error deleting world from database: ', error);
    response.statusCode = 500;
    response.send({});
    return;
  }
  response.send({});
}
