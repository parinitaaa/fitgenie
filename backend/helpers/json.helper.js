exports.extractJSON = (text) => {
  const cleaned = text.replace(/```json|```/g, "").trim();
  const match = cleaned.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("Invalid JSON from model");
  return JSON.parse(match[0]);
};
