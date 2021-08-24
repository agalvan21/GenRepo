from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from time import sleep
import time
import schedule

path1 = 'LOCAL_PATH_TO_CHROME_DRIVER'
class CycleBot:
	def __init__(self, username, pw):
		self.driver = webdriver.Chrome(path1)
		self.driver.get('https://members.cyclebar.com/auth/login')
		self.driver.fullscreen_window()
		sleep(1)
		self.driver.find_element_by_xpath('/html/body/div[2]/div[2]/div/form/div[3]/input')\
		.send_keys(username)
		self.driver.find_element_by_xpath('/html/body/div[2]/div[2]/div/form/div[4]/input')\
		.send_keys(pw)
#sign in button
		self.driver.find_element_by_xpath('/html/body/div[2]/div[2]/div/form/div[5]/div[1]/div/button')\
		.click()
#Book a bike button
		sleep(3)
		self.driver.find_element_by_xpath('/html/body/div[2]/div[1]/header/div[3]/nav/a[2]')\
		.click()
#Next Week Button
		sleep(2)
		self.driver.find_element_by_xpath('/html/body/div[2]/div[2]/div[4]/div[1]/div[3]/a')\
		.click()
		sleep(2)
#cookies
		self.driver.find_element_by_xpath('/html/body/div[1]/div/div[2]/a')\
		.click()
		sleep(2)
#reserve button
		self.driver.find_element_by_xpath('/html/body/div[2]/div[2]/div[4]/div[3]/table/tbody/tr[10]/td[5]')\
		.click()
#accept covid
		sleep(2)
		self.driver.find_element_by_xpath('/html/body/div[2]/div[2]/div/div/div/div/div/div/div/div/button[1]')\
		.click()
		sleep(2)
#select Seat 40
		try:
			self.driver.find_element_by_xpath('/html/body/div[2]/div[2]/div/div/div/div[2]/table/tbody/tr[9]/td[10]')\
			.click()
		except:
			pass
#Try Seat 38
		try:
			self.driver.find_element_by_xpath('/html/body/div[2]/div[2]/div/div/div/div[2]/table/tbody/tr[9]/td[12]')\
			.click()
		except:
			pass
#try Seat 36
		try:
			self.driver.find_element_by_xpath('/html/body/div[2]/div[2]/div/div/div/div[2]/table/tbody/tr[8]/td[14]')\
			.click()	
		except:
			pass	
		sleep(2)
#select this bike button at the bottom of page
		sleep(2)
		self.driver.find_element_by_xpath('/html/body/div[2]/div[2]/div/div/div/div[2]/div[2]/button')\
		.click()
		sleep(2)
	#accept seat the last button
		self.driver.find_element_by_xpath('/html/body/div[2]/div[2]/div/div/div/div/div/div/div/div[2]/button')\
		.click() 
		sleep(2)
		self.driver.quit()
schedule.every().tuesday.at('22:05').do(CycleBot,'LOGIN_EMAIL','LOGIN_PW')
while True:
	schedule.run_pending()
	time.sleep(1)





