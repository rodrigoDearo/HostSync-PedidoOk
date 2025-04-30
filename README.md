# 🚀 HostSync - PedidoOk

🔹 Effortless Integration: Seamlessly syncs your Host system with PedidoOk, ensuring accurate and up-to-date records of products, customers, and sales.

🔹 Optimized Performance: Handles large amounts of data efficiently while minimizing server load.

🔹 Secure and Reliable: Built with robust error handling and logging to maintain data integrity.

## 📌 Overview

# <img width="485" alt="Screenshot_2" src="https://github.com/user-attachments/assets/449f7110-8c2f-44a0-ae8b-347cd10f4bfc" />

HostSync - PedidoOk is an integration software between the Host system and the PedidoOk system, synchronizing products, customers, and sales. This documentation provides essential information for installation, configuration, and troubleshooting.

⚠️ This is a private software. To use it, you must purchase a license. Upon activation, an .env file containing the necessary access keys will be provided.

## 🛠 Installation

- The software includes an executable installer that automates the installation process.

- No additional dependencies are required, as long as it is installed on the database server machine running Host.

## ⚙️ Configuration

### 🔹 Host

- The path to the HOST.FDB database must be defined, usually C:\TSD\Host.

### 🔹 PedidoOk

1. Access the PedidoOk software.

2. In the menu, select "Integrations" > "Host" > "Configure Integration".

3. Retrieve the token and insert it into the integrator.

## 🔄 Execution Cycle

1. Cleaning up old error records.

2. Creating tables and triggers in the Host database.

3. Synchronizing products and customers.

4. 10-minute timeout for optimization.

5. Importing sales from PedidoOk.

6. Monitoring notifications and making adjustments as needed.

7. Return to the 10-minute timeout

## 🔍 Synchronized Data

### 🛒 Products

ID, Name, Category, Brand, Stock, Sale Price, Cost, Barcode, etc.

### 👥 Customers

ID, Name, Phone, Full Address, CNPJ/CPF, etc.

### 📦 Sales

ID, Date, Final Value, Status, Associated Customer, Sale Items.

## 📁 Logs and Databases

📍 Files stored at:

```{disk}:\Users\{user}\AppData\Roaming\hostsync-pedidook\ConfigFiles```

📝 Logs help identify issues.

### 🚨 Error Diagnosis

- ⚠️ The errorsDB.json file stores failed synchronization requests.

- 📂 If an error occurs, check the auxiliary JSON files: products.json, customers.json, sales.json.

## 🏗️ Building the Application

To package the application, simply clone the repository and run the following command:

```npm run build```

This will generate the necessary executable files for deployment.

## 🆘 Support

- ❌ If the error is operational (e.g., inconsistent data in Host or PedidoOk), adjust the records.

- ✅ If there is an error in the integrator, run it via cmd for debugging:

```cd "{disk}\Users\{user}\AppData\Local\Programs\hostsync-pedidook"```

```HostSync-PedOk```

- 💡 If a critical error is found, contact the developer with the attached logs.

## Contributions

This project was developed on demand for a partner company and is being made available solely for technical review purposes.

**External contributions are not accepted.**

Additionally, the repository **does not include the environment variables (.env)** required for the full operation of the application, due to security and privacy concerns.

Thank you for your understanding.

## Repository Status

📦 This repository has been archived and is no longer actively maintained.  
It remains available for reference and historical purposes only.


## Built With

* ![Electron](https://img.shields.io/badge/electron-%2347848F.svg?style=for-the-badge&logo=electron&logoColor=white)
* ![Electron Builder](https://img.shields.io/badge/electron--builder-%23007ACC.svg?style=for-the-badge&logo=appveyor&logoColor=white)
* ![Axios](https://img.shields.io/badge/axios-%23323330.svg?style=for-the-badge&logo=axios&logoColor=white)
* ![Dotenv](https://img.shields.io/badge/dotenv-%23008080.svg?style=for-the-badge&logo=dotenv&logoColor=white)
* ![FS](https://img.shields.io/badge/fs-%23000000.svg?style=for-the-badge&logo=folder&logoColor=white)
* ![Node Firebird](https://img.shields.io/badge/node--firebird-%23FF5733.svg?style=for-the-badge&logo=firebird&logoColor=white)

## Acknowledgments

* [Electron](https://www.electronjs.org/)
* [Electron Builder](https://www.electron.build/)
* [Axios](https://github.com/axios/axios)
* [Dotenv](https://github.com/motdotla/dotenv)
* [FS (File System)](https://nodejs.org/api/fs.html)
* [Node Firebird](https://github.com/xdenser/node-firebird)


### ✍️ Autor: Rodrigo Dearo - 📅 2025
