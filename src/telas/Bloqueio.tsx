import { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { autenticar } from '../biometria';
import { e } from '../estilo';

type Props = { onDesbloqueou: () => void; onUsarSenha: () => void };

export default function Bloqueio({ onDesbloqueou, onUsarSenha }: Props) {
  const [mensagem, setMensagem] = useState('');

  async function tentar() {
    setMensagem('');
    const r = await autenticar('Desbloqueie o Banco Demo');
    if (r.ok) onDesbloqueou();
    else setMensagem(r.mensagem);
  }

  // Abre o prompt assim que a tela aparece, como nos apps de banco.
  useEffect(() => {
    tentar();
  }, []);

  return (
    <View style={e.telaRoxa}>
      <Text style={{ fontSize: 64, marginBottom: 12 }}>🔒</Text>
      <Text style={[e.titulo, { color: '#fff' }]}>App bloqueado</Text>
      <Text style={[e.sub, { color: '#E9DDFF', textAlign: 'center' }]}>
        Use sua biometria para continuar
      </Text>

      <TouchableOpacity style={[e.botaoClaro, { alignSelf: 'stretch' }]} onPress={tentar}>
        <Text style={e.botaoClaroTexto}>Tentar de novo</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onUsarSenha}>
        <Text style={[e.link, { color: '#fff' }]}>Entrar com CPF e senha</Text>
      </TouchableOpacity>

      {!!mensagem && <Text style={[e.erro, { color: '#FFD4D4' }]}>{mensagem}</Text>}
    </View>
  );
}
