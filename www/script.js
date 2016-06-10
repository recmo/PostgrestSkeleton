'use strict';

//
// JS fixups
//

RegExp.escape = function(str) {
	return String(str).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, "\\$1");
};

Array.prototype.clone = function(x) {
	return this.slice(0);
}

Array.prototype.remove = function(x) {
	return this.splice(x, 1)[0];
}

Array.prototype.insert = function(x, v) {
	this.splice(x, 0, v);
}

Array.prototype.swap = function (x,y) {
	var b = this[x];
	this[x] = this[y];
	this[y] = b;
	return this;
}

Array.prototype.repeat = function(times) {
	var arrays = [];
	for(var i =0; i < times; ++i) {
		arrays.push(this);
	}
	return Function.prototype.call.apply(Array.prototype.concat, arrays);
}

Array.range = function(a, b, s) {
	var start = b === undefined ? 0 : a;
	var end = b === undefined ? a : b;
	var step = s === undefined ? 1 : s;
	var result = [];
	for(var n = start; n < end; n += step) {
		result.push(n);
	}
	return result;
}

function to_array(obj) {
	var array = [];
	for(var i = 0; i != obj.length; i++) { 
		array.push(obj[i]);
	}
	return array;
}

function for_each(obj, func) {
	for(var i = 0; i != obj.length; i++) { 
		func(obj[i], i, obj.length);
	}
}

Array.prototype.permutations = function() {
	if(this.length == 0)
		return [];
	if(this.length == 1)
		return [this];
	return this.reduce(function permute(res, item, key, arr) {
		return res.concat(arr.length > 1
			&& arr.slice(0, key)
				.concat(arr.slice(key + 1))
				.reduce(permute, [])
				.map(function(perm){return [item].concat(perm)})
			|| item);
	}, []);
}

Array.prototype.equals = function(other, equality) {
	if(equality === undefined) {
		equality = function(a, b){return a === b;}
	}
	return this.length === other.length
		&& this.every(function(e, i) {
			return equality(e, other[i])
	});
}

Array.prototype.unique = function(equality) {
	if(equality === undefined) {
		equality = function(a, b){return a === b;}
	}
	return this.filter(function(e,i,a) {
		return i == a.findIndex(function(f) {
			return equality(e, f)
		});
	});
}

// An improved join that understands a final_interjection to
// create sentences like "A, B, and C".
Array.prototype.join = function(interjection, final_interjection) {
	if(this.length == 0)
		return undefined;
	if(this.length == 1)
		return this[0];
	var result = this[0] !== undefined ? this[0] : '';
	for(var i = 1; i < this.length; ++i) {
		if(interjection !== undefined) {
			if(i < this.length - 1) {
				result += interjection;
			} else if(i === this.length - 1) {
				if(final_interjection !== undefined) {
					result += final_interjection;
				} else {
					result += interjection;
				}
			}
		}
		if(this[i] !== undefined) {
			result += this[i];
		}
	}
	return result;
}

Array.prototype.equals = function(other) {
	return this.every(function(e,i) {
		return e == other[i];
	});
}

// Take element at position x and move it to position y, shifting
// all elements in between.
Array.prototype.reorder = function(from, to) {
	// @note this could also be done in place using a loop
	//       and a temp variable.
	// @todo test for to < from and from > to
	this.insert(to, this.remove(from));
}

var HTMLEscapeElement = document.createElement('div');
function HTMLEscape(str) {
	HTMLEscapeElement.textContent = str;
	return HTMLEscapeElement.innerHTML;
}
function HTMLUnescape(str) {
	HTMLEscapeElement.innerHTML = str;
	return HTMLEscapeElement.textContent;
}

// Work around chrome bug
// https://code.google.com/p/chromium/issues/detail?id=401699
NodeList.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator];
HTMLCollection.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator];


function rescale_array(node, size) {
	var template = node.children[0];
	for(var i = node.children.length; i < size + 1; ++i) {
		var inst = template.cloneNode(true);
		inst.removeAttribute('hidden');
		node.appendChild(inst);
	}
	while(node.children.length > size + 1)
		node.removeChild(node.children[node.children.length - 1]);
}

//
// Deep copy object
//

function deep_copy_object(obj) {
	return JSON.parse(JSON.stringify(obj));
}

//
// Parse URLs
//

