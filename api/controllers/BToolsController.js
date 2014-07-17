/**
 * BToolsController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

var async = require('async');
var xmpp = require('node-xmpp');
var xmlrpc = require('xmlrpc');
var connections = {};

module.exports = {
  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to BToolsController)
   */
  _config: {},

  BanUser: function(req, res) {
    // To ban user, store it in redis (this will be checked by ejabberd)
    async.auto({
      storeInRedis: function (callback) {
        RedisUser.select(Redis.db, function (error1, response) {
          if (error1) {
            sails.log.error('[BANUSER - Redis 1] Error: ' + error1);
            return callback(Errors.system_error);
          }
      
          RedisUser.setex(req.body.username, sails.config.redis_ttl, '', function (error2, response2) {
            if (error1) {
              sails.log.error('[BANUSER - Redis 2] Error: ' + error2);
              return callback(Errors.system_error);
            } else {
              callback(null, true);
            }
          });
        });
      },
      
      disconnectUser: function (callback) {
        var xmlrpc_client = xmlrpc.createClient(sails.config.xmlrpc.client);
        xmlrpc_client.methodCall('banuser', [sails.config.xmlrpc.admin, {
          user: req.body.username,
          server: 'localhost'
        }], function (error, value) {
          if (error) {
            sails.log.error('[BANUSER - XMLRPC] Error: ' + error);
            return callback(Errors.system_error);
          } else {
            callback(null, true);
          }
        });
      }
    }, function (error, result) {
      sails.log(error);
      if (error) {
        res.json(error.status_code, { error: error.error });
      } else {
        res.json(200, {
          success: 'ok',
          msg: req.body.username + ' is now banned.'
        })
      }
    });
  },
  
  UnbanUser: function(req, res) {
    // Get all banned user in Redis
    RedisUser.select(Redis.db, function (error1, response) {
      if (error1) {
        sails.log.error('[UNBANUSER - Redis 1] Error: ' + error1);
        res.json(Errors.system_error.status_code, { error: Errors.system_error.error });
      }
      
      RedisUser.del(req.params.username, function (error2, response2) {
        if (error2) {
          sails.log.error('[UNBANUSER - Redis 2] Error: ' + error2);
          res.json(Errors.system_error.status_code, { error: Errors.system_error.error });
        } else {
          res.json(200, {
            success: 'ok',
            msg: req.body.username + ' is no longer banned.'
          })
        }
      });
    });
  },
  
  ListBannedUsers: function(req, res) {
    // Get all banned user in Redis
    RedisUser.select(Redis.db, function (error1, response) {
      if (error1) {
        sails.log.error('[LISTBANNEDUSERS - Redis 1] Error: ' + error);
        res.json(Errors.system_error.status_code, { error: Errors.system_error.error });
      }
      
      RedisUser.keys('*', function (error2, response2) {
        if (error2) {
          sails.log.error('[LISTBANNEDUSERS - Redis 2] Error: ' + error2);
          res.json(Errors.system_error.status_code, { error: Errors.system_error.error });
        } else {
          res.json(200, {
            success: 'ok',
            banned_users: response2
          })
        }
      });
    });
  },
  
  ConnectMuc: function(req, res) {
    var conn = new xmpp.Client(sails.config.xmpp);
    
    XMPPService.connect(conn, req, res, function(err) {
      if (err) {
        sails.log.error('Invalid login attempt');
        res.forbidden('Error authenticating');
      } else {
        XMPPService.connections['admin'] = conn;
        res.json(200, {success: 'ok'});
      }
    });
  },
  
  GetMucRooms: function(req, res) {
    var iqRooms = new xmpp.Element('iq', {
      to: 'muc.' + sails.config.domain,
      type: 'get'
    })
    .c('query', {
      xmlns: 'http://jabber.org/protocol/disco#items'
    })
    
    var conn = XMPPService.connections['admin'];
    conn.send(iqRooms);
    
    res.json(200, {
      success: 'ok'
    })
  },
  
  AddMucRooms: function(req, res) {
    RoomService.addRoom(req, res);
    res.json(200, {success: 'ok'});
  },
  
  DeleteMucRoom: function(req, res) {
    RoomService.deleteRoom(req, res);
    res.json(200, {success: 'ok'});
  }

};
