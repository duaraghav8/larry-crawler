# This README is a work in progress

# larry-crawler
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


https://dev.twitter.com/rest/public/timelines

https://dev.twitter.com/rest/reference/get/search/tweets

https://dev.twitter.com/rest/public/search

https://dev.twitter.com/overview/api/twitter-ids-json-and-snowflake
