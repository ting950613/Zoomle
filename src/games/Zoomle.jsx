
import countries from "../../data/countries";

export default function Zoomle() {
  return (
    <div>
      <h1>Zoomle</h1>
      <ul>
        {countries.map((country, index) => (
          <li key={index}>{country}</li>
        ))}
      </ul>
    </div>
  );
}
