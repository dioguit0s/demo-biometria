import { useState } from 'react';
import { ActivityIndicator, Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { autenticar, checarSuporte } from '../biometria';
import { loginFake, salvarToken, setBiometriaAtiva } from '../sessao';
import { e } from '../estilo';

type Props = { onEntrou: () => void };

export default function Login({ onEntrou }: Props) {
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  async function entrar() {
    setErro('');
    setCarregando(true);
    try {
      const token = await loginFake(cpf, senha);
      await salvarToken(token);
      await oferecerBiometria();
      onEntrou();
    } catch (err) {
      setErro((err as Error).message);
    } finally {
      setCarregando(false);
    }
  }

  // Igual aos apps de banco: depois do 1º login com senha, pergunta se quer ativar.
  async function oferecerBiometria() {
    const suporte = await checarSuporte();
    if (!suporte.temHardware || !suporte.temCadastro) return;

    const quer = await new Promise<boolean>((resolve) =>
      Alert.alert(
        'Entrar com biometria?',
        `Use ${suporte.tipos.join(' / ') || 'biometria'} para abrir o app na próxima vez.`,
        [
          { text: 'Agora não', style: 'cancel', onPress: () => resolve(false) },
          { text: 'Ativar', onPress: () => resolve(true) },
        ],
      ),
    );
    if (!quer) return;

    // Confirma a biometria antes de ativar (prova que o dono do celular está ali).
    const r = await autenticar('Confirme para ativar a biometria');
    await setBiometriaAtiva(r.ok);
  }

  return (
    <View style={e.tela}>
      <Text style={e.titulo}>Banco Demo</Text>
      <Text style={e.sub}>Entre com CPF e senha</Text>

      <TextInput
        style={e.input}
        placeholder="CPF (11 dígitos)"
        keyboardType="number-pad"
        value={cpf}
        onChangeText={setCpf}
        maxLength={14}
      />
      <TextInput
        style={e.input}
        placeholder="Senha (mín. 4 caracteres)"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />

      <TouchableOpacity style={e.botao} onPress={entrar} disabled={carregando}>
        {carregando ? <ActivityIndicator color="#fff" /> : <Text style={e.botaoTexto}>Entrar</Text>}
      </TouchableOpacity>

      {!!erro && <Text style={e.erro}>{erro}</Text>}
    </View>
  );
}
