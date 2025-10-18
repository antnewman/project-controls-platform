import { test, expect } from '@playwright/test'

test.describe('Risk Analysis E2E', () => {
  test('complete risk analysis workflow', async ({ page }) => {
    await page.goto('/risk-analysis')

    // Step 1: Upload CSV
    await expect(page.locator('text=Risk Analysis')).toBeVisible()

    const fileContent = 'description,mitigation,probability,impact\n"Test risk","Test mitigation",3,4'
    await page.setInputFiles('input[type="file"]', {
      name: 'risks.csv',
      mimeType: 'text/csv',
      buffer: Buffer.from(fileContent)
    })

    // Wait for file to be processed
    await expect(page.locator('text=Test risk')).toBeVisible({ timeout: 5000 })

    // Step 2: Continue to heuristics
    await page.click('button:has-text("Continue")')

    // Step 3: Select heuristics
    await expect(page.locator('text=Select Heuristics')).toBeVisible()

    // Select at least one heuristic
    await page.click('input[type="checkbox"]')

    // Step 4: Analyze risks
    await page.click('button:has-text("Analyze")')

    // Wait for analysis results
    await expect(page.locator('text=/Quality Score|Results/')).toBeVisible({ timeout: 15000 })

    // Verify results are shown
    await expect(page.locator('text=/\\/10|Score/')).toBeVisible()
  })

  test('handles invalid CSV gracefully', async ({ page }) => {
    await page.goto('/risk-analysis')

    const invalidContent = 'wrong,headers\ndata,data'
    await page.setInputFiles('input[type="file"]', {
      name: 'invalid.csv',
      mimeType: 'text/csv',
      buffer: Buffer.from(invalidContent)
    })

    await expect(page.locator('text=/error|invalid|missing|required/i')).toBeVisible({ timeout: 5000 })
  })

  test('allows navigation back to previous steps', async ({ page }) => {
    await page.goto('/risk-analysis')

    const fileContent = 'description,mitigation,probability,impact\n"Risk","Mitigation",3,4'
    await page.setInputFiles('input[type="file"]', {
      name: 'risks.csv',
      mimeType: 'text/csv',
      buffer: Buffer.from(fileContent)
    })

    await page.click('button:has-text("Continue")')
    await expect(page.locator('text=Select Heuristics')).toBeVisible()

    // Go back
    await page.click('button:has-text("Back")')
    await expect(page.locator('input[type="file"]')).toBeVisible()
  })
})
