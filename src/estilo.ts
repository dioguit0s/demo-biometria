import { StyleSheet } from 'react-native';

export const cores = {
  roxo: '#6C2BD9',
  roxoEscuro: '#4B1A9E',
  fundo: '#F5F3FA',
  texto: '#1E1B2E',
  cinza: '#6B6880',
  verde: '#16A34A',
  vermelho: '#DC2626',
  branco: '#FFFFFF',
};

export const e = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo, padding: 24, justifyContent: 'center' },
  telaRoxa: { flex: 1, backgroundColor: cores.roxo, padding: 24, justifyContent: 'center', alignItems: 'center' },
  titulo: { fontSize: 28, fontWeight: '700', color: cores.texto, marginBottom: 8 },
  sub: { fontSize: 15, color: cores.cinza, marginBottom: 24 },
  input: {
    backgroundColor: cores.branco,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2DFEC',
  },
  botao: { backgroundColor: cores.roxo, borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 8 },
  botaoTexto: { color: cores.branco, fontSize: 16, fontWeight: '600' },
  botaoClaro: { backgroundColor: cores.branco, borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 8 },
  botaoClaroTexto: { color: cores.roxo, fontSize: 16, fontWeight: '600' },
  link: { color: cores.roxo, fontSize: 15, textAlign: 'center', marginTop: 16 },
  erro: { color: cores.vermelho, fontSize: 14, marginTop: 8, textAlign: 'center' },
  card: { backgroundColor: cores.branco, borderRadius: 16, padding: 18, marginBottom: 14 },
  rotulo: { fontSize: 13, color: cores.cinza, marginBottom: 4 },
  valor: { fontSize: 26, fontWeight: '700', color: cores.texto },
  linha: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 4 },
  mono: { fontFamily: 'monospace', fontSize: 13, color: cores.texto },
});
