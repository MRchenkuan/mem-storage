import IStorage from './IStorage';
import wxStorage from './csis/wx';
import h5Storage from './csis/h5';
import utils from './utils';

const debounce = require('lodash.debounce')

class MemStorage {
    private storage: any;
    private queue:any = {};
    private csi: IStorage;

    private setStorage = debounce(() => {
        this.csi.set(this.queue);
        this.queue = [];
    }, 10)

    constructor(csi: IStorage){
        this.csi = csi;
    }
    private enqueueSetUpdate(state: any) {
        const { key, val } = state;
        this.queue[key] = val; // {a:123,b:321}
        this.setStorage()
    }
    async set(object: object, merge: boolean): Promise<any>;
    async set(key: string, data: any, merge: boolean): Promise<any>;
    async set(...args){
        if(typeof args[0] === 'string'){
            const key = args[0];
            const merge = args[2];
            const val = args[1];
            if (merge && typeof val === 'object') {
                Object.assign(this.storage[key], val)
            } else {
                this.storage[key] = val;
            }
            this.enqueueSetUpdate({ key, val: this.storage[key] })
        }else if(typeof args[0] ==='object'){
            const object = args[0]
            const merge = args[1];
            Object.keys(object).map(key =>{
                this.set(key.toString(), object[key], merge);
            })
        }
    }

    merge(key:string, val:any){
        return this.set(key, val, true)
    }

    get(key:string){
        return this.storage[key]
    }

    async syncLocal(key?: string){
        if(key){
            await this.csi.set(key, this.storage[key])
        } else {
            await Promise.all(Object.keys(this.storage).map(key => {
                return this.csi.set(key, this.storage[key])
            }))
        }
    }

    async loadLocal(){
        this.storage = await this.csi.getLocalStorage();
    }
}

export default new MemStorage(utils.isWxApplet() ? wxStorage : h5Storage);