import * as SecureStore from 'expo-secure-store';

// SecureStore guarda os dados criptografados: no Android, em SharedPreferences
// cifradas com uma chave do Android Keystore.
// Nunca guarde token em AsyncStorage: lá ele fica em texto puro.

const CHAVE_TOKEN = 'sessao_token';
const CHAVE_BIOMETRIA = 'biometria_ativa';

export async function salvarToken(token: string) {
  await SecureStore.setItemAsync(CHAVE_TOKEN, token);
}

export function lerToken() {
  return SecureStore.getItemAsync(CHAVE_TOKEN);
}

export async function setBiometriaAtiva(ativa: boolean) {
  await SecureStore.setItemAsync(CHAVE_BIOMETRIA, ativa ? '1' : '0');
}

export async function biometriaAtiva() {
  return (await SecureStore.getItemAsync(CHAVE_BIOMETRIA)) === '1';
}

export async function encerrarSessao() {
  await SecureStore.deleteItemAsync(CHAVE_TOKEN);
  await SecureStore.deleteItemAsync(CHAVE_BIOMETRIA);
}

/** Simula a API do banco. Na vida real: POST /login -> token JWT. */
export async function loginFake(cpf: string, senha: string): Promise<string> {
  await new Promise((r) => setTimeout(r, 600));
  if (cpf.replace(/\D/g, '').length !== 11 || senha.length < 4) {
    throw new Error('CPF ou senha inválidos');
  }
  return `token-${Date.now()}`;
}
