type WeatherData = {
  city: string;
  temp: number;
  unit: 'celsius' | 'fahrenheit';
  condition: string;
  humidity: number;
  wind: number;
};

const conditionIcon: Record<string, string> = {
  Sunny: '☀️',
  Clear: '🌤️',
  'Partly Cloudy': '⛅',
  Overcast: '☁️',
  Rainy: '🌧️',
  Stormy: '⛈️',
};

export default function WeatherCard({ data }: { data: WeatherData }) {
  const icon = conditionIcon[data.condition] ?? '🌡️';
  const unitSymbol = data.unit === 'celsius' ? '°C' : '°F';

  return (
    <div className="rounded-xl border border-blue-800 bg-gradient-to-br from-blue-950 to-indigo-950 p-4 w-64">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-xs text-blue-400 uppercase tracking-widest">Weather</p>
          <p className="text-white font-semibold">{data.city}</p>
        </div>
        <span className="text-3xl">{icon}</span>
      </div>

      <p className="text-4xl font-bold text-white mb-1">
        {data.temp}
        <span className="text-xl text-blue-300">{unitSymbol}</span>
      </p>
      <p className="text-sm text-blue-300 mb-3">{data.condition}</p>

      <div className="flex gap-4 text-xs text-blue-400">
        <span>💧 {data.humidity}% humidity</span>
        <span>💨 {data.wind} km/h</span>
      </div>
    </div>
  );
}
