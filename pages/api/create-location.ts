import { Converter, db } from '@/lib/db';
import { BaseLocation, ExtendedCampaign } from '@/types';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const data: BaseLocation = JSON.parse(request.body);
  try {
    const locationRef = db
      .collection('locations')
      .doc()
      .withConverter(new Converter<BaseLocation>());
    await locationRef
      .set(data)
      .then((res) =>
        console.log('create location in locations collection: ', res)
      );

    const locationKey = `locationNav.${locationRef.id}`;

    const campaignRef = db
      .collection('campaigns')
      .doc(data.campaign)
      .withConverter(new Converter<ExtendedCampaign>());

    await campaignRef
      .update({ [locationKey]: { key: locationRef.id } })
      .then((res) =>
        console.log('create location in campaign locationNav: ', res)
      );
  } catch (error) {
    console.log('error writing location to database: ', error);
    response.statusCode = 500;
    response.send({});
    return;
  }
  response.send({});
}
