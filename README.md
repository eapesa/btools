# Babble Admin Tools
### a Sails application

Admin Tools as of now can do the following:<br>

* Viewing Database Content (users table only)

* Banning
  - Ban users that do malicious stuff (banned users will be unbanned once the set ttl expires)
  - Unban user in case user is banned accidentally or what other reason acceptable
  - List all banned users for keep tracking

* MUC Room Management
  - Get the list of MUC rooms available
  - Add new a room/Edit an existing
  - Delete a room

As of the moment, these tools are available only as APIs. But a UI for ease of use will be developed soon. :P

### APIs
##### Banning of Users

##### DB Viewing
| Resource | Method | Parameters | Description |
| --- | --- | --- | --- |
| /developer/db/all | `GET` | none | Get all contents of USERS table |
| /developer/db/search?key=**key**&value=**value** | `GET` | none | Get all contents of USERS table satisfying the query parameters **key** and **value** |


| Resource | Method | Parameters | Description |
| --- | --- | --- | --- |
| /v1/babbletools/ban | `POST` | username | For banning of users |
| /v1/babbletools/unban/:username | `DELETE` | username | For unbanning of users |
| /v1/babbletools/bannedusers | `GET` | none | Get all banned users |

##### MUC Room Management
| Resource | Method | Parameters | Description |
| --- | --- | --- | --- |
| /v1/babbletools/muc/connect | `GET` | none | For connection initialization |
| /v1/babbletools/muc/rooms | `GET` | none | Get all rooms |
| /v1/babbletools/muc/add | `POST` | room_jid, room_name, room_desc | Add new room / Edit existing room |
| /v1/babbletools/muc/delete/:room_jid | `DELETE` | room_jid | Delete a room |

### HowTos and Samples

##### DB Viewing

<b>Sample Requests and Responses</b>

Request:

```
GET Host:Port/developer/db/all
```

Response:

```
{
  "success": "ok",
  "results": [{
    "username": "+638122053001",
    "password": "2888f0763b08e6c1e7c6a4356923ef3db28b4cdc8587658dc7c830286e9cab4a",
    "msisdn": "+638122053001",
    "device_id": "123456786543210",
    "os": "android",
    "last_offline_xml_ts": null,
    "created_at": "2014-04-29T03:20:26.000Z",
    "partner_id": "heyu",
    "status": 0
  },
  {
    "username": "+638122053006",
    "password": "not-yet-registered",
    "msisdn": "+638122053006",
    "device_id": null,
    "os": null,
    "last_offline_xml_ts": null,
    "created_at": "2014-04-23T07:47:22.000Z",
    "partner_id": "heyu",
    "status": 11
  }]
}
```

Request:

```
GET Host:Port/developer/db/search?key=msisdn&value=+638122053001
```

```
NOTE: Since MSISDN can also be USERNAMES of a user, when searching for a specific MSISDN, use the MSISDN field instead.
```

Response:

```
{
  "success": "ok",
  "results": [
    {
      "username": "+638122053001",
      "password": "2888f0763b08e6c1e7c6a4356923ef3db28b4cdc8587658dc7c830286e9cab4a",
      "msisdn": "+638122053001",
      "device_id": "123456786543210",
      "os": "android",
      "last_offline_xml_ts": null,
      "created_at": "2014-04-29T03:20:26.000Z",
      "partner_id": "heyu",
      "status": 0
    }
  ]
}
```

##### Banning

APIs under banning can be used independently.

<b>Sample Requests and Responses</b>
* Banning<br>
Request:
```
POST Host:Port/v1/babbletools/ban
HEADERS: Content-Type   application/json

{
  "username" : "elixa"
}
```

Response:
```
{
    "success": "ok",
    "msg": "elixa is now banned."
}
```

* Unbanning<br>
Request:
```
DELETE Host:Port/v1/babbletools/unban/:username
```

Response:
```
{
    "success": "ok",
    "msg": "elixa is no longer banned."
}
```

***NOTE: if user's ban has expired, the system will still return a success but instead of having the user's ID/username in the message, you'll get an undefined.

```
{
    "success": "ok",
    "msg": "undefined is no longer banned."
}
```

* List all banned users<br>
Request:
```
GET Host:Port/v1/babbletools/bannedusers
```

Response:
```
{
    "success": "ok",
    "banned_users": [
        "+638122053005",
        "+638122053006"
    ]
}
```

##### MUC Room Management
* Initialize Connection<br>
Before anything else in MUC management, this API should be accessed first

Request:
```
GET Host:Port/v1/babbletools/muc/connect
```

Response:
```
{
    "success": "ok"
}
```

* Get All Rooms<br>
Request:
```
GET Host:Port/v1/babbletools/muc/rooms
```

Response:
```
{
    "success": "ok",
    "rooms": [
        {
            "name": "Fashion",
            "jid": "fashion@muc.localhost"
        },
        {
            "name": "Foodies",
            "jid": "foodies@muc.localhost"
        },
        {
            "name": "Gaming",
            "jid": "gaming@muc.localhost"
        }
    ]
}
```

* Add/Modify Room<br>
Request:
```
POST Host:Port/v1/babbletools/muc/add
HEADERS: Content-Type   application/json

{
  "room_jid" : "fashion",
  "room_name" : "Fashion",
  "room_desc" : "Fashion"
}
```

Response:
```
{
    "success": "ok"
}
```

* Delete Room<br>
Request:
```
DELETE Host:Port/v1/babbletools/muc/delete
```

Response:
```
{
    "success": "ok"
}
```