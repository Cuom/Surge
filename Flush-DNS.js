/*
 * 由@THAuom修改编写
 * 更新日期：2023.05.12
 * 版本：3.0
 */

const parseArgument = (argument) => {
    if (typeof argument === 'undefined') return {};
    return Object.fromEntries(argument.split('&').map((item) => item.split('=')));
};

const getDNSCache = async (showServer) => {
    if (!showServer) return '';
    const { dnsCache } = await httpAPI('/v1/dns', 'GET');
    const uniqueServers = [...new Set(dnsCache.map((d) => d.server))];
    return uniqueServers.join('\n');
};

const createPanel = (args, delay, dnsCache) => {
    const panel = {
        title: args.title || 'Flush DNS',
        content: `DNS延迟: ${delay}ms${dnsCache ? `\nserver:\n${dnsCache}` : ''}`,
    };
    if (args.icon) panel.icon = args.icon;
    if (args.color) panel['icon-color'] = args.color;

    return panel;
};

(async () => {
    const args = parseArgument($argument);
    const showServer = args.server !== 'false';
    const dnsCache = await getDNSCache(showServer);

    if ($trigger === 'button') await httpAPI('/v1/dns/flush');

    const { delay } = await httpAPI('/v1/test/dns_delay');
    const panel = createPanel(args, (delay * 1000).toFixed(0), dnsCache);

    $done(panel);
})();

function httpAPI(path = '', method = 'POST', body = null) {
    return new Promise((resolve) => {
        $httpAPI(method, path, body, (result) => {
            resolve(result);
        });
    });
}