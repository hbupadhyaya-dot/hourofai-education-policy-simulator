import React, { useState, useEffect } from 'react'
import { TimeSeriesChart, SpiderChart } from './components/Charts'
import { policyDefinitions, outcomeMetrics, calculateCurrentMetrics, generateTimeSeriesData } from './lib/policyData'

function App() {
  const [selectedPolicies, setSelectedPolicies] = useState([])
  const [policyIntensities, setPolicyIntensities] = useState({})
  const [selectedTimeSeriesMetric, setSelectedTimeSeriesMetric] = useState('AI_LITERACY')
  const [activeTab, setActiveTab] = useState('main')
  const [currentMetrics, setCurrentMetrics] = useState({
    AI_LITERACY: 50,
    COMMUNITY_TRUST: 50,
    INNOVATION_INDEX: 50,
    TEACHER_SATISFACTION: 50,
    DIGITAL_EQUITY: 50,
    BUDGET_STRAIN: 50,
    EMPLOYMENT_IMPACT: 50,
    AI_VULNERABILITY_INDEX: 50
  })

  const tabs = [
    { id: 'main', name: 'Main Dashboard' },
    { id: 'feedback', name: 'System Feedback' },
    { id: 'insights', name: 'Strategic Insights' }
  ]

  // Helper functions re-enabled - these are now safe as they're outside render cycle
  // Helper function to determine health color (moved outside render to prevent re-creation)
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

  // Helper function for formatting metric names in popups
  const formatMetricName = (metric) => {
    return outcomeMetrics[metric]?.name || metric.replace(/_/g, ' ')
  }

  // Helper function for policy units
  const getPolicyUnits = (policyId) => {
    const policy = policyDefinitions[policyId]
    if (!policy) return ''
    
    switch (policy.category) {
      case 'funding':
        return policy.id === 'PD_FUNDS' ? '% of budget' : 
               policy.id === 'INNOV_INCENT' ? '% increase' :
               policy.id === 'TECH_INVEST' ? '% of budget' :
               policy.id === 'STATE_FED_PART' ? '% funding match' : '% increase'
      case 'governance':
        return policy.id === 'PROTECT_STD' ? 'strictness level' :
               policy.id === 'AI_ETHICS' ? 'oversight level' :
               policy.id === 'STAKEHOLDER_ENGAGE' ? 'engagement level' : 'implementation level'
      case 'capacity':
        return policy.id === 'TEACHER_PD' ? '% participation' :
               policy.id === 'LEADERSHIP_DEV' ? '% participation' : 'coverage level'
      default:
        return 'implementation level'
    }
  }

  // Helper function for policy subtitles
  const getSubtitle = (policyId, intensity) => {
    const policy = policyDefinitions[policyId]
    if (!policy) return ''
    
    const level = intensity < 33 ? 'Low' : intensity < 67 ? 'Medium' : 'High'
    
    switch (policy.category) {
      case 'funding':
        return policy.id === 'PD_FUNDS' ? `${level} professional development investment` :
               policy.id === 'INNOV_INCENT' ? `${level} innovation incentives` :
               policy.id === 'TECH_INVEST' ? `${level} technology investment` :
               policy.id === 'STATE_FED_PART' ? `${level} external funding leverage` : `${level} funding allocation`
      case 'governance':
        return policy.id === 'PROTECT_STD' ? `${level} student protection measures` :
               policy.id === 'AI_ETHICS' ? `${level} ethical oversight` :
               policy.id === 'STAKEHOLDER_ENGAGE' ? `${level} community involvement` : `${level} governance framework`
      case 'capacity':
        return policy.id === 'TEACHER_PD' ? `${level} teacher development` :
               policy.id === 'LEADERSHIP_DEV' ? `${level} leadership development` : `${level} capacity building`
      default:
        return `${level} implementation`
    }
  }

  // Helper function for resource links
  const renderResourceLinks = (resources) => {
    if (!resources || resources === "Information not available") {
      return <span className="text-gray-500 italic">No resources available</span>
    }
    
    const resourceList = resources.split(',').map(r => r.trim()).filter(r => r)
    
    return resourceList.map((resource, index) => {
      return (
        <span key={index}>
          {index > 0 && ' | '}
          <span className="text-blue-600 hover:text-blue-800 underline cursor-pointer">
            {resource.trim()}
          </span>
        </span>
      )
    })
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

  // Re-enabled with careful dependency management
  useEffect(() => {
    let newMetrics
    if (selectedPolicies.length === 0) {
      newMetrics = {
        AI_LITERACY: 50,
        COMMUNITY_TRUST: 50,
        INNOVATION_INDEX: 50,
        TEACHER_SATISFACTION: 50,
        DIGITAL_EQUITY: 50,
        BUDGET_STRAIN: 50,
        EMPLOYMENT_IMPACT: 50,
        AI_VULNERABILITY_INDEX: 50
      }
    } else {
      newMetrics = calculateCurrentMetrics(selectedPolicies, policyIntensities)
    }
    
    // Only update if there's an actual change
    setCurrentMetrics(prev => {
      const keys = Object.keys(newMetrics)
      const hasChanged = keys.some(key => prev[key] !== newMetrics[key])
      return hasChanged ? newMetrics : prev
    })
  }, [selectedPolicies, policyIntensities])

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
          </div>
        </div>
      </div>

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
                    <h3 className="text-sm font-medium mb-2 text-slate-600 flex items-center">
                      <div className="w-1.5 h-1.5 bg-slate-400 rounded-full mr-2"></div>
                      Time Series Analysis
                    </h3>
                    <div className="mb-1">
                      <label className="block text-xs font-medium text-slate-500 mb-1">
                        Select Metric:
                      </label>
                      <select
                        value={selectedTimeSeriesMetric}
                        onChange={(e) => setSelectedTimeSeriesMetric(e.target.value)}
                        className="w-full px-2 py-1 border border-slate-200 rounded text-xs focus:ring-1 focus:ring-slate-400 focus:border-slate-400 bg-white/90 backdrop-blur-sm"
                      >
                        <option value="AI_LITERACY">AI Literacy</option>
                        <option value="COMMUNITY_TRUST">Community Trust</option>
                        <option value="INNOVATION_INDEX">Innovation Index</option>
                        <option value="TEACHER_SATISFACTION">Teacher Satisfaction</option>
                        <option value="DIGITAL_EQUITY">Digital Equity</option>
                        <option value="BUDGET_STRAIN">Budget Strain</option>
                        <option value="EMPLOYMENT_IMPACT">Employment Impact</option>
                        <option value="AI_VULNERABILITY_INDEX">AI Vulnerability Index</option>
                      </select>
                    </div>
                    <div className="h-56 flex items-center justify-center">
                      <TimeSeriesChart 
                        metricId={selectedTimeSeriesMetric}
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
                    <h3 className="text-sm font-medium mb-2 text-slate-600 flex items-center">
                      <div className="w-1.5 h-1.5 bg-slate-400 rounded-full mr-2"></div>
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
                <div className="bg-white/95 backdrop-blur-sm rounded-lg border border-slate-100 shadow-sm p-3">
                  <div className="flex justify-between items-end gap-2">
                    {Object.entries(currentMetrics).map(([metric, value]) => {
                      const colors = getHealthColor(metric, Math.round(value));
                      const gradientId = `gradient-${metric}`;
                      
                      return (
                        <div key={metric} className="text-center p-2 bg-slate-50/50 rounded border-0 relative flex-1 flex flex-col items-center">
                          <div className="text-xs font-medium text-slate-600 leading-tight pr-3 mb-1 min-h-[1rem] flex items-center justify-center">
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
              <div className="h-[50%] overflow-y-auto">
                <div className="bg-white/95 backdrop-blur-sm rounded-lg border border-slate-100 shadow-sm p-4">
                  <div className="grid grid-cols-5 gap-4">
                    {/* Column 1 - District Administrator */}
                    <div className="space-y-3">
                      <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wide text-center pb-2 border-b border-blue-100">District Admin</h3>
                      {Object.values(policyDefinitions).filter(policy => 
                        ['INNOV_INCENT', 'PROTECT_STD', 'PD_FUNDS'].includes(policy.id)
                      ).map((policy) => (
                        <div key={policy.id} className="bg-white rounded-lg border border-slate-200 p-3 shadow-sm relative">
                          <div className="mb-3">
                            <div className="text-xs font-semibold text-slate-800 text-center leading-tight pr-6">{policy.name}</div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="relative">
                              <input
                                type="range"
                                min="0"
                                max="100"
                                value={policyIntensities[policy.id] || 50}
                                onChange={(e) => {
                                  const newValue = parseInt(e.target.value);
                                  setPolicyIntensities(prev => ({
                                    ...prev,
                                    [policy.id]: newValue
                                  }));
                                }}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider-blue"
                                style={
                                  policyIntensities[policy.id] !== undefined && policyIntensities[policy.id] !== 50 ? {
                                    background: policyIntensities[policy.id] > 50 
                                      ? `linear-gradient(to right, #e2e8f0 0%, #e2e8f0 50%, #2563eb 50%, #2563eb ${policyIntensities[policy.id]}%, #e2e8f0 ${policyIntensities[policy.id]}%, #e2e8f0 100%)`
                                      : `linear-gradient(to right, #e2e8f0 0%, #e2e8f0 ${policyIntensities[policy.id]}%, #2563eb ${policyIntensities[policy.id]}%, #2563eb 50%, #e2e8f0 50%, #e2e8f0 100%)`
                                  } : {
                                    background: '#e2e8f0'
                                  }
                                }
                              />
                              {/* Center indicator */}
                              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-0.5 h-4 bg-slate-400 pointer-events-none"></div>
                            </div>
                            <div className="relative">
                              <div className="flex justify-between text-xs text-slate-500">
                                <span>{policy.id === 'INNOV_INCENT' ? '$0M' : policy.id === 'PD_FUNDS' ? '0' : '0'}</span>
                                <span>{policy.id === 'INNOV_INCENT' ? '$50M' : policy.id === 'PD_FUNDS' ? '80' : '100'}</span>
                              </div>
                              <div 
                                className="absolute top-0 transform -translate-x-1/2"
                                style={{
                                  left: `${(policyIntensities[policy.id] || 50)}%`
                                }}
                              >
                                <span className="font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded text-xs whitespace-nowrap">
                                  {policy.id === 'INNOV_INCENT' ? `$${Math.round((policyIntensities[policy.id] || 50) * 0.5)}M` :
                                   policy.id === 'PROTECT_STD' ? `${policyIntensities[policy.id] || 50}` :
                                   policy.id === 'PD_FUNDS' ? `${Math.round((policyIntensities[policy.id] || 50) * 0.8)} hrs` :
                                   `${policyIntensities[policy.id] || 50}`}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Column 2 - Educational Institution Leader */}
                    <div className="space-y-3">
                      <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wide text-center pb-2 border-b border-green-100">Institution Leader</h3>
                      {Object.values(policyDefinitions).filter(policy => 
                        ['EDUC_AUTONOMY', 'AI_CAREER_PATH', 'DIGITAL_CITIZEN'].includes(policy.id)
                      ).map((policy) => (
                        <div key={policy.id} className="bg-white rounded-lg border border-slate-200 p-3 shadow-sm relative">
                          <div className="mb-3">
                            <div className="text-xs font-semibold text-slate-800 text-center leading-tight pr-6">{policy.name}</div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="relative">
                              <input
                                type="range"
                                min="0"
                                max="100"
                                value={policyIntensities[policy.id] || 50}
                                onChange={(e) => {
                                  const newValue = parseInt(e.target.value);
                                  setPolicyIntensities(prev => ({
                                    ...prev,
                                    [policy.id]: newValue
                                  }));
                                }}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider-green"
                                style={
                                  policyIntensities[policy.id] !== undefined && policyIntensities[policy.id] !== 50 ? {
                                    background: policyIntensities[policy.id] > 50 
                                      ? `linear-gradient(to right, #e2e8f0 0%, #e2e8f0 50%, #16a34a 50%, #16a34a ${policyIntensities[policy.id]}%, #e2e8f0 ${policyIntensities[policy.id]}%, #e2e8f0 100%)`
                                      : `linear-gradient(to right, #e2e8f0 0%, #e2e8f0 ${policyIntensities[policy.id]}%, #16a34a ${policyIntensities[policy.id]}%, #16a34a 50%, #e2e8f0 50%, #e2e8f0 100%)`
                                  } : {
                                    background: '#e2e8f0'
                                  }
                                }
                              />
                              {/* Center indicator */}
                              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-0.5 h-4 bg-slate-400 pointer-events-none"></div>
                            </div>
                            <div className="relative">
                              <div className="flex justify-between text-xs text-slate-500">
                                <span>{policy.id === 'EDUC_AUTONOMY' ? '0%' : policy.id === 'AI_CAREER_PATH' ? '0' : '0%'}</span>
                                <span>{policy.id === 'EDUC_AUTONOMY' ? '100%' : policy.id === 'AI_CAREER_PATH' ? '10' : '50%'}</span>
                              </div>
                              <div 
                                className="absolute top-0 transform -translate-x-1/2"
                                style={{
                                  left: `${(policyIntensities[policy.id] || 50)}%`
                                }}
                              >
                                <span className="font-bold text-green-600 bg-green-50 px-2 py-1 rounded text-xs whitespace-nowrap">
                                  {policy.id === 'EDUC_AUTONOMY' ? `${policyIntensities[policy.id] || 50}%` :
                                   policy.id === 'AI_CAREER_PATH' ? `${Math.round((policyIntensities[policy.id] || 50) * 0.1)} hrs/wk` :
                                   policy.id === 'DIGITAL_CITIZEN' ? `${Math.round((policyIntensities[policy.id] || 50) * 0.5)}%` :
                                   `${policyIntensities[policy.id] || 50}`}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Column 3 - Community Representative */}
                    <div className="space-y-3">
                      <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wide text-center pb-2 border-b border-purple-100">Community Rep</h3>
                      {Object.values(policyDefinitions).filter(policy => 
                        ['COMM_INPUT', 'IMPACT_REP_STD', 'LOCAL_JOB_ALIGN'].includes(policy.id)
                      ).map((policy) => (
                        <div key={policy.id} className="bg-white rounded-lg border border-slate-200 p-3 shadow-sm">
                          <div className="mb-3">
                            <div className="text-xs font-semibold text-slate-800 text-center leading-tight">{policy.name}</div>
                            <div className="text-xs text-slate-500 text-center mt-1">{getSubtitle(policy.id, policyIntensities[policy.id] || 50)}</div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center justify-between mb-1">
                              <label className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  checked={selectedPolicies.includes(policy.id)}
                                  onChange={() => handlePolicyToggle(policy.id)}
                                  className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                                />
                                <span className="text-xs text-slate-600">Enable</span>
                              </label>
                              <span className="text-xs font-bold text-purple-600">
                                {policyIntensities[policy.id] || 50} {getPolicyUnits(policy.id)}
                              </span>
                            </div>
                            
                            {selectedPolicies.includes(policy.id) && (
                              <div className="space-y-1">
                                <input
                                  type="range"
                                  min="0"
                                  max="100"
                                  value={policyIntensities[policy.id] || 50}
                                  onChange={(e) => {
                                    const newValue = parseInt(e.target.value);
                                    setPolicyIntensities(prev => ({
                                      ...prev,
                                      [policy.id]: newValue
                                    }));
                                  }}
                                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                                />
                                <div className="flex justify-between text-xs text-slate-500">
                                  <span>Low</span>
                                  <span>High</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Column 4 - EdTech Industry Representative */}
                    <div className="space-y-3">
                      <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wide text-center pb-2 border-b border-orange-100">EdTech Industry</h3>
                      {Object.values(policyDefinitions).filter(policy => 
                        ['INTEROP_STD', 'INFRA_INVEST', 'ACCESS_STD'].includes(policy.id)
                      ).map((policy) => (
                        <div key={policy.id} className="bg-white rounded-lg border border-slate-200 p-3 shadow-sm">
                          <div className="mb-3">
                            <div className="text-xs font-semibold text-slate-800 text-center leading-tight">{policy.name}</div>
                            <div className="text-xs text-slate-500 text-center mt-1">{getSubtitle(policy.id, policyIntensities[policy.id] || 50)}</div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center justify-between mb-1">
                              <label className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  checked={selectedPolicies.includes(policy.id)}
                                  onChange={() => handlePolicyToggle(policy.id)}
                                  className="rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                                />
                                <span className="text-xs text-slate-600">Enable</span>
                              </label>
                              <span className="text-xs font-bold text-orange-600">
                                {policyIntensities[policy.id] || 50} {getPolicyUnits(policy.id)}
                              </span>
                            </div>
                            
                            {selectedPolicies.includes(policy.id) && (
                              <div className="space-y-1">
                                <input
                                  type="range"
                                  min="0"
                                  max="100"
                                  value={policyIntensities[policy.id] || 50}
                                  onChange={(e) => {
                                    const newValue = parseInt(e.target.value);
                                    setPolicyIntensities(prev => ({
                                      ...prev,
                                      [policy.id]: newValue
                                    }));
                                  }}
                                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                                />
                                <div className="flex justify-between text-xs text-slate-500">
                                  <span>Low</span>
                                  <span>High</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Column 5 - Research & Ethics Advisor */}
                    <div className="space-y-3">
                      <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wide text-center pb-2 border-b border-red-100">Research & Ethics</h3>
                      {Object.values(policyDefinitions).filter(policy => 
                        ['STATE_FED_PART', 'INNOV_SANDBOX', 'MODEL_EVAL_STD'].includes(policy.id)
                      ).map((policy) => (
                        <div key={policy.id} className="bg-white rounded-lg border border-slate-200 p-3 shadow-sm">
                          <div className="mb-3">
                            <div className="text-xs font-semibold text-slate-800 text-center leading-tight">{policy.name}</div>
                            <div className="text-xs text-slate-500 text-center mt-1">{getSubtitle(policy.id, policyIntensities[policy.id] || 50)}</div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center justify-between mb-1">
                              <label className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  checked={selectedPolicies.includes(policy.id)}
                                  onChange={() => handlePolicyToggle(policy.id)}
                                  className="rounded border-slate-300 text-red-600 focus:ring-red-500"
                                />
                                <span className="text-xs text-slate-600">Enable</span>
                              </label>
                              <span className="text-xs font-bold text-red-600">
                                {policyIntensities[policy.id] || 50} {getPolicyUnits(policy.id)}
                              </span>
                            </div>
                            
                            {selectedPolicies.includes(policy.id) && (
                              <div className="space-y-1">
                                <input
                                  type="range"
                                  min="0"
                                  max="100"
                                  value={policyIntensities[policy.id] || 50}
                                  onChange={(e) => {
                                    const newValue = parseInt(e.target.value);
                                    setPolicyIntensities(prev => ({
                                      ...prev,
                                      [policy.id]: newValue
                                    }));
                                  }}
                                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                                />
                                <div className="flex justify-between text-xs text-slate-500">
                                  <span>Low</span>
                                  <span>High</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'feedback' && (
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">System Feedback Loops</h2>
              <p className="text-gray-600">System feedback analysis coming soon...</p>
            </div>
          )}

          {activeTab === 'insights' && (
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Strategic Insights</h2>
              <p className="text-gray-600">Strategic insights coming soon...</p>
            </div>
          )}
        </div>
      </div>

      {/* Popups temporarily disabled */}
    </div>
  )
}

export default App