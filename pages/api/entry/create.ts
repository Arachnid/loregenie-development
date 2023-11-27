import admin from 'firebase-admin';
import crypto from 'crypto';
import { Converter, db, storage } from '@/lib/db';
import { Entry, PermissionLevel, World, WorldDB } from '@/types';
import { NextApiRequest, NextApiResponse } from 'next';
import { hasPermission } from '@/utils/validation/hasPermission';
import { aiGenerate, aiGenerateImage } from '@/lib/ai';
import writeDataToFile from '@/utils/storeMessages';


const DESCRIPTIONS: {[key: string]: string} = {
  'NPC': `A markdown block describing the NPC in this format:
**<NPC's gender> <NPC's race> <NPC's class or profession>, <NPC's alignment>**

# Summary
<A 1-sentence summary of the NPC.>

# Appearance
<A paragraph describing the NPC's appearance. Do not include the NPC's name in the description.>

# Personality
<A paragraph describing the NPC's personality in detail.>

 - Ideals: <A sentence describing the standard the NPC holds themselves to, written in first-person.>
 - Bonds: <A sentence describing the NPC's connection to people, places, or items, written in first-person.>
 - Flaws: <A sentence describing the NPC's weaknesses, written in first person.>

# Diction:
<A paragraph describing how the NPC speaks. Include accent, pitch and intonation, vocabulary, favorite phrases etc.>

# Background:
<A paragraph describing the NPC's history and background.>
`,

  'Location': `A markdown block describing the location. Locations can be as broad as entire continents or as specific as a single room; pay attention to the user's prompt to determine what to describe. Adhere strictly to this format:
# Summary
<A 1-sentence summary of the location.>

# Description
<A detailed description of the location. Be expansive and evocative in your prose.>
`,


  'Lore': `A markdown block describing the event. Adhere strictly to this format:
# Summary
<A 1-sentence summary of the event.>

# Description
<A detailed description of the event or lore. Be expansive and evocative in your prose.>
`
}

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  let { entryData, worldID }: { entryData: Entry; worldID: string } =
    JSON.parse(request.body);
  console.log(entryData);

  try {
    if (
      !(await hasPermission(request, response, worldID, PermissionLevel.writer))
    ) {
      response.statusCode = 500;
      response.send({});
      return;
    }

    let collectionRef: admin.firestore.CollectionReference<Entry | World> = db
      .collection('worlds')
      .withConverter(new Converter<World>());

    if (entryData.campaign) {
      collectionRef = collectionRef
        .doc(worldID)
        .collection('campaigns')
        .doc(entryData.campaign.id)
        .collection('entries')
        .withConverter(new Converter<Entry>());
    } else {
      collectionRef = collectionRef
        .doc(worldID)
        .collection('entries')
        .withConverter(new Converter<Entry>());
    }

    if(entryData.prompt) {
      const docRef = db
        .collection('worlds')
        .doc(worldID)
        .withConverter(new Converter<WorldDB>());
      const worldData = (await docRef.get()).data() as WorldDB;

      const prompt = entryData.prompt;
      const category = entryData.category as string;
      

      const { response, messages } = await aiGenerate<Partial<Entry>>(
        entryData.category as string,
        {
          name: `Name for the ${category}`,
          imagePrompt: `A description of an image that captures the ${category}, written in a way that someone who has never heard of the ${category} could paint a picture`,
          description: DESCRIPTIONS[category]
        },
        [{name: worldData.name, description: worldData.description}],
        prompt
      );
      

      // writeDataToFile( worldID, messages, './messages');

      entryData = Object.assign(entryData, response);

      console.log(entryData);
      const image = await aiGenerateImage(entryData.imagePrompt, '1024x1024');
      const fileRef = storage.bucket().file(`${crypto.randomUUID()}.png`);
      await fileRef
        .save(
          Buffer.from(
            image,
            'base64'
          )
        );
      entryData.image = fileRef.publicUrl();
    }

    const entry = await collectionRef.add(entryData);

    response.json((await entry.get()).data());
  } catch (error: any) {
    console.log('error writing entry to database: ', error, {error_message: error.message});
    response.statusCode = 500;
    response.send({});
    return;
  }
}
