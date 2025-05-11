# API Mercado Livre

Esta é uma API que fornece endpoints para integração com a API do Mercado Livre.

## Endpoints Disponíveis

### 1. Buscar Pedidos
- **Endpoint**: `/fetchMercadoLivreOrders`
- **Método**: POST
- **Parâmetros**:
  - `accessToken`: Token de acesso do Mercado Livre
  - `sellerId`: ID do vendedor
  - `offsets`: Array de offsets para paginação (opcional)

### 2. Atualizar Status de Envio
- **Endpoint**: `/updateShipmentStatus`
- **Método**: POST
- **Parâmetros**:
  - `accessToken`: Token de acesso do Mercado Livre
  - `shipmentIds`: Array de IDs de envio

### 3. Listar Anúncios do Vendedor
- **Endpoint**: `/getUserItems`
- **Método**: POST
- **Parâmetros**:
  - `accessToken`: Token de acesso do Mercado Livre
  - `userId`: ID do usuário vendedor

### 4. Detalhes do Anúncio
- **Endpoint**: `/getItemDetails`
- **Método**: POST
- **Parâmetros**:
  - `accessToken`: Token de acesso do Mercado Livre
  - `itemId`: ID do anúncio

### 5. Estatísticas de Visitas
- **Endpoint**: `/getItemVisits`
- **Método**: POST
- **Parâmetros**:
  - `accessToken`: Token de acesso do Mercado Livre
  - `itemIds`: Array de IDs dos anúncios
  - `dateFrom`: Data inicial (YYYY-MM-DD)
  - `dateTo`: Data final (YYYY-MM-DD)

### 6. Pedidos Filtrados
- **Endpoint**: `/getFilteredOrders`
- **Método**: POST
- **Parâmetros**:
  - `accessToken`: Token de acesso do Mercado Livre
  - `sellerId`: ID do vendedor
  - `dateFrom`: Data inicial (YYYY-MM-DD)
  - `dateTo`: Data final (YYYY-MM-DD)
  - `itemId`: ID do anúncio (opcional)

### 7. Atualizar Token
- **Endpoint**: `/refreshToken`
- **Método**: POST
- **Parâmetros**:
  - `appId`: ID da aplicação
  - `secretKey`: Chave secreta
  - `refreshToken`: Token de atualização
  - `redirectUri`: URI de redirecionamento

## Como Fazer o Deploy

1. Instale o Vercel CLI:
```bash
npm install -g vercel
```

2. Faça login no Vercel:
```bash
vercel login
```

3. Deploy do projeto:
```bash
vercel
```

4. Para fazer deploy em produção:
```bash
vercel --prod
```

## Variáveis de Ambiente

O projeto não requer variáveis de ambiente específicas, pois todas as configurações são passadas via parâmetros nas requisições.

## Dependências

- express
- axios
- cors

## Versão do Node

Recomendado Node.js versão 18 ou superior. 