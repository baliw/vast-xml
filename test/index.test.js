 var fs = require('fs')
  , test = require('tap').test
  , libxmljs = require('libxmljs');

var linear = require('./linear.test.js');

test('validates linear vast XML', function(t) {
  var response = linear.xml({ pretty : true, indent: '  ', newline: '\n' });
  // TB: If desired, uncomment here and write file to disk for review:
  // fs.writeFileSync('./test/files/linear.xml', response);
  xml = libxmljs.parseXmlString(response);
  xsd = libxmljs.parseXmlString(fs.readFileSync('./test/files/vast3_draft.xsd').toString());
  var result = xml.validate(xsd);
  t.ok(result, 'It validates against the VAST .xsd');
  t.end();
});