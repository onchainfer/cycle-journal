# 🌙 Lilith - Menstrual Cycle Journal & AI Coach

An intelligent menstrual health tracking app that combines cycle monitoring with AI-powered coaching. Meet Lilith, your expert friend who understands the complexities of hormonal health.

## ✨ Features

### 🏠 **Smart Home Dashboard**
- Real-time cycle day tracking with phase detection
- Intelligent insights based on your current cycle position
- Quick symptom logging with visual cycle calendar

### 📝 **Journal & Tracking**
- Daily symptom and mood tracking
- Medication and lifestyle change detection
- Automatic trigger recognition (period start/end, medication changes)

### 🤖 **Lilith AI Coach**
- Powered by **OpenRouter (Gemini 2.0 Flash Lite)** for intelligent responses
- Context-aware conversations that remember your cycle history
- Science-backed advice delivered with empathy and understanding
- Real-time trigger detection and profile updates

### 📅 **Cycle Calendar**
- Visual cycle tracking with phase coloring
- Pattern recognition across multiple cycles
- Symptom correlation with cycle phases

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- OpenRouter API key ([Get one here](https://openrouter.ai))

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cycle-journal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure AI Service**
   ```bash
   cp src/services/anthropic.js.example src/services/anthropic.js
   ```
   
   Then edit `src/services/anthropic.js` and replace:
   ```javascript
   const OPENROUTER_KEY_DEV = 'YOUR_OPENROUTER_KEY_HERE';
   ```
   
   With your actual OpenRouter API key:
   ```javascript
   const OPENROUTER_KEY_DEV = 'sk-or-v1-your-actual-key-here';
   ```

4. **Start the application**
   ```bash
   npm start
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🧠 AI Integration

This app uses **OpenRouter** to access Google's **Gemini 2.0 Flash Lite** model, providing:

- **Fast responses** optimized for conversational AI
- **Cost-effective** API usage with high-quality outputs  
- **Reliable uptime** through OpenRouter's infrastructure
- **Context-aware coaching** that adapts to your cycle phase

### AI Features:
- **Trigger Detection**: Automatically recognizes period start/end, medication changes
- **Profile Integration**: Remembers your conditions, medications, and cycle patterns
- **Conversational Memory**: Maintains context across multiple conversations
- **Phase-Aware Advice**: Provides insights based on your current cycle day

## 📱 App Structure

- **Home** (⚸) - Dashboard with cycle overview and quick insights
- **Journal** (◎) - Daily logging with symptom tracking
- **Lilith** (✦) - AI chat interface for questions and guidance
- **Calendar** (◫) - Visual cycle tracking and pattern analysis

## 🔧 Development

### Built with:
- **React 19.2.4** - Modern React with latest features
- **Create React App** - Zero-config development environment
- **OpenRouter API** - AI model access and management
- **Local Storage** - Client-side data persistence

### Key Components:
- `LilithChatWithTriggers` - Main AI chat interface
- `HomeScreen` - Dashboard with cycle insights  
- `JournalScreen` - Daily logging interface
- `CycleCalendar` - Visual cycle tracking

### AI Service:
- `src/services/anthropic.js` - OpenRouter integration
- `src/components/lilithPrompt.js` - Dynamic prompt generation

## 🔒 Security

- API keys are git-ignored for security
- Environment variables supported for production
- Secure headers for API communications
- Local data storage with no external data transmission

## 🛠 Available Scripts

- `npm start` - Development server
- `npm test` - Run tests
- `npm run build` - Production build
- `npm run eject` - Eject from Create React App (not recommended)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**Built with 💜 for menstrual health empowerment**
