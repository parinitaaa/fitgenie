module.exports = function enrichMetadata(basic) {
  return {
    ...basic,
    undertone: basic.skin_tone === "light" ? "warm" : "neutral",
    confidence: 0.78
  };
};
