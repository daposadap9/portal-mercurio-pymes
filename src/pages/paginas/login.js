import React, { useState, useContext } from 'react';
import { useMutation, gql } from '@apollo/client';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { ThemeContext } from '@/context/ThemeContext';
import { UserContext } from '@/context/UserContext'; // Importa el contexto

// Mutación para login de usuario regular
const LOGIN_REGULAR_USER = gql`
  mutation LoginRegularUser($email: String!, $password: String!) {
    loginRegularUser(email: $email, password: $password) {
      success
      message
      user {
        id
        email
        name
      }
    }
  }
`;

// Mutación para registrar un usuario regular
const REGISTER_REGULAR_USER = gql`
  mutation RegisterRegularUser($email: String!, $password: String!, $name: String) {
    registerRegularUser(email: $email, password: $password, name: $name) {
      success
      message
      user {
        id
        email
        name
      }
    }
  }
`;

const Login = () => {
  const router = useRouter();
  const { theme } = useContext(ThemeContext);
  const { setUser } = useContext(UserContext); // Extrae setUser del contexto
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Mutación para login
  const [loginRegularUser, { loading: loginLoading }] = useMutation(LOGIN_REGULAR_USER, {
    onCompleted: (data) => {
      if (data.loginRegularUser.success) {
        alert(data.loginRegularUser.message);
        // Guarda el usuario en el contexto
        setUser(data.loginRegularUser.user);
        router.push('/'); // Redirige a la página principal tras login exitoso
      } else {
        setErrorMsg(data.loginRegularUser.message);
      }
    },
    onError: (error) => {
      setErrorMsg("Error al iniciar sesión: " + error.message);
    }
  });

  // Mutación para registro
  const [registerRegularUser, { loading: registerLoading }] = useMutation(REGISTER_REGULAR_USER, {
    onCompleted: (data) => {
      if (data.registerRegularUser.success) {
        alert(data.registerRegularUser.message);
        // Guarda el usuario en el contexto (opcionalmente) o cambia al modo login
        setUser(data.registerRegularUser.user);
        router.push('/');
      } else {
        setErrorMsg(data.registerRegularUser.message);
      }
    },
    onError: (error) => {
      setErrorMsg("Error al registrarse: " + error.message);
    }
  });

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Por favor, ingrese email y contraseña.');
      return;
    }
    setErrorMsg('');
    await loginRegularUser({ variables: { email, password } });
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || !name) {
      setErrorMsg('Por favor, complete todos los campos para registrarse.');
      return;
    }
    setErrorMsg('');
    await registerRegularUser({ variables: { email, password, name } });
  };

  const logoSrc = (theme === 'dark' || theme === 'purple')
    ? '/logo-servisoft-30years-dark.png'
    : '/logo-servisoft-30years.png';

  const cardBgClass = (theme === 'dark')
    ? 'bg-custom-gradient'
    : theme === 'purple'
      ? 'bg-custom-gradient2'
      : 'bg-custom-gradient3';

  let containerShadow;
  if (theme === 'dark') {
    containerShadow = 'shadow-[0_0_15px_rgba(127,255,212,0.8)]';
  } else if (theme === 'purple') {
    containerShadow = 'shadow-[0_0_20px_rgba(255,255,255,0.8)]';
  } else {
    containerShadow = 'shadow-2xl';
  }

  return (
    <div className="min-h-full flex items-center justify-center py-10">
      <div className={`${cardBgClass} rounded-xl ${containerShadow} p-8 m-4 max-w-md w-full`}>
        <div className="flex justify-center mb-6">
          <Image src={logoSrc} alt="Logo Mercurio" width={120} height={120} />
        </div>
        <h2 className="text-2xl font-bold text-center text-teal-600 mb-6">
          {isRegister ? 'Regístrate' : 'Iniciar Sesión'}
        </h2>
        <form onSubmit={isRegister ? handleRegisterSubmit : handleLoginSubmit}>
          {isRegister && (
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">
                Nombre
              </label>
              <input
                type="text"
                id="name"
                placeholder="Tu nombre"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Tu email"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 font-semibold mb-2">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              placeholder="********"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {errorMsg && <p className="text-red-500 mb-4">{errorMsg}</p>}
          <button
            type="submit"
            className="w-full bg-teal-500 text-white font-bold py-2 px-4 rounded-md transition-colors duration-300 ease-in-out hover:bg-teal-600"
            disabled={loginLoading || registerLoading}
          >
            {loginLoading || registerLoading ? 'Cargando...' : (isRegister ? 'Registrarse' : 'Ingresar')}
          </button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-4">
          {isRegister ? '¿Ya tienes una cuenta?' : '¿No tienes cuenta?'}
          <button
            onClick={() => {
              setErrorMsg('');
              setIsRegister(!isRegister);
            }}
            className="ml-2 text-teal-500 font-bold"
          >
            {isRegister ? 'Inicia Sesión' : 'Regístrate'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
