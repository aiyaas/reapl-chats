'use strict';

async function executeFeature(feature, searchQuery) {
  switch (feature) {
    case 'github': // GitHub Search
    {
      const [owner, repoPath] = searchQuery.split('/');
      const userData = await (await fetch(`https://api.github.com/users/${owner}`)).json();
      const repoData = await (await fetch(`https://api.github.com/repos/${owner}/${repoPath}/contents`)).json();

      return (`<img height="200px" width="100%" style="outline:none;border:none;box-shadow:0 0.5rem 1.5rem rgba(22, 28, 45, 0.1);border-radius:15px;object-fit:cover;" src="${userData.avatar_url}"></img>\n` + useMarkUpText('```' + JSON.stringify(repoData, null, 2) + '```')
      );
    }
    case 'youtube': // YouTube Search
    {
      const ytAuth = await (await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${searchQuery}&key=AIzaSyCRzpbNMkmCOcVy1VCiHjiNzdqYnWvN2ec`)).json();
      return (`<iframe height="250px" width="100%" style="outline:none;border:none;border-radius:10px;object-fit:cover;background:#000000;color:transparent;box-shadow:0 0.5rem 1.5rem rgba(22, 28, 45, 0.1);" src="https://www.youtube.com/embed/${ytAuth.items[0].id.videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe><br /><span>${ytAuth.items[0].snippet.description}</span>`);
    }
    case 'weather': // Weather Search
    {
      const data = await (await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${searchQuery}&appid=1fe5f03e8b679377cbc41601289edfdd&units=metric`)).json();
      const {
        name,
        main: { temp, feels_like, temp_min, temp_max, humidity, pressure },
        wind: { speed },
        weather,
        sys: { country, sunrise, sunset },
        coord: { lon, lat },
      } = data;

      const sunriseTime = new Date(sunrise * 1000).toLocaleTimeString();
      const sunsetTime = new Date(sunset * 1000).toLocaleTimeString();

      return (
        useMarkUpText(`This is the weather search result for ${searchQuery}. Weather accuracy is supported by Weather.org. \n\n**Weather in ${name}, ${country}** \n\nTemperature: ${temp}°C (Feels like: ${feels_like}°C) \nMin/Max Temperature: ${temp_min}°C / ${temp_max}°C \nWeather: ${weather[0].description} \nHumidity: ${humidity}% \nPressure: ${pressure} hPa \nWind Speed: ${speed} m/s \nCoordinates: [${lat}, ${lon}] \nSunrise: ${sunriseTime} \nSunset: ${sunsetTime}`) + `<img width="100px" height="100px" src="http://openweathermap.org/img/wn/${weather[0].icon}@2x.png" alt="Weather icon"></img>`);
    }
    case 'groq': // Groq Model Search
    {
      const res = await (await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer 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',
        },
        body: JSON.stringify({
          messages: [{
            'role': 'user',
            'content': searchQuery,
          }],
          model: 'llama-3.3-70b-versatile'
        })
      })).json();
      
      const results = res.choices[0].message.content.replace(/<(.*?)>/gis, '&#60;$1&#62;');
      return useMarkUpText(results);      
    }
    case 'gemini': // Gemini Model Search
    {     
      const res = await ( /** get data From vercel APIs */ await fetch(`https://api-mininxd.vercel.app/gemini/?q=${searchQuery}`)).json();      
      const results = res.text.replace(/<(.*?)>/gis, '&#60;$1&#62;');
            
      return useMarkUpText(results);
    }
    default:
      return 'Invalid feature selected.';
  }
}
