import { useAlertContext } from "../contexts/AlertContext";

function AppAlert() {
  const { error, setError } = useAlertContext();
  const { message, setMessage } = useAlertContext();

  if (!error && !message) return null; // Non mostrare nulla se non ci sono messaggi

  return (
    <div
      className="position-fixed top-0 end-0 m-3 p-3 d-flex justify-content-center align-items-center"
      style={{ zIndex: 1050, minWidth: "250px" }}
    >
      {error && (
        <div className="alert alert-danger text-center">
          {error}
          <button
            type="button"
            className="btn-close ms-3"
            onClick={() => setError("")}
          ></button>
        </div>
      )}

      {message && (
        <div className="alert alert-success text-center">
          {message}
          <button
            type="button"
            className="btn-close ms-3"
            onClick={() => setMessage("")}
          ></button>
        </div>
      )}
    </div>
  );
}

export default AppAlert;
