function buildWhatsAppUrl(whatsappNumber, inquiry) {
  const {
    frameName, frameSlug, frameImage, framePrice,
    selectedColor, selectedSize,
    powerRequired, lensBrand, lensProduct,
    rightEye, leftEye, add,
    customerName, phone, email, city, notes,
    needsCheckup, siteUrl,
  } = inquiry;

  const divider = '─────────────────';

  // Product page link
  const productLink = frameSlug && siteUrl
    ? `${siteUrl}/product/${frameSlug}`
    : null;

  // First image URL (Cloudinary — owner can tap to view)
  const imageUrl = frameImage || null;

  const eyeStr = (eye) => {
    if (!eye) return null;
    const parts = [];
    if (eye.sph) parts.push(`SPH ${eye.sph}`);
    if (eye.cyl) parts.push(`CYL ${eye.cyl}`);
    if (eye.axis) parts.push(`AXIS ${eye.axis}`);
    return parts.length ? parts.join('  ') : null;
  };

  const lines = [
    '*New Frame Inquiry*',
    divider,

    // Product block
    `*Frame:* ${frameName}`,
    selectedColor ? `*Colour:* ${selectedColor}` : null,
    selectedSize  ? `*Size:* ${selectedSize}`     : null,
    framePrice    ? `*Frame Price:* Rs.${Number(framePrice).toLocaleString('en-IN')}` : null,

    // Links — owner taps to see product and image
    productLink ? `*Product Page:* ${productLink}` : null,
    imageUrl    ? `*Product Image:* ${imageUrl}`   : null,

    divider,

    // Lens requirement
    `*Power Required:* ${powerRequired ? 'Yes' : 'No (Zero Power)'}`,
    lensBrand   ? `*Lens Brand:* ${lensBrand}`   : null,
    lensProduct ? `*Lens Product:* ${lensProduct}` : null,

    // Prescription
    (powerRequired && rightEye) ? `*Right Eye (OD):* ${eyeStr(rightEye) || '-'}` : null,
    (powerRequired && leftEye)  ? `*Left Eye (OS):* ${eyeStr(leftEye)  || '-'}` : null,
    (powerRequired && add)      ? `*ADD:* ${add}` : null,

    divider,

    // Customer
    `*Name:* ${customerName}`,
    `*Phone:* ${phone}`,
    email ? `*Email:* ${email}` : null,
    city  ? `*City:* ${city}`   : null,
    needsCheckup ? '*Needs eye check-up at store*' : null,
    notes ? `*Notes:* ${notes}` : null,

    divider,
    'Please reply with price quote and availability.',
  ].filter((l) => l !== null).join('\n');

  const number = whatsappNumber.replace(/\D/g, '');
  return `https://wa.me/${number}?text=${encodeURIComponent(lines)}`;
}

module.exports = buildWhatsAppUrl;
