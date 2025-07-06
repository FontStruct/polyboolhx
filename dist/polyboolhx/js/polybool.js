(function ($global) { "use strict";
var $estr = function() { return js_Boot.__string_rec(this,''); },$hxEnums = $hxEnums || {},$_;
function $extend(from, fields) {
	var proto = Object.create(from);
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var DateTools = function() { };
DateTools.__name__ = "DateTools";
DateTools.__format_get = function(d,e) {
	switch(e) {
	case "%":
		return "%";
	case "A":
		return DateTools.DAY_NAMES[d.getDay()];
	case "B":
		return DateTools.MONTH_NAMES[d.getMonth()];
	case "C":
		return StringTools.lpad(Std.string(d.getFullYear() / 100 | 0),"0",2);
	case "D":
		return DateTools.__format(d,"%m/%d/%y");
	case "F":
		return DateTools.__format(d,"%Y-%m-%d");
	case "I":case "l":
		var hour = d.getHours() % 12;
		return StringTools.lpad(Std.string(hour == 0 ? 12 : hour),e == "I" ? "0" : " ",2);
	case "M":
		return StringTools.lpad(Std.string(d.getMinutes()),"0",2);
	case "R":
		return DateTools.__format(d,"%H:%M");
	case "S":
		return StringTools.lpad(Std.string(d.getSeconds()),"0",2);
	case "T":
		return DateTools.__format(d,"%H:%M:%S");
	case "Y":
		return Std.string(d.getFullYear());
	case "a":
		return DateTools.DAY_SHORT_NAMES[d.getDay()];
	case "b":case "h":
		return DateTools.MONTH_SHORT_NAMES[d.getMonth()];
	case "d":
		return StringTools.lpad(Std.string(d.getDate()),"0",2);
	case "e":
		return Std.string(d.getDate());
	case "H":case "k":
		return StringTools.lpad(Std.string(d.getHours()),e == "H" ? "0" : " ",2);
	case "m":
		return StringTools.lpad(Std.string(d.getMonth() + 1),"0",2);
	case "n":
		return "\n";
	case "p":
		if(d.getHours() > 11) {
			return "PM";
		} else {
			return "AM";
		}
		break;
	case "r":
		return DateTools.__format(d,"%I:%M:%S %p");
	case "s":
		return Std.string(d.getTime() / 1000 | 0);
	case "t":
		return "\t";
	case "u":
		var t = d.getDay();
		if(t == 0) {
			return "7";
		} else if(t == null) {
			return "null";
		} else {
			return "" + t;
		}
		break;
	case "w":
		return Std.string(d.getDay());
	case "y":
		return StringTools.lpad(Std.string(d.getFullYear() % 100),"0",2);
	default:
		throw new haxe_exceptions_NotImplementedException("Date.format %" + e + "- not implemented yet.",null,{ fileName : "DateTools.hx", lineNumber : 101, className : "DateTools", methodName : "__format_get"});
	}
};
DateTools.__format = function(d,f) {
	var r_b = "";
	var p = 0;
	while(true) {
		var np = f.indexOf("%",p);
		if(np < 0) {
			break;
		}
		var len = np - p;
		r_b += len == null ? HxOverrides.substr(f,p,null) : HxOverrides.substr(f,p,len);
		r_b += Std.string(DateTools.__format_get(d,HxOverrides.substr(f,np + 1,1)));
		p = np + 2;
	}
	var len = f.length - p;
	r_b += len == null ? HxOverrides.substr(f,p,null) : HxOverrides.substr(f,p,len);
	return r_b;
};
DateTools.format = function(d,f) {
	return DateTools.__format(d,f);
};
var HxOverrides = function() { };
HxOverrides.__name__ = "HxOverrides";
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) {
		return undefined;
	}
	return x;
};
HxOverrides.substr = function(s,pos,len) {
	if(len == null) {
		len = s.length;
	} else if(len < 0) {
		if(pos == 0) {
			len = s.length + len;
		} else {
			return "";
		}
	}
	return s.substr(pos,len);
};
HxOverrides.remove = function(a,obj) {
	var i = a.indexOf(obj);
	if(i == -1) {
		return false;
	}
	a.splice(i,1);
	return true;
};
HxOverrides.now = function() {
	return Date.now();
};
Math.__name__ = "Math";
var Reflect = function() { };
Reflect.__name__ = "Reflect";
Reflect.field = function(o,field) {
	try {
		return o[field];
	} catch( _g ) {
		return null;
	}
};
Reflect.getProperty = function(o,field) {
	var tmp;
	if(o == null) {
		return null;
	} else {
		var tmp1;
		if(o.__properties__) {
			tmp = o.__properties__["get_" + field];
			tmp1 = tmp;
		} else {
			tmp1 = false;
		}
		if(tmp1) {
			return o[tmp]();
		} else {
			return o[field];
		}
	}
};
Reflect.fields = function(o) {
	var a = [];
	if(o != null) {
		var hasOwnProperty = Object.prototype.hasOwnProperty;
		for( var f in o ) {
		if(f != "__id__" && f != "hx__closures__" && hasOwnProperty.call(o,f)) {
			a.push(f);
		}
		}
	}
	return a;
};
Reflect.isFunction = function(f) {
	if(typeof(f) == "function") {
		return !(f.__name__ || f.__ename__);
	} else {
		return false;
	}
};
Reflect.compare = function(a,b) {
	if(a == b) {
		return 0;
	} else if(a > b) {
		return 1;
	} else {
		return -1;
	}
};
Reflect.compareMethods = function(f1,f2) {
	if(f1 == f2) {
		return true;
	}
	if(!Reflect.isFunction(f1) || !Reflect.isFunction(f2)) {
		return false;
	}
	if(f1.scope == f2.scope && f1.method == f2.method) {
		return f1.method != null;
	} else {
		return false;
	}
};
Reflect.isObject = function(v) {
	if(v == null) {
		return false;
	}
	var t = typeof(v);
	if(!(t == "string" || t == "object" && v.__enum__ == null)) {
		if(t == "function") {
			return (v.__name__ || v.__ename__) != null;
		} else {
			return false;
		}
	} else {
		return true;
	}
};
Reflect.isEnumValue = function(v) {
	if(v != null) {
		return v.__enum__ != null;
	} else {
		return false;
	}
};
var Std = function() { };
Std.__name__ = "Std";
Std.string = function(s) {
	return js_Boot.__string_rec(s,"");
};
var StringTools = function() { };
StringTools.__name__ = "StringTools";
StringTools.lpad = function(s,c,l) {
	if(c.length <= 0) {
		return s;
	}
	var buf_b = "";
	l -= s.length;
	while(buf_b.length < l) buf_b += c == null ? "null" : "" + c;
	buf_b += s == null ? "null" : "" + s;
	return buf_b;
};
var ValueType = $hxEnums["ValueType"] = { __ename__:"ValueType",__constructs__:null
	,TNull: {_hx_name:"TNull",_hx_index:0,__enum__:"ValueType",toString:$estr}
	,TInt: {_hx_name:"TInt",_hx_index:1,__enum__:"ValueType",toString:$estr}
	,TFloat: {_hx_name:"TFloat",_hx_index:2,__enum__:"ValueType",toString:$estr}
	,TBool: {_hx_name:"TBool",_hx_index:3,__enum__:"ValueType",toString:$estr}
	,TObject: {_hx_name:"TObject",_hx_index:4,__enum__:"ValueType",toString:$estr}
	,TFunction: {_hx_name:"TFunction",_hx_index:5,__enum__:"ValueType",toString:$estr}
	,TClass: ($_=function(c) { return {_hx_index:6,c:c,__enum__:"ValueType",toString:$estr}; },$_._hx_name="TClass",$_.__params__ = ["c"],$_)
	,TEnum: ($_=function(e) { return {_hx_index:7,e:e,__enum__:"ValueType",toString:$estr}; },$_._hx_name="TEnum",$_.__params__ = ["e"],$_)
	,TUnknown: {_hx_name:"TUnknown",_hx_index:8,__enum__:"ValueType",toString:$estr}
};
ValueType.__constructs__ = [ValueType.TNull,ValueType.TInt,ValueType.TFloat,ValueType.TBool,ValueType.TObject,ValueType.TFunction,ValueType.TClass,ValueType.TEnum,ValueType.TUnknown];
var Type = function() { };
Type.__name__ = "Type";
Type.getEnum = function(o) {
	if(o == null) {
		return null;
	}
	return $hxEnums[o.__enum__];
};
Type.getInstanceFields = function(c) {
	var a = [];
	for(var i in c.prototype) a.push(i);
	HxOverrides.remove(a,"__class__");
	HxOverrides.remove(a,"__properties__");
	return a;
};
Type.typeof = function(v) {
	switch(typeof(v)) {
	case "boolean":
		return ValueType.TBool;
	case "function":
		if(v.__name__ || v.__ename__) {
			return ValueType.TObject;
		}
		return ValueType.TFunction;
	case "number":
		if(Math.ceil(v) == v % 2147483648.0) {
			return ValueType.TInt;
		}
		return ValueType.TFloat;
	case "object":
		if(v == null) {
			return ValueType.TNull;
		}
		var e = v.__enum__;
		if(e != null) {
			return ValueType.TEnum($hxEnums[e]);
		}
		var c = js_Boot.getClass(v);
		if(c != null) {
			return ValueType.TClass(c);
		}
		return ValueType.TObject;
	case "string":
		return ValueType.TClass(String);
	case "undefined":
		return ValueType.TNull;
	default:
		return ValueType.TUnknown;
	}
};
Type.enumParameters = function(e) {
	var enm = $hxEnums[e.__enum__];
	var params = enm.__constructs__[e._hx_index].__params__;
	if(params != null) {
		var _g = [];
		var _g1 = 0;
		while(_g1 < params.length) {
			var p = params[_g1];
			++_g1;
			_g.push(e[p]);
		}
		return _g;
	} else {
		return [];
	}
};
var deepequal_CustomCompare = function() { };
deepequal_CustomCompare.__name__ = "deepequal.CustomCompare";
deepequal_CustomCompare.__isInterface__ = true;
deepequal_CustomCompare.prototype = {
	check: null
	,__class__: deepequal_CustomCompare
};
var deepequal_DeepEqual = function() { };
deepequal_DeepEqual.__name__ = "deepequal.DeepEqual";
deepequal_DeepEqual.compare = function(e,a,pos) {
	var _g = new deepequal__$DeepEqual_Compare(e,a).compare();
	switch(_g._hx_index) {
	case 0:
		var s = _g.s;
		return deepequal_Outcome.Success(s);
	case 1:
		var f = _g.f;
		return deepequal_Outcome.Failure(new deepequal_Error(f.message + " @ v" + deepequal_DeepEqual.reconstructPath(f.path),pos));
	}
};
deepequal_DeepEqual.reconstructPath = function(path) {
	var buf_b = "";
	var _g = 0;
	while(_g < path.length) {
		var p = path[_g];
		++_g;
		switch(p._hx_index) {
		case 0:
			var i = p.i;
			buf_b += Std.string("(enumParam:" + i + ")");
			break;
		case 1:
			var i1 = p.i;
			buf_b += Std.string("[" + i1 + "]");
			break;
		case 2:
			var k = p.n;
			buf_b += Std.string("." + k);
			break;
		case 3:
			var k1 = p.n;
			buf_b += Std.string("[" + Std.string(k1) + "]");
			break;
		}
	}
	return buf_b;
};
var deepequal__$DeepEqual_Compare = function(e,a) {
	this.path = [];
	this.e = e;
	this.a = a;
};
deepequal__$DeepEqual_Compare.__name__ = "deepequal._DeepEqual.Compare";
deepequal__$DeepEqual_Compare.comparer = function(e,a) {
	return new deepequal__$DeepEqual_Compare(e,a).compare();
};
deepequal__$DeepEqual_Compare.prototype = {
	path: null
	,e: null
	,a: null
	,compare: function() {
		if(this.e == null) {
			return this.simple(this.e,this.a);
		} else if(js_Boot.__implements(this.e,deepequal_CustomCompare)) {
			return this.e.check(this.a,deepequal__$DeepEqual_Compare.comparer);
		} else if(this.a == null) {
			return this.fail("Expected " + Std.string(this.e) + " but got null");
		} else if(typeof(this.e) == "string") {
			if(typeof(this.a) != "string") {
				return this.mismatch(this.e,this.a);
			}
			return this.simple(this.e,this.a);
		} else if(((this.e) instanceof haxe__$Int64__$_$_$Int64)) {
			if(!((this.a) instanceof haxe__$Int64__$_$_$Int64)) {
				return this.mismatch(this.e,this.a);
			}
			var a = this.e;
			var b = this.a;
			if(a.high == b.high && a.low == b.low) {
				return deepequal_Outcome.Success(deepequal_Noise.Noise);
			} else {
				return this.mismatch(this.e,this.a);
			}
		} else if(typeof(this.e) == "number") {
			if(typeof(this.a) != "number") {
				return this.mismatch(this.e,this.a);
			}
			return this.simple(this.e,this.a);
		} else if(typeof(this.e) == "boolean") {
			if(typeof(this.a) != "boolean") {
				return this.mismatch(this.e,this.a);
			}
			return this.simple(this.e,this.a);
		} else if(((this.e) instanceof Date)) {
			if(!((this.a) instanceof Date)) {
				return this.mismatch(this.e,this.a);
			}
			return this.date(this.e,this.a);
		} else if(((this.e) instanceof Array)) {
			if(!((this.a) instanceof Array)) {
				return this.fail("Expected array but got " + Std.string(this.a));
			}
			if(this.a.length != this.e.length) {
				return this.fail("Expected array of length " + Std.string(this.e.length) + " but got " + Std.string(this.a.length));
			}
			var _g = 0;
			var _g1 = this.a.length;
			while(_g < _g1) {
				var i = _g++;
				this.path.push(deepequal_Path.Index(i));
				var _g2 = deepequal__$DeepEqual_Compare.comparer(this.e[i],this.a[i]);
				switch(_g2._hx_index) {
				case 0:
					var _g3 = _g2.s;
					this.path.pop();
					break;
				case 1:
					var _g4 = _g2.f;
					var m = _g4.message;
					var p = _g4.path;
					this.path = this.path.concat(p);
					return this.fail(m);
				}
			}
			return this.success();
		} else if(Reflect.isEnumValue(this.e)) {
			var ecls = Type.getEnum(this.e);
			var acls = Type.getEnum(this.a);
			if(acls == null) {
				return this.fail("Expected enum " + ecls.__ename__ + " but got " + Std.string(this.a));
			}
			if(ecls != acls) {
				return this.fail("Expected enum " + ecls.__ename__ + " but got " + acls.__ename__);
			}
			var a = this.a;
			var e = this.e;
			var en = $hxEnums[e.__enum__].__constructs__[e._hx_index]._hx_name;
			var an = $hxEnums[a.__enum__].__constructs__[a._hx_index]._hx_name;
			if(en != an) {
				return this.fail("Expected enum constructor " + en + " but got " + an);
			}
			var _g = deepequal__$DeepEqual_Compare.comparer(Type.enumParameters(e),Type.enumParameters(a));
			switch(_g._hx_index) {
			case 0:
				var _g1 = _g.s;
				return deepequal_Outcome.Success(deepequal_Noise.Noise);
			case 1:
				var f = _g.f;
				var _g = f.path.pop();
				if(_g != null) {
					if(_g._hx_index == 1) {
						var i = _g.i;
						f.path.push(deepequal_Path.EnumParam(i));
					}
				}
				return deepequal_Outcome.Failure(f);
			}
		} else if(((this.e) instanceof haxe_io_Bytes)) {
			var e = this.e;
			var a = this.a;
			if(e.length != a.length) {
				return this.fail("Expected bytes of length " + e.length + " but got " + a.length);
			}
			var _g = 0;
			var _g1 = e.length;
			while(_g < _g1) {
				var i = _g++;
				if(e.b[i] != a.b[i]) {
					return this.mismatch(e,a);
				}
			}
			return this.success();
		} else if(js_Boot.__implements(this.e,haxe_IMap)) {
			if(!js_Boot.__implements(this.a,haxe_IMap)) {
				return this.fail("Expected map but got " + Std.string(this.a));
			}
			var emap = this.e;
			var amap = this.a;
			var _g = [];
			var k = emap.keys();
			while(k.hasNext()) {
				var k1 = k.next();
				_g.push(k1);
			}
			var ekeys = _g;
			var _g = [];
			var k = amap.keys();
			while(k.hasNext()) {
				var k1 = k.next();
				_g.push(k1);
			}
			var akeys = _g;
			var len = akeys.length;
			if(len != ekeys.length) {
				return this.fail("Expected " + ekeys.length + " field(s) but got " + len);
			} else {
				ekeys.sort(Reflect.compare);
				akeys.sort(Reflect.compare);
				var _g = deepequal__$DeepEqual_Compare.comparer(ekeys,akeys);
				switch(_g._hx_index) {
				case 0:
					var _g1 = _g.s;
					break;
				case 1:
					var _g1 = _g.f;
					var m = _g1.message;
					var p = _g1.path;
					this.path = this.path.concat(p);
					return this.fail("Map keys mismatch: " + m);
				}
			}
			var _g = 0;
			while(_g < ekeys.length) {
				var key = ekeys[_g];
				++_g;
				this.path.push(deepequal_Path.Key(key));
				var _g1 = deepequal__$DeepEqual_Compare.comparer(emap.get(key),amap.get(key));
				switch(_g1._hx_index) {
				case 0:
					var _g2 = _g1.s;
					this.path.pop();
					break;
				case 1:
					var _g3 = _g1.f;
					var m = _g3.message;
					var p = _g3.path;
					this.path = this.path.concat(p);
					return this.fail(m);
				}
			}
			return this.success();
		} else if(Reflect.isFunction(this.e)) {
			if(!Reflect.isFunction(this.a)) {
				return this.fail("Expected function but got " + Std.string(this.a));
			}
			if(!Reflect.compareMethods(this.e,this.a)) {
				return this.fail("The two functions are not equal");
			}
			return this.success();
		} else if(js_Boot.getClass(this.e) != null) {
			var ecls = js_Boot.getClass(this.e);
			var acls = js_Boot.getClass(this.a);
			if(ecls != acls) {
				return this.fail("Expected class instance of " + ecls.__name__ + " but got " + acls.__name__);
			}
			var _g = 0;
			var _g1 = Type.getInstanceFields(ecls);
			while(_g < _g1.length) {
				var key = _g1[_g];
				++_g;
				if(Reflect.isFunction(Reflect.field(this.e,key))) {
					continue;
				}
				this.path.push(deepequal_Path.Field(key));
				var _g2 = deepequal__$DeepEqual_Compare.comparer(Reflect.getProperty(this.e,key),Reflect.getProperty(this.a,key));
				switch(_g2._hx_index) {
				case 0:
					var _g3 = _g2.s;
					this.path.pop();
					break;
				case 1:
					var f = _g2.f;
					this.path = this.path.concat(f.path);
					return this.fail(f.message);
				}
			}
			return this.success();
		} else if(js_Boot.__instanceof(this.e,Class)) {
			if(!js_Boot.__instanceof(this.a,Class)) {
				return this.mismatch(this.e,this.a);
			}
			return this.simple(this.e,this.a);
		} else if(js_Boot.__instanceof(this.e,Enum)) {
			if(!js_Boot.__instanceof(this.a,Enum)) {
				return this.mismatch(this.e,this.a);
			}
			return this.simple(this.e,this.a);
		} else if(Reflect.isObject(this.e)) {
			if(!Reflect.isObject(this.a)) {
				return this.fail("Expected object but got " + Std.string(this.a));
			}
			var keys = Reflect.fields(this.e);
			var len = Reflect.fields(this.a).length;
			if(len != keys.length) {
				return this.fail("Expected " + keys.length + " field(s) but got " + len);
			}
			var _g = 0;
			while(_g < keys.length) {
				var key = keys[_g];
				++_g;
				this.path.push(deepequal_Path.Field(key));
				var _g1 = deepequal__$DeepEqual_Compare.comparer(Reflect.field(this.e,key),Reflect.field(this.a,key));
				switch(_g1._hx_index) {
				case 0:
					var _g2 = _g1.s;
					this.path.pop();
					break;
				case 1:
					var _g3 = _g1.f;
					var m = _g3.message;
					var p = _g3.path;
					this.path = this.path.concat(p);
					return this.fail(m);
				}
			}
			return this.success();
		} else {
			throw haxe_Exception.thrown("Unhandled type: " + Std.string(Type.typeof(this.e)) + " (" + Std.string(this.e) + ")");
		}
	}
	,success: function() {
		return deepequal_Outcome.Success(deepequal_Noise.Noise);
	}
	,fail: function(msg) {
		return deepequal_Outcome.Failure({ message : msg, path : this.path});
	}
	,mismatch: function(e,a) {
		return this.fail("Expected " + deepequal_Stringifier.stringify(e) + " but got " + (a == null ? null : deepequal_Stringifier.stringify(a)));
	}
	,bool: function(b) {
		if(b) {
			return this.success();
		} else {
			return this.fail("Expected true but got false");
		}
	}
	,simple: function(e,a) {
		if(e == a) {
			return this.success();
		} else {
			return this.mismatch(e,a);
		}
	}
	,date: function(e,a) {
		var _g = this.simple(e.getTime(),a.getTime());
		switch(_g._hx_index) {
		case 0:
			var _g1 = _g.s;
			return deepequal_Outcome.Success(deepequal_Noise.Noise);
		case 1:
			var _g1 = _g.f;
			return this.mismatch(e,a);
		}
	}
	,__class__: deepequal__$DeepEqual_Compare
};
var deepequal_Error = function(message,pos) {
	this.message = message;
	this.pos = pos;
};
deepequal_Error.__name__ = "deepequal.Error";
deepequal_Error.withData = function(message,data,pos) {
	var e = new deepequal_Error(message,pos);
	e.data = data;
	return e;
};
deepequal_Error.prototype = {
	message: null
	,data: null
	,pos: null
	,__class__: deepequal_Error
};
var deepequal_Noise = $hxEnums["deepequal.Noise"] = { __ename__:"deepequal.Noise",__constructs__:null
	,Noise: {_hx_name:"Noise",_hx_index:0,__enum__:"deepequal.Noise",toString:$estr}
};
deepequal_Noise.__constructs__ = [deepequal_Noise.Noise];
var deepequal_Outcome = $hxEnums["deepequal.Outcome"] = { __ename__:"deepequal.Outcome",__constructs__:null
	,Success: ($_=function(s) { return {_hx_index:0,s:s,__enum__:"deepequal.Outcome",toString:$estr}; },$_._hx_name="Success",$_.__params__ = ["s"],$_)
	,Failure: ($_=function(f) { return {_hx_index:1,f:f,__enum__:"deepequal.Outcome",toString:$estr}; },$_._hx_name="Failure",$_.__params__ = ["f"],$_)
};
deepequal_Outcome.__constructs__ = [deepequal_Outcome.Success,deepequal_Outcome.Failure];
var deepequal_Path = $hxEnums["deepequal.Path"] = { __ename__:"deepequal.Path",__constructs__:null
	,EnumParam: ($_=function(i) { return {_hx_index:0,i:i,__enum__:"deepequal.Path",toString:$estr}; },$_._hx_name="EnumParam",$_.__params__ = ["i"],$_)
	,Index: ($_=function(i) { return {_hx_index:1,i:i,__enum__:"deepequal.Path",toString:$estr}; },$_._hx_name="Index",$_.__params__ = ["i"],$_)
	,Field: ($_=function(n) { return {_hx_index:2,n:n,__enum__:"deepequal.Path",toString:$estr}; },$_._hx_name="Field",$_.__params__ = ["n"],$_)
	,Key: ($_=function(n) { return {_hx_index:3,n:n,__enum__:"deepequal.Path",toString:$estr}; },$_._hx_name="Key",$_.__params__ = ["n"],$_)
};
deepequal_Path.__constructs__ = [deepequal_Path.EnumParam,deepequal_Path.Index,deepequal_Path.Field,deepequal_Path.Key];
var deepequal_Stringifier = function() { };
deepequal_Stringifier.__name__ = "deepequal.Stringifier";
deepequal_Stringifier.stringify = function(v) {
	if(((v) instanceof haxe__$Int64__$_$_$Int64)) {
		return haxe_Int64.toString(v);
	} else if(typeof(v) == "string" || typeof(v) == "number" || typeof(v) == "boolean") {
		return JSON.stringify(v);
	} else if(((v) instanceof Date)) {
		return DateTools.format(v,"%F %T");
	} else if(((v) instanceof haxe_io_Bytes)) {
		return "bytes(hex):" + v.toHex();
	} else {
		return Std.string(v);
	}
};
var haxe_IMap = function() { };
haxe_IMap.__name__ = "haxe.IMap";
haxe_IMap.__isInterface__ = true;
haxe_IMap.prototype = {
	get: null
	,keys: null
	,__class__: haxe_IMap
};
var haxe_Exception = function(message,previous,native) {
	Error.call(this,message);
	this.message = message;
	this.__previousException = previous;
	this.__nativeException = native != null ? native : this;
};
haxe_Exception.__name__ = "haxe.Exception";
haxe_Exception.caught = function(value) {
	if(((value) instanceof haxe_Exception)) {
		return value;
	} else if(((value) instanceof Error)) {
		return new haxe_Exception(value.message,null,value);
	} else {
		return new haxe_ValueException(value,null,value);
	}
};
haxe_Exception.thrown = function(value) {
	if(((value) instanceof haxe_Exception)) {
		return value.get_native();
	} else if(((value) instanceof Error)) {
		return value;
	} else {
		var e = new haxe_ValueException(value);
		return e;
	}
};
haxe_Exception.__super__ = Error;
haxe_Exception.prototype = $extend(Error.prototype,{
	__skipStack: null
	,__nativeException: null
	,__previousException: null
	,toString: function() {
		return this.get_message();
	}
	,get_message: function() {
		return this.message;
	}
	,get_native: function() {
		return this.__nativeException;
	}
	,__class__: haxe_Exception
	,__properties__: {get_native:"get_native",get_message:"get_message"}
});
var haxe_Int32 = {};
haxe_Int32.ucompare = function(a,b) {
	if(a < 0) {
		if(b < 0) {
			return ~b - ~a | 0;
		} else {
			return 1;
		}
	}
	if(b < 0) {
		return -1;
	} else {
		return a - b | 0;
	}
};
var haxe_Int64 = {};
haxe_Int64.toString = function(this1) {
	var i = this1;
	var b_high = 0;
	var b_low = 0;
	if(i.high == b_high && i.low == b_low) {
		return "0";
	}
	var str = "";
	var neg = false;
	if(i.high < 0) {
		neg = true;
	}
	var this1 = new haxe__$Int64__$_$_$Int64(0,10);
	var ten = this1;
	while(true) {
		var b_high = 0;
		var b_low = 0;
		if(!(i.high != b_high || i.low != b_low)) {
			break;
		}
		var r = haxe_Int64.divMod(i,ten);
		if(r.modulus.high < 0) {
			var x = r.modulus;
			var high = ~x.high;
			var low = ~x.low + 1 | 0;
			if(low == 0) {
				var ret = high++;
				high = high | 0;
			}
			var this_high = high;
			var this_low = low;
			str = this_low + str;
			var x1 = r.quotient;
			var high1 = ~x1.high;
			var low1 = ~x1.low + 1 | 0;
			if(low1 == 0) {
				var ret1 = high1++;
				high1 = high1 | 0;
			}
			var this1 = new haxe__$Int64__$_$_$Int64(high1,low1);
			i = this1;
		} else {
			str = r.modulus.low + str;
			i = r.quotient;
		}
	}
	if(neg) {
		str = "-" + str;
	}
	return str;
};
haxe_Int64.divMod = function(dividend,divisor) {
	if(divisor.high == 0) {
		switch(divisor.low) {
		case 0:
			throw haxe_Exception.thrown("divide by zero");
		case 1:
			var this1 = new haxe__$Int64__$_$_$Int64(dividend.high,dividend.low);
			var this2 = new haxe__$Int64__$_$_$Int64(0,0);
			return { quotient : this1, modulus : this2};
		}
	}
	var divSign = dividend.high < 0 != divisor.high < 0;
	var modulus;
	if(dividend.high < 0) {
		var high = ~dividend.high;
		var low = ~dividend.low + 1 | 0;
		if(low == 0) {
			var ret = high++;
			high = high | 0;
		}
		var this1 = new haxe__$Int64__$_$_$Int64(high,low);
		modulus = this1;
	} else {
		var this1 = new haxe__$Int64__$_$_$Int64(dividend.high,dividend.low);
		modulus = this1;
	}
	if(divisor.high < 0) {
		var high = ~divisor.high;
		var low = ~divisor.low + 1 | 0;
		if(low == 0) {
			var ret = high++;
			high = high | 0;
		}
		var this1 = new haxe__$Int64__$_$_$Int64(high,low);
		divisor = this1;
	}
	var this1 = new haxe__$Int64__$_$_$Int64(0,0);
	var quotient = this1;
	var this1 = new haxe__$Int64__$_$_$Int64(0,1);
	var mask = this1;
	while(!(divisor.high < 0)) {
		var v = haxe_Int32.ucompare(divisor.high,modulus.high);
		var cmp = v != 0 ? v : haxe_Int32.ucompare(divisor.low,modulus.low);
		var b = 1;
		b &= 63;
		if(b == 0) {
			var this1 = new haxe__$Int64__$_$_$Int64(divisor.high,divisor.low);
			divisor = this1;
		} else if(b < 32) {
			var this2 = new haxe__$Int64__$_$_$Int64(divisor.high << b | divisor.low >>> 32 - b,divisor.low << b);
			divisor = this2;
		} else {
			var this3 = new haxe__$Int64__$_$_$Int64(divisor.low << b - 32,0);
			divisor = this3;
		}
		var b1 = 1;
		b1 &= 63;
		if(b1 == 0) {
			var this4 = new haxe__$Int64__$_$_$Int64(mask.high,mask.low);
			mask = this4;
		} else if(b1 < 32) {
			var this5 = new haxe__$Int64__$_$_$Int64(mask.high << b1 | mask.low >>> 32 - b1,mask.low << b1);
			mask = this5;
		} else {
			var this6 = new haxe__$Int64__$_$_$Int64(mask.low << b1 - 32,0);
			mask = this6;
		}
		if(cmp >= 0) {
			break;
		}
	}
	while(true) {
		var b_high = 0;
		var b_low = 0;
		if(!(mask.high != b_high || mask.low != b_low)) {
			break;
		}
		var v = haxe_Int32.ucompare(modulus.high,divisor.high);
		if((v != 0 ? v : haxe_Int32.ucompare(modulus.low,divisor.low)) >= 0) {
			var this1 = new haxe__$Int64__$_$_$Int64(quotient.high | mask.high,quotient.low | mask.low);
			quotient = this1;
			var high = modulus.high - divisor.high | 0;
			var low = modulus.low - divisor.low | 0;
			if(haxe_Int32.ucompare(modulus.low,divisor.low) < 0) {
				var ret = high--;
				high = high | 0;
			}
			var this2 = new haxe__$Int64__$_$_$Int64(high,low);
			modulus = this2;
		}
		var b = 1;
		b &= 63;
		if(b == 0) {
			var this3 = new haxe__$Int64__$_$_$Int64(mask.high,mask.low);
			mask = this3;
		} else if(b < 32) {
			var this4 = new haxe__$Int64__$_$_$Int64(mask.high >>> b,mask.high << 32 - b | mask.low >>> b);
			mask = this4;
		} else {
			var this5 = new haxe__$Int64__$_$_$Int64(0,mask.high >>> b - 32);
			mask = this5;
		}
		var b1 = 1;
		b1 &= 63;
		if(b1 == 0) {
			var this6 = new haxe__$Int64__$_$_$Int64(divisor.high,divisor.low);
			divisor = this6;
		} else if(b1 < 32) {
			var this7 = new haxe__$Int64__$_$_$Int64(divisor.high >>> b1,divisor.high << 32 - b1 | divisor.low >>> b1);
			divisor = this7;
		} else {
			var this8 = new haxe__$Int64__$_$_$Int64(0,divisor.high >>> b1 - 32);
			divisor = this8;
		}
	}
	if(divSign) {
		var high = ~quotient.high;
		var low = ~quotient.low + 1 | 0;
		if(low == 0) {
			var ret = high++;
			high = high | 0;
		}
		var this1 = new haxe__$Int64__$_$_$Int64(high,low);
		quotient = this1;
	}
	if(dividend.high < 0) {
		var high = ~modulus.high;
		var low = ~modulus.low + 1 | 0;
		if(low == 0) {
			var ret = high++;
			high = high | 0;
		}
		var this1 = new haxe__$Int64__$_$_$Int64(high,low);
		modulus = this1;
	}
	return { quotient : quotient, modulus : modulus};
};
var haxe__$Int64__$_$_$Int64 = function(high,low) {
	this.high = high;
	this.low = low;
};
haxe__$Int64__$_$_$Int64.__name__ = "haxe._Int64.___Int64";
haxe__$Int64__$_$_$Int64.prototype = {
	high: null
	,low: null
	,__class__: haxe__$Int64__$_$_$Int64
};
var haxe_Log = function() { };
haxe_Log.__name__ = "haxe.Log";
haxe_Log.formatOutput = function(v,infos) {
	var str = Std.string(v);
	if(infos == null) {
		return str;
	}
	var pstr = infos.fileName + ":" + infos.lineNumber;
	if(infos.customParams != null) {
		var _g = 0;
		var _g1 = infos.customParams;
		while(_g < _g1.length) {
			var v = _g1[_g];
			++_g;
			str += ", " + Std.string(v);
		}
	}
	return pstr + ": " + str;
};
haxe_Log.trace = function(v,infos) {
	var str = haxe_Log.formatOutput(v,infos);
	if(typeof(console) != "undefined" && console.log != null) {
		console.log(str);
	}
};
var haxe_ValueException = function(value,previous,native) {
	haxe_Exception.call(this,String(value),previous,native);
	this.value = value;
};
haxe_ValueException.__name__ = "haxe.ValueException";
haxe_ValueException.__super__ = haxe_Exception;
haxe_ValueException.prototype = $extend(haxe_Exception.prototype,{
	value: null
	,__class__: haxe_ValueException
});
var haxe_exceptions_PosException = function(message,previous,pos) {
	haxe_Exception.call(this,message,previous);
	if(pos == null) {
		this.posInfos = { fileName : "(unknown)", lineNumber : 0, className : "(unknown)", methodName : "(unknown)"};
	} else {
		this.posInfos = pos;
	}
};
haxe_exceptions_PosException.__name__ = "haxe.exceptions.PosException";
haxe_exceptions_PosException.__super__ = haxe_Exception;
haxe_exceptions_PosException.prototype = $extend(haxe_Exception.prototype,{
	posInfos: null
	,toString: function() {
		return "" + haxe_Exception.prototype.toString.call(this) + " in " + this.posInfos.className + "." + this.posInfos.methodName + " at " + this.posInfos.fileName + ":" + this.posInfos.lineNumber;
	}
	,__class__: haxe_exceptions_PosException
});
var haxe_exceptions_NotImplementedException = function(message,previous,pos) {
	if(message == null) {
		message = "Not implemented";
	}
	haxe_exceptions_PosException.call(this,message,previous,pos);
};
haxe_exceptions_NotImplementedException.__name__ = "haxe.exceptions.NotImplementedException";
haxe_exceptions_NotImplementedException.__super__ = haxe_exceptions_PosException;
haxe_exceptions_NotImplementedException.prototype = $extend(haxe_exceptions_PosException.prototype,{
	__class__: haxe_exceptions_NotImplementedException
});
var haxe_io_Bytes = function(data) {
	this.length = data.byteLength;
	this.b = new Uint8Array(data);
	this.b.bufferValue = data;
	data.hxBytes = this;
	data.bytes = this.b;
};
haxe_io_Bytes.__name__ = "haxe.io.Bytes";
haxe_io_Bytes.prototype = {
	length: null
	,b: null
	,toHex: function() {
		var s_b = "";
		var chars = [];
		var str = "0123456789abcdef";
		var _g = 0;
		var _g1 = str.length;
		while(_g < _g1) {
			var i = _g++;
			chars.push(HxOverrides.cca(str,i));
		}
		var _g = 0;
		var _g1 = this.length;
		while(_g < _g1) {
			var i = _g++;
			var c = this.b[i];
			s_b += String.fromCodePoint(chars[c >> 4]);
			s_b += String.fromCodePoint(chars[c & 15]);
		}
		return s_b;
	}
	,__class__: haxe_io_Bytes
};
var haxe_iterators_ArrayIterator = function(array) {
	this.current = 0;
	this.array = array;
};
haxe_iterators_ArrayIterator.__name__ = "haxe.iterators.ArrayIterator";
haxe_iterators_ArrayIterator.prototype = {
	array: null
	,current: null
	,hasNext: function() {
		return this.current < this.array.length;
	}
	,next: function() {
		return this.array[this.current++];
	}
	,__class__: haxe_iterators_ArrayIterator
};
var js_Boot = function() { };
js_Boot.__name__ = "js.Boot";
js_Boot.getClass = function(o) {
	if(o == null) {
		return null;
	} else if(((o) instanceof Array)) {
		return Array;
	} else {
		var cl = o.__class__;
		if(cl != null) {
			return cl;
		}
		var name = js_Boot.__nativeClassName(o);
		if(name != null) {
			return js_Boot.__resolveNativeClass(name);
		}
		return null;
	}
};
js_Boot.__string_rec = function(o,s) {
	if(o == null) {
		return "null";
	}
	if(s.length >= 5) {
		return "<...>";
	}
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) {
		t = "object";
	}
	switch(t) {
	case "function":
		return "<function>";
	case "object":
		if(o.__enum__) {
			var e = $hxEnums[o.__enum__];
			var con = e.__constructs__[o._hx_index];
			var n = con._hx_name;
			if(con.__params__) {
				s = s + "\t";
				return n + "(" + ((function($this) {
					var $r;
					var _g = [];
					{
						var _g1 = 0;
						var _g2 = con.__params__;
						while(true) {
							if(!(_g1 < _g2.length)) {
								break;
							}
							var p = _g2[_g1];
							_g1 = _g1 + 1;
							_g.push(js_Boot.__string_rec(o[p],s));
						}
					}
					$r = _g;
					return $r;
				}(this))).join(",") + ")";
			} else {
				return n;
			}
		}
		if(((o) instanceof Array)) {
			var str = "[";
			s += "\t";
			var _g = 0;
			var _g1 = o.length;
			while(_g < _g1) {
				var i = _g++;
				str += (i > 0 ? "," : "") + js_Boot.__string_rec(o[i],s);
			}
			str += "]";
			return str;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( _g ) {
			return "???";
		}
		if(tostr != null && tostr != Object.toString && typeof(tostr) == "function") {
			var s2 = o.toString();
			if(s2 != "[object Object]") {
				return s2;
			}
		}
		var str = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		var k = null;
		for( k in o ) {
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str.length != 2) {
			str += ", \n";
		}
		str += s + k + " : " + js_Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str += "\n" + s + "}";
		return str;
	case "string":
		return o;
	default:
		return String(o);
	}
};
js_Boot.__interfLoop = function(cc,cl) {
	if(cc == null) {
		return false;
	}
	if(cc == cl) {
		return true;
	}
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g = 0;
		var _g1 = intf.length;
		while(_g < _g1) {
			var i = _g++;
			var i1 = intf[i];
			if(i1 == cl || js_Boot.__interfLoop(i1,cl)) {
				return true;
			}
		}
	}
	return js_Boot.__interfLoop(cc.__super__,cl);
};
js_Boot.__instanceof = function(o,cl) {
	if(cl == null) {
		return false;
	}
	switch(cl) {
	case Array:
		return ((o) instanceof Array);
	case Bool:
		return typeof(o) == "boolean";
	case Dynamic:
		return o != null;
	case Float:
		return typeof(o) == "number";
	case Int:
		if(typeof(o) == "number") {
			return ((o | 0) === o);
		} else {
			return false;
		}
		break;
	case String:
		return typeof(o) == "string";
	default:
		if(o != null) {
			if(typeof(cl) == "function") {
				if(js_Boot.__downcastCheck(o,cl)) {
					return true;
				}
			} else if(typeof(cl) == "object" && js_Boot.__isNativeObj(cl)) {
				if(((o) instanceof cl)) {
					return true;
				}
			}
		} else {
			return false;
		}
		if(cl == Class ? o.__name__ != null : false) {
			return true;
		}
		if(cl == Enum ? o.__ename__ != null : false) {
			return true;
		}
		return o.__enum__ != null ? $hxEnums[o.__enum__] == cl : false;
	}
};
js_Boot.__downcastCheck = function(o,cl) {
	if(!((o) instanceof cl)) {
		if(cl.__isInterface__) {
			return js_Boot.__interfLoop(js_Boot.getClass(o),cl);
		} else {
			return false;
		}
	} else {
		return true;
	}
};
js_Boot.__implements = function(o,iface) {
	return js_Boot.__interfLoop(js_Boot.getClass(o),iface);
};
js_Boot.__cast = function(o,t) {
	if(o == null || js_Boot.__instanceof(o,t)) {
		return o;
	} else {
		throw haxe_Exception.thrown("Cannot cast " + Std.string(o) + " to " + Std.string(t));
	}
};
js_Boot.__nativeClassName = function(o) {
	var name = js_Boot.__toStr.call(o).slice(8,-1);
	if(name == "Object" || name == "Function" || name == "Math" || name == "JSON") {
		return null;
	}
	return name;
};
js_Boot.__isNativeObj = function(o) {
	return js_Boot.__nativeClassName(o) != null;
};
js_Boot.__resolveNativeClass = function(name) {
	return $global[name];
};
var polyboolhx_IBuildLog = function() { };
polyboolhx_IBuildLog.__name__ = "polyboolhx.IBuildLog";
polyboolhx_IBuildLog.__isInterface__ = true;
polyboolhx_IBuildLog.prototype = {
	list: null
	,nextSegmentId: null
	,push: null
	,info: null
	,segmentId: null
	,checkIntersection: null
	,segmentDivide: null
	,segmentChop: null
	,statusRemove: null
	,segmentUpdate: null
	,segmentNew: null
	,tempStatus: null
	,rewind: null
	,status: null
	,vert: null
	,selected: null
	,chainStart: null
	,chainNew: null
	,chainMatch: null
	,chainClose: null
	,chainAddHead: null
	,chainAddTail: null
	,chainSimplifyHead: null
	,chainSimplifyTail: null
	,chainSimplifyClose: null
	,chainSimplifyJoin: null
	,chainReverse: null
	,chainJoin: null
	,chainConnect: null
	,done: null
	,__class__: polyboolhx_IBuildLog
};
var polyboolhx_NullBuildLog = function() {
	this.nextSegmentId = 0;
	this.list = [];
};
polyboolhx_NullBuildLog.__name__ = "polyboolhx.NullBuildLog";
polyboolhx_NullBuildLog.__interfaces__ = [polyboolhx_IBuildLog];
polyboolhx_NullBuildLog.prototype = {
	list: null
	,nextSegmentId: null
	,push: function(type,data) {
	}
	,info: function(msg,data) {
	}
	,segmentId: function() {
		return 0;
	}
	,checkIntersection: function(seg1,seg2) {
	}
	,segmentDivide: function(seg,p) {
	}
	,segmentChop: function(seg) {
	}
	,statusRemove: function(seg) {
	}
	,segmentUpdate: function(seg) {
	}
	,segmentNew: function(seg,primary) {
	}
	,tempStatus: function(seg,above,below) {
	}
	,rewind: function(seg) {
	}
	,status: function(seg,above,below) {
	}
	,vert: function(x) {
	}
	,selected: function(segs) {
	}
	,chainStart: function(sf,closed) {
	}
	,chainNew: function(sf,closed) {
	}
	,chainMatch: function(index,closed) {
	}
	,chainClose: function(index,closed) {
	}
	,chainAddHead: function(index,sf,closed) {
	}
	,chainAddTail: function(index,sf,closed) {
	}
	,chainSimplifyHead: function(index,sf,closed) {
	}
	,chainSimplifyTail: function(index,sf,closed) {
	}
	,chainSimplifyClose: function(index,sf,closed) {
	}
	,chainSimplifyJoin: function(index1,index2,sf,closed) {
	}
	,chainReverse: function(index,closed) {
	}
	,chainJoin: function(index1,index2,closed) {
	}
	,chainConnect: function(index1,index2,closed) {
	}
	,done: function() {
	}
	,__class__: polyboolhx_NullBuildLog
};
var polyboolhx_BuildLog = function() { };
polyboolhx_BuildLog.__name__ = "polyboolhx.BuildLog";
var polyboolhx_ArrayBuildLog = function() {
	this.list = [];
	this.nextSegmentId = 0;
	this.curVert = NaN;
};
polyboolhx_ArrayBuildLog.__name__ = "polyboolhx.ArrayBuildLog";
polyboolhx_ArrayBuildLog.__interfaces__ = [polyboolhx_IBuildLog];
polyboolhx_ArrayBuildLog.prototype = {
	list: null
	,nextSegmentId: null
	,curVert: null
	,push: function(type,data) {
		this.list.push({ type : type, data : JSON.parse(JSON.stringify(data))});
	}
	,info: function(msg,data) {
		this.push("info",{ msg : msg, data : data});
	}
	,segmentId: function() {
		return this.nextSegmentId++;
	}
	,checkIntersection: function(seg1,seg2) {
		this.push("check",{ seg1 : seg1, seg2 : seg2});
	}
	,segmentDivide: function(seg,p) {
		this.push("div_seg",{ seg : seg, p : p});
	}
	,segmentChop: function(seg) {
		this.push("chop",{ seg : seg});
	}
	,statusRemove: function(seg) {
		this.push("pop_seg",{ seg : seg});
	}
	,segmentUpdate: function(seg) {
		this.push("seg_update",{ seg : seg});
	}
	,segmentNew: function(seg,primary) {
		this.push("new_seg",{ seg : seg, primary : primary});
	}
	,tempStatus: function(seg,above,below) {
		this.push("temp_status",{ seg : seg, above : above, below : below});
	}
	,rewind: function(seg) {
		this.push("rewind",{ seg : seg});
	}
	,status: function(seg,above,below) {
		this.push("status",{ seg : seg, above : above, below : below});
	}
	,vert: function(x) {
		if(x != this.curVert) {
			this.push("vert",{ x : x});
			this.curVert = x;
		}
	}
	,selected: function(segs) {
		this.push("selected",{ segs : segs});
	}
	,chainStart: function(sf,closed) {
		this.push("chain_start",{ sf : sf, closed : closed});
	}
	,chainNew: function(sf,closed) {
		this.push("chain_new",{ sf : sf, closed : closed});
	}
	,chainMatch: function(index,closed) {
		this.push("chain_match",{ index : index, closed : closed});
	}
	,chainClose: function(index,closed) {
		this.push("chain_close",{ index : index, closed : closed});
	}
	,chainAddHead: function(index,sf,closed) {
		this.push("chain_add_head",{ index : index, sf : sf, closed : closed});
	}
	,chainAddTail: function(index,sf,closed) {
		this.push("chain_add_tail",{ index : index, sf : sf, closed : closed});
	}
	,chainSimplifyHead: function(index,sf,closed) {
		this.push("chain_simp_head",{ index : index, sf : sf, closed : closed});
	}
	,chainSimplifyTail: function(index,sf,closed) {
		this.push("chain_simp_tail",{ index : index, sf : sf, closed : closed});
	}
	,chainSimplifyClose: function(index,sf,closed) {
		this.push("chain_simp_close",{ index : index, sf : sf, closed : closed});
	}
	,chainSimplifyJoin: function(index1,index2,sf,closed) {
		this.push("chain_simp_join",{ index1 : index1, index2 : index2, sf : sf, closed : closed});
	}
	,chainConnect: function(index1,index2,closed) {
		this.push("chain_con",{ index1 : index1, index2 : index2, closed : closed});
	}
	,chainReverse: function(index,closed) {
		this.push("chain_rev",{ index : index, closed : closed});
	}
	,chainJoin: function(index1,index2,closed) {
		this.push("chain_join",{ index1 : index1, index2 : index2, closed : closed});
	}
	,done: function() {
		this.push("done",null);
	}
	,__class__: polyboolhx_ArrayBuildLog
};
var polyboolhx_GeometryUtils = function() { };
polyboolhx_GeometryUtils.__name__ = "polyboolhx.GeometryUtils";
polyboolhx_GeometryUtils.lerp = function(a,b,t) {
	return a + (b - a) * t;
};
polyboolhx_GeometryUtils.lerpVec2 = function(a,b,t) {
	return [polyboolhx_GeometryUtils.lerp(a[0],b[0],t),polyboolhx_GeometryUtils.lerp(a[1],b[1],t)];
};
polyboolhx_GeometryUtils.boundingBoxesIntersect = function(bbox1,bbox2) {
	var b1min = bbox1[0];
	var b1max = bbox1[1];
	var b2min = bbox2[0];
	var b2max = bbox2[1];
	return !(b1min[0] > b2max[0] || b1max[0] < b2min[0] || b1min[1] > b2max[1] || b1max[1] < b2min[1]);
};
var polyboolhx_Geometry = function() {
};
polyboolhx_Geometry.__name__ = "polyboolhx.Geometry";
polyboolhx_Geometry.prototype = {
	snap0: function(v) {
		throw haxe_Exception.thrown("Abstract method must be overridden");
	}
	,snap01: function(v) {
		throw haxe_Exception.thrown("Abstract method must be overridden");
	}
	,isCollinear: function(p1,p2,p3) {
		throw haxe_Exception.thrown("Abstract method must be overridden");
	}
	,solveCubic: function(a,b,c,d) {
		throw haxe_Exception.thrown("Abstract method must be overridden");
	}
	,isEqualVec2: function(a,b) {
		throw haxe_Exception.thrown("Abstract method must be overridden");
	}
	,compareVec2: function(a,b) {
		throw haxe_Exception.thrown("Abstract method must be overridden");
	}
	,__class__: polyboolhx_Geometry
};
var polyboolhx_GeometryEpsilon = function(epsilon) {
	if(epsilon == null) {
		epsilon = 0.0000000001;
	}
	polyboolhx_Geometry.call(this);
	this.epsilon = epsilon;
};
polyboolhx_GeometryEpsilon.__name__ = "polyboolhx.GeometryEpsilon";
polyboolhx_GeometryEpsilon.__super__ = polyboolhx_Geometry;
polyboolhx_GeometryEpsilon.prototype = $extend(polyboolhx_Geometry.prototype,{
	epsilon: null
	,snap0: function(v) {
		if(Math.abs(v) < this.epsilon) {
			return 0;
		}
		return v;
	}
	,snap01: function(v) {
		if(Math.abs(v) < this.epsilon) {
			return 0;
		}
		if(Math.abs(1 - v) < this.epsilon) {
			return 1;
		}
		return v;
	}
	,isCollinear: function(p1,p2,p3) {
		var dx1 = p1[0] - p2[0];
		var dy1 = p1[1] - p2[1];
		var dx2 = p2[0] - p3[0];
		var dy2 = p2[1] - p3[1];
		return Math.abs(dx1 * dy2 - dx2 * dy1) < this.epsilon;
	}
	,solveCubicNormalized: function(a,b,c) {
		var a3 = a / 3;
		var b3 = b / 3;
		var Q = a3 * a3 - b3;
		var R = a3 * (a3 * a3 - b / 2) + c / 2;
		if(Math.abs(R) < this.epsilon && Math.abs(Q) < this.epsilon) {
			return [-a3];
		}
		var F = a3 * (a3 * (4 * a3 * c - b3 * b) - 2 * b * c) + 4 * b3 * b3 * b3 + c * c;
		if(Math.abs(F) < this.epsilon) {
			var sqrtQ = Math.sqrt(Q);
			if(R > 0) {
				return [-2 * sqrtQ - a / 3,sqrtQ - a / 3];
			} else {
				return [-sqrtQ - a / 3,2 * sqrtQ - a / 3];
			}
		}
		var Q3 = Q * Q * Q;
		var R2 = R * R;
		if(R2 < Q3) {
			var ratio = (R < 0 ? -1 : 1) * Math.sqrt(R2 / Q3);
			var theta = Math.acos(ratio);
			var norm = -2 * Math.sqrt(Q);
			var x0 = norm * Math.cos(theta / 3) - a3;
			var x1 = norm * Math.cos((theta + 2 * Math.PI) / 3) - a3;
			var x2 = norm * Math.cos((theta - 2 * Math.PI) / 3) - a3;
			var res = [x0,x1,x2];
			res.sort(function(x,y) {
				return x - y | 0;
			});
			return res;
		} else {
			var A = (R < 0 ? 1 : -1) * Math.pow(Math.abs(R) + Math.sqrt(R2 - Q3),0.333333333333333315);
			var B = Math.abs(A) >= this.epsilon ? Q / A : 0;
			return [A + B - a3];
		}
	}
	,solveCubic: function(a,b,c,d) {
		if(Math.abs(a) < this.epsilon) {
			if(Math.abs(b) < this.epsilon) {
				if(Math.abs(c) < this.epsilon) {
					if(Math.abs(d) < this.epsilon) {
						return [0];
					} else {
						return [];
					}
				}
				return [-d / c];
			}
			var b2 = 2 * b;
			var D = c * c - 4 * b * d;
			if(Math.abs(D) < this.epsilon) {
				return [-c / b2];
			} else if(D > 0) {
				D = Math.sqrt(D);
				var res = [(-c + D) / b2,(-c - D) / b2];
				res.sort(function(x,y) {
					return x - y | 0;
				});
				return res;
			}
			return [];
		}
		return this.solveCubicNormalized(b / a,c / a,d / a);
	}
	,isEqualVec2: function(a,b) {
		if(Math.abs(a[0] - b[0]) < this.epsilon) {
			return Math.abs(a[1] - b[1]) < this.epsilon;
		} else {
			return false;
		}
	}
	,compareVec2: function(a,b) {
		if(Math.abs(b[0] - a[0]) < this.epsilon) {
			if(Math.abs(b[1] - a[1]) < this.epsilon) {
				return 0;
			} else if(a[1] < b[1]) {
				return -1;
			} else {
				return 1;
			}
		}
		if(a[0] < b[0]) {
			return -1;
		} else {
			return 1;
		}
	}
	,__class__: polyboolhx_GeometryEpsilon
});
var polyboolhx_SegmentBool = function(data,fill,closed) {
	if(closed == null) {
		closed = false;
	}
	this.otherFill = null;
	this.id = -1;
	this.id = polyboolhx_BuildLog.log.segmentId();
	this.data = data;
	this.myFill = { above : fill != null && fill.above != null ? fill.above : null, below : fill != null && fill.below != null ? fill.below : null};
	this.closed = closed;
};
polyboolhx_SegmentBool.__name__ = "polyboolhx.SegmentBool";
polyboolhx_SegmentBool.prototype = {
	id: null
	,data: null
	,myFill: null
	,otherFill: null
	,closed: null
	,get_data: function() {
		return this.data;
	}
	,__class__: polyboolhx_SegmentBool
};
var polyboolhx_IntersectorUtils = function() { };
polyboolhx_IntersectorUtils.__name__ = "polyboolhx.IntersectorUtils";
polyboolhx_IntersectorUtils.copySegmentBool = function(seg) {
	return new polyboolhx_SegmentBool(seg.data,seg.myFill,seg.closed);
};
polyboolhx_IntersectorUtils.sign = function(f) {
	if(f > 0) {
		return 1;
	} else if(f < 0) {
		return -1;
	} else {
		return 0;
	}
};
var polyboolhx_EventBool = function(isStart,p,seg,primary) {
	this.status = null;
	this.isStart = isStart;
	this.p = p;
	this.seg = seg;
	this.primary = primary;
};
polyboolhx_EventBool.__name__ = "polyboolhx.EventBool";
polyboolhx_EventBool.prototype = {
	isStart: null
	,p: null
	,seg: null
	,primary: null
	,other: null
	,status: null
	,__class__: polyboolhx_EventBool
};
var polyboolhx_ListBool = function() {
	this.nodes = [];
};
polyboolhx_ListBool.__name__ = "polyboolhx.ListBool";
polyboolhx_ListBool.prototype = {
	nodes: null
	,remove: function(node) {
		var i = this.nodes.indexOf(node);
		if(i >= 0) {
			this.nodes.splice(i,1);
		}
	}
	,getIndex: function(node) {
		return this.nodes.indexOf(node);
	}
	,isEmpty: function() {
		return this.nodes.length <= 0;
	}
	,getHead: function() {
		return this.nodes[0];
	}
	,removeHead: function() {
		this.nodes.shift();
	}
	,insertBefore: function(node,check) {
		this.findTransition(node,check).insert(node);
	}
	,findTransition: function(node,check) {
		var _gthis = this;
		var compare = function(a,b) {
			return check(b) - check(a);
		};
		var i = 0;
		var high = this.nodes.length;
		while(i < high) {
			var mid = i + high >> 1;
			if(compare(this.nodes[mid],node) > 0) {
				high = mid;
			} else {
				i = mid + 1;
			}
		}
		return { before : i <= 0 ? null : this.nodes[i - 1] != null ? this.nodes[i - 1] : null, after : this.nodes[i] != null ? this.nodes[i] : null, insert : function(node) {
			_gthis.nodes.splice(i,0,node);
			return node;
		}};
	}
	,__class__: polyboolhx_ListBool
};
var polyboolhx_Intersector = function(selfIntersection,geo) {
	this.currentPath = [];
	this.status = new polyboolhx_ListBool();
	this.events = new polyboolhx_ListBool();
	this.selfIntersection = selfIntersection;
	this.geo = geo;
};
polyboolhx_Intersector.__name__ = "polyboolhx.Intersector";
polyboolhx_Intersector.prototype = {
	selfIntersection: null
	,geo: null
	,events: null
	,status: null
	,currentPath: null
	,compareEvents: function(aStart,a1,a2,aSeg,bStart,b1,b2,bSeg) {
		var comp = this.geo.compareVec2(a1,b1);
		if(comp != 0) {
			return comp;
		}
		if(((aSeg) instanceof polyboolhx_SegmentLine) && ((bSeg) instanceof polyboolhx_SegmentLine) && this.geo.isEqualVec2(a2,b2)) {
			return 0;
		}
		if(aStart != bStart) {
			if(aStart) {
				return 1;
			} else {
				return -1;
			}
		}
		return this.compareSegments(bSeg,aSeg);
	}
	,addEvent: function(ev) {
		var _gthis = this;
		this.events.insertBefore(ev,function(here) {
			if(here == ev) {
				return 0;
			}
			return _gthis.compareEvents(ev.isStart,ev.p,ev.other.p,ev.seg.data,here.isStart,here.p,here.other.p,here.seg.data);
		});
	}
	,divideEvent: function(ev,t,p) {
		polyboolhx_BuildLog.log.segmentDivide(ev.seg,p);
		var left = null;
		var right = null;
		if(ev.seg.data.isLine()) {
			var parts = (js_Boot.__cast(ev.seg.data , polyboolhx_SegmentLine)).split([t]);
			left = parts[0];
			right = parts[1];
		} else {
			var parts = (js_Boot.__cast(ev.seg.data , polyboolhx_SegmentCurve)).split([t]);
			left = parts[0];
			right = parts[1];
		}
		left.setEnd(p);
		right.setStart(p);
		var ns = new polyboolhx_SegmentBool(right,ev.seg.myFill,ev.seg.closed);
		this.events.remove(ev.other);
		ev.seg.data = left;
		polyboolhx_BuildLog.log.segmentChop(ev.seg);
		ev.other.p = p;
		this.addEvent(ev.other);
		return this.addSegment(ns,ev.primary);
	}
	,beginPath: function() {
		this.currentPath = [];
	}
	,closePath: function() {
		var _g = 0;
		var _g1 = this.currentPath;
		while(_g < _g1.length) {
			var seg = _g1[_g];
			++_g;
			seg.closed = true;
		}
	}
	,addSegment: function(seg,primary) {
		var evStart = new polyboolhx_EventBool(true,seg.data.start(),seg,primary);
		var evEnd = new polyboolhx_EventBool(false,seg.data.end(),seg,primary);
		evStart.other = evEnd;
		evEnd.other = evStart;
		this.addEvent(evStart);
		this.addEvent(evEnd);
		return evStart;
	}
	,addLine: function(from,to,primary) {
		if(primary == null) {
			primary = true;
		}
		var f = this.geo.compareVec2(from,to);
		if(f == 0) {
			return;
		}
		var seg = new polyboolhx_SegmentBool(new polyboolhx_SegmentLine(f < 0 ? from : to,f < 0 ? to : from,this.geo),null,false);
		this.currentPath.push(seg);
		this.addSegment(seg,primary);
	}
	,addCurve: function(from,c1,c2,to,primary) {
		if(primary == null) {
			primary = true;
		}
		var original = new polyboolhx_SegmentCurve(from,c1,c2,to,this.geo);
		var curves = original.split(original.inflectionTValues());
		var _g = 0;
		while(_g < curves.length) {
			var curve = curves[_g];
			++_g;
			var f = this.geo.compareVec2(curve.start(),curve.end());
			if(f == 0) {
				continue;
			}
			var line = curve.toLine();
			if(line != null) {
				this.addLine(line.p0,line.p1,primary);
			} else {
				var seg = new polyboolhx_SegmentBool(f < 0 ? curve : curve.reverse(),null,false);
				this.currentPath.push(seg);
				this.addSegment(seg,primary);
			}
		}
	}
	,compareSegments: function(seg1,seg2) {
		var A = seg1.start();
		var B = seg2.start2();
		var C = seg2.start();
		if(seg2.pointOn(A)) {
			A = seg1.start2();
			if(seg2.pointOn(A)) {
				if(((seg1) instanceof polyboolhx_SegmentLine)) {
					if(((seg2) instanceof polyboolhx_SegmentLine)) {
						return 0;
					}
					if(((seg2) instanceof polyboolhx_SegmentCurve)) {
						A = seg1.point(0.5);
					}
				}
				if(((seg1) instanceof polyboolhx_SegmentCurve)) {
					A = seg1.end();
				}
			}
			if(((seg2) instanceof polyboolhx_SegmentCurve)) {
				if(this.geo.snap0(A[0] - C[0]) == 0 && this.geo.snap0(B[0] - C[0]) == 0) {
					return polyboolhx_IntersectorUtils.sign(C[1] - A[1]);
				}
			}
		} else {
			if(((seg2) instanceof polyboolhx_SegmentCurve)) {
				var y = (js_Boot.__cast(seg2 , polyboolhx_SegmentCurve)).mapXtoY(A[0],true);
				if(y != null) {
					return polyboolhx_IntersectorUtils.sign(y - A[1]);
				}
			}
			if(((seg1) instanceof polyboolhx_SegmentCurve)) {
				var i = polyboolhx_SegmentUtils.segmentsIntersect(seg1,seg2,true);
				if(i != null && ((i) instanceof polyboolhx_SegmentTValuePairs)) {
					var _g = 0;
					var _g1 = (js_Boot.__cast(i , polyboolhx_SegmentTValuePairs)).tValuePairs;
					while(_g < _g1.length) {
						var pair = _g1[_g];
						++_g;
						var t = this.geo.snap01(pair[0]);
						if(t > 0 && t < 1) {
							B = seg1.point(t);
							break;
						}
					}
				}
			}
		}
		var Ax = A[0];
		var Ay = A[1];
		var Bx = B[0];
		var By = B[1];
		var Cx = C[0];
		var Cy = C[1];
		return polyboolhx_IntersectorUtils.sign((Bx - Ax) * (Cy - Ay) - (By - Ay) * (Cx - Ax));
	}
	,statusFindSurrounding: function(ev) {
		var _gthis = this;
		return this.status.findTransition(ev,function(here) {
			if(ev == here) {
				return 0;
			}
			var c = _gthis.compareSegments(ev.seg.data,here.seg.data);
			if(c == 0) {
				return -1;
			} else {
				return c;
			}
		});
	}
	,checkIntersection: function(ev1,ev2) {
		var seg1 = ev1.seg;
		var seg2 = ev2.seg;
		polyboolhx_BuildLog.log.checkIntersection(seg1,seg2);
		var i = polyboolhx_SegmentUtils.segmentsIntersect(seg1.data,seg2.data,false);
		if(i == null) {
			return null;
		} else if(((i) instanceof polyboolhx_SegmentTRangePairs)) {
			var rpairs = js_Boot.__cast(i , polyboolhx_SegmentTRangePairs);
			var tA1 = rpairs.tStart[0];
			var tB1 = rpairs.tStart[1];
			var tA2 = rpairs.tEnd[0];
			var tB2 = rpairs.tEnd[1];
			if(tA1 == 1 && tA2 == 1 && tB1 == 0 && tB2 == 0 || tA1 == 0 && tA2 == 0 && tB1 == 1 && tB2 == 1) {
				return null;
			}
			if(tA1 == 0 && tA2 == 1 && tB1 == 0 && tB2 == 1) {
				return ev2;
			}
			var a1 = seg1.data.start();
			var a2 = seg1.data.end();
			var b2 = seg2.data.end();
			if(tA1 == 0 && tB1 == 0) {
				if(tA2 == 1) {
					this.divideEvent(ev2,tB2,a2);
				} else {
					this.divideEvent(ev1,tA2,b2);
				}
				return ev2;
			} else if(tB1 > 0 && tB1 < 1) {
				if(tA2 == 1 && tB2 == 1) {
					this.divideEvent(ev2,tB1,a1);
				} else {
					if(tA2 == 1) {
						this.divideEvent(ev2,tB2,a2);
					} else {
						this.divideEvent(ev1,tA2,b2);
					}
					this.divideEvent(ev2,tB1,a1);
				}
			}
			return null;
		} else if(((i) instanceof polyboolhx_SegmentTValuePairs)) {
			var stvp = js_Boot.__cast(i , polyboolhx_SegmentTValuePairs);
			if(stvp.tValuePairs.length <= 0) {
				return null;
			}
			var minPair = stvp.tValuePairs[0];
			var j = 1;
			while(j < stvp.tValuePairs.length && (minPair[0] == 0 && minPair[1] == 0 || minPair[0] == 0 && minPair[1] == 1 || minPair[0] == 1 && minPair[1] == 0 || minPair[0] == 1 && minPair[1] == 1)) {
				minPair = stvp.tValuePairs[j];
				++j;
			}
			var tA = minPair[0];
			var tB = minPair[1];
			var p;
			if(tB == 0) {
				p = seg2.data.start();
			} else if(tB == 1) {
				p = seg2.data.end();
			} else if(tA == 0) {
				p = seg1.data.start();
			} else if(tA == 1) {
				p = seg1.data.end();
			} else {
				p = seg1.data.point(tA);
			}
			if(tA > 0 && tA < 1) {
				this.divideEvent(ev1,tA,p);
			}
			if(tB > 0 && tB < 1) {
				this.divideEvent(ev2,tB,p);
			}
			return null;
		}
		throw new haxe_Exception("PolyBool: Unknown intersection type");
	}
	,calculate: function() {
		var _gthis = this;
		var segments = [];
		while(!this.events.isEmpty()) {
			var ev = [this.events.getHead()];
			polyboolhx_BuildLog.log.vert(ev[0].p[0]);
			if(ev[0].isStart) {
				polyboolhx_BuildLog.log.segmentNew(ev[0].seg,ev[0].primary);
				var surrounding = this.statusFindSurrounding(ev[0]);
				var above = [surrounding.before];
				var below = [surrounding.after];
				polyboolhx_BuildLog.log.tempStatus(ev[0].seg,above[0] != null ? above[0].seg : null,below[0] != null ? below[0].seg : null);
				var checkBothIntersections = (function(below,above,ev) {
					return function() {
						if(above[0] != null) {
							var eve = _gthis.checkIntersection(ev[0],above[0]);
							if(eve != null) {
								return eve;
							}
						}
						if(below[0] != null) {
							return _gthis.checkIntersection(ev[0],below[0]);
						}
						return null;
					};
				})(below,above,ev);
				var eve = checkBothIntersections();
				if(eve != null) {
					if(this.selfIntersection) {
						var toggle;
						if(ev[0].seg.myFill.below == null) {
							toggle = ev[0].seg.closed;
						} else {
							toggle = ev[0].seg.myFill.above != ev[0].seg.myFill.below;
						}
						if(toggle) {
							eve.seg.myFill.above = !eve.seg.myFill.above;
						}
					} else {
						eve.seg.otherFill = ev[0].seg.myFill;
					}
					polyboolhx_BuildLog.log.segmentUpdate(eve.seg);
					this.events.remove(ev[0].other);
					this.events.remove(ev[0]);
				}
				if(this.events.getHead() != ev[0]) {
					polyboolhx_BuildLog.log.rewind(ev[0].seg);
					continue;
				}
				if(this.selfIntersection) {
					var toggle1;
					if(ev[0].seg.myFill.below == null) {
						toggle1 = ev[0].seg.closed;
					} else {
						toggle1 = ev[0].seg.myFill.above != ev[0].seg.myFill.below;
					}
					if(below[0] == null) {
						ev[0].seg.myFill.below = false;
					} else {
						ev[0].seg.myFill.below = below[0].seg.myFill.above;
					}
					ev[0].seg.myFill.above = toggle1 ? !ev[0].seg.myFill.below : ev[0].seg.myFill.below;
				} else if(ev[0].seg.otherFill == null) {
					var inside;
					if(below[0] == null) {
						inside = false;
					} else if(ev[0].primary == below[0].primary) {
						if(below[0].seg.otherFill == null) {
							throw new haxe_Exception("PolyBool: Unexpected state of otherFill (null)");
						}
						inside = below[0].seg.otherFill.above;
					} else {
						inside = below[0].seg.myFill.above;
					}
					ev[0].seg.otherFill = { above : inside, below : inside};
				}
				polyboolhx_BuildLog.log.status(ev[0].seg,above[0] != null ? above[0].seg : null,below[0] != null ? below[0].seg : null);
				ev[0].other.status = surrounding.insert(ev[0]);
			} else {
				var st = ev[0].status;
				if(st == null) {
					throw new haxe_Exception("PolyBool: Zero-length segment detected; your epsilon is " + "probably too small or too large");
				}
				var i = this.status.getIndex(st);
				if(i > 0 && i < this.status.nodes.length - 1) {
					var before = this.status.nodes[i - 1];
					var after = this.status.nodes[i + 1];
					this.checkIntersection(before,after);
				}
				polyboolhx_BuildLog.log.statusRemove(st.seg);
				this.status.remove(st);
				if(!ev[0].primary) {
					if(ev[0].seg.otherFill == null) {
						throw new haxe_Exception("PolyBool: Unexpected state of otherFill (null)");
					}
					var s = ev[0].seg.myFill;
					ev[0].seg.myFill = ev[0].seg.otherFill;
					ev[0].seg.otherFill = s;
				}
				segments.push(ev[0].seg);
			}
			this.events.removeHead();
		}
		polyboolhx_BuildLog.log.done();
		return segments;
	}
	,__class__: polyboolhx_Intersector
};
var polyboolhx_PolyBool = function(geo) {
	if(geo == null) {
		geo = new polyboolhx_GeometryEpsilon();
	}
	this.geo = geo;
};
polyboolhx_PolyBool.__name__ = "polyboolhx.PolyBool";
polyboolhx_PolyBool.prototype = {
	geo: null
	,shape: function() {
		return new polyboolhx_Shape(this.geo,null);
	}
	,buildLog: function(enable) {
		polyboolhx_BuildLog.log = enable ? new polyboolhx_ArrayBuildLog() : null;
		if(enable) {
			return polyboolhx_BuildLog.log.list;
		} else {
			return null;
		}
	}
	,segments: function(poly) {
		var shape = this.shape();
		shape.beginPath();
		var _g = 0;
		var _g1 = poly.regions;
		while(_g < _g1.length) {
			var region = _g1[_g];
			++_g;
			var lastPoint = region[region.length - 1];
			shape.moveTo(lastPoint[lastPoint.length - 2],lastPoint[lastPoint.length - 1]);
			var _g2 = 0;
			while(_g2 < region.length) {
				var p = region[_g2];
				++_g2;
				if(p.length == 2) {
					shape.lineTo(p[0],p[1]);
				} else if(p.length == 6) {
					shape.bezierCurveTo(p[0],p[1],p[2],p[3],p[4],p[5]);
				} else {
					throw new haxe_Exception("PolyBool: Invalid point in region");
				}
			}
			shape.closePath();
		}
		return { shape : shape, inverted : poly.inverted};
	}
	,combine: function(segments1,segments2) {
		return { shape : segments1.shape.combine(segments2.shape), inverted1 : segments1.inverted, inverted2 : segments2.inverted};
	}
	,selectUnion: function(combined) {
		return { shape : combined.inverted1 ? combined.inverted2 ? combined.shape.intersect() : combined.shape.difference() : combined.inverted2 ? combined.shape.differenceRev() : combined.shape.union(), inverted : combined.inverted1 || combined.inverted2};
	}
	,selectIntersect: function(combined) {
		return { shape : combined.inverted1 ? combined.inverted2 ? combined.shape.union() : combined.shape.differenceRev() : combined.inverted2 ? combined.shape.difference() : combined.shape.intersect(), inverted : combined.inverted1 && combined.inverted2};
	}
	,selectDifference: function(combined) {
		return { shape : combined.inverted1 ? combined.inverted2 ? combined.shape.differenceRev() : combined.shape.union() : combined.inverted2 ? combined.shape.intersect() : combined.shape.difference(), inverted : combined.inverted1 && !combined.inverted2};
	}
	,selectDifferenceRev: function(combined) {
		return { shape : combined.inverted1 ? combined.inverted2 ? combined.shape.difference() : combined.shape.intersect() : combined.inverted2 ? combined.shape.union() : combined.shape.differenceRev(), inverted : !combined.inverted1 && combined.inverted2};
	}
	,selectXor: function(combined) {
		return { shape : combined.shape.xor(), inverted : combined.inverted1 != combined.inverted2};
	}
	,polygon: function(segments) {
		var regions = [];
		var receiver = { beginPath : function() {
			return;
		}, moveTo : function(x,y) {
			return regions.push([]);
		}, lineTo : function(x,y) {
			return regions[regions.length - 1].push([x,y]);
		}, bezierCurveTo : function(c1x,c1y,c2x,c2y,x,y) {
			return regions[regions.length - 1].push([c1x,c1y,c2x,c2y,x,y]);
		}, closePath : function() {
			return;
		}};
		segments.shape.output(receiver);
		return { regions : regions, inverted : segments.inverted};
	}
	,union: function(poly1,poly2) {
		var seg1 = this.segments(poly1);
		var seg2 = this.segments(poly2);
		var comb = this.combine(seg1,seg2);
		var seg3 = this.selectUnion(comb);
		return this.polygon(seg3);
	}
	,intersect: function(poly1,poly2) {
		var seg1 = this.segments(poly1);
		var seg2 = this.segments(poly2);
		var comb = this.combine(seg1,seg2);
		var seg3 = this.selectIntersect(comb);
		return this.polygon(seg3);
	}
	,difference: function(poly1,poly2) {
		var seg1 = this.segments(poly1);
		var seg2 = this.segments(poly2);
		var comb = this.combine(seg1,seg2);
		var seg3 = this.selectDifference(comb);
		return this.polygon(seg3);
	}
	,differenceRev: function(poly1,poly2) {
		var seg1 = this.segments(poly1);
		var seg2 = this.segments(poly2);
		var comb = this.combine(seg1,seg2);
		var seg3 = this.selectDifferenceRev(comb);
		return this.polygon(seg3);
	}
	,xor: function(poly1,poly2) {
		var seg1 = this.segments(poly1);
		var seg2 = this.segments(poly2);
		var comb = this.combine(seg1,seg2);
		var seg3 = this.selectXor(comb);
		return this.polygon(seg3);
	}
	,__class__: polyboolhx_PolyBool
};
var polyboolhx_Receiver = function() {
	this.log = [];
};
polyboolhx_Receiver.__name__ = "polyboolhx.Receiver";
polyboolhx_Receiver.prototype = {
	log: null
	,beginPath: function() {
		this.log.push("beginPath");
	}
	,moveTo: function(x,y) {
		this.log = this.log.concat(["moveTo",x,y]);
	}
	,lineTo: function(x,y) {
		this.log = this.log.concat(["lineTo",x,y]);
	}
	,bezierCurveTo: function(cp1x,cp1y,cp2x,cp2y,x,y) {
		this.log.push(["bezierCurveTo",cp1x,cp1y,cp2x,cp2y,x,y]);
	}
	,closePath: function() {
		this.log.push("closePath");
	}
	,done: function() {
		return this.log;
	}
	,__class__: polyboolhx_Receiver
};
var polyboolhx_PolyboolTest = function() { };
polyboolhx_PolyboolTest.__name__ = "polyboolhx.PolyboolTest";
polyboolhx_PolyboolTest.assertEqual = function(a,b) {
	var _g = deepequal_DeepEqual.compare(a,b,{ fileName : "src/polyboolhx/PolyboolTest.hx", lineNumber : 96, className : "polyboolhx.PolyboolTest", methodName : "assertEqual"});
	switch(_g._hx_index) {
	case 0:
		var _g1 = _g.s;
		return true;
	case 1:
		var f = _g.f;
		throw new haxe_Exception("Values not equal");
	}
};
polyboolhx_PolyboolTest.main = function() {
	var polybool = new polyboolhx_PolyBool();
	polybool.buildLog(true);
	var tests = [{ name : "basic intersection", func : function() {
		return polyboolhx_PolyboolTest.assertEqual(polybool.intersect(polyboolhx_PolyboolTest.triangle1,polyboolhx_PolyboolTest.triangle2),{ regions : [[[10.0,0.0],[5.0,0.0],[7.5,5.0]]], inverted : false});
	}},{ name : "basic union", func : function() {
		return polyboolhx_PolyboolTest.assertEqual(polybool.union(polyboolhx_PolyboolTest.triangle1,polyboolhx_PolyboolTest.triangle2),{ regions : [[[10.0,10.0],[7.5,5],[5.0,10.0],[0.0,0.0],[15.0,0.0]]], inverted : false});
	}},{ name : "union with curve", func : function() {
		return polyboolhx_PolyboolTest.assertEqual(polybool.union(polyboolhx_PolyboolTest.box1,polyboolhx_PolyboolTest.curve1),{ regions : [[[10.0,0.0],[10.0,-2.5,7.5,-3.75,5.0,-3.75],[5.0,-5.0],[0.0,-5.0],[0.0,0.0]]], inverted : false});
	}},{ name : "example", func : function() {
		var log = polybool.shape().beginPath().moveTo(50,50).lineTo(150,150).lineTo(190,50).closePath().moveTo(130,50).lineTo(290,150).lineTo(290,50).closePath().combine(polybool.shape().beginPath().moveTo(110,20).lineTo(110,110).lineTo(20,20).closePath().moveTo(130,170).lineTo(130,20).lineTo(260,20).lineTo(260,170).closePath()).intersect().output(new polyboolhx_Receiver()).done();
		return polyboolhx_PolyboolTest.assertEqual(log,["beginPath","moveTo",110,110,"lineTo",50,50,"lineTo",110,50,"lineTo",110,110,"closePath","moveTo",150,150,"lineTo",178,80,"lineTo",130,50,"lineTo",130,130,"lineTo",150,150,"closePath","moveTo",260,131.25,"lineTo",178,80,"lineTo",190,50,"lineTo",260,50,"lineTo",260,131.25,"closePath"]);
	}},{ name : "transforms", func : function() {
		var log = polybool.shape().setTransform(3,0,0,2,100,200).beginPath().moveTo(50,50).lineTo(-10,50).lineTo(10,10).closePath().output(new polyboolhx_Receiver()).done();
		return polyboolhx_PolyboolTest.assertEqual(log,["beginPath","moveTo",250,300,"lineTo",70,300,"lineTo",130,220,"lineTo",250,300,"closePath"]);
	}}];
	var pass = 0;
	var fail = 0;
	var _g = 0;
	while(_g < tests.length) {
		var test = tests[_g];
		++_g;
		try {
			test.func();
			haxe_Log.trace("pass " + test.name,{ fileName : "src/polyboolhx/PolyboolTest.hx", lineNumber : 245, className : "polyboolhx.PolyboolTest", methodName : "main"});
			++pass;
		} catch( _g1 ) {
			var err = haxe_Exception.caught(_g1);
			haxe_Log.trace("FAIL " + test.name,{ fileName : "src/polyboolhx/PolyboolTest.hx", lineNumber : 248, className : "polyboolhx.PolyboolTest", methodName : "main"});
			haxe_Log.trace("" + test.name + " failed:",{ fileName : "src/polyboolhx/PolyboolTest.hx", lineNumber : 249, className : "polyboolhx.PolyboolTest", methodName : "main", customParams : [err]});
			++fail;
		}
	}
	haxe_Log.trace("\nPass: " + pass + "\nFail: " + fail,{ fileName : "src/polyboolhx/PolyboolTest.hx", lineNumber : 253, className : "polyboolhx.PolyboolTest", methodName : "main"});
};
var polyboolhx_SegmentPairs = function() { };
polyboolhx_SegmentPairs.__name__ = "polyboolhx.SegmentPairs";
polyboolhx_SegmentPairs.__isInterface__ = true;
var polyboolhx_SegmentTValuePairs = function(tValuePairs) {
	this.tValuePairs = tValuePairs;
};
polyboolhx_SegmentTValuePairs.__name__ = "polyboolhx.SegmentTValuePairs";
polyboolhx_SegmentTValuePairs.__interfaces__ = [polyboolhx_SegmentPairs];
polyboolhx_SegmentTValuePairs.prototype = {
	tValuePairs: null
	,__class__: polyboolhx_SegmentTValuePairs
};
var polyboolhx_SegmentTRangePairs = function(tStart,tEnd) {
	this.tStart = tStart;
	this.tEnd = tEnd;
};
polyboolhx_SegmentTRangePairs.__name__ = "polyboolhx.SegmentTRangePairs";
polyboolhx_SegmentTRangePairs.__interfaces__ = [polyboolhx_SegmentPairs];
polyboolhx_SegmentTRangePairs.prototype = {
	tStart: null
	,tEnd: null
	,__class__: polyboolhx_SegmentTRangePairs
};
var polyboolhx_SegmentTValuesBuilder = function(geo) {
	this.tValues = [];
	this.geo = geo;
};
polyboolhx_SegmentTValuesBuilder.__name__ = "polyboolhx.SegmentTValuesBuilder";
polyboolhx_SegmentTValuesBuilder.prototype = {
	tValues: null
	,geo: null
	,addArray: function(ts) {
		var _g = 0;
		while(_g < ts.length) {
			var t = ts[_g];
			++_g;
			this.tValues.push(t);
		}
		return this;
	}
	,add: function(t) {
		t = this.geo.snap01(t);
		if(t < 0 || t > 1) {
			return this;
		}
		var _g = 0;
		var _g1 = this.tValues;
		while(_g < _g1.length) {
			var tv = _g1[_g];
			++_g;
			if(this.geo.snap0(t - tv) == 0) {
				return this;
			}
		}
		this.tValues.push(t);
		return this;
	}
	,list: function() {
		this.tValues.sort(function(a,b) {
			var diff = a - b;
			if(diff == 0) {
				return 0;
			}
			if(diff > 0) {
				return 1;
			} else {
				return -1;
			}
		});
		return this.tValues;
	}
	,__class__: polyboolhx_SegmentTValuesBuilder
};
var polyboolhx_SegmentTValuePairsBuilder = function(allowOutOfRange,geo) {
	this.tValuePairs = [];
	this.allowOutOfRange = allowOutOfRange;
	this.geo = geo;
};
polyboolhx_SegmentTValuePairsBuilder.__name__ = "polyboolhx.SegmentTValuePairsBuilder";
polyboolhx_SegmentTValuePairsBuilder.prototype = {
	tValuePairs: null
	,allowOutOfRange: null
	,geo: null
	,add: function(t1,t2) {
		t1 = this.geo.snap01(t1);
		t2 = this.geo.snap01(t2);
		if(!this.allowOutOfRange && (t1 < 0 || t1 > 1 || t2 < 0 || t2 > 1)) {
			return this;
		}
		var _g = 0;
		var _g1 = this.tValuePairs;
		while(_g < _g1.length) {
			var tv = _g1[_g];
			++_g;
			if(this.geo.snap0(t1 - tv[0]) == 0 || this.geo.snap0(t2 - tv[1]) == 0) {
				return this;
			}
		}
		this.tValuePairs.push([t1,t2]);
		return this;
	}
	,list: function() {
		this.tValuePairs.sort(function(a,b) {
			return a[0] - b[0] | 0;
		});
		return this.tValuePairs;
	}
	,done: function() {
		if(this.tValuePairs.length <= 0) {
			return null;
		} else {
			return new polyboolhx_SegmentTValuePairs(this.list());
		}
	}
	,__class__: polyboolhx_SegmentTValuePairsBuilder
};
var polyboolhx_SegmentBase = function() {
};
polyboolhx_SegmentBase.__name__ = "polyboolhx.SegmentBase";
polyboolhx_SegmentBase.prototype = {
	isLine: function() {
		return ((this) instanceof polyboolhx_SegmentLine);
	}
	,copy: function() {
		throw haxe_Exception.thrown("Abstract method: must be overridden");
	}
	,isEqual: function(other) {
		throw haxe_Exception.thrown("Abstract method: must be overridden");
	}
	,start: function() {
		throw haxe_Exception.thrown("Abstract method: must be overridden");
	}
	,start2: function() {
		throw haxe_Exception.thrown("Abstract method: must be overridden");
	}
	,end2: function() {
		throw haxe_Exception.thrown("Abstract method: must be overridden");
	}
	,end: function() {
		throw haxe_Exception.thrown("Abstract method: must be overridden");
	}
	,setStart: function(p) {
		throw haxe_Exception.thrown("Abstract method: must be overridden");
	}
	,setEnd: function(p) {
		throw haxe_Exception.thrown("Abstract method: must be overridden");
	}
	,point: function(t) {
		throw haxe_Exception.thrown("Abstract method: must be overridden");
	}
	,split: function(t) {
		throw haxe_Exception.thrown("Abstract method: must be overridden");
	}
	,reverse: function() {
		throw haxe_Exception.thrown("Abstract method: must be overridden");
	}
	,boundingBox: function() {
		throw haxe_Exception.thrown("Abstract method: must be overridden");
	}
	,pointOn: function(p) {
		throw haxe_Exception.thrown("Abstract method: must be overridden");
	}
	,draw: function(ctx) {
		throw haxe_Exception.thrown("Abstract method: must be overridden");
	}
	,__class__: polyboolhx_SegmentBase
};
var polyboolhx_Segment = function() { };
polyboolhx_Segment.__name__ = "polyboolhx.Segment";
polyboolhx_Segment.__isInterface__ = true;
polyboolhx_Segment.prototype = {
	start: null
	,start2: null
	,pointOn: null
	,point: null
	,end: null
	,setStart: null
	,setEnd: null
	,isLine: null
	,__class__: polyboolhx_Segment
};
var polyboolhx_SegmentLine = function(p0,p1,geo) {
	polyboolhx_SegmentBase.call(this);
	this.p0 = p0;
	this.p1 = p1;
	this.geo = geo;
};
polyboolhx_SegmentLine.__name__ = "polyboolhx.SegmentLine";
polyboolhx_SegmentLine.__interfaces__ = [polyboolhx_Segment];
polyboolhx_SegmentLine.__super__ = polyboolhx_SegmentBase;
polyboolhx_SegmentLine.prototype = $extend(polyboolhx_SegmentBase.prototype,{
	p0: null
	,p1: null
	,geo: null
	,copy: function() {
		return new polyboolhx_SegmentLine(this.p0,this.p1,this.geo);
	}
	,isEqual: function(other) {
		if(this.geo.isEqualVec2(this.p0,other.p0)) {
			return this.geo.isEqualVec2(this.p1,other.p1);
		} else {
			return false;
		}
	}
	,start: function() {
		return this.p0;
	}
	,start2: function() {
		return this.p1;
	}
	,end2: function() {
		return this.p0;
	}
	,end: function() {
		return this.p1;
	}
	,setStart: function(p0) {
		this.p0 = p0;
	}
	,setEnd: function(p1) {
		this.p1 = p1;
	}
	,point: function(t) {
		var p0 = this.p0;
		var p1 = this.p1;
		if(t == 0) {
			return p0;
		} else if(t == 1) {
			return p1;
		} else {
			return [p0[0] + (p1[0] - p0[0]) * t,p0[1] + (p1[1] - p0[1]) * t];
		}
	}
	,split: function(ts) {
		var _gthis = this;
		if(ts.length <= 0) {
			return [this];
		}
		var result = new Array(ts.length);
		var _g = 0;
		var _g1 = ts.length;
		while(_g < _g1) {
			var i = _g++;
			result[i] = _gthis.point(ts[i]);
		}
		var pts = result;
		pts.push(this.p1);
		var result = [];
		var last = this.p0;
		var _g = 0;
		while(_g < pts.length) {
			var pt = pts[_g];
			++_g;
			result.push(new polyboolhx_SegmentLine(last,pt,this.geo));
			last = pt;
		}
		return result;
	}
	,reverse: function() {
		return new polyboolhx_SegmentLine(this.p1,this.p0,this.geo);
	}
	,boundingBox: function() {
		var p0 = this.p0;
		var p1 = this.p1;
		return [[Math.min(p0[0],p1[0]),Math.min(p0[1],p1[1])],[Math.max(p0[0],p1[0]),Math.max(p0[1],p1[1])]];
	}
	,pointOn: function(p) {
		return this.geo.isCollinear(p,this.p0,this.p1);
	}
	,draw: function(ctx) {
		var p0 = this.p0;
		var p1 = this.p1;
		ctx.moveTo(p0[0],p0[1]);
		ctx.lineTo(p1[0],p1[1]);
		return ctx;
	}
	,__class__: polyboolhx_SegmentLine
});
var polyboolhx_SegmentCurve = function(p0,p1,p2,p3,geo) {
	polyboolhx_SegmentBase.call(this);
	this.p0 = p0;
	this.p1 = p1;
	this.p2 = p2;
	this.p3 = p3;
	this.geo = geo;
};
polyboolhx_SegmentCurve.__name__ = "polyboolhx.SegmentCurve";
polyboolhx_SegmentCurve.__interfaces__ = [polyboolhx_Segment];
polyboolhx_SegmentCurve.__super__ = polyboolhx_SegmentBase;
polyboolhx_SegmentCurve.prototype = $extend(polyboolhx_SegmentBase.prototype,{
	p0: null
	,p1: null
	,p2: null
	,p3: null
	,geo: null
	,copy: function() {
		return new polyboolhx_SegmentCurve(this.p0,this.p1,this.p2,this.p3,this.geo);
	}
	,isEqual: function(other) {
		if(this.geo.isEqualVec2(this.p0,other.p0) && this.geo.isEqualVec2(this.p1,other.p1) && this.geo.isEqualVec2(this.p2,other.p2)) {
			return this.geo.isEqualVec2(this.p3,other.p3);
		} else {
			return false;
		}
	}
	,start: function() {
		return this.p0;
	}
	,start2: function() {
		return this.p1;
	}
	,end2: function() {
		return this.p2;
	}
	,end: function() {
		return this.p3;
	}
	,setStart: function(p0) {
		this.p0 = p0;
	}
	,setEnd: function(p3) {
		this.p3 = p3;
	}
	,point: function(t) {
		var p0 = this.p0;
		var p1 = this.p1;
		var p2 = this.p2;
		var p3 = this.p3;
		if(t == 0) {
			return p0;
		} else if(t == 1) {
			return p3;
		}
		var t1t = (1 - t) * (1 - t);
		var tt = t * t;
		var t0 = t1t * (1 - t);
		var t1 = 3 * t1t * t;
		var t2 = 3 * tt * (1 - t);
		var t3 = tt * t;
		return [p0[0] * t0 + p1[0] * t1 + p2[0] * t2 + p3[0] * t3,p0[1] * t0 + p1[1] * t1 + p2[1] * t2 + p3[1] * t3];
	}
	,split: function(ts) {
		var _gthis = this;
		if(ts.length <= 0) {
			return [this];
		}
		var result = [];
		var splitSingle = function(pts,t) {
			var p0 = pts[0];
			var p1 = pts[1];
			var p2 = pts[2];
			var p3 = pts[3];
			var p4 = polyboolhx_GeometryUtils.lerpVec2(p0,p1,t);
			var p5 = polyboolhx_GeometryUtils.lerpVec2(p1,p2,t);
			var p6 = polyboolhx_GeometryUtils.lerpVec2(p2,p3,t);
			var p7 = polyboolhx_GeometryUtils.lerpVec2(p4,p5,t);
			var p8 = polyboolhx_GeometryUtils.lerpVec2(p5,p6,t);
			var p9 = polyboolhx_GeometryUtils.lerpVec2(p7,p8,t);
			result.push(new polyboolhx_SegmentCurve(p0,p4,p7,p9,_gthis.geo));
			return [p9,p8,p6,p3];
		};
		var last = [this.p0,this.p1,this.p2,this.p3];
		var lastT = 0;
		var _g = 0;
		while(_g < ts.length) {
			var t = ts[_g];
			++_g;
			last = splitSingle(last,(t - lastT) / (1 - lastT));
			lastT = t;
		}
		result.push(new polyboolhx_SegmentCurve(last[0],last[1],last[2],last[3],this.geo));
		return result;
	}
	,reverse: function() {
		return new polyboolhx_SegmentCurve(this.p3,this.p2,this.p1,this.p0,this.geo);
	}
	,getCubicCoefficients: function(axis) {
		var p0 = this.p0[axis];
		var p1 = this.p1[axis];
		var p2 = this.p2[axis];
		var p3 = this.p3[axis];
		return [p3 - 3 * p2 + 3 * p1 - p0,3 * p2 - 6 * p1 + 3 * p0,3 * p1 - 3 * p0,p0];
	}
	,boundingTValues: function() {
		var _gthis = this;
		var result = new polyboolhx_SegmentTValuesBuilder(this.geo);
		var bounds = function(x0,x1,x2,x3) {
			var a = 3 * x3 - 9 * x2 + 9 * x1 - 3 * x0;
			var b = 6 * x0 - 12 * x1 + 6 * x2;
			var c = 3 * x1 - 3 * x0;
			if(_gthis.geo.snap0(a) == 0) {
				result.add(-c / b);
			} else {
				var disc = b * b - 4 * a * c;
				if(disc >= 0) {
					var sq = Math.sqrt(disc);
					result.add((-b + sq) / (2 * a));
					result.add((-b - sq) / (2 * a));
				}
			}
			return result;
		};
		var p0 = this.p0;
		var p1 = this.p1;
		var p2 = this.p2;
		var p3 = this.p3;
		bounds(p0[0],p1[0],p2[0],p3[0]);
		bounds(p0[1],p1[1],p2[1],p3[1]);
		return result.list();
	}
	,inflectionTValues: function() {
		var result = new polyboolhx_SegmentTValuesBuilder(this.geo);
		result.addArray(this.boundingTValues());
		var p0 = this.p0;
		var p1 = this.p1;
		var p2 = this.p2;
		var p3 = this.p3;
		var p10x = 3 * (p1[0] - p0[0]);
		var p10y = 3 * (p1[1] - p0[1]);
		var p21x = 6 * (p2[0] - p1[0]);
		var p21y = 6 * (p2[1] - p1[1]);
		var p32x = 3 * (p3[0] - p2[0]);
		var p32y = 3 * (p3[1] - p2[1]);
		var p210x = 6 * (p2[0] - 2 * p1[0] + p0[0]);
		var p210y = 6 * (p2[1] - 2 * p1[1] + p0[1]);
		var p321x = 6 * (p3[0] - 2 * p2[0] + p1[0]);
		var p321y = 6 * (p3[1] - 2 * p2[1] + p1[1]);
		var qx = p10x - p21x + p32x;
		var qy = p10y - p21y + p32y;
		var rx = p21x - 2 * p10x;
		var ry = p21y - 2 * p10y;
		var sx = p10x;
		var sy = p10y;
		var ux = p321x - p210x;
		var uy = p321y - p210y;
		var vx = p210x;
		var vy = p210y;
		var A = qx * uy - qy * ux;
		var B = qx * vy + rx * uy - qy * vx - ry * ux;
		var C = rx * vy + sx * uy - ry * vx - sy * ux;
		var D = sx * vy - sy * vx;
		var _g = 0;
		var _g1 = this.geo.solveCubic(A,B,C,D);
		while(_g < _g1.length) {
			var s = _g1[_g];
			++_g;
			result.add(s);
		}
		return result.list();
	}
	,boundingBox: function() {
		var p0 = this.p0;
		var p3 = this.p3;
		var min = [Math.min(p0[0],p3[0]),Math.min(p0[1],p3[1])];
		var max = [Math.max(p0[0],p3[0]),Math.max(p0[1],p3[1])];
		var _g = 0;
		var _g1 = this.boundingTValues();
		while(_g < _g1.length) {
			var t = _g1[_g];
			++_g;
			var p = this.point(t);
			min[0] = Math.min(min[0],p[0]);
			min[1] = Math.min(min[1],p[1]);
			max[0] = Math.max(max[0],p[0]);
			max[1] = Math.max(max[1],p[1]);
		}
		return [min,max];
	}
	,mapXtoT: function(x,force) {
		if(force == null) {
			force = false;
		}
		if(this.geo.snap0(this.p0[0] - x) == 0) {
			return 0;
		}
		if(this.geo.snap0(this.p3[0] - x) == 0) {
			return 1;
		}
		var p0 = this.p0[0] - x;
		var p1 = this.p1[0] - x;
		var p2 = this.p2[0] - x;
		var p3 = this.p3[0] - x;
		var R = [p3 - 3 * p2 + 3 * p1 - p0,3 * p2 - 6 * p1 + 3 * p0,3 * p1 - 3 * p0,p0];
		var _g = 0;
		var _g1 = this.geo.solveCubic(R[0],R[1],R[2],R[3]);
		while(_g < _g1.length) {
			var t = _g1[_g];
			++_g;
			var ts = this.geo.snap01(t);
			if(ts >= 0 && ts <= 1) {
				return t;
			}
		}
		if(force || x >= Math.min(this.p0[0],this.p3[0]) && x <= Math.max(this.p0[0],this.p3[0])) {
			var _g = 0;
			while(_g < 4) {
				var attempt = _g++;
				var ii = -1;
				if(R[0] != 0 && (ii < 0 || Math.abs(R[0]) < Math.abs(R[ii]))) {
					ii = 0;
				}
				if(R[1] != 0 && (ii < 0 || Math.abs(R[1]) < Math.abs(R[ii]))) {
					ii = 1;
				}
				if(R[2] != 0 && (ii < 0 || Math.abs(R[2]) < Math.abs(R[ii]))) {
					ii = 2;
				}
				if(R[3] != 0 && (ii < 0 || Math.abs(R[3]) < Math.abs(R[ii]))) {
					ii = 3;
				}
				if(ii < 0) {
					return 0;
				}
				R[ii] = 0;
				var _g1 = 0;
				var _g2 = this.geo.solveCubic(R[0],R[1],R[2],R[3]);
				while(_g1 < _g2.length) {
					var t = _g2[_g1];
					++_g1;
					var ts = this.geo.snap01(t);
					if(ts >= 0 && ts <= 1) {
						return t;
					}
				}
			}
		}
		return null;
	}
	,mapXtoY: function(x,force) {
		if(force == null) {
			force = false;
		}
		var t = this.mapXtoT(x,force);
		if(t == null) {
			return null;
		}
		return this.point(t)[1];
	}
	,pointOn: function(p) {
		if(this.geo.isEqualVec2(this.p0,p) || this.geo.isEqualVec2(this.p3,p)) {
			return true;
		}
		var y = this.mapXtoY(p[0]);
		if(y == null) {
			return false;
		}
		return this.geo.snap0(y - p[1]) == 0;
	}
	,toLine: function() {
		var p0 = this.p0;
		var p1 = this.p1;
		var p2 = this.p2;
		var p3 = this.p3;
		if(this.geo.snap0(p0[0] - p1[0]) == 0 && this.geo.snap0(p0[0] - p2[0]) == 0 && this.geo.snap0(p0[0] - p3[0]) == 0 || this.geo.snap0(p0[1] - p1[1]) == 0 && this.geo.snap0(p0[1] - p2[1]) == 0 && this.geo.snap0(p0[1] - p3[1]) == 0) {
			return new polyboolhx_SegmentLine(p0,p3,this.geo);
		}
		return null;
	}
	,draw: function(ctx) {
		var p0 = this.p0;
		var p1 = this.p1;
		var p2 = this.p2;
		var p3 = this.p3;
		ctx.moveTo(p0[0],p0[1]);
		ctx.bezierCurveTo(p1[0],p1[1],p2[0],p2[1],p3[0],p3[1]);
		return ctx;
	}
	,__class__: polyboolhx_SegmentCurve
});
var polyboolhx_SegmentUtils = function() { };
polyboolhx_SegmentUtils.__name__ = "polyboolhx.SegmentUtils";
polyboolhx_SegmentUtils.projectPointOntoSegmentLine = function(p,seg) {
	var dx = seg.p1[0] - seg.p0[0];
	var dy = seg.p1[1] - seg.p0[1];
	var px = p[0] - seg.p0[0];
	var py = p[1] - seg.p0[1];
	var dist = dx * dx + dy * dy;
	var dot = px * dx + py * dy;
	return dot / dist;
};
polyboolhx_SegmentUtils.segmentLineIntersectSegmentLine = function(segA,segB,allowOutOfRange) {
	var geo = segA.geo;
	var a0 = segA.p0;
	var a1 = segA.p1;
	var b0 = segB.p0;
	var b1 = segB.p1;
	var adx = a1[0] - a0[0];
	var ady = a1[1] - a0[1];
	var bdx = b1[0] - b0[0];
	var bdy = b1[1] - b0[1];
	var axb = adx * bdy - ady * bdx;
	if(geo.snap0(axb) == 0) {
		if(!geo.isCollinear(a0,a1,b0)) {
			return null;
		}
		var tB0onA = polyboolhx_SegmentUtils.projectPointOntoSegmentLine(segB.p0,segA);
		var tB1onA = polyboolhx_SegmentUtils.projectPointOntoSegmentLine(segB.p1,segA);
		var tAMin = geo.snap01(Math.min(tB0onA,tB1onA));
		var tAMax = geo.snap01(Math.max(tB0onA,tB1onA));
		if(tAMax < 0 || tAMin > 1) {
			return null;
		}
		var tA0onB = polyboolhx_SegmentUtils.projectPointOntoSegmentLine(segA.p0,segB);
		var tA1onB = polyboolhx_SegmentUtils.projectPointOntoSegmentLine(segA.p1,segB);
		var tBMin = geo.snap01(Math.min(tA0onB,tA1onB));
		var tBMax = geo.snap01(Math.max(tA0onB,tA1onB));
		if(tBMax < 0 || tBMin > 1) {
			return null;
		}
		return new polyboolhx_SegmentTRangePairs([Math.max(0,tAMin),Math.max(0,tBMin)],[Math.min(1,tAMax),Math.min(1,tBMax)]);
	}
	var dx = a0[0] - b0[0];
	var dy = a0[1] - b0[1];
	return new polyboolhx_SegmentTValuePairsBuilder(allowOutOfRange,geo).add((bdx * dy - bdy * dx) / axb,(adx * dy - ady * dx) / axb).done();
};
polyboolhx_SegmentUtils.segmentLineIntersectSegmentCurve = function(segA,segB,allowOutOfRange,invert) {
	var geo = segA.geo;
	var a0 = segA.p0;
	var a1 = segA.p1;
	var A = a1[1] - a0[1];
	var B = a0[0] - a1[0];
	if(geo.snap0(B) == 0) {
		var t = segB.mapXtoT(a0[0],false);
		if(t == null) {
			return null;
		}
		var y = segB.point(t)[1];
		var s = (y - a0[1]) / A;
		var result = new polyboolhx_SegmentTValuePairsBuilder(allowOutOfRange,geo);
		if(invert) {
			result.add(t,s);
		} else {
			result.add(s,t);
		}
		return result.done();
	}
	var C = A * a0[0] + B * a0[1];
	var bx = segB.getCubicCoefficients(0);
	var by = segB.getCubicCoefficients(1);
	var rA = A * bx[0] + B * by[0];
	var rB = A * bx[1] + B * by[1];
	var rC = A * bx[2] + B * by[2];
	var rD = A * bx[3] + B * by[3] - C;
	var roots = geo.solveCubic(rA,rB,rC,rD);
	var result = new polyboolhx_SegmentTValuePairsBuilder(allowOutOfRange,geo);
	if(geo.snap0(A) == 0) {
		var _g = 0;
		while(_g < roots.length) {
			var t = roots[_g];
			++_g;
			var X = bx[0] * t * t * t + bx[1] * t * t + bx[2] * t + bx[3];
			var s = (a0[0] - X) / B;
			if(invert) {
				result.add(t,s);
			} else {
				result.add(s,t);
			}
		}
	} else {
		var _g = 0;
		while(_g < roots.length) {
			var t = roots[_g];
			++_g;
			var Y = by[0] * t * t * t + by[1] * t * t + by[2] * t + by[3];
			var s = (Y - a0[1]) / A;
			if(invert) {
				result.add(t,s);
			} else {
				result.add(s,t);
			}
		}
	}
	return result.done();
};
polyboolhx_SegmentUtils.segmentCurveIntersectSegmentCurve = function(segA,segB,allowOutOfRange) {
	var geo = segA.geo;
	if(geo.isEqualVec2(segA.p0,segB.p0)) {
		if(geo.isEqualVec2(segA.p3,segB.p3)) {
			if(geo.isEqualVec2(segA.p1,segB.p1) && geo.isEqualVec2(segA.p2,segB.p2)) {
				return new polyboolhx_SegmentTRangePairs([0,0],[1,1]);
			} else {
				return new polyboolhx_SegmentTValuePairs([[0,0],[1,1]]);
			}
		} else {
			return new polyboolhx_SegmentTValuePairs([[0,0]]);
		}
	} else if(geo.isEqualVec2(segA.p0,segB.p3)) {
		return new polyboolhx_SegmentTValuePairs([[0,1]]);
	} else if(geo.isEqualVec2(segA.p3,segB.p0)) {
		return new polyboolhx_SegmentTValuePairs([[1,0]]);
	} else if(geo.isEqualVec2(segA.p3,segB.p3)) {
		return new polyboolhx_SegmentTValuePairs([[1,1]]);
	}
	var result = new polyboolhx_SegmentTValuePairsBuilder(allowOutOfRange,geo);
	var checkCurves = null;
	checkCurves = function(c1,t1L,t1R,c2,t2L,t2R) {
		var bbox1 = c1.boundingBox();
		var bbox2 = c2.boundingBox();
		if(!polyboolhx_GeometryUtils.boundingBoxesIntersect(bbox1,bbox2)) {
			return;
		}
		var t1M = (t1L + t1R) / 2;
		var t2M = (t2L + t2R) / 2;
		if(geo.snap0(t1R - t1L) == 0 && geo.snap0(t2R - t2L) == 0) {
			result.add(t1M,t2M);
			return;
		}
		var c1Sides = c1.split([0.5]);
		var c1L = c1Sides[0];
		var c1R = c1Sides[1];
		var c2Sides = c2.split([0.5]);
		var c2L = c2Sides[0];
		var c2R = c2Sides[1];
		checkCurves(c1L,t1L,t1M,c2L,t2L,t2M);
		checkCurves(c1R,t1M,t1R,c2L,t2L,t2M);
		checkCurves(c1L,t1L,t1M,c2R,t2M,t2R);
		checkCurves(c1R,t1M,t1R,c2R,t2M,t2R);
	};
	checkCurves(segA,0,1,segB,0,1);
	return result.done();
};
polyboolhx_SegmentUtils.segmentsIntersect = function(segA,segB,allowOutOfRange) {
	if(((segA) instanceof polyboolhx_SegmentLine)) {
		if(((segB) instanceof polyboolhx_SegmentLine)) {
			return polyboolhx_SegmentUtils.segmentLineIntersectSegmentLine(segA,segB,allowOutOfRange);
		} else if(((segB) instanceof polyboolhx_SegmentCurve)) {
			return polyboolhx_SegmentUtils.segmentLineIntersectSegmentCurve(segA,segB,allowOutOfRange,false);
		}
	} else if(((segA) instanceof polyboolhx_SegmentCurve)) {
		if(((segB) instanceof polyboolhx_SegmentLine)) {
			return polyboolhx_SegmentUtils.segmentLineIntersectSegmentCurve(segB,segA,allowOutOfRange,true);
		} else if(((segB) instanceof polyboolhx_SegmentCurve)) {
			return polyboolhx_SegmentUtils.segmentCurveIntersectSegmentCurve(segA,segB,allowOutOfRange);
		}
	}
	throw new haxe_Exception("PolyBool: Unknown segment instance in segmentsIntersect");
};
polyboolhx_SegmentUtils.reverse = function(seg) {
	if(((seg) instanceof polyboolhx_SegmentLine)) {
		return (js_Boot.__cast(seg , polyboolhx_SegmentLine)).reverse();
	} else {
		return (js_Boot.__cast(seg , polyboolhx_SegmentCurve)).reverse();
	}
};
var polyboolhx_SegmentChainerUtils = function() { };
polyboolhx_SegmentChainerUtils.__name__ = "polyboolhx.SegmentChainerUtils";
polyboolhx_SegmentChainerUtils.joinLines = function(seg1,seg2,geo) {
	if(geo.isCollinear(seg1.p0,seg1.p1,seg2.p1)) {
		return new polyboolhx_SegmentLine(seg1.p0,seg2.p1,geo);
	}
	return null;
};
polyboolhx_SegmentChainerUtils.joinCurves = function(seg1,seg2,geo) {
	if(geo.isCollinear(seg1.p2,seg1.p3,seg2.p1)) {
		var dx = seg2.p1[0] - seg1.p2[0];
		var dy = seg2.p1[1] - seg1.p2[1];
		var t = Math.abs(dx) > Math.abs(dy) ? (seg1.p3[0] - seg1.p2[0]) / dx : (seg1.p3[1] - seg1.p2[1]) / dy;
		var ts = geo.snap01(t);
		if(ts != 0 && ts != 1) {
			var ns = new polyboolhx_SegmentCurve(seg1.p0,[seg1.p0[0] + (seg1.p1[0] - seg1.p0[0]) / t,seg1.p0[1] + (seg1.p1[1] - seg1.p0[1]) / t],[seg2.p2[0] - t * (seg2.p3[0] - seg2.p2[0]) / (1 - t),seg2.p2[1] - t * (seg2.p3[1] - seg2.p2[1]) / (1 - t)],seg2.p3,geo);
			var split = ns.split([t]);
			var left = split[0];
			var right = split[1];
			if(left.isEqual(seg1) && right.isEqual(seg2)) {
				return ns;
			}
		}
	}
	return null;
};
polyboolhx_SegmentChainerUtils.joinSegments = function(seg1,seg2,geo) {
	if(seg1 == seg2) {
		return null;
	}
	if(((seg1) instanceof polyboolhx_SegmentLine) && ((seg2) instanceof polyboolhx_SegmentLine)) {
		return polyboolhx_SegmentChainerUtils.joinLines(seg1,seg2,geo);
	}
	if(((seg1) instanceof polyboolhx_SegmentCurve) && ((seg2) instanceof polyboolhx_SegmentCurve)) {
		return polyboolhx_SegmentChainerUtils.joinCurves(seg1,seg2,geo);
	}
	return null;
};
polyboolhx_SegmentChainerUtils.segmentsToReceiver = function(segments,geo,receiver,matrix) {
	var a = matrix[0];
	var b = matrix[1];
	var c = matrix[2];
	var d = matrix[3];
	var e = matrix[4];
	var f = matrix[5];
	receiver.beginPath();
	var _g = 0;
	while(_g < segments.length) {
		var region = segments[_g];
		++_g;
		if(region.length <= 0) {
			continue;
		}
		var _g1 = 0;
		var _g2 = region.length;
		while(_g1 < _g2) {
			var i = _g1++;
			var seg = region[i];
			if(i == 0) {
				var p0x = seg.start()[0];
				var p0y = seg.start()[1];
				receiver.moveTo(a * p0x + c * p0y + e,b * p0x + d * p0y + f);
			}
			if(((seg) instanceof polyboolhx_SegmentLine)) {
				var line = js_Boot.__cast(seg , polyboolhx_SegmentLine);
				var p1x = line.p1[0];
				var p1y = line.p1[1];
				receiver.lineTo(a * p1x + c * p1y + e,b * p1x + d * p1y + f);
			} else if(((seg) instanceof polyboolhx_SegmentCurve)) {
				var curve = js_Boot.__cast(seg , polyboolhx_SegmentCurve);
				var p1x1 = curve.p1[0];
				var p1y1 = curve.p1[1];
				var p2x = curve.p2[0];
				var p2y = curve.p2[1];
				var p3x = curve.p3[0];
				var p3y = curve.p3[1];
				receiver.bezierCurveTo(a * p1x1 + c * p1y1 + e,b * p1x1 + d * p1y1 + f,a * p2x + c * p2y + e,b * p2x + d * p2y + f,a * p3x + c * p3y + e,b * p3x + d * p3y + f);
			} else {
				throw new haxe_Exception("PolyBool: Unknown segment instance");
			}
		}
		var first = region[0];
		var last = region[region.length - 1];
		if(geo.isEqualVec2(first.start(),last.end())) {
			receiver.closePath();
		}
	}
	return receiver;
};
var polyboolhx_SegmentChainer = function() { };
polyboolhx_SegmentChainer.__name__ = "polyboolhx.SegmentChainer";
polyboolhx_SegmentChainer.chain = function(segments,geo) {
	var closedChains = [];
	var openChains = [];
	var regions = [];
	var _g = 0;
	while(_g < segments.length) {
		var segb = segments[_g];
		++_g;
		var seg = [segb.data];
		var closed = [segb.closed];
		var chains = [closed[0] ? closedChains : openChains];
		var pt1 = seg[0].start();
		var pt2 = seg[0].end();
		var reverseChain = (function(chains,closed) {
			return function(index) {
				polyboolhx_BuildLog.log.chainReverse(index,closed[0]);
				var newChain = [];
				var _g = 0;
				var _g1 = chains[0][index].segs;
				while(_g < _g1.length) {
					var seg = _g1[_g];
					++_g;
					newChain.unshift(polyboolhx_SegmentUtils.reverse(seg));
				}
				chains[0][index] = { segs : newChain, fill : !chains[0][index].fill};
				return newChain;
			};
		})(chains,closed);
		if(((seg[0]) instanceof polyboolhx_SegmentLine) && geo.isEqualVec2(pt1,pt2)) {
			polyboolhx_BuildLog.log.info("PolyBool: Warning: Zero-length segment detected; your epsilon is " + "probably too small or too large");
			continue;
		}
		polyboolhx_BuildLog.log.chainStart({ seg : seg[0], fill : segb.myFill.above == true},closed[0]);
		var firstMatch = [{ index : 0, matchesHead : false, matchesPt1 : false}];
		var secondMatch = [{ index : 0, matchesHead : false, matchesPt1 : false}];
		var nextMatch = [firstMatch[0]];
		var setMatch = (function(nextMatch,secondMatch,firstMatch) {
			return function(index,matchesHead,matchesPt1) {
				if(nextMatch[0] != null) {
					nextMatch[0].index = index;
					nextMatch[0].matchesHead = matchesHead;
					nextMatch[0].matchesPt1 = matchesPt1;
				}
				if(nextMatch[0] == firstMatch[0]) {
					nextMatch[0] = secondMatch[0];
					return false;
				}
				nextMatch[0] = null;
				return true;
			};
		})(nextMatch,secondMatch,firstMatch);
		var _g1 = 0;
		var _g2 = chains[0].length;
		while(_g1 < _g2) {
			var i = _g1++;
			var chain = chains[0][i].segs;
			var head = chain[0].start();
			var tail = chain[chain.length - 1].end();
			if(geo.isEqualVec2(head,pt1)) {
				if(setMatch(i,true,true)) {
					break;
				}
			} else if(geo.isEqualVec2(head,pt2)) {
				if(setMatch(i,true,false)) {
					break;
				}
			} else if(geo.isEqualVec2(tail,pt1)) {
				if(setMatch(i,false,true)) {
					break;
				}
			} else if(geo.isEqualVec2(tail,pt2)) {
				if(setMatch(i,false,false)) {
					break;
				}
			}
		}
		if(nextMatch[0] == firstMatch[0]) {
			var fill = segb.myFill.above == true;
			chains[0].push({ segs : [seg[0]], fill : fill});
			polyboolhx_BuildLog.log.chainNew({ seg : seg[0], fill : fill},closed[0]);
		} else if(nextMatch[0] == secondMatch[0]) {
			var index = firstMatch[0].index;
			polyboolhx_BuildLog.log.chainMatch(index,closed[0]);
			var chain1 = chains[0][index].segs;
			var fill1 = chains[0][index].fill;
			if(firstMatch[0].matchesHead) {
				if(firstMatch[0].matchesPt1) {
					seg[0] = polyboolhx_SegmentUtils.reverse(seg[0]);
					polyboolhx_BuildLog.log.chainAddHead(index,{ seg : seg[0], fill : fill1},closed[0]);
					chain1.unshift(seg[0]);
				} else {
					polyboolhx_BuildLog.log.chainAddHead(index,{ seg : seg[0], fill : fill1},closed[0]);
					chain1.unshift(seg[0]);
				}
			} else if(firstMatch[0].matchesPt1) {
				polyboolhx_BuildLog.log.chainAddTail(index,{ seg : seg[0], fill : fill1},closed[0]);
				chain1.push(seg[0]);
			} else {
				seg[0] = polyboolhx_SegmentUtils.reverse(seg[0]);
				polyboolhx_BuildLog.log.chainAddTail(index,{ seg : seg[0], fill : fill1},closed[0]);
				chain1.push(seg[0]);
			}
			if(firstMatch[0].matchesHead) {
				var next = chain1[1];
				var newSeg = polyboolhx_SegmentChainerUtils.joinSegments(seg[0],next,geo);
				if(newSeg != null) {
					chain1.shift();
					chain1[0] = newSeg;
					polyboolhx_BuildLog.log.chainSimplifyHead(index,{ seg : newSeg, fill : fill1},closed[0]);
				}
			} else {
				var next1 = chain1[chain1.length - 2];
				var newSeg1 = polyboolhx_SegmentChainerUtils.joinSegments(next1,seg[0],geo);
				if(newSeg1 != null) {
					chain1.pop();
					chain1[chain1.length - 1] = newSeg1;
					polyboolhx_BuildLog.log.chainSimplifyTail(index,{ seg : newSeg1, fill : fill1},closed[0]);
				}
			}
			if(closed[0]) {
				var finalChain = chain1;
				var segS = finalChain[0];
				var segE = finalChain[finalChain.length - 1];
				if(finalChain.length > 0 && geo.isEqualVec2(segS.start(),segE.end())) {
					var winding = 0;
					var last = finalChain[0].start();
					var _g3 = 0;
					while(_g3 < finalChain.length) {
						var seg1 = finalChain[_g3];
						++_g3;
						var here = seg1.end();
						winding += here[1] * last[0] - here[0] * last[1];
						last = here;
					}
					var isClockwise = winding < 0;
					if(isClockwise == fill1) {
						finalChain = reverseChain(index);
						segS = finalChain[0];
						segE = finalChain[finalChain.length - 1];
					}
					var newStart = polyboolhx_SegmentChainerUtils.joinSegments(segE,segS,geo);
					if(newStart != null) {
						finalChain.pop();
						finalChain[0] = newStart;
						polyboolhx_BuildLog.log.chainSimplifyClose(index,{ seg : newStart, fill : fill1},closed[0]);
					}
					polyboolhx_BuildLog.log.chainClose(index,closed[0]);
					chains[0].splice(index,1);
					regions.push(finalChain);
				}
			}
		} else {
			var appendChain = (function(chains,closed,seg) {
				return function(index1,index2) {
					var chain1 = chains[0][index1].segs;
					var fill = chains[0][index1].fill;
					var chain2 = chains[0][index2].segs;
					polyboolhx_BuildLog.log.chainAddTail(index1,{ seg : seg[0], fill : fill},closed[0]);
					chain1.push(seg[0]);
					var next = chain1[chain1.length - 2];
					var newEnd = polyboolhx_SegmentChainerUtils.joinSegments(next,seg[0],geo);
					if(newEnd != null) {
						chain1.pop();
						chain1[chain1.length - 1] = newEnd;
						polyboolhx_BuildLog.log.chainSimplifyTail(index1,{ seg : newEnd, fill : fill},closed[0]);
					}
					var tail = chain1[chain1.length - 1];
					var head = chain2[0];
					var newJoin = polyboolhx_SegmentChainerUtils.joinSegments(tail,head,geo);
					if(newJoin != null) {
						chain2.shift();
						chain1[chain1.length - 1] = newJoin;
						polyboolhx_BuildLog.log.chainSimplifyJoin(index1,index2,{ seg : newJoin, fill : fill},closed[0]);
					}
					polyboolhx_BuildLog.log.chainJoin(index1,index2,closed[0]);
					chains[0][index1].segs = chain1.concat(chain2);
					return chains[0].splice(index2,1);
				};
			})(chains,closed,seg);
			var F = firstMatch[0].index;
			var S = secondMatch[0].index;
			polyboolhx_BuildLog.log.chainConnect(F,S,closed[0]);
			var reverseF = chains[0][F].segs.length < chains[0][S].segs.length;
			if(firstMatch[0].matchesHead) {
				if(secondMatch[0].matchesHead) {
					if(reverseF) {
						if(!firstMatch[0].matchesPt1) {
							seg[0] = polyboolhx_SegmentUtils.reverse(seg[0]);
						}
						reverseChain(F);
						appendChain(F,S);
					} else {
						if(firstMatch[0].matchesPt1) {
							seg[0] = polyboolhx_SegmentUtils.reverse(seg[0]);
						}
						reverseChain(S);
						appendChain(S,F);
					}
				} else {
					if(firstMatch[0].matchesPt1) {
						seg[0] = polyboolhx_SegmentUtils.reverse(seg[0]);
					}
					appendChain(S,F);
				}
			} else if(secondMatch[0].matchesHead) {
				if(!firstMatch[0].matchesPt1) {
					seg[0] = polyboolhx_SegmentUtils.reverse(seg[0]);
				}
				appendChain(F,S);
			} else if(reverseF) {
				if(firstMatch[0].matchesPt1) {
					seg[0] = polyboolhx_SegmentUtils.reverse(seg[0]);
				}
				reverseChain(F);
				appendChain(S,F);
			} else {
				if(!firstMatch[0].matchesPt1) {
					seg[0] = polyboolhx_SegmentUtils.reverse(seg[0]);
				}
				reverseChain(S);
				appendChain(F,S);
			}
		}
	}
	var _g = 0;
	while(_g < openChains.length) {
		var chain = openChains[_g];
		++_g;
		regions.push(chain.segs);
	}
	return regions;
};
var polyboolhx_SegmentSelector = function() { };
polyboolhx_SegmentSelector.__name__ = "polyboolhx.SegmentSelector";
polyboolhx_SegmentSelector.union = function(segments) {
	return polyboolhx_SegmentSelector.select(segments,[4,2,1,0,2,2,0,0,1,0,1,0,0,0,0,0]);
};
polyboolhx_SegmentSelector.intersect = function(segments) {
	return polyboolhx_SegmentSelector.select(segments,[0,0,0,4,0,2,0,2,0,0,1,1,4,2,1,0]);
};
polyboolhx_SegmentSelector.difference = function(segments) {
	return polyboolhx_SegmentSelector.select(segments,[4,0,0,0,2,0,2,0,1,1,0,0,0,1,2,0]);
};
polyboolhx_SegmentSelector.differenceRev = function(segments) {
	return polyboolhx_SegmentSelector.select(segments,[4,2,1,0,0,0,1,1,0,2,0,2,0,0,0,0]);
};
polyboolhx_SegmentSelector.xor = function(segments) {
	return polyboolhx_SegmentSelector.select(segments,[4,2,1,0,2,0,0,1,1,0,0,2,0,1,2,0]);
};
polyboolhx_SegmentSelector.select = function(segments,selection) {
	var result = [];
	var _g = 0;
	while(_g < segments.length) {
		var seg = segments[_g];
		++_g;
		var index = (seg.myFill.above ? 8 : 0) + (seg.myFill.below ? 4 : 0) + (seg.otherFill != null && seg.otherFill.above == true ? 2 : 0) + (seg.otherFill != null && seg.otherFill.below == true ? 1 : 0);
		var flags = selection[index];
		var above = (flags & 1) != 0;
		var below = (flags & 2) != 0;
		if(!seg.closed && flags != 0 || seg.closed && above != below) {
			var fill = { above : above, below : below};
			result.push(new polyboolhx_SegmentBool(seg.data,fill,seg.closed));
		}
	}
	polyboolhx_BuildLog.log.selected(result);
	return result;
};
var polyboolhx_Shape = function(geo,segments) {
	this.matrix = [1,0,0,1,0,0];
	this.saveStack = [];
	this.pathState = { kind : "beginPath"};
	this.geo = geo;
	if(segments != null) {
		this.resultState = { state : "seg", segments : segments};
	} else {
		this.resultState = { state : "new", selfIntersect : new polyboolhx_Intersector(true,this.geo)};
	}
};
polyboolhx_Shape.__name__ = "polyboolhx.Shape";
polyboolhx_Shape.prototype = {
	geo: null
	,pathState: null
	,resultState: null
	,saveStack: null
	,matrix: null
	,setTransform: function(a,b,c,d,e,f) {
		if(this.resultState.state != "new") {
			throw new haxe_Exception("PolyBool: Cannot change shape after using it in an operation");
		}
		this.matrix = [a,b,c,d,e,f];
		return this;
	}
	,resetTransform: function() {
		this.matrix = [1,0,0,1,0,0];
		return this;
	}
	,getTransform: function() {
		if(this.resultState.state != "new") {
			throw new haxe_Exception("PolyBool: Cannot change shape after using it in an operation");
		}
		return this.matrix;
	}
	,transform: function(a,b,c,d,e,f) {
		var a0 = this.matrix[0];
		var b0 = this.matrix[1];
		var c0 = this.matrix[2];
		var d0 = this.matrix[3];
		var e0 = this.matrix[4];
		var f0 = this.matrix[5];
		this.matrix = [a0 * a + c0 * b,b0 * a + d0 * b,a0 * c + c0 * d,b0 * c + d0 * d,a0 * e + c0 * f + e0,b0 * e + d0 * f + f0];
		return this;
	}
	,rotate: function(angle) {
		var cos = Math.cos(angle);
		var sin = Math.sin(angle);
		var a0 = this.matrix[0];
		var b0 = this.matrix[1];
		var c0 = this.matrix[2];
		var d0 = this.matrix[3];
		var e0 = this.matrix[4];
		var f0 = this.matrix[5];
		this.matrix = [a0 * cos + c0 * sin,b0 * cos + d0 * sin,c0 * cos - a0 * sin,d0 * cos - b0 * sin,e0,f0];
		return this;
	}
	,rotateDeg: function(angle) {
		var sqrt1_2 = Math.sqrt(0.5);
		var ang = (angle % 360 + 360) % 360;
		if(ang == 0) {
			return this;
		}
		var cos = 0;
		var sin = 0;
		if(ang == 90) {
			sin = 1;
		} else if(ang == 180) {
			cos = -1;
		} else if(ang == 270) {
			sin = -1;
		} else if(ang == 45) {
			sin = sqrt1_2;
			cos = sin;
		} else if(ang == 135) {
			sin = sqrt1_2;
			cos = -sqrt1_2;
		} else if(ang == 225) {
			sin = -sqrt1_2;
			cos = sin;
		} else if(ang == 315) {
			cos = sqrt1_2;
			sin = -sqrt1_2;
		} else if(ang == 30) {
			cos = Math.sqrt(3) / 2;
			sin = 0.5;
		} else if(ang == 60) {
			cos = 0.5;
			sin = Math.sqrt(3) / 2;
		} else if(ang == 120) {
			cos = -0.5;
			sin = Math.sqrt(3) / 2;
		} else if(ang == 150) {
			cos = -Math.sqrt(3) / 2;
			sin = 0.5;
		} else if(ang == 210) {
			cos = -Math.sqrt(3) / 2;
			sin = -0.5;
		} else if(ang == 240) {
			cos = -0.5;
			sin = -Math.sqrt(3) / 2;
		} else if(ang == 300) {
			cos = 0.5;
			sin = -Math.sqrt(3) / 2;
		} else if(ang == 330) {
			cos = Math.sqrt(3) / 2;
			sin = -0.5;
		} else {
			var rad = Math.PI * ang / 180;
			cos = Math.cos(rad);
			sin = Math.sin(rad);
		}
		var a0 = this.matrix[0];
		var b0 = this.matrix[1];
		var c0 = this.matrix[2];
		var d0 = this.matrix[3];
		var e0 = this.matrix[4];
		var f0 = this.matrix[5];
		this.matrix = [a0 * cos + c0 * sin,b0 * cos + d0 * sin,c0 * cos - a0 * sin,d0 * cos - b0 * sin,e0,f0];
		return this;
	}
	,scale: function(sx,sy) {
		var a0 = this.matrix[0];
		var b0 = this.matrix[1];
		var c0 = this.matrix[2];
		var d0 = this.matrix[3];
		var e0 = this.matrix[4];
		var f0 = this.matrix[5];
		this.matrix = [a0 * sx,b0 * sx,c0 * sy,d0 * sy,e0,f0];
		return this;
	}
	,translate: function(tx,ty) {
		var a0 = this.matrix[0];
		var b0 = this.matrix[1];
		var c0 = this.matrix[2];
		var d0 = this.matrix[3];
		var e0 = this.matrix[4];
		var f0 = this.matrix[5];
		this.matrix = [a0,b0,c0,d0,a0 * tx + c0 * ty + e0,b0 * tx + d0 * ty + f0];
		return this;
	}
	,save: function() {
		if(this.resultState.state != "new") {
			throw new haxe_Exception("PolyBool: Cannot change shape after using it in an operation");
		}
		this.saveStack.push({ matrix : this.matrix});
		return this;
	}
	,restore: function() {
		if(this.resultState.state != "new") {
			throw new haxe_Exception("PolyBool: Cannot change shape after using it in an operation");
		}
		var s = this.saveStack.pop();
		if(s != null) {
			this.matrix = s.matrix;
		}
		return this;
	}
	,transformPoint: function(x,y) {
		var a = this.matrix[0];
		var b = this.matrix[1];
		var c = this.matrix[2];
		var d = this.matrix[3];
		var e = this.matrix[4];
		var f = this.matrix[5];
		return [a * x + c * y + e,b * x + d * y + f];
	}
	,beginPath: function() {
		if(this.resultState.state != "new") {
			throw new haxe_Exception("PolyBool: Cannot change shape after using it in an operation");
		}
		this.resultState.selfIntersect.beginPath();
		return this.endPath();
	}
	,moveTo: function(x,y) {
		if(this.resultState.state != "new") {
			throw new haxe_Exception("PolyBool: Cannot change shape after using it in an operation");
		}
		if(this.pathState.kind != "beginPath") {
			this.beginPath();
		}
		var current = this.transformPoint(x,y);
		this.pathState = { kind : "moveTo", start : current, current : current};
		return this;
	}
	,lineTo: function(x,y) {
		if(this.resultState.state != "new") {
			throw new haxe_Exception("PolyBool: Cannot change shape after using it in an operation");
		}
		if(this.pathState.kind != "moveTo") {
			throw new haxe_Exception("PolyBool: Must call moveTo prior to calling lineTo");
		}
		var current = this.transformPoint(x,y);
		this.resultState.selfIntersect.addLine(this.pathState.current,current);
		this.pathState.current = current;
		return this;
	}
	,rect: function(x,y,width,height) {
		return this.moveTo(x,y).lineTo(x + width,y).lineTo(x + width,y + height).lineTo(x,y + height).closePath().moveTo(x,y);
	}
	,bezierCurveTo: function(cp1x,cp1y,cp2x,cp2y,x,y) {
		if(this.resultState.state != "new") {
			throw new haxe_Exception("PolyBool: Cannot change shape after using it in an operation");
		}
		if(this.pathState.kind != "moveTo") {
			throw new haxe_Exception("PolyBool: Must call moveTo prior to calling bezierCurveTo");
		}
		var current = this.transformPoint(x,y);
		this.resultState.selfIntersect.addCurve(this.pathState.current,this.transformPoint(cp1x,cp1y),this.transformPoint(cp2x,cp2y),current);
		this.pathState.current = current;
		return this;
	}
	,closePath: function() {
		if(this.resultState.state != "new") {
			throw new haxe_Exception("PolyBool: Cannot change shape after using it in an operation");
		}
		if(this.pathState.kind == "moveTo" && !this.geo.isEqualVec2(this.pathState.start,this.pathState.current)) {
			this.resultState.selfIntersect.addLine(this.pathState.current,this.pathState.start);
			this.pathState.current = this.pathState.start;
		}
		this.resultState.selfIntersect.closePath();
		return this.endPath();
	}
	,endPath: function() {
		if(this.resultState.state != "new") {
			throw new haxe_Exception("PolyBool: Cannot change shape after using it in an operation");
		}
		this.pathState = { kind : "beginPath"};
		return this;
	}
	,selfIntersect: function() {
		if(this.resultState.state == "new") {
			this.resultState = { state : "seg", segments : this.resultState.selfIntersect.calculate()};
		}
		return this.resultState.segments;
	}
	,segments: function() {
		if(this.resultState.state != "reg") {
			var segs = this.selfIntersect();
			this.resultState = { state : "reg", segments : segs, regions : polyboolhx_SegmentChainer.chain(segs,this.geo)};
		}
		return this.resultState.regions;
	}
	,output: function(receiver,matrix) {
		if(matrix == null) {
			matrix = [1,0,0,1,0,0];
		}
		return polyboolhx_SegmentChainerUtils.segmentsToReceiver(this.segments(),this.geo,receiver,matrix);
	}
	,combine: function(shape) {
		var int = new polyboolhx_Intersector(false,this.geo);
		var _g = 0;
		var _g1 = this.selfIntersect();
		while(_g < _g1.length) {
			var seg = _g1[_g];
			++_g;
			int.addSegment(polyboolhx_IntersectorUtils.copySegmentBool(seg),true);
		}
		var _g = 0;
		var _g1 = shape.selfIntersect();
		while(_g < _g1.length) {
			var seg = _g1[_g];
			++_g;
			int.addSegment(polyboolhx_IntersectorUtils.copySegmentBool(seg),false);
		}
		return new polyboolhx_ShapeCombined(int.calculate(),this.geo);
	}
	,__class__: polyboolhx_Shape
};
var polyboolhx_ShapeCombined = function(segments,geo) {
	this.geo = geo;
	this.segments = segments;
};
polyboolhx_ShapeCombined.__name__ = "polyboolhx.ShapeCombined";
polyboolhx_ShapeCombined.prototype = {
	geo: null
	,segments: null
	,union: function() {
		return new polyboolhx_Shape(this.geo,polyboolhx_SegmentSelector.union(this.segments));
	}
	,intersect: function() {
		return new polyboolhx_Shape(this.geo,polyboolhx_SegmentSelector.intersect(this.segments));
	}
	,difference: function() {
		return new polyboolhx_Shape(this.geo,polyboolhx_SegmentSelector.difference(this.segments));
	}
	,differenceRev: function() {
		return new polyboolhx_Shape(this.geo,polyboolhx_SegmentSelector.differenceRev(this.segments));
	}
	,xor: function() {
		return new polyboolhx_Shape(this.geo,polyboolhx_SegmentSelector.xor(this.segments));
	}
	,__class__: polyboolhx_ShapeCombined
};
if(typeof(performance) != "undefined" ? typeof(performance.now) == "function" : false) {
	HxOverrides.now = performance.now.bind(performance);
}
if( String.fromCodePoint == null ) String.fromCodePoint = function(c) { return c < 0x10000 ? String.fromCharCode(c) : String.fromCharCode((c>>10)+0xD7C0)+String.fromCharCode((c&0x3FF)+0xDC00); }
String.prototype.__class__ = String;
String.__name__ = "String";
Array.__name__ = "Array";
Date.prototype.__class__ = Date;
Date.__name__ = "Date";
var Int = { };
var Dynamic = { };
var Float = Number;
var Bool = Boolean;
var Class = { };
var Enum = { };
js_Boot.__toStr = ({ }).toString;
DateTools.DAY_SHORT_NAMES = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
DateTools.DAY_NAMES = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
DateTools.MONTH_SHORT_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
DateTools.MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];
polyboolhx_BuildLog.log = new polyboolhx_NullBuildLog();
polyboolhx_PolyboolTest.triangle1 = { regions : [[[0.0,0.0],[5.0,10.0],[10.0,0.0]]], inverted : false};
polyboolhx_PolyboolTest.triangle2 = { regions : [[[5.0,0.0],[10.0,10.0],[15.0,0.0]]], inverted : false};
polyboolhx_PolyboolTest.box1 = { regions : [[[0.0,0.0],[5.0,0.0],[5.0,-5.0],[0.0,-5.0]]], inverted : false};
polyboolhx_PolyboolTest.curve1 = { regions : [[[0.0,0.0],[0.0,-5.0,10.0,-5.0,10.0,0.0]]], inverted : false};
polyboolhx_PolyboolTest.main();
})(typeof window != "undefined" ? window : typeof global != "undefined" ? global : typeof self != "undefined" ? self : this);

//# sourceMappingURL=polybool.js.map