import IStorage from '../IStorage';
import { type } from 'os';

class WxStorage implements IStorage {
    /**
     * storage 的前缀
     */
    private static keyPrefix = "_XSYX_MEMSTORAGE_"

    async set(object: Object): Promise<any>;
    async set(key: string, data: any): Promise<any>;
    async set(...args: any) {
        if (args.length === 1) {
            const obj = args[0];
            await Promise.all(Object.keys(obj).map(key => {
                this.set(key, obj[key]);
            }))
        } else if (args.length === 2) {
            let key = args[0];
            const data = args[1];
            key = `${WxStorage.keyPrefix}${key}`
            if (data && typeof data==='object'){
                localStorage.setItem(key, JSON.stringify(data))
            } else {
                localStorage.setItem(key, data)
            }
        }
    }

    async get(key: string) {
        key = `${WxStorage.keyPrefix}${key}`
        let data = localStorage.getItem(key);
        try{
            return JSON.parse(data);
        }catch{
            return data;
        }
    }
    async getLocalStorage() {
        const storage: any = {};
        return await new Promise((resolve, reject) => {
            Promise.all((Object.keys(localStorage) || []).filter((entry: string) => {
                return entry.indexOf(WxStorage.keyPrefix) === 0;
            }).map(async (key: string) => {
                const realKey = key.replace(WxStorage.keyPrefix, '');
                storage[realKey] = await this.get(realKey);
                return storage[realKey];
            })).then(() => {
                resolve(storage)
            }).catch(reject)
        })
    }
}

export default new WxStorage()