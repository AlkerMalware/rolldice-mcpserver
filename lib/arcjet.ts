import arcjet, { tokenBucket } from "@arcjet/next";

// Create the Arcjet instance
// We use a token bucket for rate limiting:
// - capacity: 100 tokens (burst limit)
// - interval: 60 seconds
// - refillRate: 100 tokens (sustained rate)
// This allows for bursts of traffic but prevents sustained abuse.
export default arcjet({
  key: process.env.ARCJET_KEY!, // Get your site key from https://app.arcjet.com
  characteristics: ["ip.src"], // Track requests by IP address
  rules: [
    tokenBucket({
      mode: "LIVE", // Block requests. Use "DRY_RUN" to log only.
      refillRate: 20, // Refill 20 tokens per interval
      interval: 60, // Refill every 60 seconds
      capacity: 20, // Bucket capacity of 20 tokens
    }),
  ],
});
