# PostMessage

[![Build Status](https://travis-ci.org/cayasso/postmessage.png?branch=master)](https://travis-ci.org/cayasso/postmessage)

Cross domain messaging made easy with `window.postMessage`.

## Instalation

As component:

```bash
$ component install cayasso/postmessage
```

Or you can just grab the postmessage.js bundle file and include it in your page:

```html
<script src="postmessage.js"></script>
```

## Usage

### On the main window

```javascript
var target = document.getElementById('myiframe').contentWindow;
var pub = postmessage('pub')();
var sub = postmessage('sub')(target);

sub.bind(function(message){
  console.log(message); // -> THANK YOU
});

```

### On the iframe

```javascript
var pub = postmessage('pub')();
var sub = postmessage('sub')();

sub.subscribe(function(message){
  // send back to parent window
  pub.send('THANK YOU');
});

```

## API

### postmessage([type])

This method return a postmessage `type`, this can be `pub` for publishing or `sub` for subscribing.

```javascript
var Pub = postmessage('pub');
var Sub = postmessage('sub');
```
### Pub([target])

Create a publisher instance, a target window can be passed as first argument, if none the target 
window will be `window.parent`.

```javascript
var Pub = postmessage('pub');
var pub = Pub(targetWindow);
```
### pub.target([window]);

Target window setter and/or getter, if no argument is passed it will get the current 
target window, else it will set a target window.

```javascript
pub.target(targetWindow);

// get the current target window
var target = pub.target();
```

### pub.origin([domain]);

Target origin setter and/or getter, if no argument is passed it will get the current 
target origin, else it will set a target origin.

```javascript
pub.origin('http://example.com');

// get the current target window
console.log(pub.origin()); // -> http://example.com
```

### pub.defaults()

Reset publisher `target` window and `origin` to defaul values. 

```javascript
pub.origin('http://example.com');

// reset publisher
pub.defaults();

// get the current target window
console.log(pub.origin()); // -> '*'
```

### pub.send(data, [target, [origin]])

Send a message to a target window. You can pass the target and origin as second 
and third parametters correspondingly.

```javascript
pub.send({ hello: 'world' });

or with a target window:

pub.send({ hello: 'world' }, targetWindow);

or with specifying the origin:

pub.send({ hello: 'world' }, targetWindow, 'http://example.com');
```

### Sub([window])

## Run tests

First in the root directory do:

``` bash
$ npm install
```

Then run the test like this:

``` bash
$ make test
```

## License

(The MIT License)

Copyright (c) 2013 Jonathan Brumley &lt;cayasso@gmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
