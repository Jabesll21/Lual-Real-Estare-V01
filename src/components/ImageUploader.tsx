import { useState } from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'

interface ImageUploaderProps {
  propertyId: string
  currentImages: string[]
  onImagesChange: (images: string[]) => void
}

export function ImageUploader({ propertyId, currentImages, onImagesChange }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)
    setUploadError('')

    const newImages = [...currentImages]

    for (const file of Array.from(files)) {
      // Validar que sea imagen
      if (!file.type.startsWith('image/')) {
        setUploadError('Solo se permiten archivos de imagen')
        continue
      }

      // Validar tamaño máximo 5MB
      if (file.size > 5 * 1024 * 1024) {
        setUploadError('La imagen no puede pesar más de 5MB')
        continue
      }

      // Crear nombre único para el archivo
      const fileExt = file.name.split('.').pop()
      const fileName = `${propertyId}/${Date.now()}.${fileExt}`

      // Subir a Supabase Storage
      const { error } = await supabase.storage
        .from('property-images')
        .upload(fileName, file)

      if (error) {
        setUploadError('Error al subir imagen: ' + error.message)
        continue
      }

      // Obtener URL pública
      const { data } = supabase.storage
        .from('property-images')
        .getPublicUrl(fileName)

      newImages.push(data.publicUrl)
    }

    onImagesChange(newImages)
    setIsUploading(false)

    // Limpiar input
    e.target.value = ''
  }

  const handleRemove = async (imageUrl: string, index: number) => {
    if (!confirm('¿Eliminar esta imagen?')) return

    // Extraer el path del archivo desde la URL
    const urlParts = imageUrl.split('/property-images/')
    if (urlParts.length > 1) {
      const filePath = urlParts[1]
      await supabase.storage
        .from('property-images')
        .remove([filePath])
    }

    const newImages = currentImages.filter((_, i) => i !== index)
    onImagesChange(newImages)
  }

  return (
    <div className="space-y-4">
      {/* Imágenes actuales */}
      {currentImages.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {currentImages.map((url, index) => (
            <div key={index} className="relative group aspect-video">
              <img
                src={url}
                alt={`Imagen ${index + 1}`}
                className="w-full h-full object-cover rounded-lg border border-border"
              />
              <button
                onClick={() => handleRemove(url, index)}
                className="absolute top-2 right-2 p-1 bg-destructive text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
              {index === 0 && (
                <span className="absolute bottom-2 left-2 text-xs bg-black/60 text-white px-2 py-0.5 rounded-full">
                  Principal
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Botón para subir */}
      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
        <input
          type="file"
          id="image-upload"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          disabled={isUploading}
        />
        <label
          htmlFor="image-upload"
          className="cursor-pointer flex flex-col items-center gap-2"
        >
          {isUploading ? (
            <>
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-muted-foreground">Subiendo imágenes...</p>
            </>
          ) : (
            <>
              <Upload className="w-8 h-8 text-muted-foreground" />
              <p className="text-sm font-medium">Haz clic para subir imágenes</p>
              <p className="text-xs text-muted-foreground">
                PNG, JPG hasta 5MB · Puedes subir varias a la vez
              </p>
            </>
          )}
        </label>
      </div>

      {uploadError && (
        <p className="text-sm text-destructive">{uploadError}</p>
      )}

      {currentImages.length === 0 && (
        <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
          <ImageIcon className="w-4 h-4 text-muted-foreground shrink-0" />
          <p className="text-xs text-muted-foreground">
            La primera imagen será la imagen principal de la propiedad
          </p>
        </div>
      )}
    </div>
  )
}