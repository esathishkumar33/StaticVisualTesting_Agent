Build a modern, responsive Visual UI Testing Utility that allows users to validate one or more web applications by providing application URLs.

The application should support:

1. Single URL Validation
   - User enters one application URL.
   - The utility validates the application.
   - Generates a downloadable report.

2. Multiple URL Validation
   - User enters multiple URLs (one per line or uploads a CSV/TXT file).
   - The utility validates every application independently.
   - Generates separate reports as well as a consolidated summary report.

The validation engine should automatically verify the following:

UI Validation
-------------
- Verify every visible UI element is rendered correctly.
- Verify buttons are clickable.
- Verify input fields are editable.
- Verify dropdowns are expandable.
- Verify checkboxes and radio buttons are interactable.
- Verify modal dialogs open correctly.
- Verify tabs and accordions function correctly.
- Verify scrollable areas work properly.
- Verify disabled controls are intentionally disabled.
- Capture screenshots during execution.

Link Validation
---------------
- Validate all internal links.
- Validate all external links.
- Detect broken links.
- Detect redirects.
- Report HTTP status codes.
- Report timeout URLs.

Image Validation
----------------
- Verify every image loads successfully.
- Detect broken image URLs.
- Detect missing image resources.
- Detect placeholder images.
- Detect lazy-loaded images that never load.
- Verify image dimensions.
- Verify responsive image loading.

Text Validation
---------------
- Verify visible text is rendered.
- Detect missing text.
- Detect truncated text.
- Detect overlapping text.
- Detect hidden text.
- Detect empty labels.
- Verify fonts are loaded.
- Verify icon fonts are rendered correctly.

Responsive Testing
------------------
The utility should automatically validate the application across multiple device sizes including:

- Desktop
- Laptop
- Tablet
- Mobile Portrait
- Mobile Landscape

Example viewport sizes:

- 1920 × 1080
- 1440 × 900
- 1366 × 768
- 1024 × 768
- 820 × 1180
- 768 × 1024
- 430 × 932
- 390 × 844
- 375 × 812
- 360 × 800

The framework should allow adding more device profiles.

Visual Validation
-----------------
Capture screenshots for every page.

Compare screenshots against:
- Baseline images
OR
- Current rendering consistency

Highlight:
- Layout shifts
- Missing components
- Unexpected UI changes
- Broken alignment
- Overflow issues
- Responsive issues

Accessibility Validation
------------------------
Include accessibility checks:

- Missing alt text
- Missing labels
- Color contrast
- Keyboard navigation
- Focus visibility
- ARIA violations

Performance Checks
------------------
Measure:

- Page load time
- Largest Contentful Paint (LCP)
- First Contentful Paint (FCP)
- Cumulative Layout Shift (CLS)
- Time To Interactive (TTI)

Reporting
---------
Generate downloadable reports in:

- HTML
- PDF

Each report should include:

- Executive Summary
- Passed Tests
- Failed Tests
- Warning Items
- Device Tested
- Screenshots
- Broken Links
- Broken Images
- UI Issues
- Accessibility Issues
- Performance Metrics
- Timestamp
- Total Execution Time

Dashboard
---------
Provide a responsive dashboard showing:

- Total URLs Tested
- Passed
- Failed
- Running
- Progress
- Historical Reports
- Download Report Button

Technology Stack
----------------
Preferred Stack:

Frontend:
- React
- TypeScript
- Tailwind CSS

Backend:
- Node.js
- Express

Testing:
- Playwright

Accessibility:
- axe-core

Reporting:
- HTML
- PDF

Storage:
- SQLite (initially)
- Pluggable for PostgreSQL later

Architecture
------------
Follow a modular architecture.

Modules:

- UI
- Validation Engine
- Browser Manager
- Link Validator
- Image Validator
- Text Validator
- Accessibility Validator
- Responsive Validator
- Screenshot Manager
- Report Generator
- Device Manager
- API Layer

The application should be extensible, reusable, and support future AI-based visual comparison capabilities.