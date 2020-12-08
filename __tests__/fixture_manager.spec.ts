import { FixtureManager, BaseFixture } from "../src";
import { join } from "path";

describe("test FixtureManager", () => {
  const fixturesRoot = join(__dirname, "../fixtures/fixtures-manager");
  const fixtureManager = new FixtureManager({
    path: fixturesRoot,
  });
  it("test getAllFixtures", async () => {
    const fixtures = await fixtureManager.getAllFixtures();
    expect(fixtures.length).toBe(4);
  });
  it("test getFixtures", async () => {
    const fixtures = await fixtureManager.getFixtures();
    expect(fixtures.length).toBe(2);
  });

  it("test fixtureFactory", async () => {
    class JSFixture extends BaseFixture {
      requireFile(fileName: string) {
        const file = join(this.options.path, fileName);
        return require(file);
      }
    }
    const jsFixtureManager = new FixtureManager<JSFixture>({
      path: fixturesRoot,
      fixtureFactory: JSFixture,
    });
    const fixture = (await jsFixtureManager.get("c"))!;
    expect(fixture.requireFile("c.js")).toEqual({ c: "c" });
  });

  describe("test base fixture", () => {
    it("test readJSON", async () => {
      const fixtureA = (await fixtureManager.get("a"))!;
      expect(await fixtureA.readJSON("a.json")).toEqual({ name: "a" });
    });
    it("test readFile", async () => {
      const fixtureB = (await fixtureManager.get("b"))!;
      expect(await fixtureB.readFile("b.md")).toEqual("b\n");
    });
  });
});
