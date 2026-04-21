type SSEClient = {
  controller: ReadableStreamDefaultController;
  userId: string;
};

class SSEManager {
  private clients: SSEClient[] = [];

  addClient(userId: string, controller: ReadableStreamDefaultController) {
    this.clients.push({ userId, controller });
  }

  removeClient(controller: ReadableStreamDefaultController) {
    this.clients = this.clients.filter((c) => c.controller !== controller);
  }

  send(userId: string, data: unknown) {
    const payload = `data: ${JSON.stringify(data)}\n\n`;
    const encoder = new TextEncoder();
    this.clients
      .filter((c) => c.userId === userId)
      .forEach((c) => {
        try {
          c.controller.enqueue(encoder.encode(payload));
        } catch {
          this.removeClient(c.controller);
        }
      });
  }

  broadcast(data: unknown) {
    const payload = `data: ${JSON.stringify(data)}\n\n`;
    const encoder = new TextEncoder();
    this.clients.forEach((c) => {
      try {
        c.controller.enqueue(encoder.encode(payload));
      } catch {
        this.removeClient(c.controller);
      }
    });
  }
}

export const sseManager = new SSEManager();
