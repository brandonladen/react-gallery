
import { Navigate } from 'react-router-dom';

// Redirect from the default Index page to our HomePage component
const Index = () => {
  return <Navigate to="/" replace />;
};

export default Index;
