module.exports = (api) => {
    api.registerAccessory('table_lamp', AccessoryPluginTableLamp);
}
const http=require('http')
function fuc(res,log) {
    const { statusCode } = res;
    const contentType = res.headers['content-type'];

    let error;
    // 任何 2xx 状态码都表示成功响应，但这里只检查 200。
    if (statusCode !== 200) {
        error = new Error('Request Failed.\n' +
            `Status Code: ${statusCode}`);
        // } else if (!/^application\/json/.test(contentType)) {
        //     error = new Error('Invalid content-type.\n' +
        //         `Expected application/json but received ${contentType}`);
    }
    if (error) {
        log.error(error.message);
        // 消费响应数据以释放内存
        res.resume();
        return;
    }
    res.setEncoding('utf8');
    let rawData = '';
    res.on('data', (chunk) => { rawData += chunk;
    });
    res.on('end', () => {
        try {
            //console.log(rawData);
            const parsedData = JSON.parse(rawData);
            log.log(parsedData);
            return parsedData;
        } catch (e) {
            log.error(e.message);
        }
    });

}
class AccessoryPluginTableLamp {

    /**
     * REQUIRED - This is the entry point to your plugin
     */
    constructor(log, config, api) {
        this.log = log;
        this.config = config;
        this.api = api;

        this.log.debug('Table Lamp Accessory Plugin Loaded');

        // your accessory must have an AccessoryInformation service
        this.informationService = new this.api.hap.Service.AccessoryInformation()
            .setCharacteristic(this.api.hap.Characteristic.Manufacturer, "Custom Manufacturer")
            .setCharacteristic(this.api.hap.Characteristic.Model, "Custom Model");

        // create a new "Switch" service
        this.switchService = new this.api.hap.Service.Switch(this.name);

        // link methods used when getting or setting the state of the service
        this.switchService.getCharacteristic(this.api.hap.Characteristic.On)
            .onGet(this.getOnHandler.bind(this))   // bind to getOnHandler method below
            .onSet(this.setOnHandler.bind(this));  // bind to setOnHandler method below
    }

    /**
     * REQUIRED - This must return an array of the services you want to expose.
     * This method must be named "getServices".
     */
    getServices() {
        return [
            this.informationService,
            this.switchService,
        ];
    }

    async getOnHandler() {
        //this.log.info('Getting switch state');

        // get the current value of the switch in your own code
        const value = false;

        return value;
    }

    async setOnHandler(value) {
        http.get('http://localhost:8001/homebrigde/switch/'+ this.config.name+'/'+value.toString(),function  (res){
            fuc(res,this.log);
        }).on('error', (e) => {
            this.log.error(`Got error: ${e.message}`);
        });
    }
}
