import React, { useState, useEffect, useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'
import { policyDefinitions, outcomeMetrics, calculateCurrentMetrics, generateTimeSeriesData } from './lib/policyData'

// Time Series Chart Component
function TimeSeriesChart({ metricIds, selectedPolicies, policyIntensities }) {
  const metricColors = {
    AI_LITERACY: '#3B82F6',        // Blue
    TEACHER_SATISFACTION: '#F59E0B', // Amber
    DIGITAL_EQUITY: '#EF4444',     // Red
    AI_VULNERABILITY_INDEX: '#EC4899', // Pink
    BUDGET_STRAIN: '#6B7280'       // Gray
  }

  const data = useMemo(() => {
    try {
      const years = Array.from({ length: 16 }, (_, i) => 2025 + i)
      const combinedData = years.map(year => ({ year }))
      
      metricIds.forEach(metricId => {
        const metricData = generateTimeSeriesData(metricId, selectedPolicies, policyIntensities)
        metricData.forEach((dataPoint, index) => {
          combinedData[index][metricId] = dataPoint.current
        })
      })
      
      return combinedData
    } catch (error) {
      console.error('Error generating time series data:', error)
      return []
    }
  }, [metricIds, selectedPolicies, policyIntensities])

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 10, right: 25, left: 10, bottom: 15 }}>
          <XAxis dataKey="year" type="number" domain={['dataMin', 'dataMax']} ticks={[2025, 2028, 2031, 2034, 2037, 2040]} tick={{ fontSize: 11 }} />
          <YAxis domain={[0, 100]} interval={0} ticks={[0, 20, 40, 60, 80, 100]} tick={{ fontSize: 11 }} />
          <Tooltip 
            formatter={(value, name) => [
              `${Number(value).toFixed(1)}`, 
              name
            ]}
            labelFormatter={(label) => `Year: ${label}`}
          />
          {metricIds.map(metricId => (
            <Line 
              key={metricId}
              type="monotone" 
              dataKey={metricId} 
              stroke={metricColors[metricId]} 
              strokeWidth={4}
              name={outcomeMetrics[metricId]?.name || metricId}
              dot={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

// Spider Chart Component
function SpiderChart({ selectedPolicies, policyIntensities }) {
  const data = useMemo(() => {
    try {
      const currentMetrics = calculateCurrentMetrics(selectedPolicies, policyIntensities)
      return Object.entries(outcomeMetrics).map(([metricId, metric]) => ({
        metric: metric.name,
        value: currentMetrics[metricId] || 50
      }))
    } catch (error) {
      console.error('Error calculating spider chart data:', error)
      return []
    }
  }, [selectedPolicies, policyIntensities])

  return (
    <div style={{ width: 400, height: 400 }}>
      <RadarChart width={400} height={400} data={data} margin={{ top: 50, right: 50, bottom: 50, left: 50 }}>
        <PolarGrid />
        <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11 }} />
        <PolarRadiusAxis domain={[0, 100]} />
        <Radar name="Current" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
      </RadarChart>
    </div>
  )
}

// Enhanced Impact Explanation Modal component - combining stakeholder journey stories and multi-perspective analysis
const ImpactExplanationModal = ({ isOpen, onClose, selectedPolicies, policyIntensities }) => {
  if (!isOpen) return null

  const getImpactLevel = (intensity) => {
    if (intensity >= 70) return { level: 'High', color: 'text-red-600', bg: 'bg-red-50', description: 'Aggressive implementation' }
    if (intensity >= 40) return { level: 'Medium', color: 'text-amber-600', bg: 'bg-amber-50', description: 'Moderate implementation' }
    return { level: 'Low', color: 'text-green-600', bg: 'bg-green-50', description: 'Conservative implementation' }
  }

  const getStakeholderIcon = (stakeholder) => {
    const icons = {
      'District Administrator': '🏛️',
      'Educational Institution Leader': '🎓',
      'Community Representative': '👥',
      'EdTech Industry Representative': '💻',
      'Research & Ethics Advisor': '🔬'
    }
    return icons[stakeholder] || '📋'
  }

  const getJourneyStory = (policyId, intensity) => {
    const stories = {
      'PD_FUNDS': {
        title: "Teacher Development Journey",
        steps: [
          { year: 1, icon: "👩‍🏫", text: `With ${intensity}% funding, teachers receive ${Math.round(intensity * 0.8)} hours of AI training annually` },
          { year: 2, icon: "💡", text: "Teachers gain confidence using AI tools like ChatGPT and coding assistants in lessons" },
          { year: 3, icon: "📈", text: "Student AI literacy scores increase by 15-25% as teachers apply new skills" },
          { year: 4, icon: "🌟", text: "Teacher satisfaction rises - they feel prepared for the AI-enhanced classroom" }
        ]
      },
      'INFRA_INVEST': {
        title: "Infrastructure Transformation",
        steps: [
          { year: 1, icon: "🔧", text: `${intensity}% investment upgrades broadband, devices, and cloud access across schools` },
          { year: 2, icon: "⚡", text: "Reliable high-speed internet enables AI tools to work smoothly in every classroom" },
          { year: 3, icon: "🎯", text: "Students from all backgrounds gain equal access to AI learning opportunities" },
          { year: 4, icon: "🚀", text: "Digital equity gaps close as innovation flourishes district-wide" }
        ]
      },
      'PROTECT_STD': {
        title: "Student Protection Journey",
        steps: [
          { year: 1, icon: "🛡️", text: `${intensity}% compliance creates robust data privacy and AI safety protocols` },
          { year: 2, icon: "👨‍👩‍👧‍👦", text: "Parents gain confidence as transparent policies protect student information" },
          { year: 3, icon: "🤝", text: "Community trust grows - families support AI initiatives with strong safeguards" },
          { year: 4, icon: "🔒", text: "Students learn safely while AI vulnerability risks decrease significantly" }
        ]
      }
    }
    return stories[policyId] || null
  }

  const getPerspectiveAnalysis = (policyId, intensity) => {
    const analyses = {
      'PD_FUNDS': {
        students: `More engaging classes with AI-powered projects and personalized learning experiences`,
        teachers: `Reduced anxiety about AI, increased confidence, and new tools to enhance teaching effectiveness`,
        parents: `Visible improvement in children's digital skills and preparation for future careers`,
        administrators: `Better teacher retention, improved test scores, and positive community feedback`
      },
      'INFRA_INVEST': {
        students: `Fast, reliable access to AI tools means no more frustrating delays or tech inequity`,
        teachers: `Technology actually works when needed - lesson plans aren't derailed by poor connectivity`,
        parents: `Confidence that their child won't be left behind due to inadequate school technology`,
        administrators: `Foundation for innovation - other initiatives can build on solid infrastructure`
      },
      'PROTECT_STD': {
        students: `Peace of mind knowing personal data is safe while exploring AI learning tools`,
        teachers: `Clear guidelines remove guesswork about what AI tools are safe to use with students`,
        parents: `Trust that schools take privacy seriously and won't expose children to harmful AI`,
        administrators: `Legal protection and community confidence enable bold AI education initiatives`
      }
    }
    return analyses[policyId] || null
  }

  const activePolicies = selectedPolicies.map(policyId => {
    const intensity = policyIntensities[policyId] || 50
      const policy = policyDefinitions[policyId]
    
    return {
      id: policyId,
      name: policy?.name || policyId,
      stakeholder: policy?.stakeholder || 'Unknown',
        intensity,
      ...getImpactLevel(intensity),
      story: getJourneyStory(policyId, intensity),
      perspectives: getPerspectiveAnalysis(policyId, intensity)
    }
  }).filter(p => p.intensity !== 50) // Only show policies that have been adjusted

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Why These Impacts?</h2>
              <p className="text-slate-600 mt-1">See how your policy choices create real change over time</p>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 text-2xl font-bold"
            >
              ×
            </button>
          </div>
          
          {activePolicies.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎛️</div>
              <h3 className="text-xl font-semibold text-slate-700 mb-2">No Policy Changes Yet</h3>
              <p className="text-slate-600">Adjust some policy levers to see their impact stories and stakeholder perspectives!</p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Active Policies Overview */}
              <div>
                <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center">
                  <span className="mr-2">📊</span>Your Active Policy Changes
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {activePolicies.map((policy) => (
                    <div key={policy.id} className={`p-4 rounded-lg border-2 ${policy.bg} border-opacity-50`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">{getStakeholderIcon(policy.stakeholder)} {policy.stakeholder}</span>
                        <span className={`text-xs font-bold px-2 py-1 rounded ${policy.color} bg-white bg-opacity-70`}>
                          {policy.level}
                        </span>
              </div>
                      <h4 className="font-semibold text-slate-800">{policy.name}</h4>
                      <p className="text-xs text-slate-600 mt-1">{policy.intensity}% intensity</p>
                    </div>
                  ))}
                        </div>
              </div>

              {/* Journey Stories */}
                        <div>
                <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center">
                  <span className="mr-2">🗺️</span>Impact Journey Stories
                </h3>
                <div className="space-y-6">
                  {activePolicies.filter(p => p.story).map((policy) => (
                    <div key={policy.id} className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
                      <div className="flex items-center mb-4">
                        <div className={`w-3 h-3 rounded-full ${policy.bg} mr-3`}></div>
                        <h4 className="font-bold text-slate-800 text-lg">{policy.story.title}</h4>
                        <span className="ml-auto text-sm text-slate-600">{policy.intensity}% Implementation</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {policy.story.steps.map((step, index) => (
                          <div key={index} className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
                            <div className="text-center mb-3">
                              <div className="text-2xl mb-1">{step.icon}</div>
                              <div className="text-xs font-semibold text-slate-500">YEAR {step.year}</div>
                            </div>
                            <p className="text-sm text-slate-700 leading-relaxed">{step.text}</p>
                          </div>
                        ))}
                </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Multi-Perspective Analysis */}
                <div>
                <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center">
                  <span className="mr-2">👁️</span>Who's Affected & How
                </h3>
                <div className="space-y-4">
                  {activePolicies.filter(p => p.perspectives).map((policy) => (
                    <div key={policy.id} className="bg-white rounded-lg border border-slate-200 shadow-sm">
                      <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 rounded-t-lg">
                        <h4 className="font-semibold text-slate-800 flex items-center">
                          <span className="mr-2">{getStakeholderIcon(policy.stakeholder)}</span>
                          {policy.name} Impact on Different Groups
                  </h4>
                      </div>
                      <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                            <div className="flex items-start">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-1">
                                <span className="text-sm">👩‍🎓</span>
                      </div>
                              <div>
                                <h5 className="font-semibold text-blue-800 mb-1">For Students</h5>
                                <p className="text-sm text-slate-700">{policy.perspectives.students}</p>
                  </div>
                </div>
                            <div className="flex items-start">
                              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-1">
                                <span className="text-sm">👩‍🏫</span>
                      </div>
                              <div>
                                <h5 className="font-semibold text-green-800 mb-1">For Teachers</h5>
                                <p className="text-sm text-slate-700">{policy.perspectives.teachers}</p>
                  </div>
                </div>
                      </div>
                          <div className="space-y-4">
                            <div className="flex items-start">
                              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3 mt-1">
                                <span className="text-sm">👨‍👩‍👧‍👦</span>
                  </div>
              <div>
                                <h5 className="font-semibold text-purple-800 mb-1">For Parents</h5>
                                <p className="text-sm text-slate-700">{policy.perspectives.parents}</p>
                            </div>
                          </div>
                            <div className="flex items-start">
                              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3 mt-1">
                                <span className="text-sm">👔</span>
                      </div>
              <div>
                                <h5 className="font-semibold text-orange-800 mb-1">For Administrators</h5>
                                <p className="text-sm text-slate-700">{policy.perspectives.administrators}</p>
                    </div>
                    </div>
                  </div>
                        </div>
                    </div>
                    </div>
                      ))}
                    </div>
              </div>
                    </div>
                  )}
                  </div>
                </div>
              </div>
  )
}

// Simple Explore Impacts Modal Component
const ExploreImpactsModal = ({ isOpen, onClose, selectedPolicies, policyIntensities }) => {
  if (!isOpen) return null

  // Helper functions to check policy intensities (shared by all analysis functions)
  const isHigh = (policyId) => {
    try {
      return selectedPolicies && selectedPolicies.some(id => id === policyId && (policyIntensities[id] || 50) >= 70)
    } catch (error) {
      console.warn('Error in isHigh:', error)
      return false
    }
  }
  const isModerate = (policyId) => {
    try {
      return selectedPolicies && selectedPolicies.some(id => id === policyId && (policyIntensities[id] || 50) >= 40 && (policyIntensities[id] || 50) < 70)
    } catch (error) {
      console.warn('Error in isModerate:', error)
      return false
    }
  }
  const isLow = (policyId) => {
    try {
      return selectedPolicies && selectedPolicies.some(id => id === policyId && (policyIntensities[id] || 50) < 40)
    } catch (error) {
      console.warn('Error in isLow:', error)
      return false
    }
  }
  const isSelected = (policyId) => {
    try {
      return selectedPolicies && selectedPolicies.includes(policyId)
    } catch (error) {
      console.warn('Error in isSelected:', error)
      return false
    }
  }

  // Enhanced strategy classification
  const getStrategy = () => {
    const highPolicies = selectedPolicies.filter(policyId => (policyIntensities[policyId] || 50) >= 70)
    const moderatePolicies = selectedPolicies.filter(policyId => (policyIntensities[policyId] || 50) >= 40 && (policyIntensities[policyId] || 50) < 70)
    const lowPolicies = selectedPolicies.filter(policyId => (policyIntensities[policyId] || 50) < 40)
    
    // Check for specific policy combinations
    const hasHighProtection = selectedPolicies.some(id => id === 'PROTECT_STD' && (policyIntensities[id] || 50) >= 70)
    const hasHighEvaluation = selectedPolicies.some(id => id === 'MODEL_EVAL_STD' && (policyIntensities[id] || 50) >= 70)
    const hasHighAccessibility = selectedPolicies.some(id => id === 'ACCESS_STD' && (policyIntensities[id] || 50) >= 70)
    const hasHighInnovation = selectedPolicies.some(id => id === 'INNOV_SANDBOX' && (policyIntensities[id] || 50) >= 70)
    const hasHighIntegration = selectedPolicies.some(id => id === 'AI_INTEGRATION' && (policyIntensities[id] || 50) >= 70)
    const hasHighAutonomy = selectedPolicies.some(id => id === 'EDUC_AUTONOMY' && (policyIntensities[id] || 50) >= 70)
    const hasHighInfrastructure = selectedPolicies.some(id => id === 'INFRA_INVEST' && (policyIntensities[id] || 50) >= 70)
    const hasHighTraining = selectedPolicies.some(id => id === 'PD_FUNDS' && (policyIntensities[id] || 50) >= 70)

    // Strategy classification logic
    if (hasHighProtection && hasHighEvaluation && hasHighAccessibility) {
      return { name: "Safety-First Approach", description: "You're prioritizing comprehensive protection and rigorous evaluation to build bulletproof AI systems.", icon: "🛡️", color: "blue" }
    } else if (hasHighInnovation && hasHighIntegration && hasHighAutonomy) {
      return { name: "Innovation Leader", description: "You're pushing the boundaries with cutting-edge AI tools and teacher freedom to experiment.", icon: "🚀", color: "purple" }
    } else if (moderatePolicies.length >= selectedPolicies.length * 0.6) {
      return { name: "Balanced Implementation", description: "You're taking a measured approach that balances innovation with practical constraints.", icon: "⚖️", color: "green" }
    } else if (lowPolicies.length >= 3 || (!hasHighInfrastructure && !hasHighTraining)) {
      return { name: "Budget-Conscious", description: "You're focusing on low-cost, high-impact strategies that maximize value with limited resources.", icon: "💰", color: "yellow" }
    } else if (hasHighTraining && hasHighAutonomy) {
      return { name: "Teacher-Centered", description: "You're empowering educators with training and freedom to drive AI integration from the classroom.", icon: "👩‍🏫", color: "orange" }
    } else if (hasHighAccessibility && hasHighInfrastructure) {
      return { name: "Equity-Focused", description: "You're ensuring every student has access to high-quality AI tools regardless of their background.", icon: "🌟", color: "teal" }
    } else {
      return { name: "Exploratory Approach", description: "You're experimenting with different policy combinations to find what works best.", icon: "🔍", color: "gray" }
    }
  }

  // Generate strengths and weaknesses for each strategy
  const getStrengthsWeaknesses = (strategy) => {
    // Get policy intensity details for more specific explanations
    const highPolicies = selectedPolicies.filter(policyId => (policyIntensities[policyId] || 50) >= 70)
    const moderatePolicies = selectedPolicies.filter(policyId => (policyIntensities[policyId] || 50) >= 40 && (policyIntensities[policyId] || 50) < 70)
    const lowPolicies = selectedPolicies.filter(policyId => (policyIntensities[policyId] || 50) < 40)

    // Helper function to get policy names
    const getPolicyNames = (policyIds) => {
      return policyIds.map(id => policyDefinitions[id]?.name || id).join(', ')
    }

    const highPolicyNames = getPolicyNames(highPolicies)
    const moderatePolicyNames = getPolicyNames(moderatePolicies)
    const lowPolicyNames = getPolicyNames(lowPolicies)

    const strengthsWeaknessesMap = {
      "Safety-First Approach": {
        strengths: [
          { title: "Bulletproof Security", description: "Your high-intensity Student Protection, Model Evaluation, and Accessibility policies create unshakeable community trust through comprehensive data protection and rigorous AI tool evaluation." },
          { title: "Universal Access", description: "High Accessibility Standards ensure every student can safely use AI tools regardless of their disabilities, language barriers, or learning differences." },
          { title: "Regulatory Compliance", description: "Your strong emphasis on protection and evaluation policies exceeds all current and anticipated AI education regulations, protecting against legal risks." }
        ],
        weaknesses: [
          { title: "Innovation Bottleneck", description: "High-intensity Model Evaluation and Protection policies create extensive approval processes that may delay adoption of breakthrough AI educational tools." },
          { title: "Higher Costs", description: "Running multiple high-intensity protection, evaluation, and accessibility systems requires significant ongoing investment in compliance infrastructure." },
          { title: "Slower Adaptation", description: "Your conservative, safety-first approach may leave students less prepared for rapidly evolving AI landscape compared to districts with higher innovation policies." }
        ]
      },
      "Innovation Leader": {
        strengths: [
          { title: "Cutting-Edge Education", description: "Your high-intensity Innovation Sandbox and AI Integration policies ensure students experience the latest AI tools and develop skills for an AI-integrated future." },
          { title: "Teacher Empowerment", description: "High Educator Autonomy gives teachers freedom to experiment and customize AI tools for their specific student needs, fostering classroom innovation." },
          { title: "Competitive Advantage", description: "Your combination of high innovation, integration, and autonomy policies makes your district a model for other schools seeking effective AI education." }
        ],
        weaknesses: [
          { title: "Inconsistent Quality", description: "High Educator Autonomy combined with rapid Innovation Sandbox experimentation may create uneven experiences across different classrooms and teachers." },
          { title: "Higher Risk Profile", description: "High-intensity innovation policies prioritize speed over safety, potentially exposing students to unexpected issues with unproven technologies." },
          { title: "Resource Intensive", description: "Running high-intensity Innovation Sandbox and AI Integration policies requires substantial ongoing investment in tools, training, and infrastructure." }
        ]
      },
      "Balanced Implementation": {
        strengths: [
          { title: "Sustainable Progress", description: moderatePolicies.some(id => ['INFRA_INVEST', 'PD_FUNDS'].includes(id)) ? `Your moderate-intensity approach with key policies like ${moderatePolicyNames} ensures steady advancement in both technology and training without overwhelming teachers or budgets.` : moderatePolicyNames ? `Your moderate-intensity approach with ${moderatePolicyNames} ensures steady advancement without overwhelming teachers or budgets.` : "Your moderate-intensity approach ensures steady advancement without overwhelming teachers or budgets." },
          { title: "Stakeholder Buy-in", description: "Moderate policy intensities build consensus among parents, teachers, and administrators by avoiding extremes that might create resistance." },
          { title: "Risk Management", description: moderatePolicies.some(id => ['INNOV_SANDBOX', 'AI_INTEGRATION'].includes(id)) ? "By keeping innovation and integration policies at moderate levels, you reduce chances of costly mistakes while still making meaningful progress on AI education." : "By keeping most policies at moderate levels, you reduce chances of costly mistakes while still making meaningful progress on AI education." }
        ],
        weaknesses: [
          { title: "Slower Results", description: moderatePolicies.some(id => ['AI_INTEGRATION', 'INNOV_SANDBOX'].includes(id)) ? `Your moderate approach with ${moderatePolicyNames} may delay AI tool deployment and innovation compared to districts with higher-intensity strategies.` : moderatePolicyNames ? `Your moderate approach with ${moderatePolicyNames} may delay realization of AI education benefits compared to districts with higher-intensity strategies.` : "Your moderate approach across multiple policies may delay realization of AI education benefits compared to districts with higher-intensity strategies." },
          { title: "Missed Opportunities", description: "Moderate intensities might miss chances to leverage powerful synergies that emerge from high-intensity policy combinations." },
          { title: "Competitive Lag", description: "Other districts with bolder, higher-intensity strategies may pull ahead in AI education leadership while you're taking a measured approach." }
        ]
      },
      "Budget-Conscious": {
        strengths: [
          { title: "Financial Sustainability", description: "Your low-intensity approach avoids expensive policies like high-intensity Technology Infrastructure and Teacher Training, ensuring AI initiatives won't strain essential educational services or require major budget increases." },
          { title: "Gradual Learning", description: lowPolicyNames ? `By keeping ${lowPolicyNames} at low intensity, your district can learn from other schools' experiences before making major investments.` : "Low-intensity policies allow your district to learn from other schools' experiences before making major investments in expensive AI infrastructure or training." },
          { title: "Community Acceptance", description: "Your conservative policy intensities create minimal disruption, building trust and reducing resistance to AI education changes among parents and staff." }
        ],
        weaknesses: [
          { title: "Limited Impact", description: lowPolicyNames ? `Low-intensity policies like ${lowPolicyNames} may not produce meaningful improvements in student AI literacy or educational outcomes.` : "Low-intensity policies across multiple areas may not produce meaningful improvements in student AI literacy or educational outcomes." },
          { title: "Digital Divide", description: lowPolicies.some(id => ['INFRA_INVEST', 'AI_INTEGRATION'].includes(id)) ? "Your low-intensity Technology Infrastructure and AI Integration may leave students behind peers in districts with more robust AI programs." : "Your conservative approach may leave students behind peers in districts with more robust, high-intensity AI programs." },
          { title: "Teacher Frustration", description: lowPolicies.some(id => id === 'PD_FUNDS') ? "Low-intensity Teacher Training may leave educators feeling unsupported and unprepared for AI integration." : "Limited investment in teacher support may leave educators feeling unprepared for AI integration." }
        ]
      },
      "Teacher-Centered": {
        strengths: [
          { title: "Educator Expertise", description: selectedPolicies.some(id => id === 'PD_FUNDS' && (policyIntensities[id] || 50) >= 70) ? "Your high-intensity Teacher Training policy creates well-trained educators who become AI education innovators, able to adapt tools to specific student needs." : "Your focus on teacher development creates educators who can effectively integrate AI tools into their teaching practice." },
          { title: "Classroom Innovation", description: selectedPolicies.some(id => id === 'PD_FUNDS' && (policyIntensities[id] || 50) >= 70) && selectedPolicies.some(id => id === 'EDUC_AUTONOMY' && (policyIntensities[id] || 50) >= 70) ? "High Teacher Training combined with high Educator Autonomy enables creative AI applications that address specific learning challenges in each classroom." : "Your teacher-focused approach enables personalized AI applications that address specific classroom needs." },
          { title: "Professional Growth", description: selectedPolicies.some(id => id === 'PD_FUNDS' && (policyIntensities[id] || 50) >= 70) ? "Your significant investment in high-intensity Teacher Training improves job satisfaction, retention, and creates teacher leaders in AI education." : "Investment in teacher development improves job satisfaction and builds internal AI education expertise." }
        ],
        weaknesses: [
          { title: "Uneven Implementation", description: selectedPolicies.some(id => id === 'EDUC_AUTONOMY' && (policyIntensities[id] || 50) >= 70) ? "High Educator Autonomy means variation in teacher comfort levels may create inconsistent AI experiences across classrooms, despite good training." : "Variation in teacher comfort levels may create inconsistent AI experiences across classrooms." },
          { title: "Infrastructure Gaps", description: !selectedPolicies.some(id => id === 'INFRA_INVEST' && (policyIntensities[id] || 50) >= 70) ? "Your focus on teacher development over Technology Infrastructure may leave the technical foundation inadequate for advanced AI tools teachers want to use." : "Balancing teacher development with infrastructure needs requires careful coordination." },
          { title: "Scaling Challenges", description: selectedPolicies.some(id => id === 'EDUC_AUTONOMY' && (policyIntensities[id] || 50) >= 70) ? "High Educator Autonomy means individual teacher innovations may not translate effectively to district-wide implementation without coordination policies." : "Individual teacher innovations may require additional support to scale district-wide." }
        ]
      },
      "Equity-Focused": {
        strengths: [
          { title: "Universal Benefit", description: "Your high-intensity Accessibility Standards and Technology Infrastructure ensure every student gains access to powerful AI tools regardless of disability, language, or learning style." },
          { title: "Community Trust", description: "High Accessibility Standards demonstrate commitment to equity, building strong support from diverse families and community groups throughout your district." },
          { title: "Future-Ready Infrastructure", description: "Your high-intensity Technology Infrastructure combined with strong accessibility creates a robust, accessible foundation that supports long-term AI education growth." }
        ],
        weaknesses: [
          { title: "Implementation Complexity", description: "High-intensity Accessibility Standards require sophisticated technical solutions and specialized training to meet diverse needs across your student population." },
          { title: "Higher Costs", description: "Running high-intensity Technology Infrastructure and Accessibility policies demands significant upfront and ongoing investment in specialized equipment and support." },
          { title: "Slower Rollout", description: "Your high Accessibility Standards mean ensuring equity for all students may delay AI tool deployment compared to districts with simpler, lower-intensity approaches." }
        ]
      }
    }

    return strengthsWeaknessesMap[strategy.name] || {
      strengths: [
        { title: "Flexible Approach", description: `Your experimental mix${highPolicyNames ? ` with high-intensity ${highPolicyNames}` : ''}${moderatePolicyNames ? `, moderate-intensity ${moderatePolicyNames}` : ''}${lowPolicyNames ? `, and low-intensity ${lowPolicyNames}` : ''} allows for learning and adaptation as AI education evolves.` },
        { title: "Diverse Coverage", description: `By selecting ${getPolicyNames(selectedPolicies)}, you're creating a broad foundation for AI integration across multiple aspects of education.` },
        { title: "Stakeholder Engagement", description: "Your varied intensity approach across different policies addresses different stakeholder priorities and concerns without committing fully to any extreme position." }
      ],
      weaknesses: [
        { title: "Unclear Focus", description: "Your mixed approach across different policy intensities may lead to scattered efforts and suboptimal resource allocation without a clear strategic vision." },
        { title: "Coordination Challenges", description: `Managing policies like ${getPolicyNames(selectedPolicies)} at different intensities may create implementation conflicts and confusion among staff and administrators.` },
        { title: "Inconsistent Outcomes", description: "Without strategic coherence between your different policy intensities, results may vary unpredictably across different areas of your district." }
      ]
    }
  }

  // Detect policy synergies and tensions with comprehensive analysis
  const detectSynergiesAndTensions = () => {
    const synergies = []
    const tensions = []
    
    // POWERFUL SYNERGIES

    // Teacher Excellence Synergy (High Training + High Digital Citizenship)
    if (isHigh('PD_FUNDS') && isHigh('DIGITAL_CITIZEN')) {
      synergies.push({
        name: "The Teacher Excellence Foundation",
        description: "High Teacher Training combined with strong Digital Citizenship creates educators who are both AI-skilled and ethically grounded.",
        impact: "high",
        policies: ["Teacher Training", "Digital Citizenship"],
        outcome: "Teachers become AI education leaders who can guide students in both technical skills and ethical AI use",
        warning: null,
        emoji: "👩‍🏫"
      })
    }

    // AI Safety & Ethics Alliance (High Protection + High Digital Citizenship + High Evaluation)
    if (isHigh('PROTECT_STD') && isHigh('DIGITAL_CITIZEN') && isHigh('MODEL_EVAL_STD')) {
      synergies.push({
        name: "The AI Safety & Ethics Alliance",
        description: "High Student Protection, Digital Citizenship, and Model Evaluation create a comprehensive ethical AI framework.",
        impact: "high",
        policies: ["Student Protection", "Digital Citizenship", "Model Evaluation Standards"],
        outcome: "Students learn to use AI safely and ethically while being protected by robust systems",
        warning: null,
        emoji: "🛡️"
      })
    }

    // The Integration Powerhouse (High AI Integration + High Training)
    if (isHigh('AI_INTEGRATION') && isHigh('PD_FUNDS')) {
      synergies.push({
        name: "The Integration Powerhouse",
        description: "High AI Integration backed by expert Teacher Training creates seamless AI experiences across all subjects.",
        impact: "high",
        policies: ["AI Integration", "Teacher Training"],
        outcome: "Students experience AI as a natural part of learning, with teachers confidently guiding them through AI-enhanced lessons",
        warning: "Requires ongoing investment to maintain teacher expertise as AI tools evolve rapidly",
        emoji: "⚡"
      })
    }

    // The Quality Assurance Shield (High Protection + High Evaluation)
    if (isHigh('PROTECT_STD') && isHigh('MODEL_EVAL_STD')) {
      synergies.push({
        name: "The Quality Assurance Shield",
        description: "High Student Protection combined with rigorous Model Evaluation creates an impenetrable barrier against harmful or ineffective AI tools.",
        impact: "high",
        policies: ["Student Protection", "Model Evaluation Standards"],
        outcome: "Only the safest, most effective AI tools reach students, building complete stakeholder confidence",
        warning: "May significantly slow adoption of new AI innovations due to extensive vetting processes",
        emoji: "🔒"
      })
    }

    // The AI Excellence Triangle
    if (isHigh('INFRA_INVEST') && isHigh('PD_FUNDS') && isHigh('AI_INTEGRATION')) {
        synergies.push({
        name: "The AI Excellence Triangle",
        description: "Expert teachers use cutting-edge technology to create transformative learning experiences. Students don't just learn about AI - they live in an AI-enhanced educational environment.",
        impact: "transformational",
        policies: ["Technology Infrastructure", "Teacher Training", "AI Integration"],
        outcome: "Students experience seamless AI integration across all subjects with expert teacher guidance, preparing them for an AI-integrated future",
        warning: "However, this triple investment creates massive budget pressure that few districts can sustain",
        emoji: "🔺"
      })
    }

    // The Safety First Alliance
    if (isHigh('PROTECT_STD') && isHigh('MODEL_EVAL_STD') && isHigh('ACCESS_STD')) {
        synergies.push({
        name: "The Safety First Alliance",
        description: "Bulletproof AI systems with comprehensive protection build unshakeable community trust, making it easier to gain support for AI initiatives.",
        impact: "high",
        policies: ["Student Protection", "Model Evaluation Standards", "Accessibility Standards"],
        outcome: "Parents, teachers, and students feel completely safe using AI tools, creating strong community support",
        warning: "The catch: this ultra-cautious approach can slow innovation to a crawl",
        emoji: "🛡️"
      })
    }

    // The Innovation Engine
    if (isHigh('INNOV_SANDBOX') && isModerate('EDUC_AUTONOMY') && isHigh('PD_FUNDS')) {
        synergies.push({
        name: "The Innovation Engine",
        description: "Well-trained teachers with reasonable freedom become innovation laboratories. They can safely experiment with cutting-edge AI while avoiding dangerous pitfalls.",
        impact: "high",
        policies: ["Innovation & Pilot Programs", "Educator Autonomy", "Teacher Training"],
        outcome: "Teachers become AI education pioneers, developing best practices that spread district-wide",
        warning: "Works best when autonomy is moderate rather than complete - some guardrails prevent costly mistakes",
        emoji: "💡"
      })
    }

    // The Digital Equity Power Couple
    if (isHigh('INFRA_INVEST') && isHigh('ACCESS_STD')) {
        synergies.push({
        name: "The Digital Equity Power Couple",
        description: "Robust technology infrastructure becomes truly transformative when paired with accessibility requirements. The synergy amplifies both policies.",
        impact: "high",
        policies: ["Technology Infrastructure", "Accessibility Standards"],
        outcome: "Every student - regardless of disability, language, or learning style - gains access to the same powerful AI tools",
        warning: null,
        emoji: "🌟"
      })
    }

    // The Responsible Innovation Balance
    if (isModerate('INNOV_SANDBOX') && isModerate('MODEL_EVAL_STD') && isHigh('DIGITAL_CITIZEN')) {
      synergies.push({
        name: "The Responsible Innovation Balance",
        description: "Smart risk-taking with reasonable safety testing while students learn to critically evaluate AI systems.",
        impact: "moderate",
        policies: ["Innovation & Pilot Programs", "Model Evaluation Standards", "Digital Citizenship"],
        outcome: "Creates innovation-ready graduates who can adapt to technological change while making ethical decisions",
        warning: null,
        emoji: "⚖️"
      })
    }

    // The Budget-Friendly Foundation
    if (isModerate('INFRA_INVEST') && isModerate('PD_FUNDS') && isLow('AI_INTEGRATION')) {
      synergies.push({
        name: "The Budget-Friendly Foundation",
        description: "When resources are limited, this combination maximizes impact. Decent technology and basic teacher preparation enable selective AI use.",
        impact: "moderate",
        policies: ["Technology Infrastructure", "Teacher Training", "AI Integration"],
        outcome: "Not revolutionary, but sustainable and effective for cash-strapped districts",
        warning: null,
        emoji: "💰"
      })
    }

    // MAJOR TENSIONS

    // The Ethical Complexity Challenge (High Digital Citizenship + High Integration + High Protection)
    if (isHigh('DIGITAL_CITIZEN') && isHigh('AI_INTEGRATION') && isHigh('PROTECT_STD')) {
      tensions.push({
        name: "The Ethical Complexity Challenge",
        description: "Teaching students to think critically about AI while using it extensively and protecting their data creates complex ethical navigation challenges.",
        impact: "medium",
        policies: ["Digital Citizenship", "AI Integration", "Student Protection"],
        outcome: "Students may become confused by conflicting messages about AI being both powerful/useful and potentially dangerous",
        note: "Requires careful curriculum design to balance AI enthusiasm with critical thinking",
        emoji: "🤔"
      })
    }

    // The Speed vs Safety Dilemma
    if (isHigh('INNOV_SANDBOX') && isHigh('MODEL_EVAL_STD')) {
        tensions.push({
        name: "The Speed vs Safety Dilemma",
        description: "Innovation demands rapid experimentation with unproven technologies, while evaluation requires lengthy testing and review. High levels of both create institutional paralysis.",
        impact: "critical",
        policies: ["Innovation & Pilot Programs", "Model Evaluation Standards"],
        outcome: "Exciting new AI tools get stuck in approval processes for months or years, creating gridlock",
        note: "Moderate innovation with moderate evaluation can coexist, but high levels create gridlock",
        emoji: "⚡"
      })
    }

    // The Freedom vs Protection Conflict
    if (isHigh('EDUC_AUTONOMY') && isHigh('PROTECT_STD')) {
        tensions.push({
        name: "The Freedom vs Protection Conflict",
        description: "Teachers want freedom to choose the best AI tools for their students, but strict data protection limits their options to pre-approved systems.",
        impact: "high",
        policies: ["Educator Autonomy", "Student Protection"],
        outcome: "High autonomy encourages experimentation that may violate privacy rules, while high protection creates restrictive policies that frustrate innovative educators",
        note: "Moderate levels reduce this tension significantly",
        emoji: "⚖️"
      })
    }

    // The Innovation vs Accessibility Clash
    if (isHigh('INNOV_SANDBOX') && isHigh('ACCESS_STD')) {
      tensions.push({
        name: "The Innovation vs Accessibility Clash",
        description: "Cutting-edge AI tools often launch with limited accessibility features, creating conflict between adopting breakthrough technology and serving all students equitably.",
        impact: "high",
        policies: ["Innovation & Pilot Programs", "Accessibility Standards"],
        outcome: "Innovation pushes toward experimental tools that may exclude students with disabilities, while accessibility requirements reject promising technologies that aren't yet inclusive",
        note: null,
        emoji: "🔄"
      })
    }

    // The Budget Death Spiral
    const highCostPolicies = selectedPolicies.filter(id => {
      const isHighCost = ['INFRA_INVEST', 'PD_FUNDS', 'INNOV_SANDBOX', 'AI_INTEGRATION'].includes(id)
      const isHighIntensity = (policyIntensities[id] || 50) >= 70
      return isHighCost && isHighIntensity
    })
    
    if (highCostPolicies.length >= 3) {
      tensions.push({
        name: "The Budget Death Spiral",
        description: "The 'do everything' approach creates unsustainable costs. Each policy seems reasonable individually, but combined high implementation levels create budget crises.",
        impact: "critical",
        policies: highCostPolicies.map(id => policyDefinitions[id]?.name || id),
        outcome: "Districts may have to choose between AI excellence and fundamental needs like adequate staffing or building maintenance",
        note: "Threatens basic educational services",
        emoji: "💸"
      })
    }

    // The Privacy vs Personalization Paradox
    if (isHigh('PROTECT_STD') && isHigh('AI_INTEGRATION')) {
        tensions.push({
        name: "The Privacy vs Personalization Paradox",
        description: "AI systems need student data to personalize learning effectively, but strict privacy protection limits data collection.",
        impact: "high",
        policies: ["Student Protection", "AI Integration"],
        outcome: "High integration demands AI that knows students deeply, while high protection restricts the data access that makes AI intelligent",
        note: "This tension exists at all levels but becomes severe when both policies are implemented intensively",
        emoji: "🔐"
      })
    }

    // The Innovation vs Integration Mismatch
    if (isHigh('INNOV_SANDBOX') && isLow('AI_INTEGRATION')) {
      tensions.push({
        name: "Innovation Theater",
        description: "Schools that aggressively pilot new AI technologies but rarely implement them widely create 'innovation theater' - lots of exciting experiments that never benefit most students.",
        impact: "medium",
        policies: ["Innovation & Pilot Programs", "AI Integration"],
        outcome: "Innovation programs generate enthusiasm and media attention, but most students miss out on AI advantages",
        note: null,
        emoji: "🎭"
      })
    }

    // The Preparation Gap
    if (isLow('PD_FUNDS') && (isHigh('AI_INTEGRATION') || isHigh('INNOV_SANDBOX'))) {
      const conflictingPolicy = isHigh('AI_INTEGRATION') ? 'AI Integration' : 'Innovation & Pilot Programs'
        tensions.push({
        name: "The Preparation Gap",
        description: "Ambitious AI integration or innovation without adequate teacher training creates implementation chaos and dangerous experimentation without proper guidance.",
        impact: "critical",
        policies: ["Teacher Training", conflictingPolicy],
        outcome: "Teachers struggle with AI tools, leading to poor student experiences, resistance to technology, and potential safety issues",
        note: "High expectations with low investment creates teacher frustration and student disappointment",
        emoji: "🎯"
      })
    }
    
    return { synergies, tensions }
  }

  // Generate feedback loops analysis with comprehensive policy-specific loops
  const generateFeedbackLoops = () => {
    const loops = []
    
    // REINFORCING LOOPS (R) - Amplifying cycles

    // R1: Teacher AI Training Programs Momentum Loop
    if (isHigh('PD_FUNDS')) {
      loops.push({
        type: 'reinforcing',
        name: 'Teacher AI Training Programs Momentum Loop',
        description: 'High Teacher Training → Teachers Become AI Experts → Exceptional Student AI Literacy → Parent Satisfaction → Board Support → Increased Funding for Teacher Training',
        nodes: ['Teacher Training Investment', 'Teacher AI Expertise', 'Student AI Literacy', 'Parent Satisfaction', 'Board Support'],
        strength: 'high',
        explanation: 'Success with teacher training creates demand for even more comprehensive teacher development.',
        realWorldExample: 'Teachers who master AI tools become advocates, convincing administrators to fund even more training programs.'
      })
    }

    // R2: AI Infrastructure Investment Success Spiral
    if (isHigh('INFRA_INVEST')) {
      loops.push({
        type: 'reinforcing',
        name: 'AI Infrastructure Investment Success Spiral',
        description: 'High Infrastructure Investment → Reliable AI Systems → High Teacher Satisfaction → Teacher Advocacy → Community Support → Budget Approval for More Infrastructure',
        nodes: ['Infrastructure Investment', 'Reliable AI Systems', 'Teacher Satisfaction', 'Community Support', 'Budget Approval'],
        strength: 'high',
        explanation: 'When technology works well, teachers become champions who secure more technology funding.',
        realWorldExample: 'Fast, reliable AI systems make teachers enthusiastic advocates who convince the board to approve more technology spending.'
      })
    }

    // R3: Student Data Protection Standards Trust Loop
    if (isHigh('PROTECT_STD')) {
      loops.push({
        type: 'reinforcing',
        name: 'Student Data Protection Standards Trust Loop',
        description: 'High Data Protection → No Privacy Breaches → Community Trust → Support for AI Expansion → More Data Collection → Need for Stronger Protection',
        nodes: ['Data Protection Standards', 'Community Trust', 'AI Expansion Support', 'Data Collection', 'Protection Requirements'],
        strength: 'medium',
        explanation: 'Strong privacy protection enables broader AI adoption, which requires even more robust protection.',
        realWorldExample: 'Zero privacy incidents build trust that enables district-wide AI adoption, requiring even stronger security measures.'
      })
    }

    // R5: AI Integration in Schools Excellence Loop
    if (isHigh('AI_INTEGRATION')) {
      loops.push({
        type: 'reinforcing',
        name: 'AI Integration Excellence Loop',
        description: 'High AI Integration → Students Develop Advanced AI Skills → Students Outperform Other Districts → Media Recognition → Attracts Families → Resources for More Integration',
        nodes: ['AI Integration', 'Advanced Student Skills', 'District Recognition', 'Family Attraction', 'Resource Growth'],
        strength: 'high',
        explanation: 'Successful AI integration creates a reputation that brings resources for expansion.',
        realWorldExample: 'Students with AI skills outperform peers, attracting families who want their children in the "AI district."'
      })
    }

    // R6: Teacher AI Autonomy Innovation Loop
    if (isHigh('EDUC_AUTONOMY') && isHigh('PD_FUNDS')) {
      loops.push({
        type: 'reinforcing',
        name: 'Teacher AI Autonomy Innovation Loop',
        description: 'High Teacher Autonomy → Teachers Discover Excellent AI Tools → Student Success → Administrative Recognition → Even More Teacher Autonomy',
        nodes: ['Teacher Autonomy', 'AI Tool Discovery', 'Student Success', 'Administrative Recognition', 'Increased Freedom'],
        strength: 'medium',
        explanation: 'When teacher freedom leads to success, administrators grant even more freedom.',
        realWorldExample: 'A teacher finds an amazing AI tool that boosts test scores, leading to district-wide teacher choice policies.'
      })
    }

    // R7: Digital Citizenship Curriculum Empowerment Loop
    if (isHigh('DIGITAL_CITIZEN')) {
      loops.push({
        type: 'reinforcing',
        name: 'Digital Citizenship Empowerment Loop',
        description: 'High Digital Citizenship → Students Become AI Ethics Advocates → Students Influence Parents → Community Demand for Responsible AI → Support for Stronger Digital Citizenship',
        nodes: ['Digital Citizenship Curriculum', 'Student AI Ethics Knowledge', 'Parent Influence', 'Community Demand', 'Curriculum Support'],
        strength: 'medium',
        explanation: 'AI-literate students drive community demand for even more comprehensive AI ethics education.',
        realWorldExample: 'Students teach parents about AI bias, leading to community pressure for stronger ethics education in schools.'
      })
    }

    // BALANCING LOOPS (B) - Self-correcting cycles

    // B1: AI Infrastructure Investment Reality Check
    if (isHigh('INFRA_INVEST') && isHigh('PD_FUNDS')) {
      loops.push({
        type: 'balancing',
        name: 'AI Infrastructure Investment Reality Check',
        description: 'High Infrastructure + Training Investment → Budget Strain → Board Pressure → Reduced Technology Spending → Stable Finances → Gradual Increase',
        nodes: ['High Investment', 'Budget Strain', 'Board Pressure', 'Spending Reduction', 'Financial Stability'],
        strength: 'high',
        explanation: 'Financial limits naturally moderate technology spending to sustainable levels.',
        realWorldExample: 'Ambitious AI spending forces budget cuts to sports and arts, leading to community pressure to moderate technology investment.'
      })
    }

    // B3: AI Integration in Schools Adaptation Limit
    if (isHigh('AI_INTEGRATION') && isLow('PD_FUNDS')) {
      loops.push({
        type: 'balancing',
        name: 'AI Integration Adaptation Limit',
        description: 'High AI Integration → System Complexity → Implementation Problems → Reduced Effectiveness → Pressure to Simplify → Lower Integration',
        nodes: ['High AI Integration', 'System Complexity', 'Implementation Problems', 'Reduced Effectiveness', 'Integration Simplification'],
        strength: 'high',
        explanation: 'Without adequate training, ambitious AI integration creates teacher resistance that naturally limits the policy\'s effectiveness.',
        realWorldExample: 'Teachers struggling with multiple AI tools start avoiding them, forcing administrators to scale back integration requirements.'
      })
    }

    // B4: Student Data Protection Standards Political Balance
    if (isLow('PROTECT_STD') && isHigh('AI_INTEGRATION')) {
      loops.push({
        type: 'balancing',
        name: 'Data Protection Political Balance',
        description: 'Low Data Protection → Privacy Violations → Public Outcry → Strict Protection Policies → Limited AI Functionality → Pressure for Balance → Moderate Protection',
        nodes: ['Low Protection', 'Privacy Violations', 'Public Outcry', 'Strict Policies', 'Limited Functionality'],
        strength: 'medium',
        explanation: 'Privacy scandals trigger corrective policies that eventually moderate toward balanced approaches.',
        realWorldExample: 'A student data breach forces extreme privacy policies that limit AI tools, eventually leading to balanced protection measures.'
      })
    }

    // B6: Innovation Pilot Programs Safety Response
    if (isHigh('INNOV_SANDBOX') && isLow('MODEL_EVAL_STD')) {
      loops.push({
        type: 'balancing',
        name: 'Innovation Safety Response Loop',
        description: 'High Innovation → Security Incidents → Public Concern → Administrative Caution → Reduced Experimentation → Pressure for Innovation → Careful Expansion',
        nodes: ['High Innovation', 'Security Incidents', 'Public Concern', 'Administrative Caution', 'Reduced Experimentation'],
        strength: 'medium',
        explanation: 'Problems with innovation naturally trigger safety responses that eventually rebalance.',
        realWorldExample: 'An AI tool security breach forces conservative policies, but innovation pressure eventually leads to careful re-expansion.'
      })
    }

    // Cross-Policy Interaction Loops

    // R13: The Infrastructure-Training Amplification Loop
    if (isHigh('INFRA_INVEST') && isHigh('PD_FUNDS')) {
      loops.push({
        type: 'reinforcing',
        name: 'Infrastructure-Training Amplification Loop',
        description: 'High Infrastructure + High Training → Exceptional AI Implementation → Student Success → Community Support → Increased Funding → Even Higher Investment in Both',
        nodes: ['Infrastructure + Training', 'Exceptional Implementation', 'Student Success', 'Community Support', 'Increased Funding'],
        strength: 'high',
        explanation: 'Infrastructure and training investments amplify each other\'s effectiveness.',
        realWorldExample: 'Great technology plus expert teachers create amazing results that convince the community to fund both even more.'
      })
    }

    // B10: The Innovation-Evaluation Tension Balance
    if (isHigh('INNOV_SANDBOX') && isHigh('MODEL_EVAL_STD')) {
      loops.push({
        type: 'balancing',
        name: 'Innovation-Evaluation Tension Balance',
        description: 'High Innovation creates pressure for faster approval, conflicting with High Evaluation → Negotiated Compromise → Moderate levels of both',
        nodes: ['Innovation Pressure', 'Evaluation Delays', 'Institutional Tension', 'Negotiated Compromise', 'Moderate Policies'],
        strength: 'medium',
        explanation: 'Innovation and evaluation naturally moderate each other through institutional tension.',
        realWorldExample: 'Teachers want new AI tools fast, but safety requires slow testing, leading to balanced approval processes.'
      })
    }

    // B12: The Integration-Training Sync Loop
    if (isHigh('AI_INTEGRATION') && isLow('PD_FUNDS')) {
      loops.push({
        type: 'balancing',
        name: 'Integration-Training Sync Loop',
        description: 'High Integration without adequate Training → Implementation Failures → Reduced Integration until Training Catches Up → Synchronized Integration with Training',
        nodes: ['High Integration', 'Implementation Failures', 'Integration Reduction', 'Training Catchup', 'Synchronized Policies'],
        strength: 'high',
        explanation: 'Integration and training naturally synchronize to sustainable levels.',
        realWorldExample: 'Ambitious AI rollout fails without teacher preparation, forcing slower integration that matches training capacity.'
      })
    }

    return loops
  }

  let strategy, strengthsWeaknesses, synergies, tensions, feedbackLoops
  
  // Get strategy with error handling
  try {
    strategy = getStrategy()
  } catch (error) {
    console.error('Error getting strategy:', error)
    strategy = { name: "Exploratory Approach", description: "You're experimenting with different policy combinations to find what works best.", icon: "🔍", color: "gray" }
  }

  // Get strengths/weaknesses with error handling
  try {
    strengthsWeaknesses = getStrengthsWeaknesses(strategy)
  } catch (error) {
    console.error('Error getting strengths/weaknesses:', error)
    strengthsWeaknesses = { strengths: [], weaknesses: [] }
  }

  // Get synergies and tensions with error handling
  try {
    const synergyTensionResult = detectSynergiesAndTensions()
    synergies = synergyTensionResult.synergies || []
    tensions = synergyTensionResult.tensions || []
  } catch (error) {
    console.error('Error detecting synergies/tensions:', error)
    synergies = []
    tensions = []
  }

  // Get feedback loops with error handling
  try {
    feedbackLoops = generateFeedbackLoops()
    console.log('Feedback loops generated:', feedbackLoops)
  } catch (error) {
    console.error('Error generating feedback loops:', error)
    feedbackLoops = []
  }

  // Safety check
  if (!strategy) {
  return (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Analysis Error</h3>
          <p className="text-slate-600 mb-4">Unable to analyze your policy configuration.</p>
          <button onClick={onClose} className="px-4 py-2 bg-purple-600 text-white rounded-lg">
            Close
          </button>
        </div>
      </div>
    )
  }


  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-[90vw] h-[85vh] max-w-[1200px] flex flex-col overflow-hidden">
          {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 flex justify-between items-center">
            <div>
            <h2 className="text-2xl font-bold">Policy Impact Analysis</h2>
            <p className="text-purple-100 mt-1">Analysis of your {selectedPolicies.length} policy choices</p>
            </div>
            <button
              onClick={onClose}
            className="text-white hover:text-purple-200 transition-colors p-2 rounded-full hover:bg-white/10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Strategy Header */}
            <div className={`bg-gradient-to-r ${
              strategy.color === 'blue' ? 'from-blue-50 to-blue-100 border-blue-200' :
              strategy.color === 'purple' ? 'from-purple-50 to-purple-100 border-purple-200' :
              strategy.color === 'green' ? 'from-green-50 to-green-100 border-green-200' :
              strategy.color === 'yellow' ? 'from-yellow-50 to-yellow-100 border-yellow-200' :
              strategy.color === 'orange' ? 'from-orange-50 to-orange-100 border-orange-200' :
              strategy.color === 'teal' ? 'from-teal-50 to-teal-100 border-teal-200' :
              'from-gray-50 to-gray-100 border-gray-200'
            } rounded-lg p-6 border`}>
              <div className="flex items-center space-x-4 mb-4">
                <div className="text-4xl">{strategy.icon}</div>
              <div>
                  <h3 className="text-2xl font-bold text-slate-800">Your District's AI Strategy: {strategy.name}</h3>
                  <p className="text-slate-600 text-lg">{strategy.description}</p>
                </div>
                </div>
              </div>

            {/* Strengths and Weaknesses Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="text-xl font-bold text-green-700 mb-4 flex items-center">
                  <span className="mr-2">✅</span>Strategic Strengths
                  </h4>
                  <div className="space-y-4">
                  {(strengthsWeaknesses?.strengths || []).map((strength, index) => (
                    <div key={index} className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <h5 className="font-semibold text-green-800 mb-2">{strength.title}</h5>
                      <p className="text-green-700 text-sm leading-relaxed">{strength.description}</p>
                        </div>
                    ))}
                        </div>
              </div>

                        <div>
                <h4 className="text-xl font-bold text-orange-700 mb-4 flex items-center">
                  <span className="mr-2">⚠️</span>Strategic Weaknesses
                  </h4>
                  <div className="space-y-4">
                  {(strengthsWeaknesses?.weaknesses || []).map((weakness, index) => (
                    <div key={index} className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                      <h5 className="font-semibold text-orange-800 mb-2">{weakness.title}</h5>
                      <p className="text-orange-700 text-sm leading-relaxed">{weakness.description}</p>
                      </div>
                      ))}
                </div>
                </div>
              </div>

            {/* Policy Summary */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h4 className="text-xl font-bold text-slate-800 mb-4">Your Policy Configuration</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedPolicies.map(policyId => {
                  const policy = policyDefinitions[policyId]
                  const intensity = policyIntensities[policyId] || 50
                  return (
                    <div key={policyId} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <h5 className="font-semibold text-slate-800 mb-2">{policy?.name || policyId}</h5>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">Intensity:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                          intensity >= 70 ? 'bg-red-100 text-red-800' :
                          intensity >= 40 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                          {intensity >= 70 ? 'High' : intensity >= 40 ? 'Moderate' : 'Low'} ({intensity}%)
                                </span>
                  </div>
                </div>
                  )
                })}
                      </div>
                  </div>

            {/* Policy Synergies and Tensions */}
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h4 className="text-2xl font-bold text-slate-800 mb-2">Policy Synergies & Tensions</h4>
                <p className="text-slate-600">How your policy choices interact and influence each other</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Synergies Section */}
                <div>
                  <h5 className="text-xl font-bold text-green-700 mb-4 flex items-center">
                    <span className="mr-2">🤝</span>Policy Synergies
                  </h5>
                  {synergies && synergies.length > 0 ? (
                  <div className="space-y-4">
                      {synergies.map((synergy, index) => (
                        <div key={index} className="bg-green-50 rounded-lg p-5 border border-green-200 shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex items-start space-x-3 mb-3">
                            <div className="text-3xl">{synergy.emoji}</div>
                            <div className="flex-1">
                              <h6 className="font-bold text-lg text-green-800 mb-2">{synergy.name}</h6>
                              <div className="flex flex-wrap gap-2 mb-3">
                                {synergy.policies.map((policy, pIndex) => (
                                  <span key={pIndex} className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                                    {policy}
                              </span>
                                ))}
                      </div>
                  </div>
                </div>
                          <p className="text-green-700 text-sm leading-relaxed mb-3">{synergy.description}</p>
                          <div className="bg-green-100 rounded-lg p-3 border border-green-200 mb-3">
                            <div className="text-xs font-bold text-green-800 mb-1">Specific Outcome:</div>
                            <div className="text-xs text-green-700">{synergy.outcome}</div>
                      </div>
                            {synergy.warning && (
                            <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                              <div className="text-xs font-bold text-yellow-800 mb-1">⚠️ Important Note:</div>
                              <div className="text-xs text-yellow-700">{synergy.warning}</div>
                  </div>
                            )}
                      </div>
                    ))}
                  </div>
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-6 text-center">
                      <div className="text-4xl mb-3">🤷‍♂️</div>
                      <p className="text-gray-600 text-sm">No powerful synergies detected with your current policy combination. Try increasing intensities of related policies!</p>
                </div>
                  )}
              </div>

                {/* Tensions Section */}
              <div>
                  <h5 className="text-xl font-bold text-red-700 mb-4 flex items-center">
                    <span className="mr-2">⚡</span>Policy Tensions
                  </h5>
                  {tensions && tensions.length > 0 ? (
                    <div className="space-y-4">
                      {tensions.map((tension, index) => (
                        <div key={index} className="bg-red-50 rounded-lg p-5 border border-red-200 shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex items-start space-x-3 mb-3">
                            <div className="text-3xl">{tension.emoji}</div>
                            <div className="flex-1">
                              <h6 className="font-bold text-lg text-red-800 mb-2">{tension.name}</h6>
                              <div className="flex flex-wrap gap-2 mb-3">
                                {tension.policies.map((policy, pIndex) => (
                                  <span key={pIndex} className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                                    {policy}
                        </span>
                        ))}
                            </div>
                              <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                tension.impact === 'critical' ? 'bg-red-200 text-red-800' :
                                tension.impact === 'high' ? 'bg-orange-200 text-orange-800' :
                                'bg-yellow-200 text-yellow-800'
                              }`}>
                                {tension.impact === 'critical' ? '🚨 CRITICAL' : 
                                 tension.impact === 'high' ? '⚠️ HIGH' : 
                                 tension.impact === 'medium' ? '⚡ MEDIUM' : '📝 LOW'} Impact
                              </span>
                    </div>
                    </div>
                          <p className="text-red-700 text-sm leading-relaxed mb-3">{tension.description}</p>
                          <div className="bg-red-100 rounded-lg p-3 border border-red-200 mb-3">
                            <div className="text-xs font-bold text-red-800 mb-1">Potential Consequence:</div>
                            <div className="text-xs text-red-700">{tension.outcome}</div>
                    </div>
                          {tension.note && (
                            <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
                              <div className="text-xs font-bold text-orange-800 mb-1">💡 Key Insight:</div>
                              <div className="text-xs text-orange-700">{tension.note}</div>
                  </div>
                            )}
                    </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-6 text-center">
                      <div className="text-4xl mb-3">😌</div>
                      <p className="text-gray-600 text-sm">No major tensions detected. Your policies work well together!</p>
                    </div>
                  )}
                  </div>
                </div>
              </div>

            {/* Feedback Loops Analysis */}
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h4 className="text-2xl font-bold text-slate-800 mb-2">Feedback Loops</h4>
                <p className="text-slate-600">How your policies create self-reinforcing or self-balancing cycles in your system</p>
              </div>
              
              {feedbackLoops && feedbackLoops.length > 0 ? (
                <div className="space-y-6">
                  {feedbackLoops.map((loop, index) => (
                    <div key={index} className={`rounded-lg p-6 border-2 ${
                      loop.type === 'reinforcing' ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'
                    }`}>
                      <div className="flex items-center justify-between mb-4">
                        <h5 className={`text-xl font-bold ${
                          loop.type === 'reinforcing' ? 'text-green-800' : 'text-orange-800'
                        }`}>
                          {loop.name}
                        </h5>
                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                          loop.type === 'reinforcing' ? 'bg-green-200 text-green-800' : 'bg-orange-200 text-orange-800'
                        }`}>
                          {loop.type === 'reinforcing' ? '🔄 Reinforcing' : '⚖️ Balancing'} Loop
                        </span>
                      </div>
                      
                      <p className={`text-sm leading-relaxed mb-4 ${
                        loop.type === 'reinforcing' ? 'text-green-700' : 'text-orange-700'
                      }`}>
                        {loop.description}
                      </p>

                      {/* Optimized Layout: Diagram Left, Explanations Right */}
                      <div className="bg-white rounded-lg p-6 border border-gray-200 mb-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Left: Circular Flow Diagram */}
                          <div>
                            <h6 className="text-sm font-semibold text-gray-700 mb-4 text-center">Feedback Loop Flow</h6>
                            <div className="relative w-full h-80 flex items-center justify-center">
                              {/* Circular SVG Container */}
                              <svg viewBox="0 0 400 400" className="w-full h-full">
                                {/* Background Circle */}
                                <circle
                                  cx="200"
                                  cy="200"
                                  r="150"
                                  fill="none"
                                  stroke={loop.type === 'reinforcing' ? '#10b981' : '#f59e0b'}
                                  strokeWidth="3"
                                  opacity="0.5"
                                />
                                
                                {/* Position nodes around the circle */}
                                {loop.nodes.map((node, nodeIndex) => {
                                  const angle = (nodeIndex * 360) / loop.nodes.length
                                  const radian = (angle - 90) * (Math.PI / 180) // Start from top
                                  const x = 200 + 150 * Math.cos(radian)
                                  const y = 200 + 150 * Math.sin(radian)
                                  
                                  // Split long text into multiple lines
                                  const words = node.split(' ')
                                  const line1 = words.slice(0, Math.ceil(words.length / 2)).join(' ')
                                  const line2 = words.slice(Math.ceil(words.length / 2)).join(' ')
                                  
                                  return (
                                    <g key={nodeIndex}>
                                      {/* Node Background */}
                                      <rect
                                        x={x - 50}
                                        y={y - 20}
                                        width="100"
                                        height="40"
                                        rx="20"
                                        fill={loop.type === 'reinforcing' ? '#f0fdf4' : '#fffbeb'}
                                        stroke={loop.type === 'reinforcing' ? '#10b981' : '#f59e0b'}
                                        strokeWidth="2"
                                      />
                                      {/* Node Text - First Line */}
                                      <text
                                        x={x}
                                        y={y - 4}
                                        textAnchor="middle"
                                        className={`text-xs font-medium ${
                                          loop.type === 'reinforcing' ? 'fill-green-800' : 'fill-orange-800'
                                        }`}
                                      >
                                        {line1}
                                      </text>
                                      {/* Node Text - Second Line (if needed) */}
                                      {line2 && (
                                        <text
                                          x={x}
                                          y={y + 8}
                                          textAnchor="middle"
                                          className={`text-xs font-medium ${
                                            loop.type === 'reinforcing' ? 'fill-green-800' : 'fill-orange-800'
                                          }`}
                                        >
                                          {line2}
                                        </text>
                                      )}
                                    </g>
                                  )
                                })}
                                
                                {/* Center Circle with Direction Indicator */}
                                <circle
                                  cx="200"
                                  cy="200"
                                  r="35"
                                  fill={loop.type === 'reinforcing' ? '#dcfce7' : '#fef3c7'}
                                  stroke={loop.type === 'reinforcing' ? '#10b981' : '#f59e0b'}
                                  strokeWidth="3"
                                />
                                
                                {/* Circular Arrow in Center */}
                                <defs>
                                  <marker
                                    id={`center-arrow-${index}`}
                                    markerWidth="8"
                                    markerHeight="6"
                                    refX="7"
                                    refY="3"
                                    orient="auto"
                                  >
                                    <polygon
                                      points="0 0, 8 3, 0 6"
                                      fill={loop.type === 'reinforcing' ? '#065f46' : '#92400e'}
                                    />
                                  </marker>
                                </defs>
                                
                                <path
                                  d="M 220 200 A 20 20 0 1 1 215 185"
                                  fill="none"
                                  stroke={loop.type === 'reinforcing' ? '#065f46' : '#92400e'}
                                  strokeWidth="2"
                                  markerEnd={`url(#center-arrow-${index})`}
                                />
                                
                                {/* Loop Type Text */}
                                <text
                                  x="200"
                                  y="205"
                                  textAnchor="middle"
                                  className={`text-lg font-bold ${
                                    loop.type === 'reinforcing' ? 'fill-green-800' : 'fill-orange-800'
                                  }`}
                                >
                                  {loop.type === 'reinforcing' ? 'R' : 'B'}
                                </text>
                              </svg>
                            </div>
                            
                            {/* Legend */}
                            <div className="text-center mt-2">
                              <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs ${
                                loop.type === 'reinforcing' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                              }`}>
                                <span className="font-bold">
                                  {loop.type === 'reinforcing' ? 'R' : 'B'}
                                </span>
                                <span>
                                  {loop.type === 'reinforcing' ? 'Reinforcing' : 'Balancing'} Loop
                                </span>
                          </div>
                      </div>
              </div>

                          {/* Right: Explanations */}
                <div className="space-y-4">
                            <div className={`rounded-lg p-4 border ${
                              loop.type === 'reinforcing' ? 'bg-green-100 border-green-200' : 'bg-orange-100 border-orange-200'
                            }`}>
                              <h6 className={`text-sm font-bold mb-3 ${
                                loop.type === 'reinforcing' ? 'text-green-800' : 'text-orange-800'
                              }`}>
                                💡 Why This Happens:
                              </h6>
                              <p className={`text-sm leading-relaxed ${
                                loop.type === 'reinforcing' ? 'text-green-700' : 'text-orange-700'
                              }`}>
                                {loop.explanation}
                              </p>
                      </div>
                    
                            <div className={`rounded-lg p-4 border ${
                              loop.type === 'reinforcing' ? 'bg-green-100 border-green-200' : 'bg-orange-100 border-orange-200'
                            }`}>
                              <h6 className={`text-sm font-bold mb-3 ${
                                loop.type === 'reinforcing' ? 'text-green-800' : 'text-orange-800'
                              }`}>
                                🏫 Real-World Example:
                              </h6>
                              <p className={`text-sm leading-relaxed ${
                                loop.type === 'reinforcing' ? 'text-green-700' : 'text-orange-700'
                              }`}>
                                {loop.realWorldExample}
                              </p>
                              </div>
                            
                            {/* Loop Type Explanation */}
                            <div className={`rounded-lg p-4 border ${
                              loop.type === 'reinforcing' ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'
                            }`}>
                              <h6 className={`text-sm font-bold mb-2 ${
                                loop.type === 'reinforcing' ? 'text-green-800' : 'text-orange-800'
                              }`}>
                                {loop.type === 'reinforcing' ? '🔄 Reinforcing Loop:' : '⚖️ Balancing Loop:'}
                              </h6>
                              <p className={`text-xs leading-relaxed ${
                                loop.type === 'reinforcing' ? 'text-green-700' : 'text-orange-700'
                              }`}>
                                {loop.type === 'reinforcing' 
                                  ? 'Success builds on success - positive changes create momentum for more positive changes, accelerating improvement over time.'
                                  : 'Natural limits and corrections - the system self-regulates when pushed too hard, preventing runaway growth or decline.'
                                }
                              </p>
                              </div>
                          </div>
                        </div>
                            </div>
                          </div>
                        ))}
                      </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <div className="text-4xl mb-3">🔍</div>
                  <h5 className="text-xl font-semibold text-slate-700 mb-2">No Feedback Loops Detected</h5>
                  <p className="text-slate-600">Your current policy combination doesn't create significant reinforcing or balancing cycles. Try adjusting policy intensities to see dynamic system behaviors emerge.</p>
              </div>
              )}
              </div>

             {/* Direct Policy Impacts on Metrics - Organized by Outcome Metrics */}
             <div className="space-y-6">
               <div className="text-center mb-6">
                 <h4 className="text-2xl font-bold text-slate-800 mb-2">Direct Policy Impacts on Metrics</h4>
                 <p className="text-slate-600">How your policy choices affect the 5 key educational outcome metrics</p>
               </div>
               
               {(() => {
                 // Policy coefficients from the simulator
                 const policyCoefficients = {
                   'PROTECT_STD': { AI_LITERACY: 0.2, TEACHER_SATISFACTION: 0.1, DIGITAL_EQUITY: 0.3, AI_VULNERABILITY_INDEX: -0.5, BUDGET_STRAIN: 0.2 },
                   'PD_FUNDS': { AI_LITERACY: 0.5, TEACHER_SATISFACTION: 0.5, DIGITAL_EQUITY: 0.4, AI_VULNERABILITY_INDEX: -0.3, BUDGET_STRAIN: 0.4 },
                   'INFRA_INVEST': { AI_LITERACY: 0.3, TEACHER_SATISFACTION: 0.2, DIGITAL_EQUITY: 0.5, AI_VULNERABILITY_INDEX: -0.2, BUDGET_STRAIN: 0.5 },
                   'EDUC_AUTONOMY': { AI_LITERACY: 0.2, TEACHER_SATISFACTION: 0.5, DIGITAL_EQUITY: 0.2, AI_VULNERABILITY_INDEX: 0.15, BUDGET_STRAIN: 0.1 },
                   'DIGITAL_CITIZEN': { AI_LITERACY: 0.5, TEACHER_SATISFACTION: 0.1, DIGITAL_EQUITY: 0.5, AI_VULNERABILITY_INDEX: -0.3, BUDGET_STRAIN: 0.1 },
                   'ACCESS_STD': { AI_LITERACY: 0.2, TEACHER_SATISFACTION: 0.1, DIGITAL_EQUITY: 0.5, AI_VULNERABILITY_INDEX: 0.0, BUDGET_STRAIN: 0.2 },
                   'INNOV_SANDBOX': { AI_LITERACY: 0.3, TEACHER_SATISFACTION: 0.3, DIGITAL_EQUITY: 0.3, AI_VULNERABILITY_INDEX: -0.4, BUDGET_STRAIN: 0.3 },
                   'MODEL_EVAL_STD': { AI_LITERACY: 0.1, TEACHER_SATISFACTION: 0.1, DIGITAL_EQUITY: 0.3, AI_VULNERABILITY_INDEX: -0.5, BUDGET_STRAIN: 0.2 },
                   'AI_INTEGRATION': { AI_LITERACY: 0.4, TEACHER_SATISFACTION: 0.3, DIGITAL_EQUITY: 0.4, AI_VULNERABILITY_INDEX: -0.2, BUDGET_STRAIN: 0.3 }
                 }
                 
                 const metrics = [
                   { key: 'AI_LITERACY', name: 'AI Literacy', icon: '🎓', color: 'blue', description: 'Student competency in AI tools and concepts' },
                   { key: 'TEACHER_SATISFACTION', name: 'Teacher Morale', icon: '👩‍🏫', color: 'green', description: 'Educator comfort and engagement with AI tools' },
                   { key: 'DIGITAL_EQUITY', name: 'Digital Fairness', icon: '⚖️', color: 'purple', description: 'Equal access to AI education across different demographics' },
                   { key: 'AI_VULNERABILITY_INDEX', name: 'AI Vulnerability', icon: '🛡️', color: 'orange', description: 'Risk assessment and safety in AI usage (lower is better)' },
                   { key: 'BUDGET_STRAIN', name: 'Budget Strain', icon: '💰', color: 'red', description: 'Financial pressure on district resources' }
                 ]
                 
                 const [openAccordions, setOpenAccordions] = React.useState(new Set(['AI_LITERACY']))
                 
                 const toggleAccordion = (metricKey) => {
                   const newOpen = new Set(openAccordions)
                   if (newOpen.has(metricKey)) {
                     newOpen.delete(metricKey)
                   } else {
                     newOpen.add(metricKey)
                   }
                   setOpenAccordions(newOpen)
                 }
                 
                 return (
                <div className="space-y-4">
                     {metrics.map(metric => {
                       const isOpen = openAccordions.has(metric.key)
                       
                       // Find policies that affect this metric
                       const affectingPolicies = selectedPolicies.filter(policyId => {
                         const coefficients = policyCoefficients[policyId] || {}
                         return Math.abs(coefficients[metric.key] || 0) > 0.05
                       }).map(policyId => {
                         const policy = policyDefinitions[policyId]
                         const intensity = policyIntensities[policyId] || 50
                         const coefficient = policyCoefficients[policyId]?.[metric.key] || 0
                         const intensityFactor = (intensity - 50) / 50
                         const impactValue = coefficient * intensityFactor * 30
                         const displayImpact = impactValue > 0 ? `+${Math.round(Math.abs(impactValue))}%` : `-${Math.round(Math.abs(impactValue))}%`
                         
                         return {
                           policy,
                           policyId,
                           intensity,
                           coefficient,
                           impactValue,
                           displayImpact,
                           color: impactValue > 15 ? 'green' : 
                                  impactValue > 5 ? 'blue' :
                                  impactValue > -5 ? 'yellow' :
                                  impactValue > -15 ? 'orange' : 'red'
                         }
                       })
                       
                       if (affectingPolicies.length === 0) return null
                       
                       return (
                         <div key={metric.key} className="bg-white rounded-lg border border-gray-200 shadow-sm">
                           {/* Accordion Header */}
                           <button
                             onClick={() => toggleAccordion(metric.key)}
                             className={`w-full p-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors ${
                               metric.color === 'blue' ? 'border-l-4 border-blue-500' :
                               metric.color === 'green' ? 'border-l-4 border-green-500' :
                               metric.color === 'purple' ? 'border-l-4 border-purple-500' :
                               metric.color === 'orange' ? 'border-l-4 border-orange-500' :
                               'border-l-4 border-red-500'
                             }`}
                           >
                             <div className="flex items-center space-x-3">
                               <span className="text-2xl">{metric.icon}</span>
                               <div>
                                 <h5 className="text-lg font-bold text-slate-800">{metric.name}</h5>
                                 <p className="text-sm text-slate-600">{metric.description}</p>
                               </div>
                             </div>
                             <div className="flex items-center space-x-2">
                               <span className="text-sm text-slate-500">{affectingPolicies.length} policies</span>
                               <svg 
                                 className={`w-5 h-5 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} 
                                 fill="none" 
                                 stroke="currentColor" 
                                 viewBox="0 0 24 24"
                               >
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                               </svg>
                             </div>
                           </button>
                           
                           {/* Accordion Content */}
                           {isOpen && (
                             <div className="border-t border-gray-200 p-4">
                               <div className="space-y-4">
                                 {affectingPolicies.map(({ policy, policyId, intensity, coefficient, impactValue, displayImpact, color }) => (
                                   <div key={policyId} className={`rounded-lg p-4 border ${
                                     color === 'green' ? 'bg-green-50 border-green-200' :
                                     color === 'blue' ? 'bg-blue-50 border-blue-200' :
                                     color === 'yellow' ? 'bg-yellow-50 border-yellow-200' :
                                     color === 'orange' ? 'bg-orange-50 border-orange-200' :
                                     'bg-red-50 border-red-200'
                                   }`}>
                                     <div className="flex items-center justify-between mb-2">
                                       <div className="flex items-center space-x-2">
                                         <span className={`font-semibold ${
                                           color === 'green' ? 'text-green-800' :
                                           color === 'blue' ? 'text-blue-800' :
                                           color === 'yellow' ? 'text-yellow-800' :
                                           color === 'orange' ? 'text-orange-800' :
                                           'text-red-800'
                                         }`}>
                                           {policy?.name || policyId}
                                         </span>
                                         <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                           intensity >= 70 ? 'bg-red-100 text-red-800' :
                                           intensity >= 40 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                                           {intensity >= 70 ? 'High' : intensity >= 40 ? 'Moderate' : 'Low'} ({intensity}%)
                      </span>
                      </div>
                                       <span className={`px-2 py-1 rounded-full text-sm font-bold ${
                                         color === 'green' ? 'bg-green-200 text-green-800' :
                                         color === 'blue' ? 'bg-blue-200 text-blue-800' :
                                         color === 'yellow' ? 'bg-yellow-200 text-yellow-800' :
                                         color === 'orange' ? 'bg-orange-200 text-orange-800' :
                                         'bg-red-200 text-red-800'
                                       }`}>
                                         {displayImpact}
                            </span>
                                     </div>
                                     <p className={`text-sm leading-relaxed ${
                                       color === 'green' ? 'text-green-700' :
                                       color === 'blue' ? 'text-blue-700' :
                                       color === 'yellow' ? 'text-yellow-700' :
                                       color === 'orange' ? 'text-orange-700' :
                                       'text-red-700'
                                     }`}>
                                       {(() => {
                                         const policyName = policy?.name || policyId
                                         if (metric.key === 'AI_LITERACY') {
                                           return intensity >= 70 ? 
                                             `High-intensity ${policyName} dramatically improves student AI skills through comprehensive exposure to advanced AI tools and expert guidance.` :
                                             intensity >= 40 ? 
                                             `Moderate ${policyName} helps students develop solid foundational AI skills through regular access and adequate support.` :
                                             `Basic ${policyName} provides students with introductory exposure to AI technologies and concepts.`
                                         } else if (metric.key === 'TEACHER_SATISFACTION') {
                                           return intensity >= 70 ?
                                             `High-intensity ${policyName} significantly boosts teacher morale by providing excellent resources and support that makes their work more effective.` :
                                             intensity >= 40 ?
                                             `Moderate ${policyName} improves teacher satisfaction by addressing key concerns and providing meaningful support.` :
                                             `Basic ${policyName} provides some teacher support that modestly improves satisfaction with AI education.`
                                         } else if (metric.key === 'DIGITAL_EQUITY') {
                                           return intensity >= 70 ?
                                             `High-intensity ${policyName} dramatically improves educational equity by ensuring all students have equal access to AI opportunities.` :
                                             intensity >= 40 ?
                                             `Moderate ${policyName} makes meaningful progress toward digital equity by addressing key access barriers.` :
                                             `Basic ${policyName} provides some equity improvements by reducing disparities in AI education access.`
                                         } else if (metric.key === 'AI_VULNERABILITY_INDEX') {
                                           if (coefficient < 0) {
                                             return intensity >= 70 ?
                                               `High-intensity ${policyName} significantly reduces AI risks through comprehensive protection and safety measures.` :
                                               intensity >= 40 ?
                                               `Moderate ${policyName} meaningfully reduces AI vulnerability through solid safety measures and risk mitigation.` :
                                               `Basic ${policyName} provides some protection against AI risks and vulnerabilities.`
                                           } else {
                                             return intensity >= 70 ?
                                               `High-intensity ${policyName} may increase some AI risks by prioritizing innovation over safety, requiring careful risk management.` :
                                               intensity >= 40 ?
                                               `Moderate ${policyName} introduces some AI vulnerability that must be balanced against benefits through complementary safety measures.` :
                                               `Basic ${policyName} slightly increases AI vulnerability but the risk is minimal at this intensity level.`
                                           }
                                         } else if (metric.key === 'BUDGET_STRAIN') {
                                           return intensity >= 70 ?
                                             `High-intensity ${policyName} creates significant budget pressure through major investments that strain district finances.` :
                                             intensity >= 40 ?
                                             `Moderate ${policyName} requires noticeable budget allocation that impacts other priorities and requires careful planning.` :
                                             `Basic ${policyName} has manageable budget impact that can be absorbed within normal district planning.`
                                         }
                                         return `${policyName} affects this metric based on implementation intensity and district context.`
                                       })()}
                                     </p>
                                   </div>
                                 ))}
                               </div>
                             </div>
                           )}
                         </div>
                       )
                     })}
                   </div>
                 )
               })()}
               </div>
             </div>
           </div>
         </div>
       </div>
     </div>
   )
 }

