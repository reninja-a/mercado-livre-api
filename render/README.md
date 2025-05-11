# API Mercado Livre (Render)

Esta é uma API que fornece endpoints para integração com a API do Mercado Livre, configurada para deploy no Render.

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

## Como Fazer o Deploy no Render

1. Crie uma conta no [Render](https://render.com)

2. No dashboard do Render, clique em "New +" e selecione "Web Service"

3. Conecte seu repositório GitHub (você precisará fazer o push do código primeiro)

4. Configure o serviço:
   - **Name**: mercadolivre-api (ou o nome que preferir)
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free (ou outro plano de sua preferência)

5. Clique em "Create Web Service"

O Render irá automaticamente fazer o deploy da sua aplicação e fornecer uma URL para acesso.

## Variáveis de Ambiente

O projeto não requer variáveis de ambiente específicas, pois todas as configurações são passadas via parâmetros nas requisições.

## Dependências

- express
- axios
- cors

## Versão do Node

Recomendado Node.js versão 18 ou superior.

## Como Subir no GitHub

1. Crie um novo repositório no GitHub

2. Inicialize o Git no seu projeto local:
```bash
git init
```

3. Adicione os arquivos:
```bash
git add .
```

4. Faça o commit:
```bash
git commit -m "Primeira versão da API"
```

5. Adicione o repositório remoto:
```bash
git remote add origin https://github.com/seu-usuario/seu-repositorio.git
```

6. Faça o push:
```bash
git push -u origin main
```

Depois que o código estiver no GitHub, você pode conectar o repositório ao Render para fazer o deploy automático. 