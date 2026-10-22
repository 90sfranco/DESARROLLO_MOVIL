import { useState } from 'react';
import { Device } from '@capacitor/device';

export default function useDevice() {
  const [info, setInfo] = useState(null);
  const [battery, setBattery] = useState(null);
  const [deviceId, setDeviceId] = useState('');
  const [error, setError] = useState('');
  async function loadDeviceData() {
    setError('');
    try {
      setInfo(await Device.getInfo());
      setDeviceId((await Device.getId()).identifier);
      setBattery(await Device.getBatteryInfo());
    } catch (err) { setError(err.message); }
  }
  return { info, battery, deviceId, error, loadDeviceData };
}
