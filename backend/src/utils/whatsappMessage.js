function buildWhatsAppUrl(whatsappNumber, inquiry) {
  const { frameName, powerRequired, lensBrand, lensTypes, customerName, phone } = inquiry;

  const message = [
    'Hello,',
    'I am interested in the following frame:',
    '',
    `Frame: ${frameName}`,
    `Need Power: ${powerRequired ? 'Yes' : 'No'}`,
    lensBrand ? `Lens Brand: ${lensBrand}` : null,
    lensTypes?.length ? `Lens Types: ${lensTypes.join(', ')}` : null,
    `Customer Name: ${customerName}`,
    `Phone: ${phone}`,
    '',
    'Please provide a quotation.',
    'Thank you.',
  ]
    .filter((line) => line !== null)
    .join('\n');

  const number = whatsappNumber.replace(/\D/g, '');
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

module.exports = buildWhatsAppUrl;
