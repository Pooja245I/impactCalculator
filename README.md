# Fee Impact Calculator

A comprehensive full-stack web application that helps investors understand and optimize investment fee structures by comparing multiple fee scenarios and visualizing their long-term impact on portfolio growth.

![Fee Impact Calculator](https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop)

## 🚀 Features

### Core Functionality
- **Multi-Scenario Comparison**: Compare 2-5 different fee structures simultaneously
- **Long-term Growth Visualization**: Interactive charts showing portfolio growth over 1-50 years
- **Optimization Recommendations**: AI-powered suggestions for fee optimization
- **Tax-Adjusted Calculations**: Includes marginal tax rate considerations
- **Real-time Calculations**: Instant updates as you modify parameters

### Technical Highlights
- **Full-Stack Architecture**: React frontend with Node.js/Express backend
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Accessibility Compliant**: WCAG 2.1 AA standards with keyboard navigation
- **Colorblind-Friendly**: Carefully selected color palette for inclusivity
- **Production-Ready**: Comprehensive error handling and input validation

## 🛠 Technology Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Chart.js** with react-chartjs-2 for visualizations
- **Lucide React** for icons
- **Vite** for development and building

### Backend
- **Node.js** with Express
- **CORS** for cross-origin requests
- **Helmet** for security headers
- **Morgan** for logging
- **Compression** for response optimization

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Quick Start

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd fee-impact-calculator
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   ```

3. **Start Development Servers**
   ```bash
   # Start both frontend and backend
   npm run dev:full
   
   # Or start individually:
   npm run server  # Backend on port 3001
   npm run dev     # Frontend on port 5173
   ```

4. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001
   - Health Check: http://localhost:3001/health

## 🏗 Project Structure

```
fee-impact-calculator/
├── src/                          # Frontend React application
│   ├── components/               # React components
│   │   ├── FeeComparisonForm.tsx # Input form with validation
│   │   ├── GrowthChart.tsx       # Interactive chart component
│   │   ├── OptimizationSuggestions.tsx # Recommendations display
│   │   └── LoadingSpinner.tsx    # Loading state component
│   ├── types/                    # TypeScript type definitions
│   ├── utils/                    # Utility functions
│   │   ├── api.ts               # API client functions
│   │   └── formatters.ts        # Data formatting utilities
│   ├── App.tsx                  # Main application component
│   └── main.tsx                 # Application entry point
├── server/                      # Backend Node.js application
│   ├── routes/                  # API route handlers
│   │   └── calculations.js      # Calculation endpoints
│   ├── utils/                   # Server utilities
│   │   ├── calculations.js      # Financial calculation logic
│   │   └── validation.js        # Input validation
│   └── index.js                 # Server entry point
├── public/                      # Static assets
└── package.json                 # Dependencies and scripts
```

## 🔧 API Endpoints

### POST /api/calculate
Calculate growth scenarios for different fee structures.

**Request Body:**
```json
{
  "initialInvestment": 10000,
  "monthlyContribution": 500,
  "annualReturnRate": 7,
  "feeStructures": [0.5, 1.0, 1.5],
  "marginalTaxRate": 22,
  "timeHorizonYears": 25
}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "finalBalance": 587234.56,
      "totalContributions": 160000,
      "totalFeesPaid": 15234.78,
      "netGains": 427234.56,
      "feeRate": 0.5,
      "feeLabel": "0.5% Fee",
      "yearlyData": [...]
    }
  ]
}
```

### POST /api/optimize
Get optimization recommendations and best/worst scenario analysis.

**Request Body:** Same as `/api/calculate`

**Response:**
```json
{
  "success": true,
  "data": {
    "bestScenario": {...},
    "worstScenario": {...},
    "potentialSavings": 45678.90,
    "feeSavings": 12345.67,
    "recommendations": [
      {
        "type": "primary",
        "title": "Significant Fee Savings Opportunity",
        "message": "Switching from 1.5% to 0.5% fees could save you $45,679 over 25 years.",
        "impact": "high",
        "actionable": true
      }
    ]
  }
}
```

## 🧮 Financial Calculations

### Compound Growth Formula
The application uses monthly compounding with the following formula:

```javascript
// Monthly return rate after fees
const monthlyReturnRate = (annualReturnRate - feeRate) / 12 / 100;

// For each month:
balance += monthlyContribution;
const monthlyReturn = balance * monthlyReturnRate;
balance += monthlyReturn;

// Deduct monthly fees
const monthlyFee = balance * (feeRate / 12 / 100);
balance -= monthlyFee;
```

### Tax Considerations
- Taxes are calculated on gross gains at the end of the investment period
- Uses the provided marginal tax rate
- Assumes tax-deferred growth during the accumulation phase

## 🎨 Design System

### Color Palette (Colorblind-Friendly)
- **Primary**: Blue (#2563eb)
- **Success**: Green (#16a34a) 
- **Warning**: Orange (#d97706)
- **Error**: Red (#dc2626)
- **Info**: Gray (#6b7280)

### Typography
- **Font**: Inter (system fallback)
- **Headings**: 120% line height
- **Body**: 150% line height
- **Max 3 font weights**: Regular (400), Medium (500), Bold (700)

### Spacing System
- **Base unit**: 8px
- **Scale**: 4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px

## ♿ Accessibility Features

- **Keyboard Navigation**: Full keyboard support for all interactive elements
- **ARIA Labels**: Comprehensive labeling for screen readers
- **Color Contrast**: WCAG AA compliant contrast ratios
- **Focus Management**: Visible focus indicators
- **Semantic HTML**: Proper heading hierarchy and landmarks
- **Error Handling**: Clear error messages with instructions

## 🧪 Testing

### Running Tests
```bash
npm test
```

### Test Coverage
- Unit tests for calculation logic
- Input validation tests
- API endpoint tests
- Component rendering tests

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Environment Variables
```bash
# .env
VITE_API_URL=https://your-api-domain.com
PORT=3001
NODE_ENV=production
```

### Deployment Options
- **Frontend**: Netlify, Vercel, AWS S3 + CloudFront
- **Backend**: Heroku, AWS EC2, DigitalOcean
- **Full-Stack**: Railway, Render, AWS Elastic Beanstalk

## 📊 Performance Optimizations

- **Code Splitting**: Lazy loading of chart components
- **Memoization**: React.memo and useMemo for expensive calculations
- **Compression**: Gzip compression on server responses
- **Caching**: Browser caching for static assets
- **Bundle Optimization**: Tree shaking and minification

## 🔒 Security Features

- **Input Validation**: Server-side validation for all inputs
- **CORS Configuration**: Restricted cross-origin requests
- **Security Headers**: Helmet.js for security headers
- **Rate Limiting**: Protection against API abuse
- **Error Handling**: No sensitive information in error responses

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Chart.js** for excellent charting capabilities
- **Tailwind CSS** for rapid UI development
- **Colorbrewer** for colorblind-friendly palettes
- **Lucide** for beautiful icons

## 📞 Support

For support, please open an issue on GitHub or contact the development team.

---

**Disclaimer**: This calculator is for educational purposes only and should not be considered as financial advice. Please consult with a qualified financial advisor for personalized investment guidance.