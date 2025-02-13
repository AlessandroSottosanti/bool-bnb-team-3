function AppFooter() {
    return (
      <footer className="footer text-center text-white py-2 vh-20 bottom-0 mt-3">
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
              <h5 className="lavora-con-noi">Lavora con noi</h5>
              <p>
                <a href="#" className="text-decoration-none text-white">
                  Posizioni aperte
                </a>
              </p>
              <p>
                <a href="#" className="text-decoration-none text-white">
                  Invia il tuo CV
                </a>
              </p>
              <p>
                <a href="#" className="text-decoration-none text-white">
                  Sedi lavorative
                </a>
              </p>
            </div>
            {/* Sezione Link Utili */}
            <div className="col-md-4 mb-1">
              <h5 className="link-utili">Link Utili</h5>
              <p>
                <a href="#" className="text-decoration-none text-white">
                  Chi siamo
                </a>
              </p>
              <p>
                <a href="#" className="text-decoration-none text-white">
                  Privacy Policy
                </a>
              </p>
              <p>
                <a href="#" className="text-decoration-none text-white">
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