function AppFooter() {
    return (
      <footer
        className="text-center py-2 vh-20 bottom-0 mt-3"
        style={{ backgroundColor: "#6c757d", color: "black", fontSize: "0.8rem" }}
      >
        <div className="container">
          <div className="row ">
            {/* Sezione Contatti */}
            <div className="col-md-4 mb-1">
              <h5 style={{ fontSize: "1rem" }}>Contatti</h5>
              <p>Email: info@azienda.com</p>
              <p>Telefono: +39 0123 456789</p>
              <p>Indirizzo: Via delle Botteghe Oscure 1, Roma</p>
            </div>
            {/* Sezione Lavora con noi */}
            <div className="col-md-4 mb-1">
              <h5 style={{ fontSize: "1rem" }}>Lavora con noi</h5>
              <p>
                <a href="#" className="text-decoration-none text-black">
                  Posizioni aperte
                </a>
              </p>
              <p>
                <a href="#" className="text-decoration-none text-black">
                  Invia il tuo CV
                </a>
              </p>
              <p>
                <a href="#" className="text-decoration-none text-black">
                  Sedi lavorative
                </a>
              </p>
            </div>
            {/* Sezione Link Utili */}
            <div className="col-md-4 mb-1">
              <h5 style={{ fontSize: "1rem" }}>Link Utili</h5>
              <p>
                <a href="#" className="text-decoration-none text-black">
                  Chi siamo
                </a>
              </p>
              <p>
                <a href="#" className="text-decoration-none text-black">
                  Privacy Policy
                </a>
              </p>
              <p>
                <a href="#" className="text-decoration-none text-black">
                  Termini e Condizioni
                </a>
              </p>
            </div>
          </div>
          {/* Sezione finale */}
          <div className="mt-1">
            <p className="mb-2">
              &copy; 2025 Bool B&B. Tutti i diritti riservati.
            </p>
          </div>
        </div>
      </footer>
    );
  }
  
  export default AppFooter;