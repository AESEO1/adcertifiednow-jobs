export const formatJobDescriptionHTML = (text: string): string => {
  if (!text) return ""

  // Split by colons to separate key-value pairs
  const sections = text.split(/:\s+/).filter((s) => s.trim())

  return sections
    .map((section) => {
      const trimmed = section.trim()
      if (!trimmed) return ""

      // Check if this section contains bullet points
      const hasBullets = trimmed.includes("•")

      if (hasBullets) {
        // Split by bullet points and render as list
        const bullets = trimmed.split("•").filter((b) => b.trim())
        const listItems = bullets.map((bullet) => `<li>${bullet.trim()}</li>`).join("")
        return `<ul>${listItems}</ul>`
      }

      // Split regular text by sentence endings
      const sentences = trimmed.split(/(?<=[.!?])\s+(?=[A-Z])/).filter((s) => s.trim())
      return sentences.map((sentence) => `<p>${sentence.trim()}</p>`).join("")
    })
    .join("")
}
