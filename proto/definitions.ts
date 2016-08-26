/* tslint:disable:trailing-comma */
/* tslint:disable:quotemark */
/* tslint:disable:max-line-length */
export const definitions = {
    "package": null,
    "messages": [
        {
            "name": "gogoproto",
            "fields": [],
            "options": {
                "java_package": "com.google.protobuf",
                "java_outer_classname": "GoGoProtos"
            }
        },
        {
            "name": "metric",
            "fields": [],
            "options": {
                "(gogoproto.unmarshaler_all)": true,
                "(gogoproto.marshaler_all)": true,
                "(gogoproto.sizer_all)": true
            },
            "messages": [
                {
                    "name": "GeoLocation",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "double",
                            "name": "latitude",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "double",
                            "name": "longitude",
                            "id": 2
                        }
                    ]
                },
                {
                    "name": "MetricIdentifier",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "id",
                            "id": 1
                        }
                    ]
                },
                {
                    "name": "MetricSeries",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "id",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "title",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "description",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "type": "MetricDataType",
                            "name": "data_type",
                            "id": 5
                        },
                        {
                            "rule": "map",
                            "type": "MetricTagMeta",
                            "keytype": "string",
                            "name": "tag_meta",
                            "id": 6
                        },
                        {
                            "rule": "optional",
                            "type": "MetricDeduplicationStrategy",
                            "name": "dedupe_strategy",
                            "id": 7
                        }
                    ],
                    "messages": [
                        {
                            "name": "MetricTagMeta",
                            "fields": [
                                {
                                    "rule": "optional",
                                    "type": "MetricTagIndexType",
                                    "name": "index",
                                    "id": 1
                                },
                                {
                                    "rule": "optional",
                                    "type": "string",
                                    "name": "title",
                                    "id": 2
                                },
                                {
                                    "rule": "optional",
                                    "type": "string",
                                    "name": "description",
                                    "id": 3
                                }
                            ],
                            "enums": [
                                {
                                    "name": "MetricTagIndexType",
                                    "values": [
                                        {
                                            "name": "NONE",
                                            "id": 0
                                        },
                                        {
                                            "name": "STANDARD",
                                            "id": 1
                                        },
                                        {
                                            "name": "GEOPOINT",
                                            "id": 2
                                        }
                                    ]
                                }
                            ]
                        }
                    ],
                    "enums": [
                        {
                            "name": "MetricDataType",
                            "values": [
                                {
                                    "name": "NUMBER",
                                    "id": 0
                                }
                            ]
                        },
                        {
                            "name": "MetricDeduplicationStrategy",
                            "values": [
                                {
                                    "name": "NONE",
                                    "id": 0
                                },
                                {
                                    "name": "NONCE",
                                    "id": 1
                                }
                            ]
                        }
                    ]
                },
                {
                    "name": "MetricDatapoint",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "int64",
                            "name": "timestamp",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "GeoLocation",
                            "name": "location",
                            "id": 2
                        },
                        {
                            "rule": "map",
                            "type": "string",
                            "keytype": "string",
                            "name": "tags",
                            "id": 3
                        },
                        {
                            "rule": "map",
                            "type": "double",
                            "keytype": "string",
                            "name": "value",
                            "id": 4
                        }
                    ]
                },
                {
                    "name": "MetricDatapointWithMeta",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "MetricDatapoint",
                            "name": "datapoint",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "MetricIdentifier",
                            "name": "metric",
                            "id": 2
                        }
                    ]
                },
                {
                    "name": "MetricDatapointQuery",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "MetricDatapointTimeConstraint",
                            "name": "time_constraint",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "MetricDatapointTagConstraint",
                            "name": "tag_constraint",
                            "id": 2
                        }
                    ],
                    "messages": [
                        {
                            "name": "MetricDatapointTimeConstraint",
                            "fields": [
                                {
                                    "rule": "optional",
                                    "type": "int64",
                                    "name": "min_time",
                                    "id": 1
                                },
                                {
                                    "rule": "optional",
                                    "type": "int64",
                                    "name": "max_time",
                                    "id": 2
                                }
                            ]
                        },
                        {
                            "name": "MetricDatapointTagConstraint",
                            "fields": [
                                {
                                    "rule": "map",
                                    "type": "MetricDatapointTagConstraintTag",
                                    "keytype": "string",
                                    "name": "tags",
                                    "id": 1
                                }
                            ],
                            "messages": [
                                {
                                    "name": "MetricDatapointTagConstraintTag",
                                    "fields": [
                                        {
                                            "rule": "repeated",
                                            "type": "string",
                                            "name": "value",
                                            "id": 1
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    "name": "RequestContext",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "MetricIdentifier",
                            "name": "identifier",
                            "id": 1
                        }
                    ]
                },
                {
                    "name": "RecordDatapointRequest",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "RequestContext",
                            "name": "context",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "MetricDatapoint",
                            "name": "datapoint",
                            "id": 2
                        }
                    ]
                },
                {
                    "name": "RecordDatapointResponse",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "num_recorded",
                            "id": 1
                        },
                        {
                            "rule": "repeated",
                            "type": "MetricDatapoint",
                            "name": "rejected",
                            "id": 2
                        }
                    ]
                },
                {
                    "name": "ListDatapointRequest",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "bool",
                            "name": "tail",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "MetricDatapointQuery",
                            "name": "query",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "RequestContext",
                            "name": "context",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "type": "bool",
                            "name": "include_initial",
                            "id": 4
                        }
                    ]
                },
                {
                    "name": "ListDatapointResponse",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "ListDatapointResponseType",
                            "name": "response_type",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "MetricDatapoint",
                            "name": "datapoint",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "MetricSeries",
                            "name": "series",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "type": "bool",
                            "name": "initial_set",
                            "id": 4
                        }
                    ],
                    "enums": [
                        {
                            "name": "ListDatapointResponseType",
                            "values": [
                                {
                                    "name": "LIST_DATAPOINT_SERIES_DETAILS",
                                    "id": 0
                                },
                                {
                                    "name": "LIST_DATAPOINT_ADD",
                                    "id": 1
                                },
                                {
                                    "name": "LIST_DATAPOINT_DEL",
                                    "id": 2
                                },
                                {
                                    "name": "LIST_DATAPOINT_REPLACE",
                                    "id": 3
                                }
                            ]
                        }
                    ]
                },
                {
                    "name": "ListMetricRequest",
                    "fields": []
                },
                {
                    "name": "ListMetricResponse",
                    "fields": [
                        {
                            "rule": "repeated",
                            "type": "MetricSeries",
                            "name": "metric",
                            "id": 1
                        }
                    ]
                },
                {
                    "name": "CreateMetricRequest",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "MetricSeries",
                            "name": "metric",
                            "id": 1
                        }
                    ]
                },
                {
                    "name": "CreateMetricResponse",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "MetricSeries",
                            "name": "metric",
                            "id": 1
                        }
                    ]
                },
                {
                    "name": "GetMetricRequest",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "RequestContext",
                            "name": "context",
                            "id": 1
                        }
                    ]
                },
                {
                    "name": "GetMetricResponse",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "MetricSeries",
                            "name": "metric",
                            "id": 1
                        }
                    ]
                }
            ],
            "services": [
                {
                    "name": "MetricService",
                    "options": {},
                    "rpc": {
                        "RecordDatapoint": {
                            "request": "RecordDatapointRequest",
                            "response": "RecordDatapointResponse",
                            "options": {
                                "(google.api.http).post": "/v1/metric/{context.identifier.id}/datapoint",
                                "(google.api.http).body": "datapoint"
                            }
                        },
                        "RecordDatapointStream": {
                            "request": "RecordDatapointRequest",
                            "response": "RecordDatapointResponse",
                            "options": {}
                        },
                        "ListDatapoint": {
                            "request": "ListDatapointRequest",
                            "response": "ListDatapointResponse",
                            "options": {
                                "(google.api.http).get": "/v1/metric/{context.identifier.id}/datapoint"
                            }
                        },
                        "ListMetric": {
                            "request": "ListMetricRequest",
                            "response": "ListMetricResponse",
                            "options": {
                                "(google.api.http).get": "/v1/metric"
                            }
                        },
                        "CreateMetric": {
                            "request": "CreateMetricRequest",
                            "response": "CreateMetricResponse",
                            "options": {
                                "(google.api.http).post": "/v1/metric",
                                "(google.api.http).body": "metric"
                            }
                        },
                        "GetMetric": {
                            "request": "GetMetricRequest",
                            "response": "GetMetricResponse",
                            "options": {
                                "(google.api.http).get": "/v1/metric/{context.identifier.id}"
                            }
                        }
                    }
                }
            ]
        },
        {
            "name": "google",
            "fields": [],
            "messages": [
                {
                    "name": "api",
                    "fields": [],
                    "options": {
                        "java_multiple_files": true,
                        "java_outer_classname": "AnnotationsProto",
                        "java_package": "com.google.api"
                    },
                    "messages": [
                        {
                            "name": "HttpRule",
                            "fields": [
                                {
                                    "rule": "optional",
                                    "type": "string",
                                    "name": "get",
                                    "id": 2,
                                    "oneof": "pattern"
                                },
                                {
                                    "rule": "optional",
                                    "type": "string",
                                    "name": "put",
                                    "id": 3,
                                    "oneof": "pattern"
                                },
                                {
                                    "rule": "optional",
                                    "type": "string",
                                    "name": "post",
                                    "id": 4,
                                    "oneof": "pattern"
                                },
                                {
                                    "rule": "optional",
                                    "type": "string",
                                    "name": "delete",
                                    "id": 5,
                                    "oneof": "pattern"
                                },
                                {
                                    "rule": "optional",
                                    "type": "string",
                                    "name": "patch",
                                    "id": 6,
                                    "oneof": "pattern"
                                },
                                {
                                    "rule": "optional",
                                    "type": "CustomHttpPattern",
                                    "name": "custom",
                                    "id": 8,
                                    "oneof": "pattern"
                                },
                                {
                                    "rule": "optional",
                                    "type": "string",
                                    "name": "body",
                                    "id": 7
                                },
                                {
                                    "rule": "repeated",
                                    "type": "HttpRule",
                                    "name": "additional_bindings",
                                    "id": 11
                                }
                            ],
                            "oneofs": {
                                "pattern": [
                                    2,
                                    3,
                                    4,
                                    5,
                                    6,
                                    8
                                ]
                            }
                        },
                        {
                            "name": "CustomHttpPattern",
                            "fields": [
                                {
                                    "rule": "optional",
                                    "type": "string",
                                    "name": "kind",
                                    "id": 1
                                },
                                {
                                    "rule": "optional",
                                    "type": "string",
                                    "name": "path",
                                    "id": 2
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "name": "metricstream",
            "fields": [],
            "messages": [
                {
                    "name": "MSClientMessage",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "MSSubscribe",
                            "name": "metric_subscribe",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "MSUnsubscribe",
                            "name": "metric_unsubscribe",
                            "id": 3
                        }
                    ]
                },
                {
                    "name": "MSServerMessage",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "MSSubscribeResult",
                            "name": "subscribe_result",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "MSUnsubscribeResult",
                            "name": "unsubscribe_result",
                            "id": 3
                        }
                    ]
                },
                {
                    "name": "MSSubscribe",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "metric.RequestContext",
                            "name": "context",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "metric.MetricDatapointQuery",
                            "name": "query",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "subscription_id",
                            "id": 3
                        }
                    ]
                },
                {
                    "name": "MSSubscribeResult",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "MSSubscribeResultType",
                            "name": "error",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "error_details",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "subscription_id",
                            "id": 3
                        }
                    ],
                    "enums": [
                        {
                            "name": "MSSubscribeResultType",
                            "values": [
                                {
                                    "name": "SUBSCRIBE_OK",
                                    "id": 0
                                },
                                {
                                    "name": "SUBSCRIBE_BAD_ID",
                                    "id": 1
                                },
                                {
                                    "name": "SUBSCRIBE_GRPC_ERR",
                                    "id": 2
                                }
                            ]
                        }
                    ]
                },
                {
                    "name": "MSUnsubscribe",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "subscription_id",
                            "id": 3
                        }
                    ]
                },
                {
                    "name": "MSUnsubscribeResult",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "subscription_id",
                            "id": 3
                        }
                    ]
                }
            ]
        }
    ]
};
