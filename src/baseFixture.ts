import { join } from "path";
import { IFixtureOptions, IFixture, EFixtureType } from "./type";
import fs from "fs";
import { promisify } from "util";

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

class BaseFixture implements IFixture {
  public type: EFixtureType;

  constructor(private options: IFixtureOptions) {
    this.type = this.options.type;
  }

  async readFile(path: string): Promise<string | null> {
    const filePath = join(this.options.path, path);
    try {
      const content = await readFile(filePath, "utf-8");
      return content;
    } catch (error) {
      return null;
    }
  }

  async readJSON<T>(path: string): Promise<T | null> {
    const file = await this.readFile(path);
    if (file) {
      return JSON.parse(file) as T;
    }
    return null;
  }

  async writeFile(path: string, content): Promise<void> {
    const filePath = join(this.options.path, path);
    await writeFile(filePath, content);
  }

  async writeJSON<T = any>(path: string, data: T): Promise<void> {
    const filePath = join(this.options.path, path);
    await writeFile(filePath, JSON.stringify(data));
  }
}

export { BaseFixture };
