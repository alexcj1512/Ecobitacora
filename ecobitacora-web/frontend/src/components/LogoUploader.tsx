import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Check, X } from 'lucide-react';

interface LogoUploaderProps {
  currentLogo?: string;
  onUploadSuccess?: (url: string) => void;
}

export default function LogoUploader({ currentLogo, onUploadSuccess }: LogoUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentLogo || null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar que sea imagen
    if (!file.type.startsWith('image/')) {
      setError('Solo se permiten imágenes');
      return;
    }

    // Validar tamaño (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('La imagen no debe superar 5MB');
      return;
    }

    setError(null);
    setUploading(true);

    try {
      // Crear preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Subir al servidor
      const formData = new FormData();
      formData.append('logo', file);

      const response = await fetch('http://localhost:5000/api/upload/logo', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Error al subir la imagen');
      }

      const data = await response.json();
      
      // Guardar URL del logo en el usuario
      const updateResponse = await fetch('http://localhost:5000/api/user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ logoUrl: `http://localhost:5000${data.url}` }),
      });

      if (!updateResponse.ok) {
        throw new Error('Error al actualizar el logo del usuario');
      }

      setSuccess(true);
      
      if (onUploadSuccess) {
        onUploadSuccess(data.url);
      }

      // Recargar la página para mostrar el nuevo logo
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Error al subir la imagen');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <h3 className="text-xl font-bold text-text-primary mb-4">Logo Principal</h3>
      
      <div className="space-y-4">
        {/* Preview */}
        {preview && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full aspect-square max-w-xs mx-auto rounded-xl overflow-hidden border-2 border-primary/20"
          >
            <img
              src={preview}
              alt="Logo preview"
              className="w-full h-full object-contain bg-gradient-to-br from-primary/5 to-accent/5"
            />
          </motion.div>
        )}

        {/* Upload Button */}
        <label className="block">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            disabled={uploading}
          />
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex items-center justify-center space-x-2 py-3 px-6 rounded-xl cursor-pointer transition-all ${
              uploading
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-primary to-accent text-white hover:shadow-lg'
            }`}
          >
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                <span>Subiendo...</span>
              </>
            ) : success ? (
              <>
                <Check className="w-5 h-5" />
                <span>¡Subido con éxito!</span>
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                <span>Subir Logo</span>
              </>
            )}
          </motion.div>
        </label>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700"
          >
            <X className="w-5 h-5" />
            <span className="text-sm">{error}</span>
          </motion.div>
        )}

        {/* Info */}
        <p className="text-xs text-text-secondary text-center">
          Formatos: JPG, PNG, GIF • Tamaño máximo: 5MB
        </p>
      </div>
    </div>
  );
}
