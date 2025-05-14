// MercadoLivre API Server
// API server para integração com Mercado Livre

const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

// Enable CORS
app.use(cors());
app.use(express.json());

// Helper function to log requests and responses
function logToConsole(prefix, data) {
  console.log(`[${prefix}]`, JSON.stringify(data, null, 2));
}

// Endpoint to fetch orders from Mercado Livre
app.post('/fetchMercadoLivreOrders', async (req, res) => {
  console.log('Received request to /fetchMercadoLivreOrders');
  
  const { accessToken, sellerId, offsets = [0] } = req.body;
  
  if (!accessToken || !sellerId) {
    const errorResponse = { 
      error: 'Missing required parameters', 
      details: 'accessToken and sellerId are required' 
    };
    console.error(errorResponse);
    return res.status(400).json(errorResponse);
  }
  
  try {
    // Process all requested offsets in parallel
    const promises = offsets.map(offset => {
      const url = `https://api.mercadolibre.com/orders/search?seller=${sellerId}&offset=${offset}&sort=date_desc`;
      console.log(`Making request to: ${url}`);
      
      return axios({
        method: 'GET',
        url,
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }).catch(error => {
        console.error(`Error for offset ${offset}:`, error.message);
        return { 
          offset,
          error: error.message,
          status: error.response?.status || 500,
          data: error.response?.data || null
        };
      });
    });
    
    const results = await Promise.all(promises);
    
    // Transform results to a more manageable format
    const responseData = results.map((result, index) => {
      if (result.error) {
        return {
          offset: offsets[index],
          success: false,
          error: result.error,
          data: result.data
        };
      }
      return {
        offset: offsets[index],
        success: true,
        status: result.status,
        data: result.data
      };
    });
    
    console.log(`Successfully processed ${responseData.length} offset requests`);
    res.json({
      success: true,
      message: `Processed ${responseData.length} offset requests`,
      results: responseData
    });
    
  } catch (error) {
    console.error('Error processing requests:', error);
    const errorResponse = {
      success: false,
      error: error.message,
      stack: error.stack
    };
    res.status(500).json(errorResponse);
  }
});

// Endpoint to update shipment status and costs
app.post('/updateShipmentStatus', async (req, res) => {
  console.log('Received request to /updateShipmentStatus');
  
  const { accessToken, shipmentIds = [] } = req.body;
  
  if (!accessToken || shipmentIds.length === 0) {
    const errorResponse = { 
      error: 'Missing required parameters', 
      details: 'accessToken and at least one shipmentId are required' 
    };
    console.error(errorResponse);
    return res.status(400).json(errorResponse);
  }
  
  try {
    // Process all requested shipment IDs in parallel
    const promises = shipmentIds.map(shipmentId => {
      // Skip empty shipmentIds
      if (!shipmentId) {
        return Promise.resolve({ shipmentId, skipped: true });
      }
      
      const statusUrl = `https://api.mercadolibre.com/shipments/${shipmentId}`;
      const costsUrl = `https://api.mercadolibre.com/shipments/${shipmentId}/costs`;
      
      // Get both status and costs in parallel
      return Promise.all([
        axios({
          method: 'GET',
          url: statusUrl,
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'x-format-new': 'true'
          }
        }).catch(error => ({ 
          error: error.message, 
          status: error.response?.status || 500,
          data: error.response?.data || null 
        })),
        
        axios({
          method: 'GET',
          url: costsUrl,
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'x-format-new': 'true'
          }
        }).catch(error => ({ 
          error: error.message, 
          status: error.response?.status || 500,
          data: error.response?.data || null 
        }))
      ]).then(([statusRes, costsRes]) => {
        return {
          shipmentId,
          success: !statusRes.error && !costsRes.error,
          status: statusRes.error ? null : statusRes.data,
          costs: costsRes.error ? null : costsRes.data,
          errors: {
            status: statusRes.error || null,
            costs: costsRes.error || null
          }
        };
      });
    });
    
    const results = await Promise.all(promises);
    
    // Transform results for easier processing
    const processedResults = results.map(result => {
      if (result.skipped) {
        return {
          shipmentId: result.shipmentId,
          skipped: true
        };
      }
      
      if (!result.success) {
        return {
          shipmentId: result.shipmentId,
          success: false,
          errors: result.errors
        };
      }
      
      // Process successful results
      const statusTranslation = {
        "cancelled": "Cancelada",
        "delivered": "Entregue",
        "not_delivered": "Não Entregue",
        "shipped": "Enviado",
        "ready_to_ship": "Pronto para Enviar"
      };
      
      const rawStatus = result.status?.status || 'N/A';
      const translatedStatus = statusTranslation[rawStatus] || rawStatus;
      
      // Extract buyer cost
      let buyerCost = null;
      if (result.costs?.receiver && result.costs.receiver.cost !== undefined) {
        buyerCost = Number(result.costs.receiver.cost);
      }
      
      // Extract seller cost
      let sellerCost = null;
      if (result.costs?.senders && result.costs.senders.length > 0) {
        sellerCost = Number(result.costs.senders[0].cost);
      }
      
      return {
        shipmentId: result.shipmentId,
        success: true,
        status: {
          raw: rawStatus,
          translated: translatedStatus
        },
        costs: {
          buyer: buyerCost,
          seller: sellerCost
        }
      };
    });
    
    console.log(`Successfully processed ${processedResults.length} shipment requests`);
    res.json({
      success: true,
      message: `Processed ${processedResults.length} shipment requests`,
      results: processedResults
    });
    
  } catch (error) {
    console.error('Error processing shipment requests:', error);
    const errorResponse = {
      success: false,
      error: error.message,
      stack: error.stack
    };
    res.status(500).json(errorResponse);
  }
});

