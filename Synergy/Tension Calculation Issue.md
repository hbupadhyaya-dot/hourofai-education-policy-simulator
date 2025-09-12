# Synergy/Tension Calculation Issue

## Root Cause Identified
The synergy and tension calculation logic is trying to access `.effects` property on the synergy/tension values, but these are just numbers, not objects with effects!

## The Problem
In `calculateCurrentMetricsWithScenario`:
```javascript
const synergy = checkPolicySynergy(policy1, policy2);
if (synergy) {
  const synergyEffect = synergy.effects[metric.id] || 0;  // ❌ ERROR!
  // ...
}
```

But `synergies` object contains just numbers:
```javascript
export const synergies = {
  "pd_sandbox": 1.2,          // Just a number, not an object!
  "pd_path": 1.2,
  // ...
};
```

## What's Happening
1. `checkPolicySynergy()` returns a number (e.g., 1.2)
2. Code tries to access `1.2.effects[metric.id]` 
3. This returns `undefined` (no error thrown)
4. But the nested loops with multiple policies create performance issues
5. The double nested loop (`activePolicies.forEach(policy1 => activePolicies.forEach(policy2 =>`)`) runs for every metric
6. With 2 policies and 8 metrics, this creates 2×2×8 = 32 iterations per calculation
7. This likely causes performance issues or infinite re-renders

## The Fix
Either:
1. **Remove synergy/tension calculations** (simplest fix)
2. **Fix the synergy/tension structure** to have proper effects per metric
3. **Optimize the calculation** to avoid nested loops

## Immediate Solution
Temporarily disable the synergy/tension calculations to fix the crash, then optimize later.

