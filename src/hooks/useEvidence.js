import { useEffect, useRef, useState } from 'react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Directory, Filesystem } from '@capacitor/filesystem';

export default function useEvidence(uid, completeMission) {
  const [photo, setPhoto] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const taking = useRef(false);
  const alive = useRef(false);
  useEffect(() => {
    alive.current = true;
    async function restore() {
      try {
        const path = localStorage.getItem(`parcial2:photo:${uid}`);
        if (!path) return;
        const image = await Filesystem.readFile({ directory: Directory.Data, path });
        if (alive.current) setPhoto(`data:image/${path.split('.').pop()};base64,${image.data}`);
      } catch {
        if (alive.current) setError('La evidencia guardada no está disponible en este dispositivo.');
      }
    }
    void restore();
    return () => { alive.current = false; };
  }, [uid]);

  async function takePhoto() {
    if (taking.current) return;
    taking.current = true; setBusy(true); setError('');
    try {
      const image = await Camera.getPhoto({
        source: CameraSource.Camera, resultType: CameraResultType.Base64,
        quality: 70, width: 1280, correctOrientation: true, webUseInput: true,
      });
      if (!image.base64String) throw new Error('La cámara no devolvió una imagen.');
      if (!alive.current) return;
      const path = `parcial2/${uid}/evidencia.${image.format}`;
      await Filesystem.writeFile({ directory: Directory.Data, path, data: image.base64String, recursive: true });
      if (!alive.current) return;
      localStorage.setItem(`parcial2:photo:${uid}`, path);
      setPhoto(`data:image/${image.format};base64,${image.base64String}`);
      if (!completeMission(1)) setError('La imagen se guardó. Si la misión sigue pendiente, vuelve a intentar para guardar el progreso.');
    } catch (err) {
      if (alive.current) setError(`No se completó la misión de foto: ${err.message || 'captura cancelada'}`);
    } finally {
      taking.current = false;
      if (alive.current) setBusy(false);
    }
  }
  return { photo, busy, error, takePhoto };
}
