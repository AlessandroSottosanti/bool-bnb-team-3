import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const apiUrl = import.meta.env.VITE_API_URL;

function HomePage() {
  const [immobili, setImmobili] = useState([]);

  useEffect(() => {
    getImmobili();
  }, []);

  const getImmobili = () => {
    axios
      .get(`${apiUrl}/immobili`)
      .then((resp) => {
        setImmobili(resp.data.results);
        return console.log("Response get immobili:", {
          success: true,
          data: resp.data.results,
        });
      })
      .catch((resp) => {
        return console.log("Response get immobili:", {
          success: false,
          data: resp,
        });
      });
  };

  return (
    <>
      <h1 className="text-center my-3">Immobili</h1>
      <div className="text-center mb-3">
        <h5 className="mb-3">
          🏢 Vuoi aggiungere un immobile? Clicca il bottone! 🏢
        </h5>
        <Link to="/create" className="btn btn-secondary">
          Aggiungi
        </Link>
      </div>
      <div className="container">
        <div className="row g-3 row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-5 row-cols-xl-6">
          {immobili &&
            immobili.map((immobile) => {
              return (
                <div className="col" key={immobile.id}>
                  <div className="card h-100 d-flex flex-column">
                    <div
                      className="card-header text-center d-flex align-items-center justify-content-center"
                      style={{ minHeight: "80px" }}>
                      <h5 className="m-0">{immobile.titolo_descrittivo}</h5>
                    </div>
                    <div className="card-body d-flex flex-column flex-grow-1">
                      <p className="flex-grow-1">{immobile.descrizione}</p>
                    </div>
                  </div>
                </div>
              )
            })}
        </div>
      </div>
    </>
  );
}

export default HomePage;
