{
  "fields": [
    {
      "label": "_totalUpserts",
      "field": "_totalUpserts",
      "type": "integer"
    },
    {
      "label": "accountName",
      "field": "accountName",
      "type": "string"
    },
    {
      "label": "application",
      "field": "application",
      "type": "string"
    },
    {
      "label": "applicationId",
      "field": "applicationId",
      "type": "string"
    },
    {
      "label": "eventCompletionTimestamp",
      "field": "eventCompletionTimestamp",
      "type": "date"
    },
    {
      "label": "eventTimestamp",
      "field": "eventTimestamp",
      "type": "date"
    },
    {
      "label": "parentGUID",
      "field": "parentGUID",
      "type": "string"
    },
    {
      "label": "pickupTimestamp",
      "field": "pickupTimestamp",
      "type": "date"
    },
    {
      "label": "requestGUID",
      "field": "requestGUID",
      "type": "string"
    },
    {
      "label": "responseTime",
      "field": "responseTime",
      "type": "integer"
    },
    {
      "label": "segments",
      "field": "segments",
      "type": "array",
      "fields": [
        {
          "field": "aggregatedExitCallTime",
          "type": "array"
        },
        {
          "field": "clientRequestGUID",
          "type": "string"
        },
        {
          "field": "entryPoint",
          "type": "boolean"
        },
        {
          "field": "errorList",
          "type": "array",
          "fields": [
            {
              "field": "errorCode",
              "type": "string"
            },
            {
              "field": "errorDetail",
              "type": "string"
            },
            {
              "field": "errorType",
              "type": "string"
            }
          ]
        },
        {
          "field": "errors",
          "type": "string"
        },
        {
          "field": "exitCalls",
          "type": "array",
          "fields": [
            {
              "field": "avgResponseTimeMillis",
              "type": "float"
            },
            {
              "field": "customExitCallDefinitionId",
              "type": "string"
            },
            {
              "field": "exitCallType",
              "type": "string"
            },
            {
              "field": "isCustomExitCall",
              "type": "boolean"
            },
            {
              "field": "isSynchronous",
              "type": "boolean"
            },
            {
              "field": "numberOfCalls",
              "type": "integer"
            },
            {
              "field": "numberOfErrors",
              "type": "integer"
            },
            {
              "field": "toEntity",
              "type": "object",
              "fields": [
                {
                  "field": "entityId",
                  "type": "string"
                },
                {
                  "field": "entityType",
                  "type": "string"
                }
              ]
            }
          ]
        },
        {
          "field": "httpData",
          "type": "object",
          "fields": [
            {
              "field": "cookies",
              "type": "array"
            },
            {
              "field": "headers",
              "type": "array"
            },
            {
              "field": "parameters",
              "type": "array"
            },
            {
              "field": "principal",
              "type": "string"
            },
            {
              "field": "sessionId",
              "type": "string"
            },
            {
              "field": "sessionObjects",
              "type": "array"
            },
            {
              "field": "uriPathSegments",
              "type": "array"
            },
            {
              "field": "url",
              "type": "string"
            }
          ]
        },
        {
          "field": "node",
          "type": "string"
        },
        {
          "field": "nodeId",
          "type": "string"
        },
        {
          "field": "requestExperience",
          "type": "string"
        },
        {
          "field": "segmentTimestamp",
          "type": "date"
        },
        {
          "field": "sqlData",
          "type": "array"
        },
        {
          "field": "tier",
          "type": "string"
        },
        {
          "field": "tierId",
          "type": "string"
        },
        {
          "field": "transactionTime",
          "type": "integer"
        },
        {
          "field": "uniqueSegmentId",
          "type": "integer"
        },
        {
          "field": "userData",
          "type": "object",
          "fields": [
            {
              "field": "age",
              "type": "string"
            },
            {
              "field": "ccavg",
              "type": "string"
            },
            {
              "field": "cd_account",
              "type": "string"
            },
            {
              "field": "creditcard",
              "type": "string"
            },
            {
              "field": "education",
              "type": "string"
            },
            {
              "field": "experience",
              "type": "string"
            },
            {
              "field": "family",
              "type": "string"
            },
            {
              "field": "income",
              "type": "string"
            },
            {
              "field": "mortgage",
              "type": "string"
            },
            {
              "field": "online",
              "type": "string"
            },
            {
              "field": "personal_loan",
              "type": "string"
            },
            {
              "field": "requestid",
              "type": "string"
            },
            {
              "field": "securities_account",
              "type": "string"
            },
            {
              "field": "vin",
              "type": "string"
            },
            {
              "field": "zip_code",
              "type": "string"
            },
            {
              "field": "﻿id",
              "type": "string"
            }
          ]
        }
      ]
    },
    {
      "label": "transactionId",
      "field": "transactionId",
      "type": "integer"
    },
    {
      "label": "transactionName",
      "field": "transactionName",
      "type": "string"
    },
    {
      "label": "userExperience",
      "field": "userExperience",
      "type": "string"
    }
  ],
  "total": 0,
  "results": [],
  "moreData": false,
  "schema": "biz_txn_v1"
}