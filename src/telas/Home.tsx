import { useEffect, useState } from 'react';
import { Alert, ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native';
import { autenticar, checarSuporte, SuporteBiometria } from '../biometria';
import { biometriaAtiva, setBiometriaAtiva } from '../sessao';
import { cores, e } from '../estilo';

type Props = { onSair: () => void };

const VALOR_PROTEGIDO = 2450.9;

export default function Home({ onSair }: Props) {
  const [valorVisivel, setValorVisivel] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [bioAtiva, setBioAtiva] = useState(false);
  const [suporte, setSuporte] = useState<SuporteBiometria | null>(null);

  useEffect(() => {
    biometriaAtiva().then(setBioAtiva);
    checarSuporte().then(setSuporte);
  }, []);

  // O caso da demo: o valor só aparece depois da verificação biométrica.
  async function alternarValor() {
    setMensagem('');
    if (valorVisivel) return setValorVisivel(false);
    const r = await autenticar('Confirme sua identidade');
    if (r.ok) setValorVisivel(true);
    else setMensagem(r.mensagem);
  }

  async function alternarBiometria(valor: boolean) {
    if (valor) {
      const r = await autenticar('Confirme para ativar a biometria');
      if (!r.ok) return Alert.alert('Não ativado', r.mensagem);
    }
    await setBiometriaAtiva(valor);
    setBioAtiva(valor);
  }

  const formatar = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <ScrollView style={{ flex: 1, backgroundColor: cores.fundo }} contentContainerStyle={{ padding: 20, paddingTop: 64 }}>
      <Text style={e.titulo}>Olá! 👋</Text>

      <TouchableOpacity style={e.card} onPress={alternarValor}>
        <Text style={e.rotulo}>Valor protegido</Text>
        <Text style={e.valor}>{valorVisivel ? formatar(VALOR_PROTEGIDO) : 'R$ ••••••'}</Text>
        <Text style={[e.rotulo, { marginTop: 8, marginBottom: 0 }]}>
          {valorVisivel ? '🔓 Toque para ocultar' : '🔒 Toque para mostrar com a digital'}
        </Text>
      </TouchableOpacity>

      {!!mensagem && <Text style={e.erro}>{mensagem}</Text>}

      <View style={[e.card, { marginTop: 20 }]}>
        <View style={e.linha}>
          <Text style={{ fontSize: 16, color: cores.texto }}>Entrar com biometria</Text>
          <Switch value={bioAtiva} onValueChange={alternarBiometria} disabled={!suporte?.temCadastro} />
        </View>
      </View>

      {/* Painel de diagnóstico: mostra o que a API retorna sobre o aparelho */}
      <View style={e.card}>
        <Text style={[e.rotulo, { marginBottom: 8 }]}>Diagnóstico do aparelho</Text>
        <Text style={e.mono}>hasHardwareAsync(): {String(suporte?.temHardware)}</Text>
        <Text style={e.mono}>isEnrolledAsync(): {String(suporte?.temCadastro)}</Text>
        <Text style={e.mono}>tipos: {suporte?.tipos.join(', ') || '—'}</Text>
        <Text style={e.mono}>nível: {suporte?.nivel ?? '—'}</Text>
      </View>

      <TouchableOpacity onPress={onSair}>
        <Text style={[e.link, { color: cores.vermelho }]}>Sair da conta</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
