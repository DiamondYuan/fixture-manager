export enum EFixtureType {
  skip = "skip",
  only = "only",
  default = "default",
}

export interface IFixtureOptions {
  path: string;
  type: EFixtureType;
}

export interface IFixture {
  type: EFixtureType;
  readFile(path: string): Promise<string | null>;
  readJSON<T = any>(path: string): Promise<T | null>;
  writeJSON<T = any>(path: string, data: T): Promise<void>;
  writeFile(path: string, content: string): Promise<void>;
}

export interface IFixtureManager<T extends IFixture = IFixture> {
  getAllFixtures(): Promise<T[]>;

  getFixtures(): Promise<T[]>;

  get(name: string): Promise<T>;
}

export interface IFixtureConstructor<T extends IFixture = IFixture> {
  new (options: IFixtureOptions): T;
}
export interface IFixtureManagerOptions<T extends IFixture = IFixture> {
  path: string;
  fixtureFactory?: IFixtureConstructor<T>;
}
