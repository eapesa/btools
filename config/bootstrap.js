/**
 * Bootstrap
 *
 * An asynchronous boostrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#documentation
 */

module.exports.bootstrap = function (cb) {
  
  global.Errors = sails.config.errors;
  
  var redis = require('redis');
  global.Redis = sails.config.redis;
  
  function redis_log(type) {
      return function () {
        if (type === 'ready')
          sails.log("Redis connection up.");
        else
          sails.log("Redis connection lost. Attempting to reconnect");
      }
    }
  
  if (!global.RedisUser) global.RedisUser = redis.createClient(Redis.port, Redis.host);
  RedisUser.on('ready', redis_log('ready'));
  RedisUser.on('reconnecting', redis_log('reconnecting'));
  RedisUser.on('error', redis_log('error'));
  RedisUser.on('end', redis_log('end'));
  
  // It's very important to trigger this callback method when you are finished 
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
  cb();
  
};