// Simple Explore Impacts Modal Component
const ExploreImpactsModal = ({ isOpen, onClose, selectedPolicies, policyIntensities }) => {
  if (!isOpen) return null

  // Helper functions to check policy intensities (shared by all analysis functions)
  const isHigh = (policyId) => {
    try {
      return selectedPolicies && selectedPolicies.some(id => id === policyId && (policyIntensities[id] || 50) >= 70)
    } catch (error) {
      console.warn('Error in isHigh:', error)
      return false
    }
  }
  const isModerate = (policyId) => {
    try {
      return selectedPolicies && selectedPolicies.some(id => id === policyId && (policyIntensities[id] || 50) >= 40 && (policyIntensities[id] || 50) < 70)
    } catch (error) {
      console.warn('Error in isModerate:', error)
      return false
    }
  }
  const isLow = (policyId) => {
    try {
      return selectedPolicies && selectedPolicies.some(id => id === policyId && (policyIntensities[id] || 50) < 40)
    } catch (error) {
      console.warn('Error in isLow:', error)
      return false
    }
  }
  const isSelected = (policyId) => {
    try {
      return selectedPolicies && selectedPolicies.includes(policyId)
    } catch (error) {
      console.warn('Error in isSelected:', error)
      return false
    }
  }

  // Enhanced strategy classification
  const getStrategy = () => {
    const highPolicies = selectedPolicies.filter(policyId => (policyIntensities[policyId] || 50) >= 70)
    const moderatePolicies = selectedPolicies.filter(policyId => (policyIntensities[policyId] || 50) >= 40 && (policyIntensities[policyId] || 50) < 70)
    const lowPolicies = selectedPolicies.filter(policyId => (policyIntensities[policyId] || 50) < 40)
    
    // Check for specific policy combinations
    const hasHighProtection = selectedPolicies.some(id => id === 'PROTECT_STD' && (policyIntensities[id] || 50) >= 70)
    const hasHighEvaluation = selectedPolicies.some(id => id === 'MODEL_EVAL_STD' && (policyIntensities[id] || 50) >= 70)
    const hasHighAccessibility = selectedPolicies.some(id => id === 'ACCESS_STD' && (policyIntensities[id] || 50) >= 70)
    const hasHighInnovation = selectedPolicies.some(id => id === 'INNOV_SANDBOX' && (policyIntensities[id] || 50) >= 70)
    const hasHighIntegration = selectedPolicies.some(id => id === 'AI_INTEGRATION' && (policyIntensities[id] || 50) >= 70)
    const hasHighAutonomy = selectedPolicies.some(id => id === 'EDUC_AUTONOMY' && (policyIntensities[id] || 50) >= 70)
    const hasHighInfrastructure = selectedPolicies.some(id => id === 'INFRA_INVEST' && (policyIntensities[id] || 50) >= 70)
    const hasHighTraining = selectedPolicies.some(id => id === 'PD_FUNDS' && (policyIntensities[id] || 50) >= 70)

    // Strategy classification logic
    if (hasHighProtection && hasHighEvaluation && hasHighAccessibility) {
      return { name: "Safety-First Approach", description: "You're prioritizing comprehensive protection and rigorous evaluation to build bulletproof AI systems.", icon: "🛡️", color: "blue" }
    } else if (hasHighInnovation && hasHighIntegration && hasHighAutonomy) {
      return { name: "Innovation Leader", description: "You're pushing the boundaries with cutting-edge AI tools and teacher freedom to experiment.", icon: "🚀", color: "purple" }
    } else if (moderatePolicies.length >= selectedPolicies.length * 0.6) {
      return { name: "Balanced Implementation", description: "You're taking a measured approach that balances innovation with practical constraints.", icon: "⚖️", color: "green" }
    } else if (lowPolicies.length >= 3 || (!hasHighInfrastructure && !hasHighTraining)) {
      return { name: "Budget-Conscious", description: "You're focusing on low-cost, high-impact strategies that maximize value with limited resources.", icon: "💰", color: "yellow" }
    } else if (hasHighTraining && hasHighAutonomy) {
      return { name: "Teacher-Centered", description: "You're empowering educators with training and freedom to drive AI integration from the classroom.", icon: "👩‍🏫", color: "orange" }
    } else if (hasHighAccessibility && hasHighInfrastructure) {
      return { name: "Equity-Focused", description: "You're ensuring every student has access to high-quality AI tools regardless of their background.", icon: "🌟", color: "teal" }
    } else {
      return { name: "Exploratory Approach", description: "You're experimenting with different policy combinations to find what works best.", icon: "🔍", color: "gray" }
    }
  }
                             'Comprehensive AI integration across all subjects gives students daily experience with AI tools, developing sophisticated understanding of AI applications in different contexts.' :
                             intensity >= 40 ?
                             'Regular AI integration in multiple classes helps students build practical AI skills and see AI applications across different learning areas.' :
                             'Limited AI integration provides students with basic exposure to AI tools but may not develop deep AI literacy skills.'
                         })
                         impacts.push({
                           metric: 'Academic Performance',
                           impact: intensity >= 70 ? '+20%' : intensity >= 40 ? '+12%' : '+5%',
                           color: intensity >= 70 ? 'green' : intensity >= 40 ? 'blue' : 'yellow',
                           explanation: intensity >= 70 ?
                             'Extensive AI integration enables personalized learning, instant feedback, and adaptive instruction that significantly improves student academic outcomes.' :
                             intensity >= 40 ?
                             'Moderate AI integration provides helpful learning support through AI tutoring and writing assistance, leading to measurable academic improvements.' :
                             'Basic AI integration offers some learning enhancements but limited impact on overall academic performance.'
                         })
                         impacts.push({
                           metric: 'Teacher Workload',
                           impact: intensity >= 70 ? '+15%' : intensity >= 40 ? '+8%' : '+2%',
                           color: intensity >= 70 ? 'orange' : intensity >= 40 ? 'yellow' : 'green',
                           explanation: intensity >= 70 ?
                             'High AI integration initially increases teacher workload as they learn to manage multiple AI tools, troubleshoot issues, and adapt lesson plans for AI-enhanced instruction.' :
                             intensity >= 40 ?
                             'Moderate AI integration adds some complexity to teaching but becomes manageable as teachers adapt to new AI-enhanced workflows.' :
                             'Limited AI integration has minimal impact on teacher workload, with AI tools used occasionally without major workflow changes.'
                         })
                         break
                         
                       case 'PROTECT_STD':
                         impacts.push({
                           metric: 'Community Trust',
                           impact: intensity >= 70 ? '+35%' : intensity >= 40 ? '+20%' : '+8%',
                           color: intensity >= 70 ? 'green' : intensity >= 40 ? 'blue' : 'yellow',
                           explanation: intensity >= 70 ?
                             'Rigorous data protection standards create bulletproof privacy safeguards that give parents complete confidence in AI tool usage, building strong community support.' :
                             intensity >= 40 ?
                             'Solid protection standards address major privacy concerns, helping parents feel comfortable with AI tool usage in schools.' :
                             'Basic protection standards provide some privacy safeguards but may leave parents with lingering concerns about student data usage.'
                         })
                         impacts.push({
                           metric: 'AI Tool Availability',
                           impact: intensity >= 70 ? '-20%' : intensity >= 40 ? '-10%' : '-3%',
                           color: intensity >= 70 ? 'red' : intensity >= 40 ? 'orange' : 'yellow',
                           explanation: intensity >= 70 ?
                             'Strict protection standards eliminate many AI tools that cannot meet rigorous privacy requirements, limiting the variety of AI applications available to students.' :
                             intensity >= 40 ?
                             'Moderate protection standards restrict some AI tools with questionable privacy practices, reducing but not eliminating AI tool options.' :
                             'Basic protection standards have minimal impact on AI tool availability, allowing most AI tools to be used with simple privacy agreements.'
                         })
                         impacts.push({
                           metric: 'Implementation Speed',
                           impact: intensity >= 70 ? '-25%' : intensity >= 40 ? '-12%' : '-4%',
                           color: intensity >= 70 ? 'red' : intensity >= 40 ? 'orange' : 'yellow',
                           explanation: intensity >= 70 ?
                             'Extensive privacy reviews and compliance checks significantly slow AI tool approval processes, delaying implementation of new AI educational technologies.' :
                             intensity >= 40 ?
                             'Privacy review processes add moderate delays to AI tool implementation as tools undergo security and privacy assessments.' :
                             'Basic privacy checks cause minimal delays in AI tool implementation, with simple approval processes for most AI educational tools.'
                         })
                         break
                         
                       case 'MODEL_EVAL_STD':
                         impacts.push({
                           metric: 'AI Tool Quality',
                           impact: intensity >= 70 ? '+30%' : intensity >= 40 ? '+18%' : '+6%',
                           color: intensity >= 70 ? 'green' : intensity >= 40 ? 'blue' : 'yellow',
                           explanation: intensity >= 70 ?
                             'Rigorous evaluation standards ensure only the most effective, unbiased AI tools reach students, dramatically improving the quality of AI educational experiences.' :
                             intensity >= 40 ?
                             'Solid evaluation processes filter out problematic AI tools while approving effective ones, improving overall AI tool quality in classrooms.' :
                             'Basic evaluation standards provide some quality control but may allow less effective or biased AI tools to be used in educational settings.'
                         })
                         impacts.push({
                           metric: 'Student Safety',
                           impact: intensity >= 70 ? '+40%' : intensity >= 40 ? '+22%' : '+8%',
                           color: intensity >= 70 ? 'green' : intensity >= 40 ? 'blue' : 'yellow',
                           explanation: intensity >= 70 ?
                             'Comprehensive AI model evaluation eliminates harmful, biased, or inappropriate AI tools, creating an exceptionally safe AI learning environment for all students.' :
                             intensity >= 40 ?
                             'Thorough evaluation processes identify and prevent most harmful AI tools from reaching students, creating a safer AI learning environment.' :
                             'Basic evaluation provides some protection against harmful AI tools but may miss subtle biases or inappropriate content in AI systems.'
                         })
                         impacts.push({
                           metric: 'Innovation Speed',
                           impact: intensity >= 70 ? '-30%' : intensity >= 40 ? '-15%' : '-5%',
                           color: intensity >= 70 ? 'red' : intensity >= 40 ? 'orange' : 'yellow',
                           explanation: intensity >= 70 ?
                             'Extensive AI model testing and evaluation processes create significant delays in adopting new AI tools, slowing district innovation and adaptation to emerging technologies.' :
                             intensity >= 40 ?
                             'Thorough evaluation processes add moderate delays to AI tool adoption as new tools undergo testing and review before classroom use.' :
                             'Basic evaluation processes cause minimal delays in adopting new AI tools, allowing relatively quick implementation of emerging AI technologies.'
                         })
                         break
                         
                       case 'ACCESS_STD':
                         impacts.push({
                           metric: 'Educational Equity',
                           impact: intensity >= 70 ? '+35%' : intensity >= 40 ? '+20%' : '+8%',
                           color: intensity >= 70 ? 'green' : intensity >= 40 ? 'blue' : 'yellow',
                           explanation: intensity >= 70 ?
                             'Comprehensive accessibility standards ensure every student, regardless of disability, language, or learning style, can fully participate in AI-enhanced education.' :
                             intensity >= 40 ?
                             'Solid accessibility requirements help most students with disabilities or language barriers access AI tools effectively, improving educational equity.' :
                             'Basic accessibility standards provide some support for diverse learners but may not fully address all accessibility needs in AI education.'
                         })
                         impacts.push({
                           metric: 'Student Engagement',
                           impact: intensity >= 70 ? '+25%' : intensity >= 40 ? '+15%' : '+6%',
                           color: intensity >= 70 ? 'green' : intensity >= 40 ? 'blue' : 'yellow',
                           explanation: intensity >= 70 ?
                             'Highly accessible AI tools engage all students by adapting to individual learning needs, communication styles, and accessibility requirements.' :
                             intensity >= 40 ?
                             'Accessible AI tools help diverse learners engage more effectively with educational content, improving participation and motivation.' :
                             'Basic accessibility features in AI tools provide some engagement benefits for students with diverse learning needs.'
                         })
                         impacts.push({
                           metric: 'Implementation Cost',
                           impact: intensity >= 70 ? '+25%' : intensity >= 40 ? '+12%' : '+4%',
                           color: intensity >= 70 ? 'orange' : intensity >= 40 ? 'yellow' : 'green',
                           explanation: intensity >= 70 ?
                             'Comprehensive accessibility standards require specialized AI tools, assistive technology integration, and additional staff training, significantly increasing implementation costs.' :
                             intensity >= 40 ?
                             'Moderate accessibility requirements add some costs through accessible AI tool selection and basic assistive technology integration.' :
                             'Basic accessibility standards have minimal cost impact, requiring only simple accommodations in AI tool selection and usage.'
                         })
                         break
                         
                       case 'EDUC_AUTONOMY':
                         impacts.push({
                           metric: 'Teacher Satisfaction',
                           impact: intensity >= 70 ? '+30%' : intensity >= 40 ? '+18%' : '+6%',
                           color: intensity >= 70 ? 'green' : intensity >= 40 ? 'blue' : 'yellow',
                           explanation: intensity >= 70 ?
                             'High educator autonomy empowers teachers to choose AI tools that best fit their teaching style and student needs, dramatically improving job satisfaction and professional fulfillment.' :
                             intensity >= 40 ?
                             'Moderate autonomy gives teachers meaningful choice in AI tool selection while maintaining some district oversight, improving teacher satisfaction.' :
                             'Limited autonomy provides teachers with some flexibility in AI tool usage while maintaining strict district control over AI educational decisions.'
                         })
                         impacts.push({
                           metric: 'Innovation Rate',
                           impact: intensity >= 70 ? '+28%' : intensity >= 40 ? '+15%' : '+5%',
                           color: intensity >= 70 ? 'green' : intensity >= 40 ? 'blue' : 'yellow',
                           explanation: intensity >= 70 ?
                             'High teacher autonomy unleashes classroom innovation as teachers experiment with diverse AI tools and develop creative AI applications for their specific student populations.' :
                             intensity >= 40 ?
                             'Moderate autonomy enables teachers to adapt AI tools to their classroom needs, fostering steady innovation in AI educational applications.' :
                             'Limited autonomy restricts teacher experimentation with AI tools, resulting in slower innovation and more standardized AI usage across classrooms.'
                         })
                         impacts.push({
                           metric: 'Implementation Consistency',
                           impact: intensity >= 70 ? '-20%' : intensity >= 40 ? '-10%' : '-3%',
                           color: intensity >= 70 ? 'orange' : intensity >= 40 ? 'yellow' : 'green',
                           explanation: intensity >= 70 ?
                             'High autonomy creates significant variation in AI tool usage across classrooms, potentially leading to unequal AI learning experiences for students in different classes.' :
                             intensity >= 40 ?
                             'Moderate autonomy allows some variation in AI implementation while maintaining reasonable consistency in student AI learning experiences.' :
                             'Limited autonomy ensures consistent AI tool usage across all classrooms, providing standardized AI learning experiences for all students.'
                         })
                         break
                         
                       case 'DIGITAL_CITIZEN':
                         impacts.push({
                           metric: 'Student Critical Thinking',
                           impact: intensity >= 70 ? '+32%' : intensity >= 40 ? '+18%' : '+7%',
                           color: intensity >= 70 ? 'green' : intensity >= 40 ? 'blue' : 'yellow',
                           explanation: intensity >= 70 ?
                             'Comprehensive digital citizenship education teaches students to critically evaluate AI outputs, understand AI biases, and make ethical decisions about AI usage.' :
                             intensity >= 40 ?
                             'Solid digital citizenship curriculum helps students develop awareness of AI limitations and ethical considerations in AI usage.' :
                             'Basic digital citizenship education provides students with introductory awareness of AI ethics and responsible AI usage principles.'
                         })
                         impacts.push({
                           metric: 'Future Readiness',
                           impact: intensity >= 70 ? '+35%' : intensity >= 40 ? '+20%' : '+8%',
                           color: intensity >= 70 ? 'green' : intensity >= 40 ? 'blue' : 'yellow',
                           explanation: intensity >= 70 ?
                             'Advanced digital citizenship education prepares students for an AI-integrated future by teaching them to navigate AI systems responsibly and ethically in all aspects of life.' :
                             intensity >= 40 ?
                             'Good digital citizenship training helps students develop skills needed to work and live effectively in an increasingly AI-integrated society.' :
                             'Basic digital citizenship education provides some preparation for AI-integrated future but may not fully prepare students for complex AI ethical decisions.'
                         })
                         impacts.push({
                           metric: 'AI Adoption Rate',
                           impact: intensity >= 70 ? '-8%' : intensity >= 40 ? '-4%' : '-1%',
                           color: intensity >= 70 ? 'yellow' : intensity >= 40 ? 'green' : 'green',
                           explanation: intensity >= 70 ?
                             'Extensive focus on AI ethics and critical thinking may make some students more cautious about AI usage, slightly slowing AI tool adoption rates.' :
                             intensity >= 40 ?
                             'Balanced digital citizenship education helps students use AI thoughtfully without significantly impacting AI adoption rates.' :
                             'Basic digital citizenship education has minimal impact on AI adoption while providing essential ethical foundation.'
                         })
                         break
                         
                       case 'INNOV_SANDBOX':
                         impacts.push({
                           metric: 'Innovation Rate',
                           impact: intensity >= 70 ? '+40%' : intensity >= 40 ? '+22%' : '+8%',
                           color: intensity >= 70 ? 'green' : intensity >= 40 ? 'blue' : 'yellow',
                           explanation: intensity >= 70 ?
                             'Aggressive innovation programs enable rapid experimentation with cutting-edge AI tools, keeping the district at the forefront of AI educational technology.' :
                             intensity >= 40 ?
                             'Solid innovation programs allow regular testing of new AI tools and approaches, maintaining steady progress in AI educational innovation.' :
                             'Basic innovation programs provide some opportunity to test new AI tools but with limited scope and frequency of experimentation.'
                         })
                         impacts.push({
                           metric: 'Teacher Engagement',
                           impact: intensity >= 70 ? '+25%' : intensity >= 40 ? '+15%' : '+5%',
                           color: intensity >= 70 ? 'green' : intensity >= 40 ? 'blue' : 'yellow',
                           explanation: intensity >= 70 ?
                             'Extensive innovation opportunities excite teachers who enjoy experimenting with new technologies, creating enthusiasm for AI integration.' :
                             intensity >= 40 ?
                             'Regular innovation opportunities engage teachers interested in educational technology while not overwhelming those who prefer stability.' :
                             'Limited innovation programs provide some excitement for tech-savvy teachers but may not significantly impact overall teacher engagement.'
                         })
                         impacts.push({
                           metric: 'System Stability',
                           impact: intensity >= 70 ? '-25%' : intensity >= 40 ? '-12%' : '-4%',
                           color: intensity >= 70 ? 'red' : intensity >= 40 ? 'orange' : 'yellow',
                           explanation: intensity >= 70 ?
                             'Aggressive experimentation with unproven AI tools creates system instability, with frequent changes and potential disruptions to established educational processes.' :
                             intensity >= 40 ?
                             'Regular innovation creates some system changes and adaptations that may temporarily disrupt established educational routines.' :
                             'Limited innovation programs cause minimal disruption to system stability while still allowing for some technological advancement.'
                         })
                         break
                         
                       default:
                         return []
                     }
                     
                     return impacts
                   }
                   
                   const impacts = getDirectImpacts(policyId, intensity)
                   
                   return (
                     <div key={policyId} className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                       <div className="p-6">
                         <div className="flex items-center justify-between mb-4">
                           <div>
                             <h5 className="text-lg font-bold text-slate-800">{policy.name}</h5>
                             <div className="flex items-center space-x-2 mt-1">
                               <span className="text-sm text-gray-600">Current Intensity:</span>
                               <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                 intensity >= 70 ? 'bg-red-100 text-red-800' :
                                 intensity >= 40 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                                 {intensity >= 70 ? 'High' : intensity >= 40 ? 'Moderate' : 'Low'} ({intensity}%)
                            </span>
                              </div>
                           </div>
                           <div className="text-3xl opacity-60">
                             {policy.icon || '⚙️'}
                           </div>
                      </div>
                    
                         <div className="space-y-4">
                           {impacts.map((impact, impactIndex) => (
                             <div key={impactIndex} className={`rounded-lg p-4 border ${
                               impact.color === 'green' ? 'bg-green-50 border-green-200' :
                               impact.color === 'blue' ? 'bg-blue-50 border-blue-200' :
                               impact.color === 'yellow' ? 'bg-yellow-50 border-yellow-200' :
                               impact.color === 'orange' ? 'bg-orange-50 border-orange-200' :
                               'bg-red-50 border-red-200'
                             }`}>
                               <div className="flex items-center justify-between mb-2">
                                 <span className={`font-semibold ${
                                   impact.color === 'green' ? 'text-green-800' :
                                   impact.color === 'blue' ? 'text-blue-800' :
                                   impact.color === 'yellow' ? 'text-yellow-800' :
                                   impact.color === 'orange' ? 'text-orange-800' :
                                   'text-red-800'
                                 }`}>
                                   {impact.metric}
                            </span>
                                 <span className={`px-2 py-1 rounded-full text-sm font-bold ${
                                   impact.color === 'green' ? 'bg-green-200 text-green-800' :
                                   impact.color === 'blue' ? 'bg-blue-200 text-blue-800' :
                                   impact.color === 'yellow' ? 'bg-yellow-200 text-yellow-800' :
                                   impact.color === 'orange' ? 'bg-orange-200 text-orange-800' :
                                   'bg-red-200 text-red-800'
                                 }`}>
                                   {impact.impact}
                            </span>
                              </div>
                               <p className={`text-sm leading-relaxed ${
                                 impact.color === 'green' ? 'text-green-700' :
                                 impact.color === 'blue' ? 'text-blue-700' :
                                 impact.color === 'yellow' ? 'text-yellow-700' :
                                 impact.color === 'orange' ? 'text-orange-700' :
                                 'text-red-700'
                               }`}>
                                 {impact.explanation}
                               </p>
                              </div>
                      ))}
                         </div>
                       </div>
                     </div>
                   )
                 })}
               </div>
               
               {/* Policy Impact Summary */}
               <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg p-6 border border-slate-200">
                 <h5 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
                   <span className="mr-2">📊</span>Overall Impact Summary
                 </h5>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                   {/* Calculate aggregate impacts */}
                   {(() => {
                     const aggregateImpacts = {
                       'Student AI Literacy': 0,
                       'Teacher Satisfaction': 0,
                       'Community Trust': 0,
                       'Budget Impact': 0
                     }
                     
                     let studentLiteracyCount = 0
                     let teacherSatisfactionCount = 0
                     let communityTrustCount = 0
                     let budgetCount = 0
                     
                     selectedPolicies.forEach(policyId => {
                       const intensity = policyIntensities[policyId] || 50
                       
                       // Student AI Literacy contributors
                       if (['INFRA_INVEST', 'PD_FUNDS', 'AI_INTEGRATION'].includes(policyId)) {
                         aggregateImpacts['Student AI Literacy'] += intensity >= 70 ? 25 : intensity >= 40 ? 15 : 8
                         studentLiteracyCount++
                       }
                       
                       // Teacher Satisfaction contributors
                       if (['INFRA_INVEST', 'EDUC_AUTONOMY'].includes(policyId)) {
                         aggregateImpacts['Teacher Satisfaction'] += intensity >= 70 ? 30 : intensity >= 40 ? 18 : 6
                         teacherSatisfactionCount++
                       }
                       
                       // Community Trust contributors
                       if (['PROTECT_STD'].includes(policyId)) {
                         aggregateImpacts['Community Trust'] += intensity >= 70 ? 35 : intensity >= 40 ? 20 : 8
                         communityTrustCount++
                       }
                       
                       // Budget Impact (negative = strain)
                       if (['INFRA_INVEST', 'PD_FUNDS', 'ACCESS_STD', 'INNOV_SANDBOX'].includes(policyId)) {
                         aggregateImpacts['Budget Impact'] += intensity >= 70 ? 25 : intensity >= 40 ? 15 : 5
                         budgetCount++
                       }
                     })
                     
                     return [
                       {
                         metric: 'Student AI Literacy',
                         value: studentLiteracyCount > 0 ? Math.round(aggregateImpacts['Student AI Literacy'] / studentLiteracyCount) : 0,
                         color: 'green',
                         icon: '🎓'
                       },
                       {
                         metric: 'Teacher Satisfaction',
                         value: teacherSatisfactionCount > 0 ? Math.round(aggregateImpacts['Teacher Satisfaction'] / teacherSatisfactionCount) : 0,
                         color: 'blue',
                         icon: '👩‍🏫'
                       },
                       {
                         metric: 'Community Trust',
                         value: communityTrustCount > 0 ? Math.round(aggregateImpacts['Community Trust']) : 0,
                         color: 'purple',
                         icon: '🤝'
                       },
                       {
                         metric: 'Budget Strain',
                         value: budgetCount > 0 ? Math.round(aggregateImpacts['Budget Impact'] / budgetCount) : 0,
                         color: 'orange',
                         icon: '💰'
                       }
                     ]
                   })().map((summary, index) => (
                     <div key={index} className={`rounded-lg p-4 border ${
                       summary.color === 'green' ? 'bg-green-100 border-green-300' :
                       summary.color === 'blue' ? 'bg-blue-100 border-blue-300' :
                       summary.color === 'purple' ? 'bg-purple-100 border-purple-300' :
                       'bg-orange-100 border-orange-300'
                     }`}>
                       <div className="flex items-center space-x-2 mb-2">
                         <span className="text-2xl">{summary.icon}</span>
                         <span className={`font-semibold text-sm ${
                           summary.color === 'green' ? 'text-green-800' :
                           summary.color === 'blue' ? 'text-blue-800' :
                           summary.color === 'purple' ? 'text-purple-800' :
                           'text-orange-800'
                         }`}>
                           {summary.metric}
                         </span>
                       </div>
                       <div className={`text-2xl font-bold ${
                         summary.color === 'green' ? 'text-green-800' :
                         summary.color === 'blue' ? 'text-blue-800' :
                         summary.color === 'purple' ? 'text-purple-800' :
                         'text-orange-800'
                       }`}>
                         {summary.value > 0 ? `+${summary.value}%` : summary.value < 0 ? `${summary.value}%` : 'No Impact'}
                      </div>
                    </div>
                  ))}
                 </div>
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  )
}

