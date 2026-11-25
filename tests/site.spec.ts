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

test("the dots of the background timeline sit exactly on their line", async ({ page }) => {
  await page.goto("/");
  const offsets = await page.locator(".bg li").evaluateAll((items) => items.map((li) => {
    const r = li.getBoundingClientRect(), cs = getComputedStyle(li), dot = getComputedStyle(li, "::before");
    const vertical = parseFloat(cs.borderLeftWidth) > 0; // phones: line on the left; desktop: line on top
    const line = vertical ? r.left + parseFloat(cs.borderLeftWidth) / 2 : r.top + parseFloat(cs.borderTopWidth) / 2;
    const start = vertical ? r.left + parseFloat(cs.borderLeftWidth) + parseFloat(dot.left) : r.top + parseFloat(cs.borderTopWidth) + parseFloat(dot.top);
    // Real size of the dot, including its border.
    const extra = dot.boxSizing === "content-box" ? 2 * parseFloat(dot.borderTopWidth) : 0;
    const size = parseFloat(vertical ? dot.width : dot.height) + extra;
    return Math.abs(start + size / 2 - line);
  }));
  expect(offsets).toHaveLength(3);
  for (const o of offsets) expect(o).toBeLessThanOrEqual(0.5);
});

test("the Contact me section has email, LinkedIn and GitHub", async ({ page }) => {
  await page.goto("/");
  const contact = page.locator("#contact");
  await expect(contact).toContainText("Contact me");
  await expect(contact.getByRole("link", { name: "Email", exact: true })).toHaveAttribute("href", "mailto:hello@laura-winkler.com");
  await expect(contact.getByRole("link", { name: "LinkedIn" })).toHaveAttribute("href", /linkedin\.com\/in\/laura-winkler-dev/);
  await expect(contact.getByRole("link", { name: "GitHub" })).toHaveAttribute("href", /github\.com\/WinklerLaura/);
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

  test("status: 'from early 2027' only wraps when it has to, 'Vienna · Hybrid' goes below", async ({ page }) => {
    await page.goto("/");
    const tops = await page.evaluate(() => {
      const nws = [...document.querySelectorAll(".status-lines .nw")];
      const box = (txt: string) => nws.find((e) => e.textContent!.includes(txt))!.getBoundingClientRect();
      const r = document.createRange();
      const place = [...document.querySelector(".status-lines .s2")!.childNodes].find((n) => n.nodeType === 3 && n.textContent!.includes("Vienna"))!;
      r.selectNodeContents(place);
      const open = box("Open to new roles"), when = box("from early 2027");
      const right = document.querySelector(".status-lines")!.getBoundingClientRect().right;
      return { open: open.top, when: when.top, room: right - open.right, need: when.width, place: r.getBoundingClientRect().top };
    });
    // if "from early 2027" is on a new line, it really didn't fit behind "Open to new roles"
    if (tops.when > tops.open + 3) expect(tops.room).toBeLessThan(tops.need + 5);
    expect(tops.place).toBeGreaterThan(tops.when + 5);
  });

  test("the section buttons stay pinned at the top while scrolling", async ({ page }) => {
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Sections" });
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    await page.waitForTimeout(300);
    const box = (await nav.boundingBox())!;
    expect(Math.round(box.y)).toBe(0);
    await expect(nav.getByRole("link", { name: "Contact" })).toBeInViewport();
  });

  test("only the project on screen plays its images, and it starts right away", async ({ page }) => {
    await page.goto("/");
    const third = page.locator(".project.tile").nth(2);
    await third.evaluate((el) => el.scrollIntoView({ block: "center" }));
    await expect.poll(() => slideIndex(page, 2), { timeout: 2_000 }).toBeGreaterThan(0);
    expect(await slideIndex(page, 0)).toBe(0);
  });

  test("the sections are not too far apart", async ({ page }) => {
    await page.goto("/");
    const about = (await page.locator(".lead section").first().boundingBox())!;
    const projects = (await page.locator("#projects").boundingBox())!;
    expect(projects.y - (about.y + about.height)).toBeLessThanOrEqual(60);
  });
});
