export type City = {
  name: string;
  lat: string;
  lon: string;
};

export type CitySolarData = {
  city: City;
  data: { date: string; sunrise: string; sunset: string }[];
};

export type DetailCitySolarData = {
  city: City;
  data: {
    date: string;
    sunrise: string;
    sunset: string;
    beginTwilight: string;
    endTwilight: string;
    transit: string;
    transitAzimuth: string;
    riseAzimuth: string;
    setAzimuth: string;
  }[];
};

export type Period = {
  formattedPeriod: string;
  startDate: string; // in 2024-09-16 format
  dates: Date[];
};
