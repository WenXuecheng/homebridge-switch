module.exports = (api) => {
    api.registerAccessory('table_lamp', AccessoryPluginTableLamp);
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
        this.log.info('Setting switch state to:', value);
    }
}
