import { useState } from 'react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

export default function useCamera() {
  const [photo, setPhoto] = useState('');
  const [error, setError] = useState('');
  async function takePhoto(source = CameraSource.Camera) {
    setError('');
    try {
      const image = await Camera.getPhoto({
        quality: 90, resultType: CameraResultType.Uri, source, webUseInput: true,
      });
      setPhoto(image.webPath);
    } catch (err) { setError(err.message || 'No se obtuvo una foto.'); }
  }
  return { photo, error, takePhoto };
}
