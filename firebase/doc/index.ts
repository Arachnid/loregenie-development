import { Converter, db } from "@/lib/db";

export type Doc = {
  title: string;
  userId: string;
  isArchived: boolean;
  parentDocument?: string;
  content?: string;
  coverImage?: string;
  icon?: string;
  isPublished: boolean;
};

export async function getDocs(userId: string): Promise<Doc[]> {
  const docs = await db
    .collection("docs")
    .where("userId", "==", userId)
    .where("isArchived", "==", false)
    .withConverter(new Converter<Doc>())
    .get();

  return docs.docs.map((doc) => doc.data());
}
