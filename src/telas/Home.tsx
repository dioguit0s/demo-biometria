import { useEffect, useState } from 'react';
import { Alert, ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native';
import { autenticar, checarSuporte, SuporteBiometria } from '../biometria';
import { biometriaAtiva, setBiometriaAtiva } from '../sessao';
import { cores, e } from '../estilo';

type Props = { onSair: () => void };

export default function Home({ onSair }: Props) {
  const [saldo, setSaldo] = useState(2450.9);
  const [saldoVisivel, setSaldoVisivel] = useState(false);
  const [bioAtiva, setBioAtiva] = useState(false);
  const [suporte, setSuporte] = useState<SuporteBiometria | null>(null);

  useEffect(() => {
    biometriaAtiva().then(setBioAtiva);
    checarSuporte().then(setSuporte);
  }, []);

  // Caso de uso 2: confirmar uma ação sensível (o "Pix com digital").
  async function fazerPix() {
    const r = await autenticar('Confirme o Pix de R$ 50,00');
    if (!r.ok) {
      Alert.alert('Pix não enviado', r.mensagem);
      return;
    }
    setSaldo((s) => s - 50);
    Alert.alert('Pix enviado ✅', 'R$ 50,00 para Maria Silva');
  }

  // Caso de uso 3: revelar dado sensível só após biometria.
  async function alternarSaldo() {
    if (saldoVisivel) return setSaldoVisivel(false);
    const r = await autenticar('Mostrar saldo');
    if (r.ok) setSaldoVisivel(true);
  }

  async function alternarBiometria(valor: boolean) {
    if (valor) {
      const r = await autenticar('Confirme para ativar a biometria');
      if (!r.ok) return Alert.alert('Não ativado', r.mensagem);
    }
    await setBiometriaAtiva(valor);
    setBioAtiva(valor);
  }

  const brl = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <ScrollView style={{ flex: 1, backgroundColor: cores.fundo }} contentContainerStyle={{ padding: 20, paddingTop: 64 }}>
      <Text style={e.titulo}>Olá! 👋</Text>

      <TouchableOpacity style={e.card} onPress={alternarSaldo}>
        <Text style={e.rotulo}>Saldo em conta (toque para {saldoVisivel ? 'ocultar' : 'mostrar'})</Text>
        <Text style={e.valor}>{saldoVisivel ? brl(saldo) : 'R$ ••••••'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={e.botao} onPress={fazerPix}>
        <Text style={e.botaoTexto}>Fazer Pix de R$ 50,00</Text>
      </TouchableOpacity>

      <View style={[e.card, { marginTop: 20 }]}>
        <View style={e.linha}>
          <Text style={{ fontSize: 16, color: cores.texto }}>Entrar com biometria</Text>
          <Switch value={bioAtiva} onValueChange={alternarBiometria} disabled={!suporte?.temCadastro} />
        </View>
      </View>

      {/* Painel de diagnóstico: útil para mostrar na apresentação o que a API retorna */}
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
