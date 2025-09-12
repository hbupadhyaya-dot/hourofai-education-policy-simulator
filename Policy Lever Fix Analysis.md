# Policy Lever Fix Analysis

## Root Cause Identified
The issue is in the `calculateCurrentMetricsWithScenario` function. The coefficient lookup is incorrect:

**Current (Broken) Code:**
```javascript
const coefficient = coefficients[policyId]?.[metric.id] || 0;
```

**Problem:** 
- `policyId` is something like "innovation_incentives" 
- `metric.id` is something like "aiLiteracy"
- But coefficients are structured as: `"innov_incent_to_lit": 4.0`

The function is looking for `coefficients["innovation_incentives"]["aiLiteracy"]` but the actual structure is `coefficients["innov_incent_to_lit"]`.

## Correct Structure
The coefficients use this pattern:
- Policy key: `innov_incent`, `pd_funds`, `sandboxes`, etc.
- Metric key: `lit`, `trust`, `innov`, `teach_sat`, etc.
- Combined: `"innov_incent_to_lit": 4.0`

## Fix Required
1. Map policy IDs to their coefficient keys (e.g., "innovation_incentives" → "innov_incent")
2. Map metric IDs to their coefficient keys (e.g., "aiLiteracy" → "lit")
3. Build the correct coefficient key: `${policyKey}_to_${metricKey}`

## Policy ID Mappings Needed
- "innovation_incentives" → "innov_incent"
- "professional_development" → "pd_funds"
- "innovation_sandbox" → "sandboxes"
- "student_protection" → "protect_std"
- etc.

## Metric ID Mappings Needed
- "aiLiteracy" → "lit"
- "communityTrust" → "trust"
- "innovationIndex" → "innov"
- "teacherSatisfaction" → "teach_sat"
- etc.

