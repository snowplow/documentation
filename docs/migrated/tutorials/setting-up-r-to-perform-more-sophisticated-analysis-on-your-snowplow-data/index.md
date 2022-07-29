---
title: "Tutorial: Setting up R to perform more sophisticated analysis on your Snowplow data"
date: "2021-03-26"
sidebar_position: 80
---

## 1\. What is R, and why use it to analyze / visualize Snowplow data?

R is free, open source software for performing statistical and graphical analysis.

R is in many respects a very strange analytics environment for the newbie. (It is not really a 'program' or 'service' as such.) It is a programming language, and as a result, can be daunting to use for business analysts who do not have development experience.

However, R is not a straightforward tool for developers to use either: many features of the language are unique to R, even amongst other interpreted languages (like Python) and functional languages (like Scala or Haskell).

In spite of its 'unusualness', there is one very good reasons to use R to analyze Snowplow (and other data sets): there is a huge amount you can do with R that is very difficult with traditional analytics programmes. To give just some examples:

1. **Advanced visualizations**. R supports graphing data in many more ways, much more flexibly, than standard analytics packages like Excel or BI tools like Tableau
2. **Statistical analysis**. R supports a staggering array of statistical analyzes: making it easy to run standard statistical tests on data to see if e.g. two groups of visitors behave in a way that is significantly different
3. **Algorithmic analysis**. R libraries include a wide range of algorithmic analytical techniques including market basket analyzes, principle component analysis, to give just two that are relevant with web analytics data.

## 2\. Download and get started with R

[To download and install R on Windows or Mac, visit the download page](https://www.r-project.org/), choose a nearby mirror and select the download appropriate for your platform. Then run the installer once the download is completed. You can then launch R from your start/applications menu.

To install R on Ubuntu, add the following line to your `/etc/apt/sources.list` file:

```
deb http://<my.favorite.cran.mirror>/bin/linux/ubuntu precise/
```

but swap out `<my.favorite.cran.mirror>` for your nearest mirror e.g. `deb http://cran.ma.imperial.ac.uk/bin/linux/ubuntu precise/`

Then simply

```
sudo apt-get update
sudo apt-get install r-base
```

You can then launch R by typing

```
R
```

at the prompt.

## 3\. Connecting R to Snowplow data in Redshift

You can pull Snowplow data stored in Redshift directly into R using the `RPostgreSQL` package.

First, install the package. (This only needs to be done once for your R installation.) Run at the R command prompt:

```
install.packages("RPostgreSQL")
```

To use the library (e.g. at the beginning of an R session), enter the following at the command prompt:

```
library("RPostgreSQL")
```

Then:

```
drv <- dbDriver("PostgreSQL")
con <- dbConnect(drv, host="<<ENTER HOST DETAILS HERE>>", port="<<ENTER PORT DETAILS HERE>>",dbname="<<ENTER DB NAME HERE>>", user="<<ENTER USERNAME HERE>>", password="<<ENTER PASSWORD HERE>>")
```

Note: you can access the relevant host, port, dbname and username fields by logging into the AWS console [console.aws.amazon.com](http://console.aws.amazon.com/), selecting Redshift and then clicking on the cluster you use for Snowplow:

You can now fetch Snowplow data directly from Redshift into a dataframe in R, by executing the `dbGetQuery` statement to run a SQL statement against that data and return the data into R as a data frame. For example, the following query returns a list of visits to an ecommerce site, classified by whether the stage in the purchase funnel that each visit got to:

```
SELECT
a.domain_userid,
a.first_touch,
CASE WHEN d.shopper = 1 THEN 'shopper' WHEN c.checkout = 1 THEN 'checkout' WHEN b.basket = 1 THEN 'basket' ELSE 'window-shopper' END AS type
FROM (
    SELECT
    domain_userid,
    MIN(DATE(collector_tstamp)) AS first_touch
    FROM events_new
    GROUP BY domain_userid
) a
LEFT JOIN (
    SELECT
    domain_userid,
    1 AS basket
    FROM events_new
    WHERE ev_action = 'add-to-basket'
    GROUP BY domain_userid
) b ON a.domain_userid = b.domain_userid
LEFT JOIN (
    SELECT
    domain_userid,
    1 AS checkout
    FROM events_new
    WHERE ev_action = 'checkout'
    GROUP BY domain_userid
) c ON a.domain_userid = c.domain_userid
LEFT JOIN (
    SELECT
    domain_userid,
    1 AS shopper
    FROM events_new
    WHERE event='transaction'
    GROUP BY domain_userid
) d ON a.domain_userid = d.domain_userid
```

We can pull that data into R by executing the following at the R command prompt:

```
visits <- dbGetQuery(con, "
    SELECT
    a.domain_userid,
    a.first_touch,
    CASE WHEN d.shopper = 1 THEN 'shopper' WHEN c.checkout = 1 THEN 'checkout' WHEN b.basket = 1 THEN 'basket' ELSE 'window-shopper' END AS type
    FROM (
        SELECT
        domain_userid,
        MIN(DATE(collector_tstamp)) AS first_touch
        FROM events_new
        GROUP BY domain_userid
    ) a
    LEFT JOIN (
        SELECT
        domain_userid,
        1 AS basket
        FROM events_new
        WHERE ev_action = 'add-to-basket'
        GROUP BY domain_userid
    ) b ON a.domain_userid = b.domain_userid
    LEFT JOIN (
        SELECT
        domain_userid,
        1 AS checkout
        FROM events_new
        WHERE ev_action = 'checkout'
        GROUP BY domain_userid
    ) c ON a.domain_userid = c.domain_userid
    LEFT JOIN (
        SELECT
        domain_userid,
        1 AS shopper
        FROM events_new
        WHERE event='transaction'
        GROUP BY domain_userid
    ) d ON a.domain_userid = d.domain_userid
")
```

[r](http://www.r-project.org/)  
[download-r](http://www.r-project.org/)  
[aws-console](https://console.aws.amazon.com/console/home)  
[get-started-with-r](http://snowplowanalytics.com/analytics/tools-and-techniques/get-started-analysing-snowplow-data-with-r.html)
