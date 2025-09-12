# Debug Analysis from Console Output

## Key Finding: Policy ID Mismatch
The console shows the real issue:

**Console Output:**
```
Selected policies: {INNOV_INCENT: true}
Policy intensities: {INNOV_INCENT: 50}
```

**But our mapping expects:**
```javascript
'innovation_incentives': 'innov_incent'
```

## The Problem
The App component is using policy IDs like `INNOV_INCENT` but our mapping function expects `innovation_incentives`.

## Root Cause
There's a mismatch between:
1. **What the App stores**: `INNOV_INCENT` 
2. **What our function expects**: `innovation_incentives`
3. **What the coefficients use**: `innov_incent`

## Solution
We need to update the policy key mapping to use the actual policy IDs that the App component is using, not the display names.

## Correct Mapping Needed
```javascript
const policyKeyMap = {
  'INNOV_INCENT': 'innov_incent',
  'PD_FUNDS': 'pd_funds',
  'SANDBOXES': 'sandboxes',
  // etc.
};
```

This explains why all metrics show 0.0 change - the policy lookup is failing because the keys don't match.

