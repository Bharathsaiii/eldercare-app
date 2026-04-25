ElderCare AI Health Monitoring App

Project Overview
ElderCare is a mobile application built using React Native that monitors vital health parameters such as heart rate, SpO2, and temperature. It integrates with a backend system to analyze the data and provide risk levels, health insights, and recommendations.

Features

* Real-time heart rate monitoring (simulated)
* SpO2 tracking
* Temperature monitoring
* AI-based health analysis
* Notifications and alerts
* Medicine reminders
* Health reports (weekly and monthly)
* Patient profile management

Tech Stack
Frontend: React Native (Expo)
Backend: Flask (Python)
Storage: AsyncStorage
Charts: react-native-chart-kit
Notifications: expo-notifications

Prerequisites

1. Node.js
   Download from https://nodejs.org/
   Check installation:
   node -v
   npm -v

2. Expo CLI
   Install using:
   npm install -g expo-cli

3. Android Studio
   Download from https://developer.android.com/studio
   Install Android SDK and create an emulator (Pixel device recommended).

4. Python
   Download from https://www.python.org/
   Check installation:
   python --version

Project Setup

1. Clone the repository
   git clone https://github.com/YOUR_USERNAME/eldercare-app.git
   cd eldercare-app

2. Install dependencies
   npm install

Running the Frontend (Mobile App)
npx expo start

Then either:

* Press A to open the Android emulator
* Or scan the QR code using the Expo Go app on a mobile device

Running the Backend (AI Server)
Navigate to the backend folder:
cd backend

Install dependencies:
pip install -r requirements.txt

Run the server:
python app.py

The backend will run at:
http://127.0.0.1:8000

Important Configuration

When using an Android emulator, update the backend URL in the app:
const BASE_URL = "http://10.0.2.2:8000";

Notifications Setup
Install required package:
npx expo install expo-notifications

Charts Setup
Install required packages:
npm install react-native-chart-kit react-native-svg

Emulator Setup

* Open Android Studio
* Go to Device Manager
* Create a virtual device (Pixel recommended)
* Start the emulator

Sample API Request

POST /ai-analysis

Request body:
{
"hr": 98,
"spo2": 96,
"temp": 38.1
}

Notes

* The application currently uses simulated sensor data
* It can be extended to integrate with real IoT or wearable devices
* Best performance is observed on Android emulator

Developed By
Bharath
