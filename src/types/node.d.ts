declare global {
  export namespace NodeJS {
    export interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
      ACCESS_SECRET: string;
      REFRESH_SECRET: string;
      PORT?: string;
      DB_USER: string;
      DB_PASSWORD: string;
      DB_URI: string;
      DISCORD_ID: string;
      DISCORD_SECRET: string;
      REDIRECT_URI: string;
    }
  }
}
