/**
 * 通用 Storage 接口
 */
export default interface IStorage {

    /**
     * 批量储存 localStorage
     * @param obj 批量储存对象
     */
    set(obj: Object):Promise<any>;

    /**
     * 储存指定的 storage
     * @param key key
     * @param val 值
     */
    set(key:string, val: any):Promise<any>;

    /**
     * 获取 storage
     * @param key storage 名称
     */
    get(key: string): Promise<any>;

    /**
     * 获取本地已有的 storage
     */
    getLocalStorage(): Promise<any>;
}