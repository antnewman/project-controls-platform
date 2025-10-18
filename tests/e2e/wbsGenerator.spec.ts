import { test, expect } from '@playwright/test'

test.describe('WBS Generator E2E', () => {
  test('generates WBS from narrative', async ({ page }) => {
    await page.goto('/wbs-generator')

    await expect(page.locator('text=WBS Generator')).toBeVisible()

    // Enter project narrative
    await page.fill('textarea', 'Build a web application for project management')

    // Generate WBS
    await page.click('button:has-text("Generate")')

    // Wait for WBS to be generated
    await expect(page.locator('text=/Phase|Activity/')).toBeVisible({ timeout: 15000 })

    // Verify phases are shown
    const phases = page.locator('[data-testid="wbs-phase"]')
    await expect(phases.first()).toBeVisible()
  })

  test('validates empty narrative', async ({ page }) => {
    await page.goto('/wbs-generator')

    // Try to generate without narrative
    await page.click('button:has-text("Generate")')

    await expect(page.locator('text=/provide|narrative|required/i')).toBeVisible()
  })

  test('allows exporting WBS', async ({ page }) => {
    await page.goto('/wbs-generator')

    await page.fill('textarea', 'Build a mobile app')
    await page.click('button:has-text("Generate")')

    await expect(page.locator('text=/Phase/')).toBeVisible({ timeout: 15000 })

    // Export
    const downloadPromise = page.waitForEvent('download')
    await page.click('button:has-text("Export")')

    const download = await downloadPromise
    expect(download.suggestedFilename()).toMatch(/\.csv$/)
  })
})
