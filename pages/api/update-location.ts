import { Converter, db } from '@/lib/db';
import { ExtendedCampaign, Location } from '@/types';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const { firebaseKey, data }: { firebaseKey: string; data: Location } =
    JSON.parse(request.body);
  try {
    const locationRef = db
      .collection('locations')
      .doc(data.id)
      .withConverter(new Converter<Location>());
    await locationRef
      .update(data)
      .then((res) =>
        console.log('update location in locations collection: ', res)
      );

    const locationKey = `locationNav.${firebaseKey}`;

    const campaignRef = db
      .collection('campaigns')
      .doc(data.campaign)
      .withConverter(new Converter<ExtendedCampaign>());

    await campaignRef
      .update({ [locationKey]: { key: locationRef.id } })
      .then((res) =>
        console.log('update location in campaign locationNav: ', res)
      );
  } catch (error) {
    console.log('error updating location to database: ', error);
    response.statusCode = 500;
    response.send({});
    return;
  }
  response.send({});
}
