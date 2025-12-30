import { expect, test } from "@playwright/test";

test.describe("Persistence & Offline", () => {
  test("should create a habit, toggle it, and persist everything after reload", async ({
    page,
  }) => {
    // 1. Initial Load
    await page.goto("/");

    // 2. Add Habit
    // Open Dialog via FAB
    await page.locator("button:has(svg.lucide-plus)").click();

    const habitName = `Habit ${Date.now()}`;
    await page.getByLabel("Habit Title").fill(habitName);

    // Save
    await page.getByRole("button", { name: "Save" }).click();

    // Verify habit is displayed
    await expect(page.getByText(habitName)).toBeVisible();

    // 3. Toggle a check
    // We assume the first check cell corresponds to this habit (since it's the only one or at least present)
    // We target checks by their distinctive class/size from CheckCell.tsx
    const checkButtons = page.locator("button.h-8.w-8");

    // Wait for at least one button to be present (rows might load async if heavy, but here it's fast)
    await expect(checkButtons.first()).toBeVisible();

    const firstCheckButton = checkButtons.first();

    // Click to toggle on
    await firstCheckButton.click();

    // Verify it shows the check icon
    await expect(firstCheckButton.locator("svg.lucide-check")).toBeVisible();

    // 4. Reload page
    await page.reload();

    // 5. Verify persistence
    await expect(page.getByText(habitName)).toBeVisible();

    // The checks should also persist
    // Re-locate the elements as DOM is refreshed
    const checkButtonsReloaded = page.locator("button.h-8.w-8");
    await expect(
      checkButtonsReloaded.first().locator("svg.lucide-check"),
    ).toBeVisible();
  });

  test("should allow interaction when offline", async ({ page, context }) => {
    await page.goto("/");

    // Ensure we have at least one habit to interact with, or create one if empty
    // To make test independent, we create one.
    await page.locator("button:has(svg.lucide-plus)").click();
    await page.getByLabel("Habit Title").fill("Offline Habit");
    await page.getByRole("button", { name: "Save" }).click();
    await expect(page.getByText("Offline Habit")).toBeVisible();

    // Go Offline
    await context.setOffline(true);

    // Toggle a check
    const checkButtons = page.locator("button.h-8.w-8");
    const targetButton = checkButtons.last(); // Use last to avoid conflict with previous test if state leaked (shouldn't) or logic

    await targetButton.click();
    await expect(targetButton.locator("svg.lucide-check")).toBeVisible();

    // Note: We cannot fully test reloading while offline in this simple setup unless Service Worker is perfectly cached and serving.
    // This verifies that the UI and Logic (likely IndexedDB) don't crash when offline.
  });
});
