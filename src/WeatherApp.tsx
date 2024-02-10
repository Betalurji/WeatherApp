import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

const API_KEY = '4zpMA0sCv9c0mWmWawmliB:0F9ksrn4Y8fGOdANLTaIDN';
const API_URL_BASE = 'https://api.collectapi.com/weather/getWeather?data.lang=en&data.city=';


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

  useEffect(() => {
    requestLocation();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const requestLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          console.log("Latitude:", latitude);
          console.log("Longitude:", longitude);
          getCityName(latitude, longitude);
        },
        (error) => {
          console.error("Access to location information is denied:", error.message);
          setError("Permission to access location information has been denied. Please try again with location permission.");
        }
      );
    } else {
      console.error("Browser location API is not supported.");
      setError("Browser location API is not supported.");
    }
  };

  const getCityName = async (latitude: number, longitude: number) => {
    try {
      const response = await axios.get(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
      const cityName = response.data.city;
      setCity(cityName);
      fetchData(cityName);
    } catch (error) {
      console.error("Error retrieving city name:", error);
      setError("Something went wrong. Please try again later.");
    }
  };

  const fetchData = async (cityName: string) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL_BASE}${cityName}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `apikey ${API_KEY}`
        }
      });
      const data = response.data;
      if (!data.result || data.result.length === 0) {
        setError("City not found. Please enter a valid city name.");
        setWeatherData([]);
        return;
      }
      setWeatherData(data.result);
      setError(null);
    } catch (error) {
      console.error('Error retrieving weather data:', error);
      setError("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: any) => {
    const cityName = data.city.trim();
    if (!isNaN(Number(cityName))) {
      setError("City not found. Please enter a valid city name.");
      setWeatherData([]);
      setLoading(false);
    } else {
      setCity(cityName);
      fetchData(cityName);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen text-white bg-gray-700">
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex justify-center mb-4">
            <input
              type="text"
              placeholder="Enter location"
              className="p-2 mr-2 text-white bg-gray-800"
              defaultValue={city}
              {...register('city', { required: true })}
            />
            <button type="submit" className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-600">Get Weather</button>
          </div>
        </form>
        {error && <Alert message={error} />}
        {!loading && weatherData.length > 0 && (
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
                <th className="px-4 py-2 border border-gray-400"></th>
              </tr>
            </thead>
            <tbody>
              {weatherData.map((data, index) => (
                <tr key={index}>
                  <td className="px-4 py-2 border border-gray-400">{data.day}</td>
                  <td className="px-4 py-2 border border-gray-400">{data.date}</td>
                  <td className="px-4 py-2 border border-gray-400">{data.degree}°C</td>
                  <td className="px-4 py-2 border border-gray-400">{data.description}</td>
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
