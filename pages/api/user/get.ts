import { Converter, db } from '@/lib/db';
import { User } from '@/types';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const { emails }: { emails: string[] } = JSON.parse(request.body);
  try {
    const users = await db
      .collection('users')
      .where('email', 'in', emails)
      .withConverter(new Converter<User>())
      .get();

    response.json(users.docs.map((user) => user.data()));
  } catch (error) {
    console.log('error fetching users: ', error);
    response.statusCode = 500;
    response.send({});
    return;
  }
  response.send({});
}
