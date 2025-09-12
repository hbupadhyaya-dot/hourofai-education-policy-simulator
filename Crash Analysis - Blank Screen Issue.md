# Crash Analysis - Blank Screen Issue

## Crash Pattern Confirmed
✅ **Reproducible**: Screen goes blank consistently when selecting the second policy
✅ **No JavaScript errors**: Console shows no explicit error messages
✅ **Silent failure**: React app crashes without throwing visible errors

## Key Observations
1. **First policy works fine**: Innovation Incentives loads correctly with metrics updating
2. **Second policy triggers crash**: Student Protection selection causes immediate blank screen
3. **No console errors**: No JavaScript errors visible in console output
4. **React crash**: Likely a React rendering error or infinite loop

## Likely Root Causes

### 1. Infinite Re-rendering Loop
The synergy/tension calculation logic might be causing infinite re-renders when multiple policies are selected:
- Each policy selection triggers metric recalculation
- Synergy calculations between policies might trigger additional state updates
- This could create an infinite loop that crashes React

### 2. Synergy/Tension Calculation Issues
The complex synergy and tension logic added for multiple policies might have:
- Circular dependencies in calculations
- Infinite loops in the policy interaction detection
- Memory leaks from complex nested calculations

### 3. State Management Problems
React state updates might be conflicting:
- Multiple simultaneous state updates
- State updates triggering more state updates
- useEffect dependencies causing infinite loops

### 4. Performance Issues
Complex calculations with multiple policies might be:
- Consuming too much memory
- Taking too long to compute
- Blocking the main thread

## Most Likely Culprit
**Synergy/Tension Calculation Logic** - This was recently added and involves complex nested loops checking all policy combinations. When 2+ policies are selected, this logic runs and likely creates an infinite loop or performance bottleneck.

## Next Steps
1. Examine the synergy/tension calculation functions
2. Look for infinite loops in the policy interaction logic
3. Add error boundaries to catch React crashes
4. Optimize or temporarily disable synergy calculations
5. Add performance monitoring and debugging

