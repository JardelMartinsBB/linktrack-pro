#!/bin/bash

# Script seguro para criação de .env.local com proteção Git automática

# Verifica se o script está sendo executado no diretório correto
check_directory() {
  if [ ! -f package.json ]; then
    echo "⚠️  Erro: Execute este script na raiz do projeto Next.js!"
    echo "   Certifique-se de que há um arquivo package.json no diretório."
    exit 1
  fi
}

# Protege contra commit acidental
protect_env_file() {
  if [ ! -f .gitignore ]; then
    touch .gitignore
  fi

  if ! grep -q ".env.local" .gitignore; then
    echo -e "\n# Arquivos de ambiente local\n.env.local\n.env*.local" >> .gitignore
    echo "✅ .gitignore atualizado para proteger arquivos .env.local"
  fi

  # Verifica se o arquivo já está no Git
  if [ -d .git ] && git ls-files --error-unmatch .env.local &>/dev/null; then
    echo -e "\n🚨 ALERTA CRÍTICO: .env.local já está sendo rastreado pelo Git!"
    echo "   Execute imediatamente:"
    echo "   git rm --cached .env.local"
    echo "   E considere rotacionar suas chaves expostas!"
    exit 1
  fi
}

# Criação segura do arquivo
create_env_file() {
  # Cria backup se o arquivo existir
  if [ -f .env.local ]; then
    backup_name=".env.local.backup_$(date +%Y%m%d_%H%M%S)"
    cp .env.local "$backup_name"
    echo -e "\n⚠️  .env.local já existia. Backup criado: $backup_name"
  fi

  # Cria o arquivo com permissões restritas
  umask 077
  cat > .env.local << 'EOF'
# ======================================
# CONFIGURAÇÕES SENSÍVEIS - NÃO COMMITAR
# ======================================

# Configurações de desenvolvimento
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_aqui
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Configurações de produção (usar apenas em servidor)
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role_aqui
SUPABASE_JWT_SECRET=seu_jwt_secreto_aqui

# ======================
# CONFIGURAÇÕES AVANÇADAS
# ======================

# Conexão com Storage (opcional)
# NEXT_PUBLIC_SUPABASE_STORAGE_URL=https://seu-projeto.supabase.co/storage/v1

# Configurações de sessão (opcional)
# SESSION_TIMEOUT=86400
EOF

  echo -e "\n✅ Arquivo .env.local criado com sucesso com permissões seguras!"
}

# Verificação de segurança
security_checks() {
  # Verifica se há chaves expostas no template
  if grep -q "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9" .env.local; then
    echo -e "\n🚨 PERIGO: Chaves JWT reais detectadas no template!"
    echo "   Remova todas as chaves de exemplo antes de usar"
    exit 1
  fi

  # Verifica permissões do arquivo
  if [ "$(stat -c %a .env.local)" != "600" ]; then
    chmod 600 .env.local
    echo "🔒 Permissões do arquivo ajustadas para 600"
  fi
}

# Execução principal
clear
echo -e "\n🔒 Configuração Segura de Ambiente - LinkTrack Pro\n"

check_directory
protect_env_file
create_env_file
security_checks

echo -e "\n⚠️  ATENÇÃO:"
echo "1. SUBSTITUA TODOS OS VALORES 'sua_chave_*' PELAS SUAS REAIS"
echo "2. NUNCA compartilhe este arquivo ou commit no Git"
echo "3. Para produção, use variáveis de ambiente no servidor"
echo -e "\n🔧 Onde obter os valores no Supabase:"
echo "   - Settings > API > Project URL"
echo "   - Settings > API > anon/public key"
echo "   - Settings > API > service_role key (segredo!)"
echo "   - Project Settings > API > JWT Settings > JWT Secret"
echo -e "\n🛡️  Arquivo protegido contra commit acidental no Git\n"