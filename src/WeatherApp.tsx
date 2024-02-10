/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

const API_KEY = '4zpMA0sCv9c0mWmWawmliB:0F9ksrn4Y8fGOdANLTaIDN';
const API_URL_BASE = 'https://api.collectapi.com/weather/getWeather?data.lang=tr&data.city=';

interface WeatherData {
  date: string;
  day: string;
  icon: string;
  description: string;
  status: string;
  degree: string;
  min: string;
  max: string;
  night: string;
  humidity: string;
}

const Alert: React.FC<{ message: string }> = ({ message }) => (
  <div className="p-3 mb-4 text-white bg-red-500 rounded">{message}</div>
);

const WeatherApp: React.FC = () => {
  const { register, handleSubmit } = useForm();
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [city, setCity] = useState<string>('');

  const [error, setError] = useState<string | null>(null);
  const [firstLoad, setFirstLoad] = useState<boolean>(true);

  useEffect(() => {
    if (firstLoad) {
      setFirstLoad(false);
      return;
    }
    fetchData();
  }, [city]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL_BASE}${city}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `apikey ${API_KEY}`
        }
      });
      const data = await response.json();
      if (!data.result || data.result.length === 0) {
        setError("Şehir bulunamadı. Lütfen geçerli bir şehir adı girin.");
        setWeatherData([]);
        return;
      }
      setWeatherData(data.result);
      setError(null);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setError("Bir hata oluştu. Lütfen daha sonra tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: any) => {
    const cityName = data.city.trim();
    if (!isNaN(Number(cityName))) {
      setError("Şehir bulunamadı. Lütfen geçerli bir şehir adı girin.");
      setWeatherData([]);
      setLoading(false);
    } else {
      setCity(cityName);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen text-white bg-black">
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex justify-center mb-4">
            <input
              type="text"
              placeholder="Enter location"
              className="p-2 mr-2 text-white bg-gray-800"
              {...register('city', { required: true })}
            />
            <button type="submit" className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-600">Get Weather</button>
          </div>
        </form>
        {error && <Alert message={error} />}
        {!firstLoad && !loading && weatherData.length > 0 && (
          <table className="mx-auto mt-4 border border-collapse border-gray-400">
            <thead>
              <tr>
                <th className="px-4 py-2 border border-gray-400">Day</th>
                <th className="px-4 py-2 border border-gray-400">Date</th>
                <th className="px-4 py-2 border border-gray-400">Degree (°C)</th>
                <th className="px-4 py-2 border border-gray-400">Description</th>
                <th className="px-4 py-2 border border-gray-400">Humidity (%)</th>
                <th className="px-4 py-2 border border-gray-400">Max Temperature (°C)</th>
                <th className="px-4 py-2 border border-gray-400">Min Temperature (°C)</th>
                <th className="px-4 py-2 border border-gray-400">Night Temperature (°C)</th>
                <th className="px-4 py-2 border border-gray-400">Status</th>
                <th className="px-4 py-2 border border-gray-400">Icon</th>
              </tr>
            </thead>
            <tbody>
              {weatherData.map((data, index) => (
                <tr key={index}>
                  <td className="px-4 py-2 border border-gray-400">{data.day === 'Pazartesi' ? 'Monday' : data.day === 'Salı' ? 'Tuesday' : data.day === 'Çarşamba' ? 'Wednesday' : data.day === 'Perşembe' ? 'Thursday' : data.day === 'Cuma' ? 'Friday' : data.day === 'Cumartesi' ? 'Saturday' : 'Sunday'}</td>
                  <td className="px-4 py-2 border border-gray-400">{data.date}</td>
                  <td className="px-4 py-2 border border-gray-400">{data.degree}°C</td>
                  <td className="px-4 py-2 border border-gray-400">
                    {data.description === 'açık' ? 'Clear' :
                      data.description === 'yağmurlu' ? 'Rainy' :
                        data.description === 'kapalı' ? 'Cloudy' :
                          data.description === 'karlı' ? 'Snowy' :
                            data.description === 'sisli' ? 'Foggy' :
                              data.description === 'rüzgarlı' ? 'Windy' :
                                data.description === 'az bulutlu' ? 'Partly Cloudy' :
                                  data.description === 'hafif yağmur' ? 'Light Rain' :
                                    data.description === 'parçalı az bulutlu' ? 'Partly Cloudy' :
                                      data.description === 'orta şiddetli yağmur' ? 'Moderate Rain' :
                                        data.description === 'şiddetli yağmur' ? 'Heavy Rain' :
                                          data.description === 'parçalı bulutlu' ? 'Partly Cloudy' : 'Unknown'}
                  </td>
                  <td className="px-4 py-2 border border-gray-400">{data.humidity}%</td>
                  <td className="px-4 py-2 border border-gray-400">{data.max}°C</td>
                  <td className="px-4 py-2 border border-gray-400">{data.min}°C</td>
                  <td className="px-4 py-2 border border-gray-400">{data.night}°C</td>
                  <td className="px-4 py-2 border border-gray-400">{data.status}</td>
                  <td className="px-4 py-2 border border-gray-400"><img src={data.icon} alt="Weather Icon" className="w-10 h-10" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default WeatherApp;
