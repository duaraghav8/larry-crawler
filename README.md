# larry-crawler

[![Build Status](https://travis-ci.org/duaraghav8/larry-crawler.svg?branch=master)](https://travis-ci.org/duaraghav8/larry-crawler)

Kayako Twitter challenge

## Installation
```js
npm install --save larry-crawler
```

## Usage
Navigate to the ```node_modules``` directory which contains larry-crawler.

```bash
cd larry-crawler/usage
node get-tweets.js
```

## Output
The application fetches tweets in batches of 100. Unless forcefully killed (CTRL+C), the app will keep running until all tweets matching the defined criteria have been fetched.
See [result](https://github.com/duaraghav8/larry-crawler/blob/master/usage/result).

NOTE: A batch might produce less than 100 tweets in output if you've applied a secondary filter (like retweetCounts).
If 100 tweets were retrieved based on specified HashTag and 30 of them haven't been retweeted, then only 70 tweets are supplied in the ```response.statuses``` Array.


## Module API
To access the class larry-crawler exposes for crawling twitter:

```js
const {TwitterCrawler} = require ('./larry-crawler');
```

Get your app or user credentials from https://dev.twitter.com/, then create a new object like:

```js
const crawler = new TwitterCrawler ({

	consumerKey: process.env.TWITTER_CONSUMER_KEY,
	consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
	accessTokenKey: process.env.TWITTER_ACCESS_TOKEN_KEY,
	accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET

});
```
If you have a twitter app, use ```bearerToken``` instead of ```accessTokenKey``` & ```accessTokenSecret```.

The new object exposes method ```getTweets()``` to fetch tweets based on criteria and returns a ```Promise```.

```js
const criteria = { hashtags: ['custserv'], retweetCount: {$gt: 0} };

crawler.getTweets (criteria).then ((response) => {
  console.log (JSON.stringify (response, null, 2));
}).catch (() => {});
```

To set the ```max_id``` parameter for pagination,
```js
criteria.maxIdString = status.id_str
```
where ```status``` is an item in the ```response.statuses``` Array.

See [get-tweets.js](https://github.com/duaraghav8/larry-crawler/blob/master/usage/get-tweets.js) for a full example.



## Technical Details

The module has only 1 dependancy - [twitter](https://www.npmjs.com/package/twitter).

1. Searching based on Hashtags is simple since Twitter API has in-built support for that. But in order to further refine tweets based on number of retweets, the module contains a class ```SecondaryFilterForTweets```.

See [Working with search API](https://dev.twitter.com/rest/reference/get/search/tweets)

1. Since a maximum of 100 tweeets are sent per request, an effective pagination strategy had to be implemented using the ```max_id``` parameter so we can retrieve ALL the tweets since the very beginning. [This strategy](https://dev.twitter.com/rest/public/timelines) was followed to achieve pagination.

2. The primary challenge was to deal with the 64-bit integer ID provided by the Twitter API. JS can only provide precision upto 53 bits. Hence, the application uses ```id_str``` field at all times and a special decrement function has been written in ```usage/utils.js``` to operate on the string ID.

See [Working with 64-bit id in Twitter](https://dev.twitter.com/overview/api/twitter-ids-json-and-snowflake)
