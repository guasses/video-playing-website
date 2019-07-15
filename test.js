var BaseModel = require('./base_model');
var mysql = require('mysql');
var rowInfo = {};
var tableName = 'test';

var baseModel = new BaseModel();   
/*var whereJson = {
    'and':[{'key':'book_name','opts':'=','value':'"nodejs book"'},
    {'key':'author','opts':'=','value':'"danhuang"'}],
    'or':[{'key':'book_id','opts':'<','value':10}]
};
var fieldsArr = ['book_name','author'];
var orderByJson = {'key':'book_name','type':'desc'};
var limitArr = [0,10];
baseModel.find(tableName,whereJson,orderByJson,limitArr,fieldsArr,function(ret){
    console.log(ret);
})*/

/*baseModel.count('movie',function(result){
    console.log(result);
})*/