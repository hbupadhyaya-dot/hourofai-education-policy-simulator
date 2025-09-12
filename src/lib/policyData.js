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
    stakeholder: 'Educational Institution Leader'
  },
  DIGITAL_CITIZEN: {
    id: 'DIGITAL_CITIZEN',
    name: 'Digital Citizenship',
    description: 'Learning to be a savvy, ethical navigator of the AI world. This is basically your survival guide for the AI age! You\'ll learn to spot when AI is being sketchy or biased, understand the difference between getting help and cheating, and develop the superpower of critical thinking in a world where AI can generate anything from essays to art.',
    stakeholder: 'Educational Institution Leader'
  },
  ACCESS_STD: {
    id: 'ACCESS_STD',
    name: 'Accessibility Standards',
    description: 'Making sure AI doesn\'t leave anyone behind - like building ramps for the digital world. Whether you\'re dyslexic, speak multiple languages, or learn differently, AI tools should work FOR you, not against you. This policy ensures AI becomes your learning ally, offering features like real-time translation, text-to-speech, or visual aids - whatever helps you succeed.',
    stakeholder: 'Educational Institution Leader'
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
  INTEROP_STD: {
    id: 'INTEROP_STD',
    name: 'Interoperability Standards',
    description: 'Making all your school\'s digital tools play nice together like a well-coordinated team. You know how annoying it is when apps don\'t sync or when you have to re-enter your info everywhere? This policy fixes that problem for school tech. Your gradebook, learning apps, and AI tutors will work together like a perfectly coordinated team, sharing information seamlessly while keeping everything secure.',
    stakeholder: 'Research & Ethics Advisor'
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
  INTEROP_STD: {
    AI_LITERACY: 0.1,
    TEACHER_SATISFACTION: 0.4,
    DIGITAL_EQUITY: 0.3,
    AI_VULNERABILITY_INDEX: -0.5,
    BUDGET_STRAIN: 0.1
  }
};

// Calculate current metrics based on selected policies and their intensities
export function calculateCurrentMetrics(selectedPolicies, policyIntensities) {
  const metrics = {
    AI_LITERACY: 50,
    TEACHER_SATISFACTION: 50,
    DIGITAL_EQUITY: 50,
    AI_VULNERABILITY_INDEX: 50,
    BUDGET_STRAIN: 50
  };

  // Calculate direct impacts with enhanced responsiveness
  selectedPolicies.forEach(policyId => {
    // Use standardized baseline for all policies (50%)
    const baselineIntensities = {
      PROTECT_STD: 50,
      PD_FUNDS: 50,
      INFRA_INVEST: 50,
      EDUC_AUTONOMY: 50,
      DIGITAL_CITIZEN: 50,
      ACCESS_STD: 50,
      INNOV_SANDBOX: 50,
      MODEL_EVAL_STD: 50,
      INTEROP_STD: 50
    };
    
    const center = baselineIntensities[policyId] || 50;
    const intensity = (policyIntensities[policyId] !== undefined) ? policyIntensities[policyId] : center;
    const policyCoefficients = coefficients[policyId] || {};
    
    // Enhanced intensity scaling relative to each policy's baseline
    // Normalize so baseline -> 0, min/max -> approximately -1 / +1
    const delta = intensity - center;
    const denom = 50; // All policies now use standard 50 denominator
    const normalizedIntensity = delta / denom; // roughly in [-1, 1]
    
    // Ensure policies at 0% still have realistic impacts
    let intensityFactor;
    if (Math.abs(normalizedIntensity) < 0.01) {
      // Very close to baseline (50%) - minimal impact
      intensityFactor = 0;
    } else {
      // Apply power scaling with safety bounds
      const absValue = Math.abs(normalizedIntensity);
      const powerValue = Math.min(absValue, 1.0); // Cap at 1.0 to prevent extreme values
      intensityFactor = Math.sign(normalizedIntensity) * Math.pow(powerValue, 0.8);
    }
    
    Object.keys(metrics).forEach(metric => {
      if (policyCoefficients[metric]) {
        // Apply more modest impact scaling with diminishing returns near caps
        const baseImpact = policyCoefficients[metric] * intensityFactor * 20;
        
        // Calculate diminishing returns factor based on current metric value
        let diminishingFactor = 1.0;
        if (metric === 'BUDGET_STRAIN') {
          // Budget strain can go higher, so apply diminishing returns from 80+
          if (metrics[metric] > 80) {
            const excess = metrics[metric] - 80;
            diminishingFactor = Math.max(0.1, 1.0 - (excess / 20) * 0.9);
          }
        } else {
          // Other metrics: apply diminishing returns from 70+
          if (metrics[metric] > 70) {
            const excess = metrics[metric] - 70;
            diminishingFactor = Math.max(0.1, 1.0 - (excess / 20) * 0.9);
          }
        }
        
        // Ensure diminishing returns don't completely eliminate impacts at low values
        // This prevents policies from becoming "invisible" at extreme settings
        if (Math.abs(intensityFactor) > 0.5) {
          diminishingFactor = Math.max(diminishingFactor, 0.3); // Minimum 30% impact for strong policies
        }
        
        const impact = baseImpact * diminishingFactor;
        metrics[metric] += impact;
      }
    });
  });

  // Calculate synergies between policies with enhanced effects
  selectedPolicies.forEach(policy1 => {
    selectedPolicies.forEach(policy2 => {
      if (policy1 !== policy2) {
        // Use correct baseline for each policy in synergy calculations
        const baselineIntensities = {
      PROTECT_STD: 50,
      PD_FUNDS: 50,
      INFRA_INVEST: 50,
      EDUC_AUTONOMY: 50,
      DIGITAL_CITIZEN: 50,
      ACCESS_STD: 50,
      INNOV_SANDBOX: 50,
      MODEL_EVAL_STD: 50,
      INTEROP_STD: 50
    };
        
        const i1 = (policyIntensities[policy1] !== undefined) ? policyIntensities[policy1] : (baselineIntensities[policy1] || 50);
        const i2 = (policyIntensities[policy2] !== undefined) ? policyIntensities[policy2] : (baselineIntensities[policy2] || 50);
        const synergy = calculatePolicySynergy(policy1, policy2, i1, i2);
        
        // Apply more modest synergy effects with diminishing returns
        Object.keys(synergy).forEach(metric => {
          const baseSynergy = synergy[metric] * 1.0; // Reduced synergy multiplier
          
          // Calculate diminishing returns factor based on current metric value
          let diminishingFactor = 1.0;
          if (metric === 'BUDGET_STRAIN') {
            // Budget strain can go higher, so apply diminishing returns from 80+
            if (metrics[metric] > 80) {
              const excess = metrics[metric] - 80;
              diminishingFactor = Math.max(0.1, 1.0 - (excess / 20) * 0.9);
            }
          } else {
            // Other metrics: apply diminishing returns from 70+
            if (metric === 'BUDGET_STRAIN') {
              if (metrics[metric] > 80) {
                const excess = metrics[metric] - 80;
                diminishingFactor = Math.max(0.1, 1.0 - (excess / 20) * 0.9);
              }
            } else {
              if (metrics[metric] > 70) {
                const excess = metrics[metric] - 70;
                diminishingFactor = Math.max(0.1, 1.0 - (excess / 20) * 0.9);
              }
            }
          }
          
          // Ensure synergies don't become completely invisible at extreme values
          diminishingFactor = Math.max(diminishingFactor, 0.2); // Minimum 20% impact for synergies
          
          const finalSynergy = baseSynergy * diminishingFactor;
          metrics[metric] += finalSynergy;
        });
      }
    });
  });

  // Apply realistic bounds with diminishing returns near caps
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

// Helper function for policy synergies
export function calculatePolicySynergy(policy1, policy2, intensity1, intensity2) {
  const synergies = {
    // --- Capacity & Training ---
    'PD_FUNDS+DATA_ANALYTICS': { TEACHER_SATISFACTION: 0.15, DIGITAL_EQUITY: 0.2 },
    'PD_FUNDS+DIGITAL_CITIZEN': { AI_LITERACY: 0.2 },
    'PD_FUNDS+AI_INTEGRATION': { AI_LITERACY: 0.25, TEACHER_SATISFACTION: 0.15 },
    'PD_FUNDS+INNOV_SANDBOX': { AI_LITERACY: 0.15 },
    'PD_FUNDS+MODEL_EVAL_STD': { TEACHER_SATISFACTION: 0.1 },

    // --- Technology Foundations ---
    'INFRA_INVEST+ACCESS_STD': { DIGITAL_EQUITY: 0.25, AI_VULNERABILITY_INDEX: -0.1 },
    'INFRA_INVEST+INTEROP_STD': { TEACHER_SATISFACTION: 0.15 },
    'INFRA_INVEST+AI_INTEGRATION': { AI_LITERACY: 0.3, TEACHER_SATISFACTION: 0.2 },
    'INFRA_INVEST+DIGITAL_CITIZEN': { DIGITAL_EQUITY: 0.2, AI_LITERACY: 0.15 },
    'INFRA_INVEST+INNOV_SANDBOX': { AI_VULNERABILITY_INDEX: -0.1 },

    // --- Trust, Governance & Safety ---
    'COMM_INPUT+IMPACT_REP_STD': { DIGITAL_EQUITY: 0.1 },
    'COMM_INPUT+PROTECT_STD': { DIGITAL_EQUITY: 0.1 },
    'PROTECT_STD+MODEL_EVAL_STD': { AI_VULNERABILITY_INDEX: -0.3 },
    'PROTECT_STD+ACCESS_STD': { DIGITAL_EQUITY: 0.2 },
    'ACCESS_STD+DIGITAL_CITIZEN': { DIGITAL_EQUITY: 0.25 },
    'IMPACT_REP_STD+MODEL_EVAL_STD': { DIGITAL_EQUITY: 0.1 },

    // --- Innovation & Workforce Alignment ---
    'AI_INTEGRATION+LOCAL_JOB_ALIGN': { AI_LITERACY: 0.25 },
    'AI_INTEGRATION+INNOV_SANDBOX': { AI_LITERACY: 0.3, TEACHER_SATISFACTION: 0.15 },
    'LOCAL_JOB_ALIGN+DATA_ANALYTICS': { AI_LITERACY: 0.1 },
    'INNOV_SANDBOX+INTEROP_STD': { TEACHER_SATISFACTION: 0.1 },
    'INNOV_SANDBOX+MODEL_EVAL_STD': { AI_VULNERABILITY_INDEX: -0.2 }
  };

  // Tensions (negative or mixed effects) - Enhanced for realistic trade-offs
  const tensions = {
    // Infrastructure vs. Safety & Governance (Major Tensions)
    'INFRA_INVEST+PROTECT_STD': { 
      TEACHER_SATISFACTION: -0.2,       // Teachers feel constrained by safety requirements
      BUDGET_STRAIN: 0.25               // Safety measures add infrastructure costs
    },
    'INFRA_INVEST+MODEL_EVAL_STD': { 
      BUDGET_STRAIN: 0.2                // Additional compliance costs
    },
    'INFRA_INVEST+ACCESS_STD': { 
      BUDGET_STRAIN: 0.15               // Accessibility features add costs
    },

    // Innovation vs. Safety & Governance (Core Tensions)
    'INNOV_SANDBOX+PROTECT_STD': { 
      TEACHER_SATISFACTION: -0.15,      // Teachers feel innovation is stifled
      AI_VULNERABILITY_INDEX: -0.1      // But safety is improved
    },
    'INNOV_SANDBOX+MODEL_EVAL_STD': { 
      TEACHER_SATISFACTION: -0.1        // Teachers feel constrained
    },
    'INNOV_SANDBOX+ACCESS_STD': { 
      BUDGET_STRAIN: 0.1                // Additional compliance costs
    },

    // Autonomy vs. Safety & Governance (Control Tensions)
    'EDUC_AUTONOMY+PROTECT_STD': { 
      TEACHER_SATISFACTION: -0.3        // Teachers lose autonomy due to safety requirements
    },
    'EDUC_AUTONOMY+MODEL_EVAL_STD': { 
      TEACHER_SATISFACTION: -0.25       // Teachers feel micromanaged
    },
    'EDUC_AUTONOMY+ACCESS_STD': { 
      TEACHER_SATISFACTION: -0.2        // Teachers feel constrained by accessibility rules
    },

    // AI Integration vs. Safety & Governance (AI-Specific Tensions)
    'AI_INTEGRATION+PROTECT_STD': { 
      TEACHER_SATISFACTION: -0.15,      // Teachers feel constrained in AI use
      AI_VULNERABILITY_INDEX: -0.2      // But safety is significantly improved
    },
    'AI_INTEGRATION+MODEL_EVAL_STD': { 
      TEACHER_SATISFACTION: -0.1        // Teachers feel constrained
    },
    'AI_INTEGRATION+ACCESS_STD': { 
      BUDGET_STRAIN: 0.1                // Additional compliance costs
    },

    // Capacity & Resources (Resource Tensions)
    'PD_FUNDS+INFRA_INVEST': { 
      BUDGET_STRAIN: 0.35,              // High spending on both creates budget pressure
      TEACHER_SATISFACTION: -0.1        // Teachers may feel resources are misallocated
    },
    'PD_FUNDS+INNOV_SANDBOX': { 
      BUDGET_STRAIN: 0.25,              // Innovation costs add to PD spending
      TEACHER_SATISFACTION: -0.05       // Minor teacher dissatisfaction
    },
    'PD_FUNDS+COMM_INPUT': { 
      TEACHER_SATISFACTION: -0.15       // Community input may conflict with PD priorities
    },

    // Community vs. Innovation (Social Tensions)
    'COMM_INPUT+INNOV_SANDBOX': { 
      TEACHER_SATISFACTION: -0.1        // Community concerns slow innovation
    },
    'COMM_INPUT+AI_INTEGRATION': { 
      TEACHER_SATISFACTION: -0.1        // Teachers feel community pressure
    },

    // Data & Analytics vs. Privacy (Data Tensions)
    'DATA_ANALYTICS+PROTECT_STD': { 
      TEACHER_SATISFACTION: -0.1,       // Teachers feel constrained in data use
      AI_VULNERABILITY_INDEX: -0.15     // But privacy is significantly improved
    },
    'DATA_ANALYTICS+MODEL_EVAL_STD': { 
      TEACHER_SATISFACTION: -0.05       // Minor teacher constraint
    }
  };

  const key1 = `${policy1}+${policy2}`;
  const key2 = `${policy2}+${policy1}`;
  const synergyEffect = synergies[key1] || synergies[key2] || {};
  const tensionEffect = tensions[key1] || tensions[key2] || {};

  // Enhanced scaling based on both policy intensities
  const avgIntensity = (intensity1 + intensity2) / 2;
  const normalizedIntensity = (avgIntensity - 50) / 50;
  const pairStrength = Math.sign(normalizedIntensity) * Math.pow(Math.abs(normalizedIntensity), 0.7);

  const scaledEffect = {};
  Object.entries(synergyEffect).forEach(([metric, value]) => {
    scaledEffect[metric] = (scaledEffect[metric] || 0) + value * pairStrength * 10;
  });
  Object.entries(tensionEffect).forEach(([metric, value]) => {
    scaledEffect[metric] = (scaledEffect[metric] || 0) + value * pairStrength * 10;
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
