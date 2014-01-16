##shard
mysql 分库分表查询工具

###API
####1 queryForList
查询多个数据源，将结果放到results数组中
...js
/**
 * 多个数据返回一个数组
 * @param sql
 * @param params
 * @param callback
 * @returns {*}
 */
var sql = 'select * from $tableName$ where yn = ? ';
queryManager.queryForList(sql,[1],function(err,results){
    //results[0] = first table
    //results[1] = second table
    //do something
});
...
tableName 代表表名,在配置文件中配置 具体参考[example](https://github.com/quyangcode/shard/tree/master/examples)

####2 queryForSequenceList
...js
/**
 * 按照配置顺序分页查询结果集
 * @param countSql 总条数sql
 * @param valueSql 查询sql
 * @param params   查询参数
 * @param pageIndex 页数
 * @param pageSize  每页大小
 * @param callback   (err,results)
 * @returns {*}
 */
var countSql = 'select count(1) from $tableName$ where yn = ? ';
var valueSql = 'select * from $tableName$ where yn = ? limit $pageIndex$ , $pageSize$';
queryManager.queryForSequenceList(countSql,valueSql,[1],3,4,function(err,results){
    //do something
});
...
$pageIndex$ , $pageSize$' 分页查询sql中必须存在

####3 queryForSortList(使用此方法要谨慎)
...js
/**
 * 按照指定字段 指定顺序 排序
 * 不建议使用
 * @param idKeySql 返回主键和排序字段sql
 * @param valueSql
 * @param params
 * @param pageIndex
 * @param pageSize
 * @param key  排序字段
 * @param desc 顺序
 * @param callback
 * @returns {*}
 */
var idKeySql = 'select id id,score from $tableName$ where yn = ? ';
var pageSql = 'select * from $tableName$ where id in ( $ids$ ) and yn = ? ';
queryManager.queryForSortList(idKeySql,pageSql,[1],2,4,'score',false,function(err,results){
    //do something
});
...
$ids$ 中间变量，排序后的主键串 必须为此





