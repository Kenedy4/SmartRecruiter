# Smart_recruiter

# Smart Recruiter - Frontend

{STAGE 1

## Introduction

Smart Recruiter is a web application designed to automate the process of in-person technical interviews. This README documents the frontend, which was built using ReactJS with Redux Toolkit for state management. The application is a full-stack project, but this file focuses solely on the frontend aspects and provides a detailed overview of each step taken, from project setup to feature implementation.

## Tech Stack

- **Frontend Framework**: ReactJS (with Vite as a bundler)
- **State Management**: Redux Toolkit
- **Styling**: Custom CSS & TailwindCSS
- **Testing Framework**: Jest
- **HTTP Requests**: Axios
- **Routing**: React Router

## Project Setup

### Step 1: Initial Project Setup with Vite

The project started with the creation of a new React application using Vite:

```bash
npx create-vite@latest smart_recruiter --template react
```

After running the command, I navigated to the project directory:

```bash
cd smart_recruiter
```

Next, I installed all the necessary dependencies:

```bash
npm install
```

### Step 2: Installing Dependencies

The following dependencies were installed to support the project:

- **React Router** for managing navigation:
  ```bash
  npm install react-router-dom
  ```

- **Redux Toolkit** for state management:
  ```bash
  npm install @reduxjs/toolkit react-redux
  ```

- **Axios** for making HTTP requests:
  ```bash
  npm install axios
  ```

### Step 3: Project Structure

The following project structure was used to keep the code organized:

```
smart_recruiter/
- frontend
  - node_modules
  - public
  - src
    - __mocks__
    - assets
    - components
      - Button.css
      - Button.jsx
      - Button.test.jsx
      - Dashboard.jsx
      - Footer.jsx
      - Header.jsx
      - HomePage.jsx
      - Input.jsx
      - JobPostForm.jsx
      - RecruiteeAuth.jsx
      - RecruiteeDashboard.jsx
      - RecruiterAuth.jsx
      - RecruiterDashboard.jsx
    - features
    - hooks
    - pages
      - Dashboard.jsx
      - HomePage.jsx
      - LoginPage.jsx
    - redux
      - slices
        - authSlice.js
        - recruiterSlice.js
      - store.js
    - services
    - tests
    - main.jsx
  - App.css
  - App.jsx
  - Dashboard.js
  - Footer.css
  - Header.css
  - HomePage.css
  - index.css
  - main.jsx
  - RecruiteeAuth.css
  - RecruiteeDashboard.css
  - RecruiterAuth.css
  - RecruiterDashboard.css
  - setupTests.js
  - .gitignore
  - eslint.config.js
  - eslint.config.mjs
  - index.html
  - package-lock.json
  - package.json
  - README.md
  - vite.config.mjs
  - LICENSE

```

N/B Not all files have code, we have just kept it like so so that we might have an idea of how we want the program to work.

### Step 4: Implementing Components

- **Header and Footer Components**: I created `Header.jsx` and `Footer.jsx` components for consistent navigation and a footer section across the app.
- **RecruiterAuth and RecruiteeAuth Components**: These components handle authentication for both recruiters and recruitees, allowing users to create accounts or log in.
- **RecruiterDashboard and RecruiteeDashboard Components**: These components manage the dashboards for recruiters and recruitees, respectively. They offer functionality like job creation, filtering applicants, applying for jobs, etc.

### Step 5: Setting up Redux Store

The Redux store was set up to manage global state for the application. The configuration was done in `store.js`:

```javascript
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import recruiterReducer from './slices/recruiterSlice';
import recruiteeReducer from './slices/recruiteeSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    recruiter: recruiterReducer,
    recruitee: recruiteeReducer,
  },
});

export default store;
```

### Step 6: Authentication State Management

The authentication logic is managed by `authSlice.js`. This slice contains actions for setting and clearing the user state, which includes the user profile and authentication token.

### Step 7: Recruiter Slice

`recruiterSlice.js` was created to manage the state for job creation, deleting jobs, fetching applicants, and filtering hired candidates. Additionally, async thunks were used to fetch data from the backend:

- **Async Thunks** for fetching jobs, applicants, and hired candidates using Axios.
- **Reducers** to handle job creation, job deletion, and filtering applicants.

### Step 8: Recruitee Slice

`recruiteeSlice.js` manages the state for job applications and available jobs:

- **Async Thunks** were implemented to fetch available jobs and submit job applications.
- **Reducers** manage synchronous actions to update the job application state.

### Step 9: Routing

The routing was handled by React Router, and the main routes were defined in `App.jsx` as follows:

```jsx
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import RecruiterDashboard from './components/RecruiterDashboard';
import RecruiterAuth from './components/RecruiterAuth';
import RecruiteeDashboard from './components/RecruiteeDashboard';
import RecruiteeAuth from './components/RecruiteeAuth';
import HomePage from './components/HomePage';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/recruiter/auth" element={<RecruiterAuth />} />
          <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
          <Route path="/recruitee/auth" element={<RecruiteeAuth />} />
          <Route path="/recruitee/dashboard" element={<RecruiteeDashboard />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
```

### Step 10: Debugging Common Issues

- **TypeError with Array Mapping**: While working on `RecruiterDashboard.jsx` and `RecruiteeDashboard.jsx`, I encountered issues with `.map()` not being a function. This was due to the initial state not being properly set as an array, which was later corrected by ensuring that the state was initialized correctly.

- **Redux State Update**: The recruiter and recruitee slices were updated to correctly handle async state updates using thunks, including actions such as `fetchCreatedJobs`, `fetchApplicants`, and `fetchAvailableJobs`.

### Step 11: Running the Application

To run the application locally:

```bash
npm run dev
```

This command starts the development server, and the application is available at [http://localhost:3000](http://localhost:3000).

### Step 12: Testing

- Jest was integrated to handle unit testing for the components.
- The initial setup for testing library components was done using `npm install @testing-library/react @testing-library/jest-dom`.

### Features Implemented

1. **Authentication**: Recruiters and Recruitees can log in or create an account.
2. **Recruiter Dashboard**:
   - **Job Creation and Management**: Recruiters can create and delete job postings.
   - **Applicant Filtering**: Recruiters can filter applicants by experience, age, and gender.
   - **Hired Candidates**: Recruiters can view hired candidates.
3. **Recruitee Dashboard**:
   - **Profile Creation**: Recruitees can create a profile.
   - **Job Application**: Recruitees can apply to available jobs.

## Conclusion

The frontend of Smart Recruiter is a comprehensive React application that leverages modern tools and technologies to create an efficient and scalable user experience. Using Vite, React Router, Redux Toolkit, and Axios allowed for a smooth development process with a focus on speed and modularity.

Further work may involve adding more detailed testing, enhancing form validations, integrating notifications, and connecting the frontend with the backend API endpoints.

Feel free to clone the repository and explore the codebase for a better understanding of how the application is built.

### Commands Summary

- **Create Project**: `npx create-vite@latest smart_recruiter --template react`
- **Install Dependencies**: `npm install react-router-dom @reduxjs/toolkit react-redux axios`
- **Run the Application**: `npm run dev`

N/B It is goog to note that I started this project with the missinformed notion that it was a recruitement platform such as those for job applications. From here Roy and Hesbon will take over and correct the notion, but the code, dependancies, redux toolkits (components) and testing frame work that is Jest is working perfectly.



{STAGE 2

Now i want to add Recruiter Features:

-Assessment Management:
1. CreateAssessment.jsx - A form to create assessments with multiple-choice, subjective, or coding questions.
2. AssessmentList.jsx - To view, review, publish, and send invitations.
3. AssessmentReview.jsx - To provide feedback and release grades.

-Performance Overview:
1. IntervieweePerformance.jsx - Displays a list of Interviewees sorted by score, with statistics on performance.
2. IntervieweeDetails.jsx - View each interviewee's answers and leave feedback.

-Invite Management:
InviteInterviewee.jsx - Allows invitations to interviewees.

Also add Interviewee Features:

-Assessment Portal:
1. AssessmentDashboard.jsx - Displays assessments the interviewee is signed up for and allows them to accept invitations.
2. TrialAssessment.jsx - A mock assessment for practice.
3. TakeAssessment.jsx - The actual assessment with multiple types of questions.

-General Components:
1. Dashboard.jsx - A landing page for both Recruiters and Interviewees to access their respective features.
2. Timer.jsx - A countdown timer to show the remaining time.

-State Management (Redux):
1. Slices for managing state such as:
2. authSlice.js - Authentication for Recruiters and Interviewees.
3. assessmentSlice.js - To handle assessments.
4. inviteSlice.js - Manage interviewee invitations.


Below is the updated version of our tree, but just a section of it:
src
│
├── components
│   ├── auth
│   │   ├── RecruiterAuth.jsx
│   │   └── RecruiteeAuth.jsx
│   ├── recruiter
│   │   ├── CreateAssessment.jsx
│   │   ├── AssessmentList.jsx
│   │   ├── AssessmentReview.jsx
│   │   ├── IntervieweePerformance.jsx
│   │   ├── IntervieweeDetails.jsx
│   │   └── InviteInterviewee.jsx
│   ├── interviewee
│   │   ├── AssessmentDashboard.jsx
│   │   ├── TrialAssessment.jsx
│   │   └── TakeAssessment.jsx
│   ├── common
│   │   └── Timer.jsx
│   ├── Header.jsx
│   ├── Footer.jsx
│   └── Dashboard.jsx
│
├── redux
│   ├── slices
│   │   ├── authSlice.js
│   │   ├── assessmentSlice.js
│   │   └── inviteSlice.js
│   └── store.js
│
└── App.jsx
