import time
from selenium import webdriver
from selenium.webdriver.common.by import By

# Abrir navegador y acceder a la página de login
driver = webdriver.Chrome()
driver.get("http://localhost:3001/login")
time.sleep(2)

input_email = driver.find_element(By.ID, "email")
input_password = driver.find_element(By.ID, "password")


input_email.send_keys("veritegas@gmail.com")
input_password.send_keys("Contrasena123!!")

time.sleep(3)



btn_submit = driver.find_element(By.XPATH, "//button[contains(., 'Iniciar Sesión')]")
btn_submit.click()
time.sleep(3)