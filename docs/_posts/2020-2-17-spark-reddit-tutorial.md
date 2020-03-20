---
title: Analyzing Reddit with Spark
lang: en-US
tags:
  - Apache Spark
  - Data Engineering
  - Tutorial
layout: ArticleLayout
---


`https://files.pushshift.io/reddit/comments/`

# Practical Data Processing: Analyzing 138 million Reddit comments

I downloaded the reddit comments for a month from.

This file is 15G compressed, 152G uncompressed, and contains 138,473,643 reddit comments.

If you want to follow along without downloading the entire dataset, here is 6,889,351 comments (1/20th of the original dataset).


The following code was run on a i7-8700k Processor with 32GB RAM


When using heavyweight tools for Data Analysis, it makes sense to ask can you use a simpler tool for  the job

So our benchmarks will be compared against a python script that counts the number of posts by subreddit



## Picking the right tool for the job

Before reaching for heavyweight tools like Spark, ask yourself:
    * How much data will you be processing?
    * Is your data comprised of a few large files, or (Do you have 2TB of parquet files, or millions of 5mb text files?)
    * Is this a one-off analysis job or an important piece of your data infrastructure?
    * 


These are the questions we will be answering with each tool:
* What were the top 20 subreddits by number of comments?
* How many comments mentioned soccer?
* Which comment was gilded the most?


### Ad-hoc Analysis

Let's say we were working with under a few GB of data and wanted to answer some quick questions about it.
In this use case, command-line tools are a great fit. (Since this data is json, it makes sense to use a [jq](https://stedolan.github.io/jq/). One downside is that it pulls the data into memory unlike unix pipeline tools)

`head -n 1000000 reddit_comments_2019_04.txt > reddit_data.txt`


What were the top 20 subreddits by number of comments?
`cat reddit_data.txt | jq --slurp '.[] | .subreddit' | sort | uniq -c | sort -nr | head -20`

```
  42121 "AskReddit"
  17714 "dankmemes"
  12065 "teenagers"
  10209 "politics"
   8912 "nba"
   8706 "memes"
   8561 "funny"
   7068 "AmItheAsshole"
   6884 "unpopularopinion"
   6607 "The_Donald"
   5832 "todayilearned"
   5297 "gonewild"
   5283 "gaming"
   5280 "dataisbeautiful"
   5258 "FortNiteBR"
   5229 "thewalkingdead"
   5212 "news"
   5170 "Market76"
   5158 "PewdiepieSubmissions"
   5151 "baseball"
```


How many comments mentioned soccer?
`cat reddit_data.txt | jq --slurp '.[] | .body' | grep -i 'soccer' | uniq | wc -l`
345

Which comment was gilded the most?
`cat reddit_data.txt | jq -s --slurp ' sort_by(.gilded) | .[] | {"comment": .body, "gold": .gilded}' | tail -n 4`

```json
{
  "comment": "On hard days, don’t give in to the temptation to compare your best self to their worst self.",
  "gilded": 3
}
```


## Python processing

As soon as we want to do anything more complicated, Python is an excellent choice. This script will be our baseline job, it reads all reddit comments and counting by subreddit
```python
import ujson
import time
from collections import defaultdict

subreddit_count = defaultdict(int)

start = time.time()
with open("data/reddit_comments.txt","r") as f:
    for line in f:
        subreddit = ujson.loads(line)["subreddit"]
        subreddit_count[subreddit] += 1
        print(f"seconds processing: {(time.time() - start)}", end="\r")
end = time.time()

print("---------")
print(f"seconds elapsed: {(end - start)}")

f= open("output.json","w+")
data = dict(subreddit_count)
f.write(str(data))
```

This script took *30* minutes to complete.

How could we make this faster? Instead of using a single thread, share the work among all cores and combine the results


```


```


That's a huge improvement in time




## Now, with Apache Spark


Instead of having to manually manage multiple processes and combine the results, we can make use of the the power of spark


In our Jupyter Notebook
```


```