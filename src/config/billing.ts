/* ──────────────────────────────────────────────────────────────────
 * Paddle Billing — Environment-Driven Configuration
 *
 * Single switch: PADDLE_ENVIRONMENT  (set once in env / Vercel)
 *   "sandbox"  → sandbox tokens, sandbox price IDs, sandbox API
 *   "live"     → live   tokens, live   price IDs, live   API
 *
 * Client-side env is injected by vite.config.ts via `define`.
 * ────────────────────────────────────────────────────────────────── */

type PaddleEnvironment = "sandbox" | "production";

type BillingProductConfig = {
	productId?: string;
	priceId: string;
	label: string;
	unitPrice: number;
};

type BillingConfig = {
	mode: PaddleEnvironment;
	token: string;
	currency: string;
	skills: BillingProductConfig;
	n8n: BillingProductConfig;
};

/* ── Price & Product IDs by environment ──────────────────────────── */

const SANDBOX = {
	skillsPriceId: "pri_01knwqfr26gjr7sab6hckwwz8y",
	skillsProductId: "pro_01knwqax6ntyrfqc4yag32q207",
	n8nPriceId: "pri_01knwqdeyp432a33ayh3b209ps",
	n8nProductId: "pro_01knwqc4593qdxhq6dfdh5e2n1",
} as const;

const LIVE = {
	skillsPriceId: "pri_01knwef8ref9gbw6pw9gmfh35t",
	n8nPriceId: "pri_01knwembd2ftzz0cw9gksxfh10",
} as const;

/* ── Environment resolution ──────────────────────────────────────── */

export function getPaddleEnvironment(): PaddleEnvironment {
	const raw = (import.meta.env.VITE_PADDLE_ENVIRONMENT ?? "live")
		.trim()
		.toLowerCase();

	return raw === "sandbox" ? "sandbox" : "production";
}

export function isSandboxPaddleMode(): boolean {
	return getPaddleEnvironment() === "sandbox";
}

/* ── Unified billing config ──────────────────────────────────────── */

export function getPaddleBillingConfig(): BillingConfig {
	if (isSandboxPaddleMode()) {
		return {
			mode: "sandbox",
			token: import.meta.env.VITE_PADDLE_CLIENT_TOKEN_SANDBOX ?? "",
			currency: "USD",
			skills: {
				productId: SANDBOX.skillsProductId,
				priceId: SANDBOX.skillsPriceId,
				label: "Claude Skills Ultimate Bundle",
				unitPrice: 15,
			},
			n8n: {
				productId: SANDBOX.n8nProductId,
				priceId: SANDBOX.n8nPriceId,
				label: "1,800+ N8N Automations",
				unitPrice: 10,
			},
		};
	}

	return {
		mode: "production",
		token: import.meta.env.VITE_PADDLE_CLIENT_TOKEN ?? "",
		currency: "USD",
		skills: {
			priceId: LIVE.skillsPriceId,
			label: "Claude Skills Ultimate Bundle",
			unitPrice: 15,
		},
		n8n: {
			priceId: LIVE.n8nPriceId,
			label: "1,800+ N8N Automations",
			unitPrice: 10,
		},
	};
}
