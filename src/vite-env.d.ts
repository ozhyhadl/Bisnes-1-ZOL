/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_PADDLE_ENVIRONMENT: string;
	readonly VITE_PADDLE_CLIENT_TOKEN: string;
	readonly VITE_PADDLE_CLIENT_TOKEN_SANDBOX: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
