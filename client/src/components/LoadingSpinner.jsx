import { Spinner } from '../styles/LoadingSpinner.styles';

const LoadingSpinner = ({ size = 'small', color = 'white' }) => {
   return <Spinner size={size} color={color} />;
};

export default LoadingSpinner;