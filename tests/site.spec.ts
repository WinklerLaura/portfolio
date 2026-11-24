import { test, expect, type Page } from "@playwright/test";

// Which image is showing on a project tile (0 = cover).
const slideIndex = (page: Page, tile: number) =>
  page.locator(".project.tile").nth(tile).locator(".dots i").evaluateAll((dots) => dots.findIndex((d) => d.classList.contains("on")));

test("the page loads without errors and shows name and all projects", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  await page.goto("/");
  await expect(page.locator("h1")).toContainText("Laura");
  await expect(page.locator("h1")).toContainText("Winkler");
  await expect(page.locator(".project.tile")).toHaveCount(4);
  await expect(page.locator(".hero img")).toBeVisible();
  expect(errors).toEqual([]);
});

test("nothing is loaded from other websites (no Google, no tracking)", async ({ page }) => {
  const external: string[] = [];
  page.on("request", (r) => {
    const u = new URL(r.url());
    if (u.protocol.startsWith("http") && u.hostname !== "localhost") external.push(r.url());
  });
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  expect(external).toEqual([]);
});

test("every image, video and document on the page exists", async ({ page }) => {
  await page.goto("/");
  const paths = await page.evaluate(() => {
    const list = [
      ...Array.from(document.querySelectorAll("img"), (e) => e.getAttribute("src")),
      ...Array.from(document.querySelectorAll("video"), (e) => e.getAttribute("src")),
      ...Array.from(document.querySelectorAll("video"), (e) => e.getAttribute("poster")),
      ...Array.from(document.querySelectorAll("a"), (e) => e.getAttribute("href")),
      ...Array.from(document.querySelectorAll("link[rel*=icon]"), (e) => e.getAttribute("href")),
    ];
    return [...new Set(list.filter((p): p is string => !!p && p.startsWith("/")))];
  });
  expect(paths.length).toBeGreaterThan(5);
  for (const p of paths) {
    const res = await page.request.get(p);
    expect(res.status(), p).toBe(200);
  }
});

test("imprint and privacy are linked in the footer and contain the contact address", async ({ page }) => {
  await page.goto("/");
  for (const name of ["Imprint", "Privacy"]) {
    const link = page.locator("footer").getByRole("link", { name, exact: true });
    await expect(link).toHaveCount(1);
    const res = await page.request.get((await link.getAttribute("href"))!);
    expect(res.status()).toBe(200);
    expect(await res.text()).toContain("hello@laura-winkler.com");
  }
});

test("the texts start below the header image, not on top of it", async ({ page }) => {
  await page.goto("/");
  const hero = (await page.locator(".hero").boundingBox())!;
  for (const sel of [".intro .label", "#projects .label"]) {
    const box = (await page.locator(sel).first().boundingBox())!;
    expect(box.y, sel).toBeGreaterThanOrEqual(hero.y + hero.height);
  }
});

test("a project opens in a detail view and closes again", async ({ page }) => {
  await page.goto("/");
  await page.locator(".project.tile").first().click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText("cogvisAI");
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
});

test.describe("on phones", () => {
  test.beforeEach(({ isMobile }) => test.skip(!isMobile, "phone only"));

  test("the 'Show me more' button stays the same when a tile is touched or scrolled over", async ({ page }) => {
    await page.goto("/");
    const tile = page.locator(".project.tile").nth(1);
    await tile.scrollIntoViewIfNeeded();
    const cta = tile.locator(".cta");
    const look = () => cta.evaluate((el) => {
      const s = getComputedStyle(el), t = el.parentElement!.getBoundingClientRect(), b = el.getBoundingClientRect();
      return { opacity: s.opacity, right: Math.round(t.right - b.right), bottom: Math.round(t.bottom - b.bottom) };
    });
    const before = await look();
    expect(before.opacity).toBe("1");
    await tile.hover();
    await page.mouse.wheel(0, 120);
    await page.waitForTimeout(500);
    expect(await look()).toEqual(before);
  });

  test("only the project on screen plays its images", async ({ page }) => {
    await page.goto("/");
    const third = page.locator(".project.tile").nth(2);
    await third.evaluate((el) => el.scrollIntoView({ block: "center" }));
    await expect.poll(() => slideIndex(page, 2), { timeout: 10_000 }).toBeGreaterThan(0);
    expect(await slideIndex(page, 0)).toBe(0);
  });
});
