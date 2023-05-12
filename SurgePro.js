/*
 * 由@THAuom修改编写
 * 更新日期：2023.05.12
 * 版本：3.0
 */
(async () => {
  const traffic = await httpAPI('/v1/traffic', 'GET');
  const startTime = getElapsedTime(traffic.startTime * 1000);

  if ($trigger === 'button') {
    await httpAPI('/v1/profiles/reload');
  }

  $done({
    title: 'Surge Pro®',
    content: `启动时长: ${startTime}`,
    icon: params.icon,
    'icon-color': params.color
  });
})();

function getElapsedTime(startTime) {
  const dateDiff = Date.now() - startTime;
  const days = Math.floor(dateDiff / 86400000);
  const hours = Math.floor((dateDiff % 86400000) / 3600000);
  const minutes = Math.floor((dateDiff % 3600000) / 60000);
  const seconds = Math.round((dateDiff % 60000) / 1000);

  const elapsedTime = [
    days ? `${days}天` : '',
    hours ? `${hours}时` : '',
    minutes ? `${minutes}分` : '',
    seconds ? `${seconds}秒` : ''
  ].join('');

  return elapsedTime || '0秒';
}

async function httpAPI(path = '', method = 'POST', body = null) {
  return new Promise((resolve) => {
    $httpAPI(method, path, body, (result) => {
      resolve(result);
    });
  });
}

function getParams(param) {
  return Object.fromEntries(
    param
      .split('&')
      .map((item) => item.split('='))
      .map(([k, v]) => [k, decodeURIComponent(v)])
  );
}