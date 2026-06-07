🇮🇳 Indian Recipe Explorer (CSV-Powered Full-Stack App)

Developed by: Swapnil Dhotre

This project demonstrates a functional, full-stack application built using React for the frontend and Node.js/Express for the backend. It reads recipe data from a local CSV file, proving that robust applications can be built without relying on external, key-protected APIs.

🎯 Project Goals and Features

The application was designed to meet the following requirements:
Recipe Browsing: Display a list of Indian recipes loaded from a custom data source.
Search Functionality: Allow users to search recipes by title or ingredients.
Favorites Persistence: Allow users to mark recipes as favorites (data stored in the Express server's memory).
Modular Architecture: Use modern React hooks and structure for clean separation of logic and UI.

⚙️ Technology Stack
| **Component**              | **Technology**                         |**Role**                          
|  ----------------------------------------------------------------------------------------------------------------------------------------------|    
| **Frontend**               | ReactJS (Vite)                         | Handles the user interface, component                                 | 
|                            |                                        |   rendering, and managing application state.                          |
______________________________________________________________________________________________________________________________________________|    |                                                                                                                                             |   
| **Styling**                | Tailwind CSS                           | Utility-first CSS framework for rapid, responsive                     |
|                            |                                        |   styling.                                                            |  
|_____________________________________________________________________________________________________________________________________________|
| **Backend**                | Node.js / Express.js                   | Provides the API endpoints, handles routing, and processes business   |
|                            |                                        |   logic.                                                              | 
|_____________________________________________________________________________________________________________________________________________|
| **Database / Data Source** | Local CSV File                         | The primary data source, loaded into memory by the server on          |
|                            | (IndianFoodDataset.csv)                | startup.                                                              |
|_____________________________________________________________________________________________________________________________________________|
| **Data Processing**        | csv-parser, fs, path                   | Node.js modules used to read, parse, and structure the CSV data       |
|                                                                      | into usable JSON objects.                                            |
|_____________________________________________________________________________________________________________________________________________|


**🚀 Setup and Installation Guide**

Follow these steps to get the application running on your local machine.

**Prerequisites**
Node.js (LTS version recommended)
npm (Node Package Manager)

**Project Structure**
The project is cleanly divided into two main folders:

Food-Recipe-fetcher/
├── Back-End/
│   ├── IndianFoodDataset.csv   <-- DATA SOURCE
│   ├── package.json            <-- Server dependencies
│   └── server.js               <-- EXPRESS API LOGIC
└── Front-End/
    ├── node_modules/
    ├── src/
    │   ├── components/         <-- UI modules (RecipeCard, etc.)
    │   ├── hooks/              <-- Logic module (useRecipeData)
    │   ├── App.jsx             <-- Main React Component
    │   └── main.jsx            <-- Vite entry point
    └── package.json            <-- Client dependencies (React, Vite)



**1. Backend Setup**

Step 1 Navigate to the Backend:
`cd Food-Recipe-fetcher/Back-End`

Install Dependencies:
`npm install express cors csv-parser node-fetch`



Start the Express API Server:
`node server.js`



Keep this terminal window open. It will load the CSV data and run on http://localhost:3000.

**2. Frontend Setup**

Navigate to the Frontend:
`cd ../Front-End`

Install Dependencies:
`npm install`

Start the React Client (Vite):
`npm run dev`

The client will start, usually on http://localhost:5173. This client automatically connects to the Express server.