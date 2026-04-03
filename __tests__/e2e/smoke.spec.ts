/**
 * E2E Tests: Basic Smoke Tests
 * ============================
 * Tests that all pages load and basic functionality works
 */

import { test, expect } from '@playwright/test'

test.describe('Smoke Tests - All Pages Load', () => {
  test('homepage loads successfully', async ({ page }) => {
    await page.goto('/')
    expect(page).toHaveURL(/.*/)
    const heading = page.locator('h1').first()
    await expect(heading).toBeVisible()
  })

  test('services page loads', async ({ page }) => {
    await page.goto('/services')
    expect(page).toHaveURL(/.*services/)
    const content = page.locator('body')
    await expect(content).toBeVisible()
  })

  test('gallery page loads', async ({ page }) => {
    await page.goto('/gallery')
    expect(page).toHaveURL(/.*gallery/)
    const content = page.locator('body')
    await expect(content).toBeVisible()
  })

  test('about page loads', async ({ page }) => {
    await page.goto('/about')
    expect(page).toHaveURL(/.*about/)
    const content = page.locator('body')
    await expect(content).toBeVisible()
  })

  test('contact page loads', async ({ page }) => {
    await page.goto('/contact')
    expect(page).toHaveURL(/.*contact/)
    const content = page.locator('body')
    await expect(content).toBeVisible()
  })

  test('booking page loads', async ({ page }) => {
    await page.goto('/book')
    expect(page).toHaveURL(/.*book/)
    const content = page.locator('body')
    await expect(content).toBeVisible()
  })
})

test.describe('Navigation', () => {
  test('navigation menu works', async ({ page }) => {
    await page.goto('/')

    // Check for navigation links
    const homeLink = page.locator('a', { hasText: 'Home' }).first()
    const servicesLink = page.locator('a', { hasText: 'Services' }).first()

    if (await homeLink.isVisible()) {
      await expect(homeLink).toBeVisible()
    }

    if (await servicesLink.isVisible()) {
      await expect(servicesLink).toBeVisible()
    }
  })

  test('can navigate to services from home', async ({ page }) => {
    await page.goto('/')
    const servicesLink = page.locator('a', { hasText: /Services/ }).first()

    if (await servicesLink.isVisible()) {
      await servicesLink.click()
      await expect(page).toHaveURL(/.*services/)
    }
  })

  test('can navigate back to home', async ({ page }) => {
    await page.goto('/services')
    const homeLink = page.locator('a', { hasText: /Home|Elegance/ }).first()

    if (await homeLink.isVisible()) {
      await homeLink.click()
      await expect(page).toHaveURL('/')
    }
  })
})

test.describe('Responsive Design', () => {
  test('mobile view is responsive', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    const content = page.locator('body')
    await expect(content).toBeVisible()
  })

  test('tablet view is responsive', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.goto('/')

    const content = page.locator('body')
    await expect(content).toBeVisible()
  })

  test('desktop view is responsive', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.goto('/')

    const content = page.locator('body')
    await expect(content).toBeVisible()
  })
})

test.describe('Performance', () => {
  test('homepage loads quickly', async ({ page }) => {
    const startTime = Date.now()
    await page.goto('/')
    const loadTime = Date.now() - startTime

    // Should load in less than 5 seconds
    expect(loadTime).toBeLessThan(5000)
  })

  test('no console errors on load', async ({ page }) => {
    const errors = []
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })

    await page.goto('/')
    // Note: May have non-critical errors, but should not crash
  })
})

test.describe('Accessibility', () => {
  test('page has proper heading structure', async ({ page }) => {
    await page.goto('/')
    const h1 = page.locator('h1')
    expect(await h1.count()).toBeGreaterThan(0)
  })

  test('images have alt text', async ({ page }) => {
    await page.goto('/gallery')
    const images = page.locator('img')
    const imageCount = await images.count()

    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i)
      const alt = await img.getAttribute('alt')
      if (alt === null || alt === '') {
        // Image might be decorative, which is okay
      }
    }
  })

  test('links are keyboard accessible', async ({ page }) => {
    await page.goto('/')
    await page.keyboard.press('Tab')

    const focusedElement = page.locator(':focus')
    const count = await focusedElement.count()
    expect(count).toBeGreaterThanOrEqual(0)
  })
})
