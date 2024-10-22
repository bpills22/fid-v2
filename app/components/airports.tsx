import client from "../../api";
import SearchAirports from "./search-airports";

async function getAirports() {
  return await client.GET("/airports");
}

export default async function Airports() {
  const { data, error } = await getAirports();
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <SearchAirports />
      <hr className="my-2" />
      <h3>Airports</h3>
      <ul>
        {data.airports.map((airport) => (
          <li key={airport?.code}>
            {airport?.code} {airport?.airport_info_url}
          </li>
        ))}
      </ul>
    </div>
  );
}
