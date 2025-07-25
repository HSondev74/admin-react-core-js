// project imports
import AuthWrapper from '../../components/sections/auth/AuthWrapper';
import AuthLogin from '../../components/sections/auth/AuthLogin';

// ================================|| JWT - LOGIN ||================================ //

export default function Login() {
  return (
    <AuthWrapper>
      <AuthLogin />
    </AuthWrapper>
  );
}
