"""
approval_asana.py 
Created By: Alex Galvan
Program will notify once Creative Requests have been ordered.
"""
import asana
import logging
from pprint import pprint
logging.basicConfig(filename = 'asana_log.log',level = logging.INFO, format ='%(asctime)s:%(levelname)s:%(message)s')

# Construct an Asana Client
def main():
    #cred = open('creds.txt','r').read()
    cred = 'ASANA_CREDS'
    client = asana.Client.access_token(cred)
    me = client.users.me()
    # Asana GIDs
    assigned_tag = 'ASANA_TAG_GID'
    ordered_tag = 'ASANA_TAG_GID' 
    new_requests_project = 'ASANA_TAG_GID'

    #get Gdids from New Requests Project
    tasks_in_proj = client.tasks.get_tasks_for_project(new_requests_project, {'opt_fields': 'completed'})

    not_cmpl_tsk = []
    for task in tasks_in_proj:
        if task['completed'] == False:
            not_cmpl_tsk.append(task['gid'])

        #get task info for not completed taskS
    for tasks in not_cmpl_tsk:
        try:
            tags = str(client.tasks.get_task(tasks,{'opt_fields':'tags.name'})['tags'][0:])
            etas = (client.tasks.get_task(tasks,{'opt_fields':'custom_fields.text_value'})['custom_fields'][4]['text_value'])
            emails = (client.tasks.get_task(tasks,{'opt_fields':'custom_fields.text_value'})['custom_fields'][0]['text_value'])
            prject_name = (client.tasks.get_task(tasks,{'opt_fields':'name'})['name'])
            approvals = str(client.tasks.get_task(tasks)['custom_fields'][3]['enum_value']['name'])
 #GmailAPI
            if (('Ordered'not in tags) and etas != None) :
                client.tasks.add_tag_for_task(tasks,{"tag": ordered_tag})
                # Getting gmail to send ordered Email
                import smtplib
                smtp_object = smtplib.SMTP('smtp.gmail.com',587)
                smtp_object.ehlo()
                smtp_object.starttls()
                email = 'FROM_EMAIL'
                #gmcreds = open('gcred.txt','r').read()
                gmcreds = 'GMAIL_CRED'
                smtp_object.login(email,gmcreds)

                from_email_address = 'Alex Galvan'
                to_email_address = 'CCED_EMAIL',emails
                subject = 'Your Project "'+prject_name+'" has been ordered!'
                messege = 'Hello!'+'\n'+'Just wanted to let you know that your '+prject_name+\
                ' has been ordered!'+'\n'+'\n'+'The ETA for your request is: '+etas+'\n'+\
                'Feel free to reach out to me for any questions!'

                msg = 'Subject:' + subject + '\n' + messege
                smtp_object.sendmail(from_email_address,to_email_address,msg)
                logging.info('Email has been sent to: '+emails+'for "'+prject_name+'" '+'request Ordered Email')
            else:
                logging.info('Nothing needed to be sent')
        except:         
            logging.info('Program Crashed!')
        finally:
            pass

if __name__ =="__main__":
	main()
