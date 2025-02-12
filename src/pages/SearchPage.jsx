import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";

function SearchPage() {
  const [search, setSearch] = useState("");
  const [immobili, setImmobili] = useState([]);
  const [warning, setWarning] = useState("");
  const [hasSearched, setHasSearched] = useState(false); // Stato per mostrare i risultati solo dopo la ricerca

  const backEndUrl = import.meta.env.VITE_API_URL;

  const getImmobili = () => {
    axios
      .get(`${backEndUrl}/immobili?order_by_voto=desc`)
      .then((resp) => {
        const risultatiFiltrati = resp.data.immobili.filter((immobile) => {
          const indirizzo = immobile.indirizzo_completo
            ? immobile.indirizzo_completo.toLowerCase()
            : "";
          return indirizzo.includes(search.toLowerCase());
        });
        setImmobili(risultatiFiltrati);
        setHasSearched(true); // Mostra i risultati dopo la ricerca
      })
      .catch((err) => {
        console.error("Errore nel recupero degli immobili:", err);
        setWarning("Errore nel recupero degli immobili. Riprova più tardi.");
      });
  };

  const handleSearch = () => {
    if (search.trim() === "") {
      setWarning("Inserisci una città o un indirizzo per la ricerca.");
      return;
    }
    setWarning(""); // Reset del messaggio di errore
    getImmobili();
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSearch();
    }
  };

  //default image
  const defaultImage = "../images/placeholder.webp";

  return (
    <>
      <div className="text-center">
        <h1 className="mt-3">Ricerca Avanzata</h1>
      </div>

      <label htmlFor="ricerca" className="mx-5">
        <strong>Inserisci una città o un indirizzo</strong>
      </label>
      <input
        className="form-control w-25 mx-5"
        id="ricerca"
        type="search"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        onKeyUp={handleKeyPress}
      />

      <button className="btn btn-secondary mx-5 mt-2" onClick={handleSearch}>
        Cerca
      </button>

      {warning && <p className="text-danger mx-5 mt-2">{warning}</p>}

      {hasSearched && immobili.length > 0 ? (
        <div className="container mt-4">
          <div className="row g-3 row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-5 row-cols-xl-6">
            {immobili.map((immobile) => (
              <div className="col" key={immobile.id}>
                <div className="card h-100 d-flex flex-column">
                  {/* Immagine segnaposto */}
                  <img
                    src={immobile.image ? immobile.image : `${defaultImage}`}
                    alt={immobile.titolo_descrittivo}
                    className=""
                  />
                  <div
                    className="card-header text-center d-flex align-items-center justify-content-center"
                    style={{ minHeight: "80px" }}
                  >
                    <h5 className="m-0">{immobile.titolo_descrittivo}</h5>
                  </div>
                  <div className="card-body d-flex flex-column flex-grow-1 text-center">
                    <p className="flex-grow-1">{immobile.descrizione}</p>
                    <p className="flex-grow-1">
                      <strong>Indirizzo: </strong>
                      {immobile.indirizzo_completo}
                    </p>
                    <p className="flex-grow-1">
                      <strong>Numero di stanze: </strong>
                      {immobile.locali}
                    </p>
                    <p className="flex-grow-1">
                      <strong>Numero di bagni: </strong>
                      {immobile.bagni}
                    </p>
                    <p className="flex-grow-1">
                      <strong>Mq: </strong>
                      {immobile.mq}
                    </p>
                    <Link
                        to={`/${immobile.slug}`}
                        className="btn btn-secondary"
                      >
                        Dettagli
                      </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : hasSearched && immobili.length === 0 ? (
        <p className="text-center mt-4">Nessun risultato trovato</p>
      ) : null}
    </>
  );
}

export default SearchPage;
