export default async function Apod() {
  const response = await fetch('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY');
  const apod = await response.json();

  return (
    <main>
      <h1>Astronomy Picture of the Day</h1>
      <p>
        <img src={apod.url} />
      </p>
      <h2>{apod.date}</h2>
      <p>{apod.title}</p>
      <p>{apod.explanation}</p>
    </main>
  );
}