function parse_url(url) {
	var a = document.createElement('a');
	a.href = url;
	var obj = {
		prot: a.protocol,
		host: a.hostname,
		port: a.port,
		path: a.pathname.split('/').filter(function(e){return e.length > 0;}),
		hash: a.hash.slice(1),
		query: {},
		toString: function(){return a.href},
	};
	var q = a.search.slice(1).split('&');
	for (var i = 0; i < q.length; i++) {
		var b = q[i].split('=');
		obj.query[decodeURIComponent(b[0])] = decodeURIComponent(b[1] || '');
	}
	return obj;
}

//
// Auto scale textareas
//

function auto_scale_textarea() {
	var border = this.offsetHeight - this.clientHeight;
	var height = this.scrollHeight + border;
	height = height < 95 ? 95 : height;
	this.style.height = height + "px";
}

function rescale_textareas() {
	for_each(document.getElementsByTagName('textarea'), function(el) {
		auto_scale_textarea.call(el, []);
	});
}

window.addEventListener('DOMContentLoaded', function() {
	rescale_textareas();
	for_each(document.getElementsByTagName('textarea'), function(el) {
		el.addEventListener('input', auto_scale_textarea);
	});
});


//
// Create and trigger custom events
//

function create_event(name) {
	return function(data) {
		var event = document.createEvent('CustomEvent');
		event.initCustomEvent(name, true, true, data);
		return document.dispatchEvent(event);
	}
}
//
// document.addEventListener('test', function(e) {
// 	console.log(e);
// });
//
// var test_event = create_event('test');
//
// test_event('haha');
//

//
// Super simple template engine
//

function join(node, data) {
	if(node === undefined || node === null) {
		console.error('Node undefined or null');
		return node;
	}
	if(node.constructor === String)
		return join(document.getElementById(node), data);
	if(node.dataset !== undefined) {
		if('arrayIndex' in node.dataset) {
			return node; // These are handled by a preceding data-array
		}
		if(node.dataset.value !== undefined) {
			if(node.dataset.value === '')
				node.value = data;
			else if(node.dataset.value in data)
				node.value = data[node.dataset.value];
			return node;
		}
		if(node.dataset.content !== undefined) {
			if(node.dataset.content === '')
				node.textContent = data;
			else if(node.dataset.content in data)
				node.textContent = data[node.dataset.content];
			return node;
		}
		if(node.dataset.join !== undefined) {
			eval('(function(data){'+node.dataset.join+'})').apply(node, [data]);
			return node;
		}
		if(node.dataset.array !== undefined) {
			if(!('content' in node)) {
				console.error('data-array must be used on a <template> element', node);
				return node;
			}
			var a = node.dataset.array === '' ? data : data[node.dataset.array];
			if(!(a instanceof Array)) {
				console.error('Data is not an array', node, a);
				return node;
			}
			
			// Remove previous instances
			while(node.nextElementSibling
				&& 'arrayIndex' in node.nextElementSibling.dataset)
				node.parentNode.removeChild(node.nextElementSibling);
			
			// Create new instances
			var t = node.content.children[0];
			for(var i = a.length - 1; i >= 0 ; --i) {
				var clone = document.importNode(t, true);
				join(clone, a[i]);
				clone.dataset.arrayIndex = i;
				node.parentNode.insertBefore(clone, node.nextSibling);
			}
			return node;
		}
	}
	if(node.join !== undefined && node.join !== Node.prototype.join) {
		node.join(data);
		return node;
	}
	for_each(node.children, function(child) {
		join(child, data);
	});
	return node;
}

