import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { OBJLoader } from 'three-stdlib';

// Компонент для загрузки .obj файлов
function ObjModel({ modelPath }) {
  const meshRef = useRef();
  const [model, setModel] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Загрузка .obj файла
  useEffect(() => {
    if (!modelPath) return;
    
    setLoading(true);
    setError(null);
    
    const loader = new OBJLoader();
    
    loader.load(
      modelPath,
      (object) => {
        // Центрируем модель
        const box = new THREE.Box3().setFromObject(object);
        const center = box.getCenter(new THREE.Vector3());
        object.position.sub(center);
        
        // Масштабируем модель для лучшего отображения
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 4 / maxDim; // Масштаб для размера 4 единицы
        object.scale.setScalar(scale);
        
        setModel(object);
        setLoading(false);
      },
      (progress) => {
        // Прогресс загрузки
        console.log('Загрузка модели:', (progress.loaded / progress.total * 100) + '%');
      },
      (error) => {
        console.error('Ошибка загрузки модели:', error);
        setError('Не удалось загрузить модель');
        setLoading(false);
      }
    );
  }, [modelPath]);
  
  useFrame((state) => {
    if (meshRef.current) {
      // Вращение по горизонтальной оси (Y) на 180 градусов
      meshRef.current.rotation.y += 0.01;
    }
  });

  // Если модель загружается
  if (loading) {
    return (
      <mesh ref={meshRef}>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color="#FFD700" />
      </mesh>
    );
  }

  // Если произошла ошибка
  if (error) {
    return (
      <mesh ref={meshRef}>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color="#FF6B6B" />
      </mesh>
    );
  }

  // Если модель не загружена, показываем заглушку
  if (!model) {
    return (
      <mesh ref={meshRef}>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color="#4F46E5" />
      </mesh>
    );
  }

  // Отображаем загруженную модель
  return (
    <primitive 
      ref={meshRef} 
      object={model} 
      position={[0, 0, 0]}
    />
  );
}

// Основной компонент 3D сцены
function Scene({ selectedObject }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 75 }}
      style={{ height: '400px' }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} />
      <ObjModel modelPath={selectedObject?.modelPath} />
      <OrbitControls enableZoom={true} enablePan={true} enableRotate={true} />
    </Canvas>
  );
}

