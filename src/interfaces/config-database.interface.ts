export interface IConfigDatabase {
  shortName: string;
  url: string;
  db: string;
  ignoreCollections: {
    all: string[];
    input: string[];
    output: string[];
  };
}
