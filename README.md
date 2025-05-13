# API Mercado Livre

O motivo? Bypass no limit do google sheets de 10 mil req por dia!

Este projeto contém uma API para integração com o Mercado Livre, com configurações para deploy tanto no Vercel quanto no Render.

## Estrutura do Projeto

```
.
├── vercel/           # Configurações para deploy no Vercel
├── render/           # Configurações para deploy no Render
├── package.json      # Dependências principais
└── README.md         # Este arquivo
```

## Como Usar

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/mercadolivre-api.git
cd mercadolivre-api
```

2. Instale as dependências:
```bash
npm install
```

3. Para desenvolvimento local:
```bash
npm run dev
```

## Deploy

### Vercel
Para fazer deploy no Vercel:
1. Entre na pasta `vercel`
2. Siga as instruções no README.md da pasta

### Render
Para fazer deploy no Render:
1. Entre na pasta `render`
2. Siga as instruções no README.md da pasta

## Endpoints Disponíveis

Consulte a documentação específica em cada pasta de deploy para ver os endpoints disponíveis e como usá-los.

## Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Faça commit das suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Faça push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. 
