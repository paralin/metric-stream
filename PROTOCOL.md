Protocol
========

This is a stopgap measure until GRPC is supported properly in websockets

Messages are protobuf binaries.

Client sends a subscribe call -> response, then data is piped through from RethinkTS including ADD, REMOVE, INITIAL, etc messages.

When a subscribe call comes through:

 - Generate subscription ID
 - Search for any other duplicate queries
 - Add/create query, call RethinkTS, wait until error / no error comes back, then return subscription result
 - Subscription result will have:
   - Subscription ID
   - Alias ID if client already has the data

Server
======

On the server there are "Query Instances." Each query instance has:

 - GRPC call for metric query
 - List of client subscription lists, each includes:
   - List of subscription IDs to the client

Queries are detected to be duplicate if comparing the GRPC query request is identical.
