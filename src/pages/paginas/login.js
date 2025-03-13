import React from 'react';
import { FaFacebook, FaTwitter } from 'react-icons/fa';

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-[#ffffff] rounded-lg overflow-hidden flex flex-col md:flex-row shadow-lg h-auto md:h-[80vh]">
        {/* Lado izquierdo */}
        <div 
          className="w-full md:w-1/2 relative bg-cover bg-center"
          style={{ backgroundImage: "linear-gradient(, #a3b0cc), url('https://source.unsplash.com/featured/?office,developers')" }}
        >
          {/* Vectores decorativos */}
          <div className="absolute top-4 left-4">
            <svg className="w-12 h-12" viewBox="0 0 100 100" fill="#ffffff" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="50" opacity="0.3" />
            </svg>
          </div>
          <div className="absolute bottom-4 right-4">
            <svg className="w-8 h-8" viewBox="0 0 100 100" fill="#ffffff" xmlns="http://www.w3.org/2000/svg">
              <rect width="100" height="100" rx="20" opacity="0.3" />
            </svg>
          </div>
          <div className="flex flex-col items-center justify-center h-full space-y-4 p-4">
            {/* Logo reemplazando el título */}
            <img src="/logo-servisoft-30years.png" alt="Logo Servisfoft" className="h-36 drop-shadow-[0_0_1px_rgba(0,0,0,0.9)]" />
            <p className="text-[#ffffff] text-2xl font-bold drop-shadow-[0_0_1px_rgba(0,0,0,0.9)] text-center">
              ¡Aquí amamos lo que hacemos!
            </p>
            <div className="space-y-3 w-full px-4">
              <a 
                href="#"
                className="block bg-[#3B5998] hover:bg-[#334d84] text-[#ffffff] py-2 px-4 sm:px-6 rounded-full shadow-md flex items-center justify-center"
              >
                Ingresar con Mercurio SGDEA
              </a>
              <a 
                href="#"
                className="block bg-[#1DA1F2] hover:bg-[#1A91DA] text-[#ffffff] py-2 px-4 sm:px-6 rounded-full shadow-md flex items-center justify-center"
              >
                Ingresar con Mercurio PYMES
              </a>
            </div>
          </div>
        </div>
        {/* Lado derecho */}
        <div className="w-full md:w-1/2 p-6 flex flex-col justify-center">
          <h5 className="text-2xl font-bold text-center mb-4 text-[#1F2937]">Ingresar</h5>
          <p className="text-sm text-center mb-6 text-[#374151]">
            ¿No tienes cuenta?{' '}
            <a href="#" className="text-[#3B82F6] hover:underline">
              crea tu cuenta
            </a>{' '}
            tarda menos de un minuto
          </p>
          <div className="space-y-6">
            <input 
              type="text" 
              placeholder="Usuario"
              className="w-full px-3 py-2 border-b-2 border-[#D1D5DB] focus:outline-none focus:border-[#3B82F6]"
            />
            <input 
              type="password" 
              placeholder="Ingresa tu contraseña"
              className="w-full px-3 py-2 border-b-2 border-[#D1D5DB] focus:outline-none focus:border-[#3B82F6]"
            />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-6">
            <label className="flex items-center text-sm text-[#374151]">
              <input type="checkbox" className="form-checkbox h-4 w-4 text-[#2563EB]" defaultChecked />
              <span className="ml-2">Recordarme</span>
            </label>
            <p className="text-sm mt-2 sm:mt-0">
              <a href="#" className="text-[#3B82F6] hover:underline">
                olvidaste tu contraseña?
              </a>
            </p>
          </div>
          <button className="mt-8 self-end bg-[#1E3A8A] text-[#ffffff] px-6 py-2 rounded-full shadow-md hover:bg-[#1E40AF]">
            <a href="#">ingresar</a>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
