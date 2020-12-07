import {
  EFixtureType,
  IFixtureManager,
  IFixtureManagerOptions,
  IFixtureConstructor,
  IFixture,
} from "./type";
import fs from "fs";
import { promisify } from "util";
import { join } from "path";
import { BaseFixture } from "./baseFixture";

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

const ONLY_DIR_NAME = "__ONLY__";
const SKIP_DIR_NAME = "__SKIP__";

type TGetAllSubfolderFiler = (dirname: string) => boolean;

export class FixtureManager<T extends IFixture = IFixture>
  implements IFixtureManager<T> {
  constructor(private options: IFixtureManagerOptions) {}

  public async getAllFixtures() {
    let result: T[] = [];
    if (await this.isDirectory(ONLY_DIR_NAME)) {
      const only = await this.getAllSubfolder(
        join(this.options.path, ONLY_DIR_NAME)
      );
      const onlyFixtures = only.map(
        (path): T => this.getFixture(path, EFixtureType.only)
      );
      result = result.concat(onlyFixtures);
    }
    if (await this.isDirectory(SKIP_DIR_NAME)) {
      const ship = await this.getAllSubfolder(
        join(this.options.path, SKIP_DIR_NAME)
      );
      const shipFixtures = ship.map(
        (path): T => this.getFixture(path, EFixtureType.skip)
      );
      result = result.concat(shipFixtures);
    }
    const defaultPaths = await this.getAllSubfolder(
      this.options.path,
      (e) => ![ONLY_DIR_NAME, SKIP_DIR_NAME].includes(e)
    );
    const defaultFixtures = defaultPaths.map(
      (path): T => this.getFixture(path, EFixtureType.skip)
    );
    result = result.concat(defaultFixtures);
    return result;
  }

  public async getFixtures() {
    let result: T[] = [];
    if (await this.isDirectory(ONLY_DIR_NAME)) {
      const only = await this.getAllSubfolder(
        join(this.options.path, ONLY_DIR_NAME)
      );
      const onlyFixtures = only.map(
        (path): T => this.getFixture(path, EFixtureType.only)
      );
      result = result.concat(onlyFixtures);
    }
    if (result.length > 0) {
      return result;
    }
    const defaultPaths = await this.getAllSubfolder(
      this.options.path,
      (e) => ![ONLY_DIR_NAME, SKIP_DIR_NAME].includes(e)
    );
    const defaultFixtures = defaultPaths.map(
      (path): T => this.getFixture(path, EFixtureType.skip)
    );
    result = result.concat(defaultFixtures);
    return result;
  }

  private getFixture(path: string, type: EFixtureType) {
    const Fixture = (this.options.fixtureFactory ||
      BaseFixture) as IFixtureConstructor<T>;
    return new Fixture({
      path,
      type,
    });
  }

  private async isDirectory(dirname: string) {
    const dirPath = join(this.options.path, dirname);
    try {
      const dirStat = await stat(dirPath);
      return dirStat.isDirectory();
    } catch (error) {
      return false;
    }
  }

  private async getAllSubfolder(
    path: string,
    filter?: TGetAllSubfolderFiler
  ): Promise<string[]> {
    const folders = await readdir(path);
    const files = folders.map((o) => join(this.options.path, o));
    const allFiles = await Promise.all(
      files.map(
        async (o): Promise<string | null> => {
          if (filter && !filter(o)) {
            return null;
          }
          const fileStat = await stat(o);
          if (fileStat.isDirectory()) {
            return o;
          }
          return null;
        }
      )
    );
    return allFiles.filter((o): o is string => !!o);
  }
}
