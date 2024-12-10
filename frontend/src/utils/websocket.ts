export const createWebSocket = (url: string): WebSocket => {
    const ws: WebSocket = new WebSocket(url);
  
    ws.onopen = () => {
      console.log('WebSocket connected');
    };
  
    ws.onmessage = (message: MessageEvent) => {
      console.log('Received message:', message.data);
    };
  
    ws.onclose = () => {
      console.log('WebSocket disconnected');
    };
  
    ws.onerror = (error: Event) => {
      console.error('WebSocket error:', error);
    };
  
    return ws;
  };