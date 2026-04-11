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
};

type BillingConfig = {
	mode: PaddleEnvironment;
	token: string;
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
			skills: {
				productId: SANDBOX.skillsProductId,
				priceId: SANDBOX.skillsPriceId,
			},
			n8n: {
				productId: SANDBOX.n8nProductId,
				priceId: SANDBOX.n8nPriceId,
			},
		};
	}

	return {
		mode: "production",
		token: import.meta.env.VITE_PADDLE_CLIENT_TOKEN ?? "",
		skills: {
			priceId: LIVE.skillsPriceId,
		},
		n8n: {
			priceId: LIVE.n8nPriceId,
		},
	};
}
