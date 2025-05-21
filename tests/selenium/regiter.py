import time
from selenium import webdriver
from selenium.webdriver.common.by import By

# Abrir navegador y acceder a la página de login
driver = webdriver.Chrome()
driver.get("http://localhost:3001/login")
time.sleep(2)

# Hacer click en el enlace o botón de Registrarse
btn_register = driver.find_element(By.LINK_TEXT, "Regístrate")
btn_register.click()
time.sleep(3)

# Llenar los campos del formulario de registro
input_name = driver.find_element(By.ID, "name")
input_email = driver.find_element(By.ID, "email")
input_password = driver.find_element(By.ID, "password")

input_name.send_keys("Usuario de Prueba")
input_email.send_keys("prueba@example.com")
input_password.send_keys("12345678")

time.sleep(3)

btn_submit = driver.find_element(By.XPATH, "//button[contains(., 'Registrarse')]")
btn_submit.click()

time.sleep(10)

#driver.quit()