function extract(node) {
	// console.log("Extract: ", node);
	function objectify(name, value) {
		if(value === "undefined")
			value = undefined;
		if(value === "null")
			value = null;
		if(name === '')
			return value;
		var r = {};
		r[name] = value;
		return r;
	}
	if(node.constructor == String)
		return extract(document.getElementById(node));
	if(node.dataset !== undefined) {
		if(node.dataset.value !== undefined)
			return objectify(node.dataset.value, node.value);
		if(node.dataset.content !== undefined)
			return objectify(node.dataset.content, node.textContent);
		if(node.dataset.extract !== undefined)
			return eval('(function(){'+node.dataset.extract+'})').apply(node, []);
		if(node.dataset.array !== undefined) {
			if(!('content' in node)) {
				console.error('data-array must be used on a <template> element', node);
				return node;
			}
			var name = node.dataset.array;
			
			// Collect instances
			var a = [];
			while(node.nextElementSibling
				&& 'arrayIndex' in node.nextElementSibling.dataset) {
				node = node.nextElementSibling;
				a.push(extract(node));
			}
			return objectify(name, a);
		}
	}
	if(node.extract && node.extract !== Node.prototype.extract)
		return node.extract();
	var acc = undefined;
	for(var i = 0; i < node.children.length; ++i) {
		var child = node.children[i];
		if(child.dataset && 'arrayIndex' in child.dataset)
			continue; // These are handled by a preceding data-array
		var data = extract(child);
		if(data === undefined)
			continue;
		if(data instanceof Array)
			return data;
		if(!(data instanceof Object))
			return data;
		if(acc === undefined)
			acc = {};
		acc = Object.assign(acc, data);
	}
	return acc;
}

//
// Authentication using Auth0
//
// <button id="auth0-login"></button>
// <button id="auth0-logout"></button>
// <button id="auth0-register"></button>
//
var user_log_in_try_event = create_event('log_in_try');
var user_log_in_event = create_event('log_in');
var user_log_out_event = create_event('log_out');
var user_token = null;
var user_profile = null;
var user_id = null;
var lock = new Auth0Lock'[Insert Auth0Token here]', 'example.auth0.com');
var lock_options = {
	callbackURL: 'https://example.com/',
	responseType: 'token',
	authParams: {
		scope: 'openid role userid'
	}
};
lock.on('hidden', function() {
	if(user_id != null) {
		user_log_in_event();
	} else {
		user_log_out_event();
	}
});

function lock_callback(err, profile, token) {
	if(err) {
		console.error(err);
		
		// Make sure the user is logged out
		window.localStorage.removeItem('id_token');
		user_profile = null;
		user_token = null;
		user_log_out_event();
		return;
	}
	
	// Store in global variables
	user_token = token;
	user_profile = profile;
	user_id = profile.user_id;
	
	// Store the token for re-use
	localStorage.setItem('id_token', token);
	
	// Upsert user profile in database
	api.post('/rpc/login')
	.body({user_profile: user_profile})
	.then(function(){})
	.send();
	
	// Trigger user event
	user_log_in_event(profile);
}
function lock_try_token(token) {
	try {
		// Fetch the user profile
		user_log_in_try_event();
		lock.getProfile(token, function(err, profile) {
			lock_callback(err, profile, token);
		});
	} catch(error) {
		lock_callback(error);
	}
}

// Log in using hash token
function lock_try_hash_token() {
	var hash = lock.parseHash(window.location.hash);
	if(hash && hash.id_token) {
		// Remove the hash from the url
		window.location.hash = '';
		window.history.replaceState("", document.title,
			window.location.pathname + window.location.search);
		console.log("Trying authentication token from hash...");
		
		// TODO: We arrived back at /, but have the original url
		// stored in hash.state. We should move there.
		lock_try_token(hash.id_token);
		return true;
	}
	return false;
}

// Log in using store token
function lock_try_stored_token() {
	var token = localStorage.getItem('id_token');
	if(token) {
		console.log("Trying authentication token from local storage...");
		lock_try_token(token);
		return true;
	}
	return false;
}

window.addEventListener('DOMContentLoaded', function(){
	if(!lock_try_hash_token())
		lock_try_stored_token();
});

function register() {
	user_log_in_try_event();
	var clone = JSON.parse(JSON.stringify(lock_options));
	clone.authParams.state = window.location.href;
	lock.showSignup(clone);
}
function login() {
	user_log_in_try_event();
	var clone = JSON.parse(JSON.stringify(lock_options));
	clone.authParams.state = window.location.href;
	lock.show(clone);
}
function logout() {
	window.localStorage.removeItem('id_token');
	user_profile = null;
	user_token = null;
	lock.logout({ returnTo: window.location.href });
	user_log_out_event();
}

//
// PostgREST
//
// Taken from: https://github.com/calebmer/postgrest-client

