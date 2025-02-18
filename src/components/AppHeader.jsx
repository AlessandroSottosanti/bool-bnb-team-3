import { NavLink } from "react-router-dom";

function AppHeader() {
  const navLinks = [
    {
      path: "/",
      title: "HomePage",
    },

    {
      path: "/create",
      title: "Aggiungi Immobile",
    },

    {
      path: "/search",
      title: "Ricerca Avanzata",
    },
  ];

  return (
    <>
      <header>
        <nav className="navbar navbar-expand-lg bg-secondary">
          <div className="container-fluid">
              <NavLink className="navbar-brand" to="/">
                <img
                  src="../images/newlogo.png"
                  style={{ width: "70px", height: "70px" }}
                />
              </NavLink>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <i className="fa-solid fa-bars"></i>
            </button>
            <div
              className="collapse navbar-collapse"
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav me-auto mb-2 mb-lg-0 d-flex justify-content-center">
                {navLinks.map((curItem, index) => {
                  return (
                    <li className="nav-item" key={index}>
                      <NavLink
                        className="nav-link"
                        aria-current="page"
                        to={curItem.path}
                      >
                        {curItem.title}
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}

export default AppHeader;
