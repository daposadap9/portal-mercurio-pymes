// pages/login.js
import React from 'react';
import Link from 'next/link';

const Login = () => {
  return (
    <div className="min-h-full flex items-center justify-center bg-slate-50">
      <div className="bg-white rounded-xl shadow-2xl p-8 m-4 max-w-md w-full">
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
              type="contraseña" 
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
        <p className="text-center text-sm text-gray-600 mt-4">
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
