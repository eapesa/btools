/**
 * Users
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {
  schema: true,
  migrate: 'safe',
  adapter: 'mysql',
  attributes: {

  	username: 'string',
  	password: 'string',
    msisdn: 'string',
    device_id: 'string',
    os: 'string',
    last_offline_xml_ts: 'string',
    created_at: 'string',
    status: 'string'
    
  }

};
