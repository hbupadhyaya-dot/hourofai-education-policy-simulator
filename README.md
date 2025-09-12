# AI Education Policy Simulator

An interactive web application for simulating and analyzing AI education policies. This tool allows users to select different policy combinations, adjust their intensities, and observe real-time impacts on various educational outcome metrics.

## Features

- **Policy Selection**: Choose up to 5 policies from 15 available options
- **Intensity Control**: Adjust policy implementation intensity (10-100%)
- **Real-time Metrics**: View impacts on 10 key educational outcome metrics
- **Visual Analytics**: Time series charts and spider charts for data visualization
- **Policy Analysis**: Impact matrix showing how each policy affects different metrics
- **Synergy Detection**: Identify complementary and conflicting policy combinations
- **Fullscreen Charts**: Enhanced viewing experience for detailed analysis

## Key Metrics Tracked

- **AI Literacy**: Student competency in AI tools and concepts
- **Community Trust**: Public confidence in AI education initiatives
- **Innovation Index**: Educational innovation and experimentation
- **Teacher Satisfaction**: Educator comfort and engagement with AI tools
- **Digital Equity**: Access to AI education across different demographics
- **Budget Impact**: Financial implications of policy choices
- **Employment**: Job market preparation and opportunities
- **AI Vulnerability**: Risk assessment and mitigation
- **Impact Reporting**: Transparency and accountability measures
- **Policy Momentum**: Implementation progress and stakeholder engagement

## Available Policies

1. **Infrastructure Investment** - Technology foundation and resources
2. **Professional Development Funds** - Teacher training and capacity building
3. **Innovation Incentives** - Support for experimental approaches
4. **Model Evaluation** - AI tool assessment and validation
5. **Protection Standards** - Student privacy and safety measures
6. **Interoperability Standards** - System integration and compatibility
7. **Educational Autonomy** - Teacher flexibility and decision-making
8. **Data Governance** - Information management and access policies
9. **Digital Citizenship** - Responsible AI use and ethics education
10. **Career Pathways** - Workforce preparation and skill development
11. **AI Curriculum** - Structured learning objectives and content
12. **Impact Reporting Standards** - Outcome measurement and transparency
13. **Sandboxes** - Controlled testing environments for innovation
14. **Community Input** - Stakeholder engagement and feedback
15. **Adaptive Assessment** - Personalized evaluation and support

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ai-education-policy-simulator
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Development

### Project Structure

```
src/
├── components/
│   ├── ui/           # Reusable UI components
│   └── Charts.jsx    # Chart components
├── lib/
│   ├── policyData.js # Core simulation logic and data
│   └── utils.js      # Utility functions
├── styles/
│   └── index.css     # Global styles and Tailwind CSS
├── App.jsx           # Main application component
└── main.jsx         # Application entry point
```

### Key Technologies

- **React 18** - Frontend framework
- **Vite** - Build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible UI primitives
- **Recharts** - Chart library for data visualization
- **Lucide React** - Icon library

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with modern React best practices
- Designed for educational policy analysis and decision-making
- Supports evidence-based policy development through simulation 