function Api(url) {
	this.url = url;
	this.request = function(method, path) {
		var r = {
			method: method,
			path: this.url + path,
			headers: {},
			query: {},
			then_handler: function(data) {console.log(data)},
			catch_handler: function(error) {console.log(error)},
			payload: null,
			match: function(query) {
				var self = this;
				Object.keys(query).forEach(function(key) {
					return self.eq(key, query[key]);
				});
				return this
			},
			select: function(select) {
				this.query['select'] = select.replace(/\s/g, '');
				return this
			},
			order: function(property, ascending, nullsFirst) {
				this.query['order'] = `${property}.${ascending ? 'asc' : 'desc'}.${nullsFirst ? 'nullsfirst' : 'nullslast'}`;
				return this
			},
			range: function(from, to) {
				this.headers['Range-Unit'] = 'items';
				this.headers['Range'] = (from || '0') + '-' + (to || '');
				return this;
			},
			single: function() {
				this.headers['Prefer'] = 'plurality=singular';
				return this;
			},
			representation: function() {
				this.headers['Prefer'] = 'return=representation';
				return this;
			},
			body: function(data) {
				this.payload = data;
				return this;
			},
			send: function() {
				if(this.xhr !== undefined) {
					return this;
				}
				
				// Construct the path
				this.path += '?';
				for(var key in this.query) {
					this.path += key + '=' + encodeURIComponent(this.query[key]) +'&';
				}
				
				// Construct the XHR
				this.xhr = new XMLHttpRequest();
				this.xhr.open(this.method, this.path, true);
				
				// Add the headers
				for(var key in this.headers) {
					this.xhr.setRequestHeader(key, this.headers[key]);
				}
				
				// Set the readyState handler
				var x = this.xhr;
				var catch_handler = this.catch_handler;
				var then_handler = this.then_handler;
				this.xhr.onreadystatechange = function() {
					if(x.readyState !== 4)
						return;
					if(x.status >= 200 && x.status < 300) {
						var body = {};
						if(x.responseText.length > 0){
							try {
								body = JSON.parse(x.responseText)
							} catch(e) {
								catch_handler("Response is not valid JSON.");
								return;
							}
						}
						
						// Add range bounds
						var range = x.getResponseHeader('Content-Range');
						var regexp = /^(\d+)-(\d+)\/(\d+)$/
						if(Array.isArray(body) && range && regexp.test(range)) {
							var match = regexp.exec(range);
							body.from = parseInt(match[1], 10);
							body.to = parseInt(match[2], 10);
							body.fullLength = parseInt(match[3], 10);
						}
						
						// Call the handler
						if(typeof(then_handler) == 'function')
							then_handler(body);
					} else {
						var error = x.responseText;
						try {
							error = JSON.parse(error).message;
						}
						catch(e) {
						}
						if(typeof(catch_handler) == 'function')
							catch_handler(error);
					}
				};
				
				// Send the request
				if(this.payload !== null) {
					this.xhr.setRequestHeader('Content-Type', 'application/json');
					
					// Work around https://github.com/begriffs/postgrest/issues/501
					var arrayConvert = function(object) {
						'use strict';
						if(Array.isArray(object)) {
							return '{' + object.map(arrayConvert).join(',') + '}';
						} else {
							return JSON.stringify(object);
						}
					}
					for(var key in this.payload) {
						if(Array.isArray(this.payload[key])) {
							this.payload[key] = arrayConvert(this.payload[key]);
						}
					}
					this.xhr.send(JSON.stringify(this.payload));
				} else {
					this.xhr.send();
				}
				return this;
			},
			then: function(callback) {
				this.then_handler = callback;
				return this.send();
			},
			catch: function(callback) {
				this.catch_handler = callback;
				return this.send();
			}
		}
		
		// Set default headers
		r.headers['Accept'] = 'application/json';
		r.headers['Prefer'] = path.startsWith('/rpc/') ? 'count=none' : '';
		
		// Add the user's JWT token if set
		if(user_token !== null)
			r.headers['Authorization'] = 'Bearer ' + user_token;
		
		// Quickly add all filters
		'eq gt lt gte lte like ilike is in not'.split(' ').map(function(filter) {
			r[filter] = function(name, value) {
				r.query[name] = `${filter}.${Array.isArray(value) ? value.join(',') : value}`
				return r;
			}
		});
		return r;
	};
	
	// Quickly add all methods
	var self = this;
	'POST GET PATCH DELETE OPTIONS'.split(' ').map(function(method) {
		self[method.toLowerCase()] = function(path) {
			return self.request(method, path);
		};
	});
}
var api = new Api('/api/');
