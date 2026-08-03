# AGENT.md

## Project

Visual UI Testing Utility

---

# Objective

Build a cross-platform Visual UI Testing Utility capable of validating one or multiple web applications using their URLs.

The utility should automatically inspect the UI, validate interactive elements, verify resources, perform responsive testing, generate reports, and provide a downloadable dashboard.

---

# Primary Goals

The agent should produce production-quality code that is:

- Modular
- Scalable
- Maintainable
- Testable
- Extensible

The project should follow clean architecture principles.

---

# Technology Stack

## Frontend

- React
- TypeScript
- TailwindCSS
- React Router
- React Query

---

## Backend

- Node.js
- Express
- TypeScript

---

## Browser Automation

Playwright

Supported browsers:

- Chromium
- Firefox
- WebKit

---

## Validation Libraries

Accessibility

- axe-core

Performance

- Lighthouse (optional)
- Playwright Metrics

Reporting

- Handlebars
- Puppeteer PDF

Storage

- SQLite

Future support

- PostgreSQL

---

# Core Features

## 1. URL Management

Support:

- Single URL
- Multiple URLs
- CSV Upload
- TXT Upload

Validate URLs before execution.

---

## 2. UI Validation

Validate:

Buttons

Input fields

Dropdowns

Checkboxes

Radio buttons

Links

Cards

Dialogs

Tabs

Accordion

Navigation

Tables

Forms

Menus

Icons

SVGs

Canvas elements

Shadow DOM components

Verify:

✔ Visible

✔ Enabled

✔ Clickable

✔ Editable

✔ Rendered

✔ Responsive

Capture screenshots.

---

## 3. Link Validation

Validate:

Internal links

External links

Broken links

Redirects

HTTP status

Timeouts

Duplicate links

---

## 4. Image Validation

Validate:

Broken images

404 images

Placeholder images

Lazy-loaded images

SVG images

Responsive images

Image dimensions

Missing images

---

## 5. Text Validation

Verify:

Missing text

Hidden text

Overflow

Text clipping

Wrong font

Empty labels

Missing headings

Broken icon fonts

---

## 6. Responsive Validation

Validate on:

Desktop

Laptop

Tablet

Mobile Portrait

Mobile Landscape

Default devices:

1920x1080

1440x900

1366x768

1024x768

820x1180

768x1024

430x932

390x844

375x812

360x800

---

## 7. Accessibility Validation

Run axe-core.

Report:

ARIA issues

Contrast issues

Missing labels

Keyboard navigation

Focus order

Alt text

Landmarks

Semantic HTML

---

## 8. Performance Validation

Collect:

Page Load

FCP

LCP

CLS

TTI

Memory usage

Network requests

Console errors

JavaScript errors

---

## 9. Screenshot Manager

Capture:

Home page

Each route

Each viewport

Failure screenshots

Store using:

Execution ID

Timestamp

URL

Device

---

## 10. Visual Comparison

Support:

Baseline images

Pixel comparison

Layout comparison

AI comparison (future)

Highlight:

Layout shifts

Missing controls

Unexpected UI changes

Overflow

Alignment issues

---

# Reporting

Generate:

HTML

PDF

Each report should include:

Executive Summary

Execution Time

Device

Browser

Screenshots

Passed Tests

Failed Tests

Warnings

Broken Links

Broken Images

Accessibility

Performance

Console Errors

Recommendations

Charts

Download Button

---

# Dashboard

Dashboard should display:

Recent executions

Running executions

History

Pass %

Fail %

Charts

Search

Filters

Download reports

Delete reports

---

# API Endpoints

POST /validate

POST /validate/bulk

GET /reports

GET /report/:id

GET /devices

GET /history

DELETE /report/:id

---

# Folder Structure

src/

frontend/

backend/

engine/

validators/

ui-validator/

link-validator/

image-validator/

text-validator/

responsive-validator/

accessibility-validator/

performance-validator/

browser/

reports/

screenshots/

storage/

config/

shared/

---

# Coding Standards

Use:

TypeScript

ESLint

Prettier

SOLID principles

Dependency Injection where appropriate

Avoid duplicate logic.

Keep functions under 50 lines where possible.

Write reusable components.

---

# Logging

Log:

Execution start

Execution end

Failures

Warnings

Errors

Browser crashes

Timeouts

---

# Error Handling

Gracefully recover from:

Invalid URL

Browser crash

Navigation timeout

Network timeout

Unexpected popup

Authentication redirect

JavaScript errors

---

# Future Enhancements

Support authentication

OAuth login

API testing

AI visual comparison

CI/CD integration

Jenkins

Azure DevOps

GitHub Actions

Slack notifications

Teams notifications

Email reports

Scheduling

Docker deployment

Kubernetes deployment

Cloud storage

Multi-user authentication

Role-based access

Historical analytics

Trend reports

Self-healing locators

AI-generated defect summaries

AI-powered root cause analysis

---

# Success Criteria

A successful execution should:

✓ Accept one or multiple URLs

✓ Execute validation automatically

✓ Validate all UI components

✓ Validate links

✓ Validate images

✓ Validate text

✓ Validate responsiveness

✓ Run accessibility checks

✓ Capture screenshots

✓ Generate HTML report

✓ Generate PDF report

✓ Display downloadable reports

✓ Store execution history

✓ Be responsive on desktop, tablet, and mobile

✓ Be easy to extend with additional validators