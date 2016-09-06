import { builder } from '../../proto/builder';
import * as grpc from 'grpc';

// Build the metric namespace
builder.build('metric');
export const GRPCMetricServiceProto =
  grpc.loadObject(builder.lookup('metric.MetricService'));
