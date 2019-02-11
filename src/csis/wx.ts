import IStorage from '../IStorage';

class WxStorage implements IStorage{
    /**
     * storage 的前缀
     */
    private static keyPrefix = "_XSYX_MEMSTORAGE_"

    async set(object: Object):Promise<any>;
    async set(key: string, data: any): Promise<any>;
    async set(...args:any) {
        if (args.length === 1){
            const obj = args[0];
            await Promise.all(Object.keys(obj).map(key => {
                this.set(key, obj[key]);
            }))
        } else if (args.length === 2){
            let key = args[0];
            const data = args[1];
            key = `${WxStorage.keyPrefix}${key}`
            await new Promise((resolve, reject) => {
                wx.setStorage({
                    key,
                    data,
                    success(res: any) {
                        resolve(res.data);
                    },
                    fail(res: { errMsg: string}) {
                        reject(res.errMsg);
                    }
                })
            })
        }
    }

    async get(key: string) {
        key = `${WxStorage.keyPrefix}${key}`
        return await new Promise((resolve, reject) => {
            wx.getStorage({
                key,
                success(res:any) { 
                    resolve(res.data);
                },
                fail(res: any){
                    reject(res.errMsg);
                }
            })
        })
    }
    async getLocalStorage() {
        return await new Promise((resolve, reject)=>{
            const storage: any = {};
            wx.getStorageInfo({
                success: (res: any) => {
                    Promise.all((res.keys || []).filter((entry:string) => {
                        return entry.indexOf(WxStorage.keyPrefix) === 0;
                    }).map(async (key: string) => {
                        const realKey = key.replace(WxStorage.keyPrefix, '');
                        storage[realKey] = await this.get(realKey)
                        return storage[realKey];
                    })).then(()=>{
                        resolve(storage)
                    }).catch(reject)
                },
            })
        })
    }


}

export default new WxStorage()