export abstract class BaseAdapter {
  abstract type: string;
  abstract name: string;
  
  protected config: Record<string, any> = {};

  async connect(config: Record<string, any>): Promise<void> {
    this.config = config;
  }

  abstract disconnect(): Promise<void>;
  
  abstract testConnection(): Promise<{ ok: boolean; message: string }>;

  protected notImplementedMessage(methodName: string) {
    return { 
      success: false, 
      message: `Not implemented. Plug in ${this.name} API key to enable ${methodName}.` 
    };
  }
}
