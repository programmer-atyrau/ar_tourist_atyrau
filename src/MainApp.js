import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import App from './App'; // Существующая страница с ИИ
import ThreeDObjects from './components/ThreeDObjects';
import './index.css';

function MainApp() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Навигация */}
        <nav className="bg-white shadow-lg">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-gray-800">AR Tourist</h1>
              </div>
              <div className="hidden md:flex space-x-6">
                <Link 
                  to="/" 
                  className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Главная
                </Link>
                <Link 
                  to="/image-recognition" 
                  className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Распознавание фото
                </Link>
                <Link 
                  to="/3d-objects" 
                  className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  3D Объекты
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Основной контент */}
        <main className="container mx-auto px-4 py-8">
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
    <div className="text-center">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold text-gray-800 mb-6">
          Добро пожаловать в AR Tourist
        </h1>
        <p className="text-xl text-gray-600 mb-12 leading-relaxed">
          Инновационное приложение для туристов, использующее искусственный интеллект 
          и дополненную реальность для изучения достопримечательностей
        </p>
        
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-6xl mb-4">📷</div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              Распознавание изображений
            </h3>
            <p className="text-gray-600 mb-6">
              Загружайте фотографии достопримечательностей и получайте подробную информацию 
              с помощью ИИ
            </p>
            <Link 
              to="/image-recognition"
              className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Попробовать
            </Link>
          </div>
          
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-6xl mb-4">🏛️</div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              3D Объекты
            </h3>
            <p className="text-gray-600 mb-6">
              Изучайте здания и монументы в 3D формате с интерактивным вращением 
              и подробными описаниями
            </p>
            <Link 
              to="/3d-objects"
              className="inline-block bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Изучить
            </Link>
          </div>
        </div>
        
        <div className="bg-blue-50 rounded-2xl p-8">
          <h3 className="text-2xl font-semibold text-blue-800 mb-4">
            🚀 Возможности приложения
          </h3>
          <div className="grid md:grid-cols-3 gap-6 text-left">
            <div className="flex items-start">
              <div className="text-2xl mr-3">🤖</div>
              <div>
                <h4 className="font-semibold text-blue-800 mb-2">ИИ распознавание</h4>
                <p className="text-blue-700 text-sm">Автоматическое определение объектов на фотографиях</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="text-2xl mr-3">📱</div>
              <div>
                <h4 className="font-semibold text-blue-800 mb-2">Мобильная оптимизация</h4>
                <p className="text-blue-700 text-sm">Работает на всех устройствах и браузерах</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="text-2xl mr-3">🌍</div>
              <div>
                <h4 className="font-semibold text-blue-800 mb-2">Интерактивность</h4>
                <p className="text-blue-700 text-sm">3D модели с возможностью вращения</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainApp;
