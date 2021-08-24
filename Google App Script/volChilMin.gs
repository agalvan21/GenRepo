function appReminderLexChildren() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var len = ss.getNumSheets()-1

    for (var i=0; i<len; i++){
      var sheets = ss.getSheets()[i]; // Creating a variable that includes all tabs in the spreadsheet
      sheets.getRange('Q3:Q').setFormula('=IFS(P3="N","",AND(DATEDIF(G3,$B$1,"Y")=18,LEFT(G3,5)-3=LEFT($B$1,5)-0,MOD(K3,1)=0),"18app,Birthday,Renewal",AND(LEFT(G3,5)-3=LEFT($B$1,5)-0,MOD(K3,1)=0),"Birthday/Renewal",DATEDIF(G3,$B$1,"D")=6572,"1st New App",LEFT(G3,5)-3=LEFT($B$1,5)-0,"Birthday",MOD(K3,1)=0,"Renewal",TRUE,"")');
      sheets.getRange('J3:J').setFormula('=if(I3="","", DATEDIF(I3,$B$1,"D"))'); //date difference formula in row I
      sheets.getRange('K3:K').setFormula('=IF(I3="",0.1,(J3/730))'); // dividing date difference by two years to get a remainder if not then put a remainder
      sheets.getRange('B1').setFormula('=TODAY()'); //Set cell B1 to current Date
      sheets.getRange('L3:L').setFormula('=if(A3="","",$E$1)'); // Get Staff Email for Query
            
        //Formating all sheets
          sheets.getRange('A1:Q').setBackground('#3c78d8');//Set first two row background color
          sheets.getRange('C3:P').setBackground('#f3f3f3');//Set data background color
          sheets.getRange('A3:B').setBackground('#66697a'); //backround color name cells
          sheets.getRange('A1:P1').setFontSize(10); //set font size of header row
          sheets.getRange('A2:2').setFontSize(11); // set font of second header
          sheets.getRange('A3:Q').setFontSize(10);// set info font to size 10
          sheets.getRange('A1:Q').setHorizontalAlignment('center');//set alignemnt for all of sheet
          sheets.getRange('A1:Q').setFontFamily('Open Sans'); //set font of header rows
          sheets.getRange('A3:B').setFontColor('#ffffff');// name cells text color
          sheets.getRange('C3:P').setFontColor('#666666');//info cells font color
          sheets.getRange('Q3:Q').setBackgroundColor('#d7e4f9');
         
     }
          //Children's query Processing
          var ssChildren = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Children\'s Volunteers');
          
            //Data Range
            var startRow = 1; // First row of data to process
            var numRows = ssChildren.getLastRow(); // Number of rows to process
            var dataRange = ssChildren.getRange(startRow, 1, numRows, ssChildren.getLastColumn()); // Get the range of cells being used
            var data = dataRange.getValues(); // Get values for each row in the Range.
          
            for(i=1;i<data.length;i++){
              var dataRange = ssChildren.getRange(i,17).getValue();
              var row = data[i];  //makes I start at 0
              
              // Get Info in array
              
                var first = row[0];
                var last = row[1];
                var ministry = row[2];
                var phone = row[3];
                var email = row[4];
                var address = row[5];
                var bday = row[6];
                var birthday = Utilities.formatDate(new Date(bday),'GMT','M/d'); // Formating date to mm/dd
                var note = row[7];
                var staffEmail = row[11];
                var action = row [16];
                var link = 'https://docs.google.com/forms/d/e/1FAIpQLSeXNwjOiuDBbxPb4fPnXxLjjLZr4I-mncSEHxpj3Yi-D-3MNA/viewform';

                // Renewaul email 
                if(action === 'Renewal'){
                  var recipient = staffEmail;
                  var subject = 'Volunteer Background Check Renewal';
                  var body = "Voluneer Email: "+email+"<p>"+"Hey, "+first+'!'+"<br/>"+"Thank you for volunteering at Southland! "+"As a part of our process, we ask volunteers to renew their volunteer app every two years. "+"<br/>"+ "here is the "+ link + "<br/>" + " Let me know if you have any questions!" +"<p>"+"Thanks!";
                  var link2 = {htmlBody: body.replace(link,'<a href= "https://docs.google.com/forms/d/e/1FAIpQLSeXNwjOiuDBbxPb4fPnXxLjjLZr4I-mncSEHxpj3Yi-D-3MNA/viewform" >Southland Volunteer Renewal Application</a>')};
                  MailApp.sendEmail(recipient, subject, body,link2);
                 }
                  // if cell says birthday/renewal send email
                 if(action === 'Birthday/Renewal'){
                   var recipient = staffEmail;
                   var brsubject = 'Volunteer Birthday/ Volunteer Background Check Renewal';
                   var body = 'First: ' + first +"<br/>"+'Last: ' + last +'<br/>'+ 'Ministry: ' + ministry +'<br/>'+'Phone: ' + phone +'<br/>'+ 'Email: '+ email +'<br/>'+'Address: '+address+'<br/>'+ 'Birthday: '+birthday + '<br/>' + 'Application Link: ' + link;
                   var link2 = {htmlBody: body.replace(link,'<a href= "https://docs.google.com/forms/d/e/1FAIpQLSeXNwjOiuDBbxPb4fPnXxLjjLZr4I-mncSEHxpj3Yi-D-3MNA/viewform" >Southland Volunteer Renewal Application</a>')};
                   MailApp.sendEmail(recipient, brsubject, body,link2);
                 }
                 //if cell says birthday send birthday email 
                 if(action === 'Birthday'){
                    var recipient = staffEmail
                    var bsubject = 'Volunteer Birthday Coming up';
                    var body = 'First: ' + first +'\n'+'Last: ' + last +'\n'+ 'Ministry: ' + ministry+'\n'+'Phone: ' + phone +'\n'+ 'Email: '+email+'\n'+'Address: '+address + '\n'+ 'Birthday: '+ birthday;
                    MailApp.sendEmail(recipient, bsubject, body);
                  } 
                  // If cell says 18app,birthday,renwal send birthday notification and new application
                 if(action === '18app,Birthday,Renewal'){
                    var recipient = staffEmail
                    var bsubject = 'Volunteer 18 Year Birthday & Needs Adult App';
                    var body = 'Volunteer\'s 18th birthday coming up! '+'<br/>'+'First: ' + first +'<br/>'+'Last: ' + last +'<br/>'+ 'Ministry: ' + ministry+'<br/>'+'Phone: ' + phone +'<br/>'+ 'Email: '+email + '<br/>'+'Address: '+address+'<br/>'+'Birthday: '+ birthday+'<br/>'+link
                    var link2 = {htmlBody: body.replace(link,'<a href= "https://docs.google.com/a/southlandchristian.org/forms/d/e/1FAIpQLScUjNvuPn6JJ3TqM_Vt5Nx2BeWmhQq1icen7vQkqkIaOqJQfA/viewform" >Southland Volunteer Application</a>')};
                    MailApp.sendEmail(recipient, bsubject, body,link2);
                  }  
                  // if cell says 1st new app, send the notification vol needs to fill out adult app for the first time. 
                  if(action === '1st New App'){
                    var recipient = staffEmail
                    var bsubject = 'Volunteer Needs first Adult App';
                    var body = 'Volunteer needs first adult Application'+'<br/>'+'First: ' + first +'<br/>'+'Last: ' + last +'<br/>'+ 'Ministry: ' + ministry+'<br/>'+'Phone: ' + phone +'<br/>'+ 'Email: '+email + '<br/>'+'Address: '+address+'<br/>'+ 'Birthday: '+ birthday + '<br/>'+link
                    var link2 = {htmlBody: body.replace(link,'<a href= "https://docs.google.com/a/southlandchristian.org/forms/d/e/1FAIpQLScUjNvuPn6JJ3TqM_Vt5Nx2BeWmhQq1icen7vQkqkIaOqJQfA/viewform" >Southland Volunteer Application</a>')};
                    MailApp.sendEmail(recipient, bsubject, body,link2);
                  }    
            }  
}
