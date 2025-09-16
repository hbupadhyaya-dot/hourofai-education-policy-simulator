// Policy definitions - Simplified for High Schoolers
export const policyDefinitions = {
  PROTECT_STD: {
    id: 'PROTECT_STD',
    name: 'Student Protection',
    description: 'Your digital bodyguard - protecting your data and ensuring AI treats you fairly. Think of this as your personal data security team! This policy creates strict rules so AI tools can\'t snoop through your grades or share your assignments without permission - kind of like having privacy settings on your social media, but way more secure. It also acts like a referee, making sure AI doesn\'t play favorites or discriminate against any students.',
    stakeholder: 'District Administrator'
  },
  PD_FUNDS: {
    id: 'PD_FUNDS',
    name: 'Teacher Training',
    description: 'Leveling up your teachers\' AI game through funded training programs. Imagine if your gaming squad suddenly had to play a new game they\'d never seen before - disaster, right? This policy ensures teachers get the training they need to master AI tools before bringing them to your classroom. It\'s like sending them to "AI boot camp" so they can be your guides in this new digital landscape.',
    stakeholder: 'District Administrator'
  },
  INFRA_INVEST: {
    id: 'INFRA_INVEST',
    name: 'Technology Infrastructure',
    description: 'Building the high-tech foundation that makes AI actually work in schools. You know how frustrating it is when Netflix keeps buffering during the best part of a show? This policy prevents that from happening with AI tools by ensuring schools have lightning-fast internet and powerful computers. It\'s basically giving your school a tech upgrade so AI runs as smoothly as your favorite streaming service.',
    stakeholder: 'District Administrator'
  },
  EDUC_AUTONOMY: {
    id: 'EDUC_AUTONOMY',
    name: 'Educator Autonomy',
    description: 'Giving teachers the freedom to choose their own AI adventure. Instead of forcing every teacher to use identical AI tools (boring!), this policy lets them pick what actually works for their teaching style and your learning needs. It\'s like having a playlist where each teacher can choose their own mix of traditional and AI-enhanced methods.',
    stakeholder: 'School Principal'
  },
  DIGITAL_CITIZEN: {
    id: 'DIGITAL_CITIZEN',
    name: 'Digital Citizenship',
    description: 'Learning to be a savvy, ethical navigator of the AI world. This is basically your survival guide for the AI age! You\'ll learn to spot when AI is being sketchy or biased, understand the difference between getting help and cheating, and develop the superpower of critical thinking in a world where AI can generate anything from essays to art.',
    stakeholder: 'School Principal'
  },
  ACCESS_STD: {
    id: 'ACCESS_STD',
    name: 'Accessibility Standards',
    description: 'Making sure AI doesn\'t leave anyone behind - like building ramps for the digital world. Whether you\'re dyslexic, speak multiple languages, or learn differently, AI tools should work FOR you, not against you. This policy ensures AI becomes your learning ally, offering features like real-time translation, text-to-speech, or visual aids - whatever helps you succeed.',
    stakeholder: 'Research & Ethics Advisor'
  },
  INNOV_SANDBOX: {
    id: 'INNOV_SANDBOX',
    name: 'Innovation & Pilot Programs',
    description: 'The "beta testing" phase for cool new AI tools in education. Ever been part of a beta test for a new app or game? That\'s exactly what this is! Schools can try out cutting-edge AI tools with small groups first, working out the bugs and seeing what actually helps students learn. You might even get to be part of testing the next big thing in education!',
    stakeholder: 'Research & Ethics Advisor'
  },
  MODEL_EVAL_STD: {
    id: 'MODEL_EVAL_STD',
    name: 'Model Evaluation Standards',
    description: 'The quality control checkpoint that keeps sketchy AI out of your classroom. Before any AI tool makes it to your school, it goes through something like a rigorous college admissions process. Is it accurate? Fair? Actually helpful for learning? Does it protect your privacy? Only the AI tools that pass these tough standards get the green light for classroom use.',
    stakeholder: 'Research & Ethics Advisor'
  },
  AI_INTEGRATION: {
    id: 'AI_INTEGRATION',
    name: 'AI Integration',
    description: 'Bringing AI tools directly into your daily learning experience. This policy determines how much AI becomes part of your regular classroom activities - from AI tutors that help with homework to smart writing assistants that improve your essays. It\'s like having a super-smart study buddy available 24/7, but only if your school decides to make it happen.',
    stakeholder: 'School Principal'
  }
};

