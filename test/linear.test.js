var fs = require('fs')
  , test = require('tap').test
  , VAST = require('../index.js')
  , vast = new VAST();

var ad = vast.attachAd({ 
      id : 1
    , sequence : 99
    , AdTitle : 'Common name of the ad'
    , AdSystem : { name: 'Test Ad Server', version : '1.0' }
  });

test('`VAST` object', function(t){
  t.ok(vast, 'It should construct VAST responses');
  t.equal(vast.version, '3.0', 'It should default to VAST 3.0');
  t.ok(vast.attachAd, 'It should define a method to attach ads');
  t.equal(vast.ads.length, 1, 'It should attach Ad objects to the VAST object after calling #attachAd');
  t.ok(ad, 'It should return an ad object when attaching');
  t.end();
});

test('object settings', function(t) {
  t.equal(ad.id, 1, 'It should allow for setting `id` attributes on Ad objects');
  t.equal(ad.sequence, 99, 'It should allow for setting `sequence` attributes on Ad objects');
  t.equal(ad.Wrapper, undefined, 'It should not define a wrapper in a default VAST response');
  t.equal(ad.AdSystem.name, 'Test Ad Server', 'It should set `AdSystem`');
  t.equal(ad.AdTitle, 'Common name of the ad', 'It should set `AdTitle`');
  ad.addImpression('sample-server', 'http://impression.com');
  t.equal(ad.impressions[0].url, 'http://impression.com', 'It should set `Impression`');
  t.ok(ad.creatives, 'It should have a `creatives` array');
  t.end();
});


test('attach creatives and events', function(t){
  var creative = ad.attachLinearCreative({
      AdParameters : '<xml></xml>'
    , Duration : '00:00:30'
  });
  t.ok(creative, 'It should return creative when attaching a Linear creative');
  t.equal(creative.Duration, '00:00:30', 'It should set a duration');
  t.throws(function(){ ad.attachLinearCreative() }, 'It should throw an error if no Duration is used');
  creative.attachMediaFile('http://domain.com/file.ext');
  t.equal(creative.mediaFiles[0].url, 'http://domain.com/file.ext', 'It should set a media file URL');
  creative.attachTrackingEvent('creativeView', 'http://creativeview.com');
  t.equal(creative.trackingEvents[0].url, 'http://creativeview.com', 'It should define tracking event URLs');
  t.equal(creative.trackingEvents[0].event, 'creativeView', 'It should define tracking event types');
  t.throws(function(){ creative.attachTrackingEvent('zingZang', 'http://zing-zang.com') }, 'It should throw an error if an incorrect TrackingEvent `type` is used');  
  creative.attachVideoClick('ClickThrough', 'http://click-through.com');
  t.equal(creative.videoClicks[0].url, 'http://click-through.com', 'It should define video click URLs');
  t.equal(creative.videoClicks[0].type, 'ClickThrough', 'It should define video click types');
  t.throws(function(){ creative.attachVideoClick('zingZang', 'http://zing-zang.com') }, 'It should throw an error if an incorrect VideoClick `type` is used');  
  companionAd = creative.attachCompanionAd('StaticResource', {
      width : 300
    , height : 250
    , type : 'image/jpeg'
    , url : 'http://companionad.com/image.jpg'
  });
  companionAd.attachTrackingEvent('creativeView', 'http://companionad.com/creativeView');
  t.end();
});

module.exports = vast;