var tb = require('timebucket')

module.exports = function container (get, set, clear) {
  var get_timestamp = get('utils.get_timestamp')
  var get_duration = get('utils.get_duration')
  return function save_state (cb) {
    var run_state = get('run_state')
    if (!run_state) return cb()
    run_state.time = new Date().getTime()
    run_state.end_us = tb('µs').value
    run_state.last_us = run_state.end_us - run_state.start_us
    run_state.last_duration = get_duration(run_state.last_us)
    run_state.total_us += run_state.last_us
    run_state.total_duration = get_duration(run_state.total_us)
    get('motley:db.run_states').save(run_state, function (err, saved) {
      if (err) throw err
      get('logger').info('[launcher]'.green + ' saved run_state, id = '.grey + run_state.id.cyan + ', last_duration = '.grey + run_state.last_duration.yellow)
      cb && cb()
    })
  }
}