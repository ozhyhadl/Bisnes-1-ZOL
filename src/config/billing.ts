type PaddleEnvironment = "sandbox" | "production";

type BillingProductConfig = {
	productId?: string;
	priceId: string;
};

type BillingConfig = {
	mode: PaddleEnvironment;
	token: string;
	skills: BillingProductConfig;
	n8n: BillingProductConfig;
};

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1"]);

export const LIVE_SKILLS_PRICE_ID = "pri_01knwef8ref9gbw6pw9gmfh35t";
export const LIVE_N8N_PRICE_ID = "pri_01knwembd2ftzz0cw9gksxfh10";

export const SANDBOX_PADDLE_TOKEN = "test_fb89cdd2a05f5800206109fbd94";

export const SANDBOX_SKILLS_PRODUCT_ID = "pro_01knwqax6ntyrfqc4yag32q207";
export const SANDBOX_SKILLS_PRICE_ID = "pri_01knwqfr26gjr7sab6hckwwz8y";

export const SANDBOX_N8N_PRODUCT_ID = "pro_01knwqc4593qdxhq6dfdh5e2n1";
export const SANDBOX_N8N_PRICE_ID = "pri_01knwqdeyp432a33ayh3b209ps";

function isLocalHostname(hostname: string): boolean {
	return LOCAL_HOSTS.has(hostname);
}

export function isSandboxPaddleMode(): boolean {
	if (import.meta.env.DEV) {
		return true;
	}

	if (typeof window === "undefined") {
		return false;
	}

	return isLocalHostname(window.location.hostname);
}

export function getPaddleBillingConfig(): BillingConfig {
	if (isSandboxPaddleMode()) {
		return {
			mode: "sandbox",
			token: SANDBOX_PADDLE_TOKEN,
			skills: {
				productId: SANDBOX_SKILLS_PRODUCT_ID,
				priceId: SANDBOX_SKILLS_PRICE_ID,
			},
			n8n: {
				productId: SANDBOX_N8N_PRODUCT_ID,
				priceId: SANDBOX_N8N_PRICE_ID,
			},
		};
	}

	return {
		mode: "production",
		token: import.meta.env.VITE_PADDLE_CLIENT_TOKEN,
		skills: {
			priceId: LIVE_SKILLS_PRICE_ID,
		},
		n8n: {
			priceId: LIVE_N8N_PRICE_ID,
		},
	};
}
