import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const apiUrl = import.meta.env.VITE_API_URL;

function HomePage() {
  const [immobili, setImmobili] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getImmobili();
  }, []);

  //funzione lista immobili
  const getImmobili = () => {
    axios
      .get(`${apiUrl}/immobili?order_by_voto=desc`)
      .then((resp) => {
        const immobiliWithLikes = resp.data.immobili.map((immobili) => {
          return { ...immobili, heartCount: 0 };
        })
        console.log(resp);
        setImmobili(immobiliWithLikes);
        console.log("Response get immobili:", {
          success: true,
          data: resp.data.results,
        });
      })
      .catch((error) => {
        console.error("Error in get immobili:", {
          success: false,
          message: error.message,
          data: error.response ? error.response.data : error,
        });
      });
  };

  //funzione barra di ricerca
  const handleSearch = () => {
    if (search.trim() !== "") {
      navigate(`/search?city=${search}`);
    }
  };

  //funzione enter
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSearch();
    }
  };

  const handleLike = (id) => {
    setImmobili((prevImmobili) => {
      const updated = prevImmobili.map((immobili) => {
        if (immobili.id === id) {
          return { ...immobili, heartCount: immobili.heartCount + 1 }
        }
        return immobili
      })
      updated.sort((a, b) => b.heartCount - a.heartCount)
      return updated
    })
  }

  //default image
  const defaultImage = "../images/placeholder.webp";

  return (
    <main>
      <h1 className="text-center my-3">Immobili🏢</h1>
      <div className="container">
        <div className="d-flex justify-content-between align-items-start">
          {/* Search  */}
          <div className="mb-3 flex-grow-1 d-flex flex-column align-items-center">
            <h5 className="mb-2">Inserisci città</h5>
            <div className="d-flex align-items-center w-100 justify-content-center">
              <input
                type="text"
                className="form-control w-25"
                placeholder="Cerca per città..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyUp={handleKeyPress}
              />
              <button className="btn btn-secondary ms-2" onClick={handleSearch}>Cerca</button>
            </div>
          </div>
          {/* Aggiunta di immobile */}
          <div className="mb-3 flex-grow-1 d-flex flex-column align-items-center text-center">
            <h5 className="mb-3">Vuoi aggiungere un immobile?</h5>
            <Link to="/create" className="btn btn-secondary">
              Aggiungi
            </Link>
          </div>
        </div>
      </div>
      <div className="container mt-3">
        <div className="row g-3 row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-5 row-cols-xl-6">
          {immobili &&
            immobili.slice(0, 10).map((immobile) => {
              if (immobile) {
                return (
                  <div className="col" key={immobile.id}>
                    <div className="card h-100 d-flex flex-column">
                      {/* Immagine segnaposto */}
                      <img
                        src={
                          immobile.image ? immobile.image : `${defaultImage}`
                        }
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
                        <div className="d-flex justify-content-center align-items-center mb-2">
                          <button className="btn btn-outline-danger me-2" onClick={() => handleLike(immobile.id)}>❤️</button>
                          <span>{immobile.heartCount}</span>
                        </div>
                        <Link
                          to={`/${immobile.slug}`}
                          className="btn btn-secondary"
                        >
                          Dettagli
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              }
            })}
        </div>
      </div>
    </main>
  );
}

export default HomePage;
