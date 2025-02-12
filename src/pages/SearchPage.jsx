import axios from "axios";
import { useEffect, useState } from "react";

function SearchPage() {

    const [search, setSearch] = useState("");
    const [immobili, setImmobili] = useState([]);
    const [warning, setWarning] = useState("");

    const backEndUrl = import.meta.env.VITE_API_URL;

    const getImmobili = (query) => {
        axios.get(`${backEndUrl}/immobili`, {
            params: {
                q: query
            }
        })
        .then((resp) => {
            setImmobili(resp.data.results);
        })
        .catch((err) => {
            console.error("Errore nel recupero degli immobili:", err);
            setWarning("Errore nel recupero degli immobili. Riprova più tardi.");
        });
    };

    const handleSearch = () => {
        getImmobili(search);
    };

    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            handleSearch();
        }
    };

    return (
        <>
        <div className="text-center">
            <h1>Ricerca Avanzata</h1>
        </div>
        
        <label htmlFor="ricerca" className="mx-5"><strong>Inserisci una città o un indirizzo</strong></label>
        <input className="form-control w-25 mx-5" id="ricerca" type="search" value={search} 
            onChange={(event) => setSearch(event.target.value)} onKeyPress={handleKeyPress} />
        
        <button className="btn btn-secondary mx-5" onClick={handleSearch}>
            Cerca
        </button>

        {warning && <p className="text-danger mx-5">{warning}</p>}

        {immobili.length > 0 && (
            <div className="container mt-4">
                <div className="row g-3 row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-5 row-cols-xl-6">
                    {immobili.map((immobile) => {
                        return (
                            <div className="col" key={immobile.id}>
                                <div className="card h-100 d-flex flex-column">
                                    <img
                                        src={immobile.image}
                                        alt={immobile.titolo_descrittivo}
                                        className="card-img-top"
                                    />
                                    <div
                                        className="card-header text-center d-flex align-items-center justify-content-center"
                                        style={{ minHeight: "80px" }}
                                    >
                                        <h5 className="m-0">{immobile.titolo_descrittivo}</h5>
                                    </div>
                                    <div className="card-body d-flex flex-column flex-grow-1 text-center">
                                        <p className="flex-grow-1">{immobile.descrizione}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        )}
        </>
    );
}

export default SearchPage;
