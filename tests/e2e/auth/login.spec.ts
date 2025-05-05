import { test, expect } from "@playwright/test";

test.describe("Login Page", () => {
  test.beforeEach(async ({ page }) => {
    // Go to the login page
    await page.goto("/login");
  });

  test("should display login form", async ({ page }) => {
    // Check that the login form is visible
    await expect(page.getByRole("heading", { name: "Login" })).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();
    await expect(page.getByRole("button", { name: "Login" })).toBeVisible();
  });

  test("should show error for invalid credentials", async ({ page }) => {
    // Mock the API response for failed login
    await page.route("**/auth/login", async (route) => {
      await route.fulfill({
        status: 401,
        contentType: "application/json",
        body: JSON.stringify({ message: "Invalid credentials" }),
      });
    });

    // Fill in the form
    await page.getByLabel("Email").fill("wrong@example.com");
    await page.getByLabel("Password").fill("wrongpassword");
    await page.getByRole("button", { name: "Login" }).click();

    // Check that the error is displayed
    await expect(page.getByText("Invalid credentials")).toBeVisible();
  });

  test("should redirect after successful login", async ({ page }) => {
    // Mock the API response for successful login
    await page.route("**/auth/login", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          user: {
            id: "1",
            email: "test@example.com",
            name: "Test User",
          },
          token: "fake-jwt-token",
        }),
      });
    });

    // Fill in the form
    await page.getByLabel("Email").fill("test@example.com");
    await page.getByLabel("Password").fill("password");
    await page.getByRole("button", { name: "Login" }).click();

    // Check redirection to dashboard
    await expect(page).toHaveURL("/dashboard");

    // Verify that we show the user's name somewhere on the dashboard
    await expect(page.getByText("Test User")).toBeVisible();
  });
});