// Outcome metrics - Simplified for High Schoolers
export const outcomeMetrics = {
  AI_LITERACY: { name: 'AI Literacy', baseline: 50 },
  TEACHER_SATISFACTION: { name: 'Teacher Morale', baseline: 50 },
  DIGITAL_EQUITY: { name: 'Digital Fairness', baseline: 50 },
  AI_VULNERABILITY_INDEX: { name: 'AI Vulnerability', baseline: 50 },
  BUDGET_STRAIN: { name: 'Budget Strain', baseline: 50 }
};

// Impact coefficients for each policy on each outcome metric (simplified)
const coefficients = {
  PROTECT_STD: {
    AI_LITERACY: 0.2,
    TEACHER_SATISFACTION: 0.1,
    DIGITAL_EQUITY: 0.3,
    AI_VULNERABILITY_INDEX: -0.5,
    BUDGET_STRAIN: 0.2
  },
  PD_FUNDS: {
    AI_LITERACY: 0.5,
    TEACHER_SATISFACTION: 0.5,
    DIGITAL_EQUITY: 0.4,
    AI_VULNERABILITY_INDEX: -0.3,
    BUDGET_STRAIN: 0.4
  },
  INFRA_INVEST: {
    AI_LITERACY: 0.3,
    TEACHER_SATISFACTION: 0.2,
    DIGITAL_EQUITY: 0.5,
    AI_VULNERABILITY_INDEX: -0.2,
    BUDGET_STRAIN: 0.5
  },
  EDUC_AUTONOMY: {
    AI_LITERACY: 0.2,
    TEACHER_SATISFACTION: 0.5,
    DIGITAL_EQUITY: 0.2,
    AI_VULNERABILITY_INDEX: 0.15,
    BUDGET_STRAIN: 0.1
  },
  DIGITAL_CITIZEN: {
    AI_LITERACY: 0.5,
    TEACHER_SATISFACTION: 0.1,
    DIGITAL_EQUITY: 0.5,
    AI_VULNERABILITY_INDEX: -0.3,
    BUDGET_STRAIN: 0.1
  },
  ACCESS_STD: {
    AI_LITERACY: 0.2,
    TEACHER_SATISFACTION: 0.1,
    DIGITAL_EQUITY: 0.5,
    AI_VULNERABILITY_INDEX: 0.0,
    BUDGET_STRAIN: 0.2
  },
  INNOV_SANDBOX: {
    AI_LITERACY: 0.3,
    TEACHER_SATISFACTION: 0.3,
    DIGITAL_EQUITY: 0.3,
    AI_VULNERABILITY_INDEX: -0.4,
    BUDGET_STRAIN: 0.3
  },
  MODEL_EVAL_STD: {
    AI_LITERACY: 0.1,
    TEACHER_SATISFACTION: 0.1,
    DIGITAL_EQUITY: 0.3,
    AI_VULNERABILITY_INDEX: -0.5,
    BUDGET_STRAIN: 0.2
  },
  AI_INTEGRATION: {
    AI_LITERACY: 0.4,
    TEACHER_SATISFACTION: 0.3,
    DIGITAL_EQUITY: 0.4,
    AI_VULNERABILITY_INDEX: -0.2,
    BUDGET_STRAIN: 0.3
  }
};

