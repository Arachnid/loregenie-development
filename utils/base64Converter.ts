export const base64Converter = async (file: File): Promise<string> => {
  return Buffer.from(await file.arrayBuffer()).toString("base64");
};
