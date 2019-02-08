export default {
    /**
     * 鉴定是否处于小程序环境
     */
    isWxApplet() {
        if (typeof wx !=='object') return false;
        if (!wx.setStorage) return false;
        if (!wx.getStorage) return false;
        if (!wx.getStorageInfo) return false;
        return true;
    }
}