import { Navigate, useParams } from "react-router-dom";

function SharedProductRedirect() {
  const { id } = useParams();
  return <Navigate to={`/menu/catalog?product=${id}`} replace />;
}

export default SharedProductRedirect;