// Calculate current metrics based on selected policies and their intensities
// Simplified model: Direct coefficient application with intensity scaling
export function calculateCurrentMetrics(selectedPolicies, policyIntensities) {
  const metrics = {
    AI_LITERACY: 50,
    TEACHER_SATISFACTION: 50,
    DIGITAL_EQUITY: 50,
    AI_VULNERABILITY_INDEX: 50,
    BUDGET_STRAIN: 50
  };

  // Calculate direct impacts with simple intensity scaling
  selectedPolicies.forEach(policyId => {
    const intensity = policyIntensities[policyId] || 50; // Default to 50% if not set
    const policyCoefficients = coefficients[policyId] || {};
    
    // Simple intensity scaling: (intensity - 50) / 50
    // Low (25%): -0.5, Moderate (50%): 0, High (75%): +0.5
    const intensityFactor = (intensity - 50) / 50;
    
    Object.keys(metrics).forEach(metric => {
      if (policyCoefficients[metric]) {
        // Direct application: coefficient * intensity factor * scaling factor
        const impact = policyCoefficients[metric] * intensityFactor * 30;
        metrics[metric] += impact;
      }
    });
  });

  // Calculate key synergies and tensions - simplified for educational clarity
  selectedPolicies.forEach(policy1 => {
    selectedPolicies.forEach(policy2 => {
      if (policy1 !== policy2) {
        const i1 = policyIntensities[policy1] || 50;
        const i2 = policyIntensities[policy2] || 50;
        const synergy = calculatePolicySynergy(policy1, policy2, i1, i2);
        
        // Apply simple synergy effects
        Object.keys(synergy).forEach(metric => {
          const impact = synergy[metric] * 15; // Simplified scaling
          metrics[metric] += impact;
        });
      }
    });
  });

  // Apply simple bounds
  Object.keys(metrics).forEach(metric => {
    // Cap most metrics at 90, except budget strain which can go higher
    let maxCap = metric === 'BUDGET_STRAIN' ? 100 : 90;
    let minCap = 0;
    
    // Apply bounds
    metrics[metric] = Math.max(minCap, Math.min(maxCap, metrics[metric]));
    
    // Safety guard against NaN/Infinity
    if (!Number.isFinite(metrics[metric])) {
      metrics[metric] = 50;
    }
  });

  return metrics;
}

// Helper function for policy synergies - focused on key educational interactions
export function calculatePolicySynergy(policy1, policy2, intensity1, intensity2) {
  const synergies = {
    // Key Synergies - High Impact Educational Combinations
    'PD_FUNDS+AI_INTEGRATION': { 
      AI_LITERACY: 0.4, 
      TEACHER_SATISFACTION: 0.3,
      description: "High Teacher Training + High AI Integration = Maximum AI literacy gains"
    },
    'INFRA_INVEST+AI_INTEGRATION': { 
      AI_LITERACY: 0.3, 
      TEACHER_SATISFACTION: 0.2,
      description: "Strong Infrastructure + AI Integration = Reliable AI learning"
    },
    'PROTECT_STD+MODEL_EVAL_STD': { 
      AI_VULNERABILITY_INDEX: -0.4,
      description: "High Protection + High Standards = Better security"
    },
    'DIGITAL_CITIZEN+AI_INTEGRATION': { 
      AI_LITERACY: 0.3,
      DIGITAL_EQUITY: 0.2,
      description: "Digital Citizenship + AI Integration = Ethical AI use"
    }
  };

  // Key Tensions - Clear Educational Trade-offs
  const tensions = {
    'INFRA_INVEST+PROTECT_STD': { 
      BUDGET_STRAIN: 0.3,
      description: "High Infrastructure + High Protection = Budget strain but better security"
    },
    'EDUC_AUTONOMY+PROTECT_STD': { 
      TEACHER_SATISFACTION: -0.4,
      description: "High Teacher Autonomy + High Protection Standards = Teacher satisfaction tension"
    },
    'PD_FUNDS+INFRA_INVEST': { 
      BUDGET_STRAIN: 0.4,
      description: "High Teacher Training + High Infrastructure = Budget pressure"
    },
    'AI_INTEGRATION+PROTECT_STD': { 
      TEACHER_SATISFACTION: -0.2,
      AI_VULNERABILITY_INDEX: -0.3,
      description: "AI Integration + Protection = Constrained but safer AI use"
    }
  };

  const key1 = `${policy1}+${policy2}`;
  const key2 = `${policy2}+${policy1}`;
  const synergyEffect = synergies[key1] || synergies[key2] || {};
  const tensionEffect = tensions[key1] || tensions[key2] || {};

  // Simple scaling based on average intensity
  const avgIntensity = (intensity1 + intensity2) / 2;
  const intensityFactor = (avgIntensity - 50) / 50; // -0.5 to +0.5

  const scaledEffect = {};
  
  // Apply synergies (positive effects)
  Object.entries(synergyEffect).forEach(([metric, value]) => {
    if (metric !== 'description') {
      scaledEffect[metric] = (scaledEffect[metric] || 0) + value * intensityFactor;
    }
  });
  
  // Apply tensions (negative effects)
  Object.entries(tensionEffect).forEach(([metric, value]) => {
    if (metric !== 'description') {
      scaledEffect[metric] = (scaledEffect[metric] || 0) + value * intensityFactor;
    }
  });

  return scaledEffect;
}

