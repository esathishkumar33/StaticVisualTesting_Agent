# Visual Testing Utility

A cross-platform Visual UI Testing Utility for validating web applications with comprehensive reporting and analytics.

## Features

- 🌐 **URL Management**: Single or batch URL validation
- 🎨 **UI Validation**: Comprehensive component validation
- 🔗 **Link Validation**: Check internal and external links
- 🖼️ **Image Validation**: Verify all images load correctly
- 📱 **Responsive Testing**: Test across multiple devices
- ♿ **Accessibility Audit**: Using axe-core for WCAG compliance
- 📊 **Performance Metrics**: Collect FCP, LCP, CLS, TTI
- 📸 **Screenshot Management**: Capture and store screenshots
- 📄 **Report Generation**: HTML and PDF reports
- 📈 **Dashboard**: View execution history and analytics

## Technology Stack

### Frontend
- React 18+
- TypeScript
- TailwindCSS
- React Router
- React Query

### Backend
- Node.js + Express
- TypeScript
- Playwright (Browser Automation)
- axe-core (Accessibility)
- SQLite (Data Storage)

## Project Structure

```
.
├── frontend/           # React + TypeScript UI
├── backend/            # Express + TypeScript API
├── shared/             # Shared types and utilities
└── .github/            # Configuration and documentation
```

## Quick Start

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

1. **Clone or navigate to the project:**
```bash
cd VisualTesting_Static
```

2. **Install dependencies for all packages:**
```bash
npm run install-all
```

This will install dependencies for:
- Root package (concurrently)
- Frontend (React, TypeScript, etc.)
- Backend (Express, Playwright, etc.)

### Development

**Run both frontend and backend concurrently:**
```bash
npm run dev
```

**Or run separately:**

Backend (API Server):
```bash
npm run backend:dev
# Server runs on http://localhost:5000
```

Frontend (React App):
```bash
npm run frontend:dev
# App runs on http://localhost:5173
```

### Build

Build both frontend and backend:
```bash
npm run build
```

### Production

Run production build:
```bash
npm start
```

## API Endpoints

### Validation
- `POST /validate` - Start validation
- `POST /validate/bulk` - Bulk validation from file
- `GET /validate/:executionId` - Get validation status

### Reports
- `GET /reports` - List reports
- `GET /reports/:reportId` - Get specific report
- `GET /reports/:reportId/download` - Download report
- `DELETE /reports/:reportId` - Delete report

### Devices
- `GET /devices` - List all devices
- `GET /devices/:name` - Get specific device

### Health
- `GET /health` - Health check

## Supported Test Devices

- Desktop (1920x1080)
- Laptop (1440x900)
- Large Tablet (1366x768)
- Tablet (1024x768, 768x1024)
- iPad (820x1180)
- Mobile (390x844, 375x812, 360x800, 430x932)

## Configuration

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000
```

### Backend (.env)
```
PORT=5000
NODE_ENV=development
DATABASE_PATH=./data/database.db
```

## Scripts

### Root Level
- `npm run install-all` - Install all dependencies
- `npm run dev` - Run dev servers (frontend + backend)
- `npm run build` - Build both packages
- `npm start` - Start production server

### Frontend
- `npm run dev --prefix frontend` - Start dev server
- `npm run build --prefix frontend` - Build production
- `npm run lint --prefix frontend` - Run ESLint
- `npm run type-check --prefix frontend` - TypeScript check

### Backend
- `npm run dev --prefix backend` - Start dev server
- `npm run build --prefix backend` - Build production
- `npm run lint --prefix backend` - Run ESLint
- `npm run type-check --prefix backend` - TypeScript check

## Validation Options

- ✓ UI Component Validation
- ✓ Link Validation (internal/external)
- ✓ Image Validation
- ✓ Text Validation
- ✓ Responsive Testing
- ✓ Accessibility Audit (axe-core)
- ✓ Performance Metrics
- ✓ Screenshot Capture

## Report Formats

- HTML (Interactive)
- PDF (Downloadable)

## Future Enhancements

- AI-powered visual comparison
- CI/CD integration (Jenkins, Azure DevOps, GitHub Actions)
- Multi-user authentication
- Role-based access control
- Historical analytics and trend reports
- Self-healing locators
- API testing capabilities
- Slack/Teams notifications
- Email report delivery
- Docker/Kubernetes deployment

## Development Guidelines

### Code Standards
- TypeScript strict mode
- ESLint for code quality
- Prettier for code formatting
- SOLID principles
- DRY (Don't Repeat Yourself)
- Keep functions under 50 lines

### Commit Style
```
<type>(<scope>): <subject>
<blank line>
<body>
```

## Troubleshooting

### Port Already in Use
If port 5000 is already in use, update `.env` in backend folder:
```
PORT=5001
```

### Dependencies Issues
Clear node_modules and reinstall:
```bash
rm -rf frontend/node_modules backend/node_modules node_modules
npm run install-all
```

### Build Errors
Ensure TypeScript is properly configured:
```bash
npm run type-check --prefix backend
npm run type-check --prefix frontend
```

## License

MIT

## Support

For issues, questions, or contributions, please create an issue in the GitHub repository.

---

**Happy Testing! 🚀**
