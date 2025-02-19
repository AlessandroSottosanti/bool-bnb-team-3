import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AppCard from "../components/AppCard";

const apiUrl = import.meta.env.VITE_API_URL;

function HomePage() {
  const [immobili, setImmobili] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0,0);
    getImmobili();
  }, []);

  useEffect(() => {
    const savedHeartCounts = JSON.parse(localStorage.getItem("heartCounts")) || {};
    setImmobili((prevImmobili) =>
      prevImmobili.map((immobile) => ({
        ...immobile,
        heartCount: savedHeartCounts[immobile.id] || 0,
      }))
    );
  }, []);

  useEffect(() => {
    if (immobili.length > 0) {
      const heartCounts = immobili.reduce((acc, immobile) => {
        acc[immobile.id] = immobile.heartCount;
        return acc;
      }, {});
      localStorage.setItem("heartCounts", JSON.stringify(heartCounts));
    }
  }, [immobili]);

  //funzione lista immobili
  const getImmobili = () => {
    axios
      .get(`${apiUrl}/immobili?order_by_voto=desc`)
      .then((resp) => {
        const savedHeartCounts = JSON.parse(localStorage.getItem("heartCounts")) || {};
        const immobiliWithLikes = resp.data.immobili.map((immobili) => {
          return { ...immobili, heartCount: savedHeartCounts[immobili.id] || 0, voto: immobili.voto_medio || 0 }
        })
        immobiliWithLikes.sort((a, b) => b.heartCount - a.heartCount || b.voto - a.voto);
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

  const handleLike = (event, id) => {
    event.stopPropagation();
    event.preventDefault();
    setImmobili((prevImmobili) => {
      const updated = prevImmobili.map((immobili) => {
        if (immobili.id === id) {
          return { ...immobili, heartCount: immobili.heartCount + 1 }
        }
        return immobili
      })
      updated.sort((a, b) => b.heartCount - a.heartCount || b.voto - a.voto);
      return updated
    })
  }

  //default image
  const defaultImage = "../images/placeholder.webp";

  const renderStars = (voto) => {
    const fullStars = Math.ceil(voto);
    const emptyStars = 5 - fullStars;
    const stars = [];
    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={`full-${i}`} className="fa-solid fa-star"></i>);
    }
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className="fa-regular fa-star"></i>);
    }
    return stars;
  };


  return (
    <main>
  {/* Hero Section */}
<div className="hero position-relative text-white text-center">
  {/* Background Image */}
  <img
    src={`${apiUrl}/images/hero.jpg`}
    alt="Hero Image"
    className="img-fluid w-100"
    style={{ objectFit: "cover", height: "400px" }}
  />
  
  {/* Overlay per rendere leggibile il testo */}
  <div 
    className="position-absolute top-0 start-0 w-100 h-100"
    style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }} // Sfondo nero trasparente
  ></div>

  {/* Contenuto sopra l'overlay */}
  <div className="hero-overlay position-absolute top-50 start-50 translate-middle">
    <h1 className="fw-bold">Trova la Casa dei Tuoi Sogni 🏡</h1>
    <p className="fs-5">
      Scopri le migliori proprietà selezionate per te! Ville con piscina, appartamenti moderni e panoramici. 
    </p>
    <Link to={`/search`} className="btn btn-orange mt-2">Ricerca Avanzata</Link>
  </div>
</div>


  {/* Search & Add Section */}
  <div className="container my-5">
    <div className="d-flex justify-content-center align-items-center flex-wrap gap-5">
      {/* Search  */}
      <div className="d-flex gap-2 align-items-center">
        <h5 className="mb-2">Inserisci città / via</h5>
        <div className="d-flex align-items-center w-100 justify-content-center">
          <input
            type="text"
            className="form-control"
            placeholder="Cerca..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyUp={handleKeyPress}
          />
          <button className="btn btn-orange ms-2" onClick={handleSearch}>Cerca</button>
        </div>
      </div>

      <div className="d-flex gap-2 align-items-center justify-content-center">
        <span className="text-big">Vuoi aggiungere un immobile?</span>
        <Link to="/create" className="btn btn-outline-orange">
          + Aggiungi
        </Link>
      </div>
    </div>
  </div>

  {/* Property Listings */}
  <div className="container d-flex justify-content-center mt-3">
    <h1>I 10 migliori immobili del momento 🏢:</h1>
  </div>
  <div className="container mt-3">
    <div className="row g-3 row-cols-1 row-cols-lg-2 row-cols-xxl-4">
      {immobili &&
        immobili.slice(0, 10).map((immobile) => {
          if (immobile) {
            return (
              <AppCard
                key={immobile.slug}
                immobile={immobile}
                defaultImage={defaultImage}
                Link={Link}
                renderStars={renderStars}
                handleLike={handleLike}
                apiUrl={apiUrl}
                bagni={immobile.bagni}
                locali={immobile.locali}
                postiLetto={immobile.posti_letto}
                alloggio={immobile.alloggio}
                mq={immobile.mq}
              />
            );
          }
        })}
    </div>
  </div>
</main>

  );
}

export default HomePage;
