import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import App from './App'; // Существующая страница с ИИ
import ThreeDObjects from './components/ThreeDObjects';
import { CameraIcon, BuildingIcon, BrainIcon, MobileIcon, GlobeIcon, RocketIcon } from './components/Icons';
import { Analytics } from "@vercel/analytics/react"
import './index.css';

function MainApp() {
  return (
    <Router>
      <div className="native-app">
        {/* Нативная навигация */}
        <nav className="native-nav">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-white font-['Inter_Tight']">AR Tourist</h1>
              </div>
              <div className="hidden md:flex space-x-6">
                <Link 
                  to="/" 
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-white/10"
                >
                  Главная
                </Link>
                <Link 
                  to="/image-recognition" 
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-white/10"
                >
                  Распознавание фото
                </Link>
                <Link 
                  to="/3d-objects" 
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-white/10"
                >
                  3D Объекты
                </Link>
              </div>
              {/* Мобильная навигация */}
              <div className="md:hidden">
                <button className="mobile-nav-toggle text-white hover:text-blue-400 p-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Основной контент */}
        <main className="native-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/image-recognition" element={<App />} />
            <Route path="/3d-objects" element={<ThreeDObjects />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

// Главная страница
function HomePage() {
  return (
    <div className="native-home native-fade-in">
      <div className="max-w-4xl mx-auto">
        <h1 className="native-title">
          {/* AR Tourist */}
        </h1>
        <p className="native-description">
          Инновационное приложение для туристов, использующее искусственный интеллект 
          и дополненную реальность для изучения достопримечательностей
        </p>
        
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="native-card native-fade-in" style={{animationDelay: '0.1s'}}>
            <div className="native-icon">
              <CameraIcon className="w-16 h-16 text-blue-400" />
            </div>
            <h3 className="native-feature-title">
              Распознавание изображений
            </h3>
            <p className="native-feature-text mb-6">
              Загружайте фотографии достопримечательностей и получайте подробную информацию 
              с помощью ИИ
            </p>
            <Link 
              to="/image-recognition"
              className="native-button block text-center"
            >
              Попробовать
            </Link>
          </div>
          
          <div className="native-card native-fade-in" style={{animationDelay: '0.2s'}}>
            <div className="native-icon">
              <BuildingIcon className="w-16 h-16 text-green-400" />
            </div>
            <h3 className="native-feature-title">
              3D Объекты
            </h3>
            <p className="native-feature-text mb-6">
              Изучайте здания и монументы в 3D формате с интерактивным вращением 
              и подробными описаниями
            </p>
            <Link 
              to="/3d-objects"
              className="native-button block text-center"
            >
              Изучить
            </Link>
          </div>
        </div>
        
        <div className="native-features native-fade-in" style={{animationDelay: '0.3s'}}>
          <h3 className="text-2xl font-semibold text-white mb-6 font-['Inter_Tight'] flex items-center">
            <RocketIcon className="w-8 h-8 text-blue-400 mr-3" />
            Возможности приложения
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="native-feature-card">
              <div className="native-icon">
                <BrainIcon className="w-12 h-12 text-purple-400" />
              </div>
              <h4 className="native-feature-title">ИИ распознавание</h4>
              <p className="native-feature-text">Автоматическое определение объектов на фотографиях</p>
            </div>
            <div className="native-feature-card">
              <div className="native-icon">
                <MobileIcon className="w-12 h-12 text-green-400" />
              </div>
              <h4 className="native-feature-title">Мобильная оптимизация</h4>
              <p className="native-feature-text">Работает на всех устройствах и браузерах</p>
            </div>
            <div className="native-feature-card">
              <div className="native-icon">
                <GlobeIcon className="w-12 h-12 text-blue-400" />
              </div>
              <h4 className="native-feature-title">Интерактивность</h4>
              <p className="native-feature-text">3D модели с возможностью вращения</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainApp;
