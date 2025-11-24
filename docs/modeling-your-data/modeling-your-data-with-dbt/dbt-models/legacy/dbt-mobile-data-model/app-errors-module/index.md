---
title: "App errors in Mobile package"
sidebar_label: "App errors"
sidebar_position: 100
---

```mdx-code-block
import Badges from '@site/src/components/Badges';
```

<Badges badgeType="dbt-package Release" pkg="mobile"></Badges>

Exception tracking captures any unhandled exceptions within the application. The exception tracking is enabled by default, and it allows the tracker to intercept critical exceptions in the app. Exceptions can crash the app so it's likely that the event will be sent after the restart of the app. Being a critical situation we can't be 100% sure that all the exception stacktraces are reliably stored for sending before the crash of the app.


## App Error Columns


| Column                | Description                                                                 |
| --------------------- | --------------------------------------------------------------------------- |
| `programmingLanguage` | The name of the programming language used in which the app error occured.   |
| `message`             | The error message that the application showed when the app error occurred.  |
| `threadName`          | The name of the process that ran the thread when the app error occurred.    |
| `threadId`            | The ID of the thread in which the app error occurred.                       |
| `stackTrace`          | The full stack trace that was presented when the app error occured.         |
| `causeStackTrace`     | The cause of the stack trace that was presented when the app error occured. |
| `lineNumber`          | The line number in the code where the app error occured.                    |
| `className`           | The name of the class where the app error occurred.                         |
| `exceptionName`       | The name of the exception encountered in the app error.                     |
| `isFatal`             | A boolean to describe whether the app error was fatal or not.               |
| `lineColumn`          | The line number in the code where the app error occured.                    |
| `fileName`            | The name of the file where the app error occurred.                          |
