"""
approval_asana.py 
Created By: Alex Galvan
Program will get last note and place it in a custom flield
"""
import asana
import logging
from pprint import pprint as pp
logging.basicConfig(filename = 'asana_log.log',level = logging.INFO, format ='%(asctime)s:%(levelname)s:%(message)s')
cred = 'ASANA_CREDS'
client = asana.Client.access_token(cred)
me = client.users.me()
def get_tsk_stories(task_gid):
    #returns last comments added resource_subtype': 'comment_added'
    task_gid = task_gid
    sub_text_type = list(client.stories.get_stories_for_task(task_gid))
    comments_added = []
    for comment in sub_text_type:
        if comment['resource_subtype'] == 'comment_added':
            comments_added.append(comment)
    for comment in range(0,len(comments_added)):
        all_comments = list(comments_added)
    return(all_comments[-1]['text'])
def get_inc_tsks():
#Returns a list of all incompleted task gids called incompleted_tasks
    project_gid = 'PROJECT_GID'  
    tasks_in_proj = list(client.tasks.get_tasks_for_project(project_gid, {'opt_fields': 'completed'}))
    task_gid = []
    for task in tasks_in_proj:
        if task['completed'] == False:
            task_gid.append(task['gid'])
    return(task_gid)
def main():
    for tsk_gid in get_inc_tsks():
        try:
            client.tasks.update_task(tsk_gid,{'custom_fields':{'1201021503995606':get_tsk_stories(tsk_gid)}})
        except:
            pass
if __name__ =="__main__":
	main()

