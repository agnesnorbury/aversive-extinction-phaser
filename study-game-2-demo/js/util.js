//helper function for parsing per trial data
export function saveTrialData(payload = {}) {
  // Read through input as key/value pairs flat
  Object.getOwnPropertyNames(payload).forEach((key) => {
    const value = payload[key];
    // Add to current trial
    window.psychoJS.experiment.addData(key, value);
  });
  // Add to experiment ahead of next trial
  window.psychoJS.experiment.nextEntry();
}
