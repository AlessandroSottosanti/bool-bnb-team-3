import { useAlertContext } from "../contexts/AlertContext";

function AppAlert() {
  const { error, setError } = useAlertContext();
  const {message, setMessage} = useAlertContext();

  if(error){
    return <div className="alert alert-danger text-center">{error}</div>;

  }

  else if (message) {
    return <div className="alert alert-success text-center">{message}</div>;
  }
}

export default AppAlert;
