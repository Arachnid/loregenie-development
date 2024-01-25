import { Converter, db } from "@/lib/db";
import { Entry, WorldDB } from "@/types";
import {
  Block,
  DefaultBlockSchema,
  DefaultInlineContentSchema,
  DefaultProps,
  DefaultStyleSchema,
  InlineContent,
  TableContent,
} from "@blocknote/core";

type DefaultBlock = Block<
  DefaultBlockSchema,
  DefaultInlineContentSchema,
  DefaultStyleSchema
>;

export function extractEntryContext(entry: Entry) {
  try {
    const description: DefaultBlock[] = JSON.parse(entry.description);

    const context = description.reduce((acc, block) => {
      return acc + extractBlockText(block);
    }, "");

    return {
      context,
    };
  } catch (error) {
    console.error("Error parsing description", error);
    return {
      error: "Error parsing description",
    };
  }
}
export async function extractWorldContext(worldID: string) {
  try {
    const worldDB = (
      await db
        .collection("worlds")
        .doc(worldID)
        .withConverter(new Converter<WorldDB>())
        .get()
    ).data();

    if (!worldDB) {
      return {
        error: "World not found",
      };
    }

    try {
      const description: DefaultBlock[] = JSON.parse(worldDB.description);

      const context = description.reduce((acc, block) => {
        return acc + extractBlockText(block);
      }, "");

      return {
        context,
      };
    } catch (error) {
      console.error("Error parsing description", error);
      return {
        error: "Error parsing description",
      };
    }
  } catch (error) {
    console.error("Error in extractWorldContext", error);
    return {
      error: "Error in extractWorldContext",
    };
  }
}

type ParagraphBlock = {
  id: string;
  type: "paragraph";
  props: DefaultProps;
  content: InlineContent<DefaultInlineContentSchema, DefaultStyleSchema>[];
  children: DefaultBlock[];
};
function extractParagraphText(paragraph: ParagraphBlock) {
  let resp = "";

  paragraph.content.forEach((inline) => {
    resp += extractInlineContentText(inline);
  });

  resp += paragraph.children.map((block) => extractBlockText(block)).join(" ");

  return resp;
}

type HeadingBlock = {
  id: string;
  type: "heading";
  props: {
    level: 1 | 2 | 3;
  } & DefaultProps;
  content: InlineContent<DefaultInlineContentSchema, DefaultStyleSchema>[];
  children: DefaultBlock[];
};
function extractHeadingText(heading: HeadingBlock) {
  let resp = "";

  heading.content.forEach((inline) => {
    resp += extractInlineContentText(inline);
  });

  resp += heading.children.map((block) => extractBlockText(block)).join(" ");

  return resp;
}

type BulletListItemBlock = {
  id: string;
  type: "bulletListItem";
  props: DefaultProps;
  content: InlineContent<DefaultInlineContentSchema, DefaultStyleSchema>[];
  children: DefaultBlock[];
};
function extractBulletListItemText(bulletListItem: BulletListItemBlock) {
  let resp = "";

  bulletListItem.content.forEach((inline) => {
    resp += extractInlineContentText(inline);
  });

  resp += bulletListItem.children
    .map((block) => extractBlockText(block))
    .join(" ");

  return resp;
}

type NumberedListItemBlock = {
  id: string;
  type: "numberedListItem";
  props: DefaultProps;
  content: InlineContent<DefaultInlineContentSchema, DefaultStyleSchema>[];
  children: DefaultBlock[];
};
function extractNumberedListItemText(numberedListItem: NumberedListItemBlock) {
  let resp = "";

  numberedListItem.content.forEach((inline) => {
    resp += extractInlineContentText(inline);
  });

  resp += numberedListItem.children
    .map((block) => extractBlockText(block))
    .join(" ");

  return resp;
}

type ImageBlock = {
  id: string;
  type: "image";
  props: {
    url: string;
    caption: string;
    width: number;
    textColor: string;
  } & Omit<DefaultProps, "textAlignment">;
  content: InlineContent<DefaultInlineContentSchema, DefaultStyleSchema>[];
  children: DefaultBlock[];
};

function extractImageText(image: ImageBlock) {
  let resp = "";

  image.content.forEach((inline) => {
    resp += extractInlineContentText(inline);
  });

  resp += image.children.map((block) => extractBlockText(block)).join(" ");

  return resp;
}

