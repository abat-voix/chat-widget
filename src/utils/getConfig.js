export function getConfig(configVariable, defaultVal) {
  return process.env[configVariable] || defaultVal || ''
}

export function getQueriesStaleTimeMinutes() {
  return 1000 * 60 * getConfig('REACT_APP_QUERIES_STALE_TIME_MINUTES', 5)
}
