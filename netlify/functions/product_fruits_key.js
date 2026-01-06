exports.handler = async () => ({
  statusCode: 200,
  headers: { 'Content-Type': 'text/plain' },
  body: process.env.PRODUCT_FRUITS || '',
})
