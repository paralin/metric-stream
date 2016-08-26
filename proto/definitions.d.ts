declare interface IGeoLocation {
  latitude?: number;
  longitude?: number;
}

declare interface IMetricIdentifier {
  id?: string;
}

declare interface IMetricSeries {
  id?: string;
  title?: string;
  description?: string;
  data_type?: MetricDataType;
  tag_meta: { [key: string]: IMetricTagMeta };
  dedupe_strategy?: MetricDeduplicationStrategy;
}

declare interface IMetricTagMeta {
  index?: MetricTagIndexType;
  title?: string;
  description?: string;
}

declare const enum MetricTagIndexType {
  NONE = 0,
  STANDARD = 1,
  GEOPOINT = 2,
}

declare const enum MetricDataType {
  NUMBER = 0,
}

declare const enum MetricDeduplicationStrategy {
  NONE = 0,
  NONCE = 1,
}

declare interface IMetricDatapoint {
  timestamp?: number;
  location?: IGeoLocation;
  tags: { [key: string]: string };
  value: { [key: string]: number };
}

declare interface IMetricDatapointWithMeta {
  datapoint?: IMetricDatapoint;
  metric?: IMetricIdentifier;
}

declare interface IMetricDatapointQuery {
  time_constraint?: IMetricDatapointTimeConstraint;
  tag_constraint?: IMetricDatapointTagConstraint;
}

declare interface IMetricDatapointTimeConstraint {
  min_time?: number;
  max_time?: number;
}

declare interface IMetricDatapointTagConstraint {
  tags: { [key: string]: IMetricDatapointTagConstraintTag };
}

declare interface IMetricDatapointTagConstraintTag {
  value: string[];
}

declare interface IRequestContext {
  identifier?: IMetricIdentifier;
}

declare interface IRecordDatapointRequest {
  context?: IRequestContext;
  datapoint?: IMetricDatapoint;
}

declare interface IRecordDatapointResponse {
  num_recorded?: number;
  rejected: IMetricDatapoint[];
}

declare interface IListDatapointRequest {
  tail?: boolean;
  query?: IMetricDatapointQuery;
  context?: IRequestContext;
  include_initial?: boolean;
}

declare interface IListDatapointResponse {
  response_type?: ListDatapointResponseType;
  datapoint?: IMetricDatapoint;
  series?: IMetricSeries;
  initial_set?: boolean;
}

declare const enum ListDatapointResponseType {
  LIST_DATAPOINT_SERIES_DETAILS = 0,
  LIST_DATAPOINT_ADD = 1,
  LIST_DATAPOINT_DEL = 2,
  LIST_DATAPOINT_REPLACE = 3,
}

declare interface IListMetricResponse {
  metric: IMetricSeries[];
}

declare interface ICreateMetricRequest {
  metric?: IMetricSeries;
}

declare interface ICreateMetricResponse {
  metric?: IMetricSeries;
}

declare interface IGetMetricRequest {
  context?: IRequestContext;
}

declare interface IGetMetricResponse {
  metric?: IMetricSeries;
}

declare interface IHttpRule {
  get?: string;
  put?: string;
  post?: string;
  delete?: string;
  patch?: string;
  custom?: ICustomHttpPattern;
  body?: string;
  additional_bindings: IHttpRule[];
}

declare interface ICustomHttpPattern {
  kind?: string;
  path?: string;
}

declare interface IMSClientMessage {
  metric_subscribe?: IMSSubscribe;
  metric_unsubscribe?: IMSUnsubscribe;
}

declare interface IMSServerMessage {
  subscribe_result?: IMSSubscribeResult;
  unsubscribe_result?: IMSUnsubscribeResult;
}

declare interface IMSSubscribe {
  context?: IRequestContext;
  query?: IMetricDatapointQuery;
  subscription_id?: string;
}

declare interface IMSSubscribeResult {
  error?: MSSubscribeResultType;
  error_details?: string;
  subscription_id?: string;
}

declare const enum MSSubscribeResultType {
  SUBSCRIBE_OK = 0,
  SUBSCRIBE_BAD_ID = 1,
  SUBSCRIBE_GRPC_ERR = 2,
}

declare interface IMSUnsubscribe {
  subscription_id?: string;
}

declare interface IMSUnsubscribeResult {
  subscription_id?: string;
}


