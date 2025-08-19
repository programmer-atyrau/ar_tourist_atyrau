import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { OBJLoader } from 'three-stdlib';
import { MonumentIcon, TentIcon, PalaceIcon, TheaterIcon, CubeIcon, EyeIcon, DocumentTextIcon, InformationCircleIcon, CheckIcon, MobileIcon, CogIcon } from './Icons';

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
    <div className="native-object-info">
      <h3 className="native-object-title">
        {object.name}
      </h3>
      <div className="space-y-4">
        <div className="native-info-section">
          <div className="native-info-label">Описание</div>
          <p className="native-info-text">{object.description}</p>
        </div>
        <div className="native-info-section">
          <div className="native-info-label">История</div>
          <p className="native-info-text">{object.history}</p>
        </div>
        <div className="native-info-section">
          <div className="native-info-label">Архитектурный стиль</div>
          <p className="native-info-text">{object.architecturalStyle}</p>
        </div>
        <div className="native-info-section">
          <div className="native-info-label">Год постройки</div>
          <p className="native-info-text">{object.yearBuilt}</p>
        </div>
        {object.modelPath && (
          <div className="bg-green-900/20 border border-green-500/30 p-3 rounded-lg">
            {/* <p className="text-green-400 text-sm flex items-center">
              <CheckIcon className="w-4 h-4 mr-2" />
              3D модель загружена: {object.modelPath}
            </p> */}
            <p className="text-green-500 text-xs mt-1">
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
    // {
    //   id: 1,
    //   name: "Байтерек",
    //   description: "Монумент Байтерек — символ Астаны и всего Казахстана, представляющий собой металлическую конструкцию высотой 97 метров.",
    //   history: "Монумент был построен в 2002 году по проекту архитектора Акима Шалгинбаева. Название 'Байтерек' означает 'высокий тополь' на казахском языке.",
    //   architecturalStyle: "Современный модернизм",
    //   yearBuilt: "2002",
    //   modelPath: "/models/bayterek.obj", // Путь к вашему .obj файлу
    //   icon: MonumentIcon
    // },
    // {
    //   id: 2,
    //   name: "Хан Шатыр",
    //   description: "Хан Шатыр — крупнейший торгово-развлекательный центр в Центральной Азии, построенный в форме шатра.",
    //   history: "Центр был открыт в 2010 году. Архитектор Норман Фостер создал уникальную конструкцию, вдохновленную традиционными казахскими юртами.",
    //   architecturalStyle: "Футуризм",
    //   yearBuilt: "2010",
    //   modelPath: "/models/khan_shatyir.obj", // Путь к вашему .obj файлу
    //   icon: TentIcon
    // },
    // {
    //   id: 3,
    //   name: "Дворец Мира и Согласия",
    //   description: "Пирамида Мира и Согласия — уникальное здание в форме пирамиды, построенное для проведения Конгресса лидеров мировых и традиционных религий.",
    //   history: "Здание было построено в 2006 году по проекту архитектора Нормана Фостера. Пирамида символизирует единство всех религий мира.",
    //   architecturalStyle: "Неомодернизм",
    //   yearBuilt: "2006",
    //   modelPath: "/models/palace_of_peace.obj", // Путь к вашему .obj файлу
    //   icon: PalaceIcon
    // },
    {
      id: 4,
      name: "Академический драматический театр им. Махамбета Утемисова",
      description: "Один из главных культурных центров и архитектурных символов города Атырау. Театр является ведущей сценической площадкой региона, где ставятся произведения казахской и мировой драматургии. Здание с величественными колоннами — визитная карточка города.",
      history: "Здание театра было построено в 1972 году по проекту архитектора А. Леппика. С момента своего открытия театр стал центром притяжения для ценителей искусства. В 2018 году ему был присвоен почетный статус «академического», что подчеркивает его высокий вклад в культурное развитие Казахстана.",
      architecturalStyle: "Неоклассицизм",
      yearBuilt: "1972",
      modelPath: "/models/drum_teatr.obj", // Ваш реальный .obj файл
      icon: TheaterIcon
    }
  ];

  return (
    <div className="native-page">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="native-title">
            3D Объекты и Достопримечательности
          </h1>
          <p className="native-description">
            Изучайте здания и монументы в интерактивном 3D формате
          </p>
        </div>

        {/* Выбор объекта */}
        <div className="native-object-grid">
          {objects.map((object) => {
            const IconComponent = object.icon;
            return (
              <button
                key={object.id}
                onClick={() => setSelectedObject(object)}
                className={`native-object-card ${
                  selectedObject?.id === object.id ? 'selected' : ''
                }`}
              >
                <div className="native-icon">
                  <IconComponent className="w-12 h-12 text-blue-400" />
                </div>
                <h3 className="native-feature-title">{object.name}</h3>
                <p className="native-feature-text">{object.architecturalStyle}</p>
                {object.modelPath && (
                  <div className="mt-2 text-xs text-green-400 flex items-center">
                    <CheckIcon className="w-3 h-3 mr-1" />
                    3D модель доступна
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* 3D просмотр и информация */}
        {selectedObject ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 3D сцена */}
            <div className="space-y-4">
              <h2 className="native-feature-title text-center">
                {selectedObject.name}
              </h2>
              <div className="native-3d-scene">
                <Scene selectedObject={selectedObject} />
              </div>
              <div className="text-center text-sm text-gray-400">
                <p className="flex items-center justify-center mb-2">
                  <EyeIcon className="w-4 h-4 mr-2" />
                  Используйте мышь для вращения и масштабирования
                </p>
                <p className="flex items-center justify-center mb-2">
                  <CubeIcon className="w-4 h-4 mr-2" />
                  Модель автоматически вращается по горизонтальной оси
                </p>
                <p className="flex items-center justify-center">
                  <MobileIcon className="w-4 h-4 mr-2" />
                  Поддерживается управление на мобильных устройствах
                </p>
              </div>
            </div>

            {/* Информация об объекте */}
            <div>
              <ObjectInfo object={selectedObject} />
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="native-icon text-6xl mb-4">
              <CubeIcon className="w-24 h-24 text-blue-400 mx-auto" />
            </div>
            <h3 className="native-feature-title mb-2">
              Выберите объект для изучения
            </h3>
            <p className="native-feature-text">
              Нажмите на один из объектов выше, чтобы увидеть его 3D модель и подробную информацию
            </p>
          </div>
        )}

        {/* Инструкции по добавлению 3D моделей */}
        {/* <div className="native-instructions">
          <h3 className="native-instructions-title flex items-center">
            <DocumentTextIcon className="w-6 h-6 mr-2" />
            Как добавить свои 3D модели (.obj файлы)
          </h3>
          <div className="space-y-3">
            <p className="native-instructions-text flex items-center">
              <span className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center mr-2 text-xs font-bold">1</span>
              Поместите ваш .obj файл в папку <code className="native-code-block">public/models/</code>
            </p>
            <p className="native-instructions-text flex items-center">
              <span className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center mr-2 text-xs font-bold">2</span>
              Добавьте информацию об объекте в массив <code className="native-code-block">objects</code>
            </p>
            <p className="native-instructions-text flex items-center">
              <span className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center mr-2 text-xs font-bold">3</span>
              Укажите путь к модели в поле <code className="native-code-block">modelPath</code>
            </p>
            <p className="native-instructions-text flex items-center">
              <span className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center mr-2 text-xs font-bold">4</span>
              Модель автоматически загрузится и отобразится!
            </p>
          </div>
          <div className="mt-4 p-4 bg-yellow-900/20 rounded-lg">
            <p className="text-sm text-yellow-400 flex items-center">
              <InformationCircleIcon className="w-4 h-4 mr-2" />
              <strong>Пример:</strong>
            </p>
            <div className="native-code-block mt-2">
              {`{
  id: 4,
  name: "Ваш объект",
  description: "Описание вашего объекта",
  history: "История объекта",
  architecturalStyle: "Стиль архитектуры",
  yearBuilt: "2024",
  modelPath: "/models/your_model.obj",
  icon: MonumentIcon
}`}
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-blue-900/20 rounded-lg">
            <h4 className="font-semibold text-blue-400 mb-2 flex items-center">
              <CogIcon className="w-4 h-4 mr-2" />
              Технические требования:
            </h4>
            <ul className="text-sm text-blue-400 space-y-1">
              <li>• Формат файла: .obj (Wavefront OBJ)</li>
              <li>• Размер: рекомендуется до 10MB</li>
              <li>• Текстуры: поддерживаются .mtl файлы</li>
              <li>• Полигоны: оптимально до 100,000 полигонов</li>
              <li>• Модель автоматически центрируется и масштабируется</li>
            </ul>
          </div>
        </div> */}
      </div>
    </div>
  );
}

export default ThreeDObjects;
