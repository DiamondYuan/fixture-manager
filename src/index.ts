export enum EFixtureTag {
  skip = "skip",
  only = "only",
  default = "default",
}

export interface IFixture {
  type: EFixtureTag;
  tags: Set<string>;
  readFile(path: string): Promise<string>;
  readJSON<T = any>(path: string): Promise<T>;
  writeJSON<T = any>(path: string, data: T): Promise<void>;
  writeFile(path: string): Promise<void>;
}

export interface IFixtureManager<T extends IFixture = IFixture> {
  getFixtures(): Promise<T[]>;
}
