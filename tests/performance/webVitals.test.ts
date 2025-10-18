import { test, expect } from '@playwright/test'

test.describe('Core Web Vitals', () => {
  test('measures page load performance', async ({ page }) => {
    await page.goto('/')

    const navigationTiming = await page.evaluate(() => {
      const perfData = window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      return {
        domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
        loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
        domInteractive: perfData.domInteractive - perfData.fetchStart
      }
    })

    expect(navigationTiming.domInteractive).toBeLessThan(3000)
    expect(navigationTiming.domContentLoaded).toBeLessThan(5000)
  })

  test('First Contentful Paint < 2s', async ({ page }) => {
    await page.goto('/')

    const fcp = await page.evaluate(() => {
      return new Promise<number>((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint')
          if (fcpEntry) {
            resolve(fcpEntry.startTime)
          }
        }).observe({ entryTypes: ['paint'] })

        // Timeout after 5 seconds
        setTimeout(() => resolve(5000), 5000)
      })
    })

    expect(fcp).toBeLessThan(2000)
  })

  test('Largest Contentful Paint < 2.5s', async ({ page }) => {
    await page.goto('/')

    const lcp = await page.evaluate(() => {
      return new Promise<number>((resolve) => {
        let lcpValue = 0

        new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const lastEntry = entries[entries.length - 1] as PerformanceEntry
          lcpValue = lastEntry.startTime
        }).observe({ entryTypes: ['largest-contentful-paint'] })

        // Wait for page load
        window.addEventListener('load', () => {
          setTimeout(() => resolve(lcpValue), 1000)
        })

        // Timeout
        setTimeout(() => resolve(lcpValue || 5000), 6000)
      })
    })

    expect(lcp).toBeLessThan(2500)
  })

  test('Cumulative Layout Shift < 0.1', async ({ page }) => {
    await page.goto('/')

    const cls = await page.evaluate(() => {
      return new Promise<number>((resolve) => {
        let clsValue = 0

        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value
            }
          }
        }).observe({ entryTypes: ['layout-shift'] })

        window.addEventListener('load', () => {
          setTimeout(() => resolve(clsValue), 2000)
        })

        setTimeout(() => resolve(clsValue), 5000)
      })
    })

    expect(cls).toBeLessThan(0.1)
  })

  test('Time to Interactive < 5s', async ({ page }) => {
    await page.goto('/')

    const tti = await page.evaluate(() => {
      return new Promise<number>((resolve) => {
        let timeToInteractive = 0

        window.addEventListener('load', () => {
          timeToInteractive = performance.now()
          resolve(timeToInteractive)
        })

        setTimeout(() => resolve(performance.now()), 6000)
      })
    })

    expect(tti).toBeLessThan(5000)
  })
})
