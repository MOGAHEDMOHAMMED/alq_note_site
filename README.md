# Dawin (دوّن) - Note Taking App

## About The Project
Dawin is a fast, responsive, and intuitive note-taking application built with Flutter.

This project was built focusing on clean architecture using **Provider** for state management and **SharedPreferences** for local data storage, serving as a solid and practical foundation for building scalable Flutter applications.

---

## Key Features
* **State Management:** Smooth UI updates and business logic separation using `Provider`.
* **Authentication:** Secure Email/Password and Google Sign-In powered by Firebase Auth.
* **Real-time Synchronization:** Seamless CRUD operations (Create, Read, Update, Delete) with Cloud Firestore.
* **Local Storage:** Fast local storage for user preferences (like theme and language) using `SharedPreferences`.
* **Localization:** Built-in multi-language support (Arabic & English).
* **Theming:** Dynamic Light and Dark mode switching.
* **Categorization:** Organize notes by custom categories and colors.
* **Archive & Trash:** Safely archive notes or move them to a recoverable deleted items list.

---

## Getting Started

Follow these instructions to set up the project locally on your machine.

### Prerequisites
* Flutter SDK (Latest stable version)
* A Firebase Account (Firebase Console)
* A Firebase Project


### 1. Installation
Clone the repository and install the required packages:
```bash
git clone https://github.com/MOGAHEDMOHAMMED/notes_app.git
cd notes_app
flutter pub get
```
### 2. Firebase Setup
This project requires a connection to your own Firebase project.

#### a- Install the FlutterFire CLI if you haven't already:
```bash
dart pub global activate flutterfire_cli
```
#### b- Run the configuration command at the root of your project:
```bash
flutterfire configure
```
#### c- Go to the Firebase Console (Console Project):
  - Authentication: Enable Email/Password and Google providers.
  - Firestore Database: Create a database and set the rules to allow read/write for authenticated users (or start in test mode).
  - Project Settings: Add your SHA-1 fingerprint to your Android app settings to enable Google Sign-In.
### 3. Generate App Icons
To apply the custom app icons configured in flutter_launcher_icons.yaml, run:

```bash
dart run flutter_launcher_icons
```
### 4. Generate Native Splash Screen
  To apply the native splash screen configured in flutter_native_splash.yaml, run:

```bash
dart run flutter_native_splash:create
```
### 5. Run the App
You are all set! Run the application on your preferred emulator or physical device:
```bash
flutter run
```
