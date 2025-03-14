import React, { useContext } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ThemeContext } from '@/context/ThemeContext';

const Login = () => {
  const { theme } = useContext(ThemeContext);
  // En dark y purple se utiliza el logo oscuro
  const logoSrc =
    theme === 'dark' || theme === 'purple'
      ? '/logo-servisoft-30years-dark.png'
      : '/logo-servisoft-30years.png';

      const cardBgClass =
    theme === 'dark'
      ? 'bg-custom-gradient'
      : theme === 'purple'
      ? 'bg-custom-gradient2'
      : 'bg-custom-gradient3';
  // Selecciona la sombra según el tema:
  let containerShadow;
  if (theme === 'dark') {
    // Efecto neón aguamarina
    containerShadow = 'shadow-[0_0_15px_rgba(127,255,212,0.8)]';
  } else if (theme === 'purple') {
    // Efecto neón blanco
    containerShadow = 'shadow-[0_0_20px_rgba(255,255,255,0.8)]';
  } else {
    // Para light, la sombra es la tradicional
    containerShadow = 'shadow-2xl';
  }

  return (
    <div className="min-h-full flex items-center justify-center">
      <div className={`${cardBgClass} rounded-xl ${containerShadow} p-8 m-4 max-w-md w-full`}>
        <div className="flex justify-center mb-6">
          <Image src={logoSrc} alt="Logo Mercurio" width={120} height={120} />
        </div>
        <h2 className="text-2xl font-bold text-center text-teal-600 mb-6">
          Iniciar Sesión
        </h2>
        <form>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">
              Usuario
            </label>
            <input
              type="email"
              id="email"
              placeholder="Tu usuario"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="contraseña" className="block text-gray-700 font-semibold mb-2">
              Contraseña
            </label>
            <input
              type="password"
              id="contraseña"
              placeholder="********"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-teal-500 text-white font-bold py-2 px-4 rounded-md transition-colors duration-300 ease-in-out hover:bg-teal-600"
          >
            Ingresar
          </button>
        </form>
        <p className="text-center text-sm text-gra mt-4">
          ¿No tienes cuenta?{' '}
          <Link href="/register" legacyBehavior>
            <a className="text-teal-500 font-bold">Regístrate</a>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
