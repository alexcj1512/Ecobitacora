interface EcobitacoraLogoProps {
  className?: string;
  showText?: boolean;
}

export default function EcobitacoraLogo({ className = "w-8 h-8", showText = true }: EcobitacoraLogoProps) {
  // Usar el logo de public directamente
  const logoUrl = '/logo-ecobitacora.png';

  // Mostrar el logo
  return (
    <div className="flex items-center space-x-2">
      <img 
        src={logoUrl}
        alt="Ecobitacora Logo" 
        className={`${className} object-cover rounded-full border-2 border-primary/20 shadow-md flex-shrink-0`}
        style={{ 
          width: '40px',
          height: '40px',
          objectFit: 'cover'
        }}
        onError={(e) => {
          // Si la imagen falla, ocultar
          e.currentTarget.style.display = 'none';
        }}
      />
      {showText && (
        <span className="text-xl font-bold whitespace-nowrap" style={{ 
          background: 'linear-gradient(135deg, #6B9080 0%, #7CB342 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          Ecobitacora
        </span>
      )}
    </div>
  );
}
