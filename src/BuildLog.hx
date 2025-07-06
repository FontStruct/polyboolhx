//
// polybool - Boolean operations on polygons (union, intersection, etc)
// by Sean Connelly (@velipso), https://sean.fun
// Project Home: https://github.com/velipso/polybool
// SPDX-License-Identifier: 0BSD
//

package polyboolhx;

import haxe.Json;
import polyboolhx.Geometry.Vec2;
import polyboolhx.Segment;
import polyboolhx.Intersector.SegmentBool;

typedef ISegFill = {
    var seg:Segment;
    var fill:Bool;
};

interface IBuildLog {
    var list:Array<{type:String, data:Dynamic}>;
    var nextSegmentId:Int;

    function push(type:String, data:Dynamic):Void;

    function info(msg:String, data:Dynamic = null):Void;

    function segmentId():Int;

    function checkIntersection(seg1:SegmentBool, seg2:SegmentBool):Void;

    function segmentDivide(seg:SegmentBool, p:Vec2):Void;

    function segmentChop(seg:SegmentBool):Void;

    function statusRemove(seg:SegmentBool):Void;

    function segmentUpdate(seg:SegmentBool):Void;

    function segmentNew(seg:SegmentBool, primary:Bool):Void;

    function tempStatus(seg:SegmentBool, above:SegmentBool = null, below:SegmentBool = null):Void;

    function rewind(seg:SegmentBool):Void;

    function status(seg:SegmentBool, above:SegmentBool = null, below:SegmentBool = null):Void;

    function vert(x:Float):Void;

    function selected(segs:Array<SegmentBool>):Void;

    function chainStart(sf:ISegFill, closed:Bool):Void;

    function chainNew(sf:ISegFill, closed:Bool):Void;

    function chainMatch(index:Int, closed:Bool):Void;

    function chainClose(index:Int, closed:Bool):Void;

    function chainAddHead(index:Int, sf:ISegFill, closed:Bool):Void;

    function chainAddTail(index:Int, sf:ISegFill, closed:Bool):Void;

    function chainSimplifyHead(index:Int, sf:ISegFill, closed:Bool):Void;

    function chainSimplifyTail(index:Int, sf:ISegFill, closed:Bool):Void;

    function chainSimplifyClose(index:Int, sf:ISegFill, closed:Bool):Void;

    function chainSimplifyJoin(index1:Int, index2:Int, sf:ISegFill, closed:Bool):Void;

    function chainReverse(index: Int, closed: Bool):Void;

    function chainJoin(index1:Int, index2:Int, closed:Bool):Void;

    public function chainConnect(index1:Int, index2:Int, closed:Bool):Void;

    function done():Void;
}

class BuildLog {
    public static var log:IBuildLog = new NullBuildLog();
}

class ArrayBuildLog implements IBuildLog {
    public var list:Array<{type:String, data:Dynamic}>;
    public var nextSegmentId:Int;
    var curVert:Float;

    public function new() {
        this.list = [];
        this.nextSegmentId = 0;
        this.curVert = Math.NaN;
    }

    public function push(type:String, data:Dynamic):Void {
        this.list.push({
            type: type,
            data: Json.parse(Json.stringify(data))
        });
    }

    public function info(msg:String, data:Dynamic = null):Void {
        this.push("info", { msg: msg, data: data });
    }

    public function segmentId():Int {
        return this.nextSegmentId++;
    }

    public function checkIntersection(seg1:SegmentBool, seg2:SegmentBool):Void {
        this.push("check", { seg1: seg1, seg2: seg2 });
    }

    public function segmentDivide(seg:SegmentBool, p:Vec2):Void {
        this.push("div_seg", { seg: seg, p: p });
    }

    public function segmentChop(seg:SegmentBool):Void {
        this.push("chop", { seg: seg });
    }

    public function statusRemove(seg:SegmentBool):Void {
        this.push("pop_seg", { seg: seg });
    }

    public function segmentUpdate(seg:SegmentBool):Void {
        this.push("seg_update", { seg: seg });
    }

    public function segmentNew(seg:SegmentBool, primary:Bool):Void {
        this.push("new_seg", { seg: seg, primary: primary });
    }

    public function tempStatus(seg:SegmentBool, above:SegmentBool = null, below:SegmentBool = null):Void {
        this.push("temp_status", { seg: seg, above: above, below: below });
    }

    public function rewind(seg:SegmentBool):Void {
        this.push("rewind", { seg: seg });
    }

    public function status(seg:SegmentBool, above:SegmentBool = null, below:SegmentBool = null):Void {
        this.push("status", { seg: seg, above: above, below: below });
    }

