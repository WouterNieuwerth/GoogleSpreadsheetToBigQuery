/**
 * Loads the content of a Google Drive Spreadsheet into BigQuery
 * Based on:
 * - https://www.lunametrics.com/blog/2017/07/26/connect-google-analytics-data-tools-via-bigquery/
 * - https://developers.google.com/apps-script/advanced/bigquery
 * Edit by Wouter Nieuwerth, w.nieuwerth@adwise.nl
 * https://www.adwise.nl
 */
 
function loadSpreadsheet() {
  // Replace this value with the project ID listed in the Google
  // Cloud Platform project.
  var projectId = 'project-id-01234567890';
  // Create a dataset in the BigQuery UI (https://bigquery.cloud.google.com)
  // and enter its ID below.
  var datasetId = 'enterDatasetId';
  // Create a table OR let the script make it for you.
  // Enter its ID below.
  var tableId = 'enterTableId';

  // The URL of the Google Spreadsheet you wish to export to BigQuery:
  var url = 'https://docs.google.com/spreadsheets/d/enteryourspreadsheethere';
  // The name of the sheet in the Google Spreadsheet you wish to export to BigQuery:
  var sheetName = 'enterSheetName';

  // Create the table.
  var table = {
    tableReference: {
      projectId: projectId,
      datasetId: datasetId,
      tableId: tableId
    },
    // Details about schema can be found here: https://cloud.google.com/bigquery/docs/schemas
    // Enter a schema below:
    schema: {
      fields: [
        {name: 'date', type: 'DATE'},
        {name: 'company', type: 'STRING'},
        {name: 'spend_14_day', type: 'FLOAT'},
        {name: 'hi_score', type: 'FLOAT'},
        {name: 'budget_index', type: 'FLOAT'},
        {name: 'extension_index', type: 'FLOAT'},
        {name: 'settings_index', type: 'FLOAT'},
        {name: 'mobile_index', type: 'FLOAT'},
        {name: 'kw_ads_index', type: 'FLOAT'},
        {name: 'audience_index', type: 'FLOAT'}
      ]
    }
  };
  
  // the write disposition tells BigQuery what to do if this table
  // already exists
  // WRITE_TRUNCATE: If the table already exists, BigQuery overwrites the table data. 
  // WRITE_APPEND: If the table already exists, BigQuery appends the data to the table.
  // WRITE_EMPTY: If the table already exists and contains data, a 'duplicate' error is returned in the job result.
  var writeDispositionSetting = 'WRITE_APPEND';
  
  //------------------------------------------
  //No edits below this line needed
  
  // Create a new table if it doesn't exist yet.
  try {BigQuery.Tables.get(projectId, datasetId, tableId)}
  catch (error) {
    table = BigQuery.Tables.insert(table, projectId, datasetId);
    Logger.log('Table created: %s', table.id);
  }
  
  var file = SpreadsheetApp.openByUrl(url).getSheetByName(sheetName);
  // This represents ALL the data
  var rows = file.getDataRange().getValues();
  var rowsCSV = rows.join("\n");
  var blob = Utilities.newBlob(rowsCSV, "text/csv");
  var data = blob.setContentType('application/octet-stream');

  // Create the data upload job.
  var job = {
    configuration: {
      load: {
        destinationTable: {
          projectId: projectId,
          datasetId: datasetId,
          tableId: tableId
        },
        skipLeadingRows: 1,
        writeDisposition: writeDispositionSetting
      }
    }
  };
  
  // send the job to BigQuery so it will run your query
  var runJob = BigQuery.Jobs.insert(job, projectId, data);
  Logger.log(runJob.status);
  var jobId = runJob.jobReference.jobId
  Logger.log('jobId: ' + jobId);
  var status = BigQuery.Jobs.get(projectId, jobId);
  
  // wait for the query to finish running before you move on
  while (status.status.state === 'RUNNING') {
    Utilities.sleep(500);
    status = BigQuery.Jobs.get(projectId, jobId);
    Logger.log('Status: ' + status);
  }
  Logger.log('FINNISHED!');
}

