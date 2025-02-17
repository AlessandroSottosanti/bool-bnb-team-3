import axios from "axios";
import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";

function SearchPage() {
    const [search, setSearch] = useState("");
    const [immobili, setImmobili] = useState([]);
    const [warning, setWarning] = useState("");
    const [hasSearched, setHasSearched] = useState(false);
    const [postiLetto, setPostiLetto] = useState(0);
    const [tipologia, setTipologia] = useState("");
    const [tipiAlloggio, setTipiAlloggio] = useState("");
    const [postiLocali, setPostiLocali] = useState(0);
    const [postiBagno, setPostiBagno] = useState(0);
    const [superficieMinima, setSuperficieMinima] = useState(0);
    const [superficieMassima, setSuperficieMassima] = useState(0);



    //useParams search city
    const [searchParams] = useSearchParams();
    const initialCity = searchParams.get("city") || ""; //ottengo la città dall'url
    const [searchCity, setSearchCity] = useState(initialCity);

    const backEndUrl = import.meta.env.VITE_API_URL;

    //use effect per i risultati iniziali
    useEffect(() => {
        if (searchCity.trim() !== "") {
            setSearch(searchCity);
            getImmobili(searchCity);
        }
    }, [searchCity]);


    const getImmobili = (city) => {
        axios
            .get(`${backEndUrl}/immobili?order_by_voto=desc`)
            .then((resp) => {
                console.log("Risposta immobili:", resp.data);
                const immobili = resp.data.immobili;

                const risultatiFiltrati = immobili.filter((immobile) => {
                    const indirizzo = immobile.indirizzo_completo
                        ? immobile.indirizzo_completo.toLowerCase()
                        : "";
                    const tipiAlloggioIds = immobile.tipi_alloggio.map((tipo) => tipo.id);
                    return (
                        indirizzo.includes(city.toLowerCase()) &&
                        immobile.posti_letto >= postiLetto &&
                        (tipologia === "" ||
                            immobile.tipo_alloggio.toLowerCase() ===
                            tipologia.toLowerCase()) &&
                        (tipiAlloggio.trim() === "" ||
                            tipiAlloggioIds.includes(parseInt(tipiAlloggio)))
                    );
                });

                setImmobili(risultatiFiltrati);
                setHasSearched(true);
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
        getImmobili(search);
        setSearchCity(search);
    };

    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            handleSearch();
        }
    };

    //Implemento i cuoricini per il rating dell'immobile

    const renderStars = (voto) => {
        const fullStars = Math.ceil(voto);
        const emptyStars = 5 - fullStars;
        const stars = [];
        for (let i = 0; i < fullStars; i++) {
            stars.push(<i key={`full-${i}`} className="fa-solid fa-star"></i>); // Aggiungi un `key` univoco
        }
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<i key={`empty-${i}`} className="fa-regular fa-star"></i>); // Aggiungi un `key` univoco
        }
        return stars;
    };

    //default image
    const defaultImage = "../images/placeholder.webp";

    return (
        <main>
             <div className="text-center">
                <h1 className="mt-3">Ricerca Avanzata</h1>
            </div>

            <div className="container mt-4">
                <div className="row g-1">
                    <div className="col-12 d-flex flex-column align-items-center">
                        <label htmlFor="ricerca"><strong>Città o Indirizzo</strong></label>
                        <input
                            className="form-control w-100 custom-width-city"
                            id="ricerca"
                            type="search"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            onKeyUp={handleKeyPress}
                        />
                    </div>
                    <div className="col-12 col-md-4 d-flex flex-column align-items-center">
                        <label htmlFor="postiLetto"><strong>Numero di posti letto</strong></label>
                        <input
                            className="form-control w-100 custom-width"
                            id="postiLetto"
                            type="number"
                            value={postiLetto}
                            onChange={(event) => setPostiLetto(event.target.value)}
                            onKeyUp={handleKeyPress}
                        />
                    </div>
                    <div className="col-12 col-md-4 d-flex flex-column align-items-center">
                        <label htmlFor="tipiAlloggio"><strong>Tipologia immobile</strong></label>
                        <input
                            className="form-control w-100 custom-width"
                            id="tipiAlloggio"
                            type="text"
                            value={tipiAlloggio}
                            onChange={(event) => setTipiAlloggio(event.target.value)}
                            onKeyUp={handleKeyPress}
                        />
                    </div>
                    <div className="col-12 col-md-4 d-flex flex-column align-items-center">
                        <label htmlFor="NumeroLocali"><strong>Numero Locali</strong></label>
                        <input
                            className="form-control w-100 custom-width"
                            id="NumeroLocali"
                            type="number"
                            value={postiLocali}
                            onChange={(event) => setPostiLocali(event.target.value)}
                            onKeyUp={handleKeyPress}
                        />
                    </div>
                    <div className="col-12 col-md-4 d-flex flex-column align-items-center">
                        <label htmlFor="NumeroBagni"><strong>Numero Bagni</strong></label>
                        <input
                            className="form-control w-100 custom-width"
                            id="NumeroBagni"
                            type="number"
                            value={postiBagno}
                            onChange={(event) => setPostiBagno(event.target.value)}
                            onKeyUp={handleKeyPress}
                        />
                    </div>
                    <div className="col-12 col-md-4 d-flex flex-column align-items-center">
                        <label htmlFor="SuperficieMinima"><strong>Superficie minima</strong></label>
                        <input
                            className="form-control w-100 custom-width"
                            id="SuperficieMinima"
                            type="number"
                            value={superficieMinima}
                            onChange={(event) => setSuperficieMinima(event.target.value)}
                            onKeyUp={handleKeyPress}
                        />
                    </div>
                    <div className="col-12 col-md-4 d-flex flex-column align-items-center">
                        <label htmlFor="SuperficieMassima"><strong>Superficie massima</strong></label>
                        <input
                            className="form-control w-100 custom-width"
                            id="SuperficieMassima"
                            type="number"
                            value={superficieMassima}
                            onChange={(event) => setSuperficieMassima(event.target.value)}
                            onKeyUp={handleKeyPress}
                        />
                    </div>
                </div>
            </div>

            <div className="text-center mt-3">
                <button className="btn btn-secondary" onClick={handleSearch}>
                    Cerca
                </button>
            </div>

            {warning && <p className="text-danger text-center mt-2">{warning}</p>}

            {hasSearched && immobili.length > 0 ? (
                <div className="container mt-4">
                    <div className="row g-3 row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4">
                        {immobili.map((immobile) => (
                            <div className="col" key={immobile.id}>
                                <div className="card h-100">
                                    <img
                                        src={immobile.image || "default.jpg"}
                                        alt={immobile.titolo_descrittivo}
                                        className="card-img-top"
                                    />
                                    <div className="card-header text-center">
                                        <h5 className="m-0">{immobile.titolo_descrittivo}</h5>
                                    </div>
                                    <div className="card-body text-center">
                                        <p><strong>Descrizione:</strong> {immobile.descrizione}</p>
                                        <p><strong>Indirizzo:</strong> {immobile.indirizzo_completo}</p>
                                        <p><strong>Numero di stanze:</strong> {immobile.locali}</p>
                                        <p><strong>Numero di posti letto:</strong> {immobile.posti_letto}</p>
                                        <p><strong>Numero di bagni:</strong> {immobile.bagni}</p>
                                        <p><strong>Mq:</strong> {immobile.mq}</p>
                                        <p><strong>Voto:</strong> ★★★★☆</p>
                                        <p><strong>Numero di recensioni:</strong> {immobile.tot_recensioni}</p>
                                        <Link to={`/${immobile.slug}`} className="btn btn-secondary">
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
        </main>
    );
}

export default SearchPage;
