import React, { useState, useEffect, useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'
import { policyDefinitions, outcomeMetrics, calculateCurrentMetrics, generateTimeSeriesData, calculatePolicySynergy, getPolicyCoefficients } from './lib/policyData'

// Time Series Chart Component
function TimeSeriesChart({ metricIds, selectedPolicies, policyIntensities }) {
  const metricColors = {
    AI_LITERACY: '#3B82F6',        // Blue
    COMMUNITY_TRUST: '#10B981',    // Green
    INNOVATION_INDEX: '#8B5CF6',   // Purple
    TEACHER_SATISFACTION: '#F59E0B', // Amber
    DIGITAL_EQUITY: '#EF4444',     // Red
    BUDGET_STRAIN: '#6B7280',      // Gray
    EMPLOYMENT_IMPACT: '#06B6D4',  // Cyan
    AI_VULNERABILITY_INDEX: '#EC4899' // Pink
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

// Default metrics constant - defined outside component to prevent recreation
const DEFAULT_METRICS = {
  AI_LITERACY: 50,
  COMMUNITY_TRUST: 50,
  INNOVATION_INDEX: 50,
  TEACHER_SATISFACTION: 50,
  DIGITAL_EQUITY: 50,
  BUDGET_STRAIN: 50,
  EMPLOYMENT_IMPACT: 50,
  AI_VULNERABILITY_INDEX: 50
};

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
          { year: 4, icon: "🚀", text: "Digital fairness gaps close as innovation flourishes district-wide" }
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
      },
      'DATA_ANALYTICS': {
        title: "Data-Driven Decision Making Journey",
        steps: [
          { year: 1, icon: "📊", text: `${intensity}% capacity building creates systematic data collection and analysis infrastructure` },
          { year: 2, icon: "🎯", text: "Administrators identify achievement gaps and target interventions with precision" },
          { year: 3, icon: "📈", text: "Student outcomes improve as resources are allocated based on evidence" },
          { year: 4, icon: "🤝", text: "Community trust strengthens through transparent, data-driven accountability" }
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
      },
      'DATA_ANALYTICS': {
        students: `Personalized learning experiences based on data-driven insights about their needs`,
        teachers: `Clear evidence guides instructional decisions and resource allocation`,
        parents: `Transparent reporting shows how their child's school is performing and improving`,
        administrators: `Strategic decision-making supported by comprehensive data analysis and predictive insights`
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

  // Helpers for sections 2-4
  const getDirectImpactSentence = (policyId) => {
    const coeffs = getPolicyCoefficients(policyId) || {}
    const positives = Object.entries(coeffs).filter(([, v]) => v > 0).sort((a,b)=>b[1]-a[1]).map(([k])=>outcomeMetrics[k]?.name || k)
    const negatives = Object.entries(coeffs).filter(([, v]) => v < 0).sort((a,b)=>a[1]-b[1]).map(([k])=>outcomeMetrics[k]?.name || k)
    const primaryPos = positives.slice(0,2)
    const primaryNeg = negatives.slice(0,1)
    const policyName = policyDefinitions[policyId]?.name || policyId
    const posText = primaryPos.length ? `boosts ${primaryPos.join(' and ')}` : ''
    const negText = primaryNeg.length ? `but can reduce ${primaryNeg.join(' and ')}` : ''
    if (!posText && !negText) return `${policyName} has limited direct measurable effects in this model.`
    if (posText && negText) return `${policyName} ${posText}, ${negText}.`
    if (posText) return `${policyName} ${posText}.`
    return `${policyName} ${negText}.`
  }

  const synergyDefs = {
    'PD_FUNDS+DATA_ANALYTICS': { TEACHER_SATISFACTION: 0.15, DIGITAL_EQUITY: 0.2, COMMUNITY_TRUST: 0.1 },
    'PD_FUNDS+DIGITAL_CITIZEN': { AI_LITERACY: 0.2, COMMUNITY_TRUST: 0.15 },
    'PD_FUNDS+AI_INTEGRATION': { AI_LITERACY: 0.25, TEACHER_SATISFACTION: 0.15 },
    'PD_FUNDS+INNOV_SANDBOX': { INNOVATION_INDEX: 0.2, AI_LITERACY: 0.15 },
    'PD_FUNDS+MODEL_EVAL_STD': { TEACHER_SATISFACTION: 0.1, COMMUNITY_TRUST: 0.15 },
    'INFRA_INVEST+ACCESS_STD': { DIGITAL_EQUITY: 0.25, AI_VULNERABILITY_INDEX: -0.1 },
    'INFRA_INVEST+INTEROP_STD': { INNOVATION_INDEX: 0.2, TEACHER_SATISFACTION: 0.15 },
    'INFRA_INVEST+AI_INTEGRATION': { AI_LITERACY: 0.3, TEACHER_SATISFACTION: 0.2 },
    'INFRA_INVEST+DIGITAL_CITIZEN': { DIGITAL_EQUITY: 0.2, AI_LITERACY: 0.15 },
    'INFRA_INVEST+INNOV_SANDBOX': { INNOVATION_INDEX: 0.2, AI_VULNERABILITY_INDEX: -0.1 },
    'COMM_INPUT+IMPACT_REP_STD': { COMMUNITY_TRUST: 0.2, DIGITAL_EQUITY: 0.1 },
    'COMM_INPUT+PROTECT_STD': { COMMUNITY_TRUST: 0.25, DIGITAL_EQUITY: 0.1 },
    'PROTECT_STD+MODEL_EVAL_STD': { AI_VULNERABILITY_INDEX: -0.3, COMMUNITY_TRUST: 0.15 },
    'PROTECT_STD+ACCESS_STD': { DIGITAL_EQUITY: 0.2, COMMUNITY_TRUST: 0.15 },
    'ACCESS_STD+DIGITAL_CITIZEN': { DIGITAL_EQUITY: 0.25, COMMUNITY_TRUST: 0.1 },
    'IMPACT_REP_STD+MODEL_EVAL_STD': { COMMUNITY_TRUST: 0.2, DIGITAL_EQUITY: 0.1 },
    'AI_INTEGRATION+LOCAL_JOB_ALIGN': { AI_LITERACY: 0.25, INNOVATION_INDEX: 0.2 },
    'AI_INTEGRATION+INNOV_SANDBOX': { AI_LITERACY: 0.3, TEACHER_SATISFACTION: 0.15 },
    'LOCAL_JOB_ALIGN+DATA_ANALYTICS': { EMPLOYMENT_IMPACT: 0.25, COMMUNITY_TRUST: 0.1 },
    'INNOV_SANDBOX+INTEROP_STD': { INNOVATION_INDEX: 0.25, TEACHER_SATISFACTION: 0.1 },
    'INNOV_SANDBOX+MODEL_EVAL_STD': { AI_VULNERABILITY_INDEX: -0.2, COMMUNITY_TRUST: 0.1 }
  }

  const tensionDefs = {
    'PD_FUNDS+INFRA_INVEST': { BUDGET_STRAIN: 0.2, TEACHER_SATISFACTION: -0.05 },
    'PD_FUNDS+INNOV_SANDBOX': { BUDGET_STRAIN: 0.15, TEACHER_SATISFACTION: -0.05 },
    'PD_FUNDS+COMM_INPUT': { TEACHER_SATISFACTION: -0.05, COMMUNITY_TRUST: -0.05 },
    'INFRA_INVEST+COMM_INPUT': { COMMUNITY_TRUST: -0.1, BUDGET_STRAIN: 0.15 },
    'INFRA_INVEST+INNOV_SANDBOX': { INNOVATION_INDEX: -0.05, BUDGET_STRAIN: 0.1 },
    'PROTECT_STD+EDUC_AUTONOMY': { TEACHER_SATISFACTION: -0.1, INNOVATION_INDEX: -0.05 },
    'PROTECT_STD+INNOV_SANDBOX': { INNOVATION_INDEX: -0.1, AI_VULNERABILITY_INDEX: -0.05 },
    'PROTECT_STD+LOCAL_JOB_ALIGN': { EMPLOYMENT_IMPACT: -0.05 },
    'MODEL_EVAL_STD+INNOV_SANDBOX': { INNOVATION_INDEX: -0.1 },
    'MODEL_EVAL_STD+EDUC_AUTONOMY': { TEACHER_SATISFACTION: -0.1, INNOVATION_INDEX: -0.05 },
    'ACCESS_STD+EDUC_AUTONOMY': { TEACHER_SATISFACTION: -0.1 },
    'ACCESS_STD+DATA_ANALYTICS': { INNOVATION_INDEX: -0.05 },
    'COMM_INPUT+EDUC_AUTONOMY': { TEACHER_SATISFACTION: -0.1 },
    'COMM_INPUT+INNOV_SANDBOX': { INNOVATION_INDEX: -0.1 },
    'AI_INTEGRATION+COMM_INPUT': { TEACHER_SATISFACTION: -0.05, COMMUNITY_TRUST: -0.05 },
    'AI_INTEGRATION+EDUC_AUTONOMY': { TEACHER_SATISFACTION: -0.1 },
    'AI_INTEGRATION+DIGITAL_CITIZEN': { AI_LITERACY: -0.05 },
    'LOCAL_JOB_ALIGN+STATE_FED_PART': { EMPLOYMENT_IMPACT: -0.05 },
    'LOCAL_JOB_ALIGN+EDUC_AUTONOMY': { TEACHER_SATISFACTION: -0.1 },
    'LOCAL_JOB_ALIGN+PROTECT_STD': { EMPLOYMENT_IMPACT: -0.05 }
  }

  const selectedPairs = []
  for (let i=0;i<selectedPolicies.length;i++) {
    for (let j=i+1;j<selectedPolicies.length;j++) {
      const a = selectedPolicies[i], b = selectedPolicies[j]
      const key = `${a}+${b}`
      const rkey = `${b}+${a}`
      if (synergyDefs[key] || synergyDefs[rkey] || tensionDefs[key] || tensionDefs[rkey]) {
        selectedPairs.push([a,b])
      }
    }
  }

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
                <h3 className="text-lg font-semibold text-slate-700 mb-2 flex items-center">
                  <span className="mr-2">🧭</span>Your Policy Stack
                </h3>
                <p className="text-sm text-slate-600 mb-3">These are the policy choices you adjusted:</p>
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
              {/* 2. Direct Impacts */}
              <div>
                <h3 className="text-lg font-semibold text-slate-700 mb-3 flex items-center">
                  <span className="mr-2">🎯</span>Direct Impacts of Your Choices
                </h3>
                <div className="space-y-2">
                  {activePolicies.map(p => (
                    <div key={p.id} className="text-sm text-slate-700">{getDirectImpactSentence(p.id)}</div>
                  ))}
                </div>
              </div>

              {/* 3. Notable Synergies */}
              <div>
                <h3 className="text-lg font-semibold text-slate-700 mb-3 flex items-center">
                  <span className="mr-2">🤝</span>Notable Synergies
                </h3>
                <div className="space-y-2">
                  {selectedPairs.map(([a,b], idx) => {
                    const k = `${a}+${b}`
                    const rk = `${b}+${a}`
                    const eff = synergyDefs[k] || synergyDefs[rk]
                    if (!eff) return null
                    const lines = Object.entries(eff).map(([metric, val]) => `${outcomeMetrics[metric]?.name || metric} (+${val})`).join(', ')
                    return (
                      <div key={idx} className="text-sm text-slate-700">
                        Pairing <span className="font-medium">{policyDefinitions[a]?.name}</span> with <span className="font-medium">{policyDefinitions[b]?.name}</span> reinforces: {lines}.
                      </div>
                    )
                  })}
                  {selectedPairs.every(([a,b]) => !(synergyDefs[`${a}+${b}`] || synergyDefs[`${b}+${a}`])) && (
                    <div className="text-sm text-slate-500">No strong synergies detected for this stack.</div>
                  )}
                </div>
              </div>

              {/* 4. Key Tensions */}
              <div>
                <h3 className="text-lg font-semibold text-slate-700 mb-3 flex items-center">
                  <span className="mr-2">⚖️</span>Key Tensions
                </h3>
                <div className="space-y-2">
                  {selectedPairs.map(([a,b], idx) => {
                    const k = `${a}+${b}`
                    const rk = `${b}+${a}`
                    const eff = tensionDefs[k] || tensionDefs[rk]
                    if (!eff) return null
                    const lines = Object.entries(eff).map(([metric, val]) => `${outcomeMetrics[metric]?.name || metric} (${val > 0 ? '+' : ''}${val})`).join(', ')
                    return (
                      <div key={`t-${idx}`} className="text-sm text-slate-700">
                        The combination of <span className="font-medium">{policyDefinitions[a]?.name}</span> and <span className="font-medium">{policyDefinitions[b]?.name}</span> introduces trade-offs: {lines}.
                      </div>
                    )
                  })}
                  {selectedPairs.every(([a,b]) => !(tensionDefs[`${a}+${b}`] || tensionDefs[`${b}+${a}`])) && (
                    <div className="text-sm text-slate-500">No notable tensions detected for this stack.</div>
                  )}
                </div>
              </div>

              {/* 5. System Dynamics */}
              <div>
                <h3 className="text-lg font-semibold text-slate-700 mb-3 flex items-center">
                  <span className="mr-2">🔁</span>System Dynamics
                </h3>
                <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
                  <li>Reinforcing: Capability-building (e.g., PD) → higher AI Literacy → more innovation → stronger case for continued capability.</li>
                  <li>Reinforcing: Infrastructure/Interoperability → smoother tool use → teacher satisfaction → adoption momentum.</li>
                  <li>Balancing: Budget strain from resource-heavy initiatives can slow expansion until offsets (e.g., external funding) kick in.</li>
                  <li>Balancing: Strong protection/evaluation can slow innovation speed while improving safety and trust.</li>
                </ul>
              </div>
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

// Modal component for policy information
const PolicyModal = ({ isOpen, onClose, policyName, description, importance, resources }) => {
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
            <div key={index} className="mb-2 flex items-start">
              <span className="text-slate-600 mr-2">•</span>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline text-sm text-left cursor-pointer"
              >
                {title}
              </a>
            </div>
          )
        }
        
        // If no URL pattern is found, just display as text
        return (
          <div key={index} className="mb-2 flex items-start">
            <span className="text-slate-600 mr-2">•</span>
            <span className="text-sm text-slate-600">{lineContent}</span>
          </div>
        )
      }
      return <div key={index} className="text-sm text-slate-600 mb-1">{line}</div>
    })
  }

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
              <h3 className="text-lg font-semibold text-slate-700 mb-2">What it is:</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{description}</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-slate-700 mb-2">Why it's important:</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{importance}</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-slate-700 mb-2">Research & Resources:</h3>
              <div className="text-sm">
                {formatResources(resources)}
              </div>
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
          <div className="bg-gradient-to-br from-slate-700 to-slate-900 text-white p-8 rounded-t-2xl">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">AI Education Policy Simulator</h1>
              <p className="text-xl text-slate-200 max-w-2xl mx-auto">
                Navigate the complex landscape of AI education policy decisions and see their real-world impact
              </p>
            </div>
          </div>

          <div className="p-8">
            {/* Metrics Visual Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Your Goals</h2>
              <p className="text-slate-600 mb-4 text-center">Keep all metrics thriving while managing budget and security risks</p>
              <div className="bg-white rounded-lg border border-slate-200 p-6">
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

            {/* Getting Started Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Getting Started</h2>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4 flex-shrink-0">1</div>
                    <div>
                      <h3 className="font-semibold text-slate-800 mb-2">Explore District Impact</h3>
                      <p className="text-slate-700">Choose the metrics to track using the dropdown. Instantly see how your policy choices shape results—both in the radar chart and the time series trends.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4 flex-shrink-0">2</div>
                    <div>
                      <h3 className="font-semibold text-slate-800 mb-2">Shape Policy Together</h3>
                      <p className="text-slate-700">Adjust policy levers and assumptions by stakeholder group. Every change updates the outcome metrics live.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4 flex-shrink-0">3</div>
                    <div>
                      <h3 className="font-semibold text-slate-800 mb-2">See How & Why</h3>
                      <p className="text-slate-700">Click "Why these impacts?" for quick stories connecting your decisions to real-world change.</p>
                      <p className="text-slate-700 mt-2">Use the ℹ️ (info) buttons for details, research, and expert explanations on any policy or metric.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4 flex-shrink-0">4</div>
                    <div>
                      <h3 className="font-semibold text-slate-800 mb-2">Experiment Boldly</h3>
                      <p className="text-slate-700">Mix and match policies to build your own scenario. Not happy? Hit Reset and try new ideas—no risk, big learning.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Encouragement Section */}
            <div className="mb-8">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 text-center">
                <p className="text-slate-700 text-lg leading-relaxed">
                  Jump in, test strategies, and see how collaborative decisions ripple across your district's future!
                </p>
              </div>
            </div>



            {/* Get Started Button */}
            <div className="text-center">
              <button
                onClick={onClose}
                className="bg-slate-800 hover:bg-slate-900 text-white font-semibold py-3 px-6 rounded-lg text-base transition-colors duration-200"
              >
                Get Started
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
  const [policyIntensities, setPolicyIntensities] = useState({
    DATA_ANALYTICS: 50,
    PROTECT_STD: 50,     // Starting point: 50%
    PD_FUNDS: 50,        // Starting point: 50%
    EDUC_AUTONOMY: 50,
    AI_INTEGRATION: 50,   // Starting point: 50%
    DIGITAL_CITIZEN: 50, // Starting point: 50%
    COMM_INPUT: 50,
    IMPACT_REP_STD: 50,
    LOCAL_JOB_ALIGN: 50,
    INTEROP_STD: 50,
    INFRA_INVEST: 50,    // Starting point: 50%
    ACCESS_STD: 50,      // Starting point: 50%
    STATE_FED_PART: 50,  // Starting point: 50%
    INNOV_SANDBOX: 50,   // Starting point: 50%
    MODEL_EVAL_STD: 50   // Starting point: 50%
  })
  const [selectedTimeSeriesMetrics, setSelectedTimeSeriesMetrics] = useState(['AI_LITERACY'])
  const [activeTab, setActiveTab] = useState('main')

  // State initialization
  const [modalState, setModalState] = useState({
    isOpen: false,
    policyName: '',
    description: '',
    importance: '',
    resources: ''
  })
  const [metricModalState, setMetricModalState] = useState({
    isOpen: false,
    metricName: '',
    description: '',
    importance: '',
    resources: ''
  })
  const [impactExplanationModal, setImpactExplanationModal] = useState(false)
  const [showStartScreen, setShowStartScreen] = useState(false)
  const [currentMetrics, setCurrentMetrics] = useState(DEFAULT_METRICS)
  const [selectedScenario, setSelectedScenario] = useState('NORMAL')

  const tabs = [
    { id: 'main', name: 'Main Dashboard' }
  ]

  // Update metrics when policies, intensities, or scenario changes - SAFE VERSION
  useEffect(() => {
    // Only run if there are actual policy changes
    if (selectedPolicies.length === 0) {
      return;
    }
    
    try {
      const metrics = calculateCurrentMetrics(selectedPolicies, policyIntensities);
      
      // Apply scenario adjustments to the calculated metrics
      let adjustedMetrics = { ...metrics }
      
      if (selectedScenario !== 'NORMAL') {
        // Get scenario baseline
        let scenarioBaseline
        switch (selectedScenario) {
          case 'TOOL_BIAS':
            scenarioBaseline = {
              AI_LITERACY: 45,
              COMMUNITY_TRUST: 35,
              INNOVATION_INDEX: 40,
              TEACHER_SATISFACTION: 45,
              DIGITAL_EQUITY: 30,
              BUDGET_STRAIN: 60,
              EMPLOYMENT_IMPACT: 45,
              AI_VULNERABILITY_INDEX: 65
            }
            break
          case 'FUNDING_CUT':
            scenarioBaseline = {
              AI_LITERACY: 40,
              COMMUNITY_TRUST: 45,
              INNOVATION_INDEX: 35,
              TEACHER_SATISFACTION: 35,
              DIGITAL_EQUITY: 35,
              BUDGET_STRAIN: 80,
              EMPLOYMENT_IMPACT: 40,
              AI_VULNERABILITY_INDEX: 60
            }
            break
          case 'DATA_BREACH':
            scenarioBaseline = {
              AI_LITERACY: 50,
              COMMUNITY_TRUST: 25,
              INNOVATION_INDEX: 30,
              TEACHER_SATISFACTION: 40,
              DIGITAL_EQUITY: 45,
              BUDGET_STRAIN: 70,
              EMPLOYMENT_IMPACT: 50,
              AI_VULNERABILITY_INDEX: 85
            }
            break
          default:
            scenarioBaseline = DEFAULT_METRICS
        }
        
        // Calculate the difference from normal baseline and apply to current metrics
        Object.keys(adjustedMetrics).forEach(metric => {
          const normalBaseline = DEFAULT_METRICS[metric] || 50
          const scenarioOffset = scenarioBaseline[metric] - normalBaseline
          adjustedMetrics[metric] = Math.max(0, Math.min(100, metrics[metric] + scenarioOffset))
        })
      }
      
      setCurrentMetrics(adjustedMetrics);
    } catch (error) {
      console.error('Error calculating metrics:', error);
      setCurrentMetrics(DEFAULT_METRICS);
    }
  }, [selectedPolicies, policyIntensities, selectedScenario]);

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
      if (metricName === 'BUDGET_STRAIN') {
        // Budget Strain specific logic
        if (metricValue <= 50) return { start: '#10b981', end: '#059669' }; // Green
        if (metricValue < 70) return { start: '#f59e0b', end: '#d97706' }; // Yellow
        return { start: '#ef4444', end: '#dc2626' }; // Red
      } else {
        // AI Vulnerability (lower is better)
        if (metricValue <= 20) return { start: '#10b981', end: '#059669' }; // Green
        if (metricValue < 40) return { start: '#f59e0b', end: '#d97706' }; // Yellow
        return { start: '#ef4444', end: '#dc2626' }; // Red
      }
    } else {
      // For other metrics (higher is better) - Updated color logic
      if (metricValue < 50) return { start: '#ef4444', end: '#dc2626' }; // Red
      if (metricValue < 65) return { start: '#ef4444', end: '#dc2626' }; // Red
      if (metricValue < 80) return { start: '#f59e0b', end: '#d97706' }; // Yellow
      return { start: '#10b981', end: '#059669' }; // Green (only at 80+)
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
      description: getPolicyDescription(policyId),
      importance: getPolicyImportance(policyId),
      resources: getPolicyResources(policyId)
    })
  }

  const closePolicyModal = () => {
    setModalState({
      isOpen: false,
      policyName: '',
      description: '',
      importance: '',
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
      importance: getMetricImportance(metricId),
      resources: getMetricResources(metricId)
    })
  }

  const closeMetricModal = () => {
    setMetricModalState({
      isOpen: false,
      metricName: '',
      description: '',
      importance: '',
      resources: ''
    })
  }

  // Reset function to restore default values based on research averages
  const handleReset = () => {
    console.log('Reset triggered - clearing all states')
    
    // Reset all policy intensities to their respective starting points
    setPolicyIntensities({
      DATA_ANALYTICS: 50,
      PROTECT_STD: 50,     // Starting point: 50%
      PD_FUNDS: 50,        // Starting point: 50%
      EDUC_AUTONOMY: 50,
      AI_INTEGRATION: 50,   // Starting point: 50%
      DIGITAL_CITIZEN: 50, // Starting point: 50%
      COMM_INPUT: 50,
      IMPACT_REP_STD: 50,
      LOCAL_JOB_ALIGN: 50,
      INTEROP_STD: 50,
      INFRA_INVEST: 50,    // Starting point: 50%
      ACCESS_STD: 50,      // Starting point: 50%
      STATE_FED_PART: 50,  // Starting point: 50%
      INNOV_SANDBOX: 50,   // Starting point: 50%
      MODEL_EVAL_STD: 50   // Starting point: 50%
    })
    
    // Clear selected policies to ensure metrics return to baseline
    setSelectedPolicies([])
    setSelectedTimeSeriesMetrics(['AI_LITERACY'])
    
    // Reset scenario to normal
    setSelectedScenario('NORMAL')
    
    // Directly reset metrics to baseline since useEffect won't run with empty policies
    setCurrentMetrics(DEFAULT_METRICS)
    
    console.log('Reset completed - all states set to their respective starting points and metrics reset to baseline')
  }

  // Handle scenario changes
  const handleScenarioChange = (scenario) => {
    setSelectedScenario(scenario)
    
    // Define scenario-specific baseline metrics
    let scenarioMetrics
    switch (scenario) {
      case 'NORMAL':
        scenarioMetrics = DEFAULT_METRICS
        break
      case 'TOOL_BIAS':
        scenarioMetrics = {
          AI_LITERACY: 45,           // Reduced due to bias concerns
          COMMUNITY_TRUST: 35,       // Significantly reduced trust
          INNOVATION_INDEX: 40,      // Innovation slowed by bias issues
          TEACHER_SATISFACTION: 45,  // Teachers concerned about bias
          DIGITAL_EQUITY: 30,        // Bias disproportionately affects some groups
          BUDGET_STRAIN: 60,         // Increased costs for bias mitigation
          EMPLOYMENT_IMPACT: 45,     // Bias affects career preparation
          AI_VULNERABILITY_INDEX: 65 // Increased vulnerability due to bias
        }
        break
      case 'FUNDING_CUT':
        scenarioMetrics = {
          AI_LITERACY: 40,           // Reduced training and resources
          COMMUNITY_TRUST: 45,       // Community concerned about cuts
          INNOVATION_INDEX: 35,      // Innovation limited by funding
          TEACHER_SATISFACTION: 35,  // Teachers frustrated by cuts
          DIGITAL_EQUITY: 35,        // Cuts disproportionately affect some schools
          BUDGET_STRAIN: 80,         // High strain due to cuts
          EMPLOYMENT_IMPACT: 40,     // Reduced career preparation resources
          AI_VULNERABILITY_INDEX: 60 // Less funding for security
        }
        break
      case 'DATA_BREACH':
        scenarioMetrics = {
          AI_LITERACY: 50,           // Unchanged
          COMMUNITY_TRUST: 25,       // Severely reduced trust
          INNOVATION_INDEX: 30,      // Innovation halted by security concerns
          TEACHER_SATISFACTION: 40,  // Teachers concerned about data safety
          DIGITAL_EQUITY: 45,        // Slightly affected
          BUDGET_STRAIN: 70,         // Increased costs for security
          EMPLOYMENT_IMPACT: 50,     // Unchanged
          AI_VULNERABILITY_INDEX: 85 // Very high vulnerability
        }
        break
      default:
        scenarioMetrics = DEFAULT_METRICS
    }
    
    // Update current metrics with scenario baseline
    setCurrentMetrics(scenarioMetrics)
    
    console.log(`Scenario changed to ${scenario} - metrics updated to reflect new baseline`)
  }

  // Helper function to get policy description
  const getPolicyDescription = (policyId) => {
    const descriptions = {
      'INTEROP_STD': 'Common technical specifications that enable different educational software and AI tools to share and reuse data seamlessly. In practice, this means agreeing on data formats, APIs and metadata so that student information systems, learning platforms, and AI tutors can talk to each other. OECD notes that interoperability is "the capacity to combine and use data from disparate digital tools with ease", and CoSN similarly defines it as the "seamless, secure, and controlled exchange of data between applications". Interoperability standards function most effectively with strong technical infrastructure, enabling seamless data transfer across systems while creating a level playing field that encourages innovation by reducing market barriers for smaller companies. These standards expand rather than limit teacher autonomy by ensuring diverse AI tools work together harmoniously, allowing educators to select optimal tools without compatibility concerns, while simultaneously supporting student protection through enforced shared data schemas and consistent security protocols across all integrated AI systems.',
      'INFRA_INVEST': 'Allocating funds and resources to build and upgrade the physical and network infrastructure (broadband internet, school servers, devices, cloud services, etc.) needed to support AI tools in schools. This includes extending high-speed Internet access, providing modern computers or tablets for students and teachers, and deploying secure servers for AI applications. OECD emphasizes that "connectivity and digital devices are necessary" to realize the full potential of digital learning. Infrastructure investment provides the technological foundation for secure student data protection and comprehensive monitoring systems, while enabling reliable access to AI tools necessary for digital citizenship education and hands-on learning. Strong infrastructure supports both local job market alignment and AI career pathways by providing students access to industry-standard tools and training environments. It creates the essential technical foundation for innovation sandboxes to conduct secure, controlled AI experimentation.',
      'ACCESS_STD': 'Comprehensive requirements ensuring AI tools serve all learners, including translation capabilities for multilingual students, voice-to-text/text-to-voice features for students with disabilities, and executive functioning support tools. Standards mandate the application of universal design principles in AI educational technology. Section 508 standards are harmonized with WCAG 2.0 Level AA for federally funded institutions. Accessibility standards synergize with data analytics capacity by expanding market opportunities and driving inclusive technology development, while infrastructure investment provides the foundation for implementing accessibility features effectively. Community input ensures standards reflect local needs, accessibility enhances digital citizenship education through inclusive design principles, and supports local job market alignment by helping develop skills for all.',
      'DATA_ANALYTICS': 'Data-Driven Decision Making (DDDM) and Analytics Capacity refer to a district\'s ability to systematically collect, analyze, and effectively use educational data—including AI-generated insights—to inform decisions at every level. This approach goes beyond funding and infrastructure alone by building sustainable capacity to turn data into actionable intelligence that improves student outcomes, resource management, and operational efficiency. It integrates data usage across instructional, administrative, and community engagement departments to ensure a cohesive strategy for AI and education technology adoption.',
      'PROTECT_STD': 'Comprehensive framework encompassing data governance, privacy compliance, transparency requirements, explainability standards, and protections against algorithmic bias. Establishes clear guidelines for how AI systems handle student data, make decisions, and ensure fair treatment across all demographics. OECD and other guidelines stress transparency as essential for trust: high-stakes AI must allow "verification of accuracy of performance for all sub-groups" and clear explanation of decision factors. Student protection standards synergize with community input by addressing stakeholder privacy concerns, while impact reporting provides transparent documentation of protection effectiveness. These standards align with accessibility requirements to protect vulnerable populations and work with model evaluation standards to establish comprehensive safety frameworks assessing both technical performance and student welfare.',
      'PD_FUNDS': 'Dedicated funding streams to train educators (pre-service and in-service) on AI concepts, tools, and pedagogy. This includes workshops, courses or certifications in AI literacy, as well as training on how to integrate AI tools ethically into teaching. The White House Executive Order on AI Education emphasizes that "Professional development programs focused on AI education will empower educators to confidently guide students". Similarly, policy experts recommend supporting educators in integrating AI with funded PD so teachers understand AI\'s capabilities and limitations. Professional development funding supports innovation sandboxes by training educators for innovative AI curricula, aligns with career pathways through specialized training that creates advancement opportunities, enhances student protection by teaching privacy-compliant practices, and enables effective digital citizenship education through educator preparation for responsible AI instruction.',
      'STATE_FED_PART': 'Coordinated research initiatives and resource sharing between local districts and state/federal agencies to address specific educational challenges. Includes collaborative research projects, shared funding mechanisms, best practice dissemination, and policy alignment across governance levels. These partnerships leverage federal research capacity and funding while ensuring local implementation needs and community contexts are integrated into broader educational policy development. Government collaboration enhances data analytics capacity by connecting local initiatives with federal funding and regulatory flexibility, while providing essential resources and expertise for innovation sandboxes to conduct sophisticated experimental programs. These partnerships strengthen model evaluation standards through access to federal AI frameworks and comparative data, and enable robust impact reporting through standardized metrics and accountability frameworks that enhance transparency and stakeholder confidence.',
      'INNOV_SANDBOX': 'Controlled environments for safely testing experimental AI technologies and policies before full implementation. Allows temporary regulatory flexibility, provides risk mitigation protocols, enables iterative development with real users, and generates evidence for broader policy decisions. OECD describes regulatory sandboxes as a way to allow flexible testing of innovations outside normal constraints. Innovation sandboxes validate infrastructure requirements and configurations before large-scale investment, while providing controlled environments to test and refine AI evaluation frameworks for broader implementation. These experimental settings pilot innovative digital citizenship curricula for responsible AI use and test new career preparation programs, demonstrating effectiveness before system-wide pathway implementation.',
      'MODEL_EVAL_STD': 'Comprehensive criteria for assessing AI educational tools across dimensions of transparency, explainability, privacy protection, bias detection, effectiveness, and safety. Includes testing protocols, performance benchmarks, ongoing monitoring requirements, and certification processes informed by latest AI safety research. It also covers requirements for evidence before adopting an AI tool. For instance, the NEA task force advises that "AI technology must only be adopted once data is supporting its appropriateness and efficacy" – either independent research or industry research adhering to rigorous methods. Model evaluation standards inform professional development by identifying AI competencies educators need for effective implementation, while validating infrastructure investments by ensuring AI tools perform effectively and identifying technical requirements. These standards provide evidence-based metrics for transparent impact reporting that builds community trust, and ensure AI tools meet safety and privacy requirements by incorporating student protection criteria as core evaluation components.',
      'IMPACT_REP_STD': 'A systematic and transparent approach to evaluating AI\'s educational impact is essential for building trust among educators, students, families, and policymakers. This includes regularly collecting data on academic outcomes, equity effects, tool usage, and cost-benefit analyses. Findings should be communicated clearly and accessibly through multiple channels such as reports and community updates. The U.S. Department of Education highlights that transparency and open communication about AI\'s role, limitations, and outcomes are critical for responsible and effective implementation (OET). Impact reporting enables informed community input through transparent data while demonstrating student protection compliance to address welfare concerns. This reporting validates professional development funding effectiveness by showing training outcomes and identifying support needs, while documenting innovation sandbox results to build community support for continued experimental programs.',
      'LOCAL_JOB_ALIGN': 'Strategic coordination between AI curriculum and regional workforce needs. Includes employer partnerships, skills gap analysis, internship programs, industry-recognized certifications, and regular curriculum updates based on evolving job market demands in AI and related fields. The White House executive order and analysis by Jobs for the Future (JFF) emphasize the importance of embedding AI skills in curricula, aligning education with labor market needs, and supporting apprenticeship and work-based learning models. Local job market alignment ensures career pathways connect to actual regional employment opportunities, with employers informing AI educational track design. This alignment guides infrastructure investment by identifying necessary AI tools for employment readiness and attracts innovation funding focused on regional workforce preparation. Additionally, local employers provide essential community input on workforce needs that guide AI education planning and curriculum development.',
      'COMM_INPUT': 'Formal mechanisms to involve parents, students, teachers and other stakeholders in AI policy. This can include surveys, advisory boards or public forums soliciting feedback before adopting new AI tools or policies. For example, guidance from Wyoming\'s education department explicitly asks: "Is there a plan for community input on AI policy and implementation, including feedback from students, parents, teachers, and other stakeholders?". At a higher level, one study\'s policy framework urges that "students should play an active role in drafting and implementing [AI] policy". Community input informs student protection standards by incorporating parent privacy and safety concerns into policy development, while ensuring digital citizenship education reflects local cultural values about responsible AI use. This input provides workforce insights from local employers that guide AI education planning for regional opportunities, and identifies AI competencies that parents and employers expect teachers to develop, determining professional development funding priorities.',
      'EDUC_AUTONOMY': 'Policies that respect and preserve teachers\' professional judgment in using AI. This means giving teachers flexibility to decide if, when and how to use AI tools in their classrooms or assignments. For example, Lake Highland Prep\'s AI policy explicitly "grant[ed] teacher\'s autonomy to determine if and how the technology fits into the needs of their students and curriculum". Under such autonomy, administrators set guidelines (like the school\'s "Red/Yellow/Green" system), but individual teachers choose usage levels per assignment. Teacher autonomy enables educators to identify relevant AI training that matches their professional development needs while providing feedback on training effectiveness. This autonomy allows meaningful participation in innovation sandboxes by adapting experimental tools to pedagogical approaches, and enables customization of AI instruction based on students\' career interests and local employment opportunities.',
      'AI_INTEGRATION': 'Initiatives that embed AI across K–12 through curriculum, assessment, classroom practice, and school operations, so educational institutions both teach about AI and responsibly use AI to enhance outcomes. This includes integrating computational thinking, data and algorithm literacy, coding and statistics into core and elective courses so young people can understand, critique, and eventually build AI-enabled solutions, not just consume them. It also covers assessment modernization with AI-informed formative tools, workload-reducing teacher supports such as AI-assisted planning and administrative automation, and general classroom technologies that personalize learning while preserving human agency and professional judgment.',
      'DIGITAL_CITIZEN': 'Implementation of a comprehensive curriculum addressing responsible AI use, including ethical decision-making, privacy awareness, critical evaluation of AI-generated content, understanding of AI bias, and skills for safe, effective participation in an AI-augmented digital world. UNESCO\'s AI Competency Framework for Students (2024) defines four core competencies: human-centered mindset, AI ethics, AI techniques, and AI system design. The OECD AI Literacy Framework (2025) emphasizes responsible AI engagement through four domains: Engaging with AI, Creating with AI, Learning about AI, and AI in Society. Digital citizenship education requires professional development funding to train teachers in responsible AI instruction and digital ethics pedagogy. This education incorporates community input by reflecting local cultural values and parent expectations about responsible technology use, while providing the ethical foundation for students to participate safely in innovation sandboxes through informed consent and responsible use principles.'
    }
    return descriptions[policyId] || 'Description not available.'
  }

  // Helper function to get policy importance
  const getPolicyImportance = (policyId) => {
    const importance = {
      'INTEROP_STD': 'Interoperability allows educators and systems to integrate AI-driven analytics and learning tools without burdensome manual data entry or one-off workarounds. It increases efficiency by reducing the need of ad-hoc processing to re-input, re-format or transform data, thus making education technology more scalable and cost-effective. In an AI context, standards ensure that data from different sources (e.g. test results, attendance, online activity) can feed AI models accurately and securely, supporting better decision-making and personalized learning.',
      'INFRA_INVEST': 'Robust infrastructure is the foundation for any AI-enabled education. High-bandwidth, low-latency networks are critical: AI-driven applications like real-time tutoring or virtual labs require "more agile (i.e., smaller latency) communications" (OECD). Without reliable networks and hardware, students and teachers cannot access AI services (cloud-based or on-premise). Infrastructure investment also promotes equity by closing the digital divide, ensuring all schools, both urban and rural, can use AI to improve learning.',
      'ACCESS_STD': 'As AI becomes increasingly embedded into educational settings and practices, it offers both opportunities and challenges. Accessibility standards ensure AI reduces rather than amplifies educational inequities. By requiring inclusive design, these standards help multilingual learners, students with disabilities, and those with diverse learning needs fully participate in AI-enhanced education, promoting truly equitable outcomes. The European Accessibility Act requires private sector compliance by June 2025.',
      'DATA_ANALYTICS': 'Many districts face challenges like limited expertise, fragmented systems, and underutilized data resources. Strengthening analytics capacity transforms data from untapped potential into powerful tools that guide evidence-based decision making. This approach enhances equity by identifying achievement gaps and monitoring intervention success, promotes accountability to communities, and supports proactive policies through predictive insights. Rather than one-off pilots or isolated projects, sustainable analytics capacity enables districts to dynamically adapt to evolving AI and EdTech landscapes, making governance more strategic and responsive.',
      'PROTECT_STD': 'Protects student privacy and trust in AI tools. AI systems often require large datasets (e.g. learning profiles, video from classrooms), so clear standards prevent misuse or breaches. NASBE notes that generative AI raises concerns about violating privacy laws like COPPA and FERPA, underscoring why schools need strict data rules. These standards build trust and ensure AI serves students\' best interests. They protect vulnerable populations from discrimination, maintain privacy rights, enable understanding of AI decisions affecting students, and create accountability mechanisms essential for ethical AI deployment in education.',
      'PD_FUNDS': 'Teachers are the linchpin of classroom AI use; without proper knowledge, AI tools can be misunderstood or misused. PD ensures that educators know how to select, implement and critique AI tools safely and effectively. It also helps teachers master new AI-integrated curricula and updated assessment methods. Well-funded PD reduces tech anxiety and inequality (so that all teachers, not just tech-savvy ones, can benefit). In short, it turns policy goals into classroom reality by building capacity. Research and reports stress that PD programs can help staff understand AI, its limitations and ethical considerations.',
      'STATE_FED_PART': 'Partnerships leverage collective resources and expertise to solve complex problems individual districts cannot tackle alone. They enable evidence-based policy making, reduce duplication of efforts, accelerate innovation adoption, and ensure local implementations align with broader educational goals.',
      'INNOV_SANDBOX': 'Sandboxes encourage innovation by letting schools try promising AI applications (adaptive learning, new assessment systems, administrative tools) without full risk. They help uncover practical issues (e.g. student privacy, technical glitches) before widescale roll-out. Engaging stakeholders in sandboxes can also generate evidence and best practices. As the OECD notes, sandboxes "promote flexible application or enforcement of policies" for emerging tech. For example, a sandbox might allow a school to test a new AI grading tool with volunteer teachers and students, collecting data to refine both the tool and the policies around it.',
      'MODEL_EVAL_STD': 'Such standards are crucial to ensure AI tools are reliable and do not inadvertently harm learning or equity. They hold Edtechs accountable and mandate ongoing evaluation: after deployment, tools should be "reassessed regularly… to ensure [they] continue to enhance, rather than detract from, students\' educational experiences". This guards against biases (e.g., if an AI grading system favors certain demographics) and unintended side effects. The OECD also highlights that transparent evaluation (with clear metrics and subgroup testing) is key for high-stakes uses. Overall, standards build trust by requiring that AI actually benefits teaching and learning.',
      'IMPACT_REP_STD': 'Transparent reporting builds community trust and enables informed decision-making. It holds districts accountable for AI investments, reveals whether tools deliver promised benefits, highlights equity gaps requiring attention, and empowers stakeholders to advocate for effective policies. Transparent reporting also enables educational leaders and communities to understand better how AI models function, anticipate their limitations and risks, and ensure that these technologies align with shared goals for high-quality, equitable learning.',
      'LOCAL_JOB_ALIGN': 'Alignment ensures students develop marketable AI skills leading to local employment opportunities. This creates economic mobility pathways, addresses regional talent needs, justifies community investment in AI education, and builds public support by demonstrating tangible career benefits. Ensuring this alignment also helps close the AI literacy divide, so that all regions and populations can participate in—and benefit from—the economic growth and innovation driven by artificial intelligence.',
      'COMM_INPUT': 'Community input ensures that AI initiatives reflect local values and needs, not just top-down decisions. Involving stakeholders can reveal concerns (e.g. privacy fears from parents, ethical considerations from teachers) that might otherwise be overlooked. It also builds legitimacy: when families and educators feel heard, they are more likely to support AI integration. Importantly, students\' perspectives can highlight usability issues – after all, they are the users. This democratic approach aligns with equity goals (e.g. giving voice to underrepresented groups) and can help identify unintended consequences early.',
      'EDUC_AUTONOMY': 'Teachers best understand their students\' needs and can adapt AI use accordingly. Autonomy encourages experimentation and innovation at the classroom level and can increase buy-in (teachers are more willing to use AI if not forced). It acknowledges teachers as professionals, which is crucial in a field historically characterized by top-down mandates. Autonomy can also lead to more creative and context-sensitive uses of AI that rigid policies might overlook. Additionally, it complements efforts to involve teachers in decision-making.',
      'AI_INTEGRATION': 'As AI reshapes learning, work, and civic life, schools must equip students with the knowledge and dispositions to use, understand, create with, and critically evaluate AI systems, including the data and algorithms that power them. Human-centered AI guidance from national and international bodies emphasizes building student and teacher AI competencies, safeguarding equity and privacy, and using AI to enhance—not replace—teaching and learning. Districts can also leverage AI to streamline teacher administrative load and support more timely feedback, while aligning curriculum with core competencies like computational thinking, data literacy, and ethical reasoning. Done well, integrated AI raises student outcomes, supports educator effectiveness, and prepares graduates for an AI-infused economy—while protecting inclusion, transparency, and trust.',
      'DIGITAL_CITIZEN': 'Digital citizenship prepares students to navigate AI\'s complexities throughout life. It develops critical thinking about AI claims, protects against manipulation and misinformation, promotes ethical technology use, and empowers students as informed digital participants rather than passive consumers.'
    }
    return importance[policyId] || 'Information not available.'
  }

  // Helper function to get metric description
  const getMetricDescription = (metricId) => {
    const descriptions = {
      'AI_LITERACY': 'Comprehensive measurement of students\' abilities to understand, interact with, create with, and critically evaluate AI systems across cognitive, technical, ethical, and practical dimensions. The UNESCO AI Competency Framework for Students outlines 12 competencies across four dimensions, while Digital Promise research framework distinguish between three ways to engage with AI in educational contexts: Interact, Create and Apply.',
      'COMMUNITY_TRUST': 'Measurement of stakeholder confidence in AI educational systems and policies through surveys, behavioral indicators, and engagement metrics assessing perceived reliability, transparency, fairness, and institutional competence in AI implementation. Evidence from various domains underlines the key role that human factors, and especially trust, play in the adoption of technology by practitioners, with research examining teachers\' trust in AI-based educational technology and global studies showing three out of five people (61%) are either ambivalent or unwilling to trust AI.',
      'INNOVATION_INDEX': 'Composite measurement of educational AI innovation through metrics including speed of adoption, employee participation in innovation, novel solution development, and systematic implementation of cutting-edge educational practices. The OECD report on Measuring Innovation in Education explores the association between school innovation and different measures related to educational objectives, comparing innovation in education to innovation in other sectors.',
      'TEACHER_SATISFACTION': 'Measurement of educator satisfaction with AI integration through job satisfaction surveys, retention rates, workload impact assessments, professional autonomy indicators, and technology acceptance measures. Research shows that AI can streamline administrative tasks, free more time for teachers to build relationships and social and emotional skills of students, tailor students\' learning experiences, and improve accessibility, with research examining teacher support in AI-assisted systems showing effects on demotivation, anxiety management, and learning experience.',
      'DIGITAL_EQUITY': 'Comprehensive measurement of fairness in AI educational systems through bias detection metrics, differential impact analysis across demographic groups, access equality indicators, and outcome gap assessments. Addressing inequity in AI requires understanding how bias manifests itself both technically and socially, with research investigating bias in AI algorithms used for monitoring student progress, specifically focusing on bias related to age, disability, and gender.',
      'BUDGET_STRAIN': 'Financial allocation and expenditure measurement including AI implementation costs, infrastructure investments, professional development expenses, cost-per-student impacts, and return-on-investment metrics for AI educational initiatives. The global EdTech budget for AI is predicted to shoot up to about $6 billion by 2025, with the state of Nevada using AI to help guide school funding decisions through tools that indicate likelihood of student graduation.',
      'EMPLOYMENT_IMPACT': 'Measurement of student preparation for AI-influenced workforce through skills assessments, career readiness indicators, job placement rates, employer satisfaction surveys, and alignment with evolving labor market demands. As AI transforms the job market by automating routine tasks, these measurements increasingly focus on students\' development of both uniquely human skills such as communication, critical thinking, and problem-solving abilities, as well as technical AI-ready competencies including data literacy, prompt engineering, AI tool utilization, and human-AI collaboration skills that are essential for securing family-sustaining employment in an AI-integrated economy.',
      'AI_VULNERABILITY_INDEX': 'Assessment of security risks, data protection weaknesses, system reliability issues, privacy vulnerabilities, and susceptibility to AI-related threats in educational environments. The rapid adoption of online learning has resulted in significant cybersecurity challenges, with AI models vulnerable to carefully crafted malicious inputs and data privacy risks requiring security assessments and robust policies.'
    }
    return descriptions[metricId] || 'Description not available.'
  }

  // Helper function to get metric importance
  const getMetricImportance = (metricId) => {
    const importance = {
      'AI_LITERACY': 'Clear guidelines are needed on what students are expected to learn about AI in K–12, with research highlighting the need for a competency framework to guide didactic proposals. Many education systems struggle to address the growing digital skills gap, crucial for students\' employability and ethical tech use. Bridging this gap is imperative to cultivate an AI-ready workforce. Students require AI literacy for digital citizenship, future career readiness, and protection against AI-related harms.',
      'COMMUNITY_TRUST': 'Trust and acceptance depend on the AI application, with clear patterns showing stark differences across countries in people\'s trust, attitudes and reported use of AI. Community trust directly affects adoption rates, policy sustainability, and the social license needed for AI educational innovation. Building this trust requires transparent communication about AI capabilities and limitations, meaningful stakeholder engagement, and demonstrated positive outcomes that align with community values and educational goals',
      'INNOVATION_INDEX': 'Innovation is happening in ed tech, new school launches, within school redesign, and in many individual classrooms throughout the world. Innovative solutions sit at the intersection of feasibility, desirability, benefit, and viability. Educational innovation drives continuous improvement, competitive advantage, and adaptation to changing technological and social contexts.',
      'TEACHER_SATISFACTION': 'The application of AI technology in education is increasingly recognized as a key driver of educational innovation, but extensive literature exists on AI integration while less emphasis has been placed on the critical role of teachers and their professional development needs. Pre-service teachers\' attitudes towards educational technology that utilizes AI have a potential impact on the learning outcomes of their future students. Teacher satisfaction directly affects retention, effectiveness, and successful AI adoption.',
      'DIGITAL_EQUITY': 'AI fairness in the educational context refers to ensuring that AI systems do not lead to unfair or biased outcomes for students, with studies showing that biased algorithms used in educational settings can perpetuate prejudice against specific demographics, especially in human-centered applications like education. Research shows how AI is deepening the digital divide, with some AI algorithms baked in bias, from facial recognition that may not recognize Black students to falsely flagging essays written by non-native English speakers as AI-generated.',
      'BUDGET_STRAIN': 'Educational institutions and EdTech leaders must understand the cost associated with AI before they can invest in the technology, with AI implementation requiring careful attention to cost components, distinguishing between AI-specific and traditional expenses like hardware and training. Simple generative AI systems that teachers can use in lesson planning can cost as little as $25 a month, but larger adaptive learning systems can run in the tens of thousands of dollars, with implementing these larger systems being very expensive and beyond the budgets of many schools.',
      'EMPLOYMENT_IMPACT': 'AI and GenAI are already changing the set of skills employers are demanding from the workforce, with analytical skills becoming more important in jobs with more exposure to AI, including critical thinking, writing, science and mathematics. AI presents an avenue through which students can improve digital literacy, critical thinking, problem-solving and creativity, preparing learners for future job demands. Students need preparation for an AI-augmented workforce where human-AI collaboration is increasingly common.',
      'AI_VULNERABILITY_INDEX': 'AI models can be tricked by carefully crafted malicious inputs that lead to incorrect or harmful decisions, with data privacy risks requiring protection of student data and compliance with relevant laws and regulations like FERPA. Educational institutions must protect vulnerable student populations from AI-related security threats while maintaining system functionality.'
    }
    return importance[metricId] || 'Information not available.'
  }

  // Helper function to get metric resources
  const getMetricResources = (metricId) => {
    const resources = {
      'AI_LITERACY': '• UNESCO AI Competency Framework for Students: https://unesdoc.unesco.org/ark:/48223/pf0000391105?posInSet=1&queryId=df597e1b-215f-4221-8ae2-49b534abec94',
      'COMMUNITY_TRUST': '• Trust Artificial Intelligence Global Study: https://ai.uq.edu.au/project/trust-artificial-intelligence-global-study',
      'INNOVATION_INDEX': '• Measuring Innovation in Education (OECD): https://www.oecd.org/en/publications/measuring-innovation-in-education-2023_a7167546-en.html',
      'TEACHER_SATISFACTION': '• Teacher support in AI-assisted exams study: https://www.researchgate.net/publication/385656248_Teacher_support_in_AI-assisted_exams_an_experimental_study_to_inspect_the_effects_on_demotivation_anxiety_management_in_exams_L2_learning_experience_and_academic_success',
      'DIGITAL_EQUITY': '• Does AI have a bias problem?: https://www.nea.org/nea-today/all-news-articles/does-ai-have-bias-problem#:~:text=Because%20AI%20is%20based%20on,of%20color%2C"%20Freeman%20says.',
      'BUDGET_STRAIN': '• Using AI to guide school funding: 4 takeaways (Education Week): https://www.edweek.org/policy-politics/using-ai-to-guide-school-funding-4-takeaways/2024/03#:~:text=According%20to%20Mark%20Lieberman%2C%20at%20least%20one,in%20the%20%22high%22%20and%20%22medium%22%20risk%20categories.',
      'EMPLOYMENT_IMPACT': '• Artificial Intelligence: Education Pipeline & Workforce Alignment for National Competitiveness: https://ieeeusa.org/assets/public-policy/positions/ai/AI_Education_Pipeline_Workforce_Alignment_1124.pdf',
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
      'DATA_ANALYTICS': '• A PRACTICAL FRAMEWORK FOR BUILDING A DATA-DRIVEN DISTRICT OR SCHOOL: HOW A FOCUS ON DATA QUALITY, CAPACITY, AND CULTURE SUPPORTS DATA-DRIVEN ACTION TO IMPROVE STUDENT OUTCOMES: https://publicconsultinggroup.com/wp-content/uploads/2024/09/edu_data-driven-district_practical-ideas_white_paper-1.pdf\n• How Districts are Using Data to Improve Educational Equity: https://digitalpromise.org/2022/08/23/how-districts-are-using-data-to-improve-educational-equity/\n• A Comprehensive Guide to Data-Driven Decision-Making in Education: https://www.panoramaed.com/blog/a-comprehensive-guide-to-data-driven-decision-making-in-education',
      'PROTECT_STD': '• Effective AI Requires Effective Data Governance: https://edtechmagazine.com/higher/article/2025/05/effective-ai-requires-effective-data-governance\n• Opportunities, Guidelines and Guardrails for Effective and Equitable Use of AI in Education (OECD): https://www.oecd.org/en/publications/oecd-digital-education-outlook-2023_c74f03de-en/full-report/opportunities-guidelines-and-guardrails-for-effective-and-equitable-use-of-ai-in-education_2f0862dc.html\n• State Education Policy and the New Artificial Intelligence (NASBE): https://www.nasbe.org/state-education-policy-and-the-new-artificial-intelligence/',
      'PD_FUNDS': '• AI Competency Framework for Teachers (UNESCO): https://unesdoc.unesco.org/ark:/48223/pf0000391104\n• Education Policy Outlook 2024 (OECD): https://www.oecd.org/en/publications/education-policy-outlook-2024_dd5140e4-en.html',
      'STATE_FED_PART': '• NSF 23-596: Discovery Research PreK-12 (DRK-12): https://www.nsf.gov/funding/opportunities/drk-12-discovery-research-prek-12/nsf23-596/solicitation\n• Research-Practice Partnerships in Education: The State of the Field: https://wtgrantfoundation.org/wp-content/uploads/2021/07/RPP_State-of-the-Field_2021.pdf\n• From Seed Funding to Scale (ED/IES SBIR Program Impact Analysis): https://www.study-group.org/_files/ugd/e901ef_8e1b7854d0b44e9d94af3715375ccae6.pdf',
      'INNOV_SANDBOX': '• The Role of Sandboxes in Promoting Flexibility and Innovation in the Digital Age (OECD): https://www.oecd.org/en/publications/the-role-of-sandboxes-in-promoting-flexibility-and-innovation-in-the-digital-age_cdf5ed45-en.html\n• Artificial Intelligence Act and Regulatory Sandboxes: https://www.europarl.europa.eu/thinktank/en/document/EPRS_BRI(2022)733544',
      'MODEL_EVAL_STD': '• Report of the NEA Task Force on Artificial Intelligence in Education: https://www.nea.org/sites/default/files/2024-06/report_of_the_nea_task_force_on_artificial_intelligence_in_education_ra_2024.pdf\n• AI Test, Evaluation, Validation and Verification (NIST): https://www.nist.gov/ai-test-evaluation-validation-and-verification-tevv\n• Opportunities, Guidelines and Guardrails for Effective and Equitable Use of AI in Education (OECD): https://www.oecd.org/en/publications/oecd-digital-education-outlook-2023_c74f03de-en/full-report/opportunities-guidelines-and-guardrails-for-effective-and-equitable-use-of-ai-in-education_2f0862dc.html',
      'IMPACT_REP_STD': '• AI in Education: Impact Report 23-24: https://acrobat.adobe.com/id/urn:aaid:sc:EU:972705f9-e7a2-49b7-83e2-60899b3bb952?viewer%21megaVerb=group-discover\n• The State of AI in Education 2025 (Carnegie Learning): https://discover.carnegielearning.com/hubfs/PDFs/Whitepaper%20and%20Guide%20PDFs/2025-AI-in-Ed-Report.pdf?hsLang=en',
      'LOCAL_JOB_ALIGN': '• White House AI Education Plan Aligns With JFF\'s Vision, but Resources Are Lacking: https://www.linkedin.com/pulse/white-house-ai-education-plan-aligns-jffs-vision-resources-0xjlc/\n• Artificial Intelligence: Education Pipeline & Workforce Alignment for National Competitiveness (IEEEUSA): https://ieeeusa.org/assets/public-policy/positions/ai/AI_Education_Pipeline_Workforce_Alignment_1124.pdf',
      'COMM_INPUT': '• Bringing Communities In, Achieving AI for All: https://issues.org/artificial-intelligence-social-equity-parthasarathy-katzman/\n• How to Develop an Effective AI Policy for K–12 Schools: https://www.peardeck.com/blog/how-to-develop-an-effective-ai-policy-for-k-12-schools/\n• Wyoming DoE Guidance: https://edu.wyoming.gov/wp-content/uploads/2024/06/Guidance-for-AI-Policy-Development.pdf\n• Policy Framework: Students as Policy Drafters: https://educationaltechnologyjournal.springeropen.com/articles/10.1186/s41239-023-00408-3',
      'EDUC_AUTONOMY': '• Maintain Teacher Autonomy While Adopting AI Schoolwide: https://sais.org/resource/maintain-teacher-autonomy-while-adopting-ai-schoolwide/\n• Empowering ELA Teachers: Recommendations for Teacher Education in the AI Era: https://citejournal.org/volume-25/issue-1-25/english-language-arts/empowering-ela-teachers-recommendations-for-teacher-education-in-the-ai-era/\n• Autonomy in the Spaces: Teacher Autonomy, Scripted Lessons, and the Changing Role of Teachers: https://www.tandfonline.com/doi/full/10.1080/00220272.2023.2297229',
      'AI_INTEGRATION': '• UNESCO AI Competency Framework for Students: https://unesdoc.unesco.org/ark:/48223/pf0000391105\n• OECD AI Literacy Framework: https://ailiteracyframework.org/\n• AI in Education: The Reality and the Potential (Brookings): https://www.brookings.edu/articles/ai-in-education-the-reality-and-the-potential/',
      'DIGITAL_CITIZEN': '• What You Need to Know About UNESCO\'s New AI Competency Frameworks for Students and Teachers: https://www.unesco.org/en/articles/what-you-need-know-about-unescos-new-ai-competency-frameworks-students-and-teachers\n• Digital Citizenship in Education (ISTE): https://iste.org/digital-citizenship\n• OECD AI Literacy Framework: https://ailiteracyframework.org/'
    }
    return resources[policyId] || 'Resources not available.'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">AI</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">AI Education Policy Simulator</h1>
                <p className="text-sm text-slate-600">Interactive Policy Impact Analysis & System Dynamics</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {/* Scenarios Dropdown */}
              <div className="relative">
                <select
                  value={selectedScenario}
                  onChange={(e) => handleScenarioChange(e.target.value)}
                  className="px-3 py-2 border border-slate-200 rounded text-sm cursor-pointer focus:ring-1 focus:ring-slate-400 focus:border-slate-400 bg-white/90 backdrop-blur-sm hover:bg-slate-50 transition-colors appearance-none pr-8"
                >
                  <option value="NORMAL">Normal Conditions</option>
                  <option value="TOOL_BIAS">Tool Bias Discovery</option>
                  <option value="FUNDING_CUT">Funding Cut</option>
                  <option value="DATA_BREACH">Data Breach</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              
              <button
                onClick={() => setShowStartScreen(true)}
                className="w-8 h-8 bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-700 rounded-md text-sm font-medium transition-colors duration-200 flex items-center justify-center border border-slate-200 hover:border-slate-300"
                title="Help & Instructions"
              >
                <span>?</span>
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 rounded-lg font-medium text-sm transition-colors duration-200 flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Reset</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex flex-col h-full">
        {/* Tab Navigation */}
        <div className="bg-white/60 backdrop-blur-sm border-b border-slate-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex space-x-1">
              {tabs.map((tab) => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 text-sm font-semibold rounded-t-xl transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-b from-blue-600 to-indigo-700 text-white shadow-xl'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-3 h-[calc(100vh-120px)]">
          <div className="flex-1 overflow-hidden">
            {activeTab === 'main' && (
              <div className="h-full p-2 space-y-1">
                {/* Top Section - Charts */}
                <div className="grid grid-cols-12 gap-4 h-[48%]">
                  {/* Time Series Chart */}
                  <div className="col-span-6">
                    <div className="bg-white/95 backdrop-blur-sm p-3 rounded-lg border border-slate-100 shadow-sm h-full">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-sm font-medium text-slate-600 flex items-center">
                          <div className="w-1.5 h-1.5 bg-slate-400 rounded-full mr-2"></div>
                          Time Series Analysis
                        </h3>
                        <div className="flex items-center space-x-2">
                          <div className="relative">
                            <details className="relative">
                              <summary className="px-2 py-1 border border-slate-200 rounded text-xs cursor-pointer focus:ring-1 focus:ring-slate-400 focus:border-slate-400 bg-white/90 backdrop-blur-sm list-none flex items-center space-x-1">
                                <span>Outcome Metrics</span>
                                <svg className="w-3 h-3 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </summary>
                              <div className="absolute right-0 top-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-20 min-w-48 p-2">
                                <div className="space-y-1">
                                  {Object.entries(outcomeMetrics).map(([metricId, metric]) => {
                                    // Use consistent color for all metrics
                                    const colors = {
                                      AI_LITERACY: 'text-slate-600',
                                      COMMUNITY_TRUST: 'text-slate-600', 
                                      INNOVATION_INDEX: 'text-slate-600',
                                      TEACHER_SATISFACTION: 'text-slate-600',
                                      DIGITAL_EQUITY: 'text-slate-600',
                                      BUDGET_STRAIN: 'text-slate-600',
                                      EMPLOYMENT_IMPACT: 'text-slate-600',
                                      AI_VULNERABILITY_INDEX: 'text-slate-600'
                                    }
                                    return (
                                      <label key={metricId} className="flex items-center space-x-2 cursor-pointer hover:bg-slate-50 rounded px-2 py-1">
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
                                          className="w-3 h-3 rounded border-slate-300 text-slate-600 focus:ring-1 focus:ring-slate-400"
                                        />
                                        <span className={`text-xs font-medium ${colors[metricId] || 'text-slate-600'}`}>
                                          {metric.name}
                                        </span>
                                      </label>
                                    )
                                  })}
                                </div>
                              </div>
                            </details>
                          </div>
                          {/* Moved Why these impacts button to header */}
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
                    <div className="bg-white/95 backdrop-blur-sm p-3 rounded-lg border border-slate-100 shadow-sm h-full">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-sm font-medium text-slate-600 flex items-center">
                          <div className="w-1.5 h-1.5 bg-slate-400 rounded-full mr-2"></div>
                          Impact Analysis
                        </h3>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setImpactExplanationModal(true)}
                            className="px-2 py-1 border border-slate-200 rounded text-xs cursor-pointer focus:ring-1 focus:ring-slate-400 focus:border-slate-400 bg-white/90 backdrop-blur-sm hover:bg-slate-50 transition-colors"
                          >
                            Why these impacts
                          </button>
                        </div>
                      </div>
                      <div className="h-64 flex items-center justify-center">
                        <SpiderChart 
                          selectedPolicies={selectedPolicies}
                          policyIntensities={policyIntensities}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Middle Section - Metrics Row */}
                <div className="h-[24%]">
                  <div className="bg-white/95 backdrop-blur-sm rounded-lg border border-slate-100 shadow-sm p-2 h-full">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-sm font-medium text-slate-600 flex items-center">
                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full mr-2"></div>
                        Outcome Metrics
                      </h3>
                      <div className="flex items-center space-x-2">
                        {/* Button removed - duplicate of header button */}
                      </div>
                    </div>
                    <div className="grid grid-cols-8 gap-2 h-full">
                      {Object.entries(currentMetrics).map(([metric, value]) => {
                        // Use dynamic health-based colors that change based on metric values
                        const colors = getHealthColor(metric, Math.round(value));
                        const gradientId = `gradient-${metric}`;
                        return (
                          <div key={metric} className="flex flex-col items-center justify-center space-y-1">
                            <button
                              onClick={() => openMetricModal(metric)}
                              className="w-4 h-4 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center text-slate-600 hover:text-slate-800 transition-colors"
                            >
                              <span className="text-xs font-bold">i</span>
                            </button>
                            <div className="text-xs font-medium text-slate-600 leading-tight mb-1 min-h-[1rem] flex items-center justify-center">
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
                                <span className="text-sm font-bold text-slate-900">{Math.round(value)}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Bottom Section - Policy Levers */}
                <div className="h-[28%] overflow-y-auto">
                  <div className="bg-white/95 backdrop-blur-sm rounded-lg border border-slate-100 shadow-sm p-2">
                    <div className="grid grid-cols-5 gap-2">
                      {/* Column 1 - District Administrator */}
                      <div className="space-y-1.5">
                        <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wide text-center pb-0.5 border-b border-blue-100">District Admin</h3>
                        {Object.values(policyDefinitions).filter(policy => 
                          ['DATA_ANALYTICS', 'PROTECT_STD', 'PD_FUNDS'].includes(policy.id)
                        ).map((policy) => (
                          <div key={policy.id} className="bg-white rounded-lg border border-slate-200 p-1.5 shadow-sm relative h-24">
                            <div className="mb-1 flex items-center justify-between">
                              <div className="text-xs font-semibold text-slate-800 text-center leading-tight flex-1">{policy.name}</div>
                              <button
                                onClick={() => openPolicyModal(policy.id)}
                                className="ml-1 w-4 h-4 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center text-slate-600 hover:text-slate-800 transition-colors"
                              >
                                <span className="text-xs font-bold">i</span>
                              </button>
                            </div>
                            
                            <div className="space-y-0.5">
                              <div className="relative">
                                <input
                                  type="range"
                                  min="0"
                                  max="100"
                                  value={policyIntensities[policy.id] !== undefined ? policyIntensities[policy.id] : 
                                         policy.id === 'DATA_ANALYTICS' ? 50 : 
                                         policy.id === 'PROTECT_STD' ? 72 : 
                                         policy.id === 'PD_FUNDS' ? 25 : 50}
                                  onChange={(e) => handlePolicyIntensityChange(policy.id, parseInt(e.target.value))}
                                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider-blue"
                                  style={
                                    policyIntensities[policy.id] !== undefined ? {
                                      background: (() => {
                                        const value = policyIntensities[policy.id];
                                        const center = 50; // All policies now use 50% as center
                                        if (value > center) {
                                          return `linear-gradient(to right, #e2e8f0 0%, #e2e8f0 ${center}%, #2563eb ${center}%, #2563eb ${value}%, #e2e8f0 ${value}%, #e2e8f0 100%)`;
                                        } else {
                                          return `linear-gradient(to right, #e2e8f0 0%, #e2e8f0 ${value}%, #2563eb ${value}%, #2563eb ${center}%, #e2e8f0 ${center}%, #e2e8f0 100%)`;
                                        }
                                      })()
                                    } : {
                                      background: '#e2e8f0'
                                    }
                                  }
                                />
                                {/* Center indicator */}
                                <div 
                                  className="absolute top-1/2 transform -translate-y-1/2 w-0.5 h-4 bg-slate-400 pointer-events-none"
                                  style={{
                                    left: `50%`
                                  }}
                                ></div>
                              </div>
                              <div className="relative">
                                <div className="flex justify-between text-xs text-slate-500">
                                  <span>{policy.id === 'DATA_ANALYTICS' ? '0' : policy.id === 'PD_FUNDS' ? '0' : '0'}</span>
                                  <span>{policy.id === 'DATA_ANALYTICS' ? '100' : policy.id === 'PD_FUNDS' ? '100' : '100'}</span>
                                </div>
                                <div className="flex justify-center mt-1">
                                  <div className="flex items-center justify-center">
                                    <input
                                      type="number"
                                      className="w-5 px-0 py-0.5 border-0 border-b border-transparent focus:border-slate-500 focus:outline-none bg-transparent text-xs text-blue-700 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                      value={policyIntensities[policy.id] !== undefined ? policyIntensities[policy.id] : 50}
                                                                              onChange={(e) => {
                                          const raw = Number(e.target.value);
                                          const newIntensity = Math.max(0, Math.min(100, Math.round(raw)));
                                          handlePolicyIntensityChange(policy.id, newIntensity);
                                        }}
                                      min={0}
                                      max={100}
                                      step={1}
                                    />
                                    <span className="text-xs text-slate-500 ml-1">
                                      %
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Column 2 - Educational Institution Leader */}
                      <div className="space-y-1.5">
                        <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wide text-center pb-0.5 border-b border-green-100">Ed Leader</h3>
                        {Object.values(policyDefinitions).filter(policy => 
                          ['EDUC_AUTONOMY', 'AI_INTEGRATION', 'DIGITAL_CITIZEN'].includes(policy.id)
                        ).map((policy) => (
                          <div key={policy.id} className="bg-white rounded-lg border border-slate-200 p-1.5 shadow-sm relative h-24">
                            <div className="mb-1 flex items-center justify-between">
                              <div className="text-xs font-semibold text-slate-800 text-center leading-tight flex-1">{policy.name}</div>
                              <button
                                onClick={() => openPolicyModal(policy.id)}
                                className="ml-1 w-4 h-4 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center text-slate-600 hover:text-slate-800 transition-colors"
                              >
                                <span className="text-xs font-bold">i</span>
                              </button>
                            </div>
                            
                            <div className="space-y-0.5">
                              <div className="relative">
                                <input
                                  type="range"
                                  min="0"
                                  max={100}
                                  value={policyIntensities[policy.id] !== undefined ? policyIntensities[policy.id] : 50}
                                                                      onChange={(e) => {
                                      const raw = Number(e.target.value);
                                      const newIntensity = Math.max(0, Math.min(100, Math.round(raw)));
                                      handlePolicyIntensityChange(policy.id, newIntensity);
                                    }}
                                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider-green"
                                  style={
                                    policyIntensities[policy.id] !== undefined ? {
                                      background: (() => {
                                        const value = policyIntensities[policy.id];
                                        let center, maxValue;
                                        
                                        center = 50; // All policies now use 50% as center
                                        maxValue = 100; // All policies use 0-100 range
                                        
                                        // Convert to percentages for the gradient
                                        const centerPercent = (center / maxValue) * 100;
                                        const valuePercent = (value / maxValue) * 100;
                                        
                                        if (value > center) {
                                          return `linear-gradient(to right, #e2e8f0 0%, #e2e8f0 ${centerPercent}%, #16a34a ${centerPercent}%, #16a34a ${valuePercent}%, #e2e8f0 ${valuePercent}%, #e2e8f0 100%)`;
                                        } else {
                                          return `linear-gradient(to right, #e2e8f0 0%, #e2e8f0 ${valuePercent}%, #16a34a ${valuePercent}%, #16a34a ${centerPercent}%, #e2e8f0 ${centerPercent}%, #e2e8f0 100%)`;
                                        }
                                      })()
                                    } : {
                                      background: '#e2e8f0'
                                    }
                                  }
                                />
                                {/* Center indicator */}
                                <div 
                                  className="absolute top-1/2 transform -translate-y-1/2 w-0.5 h-4 bg-slate-400 pointer-events-none"
                                  style={{
                                    left: `50%`
                                  }}
                                ></div>
                              </div>
                              <div className="relative">
                                <div className="flex justify-between text-xs text-slate-500">
                                  <span>0</span>
                                  <span>100</span>
                                </div>
                                <div className="flex justify-center mt-1">
                                  <div className="flex items-center justify-center">
                                    <input
                                      type="number"
                                      className="w-5 px-0 py-0.5 border-0 border-b border-transparent focus:border-slate-500 focus:outline-none bg-transparent text-xs text-green-700 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                      value={policyIntensities[policy.id] !== undefined ? policyIntensities[policy.id] : 50}
                                      onChange={(e) => {
                                        const raw = Number(e.target.value);
                                        let newIntensity = 50;
                                        if (policy.id === 'AI_INTEGRATION' || policy.id === 'EDUC_AUTONOMY' || policy.id === 'DIGITAL_CITIZEN') {
                                          newIntensity = raw; // 0-100 (direct mapping)
                                        } else {
                                          newIntensity = raw;
                                        }
                                        newIntensity = Math.max(0, Math.min(100, Math.round(newIntensity)));
                                        handlePolicyIntensityChange(policy.id, newIntensity);
                                      }}
                                      min={0}
                                      max={100}
                                      step={1}
                                    />
                                    <span className="text-xs text-slate-500 ml-1">
                                      {policy.id === 'AI_INTEGRATION' || policy.id === 'EDUC_AUTONOMY' || policy.id === 'DIGITAL_CITIZEN' ? '%' : ''}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Column 3 - Community Representative */}
                      <div className="space-y-1.5">
                        <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wide text-center pb-0.5 border-b border-purple-100">Community Rep</h3>
                        {Object.values(policyDefinitions).filter(policy => 
                          ['COMM_INPUT', 'IMPACT_REP_STD', 'LOCAL_JOB_ALIGN'].includes(policy.id)
                        ).map((policy) => (
                          <div key={policy.id} className="bg-white rounded-lg border border-slate-200 p-1.5 shadow-sm relative h-24">
                            <div className="mb-1 flex items-center justify-between">
                              <div className="text-xs font-semibold text-slate-800 text-center leading-tight flex-1">{policy.name}</div>
                              <button
                                onClick={() => openPolicyModal(policy.id)}
                                className="ml-1 w-4 h-4 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center text-slate-600 hover:text-slate-800 transition-colors"
                              >
                                <span className="text-xs font-bold">i</span>
                              </button>
                            </div>
                            
                            <div className="space-y-0.5">
                              <div className="relative">
                                <input
                                  type="range"
                                  min="0"
                                  max="100"
                                  value={policyIntensities[policy.id] !== undefined ? policyIntensities[policy.id] : 50}
                                  onChange={(e) => handlePolicyIntensityChange(policy.id, parseInt(e.target.value))}
                                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider-purple"
                                  style={
                                    policyIntensities[policy.id] !== undefined ? {
                                      background: (() => {
                                        const value = policyIntensities[policy.id];
                                        const center = 50; // All policies now use 50% as center
                                        if (value > center) {
                                          return `linear-gradient(to right, #e2e8f0 0%, #e2e8f0 ${center}%, #9333ea ${center}%, #9333ea ${value}%, #e2e8f0 ${value}%, #e2e8f0 100%)`;
                                        } else {
                                          return `linear-gradient(to right, #e2e8f0 0%, #e2e8f0 ${value}%, #9333ea ${value}%, #9333ea ${center}%, #e2e8f0 ${center}%, #e2e8f0 100%)`;
                                        }
                                      })()
                                    } : {
                                      background: '#e2e8f0'
                                    }
                                  }
                                />
                                {/* Center indicator */}
                                <div 
                                  className="absolute top-1/2 transform -translate-y-1/2 w-0.5 h-4 bg-slate-400 pointer-events-none"
                                  style={{
                                    left: `50%`
                                  }}
                                ></div>
                              </div>
                              <div className="relative">
                                <div className="flex justify-between text-xs text-slate-500">
                                  <span>0%</span>
                                  <span>100%</span>
                                </div>
                                <div className="flex justify-center mt-1">
                                  <div className="flex items-center justify-center">
                                    <input
                                      type="number"
                                      className="w-6 px-0 py-0.5 border-0 border-b border-transparent focus:border-slate-500 focus:outline-none bg-transparent text-xs text-purple-700 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                      value={policyIntensities[policy.id] !== undefined ? policyIntensities[policy.id] : 50}
                                                                              onChange={(e) => {
                                          const raw = Number(e.target.value);
                                          const newIntensity = Math.max(0, Math.min(100, Math.round(raw)));
                                          handlePolicyIntensityChange(policy.id, newIntensity);
                                        }}
                                      min={0}
                                      max={100}
                                      step={1}
                                    />
                                    <span className="text-xs text-slate-500 ml-1">
                                      %
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Column 4 - EdTech Industry Representative */}
                      <div className="space-y-1.5">
                        <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wide text-center pb-0.5 border-b border-orange-100">EdTech Industry</h3>
                        {Object.values(policyDefinitions).filter(policy => 
                          ['INTEROP_STD', 'INFRA_INVEST', 'ACCESS_STD'].includes(policy.id)
                        ).map((policy) => (
                          <div key={policy.id} className="bg-white rounded-lg border border-slate-200 p-1.5 shadow-sm relative h-24">
                            <div className="mb-1 flex items-center justify-between">
                              <div className="text-xs font-semibold text-slate-800 text-center leading-tight flex-1">{policy.name}</div>
                              <button
                                onClick={() => openPolicyModal(policy.id)}
                                className="ml-1 w-4 h-4 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center text-slate-600 hover:text-slate-800 transition-colors"
                              >
                                <span className="text-xs font-bold">i</span>
                              </button>
                            </div>
                            
                            <div className="space-y-0.5">
                              <div className="relative">
                                <input
                                  type="range"
                                  min="0"
                                  max="100"
                                  value={policyIntensities[policy.id] !== undefined ? policyIntensities[policy.id] : 50}
                                  onChange={(e) => handlePolicyIntensityChange(policy.id, parseInt(e.target.value))}
                                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider-orange"
                                  style={
                                    policyIntensities[policy.id] !== undefined ? {
                                      background: (() => {
                                        const value = policyIntensities[policy.id];
                                        const center = 50; // All policies now use 50% as center
                                        if (value > center) {
                                          return `linear-gradient(to right, #e2e8f0 0%, #e2e8f0 ${center}%, #ea580c ${center}%, #ea580c ${value}%, #e2e8f0 ${value}%, #e2e8f0 100%)`;
                                        } else {
                                          return `linear-gradient(to right, #e2e8f0 0%, #e2e8f0 ${value}%, #ea580c ${value}%, #ea580c ${center}%, #e2e8f0 ${center}%, #e2e8f0 100%)`;
                                        }
                                      })()
                                    } : {
                                      background: '#e2e8f0'
                                    }
                                  }
                                />
                                {/* Center indicator */}
                                <div 
                                  className="absolute top-1/2 transform -translate-y-1/2 w-0.5 h-4 bg-slate-400 pointer-events-none"
                                  style={{
                                    left: `50%`
                                  }}
                                ></div>
                              </div>
                              <div className="relative">
                                <div className="flex justify-between text-xs text-slate-500">
                                  <span>0%</span>
                                  <span>100%</span>
                                </div>
                                <div className="flex justify-center mt-1">
                                  <div className="flex items-center justify-center">
                                    <input
                                      type="number"
                                      className="w-5 px-0 py-0.5 border-0 border-b border-transparent focus:border-slate-500 focus:outline-none bg-transparent text-xs text-orange-700 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                      value={policyIntensities[policy.id] !== undefined ? policyIntensities[policy.id] : 50}
                                      onChange={(e) => {
                                        const raw = Number(e.target.value);
                                        let newIntensity = 50;
                                        if (policy.id === 'INTEROP_STD') {
                                          newIntensity = raw; // 0-100
                                        } else if (policy.id === 'INFRA_INVEST') {
                                          newIntensity = raw; // 0-100 (direct mapping)
                                        } else if (policy.id === 'ACCESS_STD') {
                                          newIntensity = Math.max(0, (raw - 50) * 2); // 50-100 -> 0-100
                                        } else {
                                          newIntensity = raw;
                                        }
                                        newIntensity = Math.max(0, Math.min(100, Math.round(newIntensity)));
                                        handlePolicyIntensityChange(policy.id, newIntensity);
                                      }}
                                      min={policy.id === 'ACCESS_STD' ? 50 : 0}
                                      max={policy.id === 'INFRA_INVEST' ? 100 : 100}
                                      step={1}
                                    />
                                    <span className="text-xs text-slate-500 ml-1">
                                      {policy.id === 'INFRA_INVEST' || policy.id === 'ACCESS_STD' ? '%' : ''}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Column 5 - Research & Ethics Advisor */}
                      <div className="space-y-1.5">
                        <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wide text-center pb-0.5 border-b border-red-100">Research & Ethics</h3>
                        {Object.values(policyDefinitions).filter(policy => 
                          ['STATE_FED_PART', 'INNOV_SANDBOX', 'MODEL_EVAL_STD'].includes(policy.id)
                        ).map((policy) => (
                          <div key={policy.id} className="bg-white rounded-lg border border-slate-200 p-1.5 shadow-sm relative h-24">
                            <div className="mb-1 flex items-center justify-between">
                              <div className="text-xs font-semibold text-slate-800 text-center leading-tight flex-1">{policy.name}</div>
                              <button
                                onClick={() => openPolicyModal(policy.id)}
                                className="ml-1 w-4 h-4 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center text-slate-600 hover:text-slate-800 transition-colors"
                              >
                                <span className="text-xs font-bold">i</span>
                              </button>
                            </div>
                            
                            <div className="space-y-0.5">
                              <div className="relative">
                                <input
                                  type="range"
                                  min="0"
                                  max="100"
                                  value={policyIntensities[policy.id] !== undefined ? policyIntensities[policy.id] : 
                                         policy.id === 'STATE_FED_PART' ? 10 : 
                                         policy.id === 'INNOV_SANDBOX' ? 45 : 
                                         policy.id === 'MODEL_EVAL_STD' ? 65 : 50}
                                  onChange={(e) => handlePolicyIntensityChange(policy.id, parseInt(e.target.value))}
                                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider-red"
                                  style={
                                    policyIntensities[policy.id] !== undefined ? {
                                      background: (() => {
                                        const value = policyIntensities[policy.id];
                                        const center = 50; // All policies now use 50% as center
                                        if (value > center) {
                                          return `linear-gradient(to right, #e2e8f0 0%, #e2e8f0 ${center}%, #dc2626 ${center}%, #dc2626 ${value}%, #e2e8f0 ${value}%, #e2e8f0 100%)`;
                                        } else {
                                          return `linear-gradient(to right, #e2e8f0 0%, #e2e8f0 ${value}%, #dc2626 ${value}%, #dc2626 ${center}%, #e2e8f0 ${center}%, #e2e8f0 100%)`;
                                        }
                                      })()
                                    } : {
                                      background: '#e2e8f0'
                                    }
                                  }
                                />
                                {/* Center indicator */}
                                <div 
                                  className="absolute top-1/2 transform -translate-y-1/2 w-0.5 h-4 bg-slate-400 pointer-events-none"
                                  style={{
                                    left: `50%`
                                  }}
                                ></div>
                              </div>
                              <div className="relative">
                                <div className="flex justify-between text-xs text-slate-500">
                                  <span>0%</span>
                                  <span>100%</span>
                                </div>
                                <div className="flex justify-center mt-1">
                                  <div className="flex items-center justify-center">
                                    <input
                                      type="number"
                                      className="w-5 px-0 py-0.5 border-0 border-b border-transparent focus:border-slate-500 focus:outline-none bg-transparent text-xs text-red-700 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                      value={policyIntensities[policy.id] !== undefined ? policyIntensities[policy.id] : 50}
                                                                              onChange={(e) => {
                                          const raw = Number(e.target.value);
                                          const newIntensity = Math.max(0, Math.min(100, Math.round(raw)));
                                          handlePolicyIntensityChange(policy.id, newIntensity);
                                        }}
                                      min={0}
                                      max={100}
                                      step={1}
                                    />
                                                                          <span className="text-xs text-slate-500 ml-1">
                                        %
                                      </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Modals */}
            <div>
                {/* Policy Information Modal */}
                <PolicyModal
                  isOpen={modalState.isOpen}
                  onClose={closePolicyModal}
                  policyName={modalState.policyName}
                  description={modalState.description}
                  importance={modalState.importance}
                  resources={modalState.resources}
                />
                
                {/* Metric Information Modal */}
                <PolicyModal
                  isOpen={metricModalState.isOpen}
                  onClose={closeMetricModal}
                  policyName={metricModalState.metricName}
                  description={metricModalState.description}
                  importance={metricModalState.importance}
                  resources={metricModalState.resources}
                />
                
                {/* Impact Explanation Modal */}
                <ImpactExplanationModal
                  isOpen={impactExplanationModal}
                  onClose={() => setImpactExplanationModal(false)}
                  selectedPolicies={selectedPolicies}
                  policyIntensities={policyIntensities}
                />
                
                {/* Start Screen Modal */}
                <StartScreenModal
                  isOpen={showStartScreen}
                  onClose={() => setShowStartScreen(false)}
                />
              </div>
            </div>
        </div>
      </div>
    </div>
  )
}

export default App