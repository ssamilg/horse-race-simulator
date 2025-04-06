# 🏇 Horse Racing Simulator

A dynamic, interactive Vue.js application that simulates horse racing with realistic mechanics and a comprehensive championship system.

> **Note:** This project was created by me, with coding assistance from Cursor IDE. [Learn more about this approach](#-development-assistance).

## 🌐 Live Demo

The project is live at: [https://horse-race-simulator.surge.sh/](https://horse-race-simulator.surge.sh/)

## ✨ Features

- Real-time horse racing simulation with dynamic animations
- Comprehensive championship system tracking points across multiple rounds
- Horse performance affected by condition ratings and luck factors
- Multiple race rounds with increasing distances (1200m-2200m)
- Interactive race track with visual indicators
- Responsive design that works on mobile and desktop

## 🔧 Technologies Used

- Vue.js 3 with Composition API
- Pinia for state management
- Tailwind CSS for styling
- Vitest for unit testing

## 💡 What I Did Differently

### Modern State Management
- Implemented Pinia instead of Vuex for state management, leveraging its superior integration with Vue 3's Composition API
- Created a centralized store architecture that simplifies component communication and state persistence

### Consistent Horse Identity
- Instead of randomly generating horses on each initialization, defined a consistent set of horses as constants with unique:
  - Names
  - Colors
  - Condition ratings
- Each race round randomly selects 10 horses from the pool of 20, creating varied race lineups while maintaining horse identity

### Dynamic Racing Mechanics
- Addressed the predictability challenge of fixed horse conditions by introducing a "luck factor" mechanic
- Each horse receives a random multiplier (0.7-1.5) that affects its ultimate speed during races
- This introduces strategic unpredictability while maintaining the core importance of horse condition

### Streamlined UI Experience
- Utilized tabbed interfaces and navigation controls to allow users to switch between different rounds, results, and schedules
- Reduced UI duplication by reusing the same table component with different modes for various contexts
- Implemented responsive layouts that adjust based on screen size and user preferences

### Cultural Tribute
- Named the horses after legendary Beşiktaş JK football players as a tribute
- This references the interesting connection that the current president of Beşiktaş JK (Serdal Adalı) is also the head of TJK (Turkey Jockey Club)
- A small personal touch as a passionate Beşiktaş supporter! ⚫⚪

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/horse-race-simulator.git
   cd horse-race-simulator
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start the development server
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## 🧪 Running Tests

Run the unit tests with:
```bash
npm run test:unit
```

## 📦 Building for Production

Build the project for production:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## 📝 Project Structure

```
horse-race-simulator/
├── public/               # Static assets
├── src/
│   ├── assets/           # Project assets (images, fonts)
│   ├── components/       # Vue components
│   │   ├── __tests__             # Unit tests for components
│   │   ├── HorseList.vue         # List of all available horses
│   │   ├── HorseTable.vue        # Table for displaying horses in various contexts
│   │   ├── RaceTrack.vue         # Main race visualization component
│   │   ├── ResultsView.vue       # Tabbed view for results and standings
│   │   └── ChampionshipTable.vue # Table for championship standings
│   ├── constants/        # Application constants
│   │   └── horses.js     # Horse data definitions
│   ├── stores/           # Pinia stores
│   │   └── raceStore.js  # Main race state management
│   ├── views/            # Page components
│   │   └── HomeView.vue  # Main application view
│   ├── App.vue           # Root component
│   └── main.js           # Application entry point
├── .eslintrc.js          # ESLint configuration
├── tailwind.config.js    # Tailwind CSS configuration
├── vite.config.js        # Vite configuration
└── package.json          # Project dependencies and scripts
```

## 📋 How It Works

1. **Race Configuration**: Generate a program to set up horses for the race
2. **Race Execution**: Start the race and watch horses move across the track
3. **Results**: View detailed results after each race, with positions and luck factors
4. **Championship**: Follow the standings across multiple race rounds
5. **Schedule**: View upcoming races in the championship series

## 🔄 Race Mechanics

- Each horse has a base condition rating (30-100)
- Luck factors (0.7-1.5) are generated randomly for each race
- Actual speed = Condition × Luck Factor
- Position is determined by distance covered in real-time
- Championship points: 10 for 1st place, 7 for 2nd, 5 for 3rd, 3 for 4th, 1 for 5th

## 📱 Responsive Design

The application is fully responsive and adapts to different screen sizes:
- Desktop: Full layout with horse list and race track side by side
- Mobile: Compact layout with collapsible sections for better usability

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 🤖 Development Assistance

This project was developed by me, with coding assistance from Cursor IDE (with model Claude-3.7-Sonnet). I created the application logic, made all architectural decisions, and directed the implementation process while using Cursor as a coding tool to execute my specific directives.

As part of exploring AI-assisted development, I used Cursor to:

- Generate code based on my specific instructions
- Create unit tests according to my specifications
- Draft documentation following my outlined structure

I believe in transparent disclosure about AI tool usage in development. I maintained complete control over the application design, logic and feature decisions, with Cursor serving purely as a coding assistant rather than an autonomous agent.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
