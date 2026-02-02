import posthog from "posthog-js";

export function usePostHog() {
	if (typeof window !== "undefined") {
		posthog.init("phc_xFhod5FkKi6J5SaKtQzfHHN7cTeMXiDvjDndeXWfwup", {
			api_host: "https://us.i.posthog.com",
			// @ts-expect-error: The snippet provided 'defaults' but it might not be in the types
			defaults: "2025-11-30",
			person_profiles: "always",
		});
	}
	return { posthog };
}