// Generate time series data for charts with metric-specific realistic curves
export function generateTimeSeriesData(metricId, selectedPolicies, policyIntensities, shockScenario = 'NONE') {
  const data = [];
  
  // Define metric-specific curve characteristics
  const curveProfiles = {
    AI_LITERACY: {
      type: 'exponential', // Rapid early growth, then plateaus
      delay: 1, // 1 year delay
      growthRate: 0.8,
      plateau: 0.9
    },
    TEACHER_SATISFACTION: {
      type: 'linear', // Steady growth
      delay: 1, // 1 year delay
      growthRate: 0.9,
      plateau: 0.8
    },
    DIGITAL_EQUITY: {
      type: 'step', // Staircase growth with plateaus
      delay: 2, // 2 year delay
      growthRate: 0.5,
      plateau: 0.6
    },
    BUDGET_STRAIN: {
      type: 'inverse', // Decreases over time
      delay: 1, // 1 year delay
      growthRate: 0.7,
      plateau: 0.8
    },
    AI_VULNERABILITY_INDEX: {
      type: 'inverse_sigmoid', // Decreases with S-curve
      delay: 2, // 2 year delay
      growthRate: 0.6,
      plateau: 0.7
    }
  };
  
  const profile = curveProfiles[metricId] || curveProfiles.AI_LITERACY;
  
  for (let year = 2025; year <= 2040; year++) {
    const yearsSinceStart = year - 2025;
    const currentMetrics = calculateCurrentMetrics(selectedPolicies, policyIntensities);
    const targetValue = currentMetrics[metricId] || 50;
    
    // Calculate progress based on curve type
    let progress = 0;
    const effectiveYears = Math.max(0, yearsSinceStart - profile.delay);
    
    switch (profile.type) {
      case 'exponential':
        progress = Math.min(1, 1 - Math.exp(-profile.growthRate * effectiveYears / 5));
        break;
      case 'logarithmic':
        progress = Math.min(1, Math.log(1 + effectiveYears / 2) / Math.log(6));
        break;
      case 'sigmoid':
        progress = 1 / (1 + Math.exp(-profile.growthRate * (effectiveYears / 4 - 2)));
        break;
      case 'linear':
        progress = Math.min(1, effectiveYears / 8);
        break;
      case 'step':
        progress = Math.min(1, Math.floor(effectiveYears / 2) * 0.25);
        break;
      case 'inverse':
        progress = Math.min(1, 1 - Math.exp(-profile.growthRate * effectiveYears / 5));
        break;
      case 'delayed_exponential':
        progress = Math.min(1, 1 - Math.exp(-profile.growthRate * effectiveYears / 6));
        break;
      case 'inverse_sigmoid':
        progress = 1 / (1 + Math.exp(-profile.growthRate * (effectiveYears / 4 - 2)));
        break;
      default:
        progress = Math.min(1, effectiveYears / 8);
    }
    
    // Apply plateau effect
    progress = Math.min(profile.plateau, progress);
    
    // Calculate current value with metric-specific adjustments
    let currentValue;
    if (profile.type.includes('inverse')) {
      // For inverse metrics (like Budget Strain, AI Vulnerability), higher target = lower value
      currentValue = 100 - (100 - targetValue) * progress;
    } else {
      currentValue = 50 + (targetValue - 50) * progress;
    }
    
    // Add realistic variation based on metric type
    let variation = 0;
    if (profile.type === 'step') {
      // Step functions have more variation
      variation = (Math.sin(year * 0.3) + Math.cos(year * 0.2)) * 3;
    } else if (profile.type === 'logarithmic') {
      // Logarithmic has moderate variation
      variation = (Math.sin(year * 0.4) + Math.cos(year * 0.3)) * 2;
    } else {
      // Other curves have minimal variation
      variation = (Math.sin(year * 0.5) + Math.cos(year * 0.3)) * 1;
    }
    
    data.push({
      year: year,
      current: Math.max(0, Math.min(100, currentValue + variation)),
      baseline: 50
    });
  }
  
  return data;
}

// Get policy coefficients for a specific policy
export function getPolicyCoefficients(policyId) {
  return coefficients[policyId] || {};
}

