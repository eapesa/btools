var xmpp = require('node-xmpp');
module.exports = {
  // Thanks Erica and Rhiza for this efficient implementation
  
  connections: {},
  
  connect: function(conn, req, res, callback) {
    conn.on('online', function(data) {
      if(data){
        conn.send(new xmpp.Element('presence', { type: 'available' }).c('show').t('chat')); 
        sails.log.info(data.jid.user + ' is now connected');
        callback();
      }
    });
    
    conn.on('disconnect', function(data) {
      sails.log('User is now disconnected.');
      callback();
    });
    
    conn.on('error', function(err) {
      if (err) {
        sails.log.error('XMPP Service Error: ' + err);
      }
    });
    
    conn.on('stanza', function(stanza) {
      //sails.log(stanza);
      switch(stanza.name) {
      case 'presence' :
        sails.log('PRESENCE Stanza from ' + stanza.attrs.from + ' :: ' + stanza.children);
        sails.log('==========');
        break;
      case 'message' :
        sails.log('MESSAGE Stanza from ' + stanza.attrs.from + ' :: ' + stanza.children);
        sails.log('==========');
        break;
      case 'iq' :
        sails.log('IQ Stanza from ' + stanza.attrs.from + ' :: ' + stanza.children);
        sails.log('==========');
        var roomType = stanza.attrs.from.split('.')[0];
        if ((roomType === 'muc') && (stanza.attr.name === 'query')) {
          sails.log('Should list down all rooms');
          getRooms(stanza, res);
        }
        break;
      default:
        sails.log('Unknown stanza.');
        break;
      }
    });
  }

};

getRooms = function(stanza, res) {
  var query = stanza.getChildren('query')[0];
  var rooms = [];
  
  sails.log(query);
  query.children.forEach(function(item) {
    rooms.push(item.attrs.jid);
  })
  
  res.json(200, {
    success: 'ok',
    rooms: rooms
  })

}