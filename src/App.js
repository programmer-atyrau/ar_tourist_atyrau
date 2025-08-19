import React, { useState, useRef, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-converter';
import { TargetIcon, SearchIcon, PhotoIcon, LockIcon, FolderIcon, LightBulbIcon, ExclamationIcon, CheckIcon, XIcon, PlayIcon, StopIcon, CogIcon, InformationCircleIcon } from './components/Icons';

function App() {
  const [model, setModel] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [confidence, setConfidence] = useState(0);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const [cameraPermission, setCameraPermission] = useState('unknown'); // 'unknown', 'granted', 'denied'
  const [permissionMessage, setPermissionMessage] = useState('');
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);

  // Описания для каждого класса (замените на ваши)
  const classDescriptions = {
    "Person 1": "Саламат Мукашевич Мукашев — выдающийся советский и казахстанский политический деятель, чья карьера началась с работы в нефтяной отрасли и продвигалась через профсоюзы и партийные структуры до высшего государственного уровня. Он внёс значительный вклад в развитие регионов и оставил после себя прочное наследие — от наград и почестей до памятников и учреждений, носящих его имя.",
    "Person 2": "Муса Баймуханович Баймуханов (16 октября 1910 — 18 марта 1945) — герой войны, командир стрелкового взвода, младший лейтенант.",
    "Person 3": "Хиуаз Доспанова (1922–2008) — первая и единственная казахская летчица-штурман, участвовавшая во Второй мировой войне в составе знаменитого 46-го гвардейского ночного бомбардировочного авиаполка, известного как «Ночные ведьмы». Совершила сотни боевых вылетов, проявив мужество и стойкость. После войны активно занималась общественной и политической деятельностью, была депутатом Верховного Совета Казахской ССР. Награждена множеством орденов и медалей, в том числе орденом Отечественной войны II степени. В 2004 году удостоена звания Народного героя Казахстана."
  };

  // Загрузка модели TensorFlow.js
  useEffect(() => {
    const loadModel = async () => {
      try {
        setIsLoading(true);
        // URL модели Teachable Machine (скрыт в коде)
        const modelUrl = 'https://teachablemachine.withgoogle.com/models/tdZxcUwHh/';
        const loadedModel = await tf.loadLayersModel(`${modelUrl}model.json`);
        setModel(loadedModel);
        setError(null);
      } catch (err) {
        console.error('Ошибка загрузки модели:', err);
        setError('Не удалось загрузить модель. Проверьте подключение к интернету.');
      } finally {
        setIsLoading(false);
      }
    };

    loadModel();
  }, []);

  // Автоматическая проверка разрешений камеры при загрузке
  useEffect(() => {
    const checkInitialPermissions = async () => {
      try {
        if (navigator.permissions && navigator.permissions.query) {
          const permission = await navigator.permissions.query({ name: 'camera' });
          if (permission.state === 'granted') {
            setCameraPermission('granted');
            setPermissionMessage('Разрешение на камеру уже предоставлено');
          } else if (permission.state === 'denied') {
            setCameraPermission('denied');
            setPermissionMessage('Доступ к камере запрещен');
          }
        }
      } catch (err) {
        console.log('Не удалось проверить начальные разрешения:', err);
      }
    };

    checkInitialPermissions();
  }, []);

  // Остановка камеры при размонтировании
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Проверка поддержки камеры
  const checkCameraSupport = () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      return false;
    }
    return true;
  };

  // Запрос разрешений на доступ к камере
  const requestCameraPermission = async () => {
    try {
      // Проверяем текущие разрешения
      if (navigator.permissions && navigator.permissions.query) {
        const permission = await navigator.permissions.query({ name: 'camera' });
        
        if (permission.state === 'granted') {
          setCameraPermission('granted');
          setPermissionMessage('Разрешение на камеру уже предоставлено');
          return { granted: true, message: 'Разрешение на камеру уже предоставлено' };
        } else if (permission.state === 'denied') {
          setCameraPermission('denied');
          setPermissionMessage('Доступ к камере запрещен. Разрешите в настройках браузера.');
          return { granted: false, message: 'Доступ к камере запрещен. Разрешите в настройках браузера.' };
        }
      }

      // Запрашиваем разрешение через getUserMedia
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      
      // Сразу останавливаем поток, так как мы только проверяем разрешения
      stream.getTracks().forEach(track => track.stop());
      
      setCameraPermission('granted');
      setPermissionMessage('Разрешение на камеру предоставлено');
      return { granted: true, message: 'Разрешение на камеру предоставлено' };
    } catch (err) {
      console.error('Ошибка запроса разрешений:', err);
      
      let message = '';
      if (err.name === 'NotAllowedError') {
        message = 'Доступ к камере запрещен пользователем';
        setCameraPermission('denied');
      } else if (err.name === 'NotFoundError') {
        message = 'Камера не найдена на устройстве';
        setCameraPermission('denied');
      } else if (err.name === 'NotSupportedError') {
        message = 'Браузер не поддерживает доступ к камере';
        setCameraPermission('denied');
      } else {
        message = `Ошибка доступа к камере: ${err.message}`;
        setCameraPermission('denied');
      }
      
      setPermissionMessage(message);
      return { granted: false, message };
    }
  };

  // Запуск камеры с улучшенной обработкой ошибок
  const startCamera = async () => {
    try {
      setError(null);
      setCameraError(null);
      setPrediction(null);
      setSelectedImage(null);
      
      if (!checkCameraSupport()) {
        throw new Error('Ваш браузер не поддерживает доступ к камере');
      }

      // Сначала запрашиваем разрешения на камеру
      console.log('Запрашиваем разрешения на камеру...');
      const permissionResult = await requestCameraPermission();
      
      if (!permissionResult.granted) {
        throw new Error(permissionResult.message);
      }

      console.log('Разрешения получены, запускаем камеру...');

      // Пробуем разные настройки камеры для Android
      const constraints = {
        video: {
          facingMode: 'environment', // Основная камера
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };

      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia(constraints);
      } catch (err) {
        // Fallback для Android - пробуем без конкретных настроек
        console.log('Пробуем fallback настройки камеры...');
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: true 
        });
      }
      
      streamRef.current = stream;
      videoRef.current.srcObject = stream;
      setIsCameraActive(true);
      
      // Ждем загрузки видео перед распознаванием
      videoRef.current.onloadedmetadata = () => {
        // Автоматическое распознавание каждые 2 секунды
        const recognitionInterval = setInterval(() => {
          if (isCameraActive && model && videoRef.current.readyState >= 2) {
            recognizeImage();
          }
        }, 2000);

        // Очистка интервала при остановке камеры
        return () => clearInterval(recognitionInterval);
      };

    } catch (err) {
      console.error('Ошибка доступа к камере:', err);
      let errorMessage = 'Не удалось получить доступ к камере.';
      
      if (err.name === 'NotAllowedError') {
        errorMessage = 'Доступ к камере запрещен. Разрешите доступ в настройках браузера.';
      } else if (err.name === 'NotFoundError') {
        errorMessage = 'Камера не найдена. Убедитесь, что устройство имеет камеру.';
      } else if (err.name === 'NotSupportedError') {
        errorMessage = 'Ваш браузер не поддерживает доступ к камере. Попробуйте Chrome или Safari.';
      } else if (err.name === 'NotReadableError') {
        errorMessage = 'Камера используется другим приложением. Закройте другие приложения, использующие камеру.';
      } else if (err.name === 'OverconstrainedError') {
        errorMessage = 'Запрошенные настройки камеры не поддерживаются.';
      } else if (err.name === 'TypeError') {
        errorMessage = 'Ошибка типа. Возможно, проблема с HTTPS соединением.';
      }
      
      setCameraError(errorMessage);
    }
  };

  // Остановка камеры
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
    setPrediction(null);
    setCameraError(null);
  };

  // Очистить выбранное изображение
  const clearSelectedImage = () => {
    setSelectedImage(null);
    setPrediction(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Выбор изображения из галереи
  const handleGallerySelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          setSelectedImage(e.target.result);
          processImage(img);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  // Обработка изображения для распознавания
  const processImage = (img) => {
    if (!model) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Устанавливаем размер canvas
    canvas.width = 224; // Размер для Teachable Machine
    canvas.height = 224;
    
    // Рисуем изображение на canvas
    ctx.drawImage(img, 0, 0, 224, 224);
    
    // Получаем данные изображения
    const imageData = ctx.getImageData(0, 0, 224, 224);
    
    // Конвертируем в тензор
    const tensor = tf.browser.fromPixels(imageData, 3)
      .expandDims()
      .div(255.0);
    
    // Предсказание
    model.predict(tensor).array().then(predictions => {
      const predictionArray = predictions[0];
      const maxIndex = predictionArray.indexOf(Math.max(...predictionArray));
      const confidence = predictionArray[maxIndex];
      
      // Получаем название класса (замените на ваши метки)
      const classes = ["Person 1", "Person 2", "Person 3"];
      const predictedClass = classes[maxIndex];
      
      setPrediction(predictedClass);
      setConfidence(confidence);
      
      // Очищаем память
      tensor.dispose();
    });
  };

  // Распознавание текущего кадра с камеры
  const recognizeImage = () => {
    if (!videoRef.current || !model || videoRef.current.readyState < 2) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    canvas.width = 224;
    canvas.height = 224;
    
    // Рисуем текущий кадр с видео
    ctx.drawImage(videoRef.current, 0, 0, 224, 224);
    
    const imageData = ctx.getImageData(0, 0, 224, 224);
    const tensor = tf.browser.fromPixels(imageData, 3)
      .expandDims()
      .div(255.0);
    
    model.predict(tensor).array().then(predictions => {
      const predictionArray = predictions[0];
      const maxIndex = predictionArray.indexOf(Math.max(...predictionArray));
      const confidence = predictionArray[maxIndex];
      
      const classes = ["Person 1", "Person 2", "Person 3"];
      const predictedClass = classes[maxIndex];
      
      // Показываем результат только если уверенность > 70%
      if (confidence > 0.7) {
        setPrediction(predictedClass);
        setConfidence(confidence);
      } else {
        setPrediction(null);
      }
      
      tensor.dispose();
    });
  };

  // Сделать снимок
  const takePhoto = () => {
    if (!videoRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    
    ctx.drawImage(videoRef.current, 0, 0);
    
    // Распознаем сделанный снимок
    processImage(canvas);
  };

  if (isLoading) {
    return (
      <div className="native-page flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <h2 className="native-feature-title">Загрузка модели...</h2>
          <p className="native-feature-text">Пожалуйста, подождите</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="native-page flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-red-400 text-6xl mb-4">
            <ExclamationIcon className="w-24 h-24 mx-auto" />
          </div>
          <h2 className="native-feature-title text-red-400">Произошла ошибка</h2>
          <p className="native-feature-text text-red-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="native-button bg-red-600 hover:bg-red-700"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="native-page">
      <div className="max-w-6xl mx-auto">
        {/* Заголовок */}
        <div className="text-center mb-8">
          <h1 className="native-title">
            Распознавание изображений с помощью ИИ
          </h1>
          <p className="native-description">
            Используйте камеру или загружайте фотографии для автоматического распознавания объектов
          </p>
        </div>

        {/* Основные кнопки */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <button
            onClick={isCameraActive ? stopCamera : startCamera}
            className={`native-button ${
              isCameraActive
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            <div className="flex items-center">
              {isCameraActive ? (
                <StopIcon className="w-5 h-5 mr-2" />
              ) : (
                <PlayIcon className="w-5 h-5 mr-2" />
              )}
              {isCameraActive ? 'Остановить камеру' : 'Запустить камеру'}
            </div>
          </button>

          <button
            onClick={async () => {
              try {
                const result = await requestCameraPermission();
                if (result.granted) {
                  // Показываем уведомление вместо alert
                  setCameraPermission('granted');
                  setPermissionMessage(result.message);
                } else {
                  setCameraPermission('denied');
                  setPermissionMessage(result.message);
                }
              } catch (err) {
                setCameraPermission('denied');
                setPermissionMessage('Ошибка при проверке разрешений: ' + err.message);
              }
            }}
            className="native-button bg-yellow-600 hover:bg-yellow-700"
            title="Проверить разрешения на камеру"
          >
            <div className="flex items-center">
              <LockIcon className="w-5 h-5 mr-2" />
              Проверить разрешения
            </div>
          </button>

          <label className="native-button bg-green-600 hover:bg-green-700 cursor-pointer">
            <div className="flex items-center">
              <FolderIcon className="w-5 h-5 mr-2" />
              Выбрать из галереи
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleGallerySelect}
              className="hidden"
            />
          </label>
        </div>

        {/* Статус разрешений камеры */}
        {cameraPermission !== 'unknown' && (
          <div className={`native-section mb-6 ${
            cameraPermission === 'granted' 
              ? 'bg-green-900/20 border-green-500/30' 
              : 'bg-red-900/20 border-red-500/30'
          }`}>
            <div className="flex items-center">
              <div className={`text-2xl mr-3 ${
                cameraPermission === 'granted' ? 'text-green-400' : 'text-red-400'
              }`}>
                {cameraPermission === 'granted' ? <CheckIcon className="w-8 h-8" /> : <XIcon className="w-8 h-8" />}
              </div>
              <div>
                <h4 className={`native-feature-title ${
                  cameraPermission === 'granted' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {cameraPermission === 'granted' ? 'Разрешения получены' : 'Проблема с разрешениями'}
                </h4>
                <p className={`native-feature-text ${
                  cameraPermission === 'granted' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {permissionMessage}
                </p>
                {cameraPermission === 'denied' && (
                  <div className="mt-2 space-y-1 text-xs text-red-400">
                    <p>• Нажмите кнопку "Проверить разрешения" для повторной попытки</p>
                    <p>• Убедитесь, что используете HTTPS соединение</p>
                    <p>• Разрешите доступ к камере в настройках браузера</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Ошибка камеры */}
        {cameraError && (
          <div className="native-section bg-red-900/20 border-red-500/30 mb-6">
            <div className="flex items-center">
              <div className="text-red-400 text-2xl mr-3">
                <PhotoIcon className="w-8 h-8" />
              </div>
              <div>
                <h4 className="native-feature-title text-red-400">Проблема с камерой</h4>
                <p className="native-feature-text text-red-400">{cameraError}</p>
                <div className="mt-2 space-y-1 text-xs text-red-400">
                  <p>• Убедитесь, что используете HTTPS соединение</p>
                  <p>• Разрешите доступ к камере в настройках браузера</p>
                  <p>• Попробуйте Chrome или Safari на мобильных устройствах</p>
                  <p>• Закройте другие приложения, использующие камеру</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Камера и результаты */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Камера/Изображение */}
          <div className="space-y-4">
            <h2 className="native-feature-title text-center">
              {isCameraActive ? 'Камера' : 'Изображение'}
            </h2>
            
            {isCameraActive ? (
              <div className="camera-container">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-80 object-cover rounded-xl"
                />
                <div className="camera-overlay">
                  <button
                    onClick={takePhoto}
                    className="native-button bg-white/90 hover:bg-white text-gray-800 px-6 py-3 rounded-full font-semibold transition-all transform hover:scale-110"
                  >
                    <div className="flex items-center">
                      <PhotoIcon className="w-5 h-5 mr-2" />
                      Сделать снимок
                    </div>
                  </button>
                </div>
              </div>
            ) : selectedImage ? (
              <div className="relative">
                <img
                  src={selectedImage}
                  alt="Выбранное изображение"
                  className="w-full h-80 object-cover rounded-xl"
                />
                <button
                  onClick={clearSelectedImage}
                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors"
                  title="Убрать изображение"
                >
                  <XIcon className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="bg-gray-800 w-full h-80 rounded-xl flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <div className="text-6xl mb-4">
                    <PhotoIcon className="w-24 h-24 mx-auto" />
                  </div>
                  <p>Камера неактивна</p>
                  <p className="text-sm mt-1">Выберите изображение из галереи</p>
                </div>
              </div>
            )}
          </div>

          {/* Результаты */}
          <div className="space-y-4">
            <h2 className="native-feature-title text-center">
              Результаты
            </h2>
            
            {prediction ? (
              <div className="native-card result-fade-in">
                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">
                    <TargetIcon className="w-16 h-16 text-green-400 mx-auto" />
                  </div>
                  <h3 className="native-feature-title mb-2">
                    Распознано: {prediction}
                  </h3>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${confidence * 100}%` }}
                    ></div>
                  </div>
                  <p className="native-feature-text mt-2">
                    Уверенность: {(confidence * 100).toFixed(1)}%
                  </p>
                </div>
                
                <div className="border-t border-gray-600 pt-4">
                  <h4 className="native-feature-title mb-2">Описание:</h4>
                  <p className="native-feature-text leading-relaxed">
                    {classDescriptions[prediction] || 'Описание для этого класса не найдено.'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="native-card text-center">
                <div className="text-6xl mb-4">
                  <SearchIcon className="w-24 h-24 text-blue-400 mx-auto" />
                </div>
                <h3 className="native-feature-title mb-2">
                  Ожидание изображения
                </h3>
                <p className="native-feature-text">
                  {isCameraActive 
                    ? 'Сделайте снимок или дождитесь автоматического распознавания'
                    : 'Запустите камеру или выберите изображение из галереи'
                  }
                </p>
              </div>
            )}

            {/* Инструкции */}
            <div className="native-instructions">
              <h4 className="native-instructions-title flex items-center">
                <LightBulbIcon className="w-5 h-5 mr-2" />
                Советы:
              </h4>
              <ul className="space-y-1">
                <li className="native-instructions-text">• Убедитесь, что объект хорошо освещен</li>
                <li className="native-instructions-text">• Попробуйте разные ракурсы</li>
                <li className="native-instructions-text">• Держите камеру неподвижно</li>
                <li className="native-instructions-text">• Если не распознается, попробуйте другой ракурс</li>
                <li className="native-instructions-text">• На Android используйте Chrome или Safari</li>
                <li className="native-instructions-text">• Убедитесь в HTTPS соединении</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Скрытый canvas для обработки изображений */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
}

export default App;
