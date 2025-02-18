
function AppCard({immobile, defaultImage, Link, renderStars}) {
    return (
        <div className="col my-3" key={immobile.id}>
            <Link to={`/${immobile.slug}`}>
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
                            {renderStars(Number(immobile.voto_medio))}
                        </div>
                        <div className="d-flex justify-content-center align-items-center mb-2">
                            <button className="btn btn-outline-danger me-2" onClick={(e) => handleLike(e, immobile.id)}>❤️</button>
                            <span>{immobile.heartCount}</span>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
}

export default AppCard;