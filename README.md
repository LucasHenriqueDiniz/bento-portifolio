# Portfolio - Local Development

Portfolio web pessoal construído com React + Vite (frontend) e Cloudflare Pages Functions (backend API).

## 📋 Pré-requisitos

- **Node.js** 18+ instalado
- **pnpm** instalado (`npm install -g pnpm`)

## 🚀 Instalação

1. Clone o repositório (se ainda não clonou):
```bash
git clone <repository-url>
cd portifolio
```

2. Instale as dependências:
```bash
pnpm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

Edite o arquivo `.env` e preencha com suas credenciais reais.

## 🔐 Variáveis de Ambiente

O projeto requer as seguintes variáveis de ambiente (veja `.env.example` para referência):

### Discord Integration
- `DISCORD_ID` - Seu Discord User ID (para Lanyard API)
- `DISCORD_WEBHOOK_URL` - URL do webhook para notificações do formulário de contato

### MyAnimeList Integration
- `MAL_USERNAME` - Seu username do MyAnimeList

### Lyfta Integration
- `LYFTA_API_KEY` - API key da plataforma Lyfta

### Steam Integration
- `STEAM_API_KEY` - Steam Web API key
- `STEAM_ID` - Seu Steam ID

### Last.fm Integration
- `LASTFM_API_KEY` - Last.fm API key
- `LASTFM_USERNAME` - Seu username do Last.fm

### GitHub Integration
- `GITHUB_USERNAME` - Seu username do GitHub
- `GITHUB_PAT` - GitHub Personal Access Token

## 🛠️ Comandos de Desenvolvimento

### Executar apenas o Frontend (Portfolio)
```bash
pnpm dev:portfolio
```
Acesse: `http://localhost:5173`

### Build para Produção
```bash
pnpm build
```

### Type Checking
```bash
pnpm typecheck
```

## 📁 Estrutura do Projeto

```
portifolio/
├── artifacts/
│   └── portfolio/          # Frontend React + Vite
├── .env                    # Variáveis de ambiente (não versionado)
├── .env.example            # Template de variáveis de ambiente
├── package.json            # Workspace root package
└── pnpm-workspace.yaml     # Configuração do workspace pnpm
```

### Descrição dos Diretórios

- **artifacts/portfolio**: Aplicação frontend React com Vite, Tailwind CSS, e componentes UI

## 🐛 Troubleshooting

### Erro: "Cannot find module" ou dependências faltando

**Problema**: Dependências não foram instaladas ou estão desatualizadas.

**Solução**:
```bash
# Limpar node_modules e reinstalar
rm -rf node_modules
pnpm install
```

### Erro: "Port 5173 is already in use"

**Problema**: A porta 5173 já está sendo usada por outro processo.

**Solução 1** - Parar o processo que está usando a porta:
```bash
# No Linux/Mac
lsof -ti:5173 | xargs kill -9

# No Windows (PowerShell)
Get-Process -Id (Get-NetTCPConnection -LocalPort 5173).OwningProcess | Stop-Process
```

**Solução 2** - O Vite automaticamente tentará usar a próxima porta disponível (5174, 5175, etc.)

### Erro: "Environment variables not loaded"

**Problema**: Arquivo `.env` não existe ou variáveis não estão sendo carregadas.

**Checklist**:
1. ✅ Arquivo `.env` existe na raiz do projeto?
2. ✅ Todas as variáveis do `.env.example` estão preenchidas?
3. ✅ Reiniciou o servidor após modificar o `.env`?

**Solução**:
```bash
# Verificar se .env existe
ls -la .env

# Se não existir, criar a partir do exemplo
cp .env.example .env

# Editar e preencher com valores reais
nano .env  # ou use seu editor preferido
```

**Nota**: Variáveis de ambiente no frontend (Vite) devem ter prefixo `VITE_` para serem expostas ao navegador. Variáveis sem prefixo são apenas server-side.

### Erro: "Build failed" ou erros de TypeScript

**Problema**: Erros de tipo ou configuração incorreta do TypeScript.

**Solução**:
```bash
# Executar type checking para ver erros detalhados
pnpm typecheck

# Se houver erros de tipos, verifique:
# 1. Todas as dependências estão instaladas
# 2. Arquivos tsconfig.json estão corretos
# 3. Imports estão corretos
```

### Erro: "API integration not working" (Discord, Steam, Last.fm, etc.)

**Problema**: Integrações com APIs externas não funcionam.

**Checklist**:
1. ✅ Variáveis de ambiente estão configuradas corretamente no `.env`?
2. ✅ API keys são válidas e não expiraram?
3. ✅ Serviços externos estão online?
4. ✅ Reiniciou o servidor após modificar variáveis de ambiente?

**Solução**:
```bash
# Verificar se variáveis estão carregadas (backend)
# Adicione console.log no código para debug:
console.log('STEAM_API_KEY:', process.env.STEAM_API_KEY ? '✓ loaded' : '✗ missing');

# Testar API manualmente
curl "https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=YOUR_KEY&steamids=YOUR_ID"
```

### Erro: "Git not tracking .env file" (ou vice-versa)

**Problema**: Arquivo `.env` está sendo rastreado pelo Git (não deveria) ou não está no `.gitignore`.

**Solução**:
```bash
# Verificar se .env está no .gitignore
cat .gitignore | grep .env

# Se .env foi commitado acidentalmente, remover do Git
git rm --cached .env
git commit -m "Remove .env from version control"

# Adicionar ao .gitignore se não estiver
echo ".env" >> .gitignore
```

### Erro: "pnpm command not found"

**Problema**: pnpm não está instalado.

**Solução**:
```bash
# Instalar pnpm globalmente
npm install -g pnpm

# Verificar instalação
pnpm --version
```

### Performance lenta no desenvolvimento

**Problema**: Servidor de desenvolvimento está lento.

**Soluções**:
1. Limpar cache do Vite:
```bash
rm -rf artifacts/portfolio/node_modules/.vite
```

2. Verificar se há muitos arquivos sendo observados:
```bash
# Adicionar exclusões no vite.config.ts se necessário
server: {
  watch: {
    ignored: ['**/node_modules/**', '**/dist/**']
  }
}
```

### Erro: "Cannot connect to API server"

**Problema**: Frontend não consegue se conectar ao backend (Pages Functions).

**Checklist**:
1. ✅ Backend está rodando? (Pages Functions em `pnpm dev:portfolio`)
2. ✅ Porta do backend está correta?
3. ✅ Firewall não está bloqueando?

**Solução**:
```bash
# Verificar se o backend (Pages Functions) esta respondendo
curl http://localhost:5173/api/portfolio/stats
```

## 📚 Recursos Adicionais

- **Vite Documentation**: https://vite.dev/
- **React Documentation**: https://react.dev/
- **Express Documentation**: https://expressjs.com/
- **pnpm Documentation**: https://pnpm.io/

## 🆘 Suporte

Se encontrar problemas não listados aqui:

1. Verifique os logs do console (frontend e backend)
2. Verifique se todas as dependências estão instaladas
3. Verifique se as variáveis de ambiente estão configuradas
4. Tente limpar e reinstalar: `rm -rf node_modules && pnpm install`

---

**Última atualização**: 2025-01-XX
