import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test('navigates to home page', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('text=/Project Controls|Intelligence Platform/i')).toBeVisible()
  })

  test('navigates to risk analysis', async ({ page }) => {
    await page.goto('/')
    await page.click('text=Risk Analysis')
    await expect(page).toHaveURL(/\/risk-analysis/)
  })

  test('navigates to WBS generator', async ({ page }) => {
    await page.goto('/')
    await page.click('text=WBS Generator')
    await expect(page).toHaveURL(/\/wbs/)
  })

  test('navigates to integrated workflow', async ({ page }) => {
    await page.goto('/')
    await page.click('text=Integrated')
    await expect(page).toHaveURL(/\/integrated/)
  })

  test('displays 404 for invalid routes', async ({ page }) => {
    await page.goto('/non-existent-page')
    await expect(page.locator('text=/404|not found/i')).toBeVisible()
  })
})
