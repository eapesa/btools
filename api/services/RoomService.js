var xmpp = require('node-xmpp');

module.exports = {
  addRoom : function (req, res) {
    var conn = XMPPService.connections['admin'];
    var roomPresence = new xmpp.Element('presence', {
      to: req.body.room_jid + '@muc.' + sails.config.domain + '/admin'
    }).c('x', {
      xmlns: 'http://jabber.org/protocol/muc'
    });
    
    var roomIq = new xmpp.Element('iq', {
      to: req.body.room_jid + '@muc.' + sails.config.domain,
      type: 'set'
    }).c('query', {
      xmlns: 'http://jabber.org/protocol/muc#owner'
    }).c('x', {
      xmlns: 'jabber:x:data',
      type: 'submit'
    });
    
    roomIq.c('field', {
      'var': 'muc#roomconfig_roomname'
    }).c('value')
      .t(req.body.room_jid);
      
    roomIq.c('field', {
      'var': 'muc#roomconfig_roomdesc'
    }).c('value')
      .t(req.body.room_desc);

    conn.send(roomPresence);
    conn.send(roomIq);
  },
  
  deleteRoom : function (req, res) {
    var conn = XMPPService.connections['admin'];
    var roomPresence = new xmpp.Element('presence', {
      type: 'available'
    }).c('show')
      .t('chat');
      
    var roomIq = new xmpp.Element('iq', {
      to: req.params.room_jid + '@muc.' + sails.config.domain,
      type: 'set'
    }).c('iq', {
      xmlns: 'http://jabber.org/protocol/muc#owner'
    }).c('destroy');
    
    conn.send(roomPresence);
    conn.send(roomIq);
  }
}