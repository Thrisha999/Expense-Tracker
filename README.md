# 💸 Expense Tracker App (Splitwise Style)

This is a Splitwise-style Expense Tracker application built using **React Native with Expo** as part of the **Kapidron Internship Hiring Process – Round 2**.

---

## 📱 Features

- 🚀 Built with **React Native (Expo)** for cross-platform compatibility
- ⚙️ **Zustand** state management for simple, scalable state logic
- 💾 **Persistent storage** using AsyncStorage (data stays after app close)
- 📊 Create and join **groups** to manage shared expenses
- 🧾 Add expenses with:
  - Title
  - Description
  - Category (with icons)
  - Amount
  - Timestamp
  - Split type: Equally or Custom
  - Payer information
- 📷 Add **images or icons** to groups and expenses
- 📃 View **group-wise expense summaries**
- 📈 View **total amount owed/received across all groups**
- 👥 **View all members in a group** with profile icons
- 🔐 (Bonus) **Firebase Google Authentication** for login

---

## 🗂️ Folder Structure

/SplitwiseApp ├── App.js # Entry point 
              ├── /assets # Images and icons │ ├── group-placeholder.png │ └── icons/ ├── /src │ ├── /components # Reusable UI components │ │ ├── GroupCard.js │ │ └── ExpenseItem.js │ ├── /screens # App screens │ │ ├── HomeScreen.js │ │ ├── CreateGroupScreen.js │ │ ├── GroupDetailsScreen.js │ │ └── AddExpenseScreen.js │ ├── /store # Zustand store │ │ └── useExpenseStore.js │ ├── /utils # Helper functions │ │ ├── calculations.js │ │ └── formatters.js │ └── /config # Firebase config (if used) │ └── firebaseConfig.js ├── package.json └── app.json

## 🧠 Technologies Used

- React Native (Expo)
- Zustand for state management
- AsyncStorage for persistence
- React Navigation
- Firebase Authentication (optional bonus)
- React Native Paper / Expo Icons / Image Picker

---

## 📌 Bonus Features Implemented

- ✅ Firebase Google Authentication
- ✅ View all members in a group
- ✅ Total summary of amount owed/received
- ✅ Added icons and images on every screen

---

## 📬 Submission Info

This app is developed as part of the **Kapidron Internship – Round 2**.  
## 🙋‍♀️ Developer

**Akepati Thrisaileswari**  
Frontend & Backend Developer | MERN | React Native  
📧 Email: thrisaileswariakepati@gmail.com  
🔗 [GitHub](https://github.com/Thrisha999) | [LinkedIn](https://www.linkedin.com/in/thrisaileswari-akepati)

---

## 📄 License

This project is for assessment and educational purposes only.

