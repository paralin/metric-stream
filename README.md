Metric stream is a way of taking time series data / metrics and serving them to the browser in a constant stream, which allows for live data updates to work just as well as one-off aggregations and calculations.

Components
==========

System components:

  - RethinkTS is the upstream time-series database
  - Websockets to transfer data in realtime (although this is not in this lib)
  - ProtobufJS to serialize queries
  - Clients can subscribe to metric streams
  - Server must be responsible for batching / aggregating together queries

End to end:

 - Client opens socket
 - Client sends subscribe message for metric with query
 - System calls RethinkTS and starts a tailing query

Problems
========

Query batching:

 - If a user opens a request for data between X and Y time, but then they open a second request between X-5 and Y+3 time, we should restart the RethinkTS query with the bigger scope rather than make two queries at once.
 - When doing this we should compare the old dataset to the new to avoid deleting the entire dataset on the client and then re-sending it.
 - This could be done easily by:
   1. Start new query
   2. Pull all data from new query
   3. Compare old + new, send deletes for any removed data, adds for any new data
   4. Kill old query.
 - However, there are some problems here:
   - Data duplication: we're storing the data twice essentially
   - This could be fixed upstream - send a message in the GRPC stream to change the query for example. However, rethink does not support this anyway.
   - RethinkDB Issue: https://github.com/rethinkdb/rethinkdb/issues/6073

RPC protocol:

 - ProtobufJS supports the RPC syntax, but without streams. See:
   - https://github.com/dcodeIO/protobuf.js/issues/468
 - It would be optimal to use RPC streams to pull metrics. This would offer the subscribe model, a way to channel messages to a specific callback, etc out of the box.
 - As a stopgap measure, for now a custom Protobuf protocol will be written, but this should be replaced by 1.0.0 with a proper GRPC implementation in websockets.

Overlapping subscriptions:

 - Getting two identical subscriptions is easy: just send the same data back.
   - Can even tell the client "this is identical, use this dupe data."
 - What happens if a query overlaps another?
   - For now, too complex of a problem to worry about. Just make two queries.

Multi-client overlap:

 - Multiple clients might request the same data
 - We should deduplicate these queries