    public function vert(x:Float):Void {
        if (x != this.curVert) {
            this.push("vert", { x: x });
            this.curVert = x;
        }
    }

    public function selected(segs:Array<SegmentBool>):Void {
        this.push("selected", { segs: segs });
    }

    public function chainStart(sf:ISegFill, closed:Bool):Void {
        this.push("chain_start", { sf: sf, closed: closed });
    }

    public function chainNew(sf:ISegFill, closed:Bool):Void {
        this.push("chain_new", { sf: sf, closed: closed });
    }

    public function chainMatch(index:Int, closed:Bool):Void {
        this.push("chain_match", { index: index, closed: closed });
    }

    public function chainClose(index:Int, closed:Bool):Void {
        this.push("chain_close", { index: index, closed: closed });
    }

    public function chainAddHead(index:Int, sf:ISegFill, closed:Bool):Void {
        this.push("chain_add_head", { index: index, sf: sf, closed: closed });
    }

    public function chainAddTail(index:Int, sf:ISegFill, closed:Bool):Void {
        this.push("chain_add_tail", { index: index, sf: sf, closed: closed });
    }

    public function chainSimplifyHead(index:Int, sf:ISegFill, closed:Bool):Void {
        this.push("chain_simp_head", { index: index, sf: sf, closed: closed });
    }

    public function chainSimplifyTail(index:Int, sf:ISegFill, closed:Bool):Void {
        this.push("chain_simp_tail", { index: index, sf: sf, closed: closed });
    }

    public function chainSimplifyClose(index:Int, sf:ISegFill, closed:Bool):Void {
        this.push("chain_simp_close", { index: index, sf: sf, closed: closed });
    }

    public function chainSimplifyJoin(index1:Int, index2:Int, sf:ISegFill, closed:Bool):Void {
        this.push("chain_simp_join", { index1: index1, index2: index2, sf: sf, closed: closed });
    }

    public function chainConnect(index1:Int, index2:Int, closed:Bool):Void {
        this.push("chain_con", { index1: index1, index2: index2, closed: closed });
    }

    public function chainReverse(index:Int, closed:Bool):Void {
        this.push("chain_rev", { index: index, closed: closed });
    }

    public function chainJoin(index1:Int, index2:Int, closed:Bool):Void {
        this.push("chain_join", { index1: index1, index2: index2, closed: closed });
    }

    public function done():Void {
        this.push("done", null);
    }

}

class NullBuildLog implements IBuildLog {
    public var list:Array<{type:String, data:Dynamic}> = [];
    public var nextSegmentId:Int = 0;

    public function new() {}

    public function push(type:String, data:Dynamic):Void {}

    public function info(msg:String, data:Dynamic = null):Void {}

    public function segmentId():Int {
        return 0;
    }

    public function checkIntersection(seg1:SegmentBool, seg2:SegmentBool):Void {}

    public function segmentDivide(seg:SegmentBool, p:Vec2):Void {}

    public function segmentChop(seg:SegmentBool):Void {}

    public function statusRemove(seg:SegmentBool):Void {}

    public function segmentUpdate(seg:SegmentBool):Void {}

    public function segmentNew(seg:SegmentBool, primary:Bool):Void {}

    public function tempStatus(seg:SegmentBool, above:SegmentBool = null, below:SegmentBool = null):Void {}

    public function rewind(seg:SegmentBool):Void {}

    public function status(seg:SegmentBool, above:SegmentBool = null, below:SegmentBool = null):Void {}

    public function vert(x:Float):Void {}

    public function selected(segs:Array<SegmentBool>):Void {}

    public function chainStart(sf:ISegFill, closed:Bool):Void {}

    public function chainNew(sf:ISegFill, closed:Bool):Void {}

    public function chainMatch(index:Int, closed:Bool):Void {}

    public function chainClose(index:Int, closed:Bool):Void {}

    public function chainAddHead(index:Int, sf:ISegFill, closed:Bool):Void {}

    public function chainAddTail(index:Int, sf:ISegFill, closed:Bool):Void {}

    public function chainSimplifyHead(index:Int, sf:ISegFill, closed:Bool):Void {}

    public function chainSimplifyTail(index:Int, sf:ISegFill, closed:Bool):Void {}

    public function chainSimplifyClose(index:Int, sf:ISegFill, closed:Bool):Void {}

    public function chainSimplifyJoin(index1:Int, index2:Int, sf:ISegFill, closed:Bool):Void {}

    public function chainReverse(index: Int, closed: Bool):Void {}

    public function chainJoin(index1:Int, index2:Int, closed:Bool):Void {}

    public function chainConnect(index1:Int, index2:Int, closed:Bool):Void {}

    public function done():Void {}

}