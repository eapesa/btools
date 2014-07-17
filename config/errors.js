module.exports.errors = {
  system_error: {
    status_code: 503,
    error: {
      code: -1,
      msg: 'System error'
    }
  },

  database_error: {
    status_code: 503,
    error: {
      code: -1,
      msg: 'Database error'
    }
  },
}