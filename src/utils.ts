export default {
    isWxApplet() {
        if (typeof wx !=='object') return false;
        if (!wx.navigateTo) return false;
        if (!wx.redirectTo) return false;
        if (!wx.navigateBack) return false;
        if (typeof getCurrentPages !== 'function') return false;
        return true;
    }
}