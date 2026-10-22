import { useState } from 'react';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

// El ejemplo se limita a un archivo propio de la app.
const options = { path: 'challenge07/nota.txt', directory: Directory.Data, encoding: Encoding.UTF8 };
export default function useFilesystem() {
  const [content, setContent] = useState('');
  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  async function writeFile(text) {
    setError(''); setMessage('');
    try {
      await Filesystem.writeFile({ ...options, data: text, recursive: true });
      setMessage('Archivo guardado.');
    } catch (err) { setError(err.message); }
  }
  async function readFile() {
    setError(''); setMessage('');
    try { setContent((await Filesystem.readFile(options)).data); setMessage('Archivo leído.'); }
    catch (err) { setError(err.message); }
  }
  async function listFiles() {
    setError(''); setMessage('');
    try {
      const result = await Filesystem.readdir({ path: 'challenge07', directory: Directory.Data });
      setFiles(result.files); setMessage('Carpeta consultada.');
    } catch (err) { setError(err.message); }
  }
  async function deleteFile() {
    setError(''); setMessage('');
    try {
      await Filesystem.deleteFile(options);
      setContent(''); setFiles([]); setMessage('Archivo eliminado.');
    } catch (err) { setError(err.message); }
  }
  return { content, files, error, message, writeFile, readFile, listFiles, deleteFile };
}
