(function ($global) { "use strict";
var $estr = function() { return js_Boot.__string_rec(this,''); },$hxEnums = $hxEnums || {},$_;
function $extend(from, fields) {
	var proto = Object.create(from);
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
Math.__name__ = true;
var Std = function() { };
Std.__name__ = true;
Std.string = function(s) {
	return js_Boot.__string_rec(s,"");
};
var haxe_IMap = function() { };
haxe_IMap.__name__ = true;
haxe_IMap.__isInterface__ = true;
var haxe_Exception = function(message,previous,native) {
	Error.call(this,message);
	this.message = message;
	this.__previousException = previous;
	this.__nativeException = native != null ? native : this;
};
haxe_Exception.__name__ = true;
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
	unwrap: function() {
		return this.__nativeException;
	}
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
});
var haxe_ValueException = function(value,previous,native) {
	haxe_Exception.call(this,String(value),previous,native);
	this.value = value;
};
haxe_ValueException.__name__ = true;
haxe_ValueException.__super__ = haxe_Exception;
haxe_ValueException.prototype = $extend(haxe_Exception.prototype,{
	unwrap: function() {
		return this.value;
	}
	,__class__: haxe_ValueException
});
var haxe_ds_StringMap = function() {
	this.h = Object.create(null);
};
haxe_ds_StringMap.__name__ = true;
haxe_ds_StringMap.__interfaces__ = [haxe_IMap];
haxe_ds_StringMap.prototype = {
	__class__: haxe_ds_StringMap
};
var haxe_exceptions_PosException = function(message,previous,pos) {
	haxe_Exception.call(this,message,previous);
	if(pos == null) {
		this.posInfos = { fileName : "(unknown)", lineNumber : 0, className : "(unknown)", methodName : "(unknown)"};
	} else {
		this.posInfos = pos;
	}
};
haxe_exceptions_PosException.__name__ = true;
haxe_exceptions_PosException.__super__ = haxe_Exception;
haxe_exceptions_PosException.prototype = $extend(haxe_Exception.prototype,{
	toString: function() {
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
haxe_exceptions_NotImplementedException.__name__ = true;
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
haxe_io_Bytes.__name__ = true;
haxe_io_Bytes.ofString = function(s,encoding) {
	if(encoding == haxe_io_Encoding.RawNative) {
		var buf = new Uint8Array(s.length << 1);
		var _g = 0;
		var _g1 = s.length;
		while(_g < _g1) {
			var i = _g++;
			var c = s.charCodeAt(i);
			buf[i << 1] = c & 255;
			buf[i << 1 | 1] = c >> 8;
		}
		return new haxe_io_Bytes(buf.buffer);
	}
	var a = [];
	var i = 0;
	while(i < s.length) {
		var c = s.charCodeAt(i++);
		if(55296 <= c && c <= 56319) {
			c = c - 55232 << 10 | s.charCodeAt(i++) & 1023;
		}
		if(c <= 127) {
			a.push(c);
		} else if(c <= 2047) {
			a.push(192 | c >> 6);
			a.push(128 | c & 63);
		} else if(c <= 65535) {
			a.push(224 | c >> 12);
			a.push(128 | c >> 6 & 63);
			a.push(128 | c & 63);
		} else {
			a.push(240 | c >> 18);
			a.push(128 | c >> 12 & 63);
			a.push(128 | c >> 6 & 63);
			a.push(128 | c & 63);
		}
	}
	return new haxe_io_Bytes(new Uint8Array(a).buffer);
};
haxe_io_Bytes.prototype = {
	__class__: haxe_io_Bytes
};
var haxe_io_Encoding = $hxEnums["haxe.io.Encoding"] = { __ename__:true,__constructs__:null
	,UTF8: {_hx_name:"UTF8",_hx_index:0,__enum__:"haxe.io.Encoding",toString:$estr}
	,RawNative: {_hx_name:"RawNative",_hx_index:1,__enum__:"haxe.io.Encoding",toString:$estr}
};
haxe_io_Encoding.__constructs__ = [haxe_io_Encoding.UTF8,haxe_io_Encoding.RawNative];
var haxe_io_Eof = function() {
};
haxe_io_Eof.__name__ = true;
haxe_io_Eof.prototype = {
	toString: function() {
		return "Eof";
	}
	,__class__: haxe_io_Eof
};
var haxe_io_Error = $hxEnums["haxe.io.Error"] = { __ename__:true,__constructs__:null
	,Blocked: {_hx_name:"Blocked",_hx_index:0,__enum__:"haxe.io.Error",toString:$estr}
	,Overflow: {_hx_name:"Overflow",_hx_index:1,__enum__:"haxe.io.Error",toString:$estr}
	,OutsideBounds: {_hx_name:"OutsideBounds",_hx_index:2,__enum__:"haxe.io.Error",toString:$estr}
	,Custom: ($_=function(e) { return {_hx_index:3,e:e,__enum__:"haxe.io.Error",toString:$estr}; },$_._hx_name="Custom",$_.__params__ = ["e"],$_)
};
haxe_io_Error.__constructs__ = [haxe_io_Error.Blocked,haxe_io_Error.Overflow,haxe_io_Error.OutsideBounds,haxe_io_Error.Custom];
var haxe_io_Input = function() { };
haxe_io_Input.__name__ = true;
var haxe_io_Output = function() { };
haxe_io_Output.__name__ = true;
haxe_io_Output.prototype = {
	writeByte: function(c) {
		throw new haxe_exceptions_NotImplementedException(null,null,{ fileName : "haxe/io/Output.hx", lineNumber : 47, className : "haxe.io.Output", methodName : "writeByte"});
	}
	,writeBytes: function(s,pos,len) {
		if(pos < 0 || len < 0 || pos + len > s.length) {
			throw haxe_Exception.thrown(haxe_io_Error.OutsideBounds);
		}
		var b = s.b;
		var k = len;
		while(k > 0) {
			this.writeByte(b[pos]);
			++pos;
			--k;
		}
		return len;
	}
	,writeFullBytes: function(s,pos,len) {
		while(len > 0) {
			var k = this.writeBytes(s,pos,len);
			pos += k;
			len -= k;
		}
	}
	,writeString: function(s,encoding) {
		var b = haxe_io_Bytes.ofString(s,encoding);
		this.writeFullBytes(b,0,b.length);
	}
	,__class__: haxe_io_Output
};
var haxe_iterators_ArrayIterator = function(array) {
	this.current = 0;
	this.array = array;
};
haxe_iterators_ArrayIterator.__name__ = true;
haxe_iterators_ArrayIterator.prototype = {
	hasNext: function() {
		return this.current < this.array.length;
	}
	,next: function() {
		return this.array[this.current++];
	}
	,__class__: haxe_iterators_ArrayIterator
};
var js_Boot = function() { };
js_Boot.__name__ = true;
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
var js_node_Fs = require("fs");
var js_node_KeyValue = {};
js_node_KeyValue.get_key = function(this1) {
	return this1[0];
};
js_node_KeyValue.get_value = function(this1) {
	return this1[1];
};
var js_node_buffer_Buffer = require("buffer").Buffer;
var js_node_stream_WritableNewOptionsAdapter = {};
js_node_stream_WritableNewOptionsAdapter.from = function(options) {
	if(!Object.prototype.hasOwnProperty.call(options,"final")) {
		Object.defineProperty(options,"final",{ get : function() {
			return options.final_;
		}});
	}
	return options;
};
var polyboolhx_IBuildLog = function() { };
polyboolhx_IBuildLog.__name__ = true;
polyboolhx_IBuildLog.__isInterface__ = true;
polyboolhx_IBuildLog.prototype = {
	__class__: polyboolhx_IBuildLog
};
var polyboolhx_NullBuildLog = function() {
	this.nextSegmentId = 0;
	this.list = [];
};
polyboolhx_NullBuildLog.__name__ = true;
polyboolhx_NullBuildLog.__interfaces__ = [polyboolhx_IBuildLog];
polyboolhx_NullBuildLog.prototype = {
	push: function(type,data) {
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
polyboolhx_BuildLog.__name__ = true;
var polyboolhx_ArrayBuildLog = function() {
	this.list = [];
	this.nextSegmentId = 0;
	this.curVert = NaN;
};
polyboolhx_ArrayBuildLog.__name__ = true;
polyboolhx_ArrayBuildLog.__interfaces__ = [polyboolhx_IBuildLog];
polyboolhx_ArrayBuildLog.prototype = {
	push: function(type,data) {
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
polyboolhx_GeometryUtils.__name__ = true;
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
polyboolhx_Geometry.__name__ = true;
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
polyboolhx_GeometryEpsilon.__name__ = true;
polyboolhx_GeometryEpsilon.__super__ = polyboolhx_Geometry;
polyboolhx_GeometryEpsilon.prototype = $extend(polyboolhx_Geometry.prototype,{
	snap0: function(v) {
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
polyboolhx_SegmentBool.__name__ = true;
polyboolhx_SegmentBool.prototype = {
	get_data: function() {
		return this.data;
	}
	,__class__: polyboolhx_SegmentBool
};
var polyboolhx_IntersectorUtils = function() { };
polyboolhx_IntersectorUtils.__name__ = true;
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
polyboolhx_EventBool.__name__ = true;
polyboolhx_EventBool.prototype = {
	__class__: polyboolhx_EventBool
};
var polyboolhx_ListBool = function() {
	this.nodes = [];
};
polyboolhx_ListBool.__name__ = true;
polyboolhx_ListBool.prototype = {
	remove: function(node) {
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
polyboolhx_Intersector.__name__ = true;
polyboolhx_Intersector.prototype = {
	compareEvents: function(aStart,a1,a2,aSeg,bStart,b1,b2,bSeg) {
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
polyboolhx_PolyBool.__name__ = true;
polyboolhx_PolyBool.prototype = {
	shape: function() {
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
var polyboolhx_SegmentPairs = function() { };
polyboolhx_SegmentPairs.__name__ = true;
polyboolhx_SegmentPairs.__isInterface__ = true;
var polyboolhx_SegmentTValuePairs = function(tValuePairs) {
	this.tValuePairs = tValuePairs;
};
polyboolhx_SegmentTValuePairs.__name__ = true;
polyboolhx_SegmentTValuePairs.__interfaces__ = [polyboolhx_SegmentPairs];
polyboolhx_SegmentTValuePairs.prototype = {
	__class__: polyboolhx_SegmentTValuePairs
};
var polyboolhx_SegmentTRangePairs = function(tStart,tEnd) {
	this.tStart = tStart;
	this.tEnd = tEnd;
};
polyboolhx_SegmentTRangePairs.__name__ = true;
polyboolhx_SegmentTRangePairs.__interfaces__ = [polyboolhx_SegmentPairs];
polyboolhx_SegmentTRangePairs.prototype = {
	__class__: polyboolhx_SegmentTRangePairs
};
var polyboolhx_SegmentTValuesBuilder = function(geo) {
	this.tValues = [];
	this.geo = geo;
};
polyboolhx_SegmentTValuesBuilder.__name__ = true;
polyboolhx_SegmentTValuesBuilder.prototype = {
	addArray: function(ts) {
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
polyboolhx_SegmentTValuePairsBuilder.__name__ = true;
polyboolhx_SegmentTValuePairsBuilder.prototype = {
	add: function(t1,t2) {
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
polyboolhx_SegmentBase.__name__ = true;
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
polyboolhx_Segment.__name__ = true;
polyboolhx_Segment.__isInterface__ = true;
polyboolhx_Segment.prototype = {
	__class__: polyboolhx_Segment
};
var polyboolhx_SegmentLine = function(p0,p1,geo) {
	polyboolhx_SegmentBase.call(this);
	this.p0 = p0;
	this.p1 = p1;
	this.geo = geo;
};
polyboolhx_SegmentLine.__name__ = true;
polyboolhx_SegmentLine.__interfaces__ = [polyboolhx_Segment];
polyboolhx_SegmentLine.__super__ = polyboolhx_SegmentBase;
polyboolhx_SegmentLine.prototype = $extend(polyboolhx_SegmentBase.prototype,{
	copy: function() {
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
polyboolhx_SegmentCurve.__name__ = true;
polyboolhx_SegmentCurve.__interfaces__ = [polyboolhx_Segment];
polyboolhx_SegmentCurve.__super__ = polyboolhx_SegmentBase;
polyboolhx_SegmentCurve.prototype = $extend(polyboolhx_SegmentBase.prototype,{
	copy: function() {
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
polyboolhx_SegmentUtils.__name__ = true;
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
polyboolhx_SegmentChainerUtils.__name__ = true;
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
polyboolhx_SegmentChainer.__name__ = true;
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
polyboolhx_SegmentSelector.__name__ = true;
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
polyboolhx_Shape.__name__ = true;
polyboolhx_Shape.prototype = {
	setTransform: function(a,b,c,d,e,f) {
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
polyboolhx_ShapeCombined.__name__ = true;
polyboolhx_ShapeCombined.prototype = {
	union: function() {
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
var polyboolhx_test_ExecutionTimer = function() { };
polyboolhx_test_ExecutionTimer.__name__ = true;
polyboolhx_test_ExecutionTimer.start = function(key) {
	var _this = polyboolhx_test_ExecutionTimer._spans;
	var value = new Date().getTime();
	_this.h[key] = value;
};
polyboolhx_test_ExecutionTimer.end = function(key) {
	var start = polyboolhx_test_ExecutionTimer._spans.h[key];
	var duration = 0.0;
	if(start != null) {
		duration = new Date().getTime() - start;
		console.log("src/polyboolhx/test/ExecutionTimer.hx:25:","" + key + " took " + duration + "ms");
	}
	return duration;
};
var polyboolhx_test_VisualTest = function(name,sourceRegions,algorithm,options) {
	if(algorithm == null) {
		algorithm = "simple";
	}
	this.name = name;
	this.algorithm = algorithm;
	this.sources = [];
	var _g = 0;
	while(_g < sourceRegions.length) {
		var region = sourceRegions[_g];
		++_g;
		this.sources.push(this.makePoly(region));
	}
	this.options = options;
};
polyboolhx_test_VisualTest.__name__ = true;
polyboolhx_test_VisualTest.prototype = {
	run: function() {
		var label = this.name + " (algo:" + this.algorithm + ")";
		polyboolhx_test_ExecutionTimer.start(label);
		var unified = null;
		if(this.algorithm == "efficient") {
			unified = this.polyboolEfficient();
		} else if(this.algorithm == "cascading_union") {
			unified = this.cascadingUnion();
		} else {
			unified = this.simpleUnion();
		}
		var duration = polyboolhx_test_ExecutionTimer.end(label);
		var filename = "" + this.name + ".svg";
		var svg = this.generateSVG(this.sources,unified,"" + this.name + " " + duration + "ms");
		var output = new sys_io_FileOutput(js_node_Fs.openSync("dist/polyboolhx/js/vistest/" + filename,"w"));
		output.writeString(svg);
		output.close();
		return filename;
	}
	,simpleUnion: function() {
		var polyBool = new polyboolhx_PolyBool();
		var unified = this.sources[0];
		var _g = 1;
		var _g1 = this.sources.length;
		while(_g < _g1) {
			var i = _g++;
			unified = polyBool.union(unified,this.sources[i]);
		}
		return unified;
	}
	,polyboolEfficient: function() {
		var polyBool = new polyboolhx_PolyBool();
		var segments = polyBool.segments(this.sources[0]);
		var _g = 1;
		var _g1 = this.sources.length;
		while(_g < _g1) {
			var i = _g++;
			var seg2 = polyBool.segments(this.sources[i]);
			var comb = polyBool.combine(segments,seg2);
			segments = polyBool.selectUnion(comb);
		}
		return polyBool.polygon(segments);
	}
	,cascadingUnion: function(caching) {
		if(caching == null) {
			caching = false;
		}
		var polyBool = new polyboolhx_PolyBool();
		var allUnified = [];
		var cache_h = Object.create(null);
		var cacheKey = "";
		var _g = 0;
		var _g1 = this.sources;
		while(_g < _g1.length) {
			var src = _g1[_g];
			++_g;
			allUnified.push(src);
		}
		var unify4Adjacent = function(width,height) {
			var y = 0;
			var unified = [];
			while(y < height) {
				var x = 0;
				while(x < width) {
					var idx = x + y * width;
					var idx2 = x + (y + 1) * width;
					var pts = [allUnified[idx]];
					if(allUnified.length > idx + 1) {
						pts.push(allUnified[idx + 1]);
					}
					if(allUnified.length > idx2) {
						pts.push(allUnified[idx2]);
					}
					if(allUnified.length > idx2 + 1) {
						pts.push(allUnified[idx2 + 1]);
					}
					if(caching) {
						cacheKey = JSON.stringify(pts);
						if(Object.prototype.hasOwnProperty.call(cache_h,cacheKey)) {
							unified.push(cache_h[cacheKey]);
							continue;
						}
					}
					var adjacentUnified = pts[0];
					var _g = 1;
					var _g1 = pts.length;
					while(_g < _g1) {
						var i = _g++;
						adjacentUnified = polyBool.union(adjacentUnified,pts[i]);
					}
					unified.push(adjacentUnified);
					x += 2;
				}
				y += 2;
			}
			return unified;
		};
		var width = this.options.width;
		var height = this.options.height;
		while(allUnified.length != 1) {
			allUnified = unify4Adjacent(width,height);
			width = Math.ceil(width / 2);
			height = Math.ceil(height / 2);
		}
		return allUnified[0];
	}
	,generateSVG: function(sources,union,label) {
		if(label == null) {
			label = "";
		}
		var extremes_minX = 10000.0;
		var extremes_maxX = -10000.0;
		var extremes_minY = 10000.0;
		var extremes_maxY = -10000.0;
		var _g = 0;
		var _g1 = union.regions;
		while(_g < _g1.length) {
			var region = _g1[_g];
			++_g;
			var _g2 = 0;
			while(_g2 < region.length) {
				var p = region[_g2];
				++_g2;
				if(p[0] < extremes_minX) {
					extremes_minX = p[0];
				}
				if(p[0] > extremes_maxX) {
					extremes_maxX = p[0];
				}
				if(p[1] < extremes_minY) {
					extremes_minY = p[1];
				}
				if(p[1] > extremes_maxY) {
					extremes_maxY = p[1];
				}
			}
		}
		var width = extremes_maxX - extremes_minX;
		var height = extremes_maxY - extremes_minY;
		var svg = "<svg width=\"" + width + "\" height=\"" + height + "\" xmlns=\"http://www.w3.org/2000/svg\">\n";
		var _g = 0;
		while(_g < sources.length) {
			var source = sources[_g];
			++_g;
			svg += this.generateSVGPath(source,"rgba(0, 0, 0, 0.3)","rgba(0, 0, 0, 0.3)",0 - extremes_minX,0 - extremes_minY);
		}
		svg += this.generateSVGPath(union,"rgba(0, 255, 0, 0.7)","green",0 - extremes_minX,0 - extremes_minY);
		svg += "<text x=\"10\" y=\"20\">" + label + "</text>";
		svg += "</svg>";
		return svg;
	}
	,generateSVGPath: function(polygon,fillStyle,strokeStyle,offsetX,offsetY) {
		if(offsetY == null) {
			offsetY = 0.0;
		}
		if(offsetX == null) {
			offsetX = 0.0;
		}
		if(strokeStyle == null) {
			strokeStyle = "green";
		}
		if(fillStyle == null) {
			fillStyle = "rgba(0, 255, 0, 0.5)";
		}
		var result = "";
		var pt = function(p) {
			return [p[0] + offsetX,p[1] + offsetY];
		};
		var _g = 0;
		var _g1 = polygon.regions;
		while(_g < _g1.length) {
			var region = _g1[_g];
			++_g;
			var pathData = "";
			var firstPoint = pt(region[0]);
			pathData += "M" + firstPoint[0] + "," + firstPoint[1] + " ";
			var _g2 = 1;
			var _g3 = region.length;
			while(_g2 < _g3) {
				var i = _g2++;
				var point = pt(region[i]);
				if(point.length == 2) {
					pathData += "L" + point[0] + "," + point[1] + " ";
				} else if(point.length == 6) {
					pathData += "C" + point[0] + "," + point[1] + " " + point[2] + "," + point[3] + " " + point[4] + "," + point[5] + " ";
				}
			}
			pathData += "Z";
			result += "<path d=\"" + pathData + "\" fill=\"" + fillStyle + "\" stroke=\"" + strokeStyle + "\" stroke-width=\"2\" />\n";
		}
		return result;
	}
	,makePoly: function(paths) {
		return { regions : paths, inverted : false};
	}
	,__class__: polyboolhx_test_VisualTest
};
var polyboolhx_test_VisualTestRunner = function() { };
polyboolhx_test_VisualTestRunner.__name__ = true;
polyboolhx_test_VisualTestRunner.main = function() {
	var tests = [new polyboolhx_test_VisualTest("simple",[[[[100.0,100.0],[300.0,100.0],[300.0,300.0],[100.0,300.0]]],[[[200.0,200.0],[400.0,200.0],[400.0,400.0],[200.0,400.0]]]]),new polyboolhx_test_VisualTest("l_shape_overlap",[[[[100.0,100.0],[300.0,100.0],[300.0,200.0],[200.0,200.0],[200.0,300.0],[100.0,300.0]]],[[[150.0,150.0],[350.0,150.0],[350.0,250.0],[150.0,250.0]]]]),new polyboolhx_test_VisualTest("edge_touching",[[[[100.0,100.0],[200.0,100.0],[200.0,200.0],[100.0,200.0]]],[[[200.0,100.0],[300.0,100.0],[300.0,200.0],[200.0,200.0]]]]),new polyboolhx_test_VisualTest("complex_vs_square",[[[[50.0,50.0],[150.0,50.0],[150.0,150.0],[50.0,150.0],[50.0,250.0],[150.0,250.0],[150.0,350.0],[50.0,350.0]]],[[[100.0,200.0],[200.0,200.0],[200.0,300.0],[100.0,300.0]]]]),new polyboolhx_test_VisualTest("angled_lines",[[[[200.0,100.0],[300.0,200.0],[200.0,300.0],[100.0,200.0]]],[[[150.0,120.0],[250.0,120.0],[200.0,220.0]]]]),new polyboolhx_test_VisualTest("grid_small",polyboolhx_test_VisualTestRunner.generateGrid(25,25,10,10)),new polyboolhx_test_VisualTest("efficent_grid_small",polyboolhx_test_VisualTestRunner.generateGrid(25,25,10,10),"efficient"),new polyboolhx_test_VisualTest("cascading_union_small",polyboolhx_test_VisualTestRunner.generateGrid(25,25,10,10),"cascading_union",{ width : 25, height : 25}),new polyboolhx_test_VisualTest("grid_big",polyboolhx_test_VisualTestRunner.generateGrid(100,100,10,10)),new polyboolhx_test_VisualTest("efficent_grid_big",polyboolhx_test_VisualTestRunner.generateGrid(100,100,10,10),"efficient"),new polyboolhx_test_VisualTest("cascading_union_big",polyboolhx_test_VisualTestRunner.generateGrid(100,100,10,10),"cascading_union",{ width : 100, height : 100})];
	var html = "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n<meta charset=\"UTF-8\">\n<title>PolyBoolHx Visual Test</title>\n</head>\n<body>";
	var _g = 0;
	while(_g < tests.length) {
		var test = tests[_g];
		++_g;
		var svg = test.run();
		html += "\n<div><img src=\"" + svg + "\"></div>";
	}
	html += "\n</body>\n</html>";
	var output = new sys_io_FileOutput(js_node_Fs.openSync("dist/polyboolhx/js/vistest/vistest.html","w"));
	output.writeString(html);
	output.close();
};
polyboolhx_test_VisualTestRunner.generateGrid = function(rows,cols,squareWidth,squareHeight) {
	var regions = [];
	var _g = 0;
	var _g1 = rows;
	while(_g < _g1) {
		var i = _g++;
		var _g2 = 0;
		var _g3 = cols;
		while(_g2 < _g3) {
			var j = _g2++;
			var x = j * squareWidth;
			var y = i * squareHeight;
			regions.push([[[x,y],[x + squareWidth,y],[x + squareWidth,y + squareHeight],[x,y + squareHeight]]]);
		}
	}
	return regions;
};
var sys_io_FileInput = function(fd) {
	this.fd = fd;
	this.pos = 0;
};
sys_io_FileInput.__name__ = true;
sys_io_FileInput.__super__ = haxe_io_Input;
sys_io_FileInput.prototype = $extend(haxe_io_Input.prototype,{
	readByte: function() {
		var buf = js_node_buffer_Buffer.alloc(1);
		var bytesRead;
		try {
			bytesRead = js_node_Fs.readSync(this.fd,buf,0,1,this.pos);
		} catch( _g ) {
			var e = haxe_Exception.caught(_g).unwrap();
			if(e.code == "EOF") {
				throw haxe_Exception.thrown(new haxe_io_Eof());
			} else {
				throw haxe_Exception.thrown(haxe_io_Error.Custom(e));
			}
		}
		if(bytesRead == 0) {
			throw haxe_Exception.thrown(new haxe_io_Eof());
		}
		this.pos++;
		return buf[0];
	}
	,readBytes: function(s,pos,len) {
		var data = s.b;
		var buf = js_node_buffer_Buffer.from(data.buffer,data.byteOffset,s.length);
		var bytesRead;
		try {
			bytesRead = js_node_Fs.readSync(this.fd,buf,pos,len,this.pos);
		} catch( _g ) {
			var e = haxe_Exception.caught(_g).unwrap();
			if(e.code == "EOF") {
				throw haxe_Exception.thrown(new haxe_io_Eof());
			} else {
				throw haxe_Exception.thrown(haxe_io_Error.Custom(e));
			}
		}
		if(bytesRead == 0) {
			throw haxe_Exception.thrown(new haxe_io_Eof());
		}
		this.pos += bytesRead;
		return bytesRead;
	}
	,close: function() {
		js_node_Fs.closeSync(this.fd);
	}
	,seek: function(p,pos) {
		switch(pos._hx_index) {
		case 0:
			this.pos = p;
			break;
		case 1:
			this.pos += p;
			break;
		case 2:
			this.pos = js_node_Fs.fstatSync(this.fd).size + p;
			break;
		}
	}
	,tell: function() {
		return this.pos;
	}
	,eof: function() {
		return this.pos >= js_node_Fs.fstatSync(this.fd).size;
	}
	,__class__: sys_io_FileInput
});
var sys_io_FileOutput = function(fd) {
	this.fd = fd;
	this.pos = 0;
};
sys_io_FileOutput.__name__ = true;
sys_io_FileOutput.__super__ = haxe_io_Output;
sys_io_FileOutput.prototype = $extend(haxe_io_Output.prototype,{
	writeByte: function(b) {
		var buf = js_node_buffer_Buffer.alloc(1);
		buf[0] = b;
		js_node_Fs.writeSync(this.fd,buf,0,1,this.pos);
		this.pos++;
	}
	,writeBytes: function(s,pos,len) {
		var data = s.b;
		var buf = js_node_buffer_Buffer.from(data.buffer,data.byteOffset,s.length);
		var wrote = js_node_Fs.writeSync(this.fd,buf,pos,len,this.pos);
		this.pos += wrote;
		return wrote;
	}
	,close: function() {
		js_node_Fs.closeSync(this.fd);
	}
	,seek: function(p,pos) {
		switch(pos._hx_index) {
		case 0:
			this.pos = p;
			break;
		case 1:
			this.pos += p;
			break;
		case 2:
			this.pos = js_node_Fs.fstatSync(this.fd).size + p;
			break;
		}
	}
	,tell: function() {
		return this.pos;
	}
	,__class__: sys_io_FileOutput
});
var sys_io_FileSeek = $hxEnums["sys.io.FileSeek"] = { __ename__:true,__constructs__:null
	,SeekBegin: {_hx_name:"SeekBegin",_hx_index:0,__enum__:"sys.io.FileSeek",toString:$estr}
	,SeekCur: {_hx_name:"SeekCur",_hx_index:1,__enum__:"sys.io.FileSeek",toString:$estr}
	,SeekEnd: {_hx_name:"SeekEnd",_hx_index:2,__enum__:"sys.io.FileSeek",toString:$estr}
};
sys_io_FileSeek.__constructs__ = [sys_io_FileSeek.SeekBegin,sys_io_FileSeek.SeekCur,sys_io_FileSeek.SeekEnd];
String.prototype.__class__ = String;
String.__name__ = true;
Array.__name__ = true;
Date.prototype.__class__ = Date;
Date.__name__ = "Date";
var Int = { };
var Dynamic = { };
var Float = Number;
var Bool = Boolean;
var Class = { };
var Enum = { };
js_Boot.__toStr = ({ }).toString;
polyboolhx_BuildLog.log = new polyboolhx_NullBuildLog();
polyboolhx_test_ExecutionTimer._spans = new haxe_ds_StringMap();
polyboolhx_test_VisualTestRunner.main();
})(typeof window != "undefined" ? window : typeof global != "undefined" ? global : typeof self != "undefined" ? self : this);

//# sourceMappingURL=vistest.js.map