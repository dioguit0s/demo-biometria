import * as LocalAuthentication from 'expo-local-authentication';

export type SuporteBiometria = {
  temHardware: boolean;
  temCadastro: boolean;
  tipos: string[];
  nivel: string;
};

const NOMES_TIPO: Record<number, string> = {
  [LocalAuthentication.AuthenticationType.FINGERPRINT]: 'Digital',
  [LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION]: 'Rosto',
  [LocalAuthentication.AuthenticationType.IRIS]: 'Íris',
};

const NOMES_NIVEL: Record<number, string> = {
  [LocalAuthentication.SecurityLevel.NONE]: 'Nenhum',
  [LocalAuthentication.SecurityLevel.SECRET]: 'Só PIN/senha',
  [LocalAuthentication.SecurityLevel.BIOMETRIC_WEAK]: 'Biometria fraca',
  [LocalAuthentication.SecurityLevel.BIOMETRIC_STRONG]: 'Biometria forte',
};

/** Passo 1: o aparelho tem sensor? O usuário cadastrou digital/rosto? */
export async function checarSuporte(): Promise<SuporteBiometria> {
  const [temHardware, temCadastro, tipos, nivel] = await Promise.all([
    LocalAuthentication.hasHardwareAsync(),
    LocalAuthentication.isEnrolledAsync(),
    LocalAuthentication.supportedAuthenticationTypesAsync(),
    LocalAuthentication.getEnrolledLevelAsync(),
  ]);

  return {
    temHardware,
    temCadastro,
    tipos: tipos.map((t) => NOMES_TIPO[t] ?? `Tipo ${t}`),
    nivel: NOMES_NIVEL[nivel] ?? `Nível ${nivel}`,
  };
}

export type ResultadoAuth = { ok: true } | { ok: false; erro: string; mensagem: string };

/** Passo 2: abre o prompt nativo do Android (BiometricPrompt). */
export async function autenticar(motivo: string): Promise<ResultadoAuth> {
  const resultado = await LocalAuthentication.authenticateAsync({
    promptMessage: motivo,
    cancelLabel: 'Cancelar',
    disableDeviceFallback: false, // permite cair para PIN/padrão do aparelho
    biometricsSecurityLevel: 'strong', // só Classe 3 (digital, face 3D); recusa face 2D
  });

  if (resultado.success) return { ok: true };
  return { ok: false, erro: resultado.error, mensagem: traduzirErro(resultado.error) };
}

/** Passo 3: tratar cada erro de um jeito que faça sentido pro usuário. */
export function traduzirErro(erro: string): string {
  switch (erro) {
    case 'user_cancel':
    case 'system_cancel':
    case 'app_cancel':
      return 'Autenticação cancelada.';
    case 'not_enrolled':
      return 'Nenhuma digital ou rosto cadastrado no aparelho.';
    case 'passcode_not_set':
      return 'Configure uma senha de bloqueio no aparelho primeiro.';
    case 'lockout':
      return 'Muitas tentativas. Desbloqueie o celular com a senha e tente de novo.';
    case 'not_available':
      return 'Biometria indisponível neste aparelho.';
    case 'user_fallback':
      return 'Você escolheu entrar com a senha.';
    case 'authentication_failed':
      return 'Biometria não reconhecida.';
    default:
      return `Não foi possível autenticar (${erro}).`;
  }
}
