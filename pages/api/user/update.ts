import { Converter, db } from "@/lib/db";
import { User } from "@/types";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const { userData }: { userData: User } = JSON.parse(request.body);
  try {
    await db
      .collection("users")
      .doc(userData.email)
      .withConverter(new Converter<User>())
      .set(userData);
  } catch (error) {
    console.log("error updating user in database: ", error);
    response.statusCode = 500;
    response.send({});
    return;
  }
  response.send({});
}
