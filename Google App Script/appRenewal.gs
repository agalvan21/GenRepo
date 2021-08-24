function appReminderGeoCreativeArts() {

  var ss = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet(); //opens spreadsheet
  
//clean up sheet  
 ss.getRange('B1').setFormula('=TODAY()')//set cell b1 formula to =today
 ss.getRange('H3:H').setFormula('=if(G3="","", DATEDIF(G3,$B$1,"D"))');//Date Difference formula
 ss.getRange('I3:I').setFormula('=If(G3="","",(H3/730))');//divide by 730
 ss.getRange('K3:K').setFormula('=If(F3="",0.002,(J3/730))');//Datedif not mod 1 if F3 is blank
 ss.getRange('J3:J').setFormula('=if(G3="","", DATEDIF(F3,$B$1,"D"))')//DateDiff min safe
 ss.getRange('N3:N').setFormula('=if(M3="N","",if(G3="","",if(AND(left($B$1,5)+3=left(L3,5)+0,MOD(K3,1)=0,MOD(I3,1)=0),"MinSafe/Bday/renewal",if(and(left($B$1,5)+3=left(L3,5)+0,MOD(K3,1)=0),"Birthday/MinSafe",if(and(left($B$1,5)+3=left(L3,5)+0,MOD(I3,1)=0),"Birthday/Renewal",if(and(MOD(I3,1)=0,MOD(K3,1)=0),"MinSafe/Renewal",if(H3=0,"", if( MOD(I3,1)=0,"Renewal",if(left($B$1,5)+3=left(L3,5)+0,"Birthday",if(K3="","",if(MOD(K3,1)=0,"MinSafe","")))))))))))');
 ss.getRange('A3:B').setBackground('#66697a'); //backround color name cells
 ss.getRange('A1:L').setHorizontalAlignment('center');//set alignemnt for all of sheet
 ss.getRange('C3:L').setFontColor('#666666');//info cells font color 
 ss.getRange('A3:B').setFontColor('#666666');// name cells text color
 ss.getRange('A3:L').setFontFamily('arial'); //set font of Data
 ss.getRange('A3:L').setFontSize(10);// set info font to size 10
 ss.getRange('A1:L2').setFontFamily('Open Sans'); //set font of header rows
 ss.getRange('A1:L1').setFontSize(10); //set font size of header row
 ss.getRange('A2:L2').setFontSize(11); // set font of second header
 ss.getRange('C3:M').setBackground('#f3f3f3');//Set data background color
 ss.getRange('A3:B').setBackground('#eaeaea'); //set first last name color background
 ss.getRange('N3:N').setBackground('#d9d9d9'); //set Action Col color background
 
 //Data Range
  var startRow = 1; // First row of data to process
  var numRows = ss.getLastRow()+1; // Number of rows to process
  var dataRange = ss.getRange(startRow, 1, numRows, ss.getLastColumn()); // Get the range of cells being used
  var data = dataRange.getValues(); // Get values for each row in the Range.

  for(i=1;i<data.length;i++){
    var dataRange = ss.getRange(i,14).getValue();
    var row = data[i-1];  //makes I start at 0
  
    // Get info using a aray 
    var first = row[0];
    var last = row[1];
    var ministry = row[2];
    var phone = row[3];
    var email = row[4];
    var bday =  row[11];
    var birthday = Utilities.formatDate(new Date(bday),'GMT','M/dd'); // Formating date to mm/dd
    var minSafe = row[5];
    var minSafeDate = Utilities.formatDate(new Date(minSafe),'GMT','M/dd/yyyy'); // Formating date to mm/dd
    var link = 'https://docs.google.com/forms/d/e/1FAIpQLSeXNwjOiuDBbxPb4fPnXxLjjLZr4I-mncSEHxpj3Yi-D-3MNA/viewform';
    
    //if cell says renewal send renewal email
    if(dataRange === 'Renewal'){
      var recipient = ss.getRange('I1').getValue();
      var subject = 'Southland Volunteer Application Renewal';
      var body = "Voluneer Email: "+email+"<p>"
      +"Hey, "+first+'!'+"<br/>"+"Thank you for volunteering at Southland! "
      +"As a part of our process, we ask volunteers to renew their volunteer app every two years. "+"<br/>"
      + "here is the "+ link + "<br/>" + " Let me know if you have any questions!" +"<p>"+"Thanks!";
      var link2 = {htmlBody: body.replace(link, '<a href= "https://docs.google.com/forms/d/e/1FAIpQLSeXNwjOiuDBbxPb4fPnXxLjjLZr4I-mncSEHxpj3Yi-D-3MNA/viewform" >Southland Volunteer Renewal Application</a>')};
      MailApp.sendEmail(recipient, subject, body,link2);
    }  
      
      //if cell says birthday send birthday email 
      if(dataRange === 'Birthday'){
          var recipient = ss.getRange('I1').getValue();
          var bsubject = 'Volunteer Birthday Coming up';
          var body = 'First: ' + first +'\n'+'Last: ' + last +'\n'+ 'Ministry: ' + ministry+'\n'+'Phone: ' + phone +'\n'+ 'Email: '+email + '\n'+ 'Birthday: '+ birthday;
        MailApp.sendEmail(recipient, bsubject, body);
      }  
        
          // if cell says birthday/renewal send email
        if(dataRange === 'Birthday/Renewal'){
          var recipient = ss.getRange('I1').getValue();
          var brsubject = 'Volunteer Birthday/ Application Renewal';
          var body = 'First: ' + first +"<br/>"+'Last: ' + last +'<br/>'+ 'Ministry: ' + ministry +'<br/>'+'Phone: ' + phone +'<br/>'+ 'Email: '+ email + '<br/>'+ 'Birthday: '+birthday + '<br/>' + 'Application Link:' + link;
          var link2 = {htmlBody: body.replace(link, '<a href= "https://docs.google.com/forms/d/e/1FAIpQLSeXNwjOiuDBbxPb4fPnXxLjjLZr4I-mncSEHxpj3Yi-D-3MNA/viewform" >Southland Volunteer Renewal Application</a>')};
        MailApp.sendEmail(recipient, brsubject, body,link2);
       }
            //if cell says minSafe send minsafe email 
      if(dataRange === 'MinSafe'){
          var recipient = ss.getRange('I1').getValue();
          var bsubject = 'Volunteer MinSafe Update';
          var body = 'First: ' + first +'\n'+'Last: ' + last +'\n'+ 'Ministry: ' + ministry+'\n'+'Phone: ' + phone +'\n'+ 'Email: '+email + '\n'+ 'Ministry Safe Date: '+ minSafeDate;
        MailApp.sendEmail(recipient, bsubject, body);
      } 
      // if cells says MinSafe/Renewal
      if(dataRange === 'MinSafe/Renewal'){
          var recipient = ss.getRange('I1').getValue();
          var bsubject = 'Volunteer MinSafe/Volunteer app renewal';
          var body = 'First: ' + first +'\n'+'Last: ' + last +'\n'+ 'Ministry: ' + ministry+'\n'+'Phone: ' + phone +'\n'+ 'Email: '+email + '\n'+ 'Ministry Safe Date: '+ minSafeDate;
        MailApp.sendEmail(recipient, bsubject, body);
      }        
      //if cell says MinSafe/Birthday
      if(dataRange === 'Birthday/MinSafe'){
          var recipient = ss.getRange('I1').getValue();
          var bsubject = 'Volunteer Ministry Safe traning renewal and Volunteer Birthday Coming up!';
          var body = 'First: ' + first +'\n'+'Last: ' + last +'\n'+ 'Ministry: ' + ministry+'\n'+'Phone: ' + phone +'\n'+ 'Email: '+email + '\n'+ 'Ministry Safe Date: '+ minSafeDate + '\n'+ 'Birthday: '+birthday;
        MailApp.sendEmail(recipient, bsubject, body);
      }    
      //if cell says MinSafe/Birthday/App renewal
      if(dataRange === 'MinSafe/Bday/renewal'){
          var recipient = ss.getRange('I1').getValue();
          var bsubject = 'MinSafe, vol app and vol birthday coming up!';
          var body = 'First: ' + first +'\n'+'Last: ' + last +'\n'+ 'Ministry: ' + ministry+'\n'+'Phone: ' + phone +'\n'+ 'Email: '+email + '\n'+ 'Ministry Safe Date: '+ minSafeDate; + '\n'+'Birthday: '+birthday
        MailApp.sendEmail(recipient, bsubject, body);
      }     
   }    
}       
