export default interface IStorage {
    set(obj: Object):Promise<any>;
    set(key:string, val: any):Promise<any>;
    get(key: string): Promise<any>;
    getLocalStorage(): Promise<any>;
    getLocalStorage(): Promise<any>;
}