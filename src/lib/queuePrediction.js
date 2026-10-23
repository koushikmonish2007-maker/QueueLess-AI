/**
 * @file queuePrediction.js
 * QueueLess AI — Team GEN4X (INTELLATHON 2K26)
 * Phase 2 Transparent Queueing-Based Prediction Engine
 * 
 * MODEL DISCLOSURE & TRANSPARENCY:
 * This prediction engine utilizes classical operations research queuing theory 
 * (multi-server Little's Law heuristics and variance distributions). It is a transparent 
 * deterministic calculation engine, NOT a trained machine-learning model.
 */

/**
 * Calculates deterministic estimated wait duration based on active counters.
 * Formula: Wait = (People Ahead * Average Service Duration) / Max(1, Active Counters)
 * 
 * @param {number} peopleAhead - Waiting citizens preceding this ticket
 * @param {number} averageServiceMinutes - Historical average service duration
 * @param {number} [activeCounters=1] - Number of currently active/busy serving counters
 * @returns {number} Estimated wait time in minutes (minimum 0)
 */
export function calculateEstimatedWaitTime(peopleAhead, averageServiceMinutes, activeCounters = 1) {
  if (typeof peopleAhead !== 'number' || peopleAhead < 0) return 0;
  if (typeof averageServiceMinutes !== 'number' || averageServiceMinutes <= 0) return 0;

  const validCounters = Math.max(1, activeCounters);
  const rawWait = (peopleAhead * averageServiceMinutes) / validCounters;

  return Math.max(0, Math.round(rawWait));
}

/**
 * Generates an estimated waiting-time range accounting for standard consultation/service deviations.
 * 
 * @param {number} peopleAhead
 * @param {number} averageServiceMinutes
 * @param {number} [activeCounters=1]
 * @returns {{
 *  expectedMinutes: number,
 *  minMinutes: number,
 *  maxMinutes: number,
 *  formattedRange: string,
 *  modelType: string
 * }}
 */
export function calculateWaitTimeRange(peopleAhead, averageServiceMinutes, activeCounters = 1) {
  const expected = calculateEstimatedWaitTime(peopleAhead, averageServiceMinutes, activeCounters);

  if (expected === 0) {
    return {
      expectedMinutes: 0,
      minMinutes: 0,
      maxMinutes: 5,
      formattedRange: '0 - 5 mins (Immediate Call)',
      modelType: 'Queueing Heuristic (Little\'s Law approximation)'
    };
  }

  // Statistical variance bounds: -20% fast flow, +30% complex case delay
  const minMinutes = Math.max(1, Math.round(expected * 0.8));
  const maxMinutes = Math.max(minMinutes + 2, Math.round(expected * 1.3));

  const formattedRange = minMinutes === maxMinutes
    ? `${minMinutes} mins`
    : `${minMinutes} - ${maxMinutes} mins`;

  return {
    expectedMinutes: expected,
    minMinutes,
    maxMinutes,
    formattedRange,
    modelType: 'Queueing Heuristic (Little\'s Law approximation)'
  };
}

/**
 * Calculates smart departure time based on dynamic travel time and safety buffer.
 * Formula: Departure Time = Projected Turn Time - (Travel Time + Safety Buffer)
 * 
 * @param {number} estimatedWaitMinutes - Remaining wait time
 * @param {number} [travelTimeMinutes=15] - User transit time to facility
 * @param {number} [bufferMinutes=10] - Safety margin for parking/check-in
 * @returns {{
 *  departureDate: Date,
 *  formattedTime: string,
 *  urgency: 'stay_put' | 'leave_soon' | 'leave_now',
 *  minutesUntilDeparture: number,
 *  alertMessage: string
 * }}
 */
export function calculateDynamicDeparture(estimatedWaitMinutes, travelTimeMinutes = 15, bufferMinutes = 10) {
  const now = new Date();
  const projectedTurnTime = new Date(now.getTime() + estimatedWaitMinutes * 60 * 1000);

  const totalOffsetMinutes = (Number(travelTimeMinutes) || 0) + (Number(bufferMinutes) || 0);
  const departureDate = new Date(projectedTurnTime.getTime() - totalOffsetMinutes * 60 * 1000);

  const msUntilDeparture = departureDate.getTime() - now.getTime();
  const minutesUntilDeparture = Math.round(msUntilDeparture / (60 * 1000));

  let urgency = 'stay_put';
  let alertMessage = `You have time. Leave in approximately ${Math.max(0, minutesUntilDeparture)} minutes.`;

  if (minutesUntilDeparture <= 3) {
    urgency = 'leave_now';
    alertMessage = 'Leave now! Your turn is approaching and your travel buffer is expiring.';
  } else if (minutesUntilDeparture <= 15) {
    urgency = 'leave_soon';
    alertMessage = `Prepare to leave within ${minutesUntilDeparture} minutes to maintain your arrival buffer.`;
  }

  return {
    departureDate,
    formattedTime: departureDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    urgency,
    minutesUntilDeparture: Math.max(0, minutesUntilDeparture),
    alertMessage
  };
}

/**
 * Computes queue congestion severity.
 */
export function getQueueCongestionLevel(queueLength, activeCounters = 1) {
  const safeCounters = Math.max(1, activeCounters);
  const ratio = queueLength / safeCounters;

  if (ratio <= 2) {
    return { level: 'low', label: 'Brisk Flow', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' };
  }
  if (ratio <= 5) {
    return { level: 'moderate', label: 'Moderate Traffic', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' };
  }
  if (ratio <= 10) {
    return { level: 'high', label: 'Busy Queue', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' };
  }
  return { level: 'critical', label: 'Peak Congestion', color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' };
}

/**
 * Formats wait duration into clean human-readable text.
 */
export function formatWaitDuration(minutes) {
  if (typeof minutes !== 'number' || isNaN(minutes) || minutes <= 0) {
    return 'Immediate';
  }
  if (minutes < 60) {
    return `${minutes} min${minutes === 1 ? '' : 's'}`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (remainingMinutes === 0) {
    return `${hours} hr${hours === 1 ? '' : 's'}`;
  }
  return `${hours} hr ${remainingMinutes} min${remainingMinutes === 1 ? '' : 's'}`;
}