// Endpoint para listar anúncios de um vendedor
app.post('/getUserItems', async (req, res) => {
  console.log('Received request to /getUserItems');
  
  const { accessToken, userId } = req.body;
  
  if (!accessToken || !userId) {
    const errorResponse = { 
      error: 'Missing required parameters', 
      details: 'accessToken and userId are required' 
    };
    console.error(errorResponse);
    return res.status(400).json(errorResponse);
  }
  
  try {
    const url = `https://api.mercadolibre.com/users/${userId}/items/search`;
    console.log(`Making request to: ${url}`);
    
    const response = await axios({
      method: 'GET',
      url,
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    res.json({
      success: true,
      data: response.data
    });
  } catch (error) {
    console.error('Error fetching user items:', error);
    const errorResponse = {
      success: false,
      error: error.message,
      stack: error.stack
    };
    res.status(500).json(errorResponse);
  }
});

// Endpoint para obter detalhes de um anúncio específico
app.post('/getItemDetails', async (req, res) => {
  console.log('Received request to /getItemDetails');
  
  const { accessToken, itemId } = req.body;
  
  if (!accessToken || !itemId) {
    const errorResponse = { 
      error: 'Missing required parameters', 
      details: 'accessToken and itemId are required' 
    };
    console.error(errorResponse);
    return res.status(400).json(errorResponse);
  }
  
  try {
    const url = `https://api.mercadolibre.com/items/${itemId}`;
    console.log(`Making request to: ${url}`);
    
    const response = await axios({
      method: 'GET',
      url,
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    res.json({
      success: true,
      data: response.data
    });
  } catch (error) {
    console.error('Error fetching item details:', error);
    const errorResponse = {
      success: false,
      error: error.message,
      stack: error.stack
    };
    res.status(500).json(errorResponse);
  }
});

// Endpoint para obter estatísticas de visitas de anúncios
app.post('/getItemVisits', async (req, res) => {
  console.log('Received request to /getItemVisits');
  
  const { accessToken, itemIds, dateFrom, dateTo } = req.body;
  
  if (!accessToken || !itemIds || !dateFrom || !dateTo) {
    const errorResponse = { 
      error: 'Missing required parameters', 
      details: 'accessToken, itemIds, dateFrom and dateTo are required' 
    };
    console.error(errorResponse);
    return res.status(400).json(errorResponse);
  }
  
  try {
    // Converte array em string separada por vírgula ou mantém um único ID
    const itemIdsParam = Array.isArray(itemIds) ? itemIds.join(',') : itemIds;
    
    const url = `https://api.mercadolibre.com/items/visits?ids=${itemIdsParam}&date_from=${dateFrom}&date_to=${dateTo}`;
    console.log(`Making request to: ${url}`);
    
    const response = await axios({
      method: 'GET',
      url,
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    res.json({
      success: true,
      data: response.data
    });
  } catch (error) {
    console.error('Error fetching item visits:', error);
    const errorResponse = {
      success: false,
      error: error.message,
      stack: error.stack
    };
    res.status(500).json(errorResponse);
  }
});

// Endpoint para obter pedidos filtrados por data e anúncio
app.post('/getFilteredOrders', async (req, res) => {
  console.log('Received request to /getFilteredOrders');
  
  const { accessToken, sellerId, dateFrom, dateTo, itemId } = req.body;
  
  if (!accessToken || !sellerId || !dateFrom || !dateTo) {
    const errorResponse = { 
      error: 'Missing required parameters', 
      details: 'accessToken, sellerId, dateFrom and dateTo are required' 
    };
    console.error(errorResponse);
    return res.status(400).json(errorResponse);
  }
  
  try {
    let url = `https://api.mercadolibre.com/orders/search?seller=${sellerId}&order.date_created.from=${dateFrom}&order.date_created.to=${dateTo}`;
    
    // Adiciona filtro de MLB se fornecido
    if (itemId) {
      url += `&search=mlb:${itemId}`;
    }
    
    console.log(`Making request to: ${url}`);
    
    const response = await axios({
      method: 'GET',
      url,
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    res.json({
      success: true,
      data: response.data
    });
  } catch (error) {
    console.error('Error fetching filtered orders:', error);
    const errorResponse = {
      success: false,
      error: error.message,
      stack: error.stack
    };
    res.status(500).json(errorResponse);
  }
});

// Endpoint para atualizar token de acesso via refresh token
app.post('/refreshToken', async (req, res) => {
  console.log('Received request to /refreshToken');
  
  const { appId, secretKey, refreshToken, redirectUri } = req.body;
  
  if (!appId || !secretKey || !refreshToken || !redirectUri) {
    const errorResponse = { 
      error: 'Missing required parameters', 
      details: 'appId, secretKey, refreshToken and redirectUri are required' 
    };
    console.error(errorResponse);
    return res.status(400).json(errorResponse);
  }
  
  try {
    const url = 'https://api.mercadolibre.com/oauth/token';
    console.log(`Making request to: ${url}`);
    
    const response = await axios({
      method: 'POST',
      url,
      data: {
        'grant_type': 'refresh_token',
        'client_id': appId,
        'client_secret': secretKey,
        'refresh_token': refreshToken,
        'redirect_uri': redirectUri
      }
    });
    
    res.json({
      success: true,
      data: response.data
    });
  } catch (error) {
    console.error('Error refreshing token:', error);
    const errorResponse = {
      success: false,
      error: error.message,
      stack: error.stack
    };
    res.status(500).json(errorResponse);
  }
});

// Endpoint para consultar detalhes de uma ordem específica
app.post('/pegar-order', async (req, res) => {
  console.log('Received request to /pegar-order');
  
  const { accessToken, orderId } = req.body;
  
  if (!accessToken || !orderId) {
    const errorResponse = { 
      error: 'Missing required parameters', 
      details: 'accessToken and orderId are required' 
    };
    console.error(errorResponse);
    return res.status(400).json(errorResponse);
  }
  
  try {
    const url = `https://api.mercadolibre.com/orders/${orderId}`;
    console.log(`Making request to: ${url}`);
    
    const response = await axios({
      method: 'GET',
      url,
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    console.log('Successfully retrieved order details');
    res.json({
      success: true,
      message: 'Order details retrieved successfully',
      data: response.data
    });
    
  } catch (error) {
    console.error('Error retrieving order details:', error);
    const errorResponse = {
      success: false,
      error: error.message,
      status: error.response?.status || 500,
      data: error.response?.data || null
    };
    res.status(errorResponse.status || 500).json(errorResponse);
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 