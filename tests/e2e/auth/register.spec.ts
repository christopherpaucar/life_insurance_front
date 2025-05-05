import { test, expect } from "@playwright/test";

test.describe("Registration Page", () => {
  test.beforeEach(async ({ page }) => {
    // Go to the registration page
    await page.goto("/register");
  });

  test("should display registration form", async ({ page }) => {
    // Check that the registration form is visible
    await expect(page.getByRole("heading", { name: "Register" })).toBeVisible();
    await expect(page.getByLabel("Name")).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();
    await expect(page.getByRole("button", { name: "Register" })).toBeVisible();
  });

  test("should show error for existing email", async ({ page }) => {
    // Mock the API response for failed registration
    await page.route("**/auth/register", async (route) => {
      await route.fulfill({
        status: 400,
        contentType: "application/json",
        body: JSON.stringify({ message: "Email already exists" }),
      });
    });

    // Fill in the form
    await page.getByLabel("Name").fill("Test User");
    await page.getByLabel("Email").fill("existing@example.com");
    await page.getByLabel("Password").fill("password123");
    await page.getByRole("button", { name: "Register" }).click();

    // Check that the error is displayed
    await expect(page.getByText("Email already exists")).toBeVisible();
  });

  test("should redirect after successful registration", async ({ page }) => {
    // Mock the API response for successful registration
    await page.route("**/auth/register", async (route) => {
      await route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify({
          user: {
            id: "1",
            email: "new@example.com",
            name: "New User",
          },
          token: "fake-jwt-token",
        }),
      });
    });

    // Fill in the form
    await page.getByLabel("Name").fill("New User");
    await page.getByLabel("Email").fill("new@example.com");
    await page.getByLabel("Password").fill("password123");
    await page.getByRole("button", { name: "Register" }).click();

    // Check redirection to dashboard
    await expect(page).toHaveURL("/dashboard");

    // Verify that we show the user's name somewhere on the dashboard
    await expect(page.getByText("New User")).toBeVisible();
  });

  test("should validate form fields", async ({ page }) => {
    // Click register without filling anything
    await page.getByRole("button", { name: "Register" }).click();

    // Check validation messages
    await expect(page.getByText("Email is required")).toBeVisible();
    await expect(page.getByText("Password is required")).toBeVisible();

    // Fill invalid email
    await page.getByLabel("Email").fill("not-an-email");
    await page.getByRole("button", { name: "Register" }).click();

    // Check email validation message
    await expect(page.getByText("Please enter a valid email")).toBeVisible();

    // Fill short password
    await page.getByLabel("Email").fill("valid@example.com");
    await page.getByLabel("Password").fill("short");
    await page.getByRole("button", { name: "Register" }).click();

    // Check password validation message
    await expect(
      page.getByText("Password must be at least 8 characters")
    ).toBeVisible();
  });
});