// Компонент для отображения информации об объекте
function ObjectInfo({ object }) {
  if (!object) return null;

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <h3 className="text-2xl font-semibold text-gray-800 mb-4">
        {object.name}
      </h3>
      <div className="space-y-4">
        <div>
          <h4 className="font-semibold text-gray-700 mb-2">Описание:</h4>
          <p className="text-gray-600 leading-relaxed">{object.description}</p>
        </div>
        <div>
          <h4 className="font-semibold text-gray-700 mb-2">История:</h4>
          <p className="text-gray-600 leading-relaxed">{object.history}</p>
        </div>
        <div>
          <h4 className="font-semibold text-gray-700 mb-2">Архитектурный стиль:</h4>
          <p className="text-gray-600">{object.architecturalStyle}</p>
        </div>
        <div>
          <h4 className="font-semibold text-gray-700 mb-2">Год постройки:</h4>
          <p className="text-gray-600">{object.yearBuilt}</p>
        </div>
        {object.modelPath && (
          <div className="bg-green-50 p-3 rounded-lg">
            <p className="text-green-700 text-sm">
              ✅ 3D модель загружена: {object.modelPath}
            </p>
            <p className="text-green-600 text-xs mt-1">
              Модель автоматически вращается и масштабируется
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Главный компонент страницы 3D объектов
function ThreeDObjects() {
  const [selectedObject, setSelectedObject] = useState(null);

  // Тестовые данные для 3D объектов
  const objects = [
    {
      id: 1,
      name: "Байтерек",
      description: "Монумент Байтерек — символ Астаны и всего Казахстана, представляющий собой металлическую конструкцию высотой 97 метров.",
      history: "Монумент был построен в 2002 году по проекту архитектора Акима Шалгинбаева. Название 'Байтерек' означает 'высокий тополь' на казахском языке.",
      architecturalStyle: "Современный модернизм",
      yearBuilt: "2002",
      modelPath: "/models/bayterek.obj", // Путь к вашему .obj файлу
      image: "🏛️"
    },
    {
      id: 2,
      name: "Хан Шатыр",
      description: "Хан Шатыр — крупнейший торгово-развлекательный центр в Центральной Азии, построенный в форме шатра.",
      history: "Центр был открыт в 2010 году. Архитектор Норман Фостер создал уникальную конструкцию, вдохновленную традиционными казахскими юртами.",
      architecturalStyle: "Футуризм",
      yearBuilt: "2010",
      modelPath: "/models/khan_shatyir.obj", // Путь к вашему .obj файлу
      image: "🏢"
    },
    {
      id: 3,
      name: "Дворец Мира и Согласия",
      description: "Пирамида Мира и Согласия — уникальное здание в форме пирамиды, построенное для проведения Конгресса лидеров мировых и традиционных религий.",
      history: "Здание было построено в 2006 году по проекту архитектора Нормана Фостера. Пирамида символизирует единство всех религий мира.",
      architecturalStyle: "Неомодернизм",
      yearBuilt: "2006",
      modelPath: "/models/palace_of_peace.obj", // Путь к вашему .obj файлу
      image: "🔺"
    },
    {
      id: 4,
      name: "Драм Театр",
      description: "Ваш 3D объект драм театра, загруженный в формате .obj",
      history: "Это ваша 3D модель, которая будет автоматически загружена и отображена в приложении.",
      architecturalStyle: "3D Модель",
      yearBuilt: "2024",
      modelPath: "/models/drum_teatr.obj", // Ваш реальный .obj файл
      image: "🎭"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          3D Объекты и Достопримечательности
        </h1>
        <p className="text-lg text-gray-600">
          Изучайте здания и монументы в интерактивном 3D формате
        </p>
      </div>

      {/* Выбор объекта */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {objects.map((object) => (
          <button
            key={object.id}
            onClick={() => setSelectedObject(object)}
            className={`p-4 rounded-xl border-2 transition-all ${
              selectedObject?.id === object.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="text-4xl mb-2">{object.image}</div>
            <h3 className="font-semibold text-gray-800 mb-1">{object.name}</h3>
            <p className="text-sm text-gray-600">{object.architecturalStyle}</p>
            {object.modelPath && (
              <div className="mt-2 text-xs text-green-600">
                ✅ 3D модель доступна
              </div>
            )}
          </button>
        ))}
      </div>

      {/* 3D просмотр и информация */}
      {selectedObject ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 3D сцена */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800 text-center">
              3D Модель: {selectedObject.name}
            </h2>
            <div className="bg-gray-100 rounded-xl p-4">
              <Scene selectedObject={selectedObject} />
            </div>
            <div className="text-center text-sm text-gray-600">
              <p>💡 Используйте мышь для вращения и масштабирования</p>
              <p>🔄 Модель автоматически вращается по горизонтальной оси</p>
              <p>📱 Поддерживается управление на мобильных устройствах</p>
            </div>
          </div>

          {/* Информация об объекте */}
          <div>
            <ObjectInfo object={selectedObject} />
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🏛️</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Выберите объект для изучения
          </h3>
          <p className="text-gray-600">
            Нажмите на один из объектов выше, чтобы увидеть его 3D модель и подробную информацию
          </p>
        </div>
      )}

      {/* Инструкции по добавлению 3D моделей */}
      <div className="mt-12 bg-yellow-50 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-yellow-800 mb-4">
          📋 Как добавить свои 3D модели (.obj файлы)
        </h3>
        <div className="space-y-3 text-yellow-700">
          <p><strong>1.</strong> Поместите ваш .obj файл в папку <code className="bg-yellow-100 px-2 py-1 rounded">public/models/</code></p>
          <p><strong>2.</strong> Добавьте информацию об объекте в массив <code className="bg-yellow-100 px-2 py-1 rounded">objects</code></p>
          <p><strong>3.</strong> Укажите путь к модели в поле <code className="bg-yellow-100 px-2 py-1 rounded">modelPath</code></p>
          <p><strong>4.</strong> Модель автоматически загрузится и отобразится!</p>
        </div>
        <div className="mt-4 p-4 bg-yellow-100 rounded-lg">
          <p className="text-sm"><strong>Пример:</strong></p>
          <code className="text-xs block mt-2">
            {`{
  id: 4,
  name: "Ваш объект",
  description: "Описание вашего объекта",
  history: "История объекта",
  architecturalStyle: "Стиль архитектуры",
  yearBuilt: "2024",
  modelPath: "/models/your_model.obj",
  image: "🏛️"
}`}
          </code>
        </div>
        
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">🔧 Технические требования:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Формат файла: .obj (Wavefront OBJ)</li>
            <li>• Размер: рекомендуется до 10MB</li>
            <li>• Текстуры: поддерживаются .mtl файлы</li>
            <li>• Полигоны: оптимально до 100,000 полигонов</li>
            <li>• Модель автоматически центрируется и масштабируется</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ThreeDObjects;
