  try {
    postmessage = require('../postmessage');
    expect = require('expect.js');
    window = { addEventListener: function(){}};
  } catch (e) {
  }

  var Pub = postmessage.Pub
  , Sub = postmessage.Sub;


describe('postmessage', function () {

  it('should expose constructors', function(){
    expect(postmessage.Pub).to.exist;
    expect(postmessage.Pub).to.be.a('function');
    expect(postmessage.Sub).to.exist;
    expect(postmessage.Sub).to.be.a('function');
  });

  it('should select the correct postmessage type', function(){
    expect(postmessage('sub')).to.be(Sub);
    expect(postmessage('pub')).to.be(Pub);
  });

  describe('pub', function () {
    it('should expose public methods', function(){
      var pub = Pub();
      expect(pub.defaults).to.exist;
      expect(pub.defaults).to.be.a('function');
      expect(pub.origin).to.exist;
      expect(pub.origin).to.be.a('function');
      expect(pub.target).to.exist;
      expect(pub.target).to.be.a('function');
      expect(pub.send).to.exist;
      expect(pub.send).to.be.a('function');
    });

    it('should allow setting target from constructor', function(){
      var win = {};
      var pub = Pub(win);
      expect(pub.target()).to.be(win);
    });
    
    it('should allow setting and getting target', function(){
      var win = {};
      var pub = Pub();
      pub.target(win);
      expect(pub.target()).to.be(win);
    });
    
    it('should allow setting and getting target origin', function(){
      var win = {};
      var pub = Pub();
      pub.origin('http://www.google.com');
      expect(pub.origin()).to.be('http://www.google.com');
    });
    
    it('should allow setting target and origin back to default values', function(){
      var win = {};
      var pub = Pub();
      pub
      .target(win)
      .origin('http://www.google.com')
      .defaults();
      expect(pub.target()).to.be(window);
      expect(pub.origin()).to.be('*');
    });
  });

  describe('sub', function () {

    it('should expose public methods', function(){
      var sub = Sub();
      expect(sub.bind).to.exist;
      expect(sub.bind).to.be.a('function');
      expect(sub.unbind).to.exist;
      expect(sub.unbind).to.be.a('function');
      expect(sub.origin).to.exist;
      expect(sub.origin).to.be.a('function');
      expect(sub.destroy).to.exist;
      expect(sub.destroy).to.be.a('function');
    });
    
    it('should allow setting window from constructor', function(){
      var win = { addEventListener: function(){}};
      var sub = Sub(win);
      expect(sub.win).to.be(win);
    });

    it('should destroy subscriber', function (){
      var sub = Sub()
      .origin('http://www.google.com')
      .origin('http://www.hotmail.com')
      .bind(function(){})
      .bind(function(){})
      .destroy();
      expect(sub.origins).to.be.empty();
      expect(sub.fns).to.be.empty();
      expect(sub.win).to.be(window);
    });

    it('should allow adding subscribers', function (){
      var sub = Sub();
      sub
      .origin('http://www.google.com')
      .origin('http://www.hotmail.com');
      expect(sub.origins.length).to.be(2);
      expect(sub.matches('http://www.google.com')).to.be.ok();
      expect(sub.matches('http://www.hotmail.com')).to.be.ok();
      expect(sub.origins[0]).to.be('http://www.google.com');
      expect(sub.origins[1]).to.be('http://www.hotmail.com');
    });

    it('match should pass when no origin is passed', function (){
      var sub = Sub();
      expect(sub.matches('http://www.google.com')).to.be.ok();
    });

    it('should allow binding functions', function(){
      var win = {};
      var sub = Sub();
      sub
      .bind(function(){})
      .bind(function(){});
      expect(sub.fns.length).to.be(2);
      expect(sub.fns[0]).to.be.a('function');
      expect(sub.fns[1]).to.be.a('function');
    });

    it('should allow unbinding functions', function(){
      var win = {};
      var sub = Sub();
      var fn1 = function(){};
      var fn2 = function(){};
      sub
      .bind(fn1)
      .bind(fn2)
      .unbind(fn1)
      .unbind(fn2);
      expect(sub.fns).to.be.empty();
    });

    it('should allow unbinding all functions', function(){
      var win = {};
      var sub = Sub();
      var fn1 = function(){};
      var fn2 = function(){};
      sub
      .bind(fn1)
      .bind(fn2)
      .unbind();
      expect(sub.fns).to.be.empty();
    });
  });

});