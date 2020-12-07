declare namespace NodeJS {
  interface ProcessEnv {
    ACCESS_SECRET?: string;
    REFRESH_SECRET?: string;
    PORT?: string;
    DB_USER?: string;
    DB_PASSWORD?: string;
    DB_URI?: string;
    DISCORD_ID?: string;
    DISCORD_SECRET?: string;
    REDIRECT_URI?: string;
  }
}
