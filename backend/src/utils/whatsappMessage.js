function buildWhatsAppUrl(whatsappNumber, inquiry) {
  const {
    frameName, selectedColor, selectedSize,
    powerRequired, lensBrand, lensTypes,
    customerName, phone,
  } = inquiry;

  const divider = '─────────────────────';

  const message = [
    '🛍️ *New Frame Inquiry*',
    divider,
    '📦 *Frame Details*',
    `  Frame : ${frameName}`,
    selectedColor ? `  Colour: ${selectedColor}` : null,
    selectedSize  ? `  Size  : ${selectedSize}`  : null,
    '',
    '👓 *Lens Requirement*',
    `  Power Required: ${powerRequired ? '✅ Yes' : '❌ No (Zero Power)'}`,
    lensBrand          ? `  Lens Brand    : ${lensBrand}`            : null,
    lensTypes?.length  ? `  Lens Types    : ${lensTypes.join(', ')}` : null,
    divider,
    '👤 *Customer Details*',
    `  Name : ${customerName}`,
    `  Phone: ${phone}`,
    divider,
    'Please share the price quote and availability. Thank you! 🙏',
  ].filter((l) => l !== null).join('\n');

  const number = whatsappNumber.replace(/\D/g, '');
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

module.exports = buildWhatsAppUrl;
