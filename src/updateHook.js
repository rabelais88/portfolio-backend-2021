const axios = require('axios');

const updateHook = async () => {
  const hookUrl = process.env.VERCEL_CONTENT_CHANGE_HOOK_URL ?? '';
  console.log('post changed...');
  if (hookUrl !== '') {
    console.log('requesting FE redeploy via hook');
    return await axios({ url: hookUrl, method: 'POST' });
  }
  console.log(
    'did not request for redeploy because VERCEL_CONTENT_CHANGE_HOOK_URL is missing'
  );
  return null;
};

module.exports = updateHook;
