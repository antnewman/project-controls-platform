import { test, expect } from '@playwright/test'

test.describe('Visual Regression @visual', () => {
  test('home page matches snapshot', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveScreenshot('home.png', { fullPage: true })
  })

  test('risk analysis page matches snapshot', async ({ page }) => {
    await page.goto('/risk-analysis')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveScreenshot('risk-analysis.png', { fullPage: true })
  })

  test('wbs generator page matches snapshot', async ({ page }) => {
    await page.goto('/wbs-generator')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveScreenshot('wbs-generator.png', { fullPage: true })
  })

  test('integrated workflow matches snapshot', async ({ page }) => {
    await page.goto('/integrated')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveScreenshot('integrated.png', { fullPage: true })
  })

  test('buttons have consistent styling', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const button = page.locator('button').first()
    await expect(button).toHaveScreenshot('button-primary.png')
  })

  test('mobile view matches snapshot', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveScreenshot('home-mobile.png', { fullPage: true })
  })

  test('tablet view matches snapshot', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveScreenshot('home-tablet.png', { fullPage: true })
  })
})
