module.exports = {
	viewAll: function(req, res){
		Users.find()
		.exec(function(errSql, resSql){
			if (errSql){
				res.json(sails.config.database_error.http_status, sails.config.database_error.error);
			}

			res.json(200, {
				success: 'ok',
        results: resSql
			})
		})
	},

  viewSpecific: function(req, res){
    var params = {};
    var reg = new RegExp('/^[0-9]+$/');

    if (req.query.key === 'msisdn'){
      var value = '+' + req.query.value;
    } else {
      var value = req.query.value;
    }
    params[req.query.key] = value;

    Users.find()
    .where(params)
    .exec(function(errSql, resSql){
      if (errSql){
        res.json(sails.config.database_error.http_status, sails.config.database_error.error);
      }

      res.json(200, {
        success: 'ok',
        results: resSql
      })
    })
  }
}