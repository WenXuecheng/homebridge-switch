async function switch_on_raspberry(switch_name, switch_option, log) {
    function f(switch_name, switch_option, log) {
        return new Promise(resolve => {
            const http = require('http');
            http.get('http://192.168.1.101:8001/homebridge/switch/' + switch_name + '/' + switch_option, (res) => {
                const {statusCode} = res;
                const contentType = res.headers['content-type'];
                let rawData = '';
                let error;
                // 任何 2xx 状态码都表示成功响应，但这里只检查 200。
                if (statusCode !== 200) {
                    error = new Error('Request Failed.\n' +
                        `Status Code: ${statusCode}`);
                } else if (!/^application\/json/.test(contentType)) {
                    error = new Error('Invalid content-type.\n' +
                        `Expected application/json but received ${contentType}`);
                }
                if (error) {
                    // 消费响应数据以释放内存
                    res.resume();
                    log.error(error.message);
                    return;
                }
                res.setEncoding('utf8');
                res.on('data', (chunk) => {
                    rawData += chunk;
                });
                res.on('end', () => {
                    try {
                        const parsedData = JSON.parse(rawData);
                        log.info(parsedData);
                        resolve(parsedData);
                    } catch (e) {
                        log.error(e.message);
                    }
                });
            }).on('error', (e) => {
                log.error(`Got error: ${e.message}`);
            });
        });
    }
    return await f(switch_name, switch_option, log);
}


