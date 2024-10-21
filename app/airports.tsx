import client from "../api";

async function getAirports() {
  return await client.GET("/airports");
}

export default async function Airports() {
  const { data: airports, error } = await getAirports();
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <ul>
      {airports.airports.map((airport) => (
        <li key={airport?.code}>
          {airport?.code} {airport?.airport_info_url}
        </li>
      ))}
    </ul>
  );
}
