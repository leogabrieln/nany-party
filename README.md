# Nany's Birthday

Site de aniversário em React + Vite, com navegação multi-page e identidade visual inspirada no convite original.

## Rodar localmente

1. Instale Node.js LTS.
2. Extraia/abra a pasta no VS Code.
3. Execute `npm install`.
4. Execute `npm run dev` e abra o endereço indicado pelo Vite.

## Páginas

- `/` — Home
- `/convite` — Convite e confirmação de presença
- `/mural` — Mural de memórias
- `/quiz` — Quem conhece a Nany?
- `/cabine` — Cabine de fotos
- `/trilha` — A trilha da festa
- `/album` — Álbum da festa

## Integração Supabase (armazenamento compartilhado)

Fotos da cabine, recados do mural e pontuações do quiz ficam num banco na nuvem (Supabase), então todos os convidados veem as mesmas informações. Mural, álbum e ranking se atualizam sozinhos a cada ~10 segundos. Sem credenciais o site cai no modo local (cada celular só vê o que ele mesmo enviou), útil só para desenvolvimento.

1. Crie um projeto grátis em [supabase.com](https://supabase.com/) (New project).
2. Abra **SQL Editor → New query**, cole todo o conteúdo de `supabase/setup.sql` e clique em **Run**. Isso cria as tabelas, as permissões e os dois buckets de fotos (`memory-photos` e `party-photos`).
3. Em **Project Settings → API**, copie a *Project URL* e a chave *anon / publishable*.
4. Copie `.env.example` para `.env` e preencha `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`. Reinicie o `npm run dev`.
5. **Na hospedagem** (Vercel, Netlify etc.), cadastre essas mesmas duas variáveis em *Environment Variables* e faça um novo deploy. O `.env` local não vai junto com o site publicado.
6. Teste com dois celulares: publique uma foto, um recado e jogue o quiz em um; confira no outro.

**Nunca coloque a `service_role` key no frontend.** A chave `anon`/publishable é pública por natureza e depende das políticas RLS do banco.

### Observações de segurança

- O site permanece público e sem login, conforme definido para o evento.
- O esquema habilita apenas leitura pública do mural/playlist/votos e inserção pública dos registros necessários; não concede update/delete público.
- O bucket `memory-photos` é público para exibição das fotos e aceita upload anônimo de imagens até 5 MB nos formatos JPEG, PNG e WebP.
- O identificador de voto por dispositivo reduz votos repetidos no mesmo navegador, mas não é antifraude: pode ser apagado ou contornado. Para um ranking/votação confiável, adicionar autenticação leve, CAPTCHA e/ou rate limiting antes de divulgar.
- RSVP, mural, playlist e quiz são informações enviadas por visitantes. Não publique dados pessoais sensíveis e modere o conteúdo antes de exibir em um evento público.
- As regras SQL são uma base inicial. Revise-as no painel Supabase antes de abrir o site ao público e configure proteção contra abuso.

## Antes de publicar

- Confirmar ano, data, horário e endereço em `src/data.js`.
- Personalizar as perguntas de `quizQuestions` em `src/data.js` com fatos reais da Nany.
- Definir moderação e política de retenção das fotos e mensagens.
- Configurar domínio/hosting e testar em celular e desktop.

## Estrutura importante

- `src/lib/supabase.js` — cliente opcional Supabase.
- `src/lib/partyService.js` — operações do evento com fallback local.
- `supabase/setup.sql` — configuração completa do banco (tabelas, RLS e buckets); as migrations separadas ficam em `supabase/migrations/`.
- `.env.example` — variáveis necessárias para a conexão.
