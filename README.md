# 🏇 Horse Racing Simulator

A dynamic, interactive Vue.js application that simulates horse racing with realistic mechanics and a comprehensive championship system.

> **Note:** This project was created by me, with coding assistance from Cursor IDE. [Learn more about this approach](#-development-assistance).
>
> I have many ideas for future enhancements to this project, but as this was primarily a technical exercise rather than a passion project, I'm sharing these ideas instead of implementing them. [Check out potential improvements](#-future-improvements).

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

## 💭 Future Improvements

While I'm satisfied with the current version of this horse racing simulator, there are numerous exciting enhancements that could be implemented. I've prioritized these ideas in order of importance but don't plan to spend additional time on this project at the moment:

### 1. Enhanced Visual Design & User Experience

The current layout is functional but lacks visual character. Key improvements could include:
- Developing a distinctive visual identity with cohesive color schemes, custom typography, and a memorable logo
- Creating a proper navigation bar for more intuitive movement through the application
- Implementing an instruction modal that greets first-time users, providing context and a warmer introduction to the simulation mechanics
- Adding detailed tooltips to the race track that display comprehensive horse data (name, current position, luck factor, condition) during races

### 2. Improved Horse Mechanics & Depth

The current simulation could be enhanced with more sophisticated racing mechanics:
- Implementing dynamic condition ratings where horses' conditions evolve organically based on race performance - successful horses would see condition improvements while underperforming horses would experience deterioration
- Adding a stamina system that affects horses differently depending on race distance, creating strategic considerations for different races
- Including precise timing information in race results to provide more granular performance metrics
- Developing horse-specific characteristics that influence performance on different track conditions

### 3. Betting System & User Engagement

A betting mechanic would add significant depth to the user experience:
- Allowing users to place wagers on horses based on their historical performance data
- Implementing a virtual currency system with odds calculations reflecting horse conditions and past performance
- Creating detailed horse profile pages showing comprehensive race history to inform betting decisions
- Adding visual celebrations and notifications for successful bets

### 4. Customization & Control

Greater user control would enhance replay value:
- Enabling users to create and save custom race schedules rather than relying on random generation
- Allowing custom horse creation with user-defined attributes (name, color, condition, stamina)
- Implementing save/load functionality for race configurations and championship progress
- Adding options to adjust race parameters (distance, track conditions)

### 5. Architectural Improvements

The single-page approach could be expanded for a more comprehensive experience:
- Transitioning to a multi-page architecture using Vue Router for dedicated sections
- Creating separate focused pages for horses, betting interface, race viewing, and results
- Implementing a more narrative-driven simulation experience with clear pre-race, race, and post-race phases
- Developing a user profile system to track betting history and favorite horses

These enhancements would transform the current simulator into an even more engaging and comprehensive horse racing experience, but they remain beyond the scope of my current timeline for this project.

## 🤖 Development Assistance

This project was developed by me, with coding assistance from Cursor IDE (with model Claude-3.7-Sonnet). I created the application logic, made all architectural decisions, and directed the implementation process while using Cursor as a coding tool to execute my specific directives.

As part of exploring AI-assisted development, I used Cursor to:

- Generate code based on my specific instructions
- Create unit tests according to my specifications
- Draft documentation following my outlined structure

I believe in transparent disclosure about AI tool usage in development. I maintained complete control over the application design, logic and feature decisions, with Cursor serving purely as a coding assistant rather than an autonomous agent.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
