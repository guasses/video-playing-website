/**
 * @type module
 * @author guasses
 * @time 2019-07-02
 * @desc desc util.js 一些公有方法
 */
var fs = require('fs'),
sys = require('util');
exports.get = function(fileName,key){
    var configJson = {};
    try{
        var str = fs.readFileSync(fileName,'utf8');
        configJson = JSON.parse(str);
    }catch(e){
        sys.debug("JSON parse fails");
    }
    return configJson[key];
}