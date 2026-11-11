import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, AppState, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Login from './src/telas/Login';
import Bloqueio from './src/telas/Bloqueio';
import Home from './src/telas/Home';
import { biometriaAtiva, encerrarSessao, lerToken } from './src/sessao';
import { cores } from './src/estilo';

type Estado = 'carregando' | 'login' | 'bloqueado' | 'home';

// Tempo em segundo plano antes de pedir biometria de novo (bancos usam 0–5 min).
const TEMPO_BLOQUEIO_MS = 5_000;

export default function App() {
  const [estado, setEstado] = useState<Estado>('carregando');
  const saiuEm = useRef<number | null>(null);

  // Caso de uso 1: ao abrir o app, se há sessão salva + biometria ativa -> tela de bloqueio.
  useEffect(() => {
    (async () => {
      const token = await lerToken();
      if (!token) return setEstado('login');
      setEstado((await biometriaAtiva()) ? 'bloqueado' : 'home');
    })();
  }, []);

  // Bloqueia de novo quando o app volta do segundo plano depois de X segundos.
  useEffect(() => {
    const sub = AppState.addEventListener('change', async (proximo) => {
      if (proximo === 'background') {
        saiuEm.current = Date.now();
      } else if (proximo === 'active' && saiuEm.current) {
        const ausente = Date.now() - saiuEm.current;
        saiuEm.current = null;
        if (ausente > TEMPO_BLOQUEIO_MS && (await biometriaAtiva())) {
          setEstado((atual) => (atual === 'home' ? 'bloqueado' : atual));
        }
      }
    });
    return () => sub.remove();
  }, []);

  async function sair() {
    await encerrarSessao();
    setEstado('login');
  }

  return (
    <>
      <StatusBar style={estado === 'bloqueado' ? 'light' : 'dark'} />
      {estado === 'carregando' && (
        <View style={{ flex: 1, justifyContent: 'center', backgroundColor: cores.fundo }}>
          <ActivityIndicator color={cores.roxo} size="large" />
        </View>
      )}
      {estado === 'login' && <Login onEntrou={() => setEstado('home')} />}
      {estado === 'bloqueado' && <Bloqueio onDesbloqueou={() => setEstado('home')} onUsarSenha={sair} />}
      {estado === 'home' && <Home onSair={sair} />}
    </>
  );
}
