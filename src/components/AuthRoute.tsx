import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { isLoggedInAtom } from 'recoil/state/authAtom';

interface AuthRouteProps {
  needLogin: boolean;
}

const AuthRoute = ({ needLogin }: AuthRouteProps) => {
  const navigate = useNavigate();
  const isLoggedIn = useRecoilValue(isLoggedInAtom);

  useEffect(() => {
    const LoginRoute = () => {
      if (!isLoggedIn) {
        navigate('/signin');
        window.alert('로그인이 필요합니다');
      }
    };

    const NotLoginRoute = () => {
      if (isLoggedIn) {
        navigate('/');
      }
    };

    if (needLogin) {
      LoginRoute();
    } else {
      NotLoginRoute();
    }
  }, [needLogin, isLoggedIn, navigate]);

  return <Outlet />;
};

export default AuthRoute;
