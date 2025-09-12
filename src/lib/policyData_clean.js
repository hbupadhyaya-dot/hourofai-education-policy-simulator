// Policy definitions
export const policyDefinitions = [
  {
    id: 'INNOV_INCENT',
    name: 'Innovation Incentives',
    description: 'Funding and support for AI education innovation',
    stakeholder: 'District Administrator'
  },
  {
    id: 'PROTECT_STD',
    name: 'Protection Standards',
    description: 'Data privacy and security standards',
    stakeholder: 'District Administrator'
  },
  {
    id: 'PD_FUNDS',
    name: 'Professional Development',
    description: 'Teacher training and development programs',
    stakeholder: 'District Administrator'
  },
  {
    id: 'ACCESS_STD',
    name: 'Accessibility Standards',
    description: 'Ensuring AI tools are accessible to all students',
    stakeholder: 'Educational Institution Leader'
  },
  {
    id: 'INTEROP_STD',
    name: 'Interoperability Standards',
    description: 'Technical standards for AI tool integration',
    stakeholder: 'Educational Institution Leader'
  },
  {
    id: 'IMPACT_REP_STD',
    name: 'Impact Reporting Standards',
    description: 'Framework for measuring AI education effectiveness',
    stakeholder: 'Educational Institution Leader'
  },
  {
    id: 'LOCAL_JOB_ALIGN',
    name: 'Local Job Market Alignment',
    description: 'Aligning AI education with local employment needs',
    stakeholder: 'Community Representative'
  }
];

// Outcome metrics
export const outcomeMetrics = {
  AI_LITERACY: { name: 'AI Literacy', baseline: 50 },
  COMMUNITY_TRUST: { name: 'Community Trust', baseline: 50 },
  INNOVATION_INDEX: { name: 'Innovation Index', baseline: 50 },
  TEACHER_SATISFACTION: { name: 'Teacher Morale', baseline: 50 },
  DIGITAL_EQUITY: { name: 'Digital Equity', baseline: 50 },
  BUDGET_STRAIN: { name: 'Budget Strain', baseline: 50 },
  EMPLOYMENT_IMPACT: { name: 'Employability', baseline: 50 },
  AI_VULNERABILITY_INDEX: { name: 'AI Vulnerability', baseline: 50 }
};

// Impact coefficients for each policy on each outcome metric
const coefficients = {
  INNOV_INCENT: {
    AI_LITERACY: 0.3,
    INNOVATION_INDEX: 0.5,
    TEACHER_SATISFACTION: 0.2,
    BUDGET_STRAIN: 0.4
  },
  PROTECT_STD: {
    COMMUNITY_TRUST: 0.4,
    AI_VULNERABILITY_INDEX: -0.5,
    DIGITAL_EQUITY: 0.3
  },
  PD_FUNDS: {
    AI_LITERACY: 0.4,
    TEACHER_SATISFACTION: 0.5,
    INNOVATION_INDEX: 0.2,
    BUDGET_STRAIN: 0.3
  },
  ACCESS_STD: {
    DIGITAL_EQUITY: 0.5,
    AI_VULNERABILITY_INDEX: -0.2,
    COMMUNITY_TRUST: 0.2
  },
  INTEROP_STD: {
    TEACHER_SATISFACTION: 0.3,
    INNOVATION_INDEX: 0.2,
    AI_VULNERABILITY_INDEX: -0.3
  },
  IMPACT_REP_STD: {
    COMMUNITY_TRUST: 0.4,
    DIGITAL_EQUITY: 0.3,
    AI_VULNERABILITY_INDEX: -0.2
  },
  LOCAL_JOB_ALIGN: {
    EMPLOYMENT_IMPACT: 0.4,
    COMMUNITY_TRUST: 0.2,
    INNOVATION_INDEX: 0.2
  }
};

// Calculate current metrics based on selected policies and their intensities
export function calculateCurrentMetrics(selectedPolicies, policyIntensities) {
  const metrics = {
    AI_LITERACY: 50,
    COMMUNITY_TRUST: 50,
    INNOVATION_INDEX: 50,
    TEACHER_SATISFACTION: 50,
    DIGITAL_EQUITY: 50,
    BUDGET_STRAIN: 50,
    EMPLOYMENT_IMPACT: 50,
    AI_VULNERABILITY_INDEX: 50
  };

  selectedPolicies.forEach(policyId => {
    const intensity = policyIntensities[policyId] || 50;
    const policyCoefficients = coefficients[policyId] || {};
    const intensityFactor = (intensity - 50) / 50; // -1 to +1 scale
    
    Object.keys(metrics).forEach(metric => {
      if (policyCoefficients[metric]) {
        metrics[metric] += policyCoefficients[metric] * intensityFactor * 30;
      }
    });
  });

  // Clamp values between 0 and 100
  Object.keys(metrics).forEach(metric => {
    metrics[metric] = Math.max(0, Math.min(100, metrics[metric]));
  });

  return metrics;
}

// Generate time series data for charts
export function generateTimeSeriesData(metricId, selectedPolicies, policyIntensities, shockScenario = 'NONE') {
  const years = [];
  const baseline = [];
  const current = [];
  
  for (let year = 2025; year <= 2040; year++) {
    years.push(year);
    
    // Baseline stays constant
    baseline.push(50);
    
    // Current values change based on policies
    const progress = (year - 2025) / 15; // 0 to 1 over 15 years
    const currentMetrics = calculateCurrentMetrics(selectedPolicies, policyIntensities);
    const targetValue = currentMetrics[metricId] || 50;
    const currentValue = 50 + (targetValue - 50) * progress;
    
    current.push(Math.max(0, Math.min(100, currentValue)));
  }
  
  return { years, baseline, current };
}

// Get policy coefficients for a specific policy
function getPolicyCoefficients(policyId) {
  return coefficients[policyId] || {};
}


