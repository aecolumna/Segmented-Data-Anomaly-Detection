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
  "total": 12680,
  "results": [
    [
      1,
      "appdmsu_c1887a44-cf00-4a84-8fa7-10a24c6638b1",
      "DataGenerator",
      "163806",
      "2020-02-11T19:24:06.537Z",
      "2020-02-11T19:23:40.022Z",
      null,
      "2020-02-11T19:24:07.112Z",
      "86203b83-f085-4560-b114-ae1269626e4d",
      20,
      [
        [
          [],
          null,
          true,
          [],
          null,
          [],
          [
            [],
            [],
            [],
            null,
            null,
            [],
            [],
            null
          ],
          "process-0",
          "89287807",
          "NORMAL",
          "2020-02-11T19:23:40.022Z",
          [],
          "CronApi",
          "379898",
          20,
          null,
          [
            "63",
            "3.90",
            "0",
            "0",
            "3",
            "39",
            "2",
            "101",
            "294",
            "1",
            "1",
            null,
            "0",
            null,
            "94306",
            "1408"
          ]
        ]
      ],
      1128539,
      "mortgage_200_income_50",
      "NORMAL"
    ],
    [
      1,
      "appdmsu_c1887a44-cf00-4a84-8fa7-10a24c6638b1",
      "DataGenerator",
      "163806",
      "2020-02-11T19:24:06.531Z",
      "2020-02-11T19:23:35.022Z",
      null,
      "2020-02-11T19:24:07.080Z",
      "1cac7ddf-d5f5-4062-9cf0-c8bf3ea663e0",
      20,
      [
        [
          [],
          null,
          true,
          [],
          null,
          [],
          [
            [],
            [],
            [],
            null,
            null,
            [],
            [],
            null
          ],
          "process-0",
          "89287807",
          "NORMAL",
          "2020-02-11T19:23:35.022Z",
          [],
          "CronApi",
          "379898",
          20,
          null,
          [
            "53",
            "0.40",
            "0",
            "1",
            "3",
            "23",
            "4",
            "20",
            "0",
            "1",
            "0",
            null,
            "0",
            null,
            "92123",
            "1407"
          ]
        ]
      ],
      1128539,
      "mortgage_200_income_50",
      "NORMAL"
    ],
    [
      1,
      "appdmsu_c1887a44-cf00-4a84-8fa7-10a24c6638b1",
      "DataGenerator",
      "163806",
      "2020-02-11T19:24:06.500Z",
      "2020-02-11T19:23:30.022Z",
      null,
      "2020-02-11T19:24:07.060Z",
      "352555c0-8eaa-400f-91d1-24173a3c7cb0",
      21,
      [
        [
          [],
          null,
          true,
          [],
          null,
          [],
          [
            [],
            [],
            [],
            null,
            null,
            [],
            [],
            null
          ],
          "process-0",
          "89287807",
          "NORMAL",
          "2020-02-11T19:23:30.022Z",
          [],
          "CronApi",
          "379898",
          21,
          null,
          [
            "46",
            "3.10",
            "1",
            "1",
            "2",
            "22",
            "1",
            "183",
            "0",
            "1",
            "1",
            null,
            "0",
            null,
            "91605",
            "1406"
          ]
        ]
      ],
      1128539,
      "mortgage_200_income_50",
      "NORMAL"
    ],
    [
      1,
      "appdmsu_c1887a44-cf00-4a84-8fa7-10a24c6638b1",
      "DataGenerator",
      "163806",
      "2020-02-11T19:24:06.585Z",
      "2020-02-11T19:23:25.023Z",
      null,
      "2020-02-11T19:24:07.084Z",
      "94a6d523-afeb-4903-90e1-ada26164bab3",
      21,
      [
        [
          [],
          null,
          true,
          [],
          null,
          [],
          [
            [],
            [],
            [],
            null,
            null,
            [],
            [],
            null
          ],
          "process-0",
          "89287807",
          "NORMAL",
          "2020-02-11T19:23:25.023Z",
          [],
          "CronApi",
          "379898",
          21,
          null,
          [
            "58",
            "1.40",
            "0",
            "0",
            "3",
            "28",
            "1",
            "75",
            "0",
            "1",
            "0",
            null,
            "0",
            null,
            "92121",
            "1405"
          ]
        ]
      ],
      1128539,
      "mortgage_200_income_50",
      "NORMAL"
    ],
    [
      1,
      "appdmsu_c1887a44-cf00-4a84-8fa7-10a24c6638b1",
      "DataGenerator",
      "163806",
      "2020-02-11T19:23:36.847Z",
      "2020-02-11T19:23:20.023Z",
      null,
      "2020-02-11T19:23:37.154Z",
      "3a6bd0bc-1ff5-4c7a-8084-06569110fe6b",
      21,
      [
        [
          [],
          null,
          true,
          [],
          null,
          [],
          [
            [],
            [],
            [],
            null,
            null,
            [],
            [],
            null
          ],
          "process-0",
          "89287807",
          "NORMAL",
          "2020-02-11T19:23:20.023Z",
          [],
          "CronApi",
          "379898",
          21,
          null,
          [
            "32",
            "0.20",
            "0",
            "1",
            "1",
            "6",
            "4",
            "51",
            "154",
            "0",
            "0",
            null,
            "1",
            null,
            "93109",
            "1404"
          ]
        ]
      ],
      1128539,
      "mortgage_200_income_50",
      "NORMAL"
    ]
  ],
  "moreData": true,
  "schema": "biz_txn_v1"
}