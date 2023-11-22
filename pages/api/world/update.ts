import { Converter, db } from '@/lib/db';
import { PermissionLevel, WorldDB } from '@/types';
import { updateValidation } from '@/utils/validation/updateValidation';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const { worldData }: { worldData: WorldDB } = JSON.parse(request.body);

  const docRef = db
    .collection('worlds')
    .doc(worldData.id)
    .withConverter(new Converter<WorldDB>());

  const docData = (await docRef.get()).data();

  try {
    if (!(await updateValidation(request, response, worldData, docData))) {
      response.statusCode = 500;
      response.send({});
      return;
    }

    await docRef.update(worldData);

    // Retrieve the updated document
    const updatedDoc = await docRef.get();
    const updatedData = updatedDoc.data();

    if (updatedData) {
      response.json(updatedData); // Send the updated data
    } else {
      throw new Error("Failed to retrieve updated data.");
    }
  } catch (error) {
    console.error('Error updating world in database:', error);
    response.status(500).send({ error: 'Error updating world in database.' });
  }
}
