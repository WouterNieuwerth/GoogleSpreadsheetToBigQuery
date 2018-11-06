# GoogleSpreadsheetToBigQuery

Loads the content of a Google Sheets spreadsheet into BigQuery.

Based on:
- https://www.lunametrics.com/blog/2017/07/26/connect-google-analytics-data-tools-via-bigquery/
- https://developers.google.com/apps-script/advanced/bigquery

There are several examples to be found on how to load a CSV file into Big Query using Google Apps Scripts. There are also several blogs about loading BigQuery results in a Google Sheets spreadsheet. Blogs and examples about loading the content of a Google Sheets spreadsheet into Google BigQuery are more sparse though. This script does exactly that: it loads all the content of a specified sheet into BigQuery. This is useful when the content of the spreadsheet changes often and you want to save its content on a regular basis.

This script can be used as Google Apps Script. The easiest way is to open the Google Sheet and go to the script editor through the menu bar.

In the script editor you must enable the BigQuery API through the Advanced Google Services. You can then set a schedule for the Google Apps Script to fetch the content of the Spreadsheet and push it to Google BigQuery.