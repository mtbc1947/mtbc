import { useRouteError } from 'react-router-dom';

const RouteError = () => {
  const error = useRouteError();
  console.error(error);

  return (
    <div className="p-6 text-center">
      <h2 className="text-2xl font-bold mb-4">Oops! An error occurred.</h2>
      <p>{error.statusText || error.message || 'Unknown error'}</p>
    </div>
  );
};

export default RouteError;
