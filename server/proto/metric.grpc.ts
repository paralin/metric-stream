import { builder } from '../../proto/builder';
import * as grpc from 'grpc';

export const GRPCMetricServiceProto =
  grpc.loadObject(builder.lookup('metric.MetricService'));
