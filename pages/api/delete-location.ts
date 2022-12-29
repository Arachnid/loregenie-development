import { Converter, db } from '@/lib/db';
import { ExtendedCampaign, Location } from '@/types';
import { FieldValue, QueryDocumentSnapshot } from 'firebase-admin/firestore';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const {
    locationID,
    campaignID,
    firebaseKey,
  }: { locationID: string; campaignID: string; firebaseKey: string } =
    JSON.parse(request.body);

  try {
    const locationKey = `locationNav.${firebaseKey}`;
    const response = await db
      .collection('campaigns')
      .doc(campaignID)
      .withConverter(new Converter<ExtendedCampaign>())
      .update({
        [locationKey]: FieldValue.delete(),
      });
      console.log('delete', response);

    // await db
    //   .collection('locations')
    //   .doc(locationID)
    //   .withConverter(new Converter<Location>())
    //   .delete();
  } catch (error) {
    console.log('error deleting location from database: ', error);
    response.statusCode = 500;
    response.send({});
    return;
  }
  response.send({});
}
