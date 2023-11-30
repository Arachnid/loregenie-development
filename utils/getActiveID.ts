export const getActiveID = (pathname: string | null): string | undefined => {
  const idAfterLastSlash = "([^/]+$)";
  let activeID: string;

  if (pathname) {
    const regex: RegExpMatchArray | null = pathname.match(idAfterLastSlash);
    if (regex !== null) {
      activeID = regex[0];
      return activeID;
    }
  }

  return undefined;
};
