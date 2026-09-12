import { test, expect } from "@playwright/test";
test("full onboarding, challenges, persistence, adaptive report, and reset", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await page
    .getByRole("button", { name: "Caltech California Institute" })
    .click();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Managing money", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByRole("button", { name: "Welcome to FirstTerm" }).click();
  await expect(
    page.getByRole("heading", { name: "Hey Maya, you’ve got this" }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: /Academic Independence The bad midterm/ })
    .click();
  await page
    .getByRole("button", { name: "Review the exam and categorize mistakes" })
    .click();
  await page
    .getByRole("button", {
      name: "Bring three conceptual questions to office hours",
    })
    .click();
  await page
    .getByRole("button", { name: "Reflect on how you studied" })
    .click();
  await page
    .getByRole("button", { name: "Form a study group and explain concepts" })
    .click();
  await page.getByRole("button", { name: "See my recovery plan" }).click();
  await expect(page.locator(".result-score")).toHaveText("95/100");
  await page.getByRole("button", { name: "See my progress" }).click();
  await expect(page.locator(".journal")).toContainText("95/100");
  await page
    .getByRole("button", { name: "Your missions", exact: true })
    .click();
  await page.getByRole("button", { name: /Build your first week/ }).click();
  await page.getByRole("button", { name: "Try a balanced plan" }).click();
  await page.getByRole("button", { name: "Evaluate my week" }).click();
  await expect(page.locator(".result-score")).toHaveText("100/100");
  await page
    .getByRole("button", { name: "Close mission", exact: true })
    .click();
  await page.getByRole("button", { name: /Find your support system/ }).click();
  for (const [i, name] of [
    "Caltech Tutoring & academic support",
    "Caltech Student health services",
    "Caltech Registrar",
  ].entries()) {
    await page
      .getByRole("button", { name: new RegExp(name.replace("&", "&")) })
      .click();
    await page
      .getByRole("button", {
        name: i === 2 ? "Finish resource hunt" : "Next situation",
      })
      .click();
  }
  await expect(page.locator(".result-score")).toHaveText("100/100");
  await page
    .getByRole("button", { name: "Close mission", exact: true })
    .click();
  await page.reload();
  const saved = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("firstterm.v1")!),
  );
  expect(saved.attempts).toHaveLength(3);
  expect(saved.mastery["Campus Navigation"]).toBe(39);
  await page
    .getByRole("button", { name: "Your missions", exact: true })
    .click();
  await expect(page.locator(".mission-card").first()).toContainText(
    "Press send with confidence",
  );
  await page
    .getByRole("button", { name: /Press send with confidence/ })
    .click();
  await page
    .getByRole("textbox", { name: "Email to Professor Chen" })
    .fill(
      "Dear Professor Chen, I have a chemistry lab during your office hours. I reviewed the notes and tried the practice problems, but I am stuck on applying the concept. Could we meet on Thursday before Friday? Thank you for your time.",
    );
  await page.getByRole("button", { name: "Evaluate draft" }).click();
  await expect(page.locator(".result-score")).toHaveText("100/100");
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Reset Demo" }).click();
  await expect(page.locator(".score-badge")).toHaveText("51/100");
  expect(errors).toEqual([]);
  await page.screenshot({
    path: "test-results/dashboard-desktop.png",
    fullPage: true,
  });
});
test("mobile onboarding and dashboard fit the viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Explore as Maya" }).click();
  await expect(
    page.getByRole("heading", { name: "Hey Maya, you’ve got this" }),
  ).toBeVisible();
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(390);
  await page.getByRole("button", { name: "Toggle menu" }).click();
  await page
    .getByRole("button", { name: "Readiness report", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Look how far you’re coming." }),
  ).toBeVisible();
  await page.screenshot({
    path: "test-results/report-mobile.png",
    fullPage: true,
  });
});
