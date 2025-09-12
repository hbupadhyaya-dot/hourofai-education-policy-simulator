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
            <button className="px-6 py-3 text-sm font-semibold rounded-t-xl bg-gradient-to-b from-blue-600 to-indigo-700 text-white shadow-xl">
              Main Dashboard (Debug Mode)
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-3 h-[calc(100vh-120px)]">
        <div className="flex-1 overflow-hidden">
          {activeTab === 'main' && (
            <div className="h-full p-6">
              <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
                <h2 className="text-xl font-semibold text-slate-800 mb-4">🎉 Debugging Progress</h2>
                <div className="space-y-2">
                  <p className="text-green-600">✅ Basic React structure: Working</p>
                  <p className="text-green-600">✅ Helper functions: Re-enabled</p>
                  <p className="text-green-600">✅ useEffect: Re-enabled</p>
                  <p className="text-green-600">✅ Outcome metrics: Re-enabled</p>
                  <p className="text-blue-600">🔄 Page reloading: <strong>STOPPED</strong></p>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-medium text-slate-700 mb-3">Current Metrics (Live Data)</h3>
                <div className="grid grid-cols-4 gap-4">
                  {Object.entries(currentMetrics).map(([metric, value]) => (
                    <div key={metric} className="bg-slate-50 rounded p-3 text-center">
                      <div className="text-sm text-slate-600 mb-1">{metric.replace(/_/g, ' ')}</div>
                      <div className="text-lg font-bold text-slate-800">{Math.round(value)}</div>
                    </div>
                  ))}
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