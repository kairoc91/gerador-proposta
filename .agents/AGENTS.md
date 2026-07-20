# Regras e Diretrizes do Projeto

## Proteção da pasta v0 (Backup Imutável)
- **Imutabilidade do v0:** A pasta `v0/` é um snapshot estático de backup da versão inicial.
- **Proibição de Alterações:** É estritamente proibido editar, sobrescrever, mover ou excluir arquivos situados dentro do diretório `v0/` (ex: `v0/**/*`).
- **Escopo de Trabalho:** Todas as alterações, novas funcionalidades, refatorações e edições do código devem ocorrer exclusivamente fora da pasta `v0/`.
