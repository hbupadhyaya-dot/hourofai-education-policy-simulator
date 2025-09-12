# Personalized Impact Analysis System Design

## Overview
Create a "Why These Impacts" button that generates personalized insights based on the user's specific policy lever selections and their resulting outcome metrics.

## Content Structure

### Header
"Why Your Policy Choices Create These Outcomes"

### Paragraph 1: Direct Impact Summary (2-3 sentences)
- Identify the 2-3 most influential policy levers in their configuration
- Explain the primary mechanisms driving their results
- Connect their highest investments to the strongest outcome improvements

### Paragraph 2: Synergy & Tension Analysis (2-3 sentences)
- Highlight the most significant policy combinations (positive or negative)
- Explain one key feedback loop that's particularly active in their scenario
- Address any notable conflicts or reinforcing effects

### Paragraph 3: Timeline & Strategic Insight (2-3 sentences)
- Explain why certain metrics are responding faster/slower than others
- Identify potential future challenges or opportunities based on their choices
- Offer one strategic insight about their policy balance

## Analysis Logic

### 1. Policy Influence Ranking
- Calculate impact magnitude for each selected policy across all metrics
- Rank policies by total impact strength
- Identify top 2-3 most influential policies

### 2. Synergy Detection
- Use existing synergy/tension detection functions
- Identify active feedback loops from the feedback loops system
- Determine strongest policy combinations

### 3. Timeline Analysis
- Analyze which metrics show fastest/slowest response based on curve patterns
- Consider policy stakeholder types for implementation speed
- Identify potential future inflection points

### 4. Strategic Insights
- Analyze policy balance across stakeholder groups
- Identify gaps or over-concentration in policy selection
- Suggest strategic considerations based on current configuration

## Implementation Requirements

### Functions Needed
1. `analyzeDirectImpacts(selectedPolicies, policyIntensities, currentMetrics)`
2. `analyzeSynergiesAndTensions(selectedPolicies, policyIntensities)`
3. `analyzeTimeline(selectedPolicies, policyIntensities)`
4. `generatePersonalizedInsights(selectedPolicies, policyIntensities, scenarioId)`

### UI Components
1. "Why These Impacts" button next to outcome metrics
2. Modal/popup to display the analysis
3. Responsive design for mobile and desktop
4. Professional styling consistent with simulator design

### Data Sources
- Current policy selections and intensities
- Outcome metric calculations
- Existing synergy/tension detection
- Policy definitions and stakeholder mappings
- Feedback loop definitions

