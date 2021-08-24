        var token = 'FACEBOOK_TOKEN'

function getPostInsights(){
  //Function will get new posts and their metrics for that day 
  //Facebook graph API query => 1479418528982348/posts?fields=insights.metric(post_impressions,post_engaged_users,post_impressions_organic_unique,post_video_complete_views_organic),permalink_url,message,icon,shares,id,created_time&since=2021-01-01&until=2021-07-13
  
  var d = new Date();
  d.setDate(d.getDate()-1);//add or take away days 
  var date = Utilities.formatDate(d, "GMT", "yyyy-MM-dd");
 
  var url = 'https://graph.facebook.com/v11.0/1479418528982348/posts?fields=insights.metric(post_impressions%2Cpost_engaged_users%2Cpost_impressions_organic_unique%2Cpost_video_complete_views_organic)%2Cpermalink_url%2Cmessage%2Cicon%2Cshares%2Cid%2Ccreated_time&since='+ date + '&access_token=' + token;

// Fetch data from Facebook API
  var response = UrlFetchApp.fetch(url).getContentText();
  var json = JSON.parse(response);
  var ss = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  //Create header row.
  ss.getRange('A1').setValue("post_id");
  ss.getRange('B1').setValue("permalink");
  ss.getRange('C1').setValue("created_time");
  ss.getRange('D1').setValue("message");
  ss.getRange('E1').setValue("icon");
  ss.getRange('F1').setValue("post_engaged_users");
  ss.getRange('G1').setValue("post_impressions");
  ss.getRange('H1').setValue("post_total_reach");
  ss.getRange('I1').setValue("number_of_complete_views");

// Interating throgh data and setting values from JSON
  for (var i=0;i<json["data"].length;i++){
    var post_id = json["data"][i]["id"];
    var message = json["data"][i]["message"];
    var icon = json["data"][i]["icon"];
      if(icon.includes('video')){ // Converting link to string type of post
      var type = 'Video';
      }
      else if (icon.includes('photo')) {
        var type = 'Photo';
      }
      else if (icon.includes('sharedVideo')){
        var type = 'Shared Video'
      }
      else if (icon.includes('status')){
        var type = 'Status';
      }
      else if(icon.includes('link')){
        var type = 'Link';
      }
    var permalink = json["data"][i]["permalink_url"];
    var post_engaged_user_value = json["data"][i]["insights"]["data"][1]["values"][0]["value"];
    var post_impressions = json["data"][i]["insights"]["data"][0]["values"][0]["value"];
    var created_time = json["data"][i]["created_time"];
      var date_created = new Date(created_time)
    var reach = json["data"][i]["insights"]["data"][2]["values"][0]["value"];
    var video_complete_view = json["data"][i]["insights"]["data"][3]["values"][0]["value"];

//Spreadsheet writing
    var startRow = ss.getLastRow()+1
    ss.getRange(startRow,1).setValue(post_id);
    ss.getRange(startRow,2).setValue(permalink);
    ss.getRange(startRow,3).setValue(date_created);
    ss.getRange(startRow,4).setValue(message);
    ss.getRange(startRow,5).setValue(type);
    ss.getRange(startRow,6).setValue(post_engaged_user_value);
    ss.getRange(startRow,7).setValue(post_impressions);
    ss.getRange(startRow,8).setValue(reach);
    ss.getRange(startRow,9).setValue(video_complete_view);
  }
}

function update(){
  //this function will update the post metrics of the last 8 posts on the sheet 
  //Facebook graph API query => Post-ID?fields=icon,message,comments,permalink_url,insights.metric(post_impressions,post_engaged_users,post_impressions_organic_unique,post_video_complete_views_organic)

var ss = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  var startRow = ss.getLastRow()-8; // First row of data to process
  var numRows = ss.getLastRow(); // Number of rows to process
  var dataRange = ss.getRange(startRow, 1, numRows, ss.getLastColumn()); // Get the range of cells being used
  var data = dataRange.getValues(); // Get values for each row in the Range.

  for(i=1;i<data.length;i++){
   var dataRange = ss.getRange(i,8).getValue();
    var row = data[i];
    // Get info using a aray 
    var post_id = row[0];
/*    var permalink = row[1];
    var created_time = row[2];
    var message = row[3];
    var icon = row[4];
    var post_engaged_users =  row[5];
    var post_impressions =  row[6];
    var post_total_reach =  row[7];
    var number_of_complete_views	 = row[8];
*/
    if (post_id != ""){
      var url = "https://graph.facebook.com/v11.0/"+post_id+"?fields=icon%2Cmessage%2Ccomments%2Cpermalink_url%2Cinsights.metric(post_impressions%2Cpost_engaged_users%2Cpost_impressions_organic_unique%2Cpost_video_complete_views_organic)&access_token="+token;

// Fetch data from Facebook API
      var response = UrlFetchApp.fetch(url).getContentText();
      var json = JSON.parse(response);

      //Updated JSON Facebook metrics
      var post_impressions_update = json["insights"]["data"][0]["values"][0]["value"]; //Post impressions
      var post_engaged_users_update = json["insights"]["data"][1]["values"][0]["value"]; //Post engagement
      var post_reach_update = json["insights"]["data"][2]["values"][0]["value"]; //Post reach
      var video_complete_view_update = json["insights"]["data"][3]["values"][0]["value"]; //video completed view

      ss.getRange(startRow+i,7,1,1).setValue(post_impressions_update)//update post impressions
      ss.getRange(startRow+i,6,1,1).setValue(post_engaged_users_update)//update post engagement
      ss.getRange(startRow+i,8,1,1).setValue(post_reach_update)//update post reach
      ss.getRange(startRow+i,9,1,1).setValue(video_complete_view_update)//update post video complete view update
    }
  }
}

function getPageInsights (){
  //This function will make an API Call to request the lifetime page follows for each day
  //Facebook graph api query => 1479418528982348/insights/page_fans

  var url = 'https://graph.facebook.com/v11.0/1479418528982348/insights/page_fans?access_token='+token;
  var response = UrlFetchApp.fetch(url).getContentText();
  var json = JSON.parse(response)

  //get data from JSON
  var page_fans = json['data'][0]['values'][0]['value'];

  //open Spreadsheet and set header row 
  var ss = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('page_insights')
  ss.getRange('A1').setValue('Date')
  ss.getRange('B1').setValue('page_follows')

  //get spreadsheet range
  var startRow = ss.getLastRow()+1; // First row of data to process

  ss.getRange(startRow,1).setValue(new Date());
  ss.getRange(startRow,2).setValue(page_fans)
}