// Shock scenarios for time series analysis
export const shockScenarios = {
  NONE: {
    name: 'No Shock',
    description: 'Baseline scenario without external shocks',
    adjustments: {}
  },
  TOOL_BIAS_DISCOVERY: {
    name: 'AI Tool Bias Discovery',
    description: 'Discovery of bias in AI educational tools',
    adjustments: {
      AI_VULNERABILITY_INDEX: 20,
      TEACHER_SATISFACTION: -10
    }
  },
  SUDDEN_FUNDING_SPIKE: {
    name: 'Sudden Funding Spike',
    description: 'Unexpected increase in AI education funding',
    adjustments: {
      BUDGET_STRAIN: -20,
      AI_LITERACY: 15
    }
  },
  DATA_PRIVACY_BREACH: {
    name: 'Data Privacy Breach',
    description: 'Security breach affecting student data',
    adjustments: {
      AI_VULNERABILITY_INDEX: 30,
      DIGITAL_EQUITY: -10
    }
  }
};

// Get stakeholder groups for organization
export function getStakeholderGroups() {
  return {
    'District Administrator': ['DATA_ANALYTICS', 'PROTECT_STD', 'PD_FUNDS'],
    'Educational Institution Leader': ['EDUC_AUTONOMY', 'AI_INTEGRATION', 'DIGITAL_CITIZEN'],
    'Community Representative': ['COMM_INPUT', 'IMPACT_REP_STD', 'LOCAL_JOB_ALIGN'],
    'EdTech Industry Representative': ['INTEROP_STD', 'INFRA_INVEST', 'ACCESS_STD'],
    'Research & Ethics Advisor': ['STATE_FED_PART', 'INNOV_SANDBOX', 'MODEL_EVAL_STD']
  };
}

// Generate explanatory text for policy impacts - educational clarity focus
export function getPolicyImpactExplanations(selectedPolicies, policyIntensities, currentMetrics) {
  const explanations = [];
  
  // Helper function to get intensity level
  const getIntensityLevel = (intensity) => {
    if (intensity <= 33) return 'Low';
    if (intensity <= 66) return 'Moderate';
    return 'High';
  };
  
  // Analyze each selected policy's impact
  selectedPolicies.forEach(policyId => {
    const intensity = policyIntensities[policyId] || 50;
    const level = getIntensityLevel(intensity);
    const policy = policyDefinitions[policyId];
    const policyCoefficients = coefficients[policyId] || {};
    
    // Calculate what this policy contributed to each metric
    // Map intensity to a factor: 25% -> 0.25, 50% -> 0.5, 75% -> 0.75
    const intensityFactor = intensity / 100;
    
    Object.entries(policyCoefficients).forEach(([metric, coefficient]) => {
      const impact = coefficient * intensityFactor * 30;
      const metricName = outcomeMetrics[metric]?.name || metric;
      
      if (Math.abs(impact) > 0.1) { // Show impacts above 0.1 points
        const direction = impact > 0 ? 'increased' : 'decreased';
        const magnitude = Math.abs(impact).toFixed(1);
        
        explanations.push({
          policy: policy.name,
          intensity: level,
          metric: metricName,
          impact: impact,
          explanation: `${policy.name} at ${level} intensity ${direction} ${metricName} by ${magnitude} points`
        });
      }
    });
  });
  
  // Analyze synergies and tensions
  const synergyExplanations = [];
  selectedPolicies.forEach(policy1 => {
    selectedPolicies.forEach(policy2 => {
      if (policy1 !== policy2) {
        const i1 = policyIntensities[policy1] || 50;
        const i2 = policyIntensities[policy2] || 50;
        const synergy = calculatePolicySynergy(policy1, policy2, i1, i2);
        
        // Check for significant synergy effects
        Object.entries(synergy).forEach(([metric, value]) => {
          if (metric !== 'description' && Math.abs(value) > 0.1) {
            const metricName = outcomeMetrics[metric]?.name || metric;
            const direction = value > 0 ? 'synergy' : 'tension';
            const policy1Name = policyDefinitions[policy1]?.name || policy1;
            const policy2Name = policyDefinitions[policy2]?.name || policy2;
            
            synergyExplanations.push({
              type: direction,
              policies: `${policy1Name} + ${policy2Name}`,
              metric: metricName,
              impact: value,
              explanation: `${direction === 'synergy' ? 'Working together' : 'Creating tension'}: ${policy1Name} and ${policy2Name} ${direction === 'synergy' ? 'boost' : 'reduce'} ${metricName}`
            });
          }
        });
      }
    });
  });
  
  return {
    policyImpacts: explanations,
    synergies: synergyExplanations.filter(s => s.type === 'synergy'),
    tensions: synergyExplanations.filter(s => s.type === 'tension')
  };
}