// Modal component for policy information
const PolicyModal = ({ isOpen, onClose, policyName, description, resources }) => {
  const [isResourcesExpanded, setIsResourcesExpanded] = useState(false)
  
  if (!isOpen) return null

  const handleLinkClick = (url) => {
    window.open(url, '_blank')
  }

  const formatResources = (resourcesText) => {
    const lines = resourcesText.split('\n')
    return lines.map((line, index) => {
      if (line.startsWith('•')) {
        const lineContent = line.substring(1).trim() // Remove the bullet point
        
        // Use regex to find the pattern "Title: URL"
        const urlMatch = lineContent.match(/^(.+?):\s*(https?:\/\/.+)$/)
        if (urlMatch) {
          const title = urlMatch[1].trim()
          const url = urlMatch[2].trim()
          return (
            <div key={index} className="flex items-start">
              <span className="text-slate-400 mr-1 text-xs">•</span>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 hover:underline text-xs cursor-pointer leading-tight"
              >
                {title}
              </a>
            </div>
          )
        }
        
        // If no URL pattern is found, just display as text
        return (
          <div key={index} className="flex items-start">
            <span className="text-slate-400 mr-1 text-xs">•</span>
            <span className="text-xs text-slate-600 leading-tight">{lineContent}</span>
          </div>
        )
      }
      return <div key={index} className="text-xs text-slate-600 leading-tight">{line}</div>
    })
  }

  // Split description into "Description" and "Why this Matters" sections
  const splitDescription = (desc) => {
    // Handle both "What this means:" and "Why this Matters:" formats
    let parts = desc.split('\n\nWhat this means:')
    if (parts.length === 1) {
      parts = desc.split('\n\nWhy this Matters:')
    }
    return {
      description: parts[0] || '',
      whyThisMatters: parts[1] || ''
    }
  }

  const { description: mainDescription, whyThisMatters } = splitDescription(description)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold text-slate-800">{policyName}</h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 text-2xl font-bold"
            >
              ×
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-700 mb-2">Description:</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{mainDescription}</p>
            </div>
            
            {whyThisMatters && (
            <div>
                <h3 className="text-lg font-semibold text-slate-700 mb-2">Why this Matters:</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{whyThisMatters}</p>
              </div>
            )}
            
            <div className="border-t border-slate-200 pt-3">
              <button
                onClick={() => setIsResourcesExpanded(!isResourcesExpanded)}
                className="flex items-center justify-between w-full text-left py-2 text-slate-600 hover:text-slate-800 transition-colors"
              >
                <span className="text-sm font-medium">Research & Resources</span>
                <svg
                  className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isResourcesExpanded ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isResourcesExpanded && (
                <div className="mt-2 pl-2 border-l-2 border-slate-200">
                  <div className="text-xs text-slate-600 space-y-1">
                {formatResources(resources)}
              </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Start Screen Modal Component
const StartScreenModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <div className="relative">
          {/* Header with close button */}
          <div className="absolute top-4 right-4 z-10">
            <button
              onClick={onClose}
              className="w-8 h-8 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center text-slate-600 hover:text-slate-800 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Hero Section */}
          <div className="bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 text-white p-8 rounded-t-2xl">
            <div className="text-center">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🎓</span>
              </div>
              <h1 className="text-4xl font-bold mb-4">AI Education Policy Simulator</h1>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                Navigate the complex landscape of AI education policy decisions and see their real-world impact
              </p>
            </div>
          </div>

          <div className="p-8">
            {/* Goal Section with Metrics Visual */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center">
                <span className="mr-3">🎯</span>Your Objective
              </h2>
              <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-6 mb-6">
                <p className="text-lg text-slate-700 mb-4">
                  <strong>Keep all outcome metrics above 80, except:</strong>
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-slate-700"><strong>Budget Strain:</strong> Keep under 70</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-slate-700"><strong>AI Vulnerability:</strong> Keep under 40</span>
                  </div>
                </div>
                <p className="text-sm text-slate-600">
                  💡 <strong>Tip:</strong> Lower values for Budget Strain and AI Vulnerability are better!
                </p>
              </div>
              
              {/* Metrics Visual */}
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4 text-center">Target Metrics Overview</h3>
                <div className="grid grid-cols-4 gap-4">
                  {/* AI Literacy */}
                  <div className="text-center">
                    <div className="relative w-16 h-16 mx-auto mb-2">
                      <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
                        <circle cx="32" cy="32" r="24" stroke="#e2e8f0" strokeWidth="4" fill="none" />
                        <circle cx="32" cy="32" r="24" stroke="#10b981" strokeWidth="4" fill="none" strokeLinecap="round" strokeDasharray="150.8" strokeDashoffset="30.16" />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-sm font-bold text-slate-900">80</span>
                      </div>
                    </div>
                    <div className="text-xs font-medium text-slate-600">AI Literacy</div>
                    <div className="text-xs text-green-600 font-semibold">Target: &gt;80</div>
                  </div>
                   
                   {/* Community Trust */}
                  <div className="text-center">
                    <div className="relative w-16 h-16 mx-auto mb-2">
                      <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
                        <circle cx="32" cy="32" r="24" stroke="#e2e8f0" strokeWidth="4" fill="none" />
                        <circle cx="32" cy="32" r="24" stroke="#10b981" strokeWidth="4" fill="none" strokeLinecap="round" strokeDasharray="150.8" strokeDashoffset="30.16" />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-sm font-bold text-slate-900">80</span>
                      </div>
                    </div>
                     <div className="text-xs font-medium text-slate-600">Community Trust</div>
                    <div className="text-xs text-green-600 font-semibold">Target: &gt;80</div>
                  </div>
                   
                   {/* Innovation Index */}
                  <div className="text-center">
                    <div className="relative w-16 h-16 mx-auto mb-2">
                      <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
                        <circle cx="32" cy="32" r="24" stroke="#e2e8f0" strokeWidth="4" fill="none" />
                        <circle cx="32" cy="32" r="24" stroke="#10b981" strokeWidth="4" fill="none" strokeLinecap="round" strokeDasharray="150.8" strokeDashoffset="30.16" />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-sm font-bold text-slate-900">80</span>
                      </div>
                    </div>
                     <div className="text-xs font-medium text-slate-600">Innovation Index</div>
                    <div className="text-xs text-green-600 font-semibold">Target: &gt;80</div>
                  </div>
                   
                   {/* Teacher Morale */}
                  <div className="text-center">
                    <div className="relative w-16 h-16 mx-auto mb-2">
                      <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
                        <circle cx="32" cy="32" r="24" stroke="#e2e8f0" strokeWidth="4" fill="none" />
                         <circle cx="32" cy="32" r="24" stroke="#10b981" strokeWidth="4" fill="none" strokeLinecap="round" strokeDasharray="150.8" strokeDashoffset="30.16" />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                         <span className="text-sm font-bold text-slate-900">80</span>
                      </div>
                    </div>
                     <div className="text-xs font-medium text-slate-600">Teacher Morale</div>
                     <div className="text-xs text-green-600 font-semibold">Target: &gt;80</div>
                   </div>
                   
                   {/* Digital Equity */}
                   <div className="text-center">
                     <div className="relative w-16 h-16 mx-auto mb-2">
                       <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
                         <circle cx="32" cy="32" r="24" stroke="#e2e8f0" strokeWidth="4" fill="none" />
                         <circle cx="32" cy="32" r="24" stroke="#10b981" strokeWidth="4" fill="none" strokeLinecap="round" strokeDasharray="150.8" strokeDashoffset="30.16" />
                       </svg>
                       <div className="absolute inset-0 flex items-center justify-center">
                         <span className="text-sm font-bold text-slate-900">80</span>
                       </div>
                     </div>
                     <div className="text-xs font-medium text-slate-600">Digital Equity</div>
                     <div className="text-xs text-green-600 font-semibold">Target: &gt;80</div>
                  </div>
                   
                  {/* Budget Strain */}
                  <div className="text-center">
                    <div className="relative w-16 h-16 mx-auto mb-2">
                      <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
                        <circle cx="32" cy="32" r="24" stroke="#e2e8f0" strokeWidth="4" fill="none" />
                        <circle cx="32" cy="32" r="24" stroke="#ef4444" strokeWidth="4" fill="none" strokeLinecap="round" strokeDasharray="150.8" strokeDashoffset="105.56" />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-sm font-bold text-slate-900">70</span>
                      </div>
                    </div>
                    <div className="text-xs font-medium text-slate-600">Budget Strain</div>
                    <div className="text-xs text-red-600 font-semibold">Target: &lt;70</div>
                  </div>
                   
                   {/* Employment Impact */}
                   <div className="text-center">
                     <div className="relative w-16 h-16 mx-auto mb-2">
                       <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
                         <circle cx="32" cy="32" r="24" stroke="#e2e8f0" strokeWidth="4" fill="none" />
                         <circle cx="32" cy="32" r="24" stroke="#10b981" strokeWidth="4" fill="none" strokeLinecap="round" strokeDasharray="150.8" strokeDashoffset="30.16" />
                       </svg>
                       <div className="absolute inset-0 flex items-center justify-center">
                         <span className="text-sm font-bold text-slate-900">80</span>
                       </div>
                     </div>
                     <div className="text-xs font-medium text-slate-600">Employment Impact</div>
                     <div className="text-xs text-green-600 font-semibold">Target: &gt;80</div>
                   </div>
                  
                  {/* AI Vulnerability */}
                  <div className="text-center">
                    <div className="relative w-16 h-16 mx-auto mb-2">
                      <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
                        <circle cx="32" cy="32" r="24" stroke="#e2e8f0" strokeWidth="4" fill="none" />
                        <circle cx="32" cy="32" r="24" stroke="#ef4444" strokeWidth="4" fill="none" strokeLinecap="round" strokeDasharray="150.8" strokeDashoffset="96.8" />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-sm font-bold text-slate-900">40</span>
                      </div>
                    </div>
                    <div className="text-xs font-medium text-slate-600">AI Vulnerability</div>
                    <div className="text-xs text-red-600 font-semibold">Target: &lt;40</div>
                  </div>
                </div>
              </div>
            </div>

            {/* How to Use Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center">
                <span className="mr-3">📚</span>How to Use the Simulator
              </h2>
              <div className="bg-slate-50 rounded-xl p-6">
                <p className="text-slate-700 mb-4">
                  The simulator allows you to experiment with different AI education policy combinations by adjusting 15 policy levers across 5 stakeholder groups. As you move the sliders, you'll see real-time updates to 8 outcome metrics displayed as circular indicators at the bottom of the screen.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-3">Understanding the Interface</h3>
                    <ul className="text-sm text-slate-600 space-y-2">
                      <li>• <strong>Top Section:</strong> View time series projections and radar charts showing how your policies affect metrics over time</li>
                      <li>• <strong>Bottom Section:</strong> Adjust policy levers organized by stakeholder groups</li>
                      <li>• <strong>Metrics Display:</strong> Monitor 8 key outcome metrics that update instantly as you make policy changes</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-3">Exploring Policy Impacts</h3>
                    <ul className="text-sm text-slate-600 space-y-2">
                      <li>• Use the "Why these impacts" button to see detailed stories about how your policy choices create real change</li>
                      <li>• Click the information buttons (i) on policies and metrics to access detailed explanations and research resources</li>
                      <li>• Experiment with different policy combinations using the Reset button to start fresh</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Features Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center">
                <span className="mr-3">🚀</span>Key Features
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-50 rounded-lg p-4 text-center">
                  <div className="text-2xl mb-2">📊</div>
                  <h3 className="font-semibold text-slate-800 mb-2">Real-Time Metrics</h3>
                  <p className="text-sm text-slate-600">See immediate feedback on your policy decisions</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4 text-center">
                  <div className="text-2xl mb-2">📈</div>
                  <h3 className="font-semibold text-slate-800 mb-2">Time Series Analysis</h3>
                  <p className="text-sm text-slate-600">Project impacts over 16 years into the future</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4 text-center">
                  <div className="text-2xl mb-2">🎯</div>
                  <h3 className="font-semibold text-slate-800 mb-2">Stakeholder Stories</h3>
                  <p className="text-sm text-slate-600">Understand real-world implications for different groups</p>
                </div>
              </div>
            </div>

            {/* Get Started Button */}
            <div className="text-center">
              <button
                onClick={onClose}
                className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold py-4 px-8 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                🎮 Start Simulating!
              </button>
              <p className="text-sm text-slate-500 mt-3">
                You can always access this guide from the help menu
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function App() {
  const [selectedPolicies, setSelectedPolicies] = useState([])
  const [policyIntensities, setPolicyIntensities] = useState({})
  const [selectedTimeSeriesMetrics, setSelectedTimeSeriesMetrics] = useState(['AI_LITERACY'])

  // State initialization
  const [modalState, setModalState] = useState({
    isOpen: false,
    policyName: '',
    description: '',
    resources: ''
  })
  const [metricModalState, setMetricModalState] = useState({
    isOpen: false,
    metricName: '',
    description: '',
    resources: ''
  })
  const [impactExplanationModal, setImpactExplanationModal] = useState(false)
  const [showStartScreen, setShowStartScreen] = useState(false)
  const [showExploreImpacts, setShowExploreImpacts] = useState(false)
  const defaultMetrics = {
    AI_LITERACY: 50,
    TEACHER_SATISFACTION: 50,
    DIGITAL_EQUITY: 50,
    AI_VULNERABILITY_INDEX: 50,
    BUDGET_STRAIN: 50
  };

  const [currentMetrics, setCurrentMetrics] = useState(defaultMetrics)




  // Update metrics when policies or intensities change
  useEffect(() => {
    try {
      const activePolicies = selectedPolicies.filter(policyId => 
        policyIntensities[policyId] !== undefined
      );
      
      if (activePolicies.length === 0) {
        setCurrentMetrics(defaultMetrics);
      } else {
        // Check if all active policies are at 50% intensity
        const allAtCenter = activePolicies.every(policyId => 
          policyIntensities[policyId] === 50
        );
        
        if (allAtCenter) {
          // If all policies are at 50%, show 50% for all metrics
          setCurrentMetrics(defaultMetrics);
        } else {
          // Otherwise, calculate metrics based on policy intensities
        const metrics = calculateCurrentMetrics(activePolicies, policyIntensities);
        setCurrentMetrics(metrics);
        }
      }
    } catch (error) {
      console.error('Error calculating metrics:', error);
      setCurrentMetrics(defaultMetrics);
    }
  }, [selectedPolicies, policyIntensities]);

  // Handle policy intensity changes
  const handlePolicyIntensityChange = (policyId, newValue) => {
    const newIntensities = { ...policyIntensities, [policyId]: newValue };
    setPolicyIntensities(newIntensities);

    // Ensure policy is selected
    if (!selectedPolicies.includes(policyId)) {
      const newSelectedPolicies = [...selectedPolicies, policyId];
      setSelectedPolicies(newSelectedPolicies);
    }
  };



  // Helper functions - moved outside render cycle to prevent re-creation
  const getHealthColor = (metricName, metricValue) => {
    const isReverse = metricName === 'BUDGET_STRAIN' || metricName === 'AI_VULNERABILITY_INDEX';
    
    if (isReverse) {
      // For Budget Strain and AI Vulnerability (lower is better)
      if (metricValue < 40) return { start: '#10b981', end: '#059669' }; // Green
      if (metricValue < 70) return { start: '#f59e0b', end: '#d97706' }; // Amber
      return { start: '#ef4444', end: '#dc2626' }; // Red
    } else {
      // For other metrics (higher is better)
      if (metricValue < 40) return { start: '#ef4444', end: '#dc2626' }; // Red
      if (metricValue < 70) return { start: '#f59e0b', end: '#d97706' }; // Amber
      return { start: '#10b981', end: '#059669' }; // Green
    }
  }

  const formatMetricName = (metric) => {
    return outcomeMetrics[metric]?.name || metric.replace(/_/g, ' ')
  }

  // Policy toggle handler with default intensity setting
  const handlePolicyToggle = (policyId) => {
    if (selectedPolicies.includes(policyId)) {
      setSelectedPolicies(selectedPolicies.filter(id => id !== policyId))
    } else {
      setSelectedPolicies([...selectedPolicies, policyId])
      // Set default intensity if not already set
      if (!policyIntensities[policyId]) {
        setPolicyIntensities(prev => ({
          ...prev,
          [policyId]: 50
        }))
      }
    }
  }

  // Modal handler functions
  const openPolicyModal = (policyId) => {
    const policy = policyDefinitions[policyId]
    setModalState({
      isOpen: true,
      policyName: policy.name,
      description: policy.description || getPolicyDescription(policyId),
      resources: getPolicyResources(policyId)
    })
  }

  const closePolicyModal = () => {
    setModalState({
      isOpen: false,
      policyName: '',
      description: '',
      resources: ''
    })
  }

  // Metric modal handler functions
  const openMetricModal = (metricId) => {
    const metric = outcomeMetrics[metricId]
    setMetricModalState({
      isOpen: true,
      metricName: metric.name,
      description: getMetricDescription(metricId),
      resources: getMetricResources(metricId)
    })
  }

  const closeMetricModal = () => {
    setMetricModalState({
      isOpen: false,
      metricName: '',
      description: '',
      resources: ''
    })
  }

  // Reset function to restore default values based on research averages
  const handleReset = () => {
    setPolicyIntensities({
      // District - all start at center point (50%)
      PROTECT_STD: 50,
      PD_FUNDS: 50,
      INFRA_INVEST: 50,
      
      // School - all start at center point (50%)
      EDUC_AUTONOMY: 50,
      DIGITAL_CITIZEN: 50,
      ACCESS_STD: 50,
      
      // Research - all start at center point (50%)
      INNOV_SANDBOX: 50,
      MODEL_EVAL_STD: 50,
      INTEROP_STD: 50
    })
    setSelectedPolicies([])
    setSelectedTimeSeriesMetrics(['AI_LITERACY'])
    setCurrentMetrics({
        AI_LITERACY: 50,
        TEACHER_SATISFACTION: 50,
        DIGITAL_EQUITY: 50,
        AI_VULNERABILITY_INDEX: 50,
        BUDGET_STRAIN: 50
    })
  }

  // Helper function to get policy description
  const getPolicyDescription = (policyId) => {
    const descriptions = {
      'INTEROP_STD': 'Making all your school\'s digital tools play nice together like a well-coordinated team\n\nWhy this Matters: You know how annoying it is when apps don\'t sync or when you have to re-enter your info everywhere? This policy fixes that problem for school tech. Your gradebook, learning apps, and AI tutors will work together like a perfectly coordinated team, sharing information seamlessly while keeping everything secure.',
      'INFRA_INVEST': 'Building the high-tech foundation that makes AI actually work in schools\n\nWhy this Matters: You know how frustrating it is when Netflix keeps buffering during the best part of a show? This policy prevents that from happening with AI tools by ensuring schools have lightning-fast internet and powerful computers. It\'s basically giving your school a tech upgrade so AI runs as smoothly as your favorite streaming service.',
      'ACCESS_STD': 'Making sure AI doesn\'t leave anyone behind - like building ramps for the digital world\n\nWhy this Matters: Whether you\'re dyslexic, speak multiple languages, or learn differently, AI tools should work FOR you, not against you. This policy ensures AI becomes your learning ally, offering features like real-time translation, text-to-speech, or visual aids - whatever helps you succeed.',
      'INNOV_INCENT': 'Framework of rewards, funding opportunities, and supportive policies encouraging EdTech companies to develop cutting-edge AI educational solutions. Additionally, this comprises funding research and development at every stage of AI integration to help educators and staff make informed, research-based decisions. This includes grants, pilot program partnerships, procurement preferences for innovative tools, and regulatory flexibility for breakthrough technologies. For example, the Education Innovation and Research (EIR) Program, by the U.S. Department of Education. Innovation incentives drive infrastructure investment through R&D funding for cost-effective technology solutions and risk-reducing pilot partnerships, while prioritizing funding for breakthrough student protection technologies that ensure compliance through research-backed security innovations. These incentives support development of AI career pathway programs aligned with emerging job markets and fund localized solutions for regional workforce preparation, while driving creation of cutting-edge digital citizenship education tools through dedicated grants for responsible AI use and digital ethics instruction.',
      'PROTECT_STD': 'Your digital bodyguard - protecting your data and ensuring AI treats you fairly\n\nWhy this Matters: Think of this as your personal data security team! This policy creates strict rules so AI tools can\'t snoop through your grades or share your assignments without permission - kind of like having privacy settings on your social media, but way more secure. It also acts like a referee, making sure AI doesn\'t play favorites or discriminate against any students.',
      'PD_FUNDS': 'Leveling up your teachers\' AI game through funded training programs\n\nWhat this means: Imagine if your gaming squad suddenly had to play a new game they\'d never seen before - disaster, right? This policy ensures teachers get the training they need to master AI tools before bringing them to your classroom. It\'s like sending them to "AI boot camp" so they can be your guides in this new digital landscape.',
      'STATE_FED_PART': 'Coordinated research initiatives and resource sharing between local districts and state/federal agencies to address specific educational challenges. Includes collaborative research projects, shared funding mechanisms, best practice dissemination, and policy alignment across governance levels. These partnerships leverage federal research capacity and funding while ensuring local implementation needs and community contexts are integrated into broader educational policy development. Government collaboration enhances innovation incentives by connecting local initiatives with federal funding and regulatory flexibility, while providing essential resources and expertise for innovation sandboxes to conduct sophisticated experimental programs. These partnerships strengthen model evaluation standards through access to federal AI frameworks and comparative data, and enable robust impact reporting through standardized metrics and accountability frameworks that enhance transparency and stakeholder confidence.',
      'INNOV_SANDBOX': 'The "beta testing" phase for cool new AI tools in education\n\nWhat this means: Ever been part of a beta test for a new app or game? That\'s exactly what this is! Schools can try out cutting-edge AI tools with small groups first, working out the bugs and seeing what actually helps students learn. You might even get to be part of testing the next big thing in education!',
      'MODEL_EVAL_STD': 'The quality control checkpoint that keeps sketchy AI out of your classroom\n\nWhat this means: Before any AI tool makes it to your school, it goes through something like a rigorous college admissions process. Is it accurate? Fair? Actually helpful for learning? Does it protect your privacy? Only the AI tools that pass these tough standards get the green light for classroom use.',
      'IMPACT_REP_STD': 'A systematic and transparent approach to evaluating AI\'s educational impact is essential for building trust among educators, students, families, and policymakers. This includes regularly collecting data on academic outcomes, equity effects, tool usage, and cost-benefit analyses. Findings should be communicated clearly and accessibly through multiple channels such as reports and community updates. The U.S. Department of Education highlights that transparency and open communication about AI\'s role, limitations, and outcomes are critical for responsible and effective implementation (OET). Impact reporting enables informed community input through transparent data while demonstrating student protection compliance to address welfare concerns. This reporting validates professional development funding effectiveness by showing training outcomes and identifying support needs, while documenting innovation sandbox results to build community support for continued experimental programs.',
      'LOCAL_JOB_ALIGN': 'Strategic coordination between AI curriculum and regional workforce needs. Includes employer partnerships, skills gap analysis, internship programs, industry-recognized certifications, and regular curriculum updates based on evolving job market demands in AI and related fields. The White House executive order and analysis by Jobs for the Future (JFF) emphasize the importance of embedding AI skills in curricula, aligning education with labor market needs, and supporting apprenticeship and work-based learning models. Local job market alignment ensures career pathways connect to actual regional employment opportunities, with employers informing AI educational track design. This alignment guides infrastructure investment by identifying necessary AI tools for employment readiness and attracts innovation funding focused on regional workforce preparation. Additionally, local employers provide essential community input on workforce needs that guide AI education planning and curriculum development.',
      'COMM_INPUT': 'Formal mechanisms to involve parents, students, teachers and other stakeholders in AI policy. This can include surveys, advisory boards or public forums soliciting feedback before adopting new AI tools or policies. For example, guidance from Wyoming\'s education department explicitly asks: "Is there a plan for community input on AI policy and implementation, including feedback from students, parents, teachers, and other stakeholders?". At a higher level, one study\'s policy framework urges that "students should play an active role in drafting and implementing [AI] policy". Community input informs student protection standards by incorporating parent privacy and safety concerns into policy development, while ensuring digital citizenship education reflects local cultural values about responsible AI use. This input provides workforce insights from local employers that guide AI education planning for regional opportunities, and identifies AI competencies that parents and employers expect teachers to develop, determining professional development funding priorities.',
      'EDUC_AUTONOMY': 'Giving teachers the freedom to choose their own AI adventure\n\nWhat this means: Instead of forcing every teacher to use identical AI tools (boring!), this policy lets them pick what actually works for their teaching style and your learning needs. It\'s like having a playlist where each teacher can choose their own mix of traditional and AI-enhanced methods.',
      'AI_CAREER_PATH': 'Initiatives that create clear educational-to-career routes in AI and related fields. Examples include specialized high school programs (like AI magnet schools), partnerships with industry for internships, and guidance counseling that highlights AI-related careers. These programs might integrate AI into career-technical education or offer certifications (e.g. AI foundations certificates). The goal is to ensure students, especially from underrepresented groups, can smoothly transition into AI jobs or further STEM education. Career pathways require professional development funding to train teachers in AI industry standards, while connecting to local job market alignment through regional employment opportunities and employer partnerships. These pathways benefit from innovation sandboxes that pilot new workforce development approaches and require infrastructure investment in industry-standard AI tools that provide authentic workplace preparation environments.',
      'DIGITAL_CITIZEN': 'Learning to be a savvy, ethical navigator of the AI world\n\nWhat this means: This is basically your survival guide for the AI age! You\'ll learn to spot when AI is being sketchy or biased, understand the difference between getting help and cheating, and develop the superpower of critical thinking in a world where AI can generate anything from essays to art.'
    }
    return descriptions[policyId] || 'Description not available.'
  }

  // Helper function to get metric description
  const getMetricDescription = (metricId) => {
    const descriptions = {
      'AI_LITERACY': 'Measuring how well students can understand, work with, and think critically about AI systems\n\nWhat this means: Think of this as your "AI report card" - but way more comprehensive than just grades! It measures whether you can chat with AI chatbots effectively, create cool projects using AI tools, spot when AI is being biased or wrong, and understand the bigger picture of how AI impacts society. It\'s like testing whether you\'re truly "fluent" in the language of artificial intelligence.',
      'TEACHER_SATISFACTION': 'Tracking how happy and supported teachers feel when using AI tools in their work\n\nWhat this means: Ever notice when your teacher is stressed vs. when they\'re excited about teaching? This measures exactly that, but specifically related to AI integration. Happy teachers who feel confident with AI tools create better learning experiences for you. It\'s like measuring whether AI is making your teachers\' jobs easier and more enjoyable, or just adding to their stress pile.',
      'DIGITAL_EQUITY': 'Ensuring AI educational tools treat all students fairly regardless of background or identity\n\nWhat this means: Imagine if a video game\'s algorithm only gave power-ups to certain types of players - that would be totally unfair, right? This measurement checks whether AI educational tools are equally helpful for students of all races, genders, economic backgrounds, and learning abilities. It\'s basically the fairness referee for AI in schools.',
      'BUDGET_STRAIN': 'Tracking the financial costs and benefits of implementing AI tools in schools\n\nWhat this means: Schools don\'t have unlimited money (unfortunately!), so this measures whether AI tools are worth the investment. It\'s like asking: "Are we getting our money\'s worth from these AI systems?" This includes everything from buying the technology to training teachers, and whether the benefits to student learning justify the costs. Think of it as the school\'s financial report card for AI spending.',
      'AI_VULNERABILITY_INDEX': 'Assessing how secure and safe AI systems are from cyber threats and privacy breaches\n\nWhat this means: You know how you\'re careful about which apps you download and what information you share online? This measures the same thing for school AI systems. It checks whether hackers could mess with AI tools, whether your personal data is truly protected, and whether the AI might glitch out at the worst possible moment (like during a big presentation!).'
    }
    return descriptions[metricId] || 'Description not available.'
  }


  // Helper function to get metric resources
  const getMetricResources = (metricId) => {
    const resources = {
      'AI_LITERACY': '• UNESCO AI Competency Framework for Students: https://unesdoc.unesco.org/ark:/48223/pf0000391105?posInSet=1&queryId=df597e1b-215f-4221-8ae2-49b534abec94',
      'TEACHER_SATISFACTION': '• Teacher support in AI-assisted exams study: https://www.researchgate.net/publication/385656248_Teacher_support_in_AI-assisted_exams_an_experimental_study_to_inspect_the_effects_on_demotivation_anxiety_management_in_exams_L2_learning_experience_and_academic_success',
      'DIGITAL_EQUITY': '• Does AI have a bias problem?: https://www.nea.org/nea-today/all-news-articles/does-ai-have-bias-problem#:~:text=Because%20AI%20is%20based%20on,of%20color%2C"%20Freeman%20says.',
      'BUDGET_STRAIN': '• Using AI to guide school funding: 4 takeaways (Education Week): https://www.edweek.org/policy-politics/using-ai-to-guide-school-funding-4-takeaways/2024/03#:~:text=According%20to%20Mark%20Lieberman%2C%20at%20least%20one,in%20the%20%22high%22%20and%20%22medium%22%20risk%20categories.',
      'AI_VULNERABILITY_INDEX': '• Opportunities, guidelines and guardrails for effective and equitable use of AI in education (OECD): https://www.oecd.org/en/publications/oecd-digital-education-outlook-2023_c74f03de-en/full-report/opportunities-guidelines-and-guardrails-for-effective-and-equitable-use-of-ai-in-education_2f0862dc.html#chapter-d1e54017-91f2cf6ac9%23:~:text=Transparency%2520is%2520essential%2520for%2520uses,against%2520their%2520explainability%2520or%2520transparency'
    }
    return resources[metricId] || 'Resources not available.'
  }

  // Helper function to get policy resources
  const getPolicyResources = (policyId) => {
    const resources = {
      'INTEROP_STD': '• Interoperability: Unifying and Maximising Data Reuse Within Digital Education Ecosystems (OECD): https://www.oecd.org/en/publications/oecd-digital-education-outlook-2023_c74f03de-en/full-report/interoperability-unifying-and-maximising-data-reuse-within-digital-education-ecosystems_660f8da1.html\n• Interoperability is Finally Getting the Spotlight it Deserves (COSN): https://www.cosn.org/interoperability-is-finally-getting-the-spotlight-it-deserves/',
      'INFRA_INVEST': '• Hardware: The Provision of Connectivity and Digital Devices (OECD): https://www.oecd.org/en/publications/oecd-digital-education-outlook-2023_c74f03de-en/full-report/hardware-the-provision-of-connectivity-and-digital-devices_477c756b.html\n• Navigating the Future of AI in Education and Education in AI (EY): https://www.ey.com/content/dam/ey-unified-site/ey-com/en-ae/insights/education/documents/ey-education-and-ai-v6-lr.pdf',
      'ACCESS_STD': '• AI & Accessibility in Education (COSN): https://www.cosn.org/wp-content/uploads/2024/09/Blaschke_Report_2024_lfp.pdf\n• Where AI Meets Accessibility (Every Learner Everywhere): https://www.everylearnereverywhere.org/wp-content/uploads/Where-AI-Meets-Accessibility-Final.pdf\n• European Accessibility Act: https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32019L0882',
      'INNOV_INCENT': '• Learning Lab\'s AI FAST Challenge: Funding for Accelerated Study and Transformation: https://calearninglab.org/wp-content/uploads/2024/04/AI-FAST-Challenge-RFP-Final-1.pdf\n• Ed. Startups Get Money, Advice From Federal Program (EdWeek): https://www.edweek.org/policy-politics/ed-startups-get-money-advice-from-federal-program/2014/10\n• From Seed Funding to Scale (ED/IES SBIR Program Impact Analysis): https://www.study-group.org/_files/ugd/e901ef_8e1b7854d0b44e9d94af3715375ccae6.pdf',
      'PROTECT_STD': '• Effective AI Requires Effective Data Governance: https://edtechmagazine.com/higher/article/2025/05/effective-ai-requires-effective-data-governance\n• Opportunities, Guidelines and Guardrails for Effective and Equitable Use of AI in Education (OECD): https://www.oecd.org/en/publications/oecd-digital-education-outlook-2023_c74f03de-en/full-report/opportunities-guidelines-and-guardrails-for-effective-and-equitable-use-of-ai-in-education_2f0862dc.html\n• State Education Policy and the New Artificial Intelligence (NASBE): https://www.nasbe.org/state-education-policy-and-the-new-artificial-intelligence/',
      'PD_FUNDS': '• AI Competency Framework for Teachers (UNESCO): https://unesdoc.unesco.org/ark:/48223/pf0000391104\n• Education Policy Outlook 2024 (OECD): https://www.oecd.org/en/publications/education-policy-outlook-2024_dd5140e4-en.html',
      'STATE_FED_PART': '• NSF 23-596: Discovery Research PreK-12 (DRK-12): https://www.nsf.gov/funding/opportunities/drk-12-discovery-research-prek-12/nsf23-596/solicitation\n• Research-Practice Partnerships in Education: The State of the Field: https://wtgrantfoundation.org/wp-content/uploads/2021/07/RPP_State-of-the-Field_2021.pdf\n• From Seed Funding to Scale (ED/IES SBIR Program Impact Analysis): https://www.study-group.org/_files/ugd/e901ef_8e1b7854d0b44e9d94af3715375ccae6.pdf',
      'INNOV_SANDBOX': '• The Role of Sandboxes in Promoting Flexibility and Innovation in the Digital Age (OECD): https://www.oecd.org/en/publications/the-role-of-sandboxes-in-promoting-flexibility-and-innovation-in-the-digital-age_cdf5ed45-en.html\n• Artificial Intelligence Act and Regulatory Sandboxes: https://www.europarl.europa.eu/thinktank/en/document/EPRS_BRI(2022)733544',
      'MODEL_EVAL_STD': '• Report of the NEA Task Force on Artificial Intelligence in Education: https://www.nea.org/sites/default/files/2024-06/report_of_the_nea_task_force_on_artificial_intelligence_in_education_ra_2024.pdf\n• AI Test, Evaluation, Validation and Verification (NIST): https://www.nist.gov/ai-test-evaluation-validation-and-verification-tevv\n• Opportunities, Guidelines and Guardrails for Effective and Equitable Use of AI in Education (OECD): https://www.oecd.org/en/publications/oecd-digital-education-outlook-2023_c74f03de-en/full-report/opportunities-guidelines-and-guardrails-for-effective-and-equitable-use-of-ai-in-education_2f0862dc.html',
      'IMPACT_REP_STD': '• AI in Education: Impact Report 23-24: https://acrobat.adobe.com/id/urn:aaid:sc:EU:972705f9-e7a2-49b7-83e2-60899b3bb952?viewer%21megaVerb=group-discover\n• The State of AI in Education 2025 (Carnegie Learning): https://discover.carnegielearning.com/hubfs/PDFs/Whitepaper%20and%20Guide%20PDFs/2025-AI-in-Ed-Report.pdf?hsLang=en',
      'LOCAL_JOB_ALIGN': '• White House AI Education Plan Aligns With JFF\'s Vision, but Resources Are Lacking: https://www.linkedin.com/pulse/white-house-ai-education-plan-aligns-jffs-vision-resources-0xjlc/\n• Artificial Intelligence: Education Pipeline & Workforce Alignment for National Competitiveness (IEEEUSA): https://ieeeusa.org/assets/public-policy/positions/ai/AI_Education_Pipeline_Workforce_Alignment_1124.pdf',
      'COMM_INPUT': '• Bringing Communities In, Achieving AI for All: https://issues.org/artificial-intelligence-social-equity-parthasarathy-katzman/\n• How to Develop an Effective AI Policy for K–12 Schools: https://www.peardeck.com/blog/how-to-develop-an-effective-ai-policy-for-k-12-schools/\n• Wyoming DoE Guidance: https://edu.wyoming.gov/wp-content/uploads/2024/06/Guidance-for-AI-Policy-Development.pdf\n• Policy Framework: Students as Policy Drafters: https://educationaltechnologyjournal.springeropen.com/articles/10.1186/s41239-023-00408-3',
      'EDUC_AUTONOMY': '• Maintain Teacher Autonomy While Adopting AI Schoolwide: https://sais.org/resource/maintain-teacher-autonomy-while-adopting-ai-schoolwide/\n• Empowering ELA Teachers: Recommendations for Teacher Education in the AI Era: https://citejournal.org/volume-25/issue-1-25/english-language-arts/empowering-ela-teachers-recommendations-for-teacher-education-in-the-ai-era/\n• Autonomy in the Spaces: Teacher Autonomy, Scripted Lessons, and the Changing Role of Teachers: https://www.tandfonline.com/doi/full/10.1080/00220272.2023.2297229',
      'AI_CAREER_PATH': '• Riding the AI Wave: What\'s Happening in K-12 Education?: https://cset.georgetown.edu/article/riding-the-ai-wave-whats-happening-in-k-12-education/\n• Career Education Evolves to Meet Emerging Technology Demands: https://www.k12dive.com/news/career-education-evolves-emerging-technology-demands/743593/',
      'DIGITAL_CITIZEN': '• What You Need to Know About UNESCO\'s New AI Competency Frameworks for Students and Teachers: https://www.unesco.org/en/articles/what-you-need-know-about-unescos-new-ai-competency-frameworks-students-and-teachers\n• Digital Citizenship in Education (ISTE): https://iste.org/digital-citizenship\n• OECD AI Literacy Framework: https://ailiteracyframework.org/'
    }
    return resources[policyId] || 'Resources not available.'
  }

  return (
      <div className="min-h-screen playful-bg">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-8 h-8 text-white icon-pulse" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
              </div>
              <div>
                  <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
                    <svg className="w-8 h-8 text-blue-600 icon-animated" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/>
                    </svg>
                    AI Education Policy Simulator
                    <svg className="w-8 h-8 text-purple-600 icon-glow" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </h1>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowExploreImpacts(true)}
                disabled={selectedPolicies.length < 3}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl ${
                  selectedPolicies.length >= 3
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white transform hover:scale-105 active:scale-95'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                aria-label="Analyze detailed policy impacts and interactions"
                title={selectedPolicies.length < 3 ? "Select at least 3 policies to explore impacts" : "Analyze detailed policy impacts and interactions"}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span>Explore Impacts</span>
              </button>
              <button
                onClick={() => setShowStartScreen(true)}
                className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-full font-bold text-xl transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl glow-effect interactive-hover"
                title="Help & Instructions"
              >
                <svg className="w-6 h-6 icon-pulse" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-6h2v6zm0-8h-2V7h2v4z"/>
                </svg>
              </button>
              <button
                onClick={handleReset}
                className="fun-button flex items-center space-x-2 interactive-hover"
              >
                <svg className="w-5 h-5 icon-rotate" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
                </svg>
                <span>Reset</span>
              </button>
            </div>
          </div>
        </div>
      </div>


      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-3 h-[calc(100vh-120px)]">
        <div className="flex-1 overflow-hidden">
            <div className="h-full p-2 space-y-1">
              {/* Top Section - Charts */}
              <div className="grid grid-cols-12 gap-4 h-[48%]">
                {/* Time Series Chart */}
                <div className="col-span-6">
                  <div className="chart-container h-full">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="chart-title">
                        <svg className="w-6 h-6 text-blue-600 icon-animated" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
                        </svg>
                      Time Series Analysis
                    </h3>
                      <div className="flex items-center space-x-2">
                        <div className="relative">
                          <details className="relative">
                            <summary className="px-4 py-2 border-2 border-blue-300 rounded-lg text-sm font-semibold cursor-pointer focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-gradient-to-r from-blue-500 to-indigo-600 text-white backdrop-blur-sm list-none flex items-center space-x-2 transition-all duration-200 hover:from-blue-600 hover:to-indigo-700">
                              <svg className="w-5 h-5 icon-pulse" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
                              </svg>
                              <span>Outcome Metrics</span>
                              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </summary>
                            <div className="absolute right-0 top-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-20 min-w-48 p-2">
                              <div className="space-y-1">
                                {Object.entries(outcomeMetrics).map(([metricId, metric]) => {
                                  const colors = {
                                    AI_LITERACY: 'text-blue-600',
                                    TEACHER_SATISFACTION: 'text-amber-600',
                                    DIGITAL_EQUITY: 'text-red-600',
                                    AI_VULNERABILITY_INDEX: 'text-pink-600',
                                    BUDGET_STRAIN: 'text-gray-600'
                                  }
                                  return (
                                    <label key={metricId} className="flex items-center space-x-3 cursor-pointer hover:bg-blue-50 rounded-lg px-3 py-2 transition-all duration-200">
                                      <input
                                        type="checkbox"
                                        checked={selectedTimeSeriesMetrics.includes(metricId)}
                                        onChange={(e) => {
                                          if (e.target.checked) {
                                            setSelectedTimeSeriesMetrics(prev => [...prev, metricId])
                                          } else {
                                            setSelectedTimeSeriesMetrics(prev => prev.filter(id => id !== metricId))
                                          }
                                        }}
                                        className="w-4 h-4 rounded border-2 border-blue-300 text-blue-600 focus:ring-blue-500 focus:ring-2"
                                      />
                                      <span className="text-sm font-semibold flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                          {metricId === 'AI_LITERACY' ? (
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15V9h2v8h-2zm0-10V5h2v2h-2z"/>
                                          ) : metricId === 'TEACHER_SATISFACTION' ? (
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.5 6l-7.5 7.5-3-3 1.5-1.5L8 12.5l6-6L15.5 8z"/>
                                          ) : metricId === 'DIGITAL_EQUITY' ? (
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-3 14H7v-2h2v2zm0-4H7v-2h2v2zm0-4H7V6h2v2zm10 8h-8V8h8v8z"/>
                                          ) : metricId === 'AI_VULNERABILITY_INDEX' ? (
                                            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
                                          ) : metricId === 'BUDGET_STRAIN' ? (
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm0-4h-2V7h2v8z"/>
                                          ) : (
                                            <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
                                          )}
                                        </svg>
                                        <span className={colors[metricId] || 'text-slate-700'}>{metric.name}</span>
                                      </span>
                      </label>
                                  )
                                })}
                              </div>
                            </div>
                          </details>
                        </div>
                    </div>
                    </div>
                    <div className="h-64 flex items-center justify-center">
                      <TimeSeriesChart 
                        metricIds={selectedTimeSeriesMetrics}
                        selectedPolicies={selectedPolicies}
                        policyIntensities={policyIntensities}
                        shockScenario="NONE"
                      />
                    </div>
                  </div>
                </div>

                {/* Spider Chart */}
                <div className="col-span-6">
                  <div className="chart-container h-full">
                    <h3 className="chart-title">
                      <svg className="w-6 h-6 text-purple-600 icon-pulse" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                      Spider Chart
                    </h3>
                    <div className="flex justify-center items-center h-56">
                      <SpiderChart 
                        selectedPolicies={selectedPolicies}
                        policyIntensities={policyIntensities}
                        shockScenario="NONE"
                        size={380}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Section - Metrics Row */}
              <div>
                <div className="metrics-container">
                  <div className="flex justify-between items-end gap-3">
                    {Object.entries(currentMetrics).map(([metric, value]) => {
                      const colors = getHealthColor(metric, Math.round(value));
                      const gradientId = `gradient-${metric}`;
                      
                      return (
                        <div key={metric} className="metric-card">
                          <button
                            onClick={() => openMetricModal(metric)}
                            className="metric-info-btn"
                          >
                            <span className="text-xs font-bold">i</span>
                          </button>
                          <div className="metric-title">
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                              {metric === 'AI_LITERACY' ? (
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15V9h2v8h-2zm0-10V5h2v2h-2z"/>
                              ) : metric === 'TEACHER_SATISFACTION' ? (
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.5 6l-7.5 7.5-3-3 1.5-1.5L8 12.5l6-6L15.5 8z"/>
                              ) : metric === 'DIGITAL_EQUITY' ? (
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-3 14H7v-2h2v2zm0-4H7v-2h2v2zm0-4H7V6h2v2zm10 8h-8V8h8v8z"/>
                              ) : metric === 'AI_VULNERABILITY_INDEX' ? (
                                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
                              ) : metric === 'BUDGET_STRAIN' ? (
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm0-4h-2V7h2v8z"/>
                              ) : (
                                <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
                              )}
                            </svg>
                            {formatMetricName(metric)}
                          </div>
                          <div className="relative w-14 h-14 flex-shrink-0">
                            <svg className="w-14 h-14 transform -rotate-90" viewBox="0 0 56 56">
                              {/* Background circle */}
                              <circle
                                cx="28"
                                cy="28"
                                r="20"
                                stroke="#e2e8f0"
                                strokeWidth="4"
                                fill="none"
                              />
                              {/* Progress circle */}
                              <circle
                                cx="28"
                                cy="28"
                                r="20"
                                stroke={`url(#${gradientId})`}
                                strokeWidth="4"
                                fill="none"
                                strokeLinecap="round"
                                strokeDasharray={`${2 * Math.PI * 20}`}
                                strokeDashoffset={`${2 * Math.PI * 20 * (1 - Math.round(value) / 100)}`}
                                className="transition-all duration-500"
                              />
                              <defs>
                                <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                                  <stop offset="0%" stopColor={colors.start} />
                                  <stop offset="100%" stopColor={colors.end} />
                                </linearGradient>
                              </defs>
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="metric-value">{Math.round(value)}%</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Bottom Section - Policy Levers */}
              <div className="h-[40%] overflow-y-auto">
                <div className="bg-white/95 backdrop-blur-sm rounded-lg border border-slate-100 shadow-sm p-1.5">
                  <div className="grid grid-cols-3 gap-3">
                    {/* Column 1 - District Administrator */}
                    <div className="space-y-1">
                      <h3 className="text-sm font-bold text-black uppercase tracking-wide text-center pb-2 border-b-2 border-gray-300 flex items-center justify-center gap-2 mb-3">
                        <svg className="w-5 h-5 icon-animated" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/>
                        </svg>
                        <span>District Administrator</span>
                      </h3>
                      {Object.values(policyDefinitions).filter(policy => 
                        ['PROTECT_STD', 'PD_FUNDS', 'INFRA_INVEST'].includes(policy.id)
                      ).map((policy) => (
                        <div key={policy.id} className="policy-card-fun district-theme p-1.5 shadow-lg relative interactive-hover">
                          <div className="mb-0.5 flex items-center justify-between">
                            <div className="text-xs font-bold text-white text-center leading-tight flex-1 flex items-center justify-center">
                              {policy.name}
                            </div>
                            <button
                              onClick={() => openPolicyModal(policy.id)}
                              className="ml-1 w-5 h-5 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white hover:text-white transition-all duration-300 glow-effect"
                            >
                              <span className="text-xs font-bold">i</span>
                            </button>
                          </div>
                          
                          <div className="space-y-2">
                            {/* Low/Moderate/High buttons */}
                            <div className="flex space-x-1">
                                <button
                                onClick={() => handlePolicyIntensityChange(policy.id, 25)}
                                className={`flex-1 px-2 py-1 text-xs rounded font-semibold transition-all duration-200 ${
                                  (policyIntensities[policy.id] || 50) <= 33
                                    ? 'bg-green-500 text-white shadow-lg'
                                    : 'bg-white/20 text-white hover:bg-white/30'
                                }`}
                              >
                                Low
                                </button>
                              <button
                                onClick={() => handlePolicyIntensityChange(policy.id, 50)}
                                className={`flex-1 px-2 py-1 text-xs rounded font-semibold transition-all duration-200 ${
                                  (policyIntensities[policy.id] || 50) > 33 && (policyIntensities[policy.id] || 50) <= 66
                                    ? 'bg-yellow-500 text-white shadow-lg'
                                    : 'bg-white/20 text-white hover:bg-white/30'
                                }`}
                              >
                                Moderate
                              </button>
                              <button
                                onClick={() => handlePolicyIntensityChange(policy.id, 75)}
                                className={`flex-1 px-2 py-1 text-xs rounded font-semibold transition-all duration-200 ${
                                  (policyIntensities[policy.id] || 50) > 66
                                    ? 'bg-red-500 text-white shadow-lg'
                                    : 'bg-white/20 text-white hover:bg-white/30'
                                }`}
                              >
                                High
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Column 2 - School */}
                    <div className="space-y-1">
                      <h3 className="text-sm font-bold text-black uppercase tracking-wide text-center pb-2 border-b-2 border-gray-300 flex items-center justify-center gap-2 mb-3">
                        <svg className="w-5 h-5 icon-animated" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/>
                        </svg>
                        <span>School Principal</span>
                      </h3>
                      {Object.values(policyDefinitions).filter(policy => 
                        ['EDUC_AUTONOMY', 'DIGITAL_CITIZEN', 'AI_INTEGRATION'].includes(policy.id)
                      ).map((policy) => (
                        <div key={policy.id} className="policy-card-fun school-theme p-1.5 shadow-lg relative interactive-hover">
                          <div className="mb-0.5 flex items-center justify-between">
                            <div className="text-xs font-bold text-white text-center leading-tight flex-1 flex items-center justify-center">
                              {policy.name}
                            </div>
                            <button
                              onClick={() => openPolicyModal(policy.id)}
                              className="ml-1 w-5 h-5 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white hover:text-white transition-all duration-300 glow-effect"
                            >
                              <span className="text-xs font-bold">i</span>
                            </button>
                          </div>
                          
                          <div className="space-y-2">
                            {/* Low/Moderate/High buttons */}
                            <div className="flex space-x-1">
                                <button
                                onClick={() => handlePolicyIntensityChange(policy.id, 25)}
                                className={`flex-1 px-2 py-1 text-xs rounded font-semibold transition-all duration-200 ${
                                  (policyIntensities[policy.id] || 50) <= 33
                                    ? 'bg-green-500 text-white shadow-lg'
                                    : 'bg-white/20 text-white hover:bg-white/30'
                                }`}
                              >
                                Low
                                </button>
                              <button
                                onClick={() => handlePolicyIntensityChange(policy.id, 50)}
                                className={`flex-1 px-2 py-1 text-xs rounded font-semibold transition-all duration-200 ${
                                  (policyIntensities[policy.id] || 50) > 33 && (policyIntensities[policy.id] || 50) <= 66
                                    ? 'bg-yellow-500 text-white shadow-lg'
                                    : 'bg-white/20 text-white hover:bg-white/30'
                                }`}
                              >
                                Moderate
                              </button>
                              <button
                                onClick={() => handlePolicyIntensityChange(policy.id, 75)}
                                className={`flex-1 px-2 py-1 text-xs rounded font-semibold transition-all duration-200 ${
                                  (policyIntensities[policy.id] || 50) > 66
                                    ? 'bg-red-500 text-white shadow-lg'
                                    : 'bg-white/20 text-white hover:bg-white/30'
                                }`}
                              >
                                High
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Column 3 - Research */}
                    <div className="space-y-1">
                      <h3 className="text-sm font-bold text-black uppercase tracking-wide text-center pb-2 border-b-2 border-gray-300 flex items-center justify-center gap-2 mb-3">
                        <svg className="w-5 h-5 icon-animated" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9.5 3A6.5 6.5 0 0 1 16 9.5c0 1.61-.59 3.09-1.56 4.23l.27.27h.79l5 5-1.5 1.5-5-5v-.79l-.27-.27A6.516 6.516 0 0 1 9.5 16 6.5 6.5 0 0 1 3 9.5 6.5 6.5 0 0 1 9.5 3m0 2C7 5 5 7 5 9.5S7 14 9.5 14 14 12 14 9.5 12 5 9.5 5z"/>
                        </svg>
                        <span>Research Advisor</span>
                      </h3>
                      {Object.values(policyDefinitions).filter(policy => 
                        ['INNOV_SANDBOX', 'MODEL_EVAL_STD', 'ACCESS_STD'].includes(policy.id)
                      ).map((policy) => (
                        <div key={policy.id} className="policy-card-fun research-theme p-1.5 shadow-lg relative interactive-hover">
                          <div className="mb-0.5 flex items-center justify-between">
                            <div className="text-xs font-bold text-white text-center leading-tight flex-1 flex items-center justify-center">
                              {policy.name}
                            </div>
                            <button
                              onClick={() => openPolicyModal(policy.id)}
                              className="ml-1 w-5 h-5 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white hover:text-white transition-all duration-300 glow-effect"
                            >
                              <span className="text-xs font-bold">i</span>
                            </button>
                          </div>
                          
                          <div className="space-y-2">
                            {/* Low/Moderate/High buttons */}
                            <div className="flex space-x-1">
                                <button
                                onClick={() => handlePolicyIntensityChange(policy.id, 25)}
                                className={`flex-1 px-2 py-1 text-xs rounded font-semibold transition-all duration-200 ${
                                  (policyIntensities[policy.id] || 50) <= 33
                                    ? 'bg-green-500 text-white shadow-lg'
                                    : 'bg-white/20 text-white hover:bg-white/30'
                                }`}
                              >
                                Low
                                </button>
                              <button
                                onClick={() => handlePolicyIntensityChange(policy.id, 50)}
                                className={`flex-1 px-2 py-1 text-xs rounded font-semibold transition-all duration-200 ${
                                  (policyIntensities[policy.id] || 50) > 33 && (policyIntensities[policy.id] || 50) <= 66
                                    ? 'bg-yellow-500 text-white shadow-lg'
                                    : 'bg-white/20 text-white hover:bg-white/30'
                                }`}
                              >
                                Moderate
                              </button>
                              <button
                                onClick={() => handlePolicyIntensityChange(policy.id, 75)}
                                className={`flex-1 px-2 py-1 text-xs rounded font-semibold transition-all duration-200 ${
                                  (policyIntensities[policy.id] || 50) > 66
                                    ? 'bg-red-500 text-white shadow-lg'
                                    : 'bg-white/20 text-white hover:bg-white/30'
                                }`}
                              >
                                High
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
        </div>
      </div>
      
      {/* Policy Information Modal */}
      <PolicyModal
        isOpen={modalState.isOpen}
        onClose={closePolicyModal}
        policyName={modalState.policyName}
        description={modalState.description}
        resources={modalState.resources}
      />
      
      {/* Metric Information Modal */}
      <PolicyModal
        isOpen={metricModalState.isOpen}
        onClose={closeMetricModal}
        policyName={metricModalState.metricName}
        description={metricModalState.description}
        resources={metricModalState.resources}
      />
      
      {/* Explore Impacts Modal */}
      <ExploreImpactsModal
        isOpen={showExploreImpacts}
        onClose={() => setShowExploreImpacts(false)}
        selectedPolicies={selectedPolicies}
        policyIntensities={policyIntensities}
      />
      
      {/* Start Screen Modal */}
      <StartScreenModal
        isOpen={showStartScreen}
        onClose={() => setShowStartScreen(false)}
      />
    </div>
  )
}

export default App