type TableBlock = {
  id: string;
  type: "table";
  props: DefaultProps;
  content: TableContent<DefaultInlineContentSchema, DefaultStyleSchema>;
  children: DefaultBlock[];
};
function extractTableText(table: TableBlock) {
  let resp = "";
  table.content.rows.forEach((row) => {
    row.cells.forEach((cell) => {
      cell.forEach((inline) => {
        resp += extractInlineContentText(inline);
      });
    });
  });
}

function extractInlineContentText(
  content: InlineContent<DefaultInlineContentSchema, DefaultStyleSchema>,
) {
  switch (content.type) {
    case "text":
      return content.text;
    case "link":
      return content.content.map((inline) => inline.text).join(" ");
    default:
      return "";
  }
}

function extractBlockText(block: DefaultBlock) {
  switch (block.type) {
    case "paragraph":
      return extractParagraphText(block);
    case "heading":
      return extractHeadingText(block);
    case "bulletListItem":
      return extractBulletListItemText(block);
    case "numberedListItem":
      return extractNumberedListItemText(block);
    case "image":
      // @ts-ignore
      return extractImageText(block);
    case "table":
      return extractTableText(block);
    default:
      return "";
  }
}

const example = [
  {
    id: "0572cda4-db5a-4780-b37e-f79906966803",
    type: "paragraph",
    props: {
      textColor: "default",
      backgroundColor: "default",
      textAlignment: "left",
    },
    content: [
      {
        type: "text",
        text: "In the world of Aerius, civilization thrives amidst the clouds. Sprawling cities are built upon colossal floating landmasses known as Skyholds that drift gently across the sky. These sky cities are connected by a vast network of magical bridges and airships that glide among them. The skyfolk have a deep affinity with the air element, harnessing its power to sustain their floating havens and bend the winds to their will.",
        styles: {},
      },
    ],
    children: [],
  },
  {
    id: "398887ac-7408-4c0e-bdc2-4fc185491dfb",
    type: "paragraph",
    props: {
      textColor: "default",
      backgroundColor: "default",
      textAlignment: "left",
    },
    content: [
      {
        type: "text",
        text: "Magic permeates every aspect of Aerius life, with air magic being the most prominent. This inherent connection to the element has given rise to powerful magicians known as Windcallers, who serve as protectors and guides for their communities. The skies of Aerius are also home to majestic dragons that soar gracefully through the clouds. These creatures are not enemies but revered guardians of the sky cities. Each city has a bond with a dragon that watches over it, often interwoven into its history and culture.",
        styles: {},
      },
    ],
    children: [],
  },
  {
    id: "1871057b-08a3-4e2b-928a-4ffcdc69dc24",
    type: "paragraph",
    props: {
      textColor: "default",
      backgroundColor: "default",
      textAlignment: "left",
    },
    content: [
      {
        type: "text",
        text: "The cities themselves embody a blend of elegant architecture that seemingly defies gravity and innovative engineering, with windmills and turbines drawing power from the ever-present air currents. The skyfolk value harmony with the sky and seek to live in balance with the dragons and the raw elemental forces.",
        styles: {},
      },
    ],
    children: [],
  },
  {
    id: "7884ad86-d3a4-4114-8d09-760aa3e99e8f",
    type: "paragraph",
    props: {
      textColor: "default",
      backgroundColor: "default",
      textAlignment: "left",
    },
    content: [
      {
        type: "text",
        text: "Beyond the cities, the skies hold secrets in their embrace '97 forgotten ruins of ancient skyfaring civilizations, drifting islands with untold treasures, and perilous storms with cores of untapped elemental energy. This is Aerius, a realm where the ground is a myth spoken in hushed tones, and the horizon is not a line but a voluminous domain filled with adventure and wonder.",
        styles: {},
      },
    ],
    children: [],
  },
  {
    id: "aba270ae-cb95-4057-94e9-a911fb2d33d4",
    type: "bulletListItem",
    props: {
      textColor: "default",
      backgroundColor: "default",
      textAlignment: "left",
    },
    content: [
      {
        type: "text",
        text: "Geography and Sentient Races",
        styles: { bold: true },
      },
      {
        type: "text",
        text: " Aerius features numerous floating landmasses known as Skyholds, each varying in size, climate, and topology. The largest of these, Celestarra, is a city in the clouds that resembles a sprawling metropolis with architecture that spirals towards the heavens. Here, humans, aarakocra, and air genasi coexist in harmony, their cultures interwoven like the intricate latticework of their floating gardens.",
        styles: {},
      },
    ],
    children: [],
  },
  {
    id: "4a8b8a1e-18ba-412a-a45d-0f89e779fb24",
    type: "bulletListItem",
    props: {
      textColor: "default",
      backgroundColor: "default",
      textAlignment: "left",
    },
    content: [
      { type: "text", text: "Government and Society", styles: { bold: true } },
      {
        type: "text",
        text: " Each Skyhold is governed by a Sky Council, comprising Windcallers and prominent citizens elected by their peers. They convene at the Aerie Forum, an open-air assembly where the wind carries their voices to every part of the city. The people of Aerius value liberty and innovation, with artisans constantly seeking to improve life through magic-infused technology. Unbound by land, the skyfolk are explorers and dreamers, charting new territories and forming alliances with distant Skyholds.",
        styles: {},
      },
    ],
    children: [],
  },
  {
    id: "600ce6fe-1daa-41b7-a0d4-fb2627e4f76d",
    type: "bulletListItem",
    props: {
      textColor: "default",
      backgroundColor: "default",
      textAlignment: "left",
    },
    content: [
      { type: "text", text: "Dragon Guardians", styles: { bold: true } },
      {
        type: "text",
        text: " The dragons of Aerius are wise and elemental in nature. Each dragon shares a covenant with its city, established through ancient rituals. Aviendha, the Sapphire Protector of Celesterra, is a legend; an immense azure dragon who can summon gales and command the rain.",
        styles: {},
      },
    ],
    children: [],
  },
  {
    id: "837069fc-19ad-4485-931e-f5100c858882",
    type: "bulletListItem",
    props: {
      textColor: "default",
      backgroundColor: "default",
      textAlignment: "left",
    },
    content: [
      { type: "text", text: "Magic and Technology", styles: { bold: true } },
      {
        type: "text",
        text: " In Aerius, magic and technology are blended seamlessly. Windcallers channel the essence of the sky to power levitation spells, while engineers harness kinetic wind energy to ensure the cities remain aloft. Symbols of this synergy include Skyshards '97 crystalline artifacts capable of storing vast amounts of magical energy. Airships powered by these shards traverse the skies, their sails shimmering with runic glyphs that glow at night.",
        styles: {},
      },
    ],
    children: [],
  },
  {
    id: "e56fde89-df7b-403b-a42a-9f5b8e2e0164",
    type: "bulletListItem",
    props: {
      textColor: "default",
      backgroundColor: "default",
      textAlignment: "left",
    },
    content: [
      {
        type: "text",
        text: "Culture, Traditions, and Festivals",
        styles: { bold: true },
      },
      {
        type: "text",
        text: " Each Skyhold celebrates its own unique festivals. Celesterra hosts the Grand Convergence, a spectacle where dragons perform aerial acrobatics in the skies above, harmoniously synchronized with the Windcallers' aerial ballet. Skyfolk cuisine is light and airy, often infused with the herbs found in their floating gardens. Music is an integral part of life, with instruments designed to harness the wind, creating haunting melodies that echo across the clouds.",
        styles: {},
      },
    ],
    children: [],
  },
  {
    id: "ab1b2b1e-eafa-476a-a413-58d0f8accdf9",
    type: "table",
    props: { textColor: "default", backgroundColor: "default" },
    content: {
      type: "tableContent",
      rows: [
        {
          cells: [
            [
              {
                type: "text",
                text: "The Mysterious Below",
                styles: { bold: true },
              },
              { type: "text", text: " ", styles: {} },
            ],
          ],
        },
        {
          cells: [
            [
              {
                type: "text",
                text: "While the sky cities thrive above, the surface of Aerius is shrouded in mystery. Known as The Below, it is enveloped in a perpetual storm, obscuring what lies beneath. Only the bravest adventurers dare to delve into its depths, seeking answers to ancient riddles and the origin of the Skyholds.",
                styles: {},
              },
            ],
          ],
        },
      ],
    },
    children: [],
  },
  {
    id: "b68b4dad-4226-4e98-ba48-7daec61834e5",
    type: "paragraph",
    props: {
      textColor: "default",
      backgroundColor: "default",
      textAlignment: "left",
    },
    content: [],
    children: [],
  },
];
