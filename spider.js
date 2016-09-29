var charset = require('superagent-charset');
const request = charset(require('superagent'));
const cheerio = require('cheerio');
const fs = require('fs');
//文件存储路径
var file = '/Users/bigkucha/Downloads/大主宰.txt';
var pageUrl = 'http://www.biquge.la/book/176/';

request.get(pageUrl).end(function (err, res) {
    var $ = cheerio.load(res.text);
    $('#list dl dd a').each(function (idx, ele) {
        var href = $(ele).attr('href');
        var infoUrl = pageUrl + href;
        //抓取详情页
        request.get(infoUrl).charset('GBK').end(function (errInfo, resInfo) {
            if (errInfo != null) {
                console.log(errInfo);
                return;
            }
            var $ = cheerio.load(resInfo.text);
            var title = $('div.bookname h1').html();
            title = toChinese(title);
            var content = content = toChinese($('#content').html().substr(25));
            content = '【' + title + "】\r\n" + content.replace(/<br\s*\/?>/g, "\n");
            fs.appendFileSync(file, content);
        });
    });
});

/**
 * 中文转换
 * @param str
 */
function toChinese(str) {
    return unescape(str.replace(/&#x/g, '%u').replace(/;/g, '').replace(/%uA0/g, ' '));
}
