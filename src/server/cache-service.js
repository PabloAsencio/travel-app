const fs = require('fs');
const NodeCache = require('node-cache');

const cacheService = (function () {
    const secondsInOneDay = 24 * 3600;
    let standardTTL = secondsInOneDay;
    let cacheFilePath = '';
    const cache = new NodeCache({
        useClones: false,
        deleteOnExpire: true,
    });

    function load(filePath, standardTTL = secondsInOneDay) {
        cacheFilePath = filePath;
        const cacheFile = fs.readFileSync(filePath);
        const diskCache = JSON.parse(cacheFile);
        for (const item in diskCache) {
            const ttl = computeTTL(diskCache[item].timestamp);
            if (ttl > 30) {
                cache.set(item, diskCache[item], ttl);
            }
        }
    }

    function save(filePath = cacheFilePath) {
        const keys = cache.keys();
        const diskCache = cache.mget(keys);
        fs.writeFileSync(filePath, JSON.stringify(diskCache));
    }

    function hasKey(key) {
        return cache.has(key);
    }

    function get(key) {
        return cache.get(key);
    }

    function set(key, value) {
        const timestamp = Date.now();
        value.timestamp = timestamp;
        cache.set(key, value, standardTTL);
    }

    function close() {
        cache.flushAll();
        cache.close;
    }

    function computeTTL(timestamp) {
        return Math.floor((timestamp + standardTTL * 1000 - Date.now()) / 1000);
    }
    return {
        load: load,
        save: save,
        close: close,
        hasKey: hasKey,
        get: get,
        set: set,
    };
})();

module.exports = cacheService;
