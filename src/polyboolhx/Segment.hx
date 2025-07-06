//
// polybool - Boolean operations on polygons (union, intersection, etc)
// by Sean Connelly (@velipso), https://sean.fun
// Project Home: https://github.com/velipso/polybool
// SPDX-License-Identifier: 0BSD
//

package polyboolhx;

import polyboolhx.Geometry.Vec2;
import polyboolhx.Geometry;
import haxe.Exception;
import polyboolhx.Geometry.GeometryUtils;

using polyboolhx.Geometry.GeometryUtils;


interface SegmentPairs {}

class SegmentTValuePairs implements SegmentPairs {
    public var tValuePairs:Array<Vec2>; // [seg1T, seg2T][]
    public function new(tValuePairs) {
        this.tValuePairs = tValuePairs;
    }
}

class SegmentTRangePairs implements SegmentPairs {
    public var tStart:Vec2; // [seg1TStart, seg2TStart]
    public var tEnd:Vec2; // [seg1TEnd, seg2TEnd]
    public function new(tStart, tEnd) {
        this.tStart = tStart;
        this.tEnd = tEnd;
    }
}

class SegmentTValuesBuilder {
    public var tValues:Array<Float> = [];
    public var geo:Geometry;

    public function new(geo:Geometry) {
        this.geo = geo;
    }

    public function addArray(ts:Array<Float>):SegmentTValuesBuilder {
        for (t in ts) {
            tValues.push(t);
        }
        return this;
    }

    public function add(t:Float):SegmentTValuesBuilder {
        t = this.geo.snap01(t);
        // ignore values outside 0-1 range
        if (t < 0 || t > 1) {
            return this;
        }
        for (tv in this.tValues) {
            if (this.geo.snap0(t - tv) == 0) {
                // already have this location
                return this;
            }
        }
        tValues.push(t);
        return this;
    }

    public function list():Array<Float> {
        tValues.sort((a, b) -> {
            var diff = a - b;
            if (diff == 0) return 0;
            return diff > 0? 1 : -1;
        });
        return tValues;
    }

}

class SegmentTValuePairsBuilder {
    public var tValuePairs:Array<Vec2> = [];
    public var allowOutOfRange:Bool;
    public var geo:Geometry;

    public function new(allowOutOfRange:Bool, geo:Geometry) {
        this.allowOutOfRange = allowOutOfRange;
        this.geo = geo;
    }

    public function add(t1:Float, t2:Float):SegmentTValuePairsBuilder {
        t1 = this.geo.snap01(t1);
        t2 = this.geo.snap01(t2);
        if (!allowOutOfRange && (t1 < 0 || t1 > 1 || t2 < 0 || t2 > 1)) {
            return this;
        }
        for (tv in this.tValuePairs) {
            if (
                geo.snap0(t1 - tv[0]) == 0 ||
                geo.snap0(t2 - tv[1]) == 0
            ) {
                return this;
            }
        }
        tValuePairs.push([t1, t2]);
        return this;
    }

    public function list():Array<Vec2> {
        tValuePairs.sort((a, b) -> Std.int(a[0] - b[0]));
        return tValuePairs;
    }

    public function done():SegmentTValuePairs {
        if (tValuePairs.length <= 0) {
            return  null;
        } else {
            return new SegmentTValuePairs(list());
        }
    }

}

abstract class SegmentBase<T> {
    public function new() {}

    public function isLine():Bool {
        return this is SegmentLine;
    }

    public function copy():T {
        throw "Abstract method: must be overridden";
    }

    public function isEqual(other:T):Bool {
        throw "Abstract method: must be overridden";
    }

    public function start():Vec2 {
        throw "Abstract method: must be overridden";
    }

    public function start2():Vec2 {
        throw "Abstract method: must be overridden";
    }

    public function end2():Vec2 {
        throw "Abstract method: must be overridden";
    }

    public function end():Vec2 {
        throw "Abstract method: must be overridden";
    }

    public function setStart(p:Vec2):Void {
        throw "Abstract method: must be overridden";
    }

    public function setEnd(p:Vec2):Void {
        throw "Abstract method: must be overridden";
    }

    public function point(t:Float):Vec2 {
        throw "Abstract method: must be overridden";
    }

    public function split(t:Array<Float>):Array<T> {
        throw "Abstract method: must be overridden";
    }

    public function reverse():T {
        throw "Abstract method: must be overridden";
    }

    public function boundingBox():Array<Vec2> {
        throw "Abstract method: must be overridden";
    }

    public function pointOn(p:Vec2):Bool {
        throw "Abstract method: must be overridden";
    }

    public function draw<T:IPolyBoolReceiver>(ctx:T):T {
        throw "Abstract method: must be overridden";
    }

}

class SegmentLine extends SegmentBase<SegmentLine> implements Segment {
    public var p0:Vec2;
    public var p1:Vec2;
    public var geo:Geometry;

    public function new(p0:Vec2, p1:Vec2, geo:Geometry) {
        super();
        this.p0 = p0;
        this.p1 = p1;
        this.geo = geo;
    }

    override public function copy():SegmentLine {
        return new SegmentLine(this.p0, this.p1, this.geo);
    }

    override public function isEqual(other:SegmentLine):Bool {
        return geo.isEqualVec2(this.p0, other.p0) &&
        geo.isEqualVec2(this.p1, other.p1);
    }

    override public function start():Vec2 {
        return this.p0;
    }

    override public function start2():Vec2 {
        return this.p1;
    }

    override public function end2():Vec2 {
        return this.p0;
    }

    override public function end():Vec2 {
        return this.p1;
    }

    override public function setStart(p0:Vec2):Void {
        this.p0 = p0;
    }

    override public function setEnd(p1:Vec2):Void {
        this.p1 = p1;
    }

    override public function point(t:Float):Vec2 {
        var p0 = this.p0;
        var p1 = this.p1;

        return if (t == 0) p0 else if (t == 1) p1 else [
            p0[0] + (p1[0] - p0[0]) * t,
            p0[1] + (p1[1] - p0[1]) * t
        ];
    }

    override public function split(ts:Array<Float>):Array<SegmentLine> {
        if (ts.length <= 0) {
            return [this];
        }
        var pts = ts.map((t) -> this.point(t));
        pts.push(this.p1);
        var result:Array<SegmentLine> = [];
        var last = this.p0;
        for (pt in pts) {
            result.push(new SegmentLine(last, pt, this.geo));
            last = pt;
        }
        return result;
    }

    override public function reverse():SegmentLine {
        return new SegmentLine(this.p1, this.p0, this.geo);
    }

    override public function boundingBox():Array<Vec2> {
        var p0 = this.p0;
        var p1 = this.p1;
        return [
            [Math.min(p0[0], p1[0]), Math.min(p0[1], p1[1])],
            [Math.max(p0[0], p1[0]), Math.max(p0[1], p1[1])],
        ];
    }

    override public function pointOn(p: Vec2):Bool {
        return this.geo.isCollinear(p, this.p0, this.p1);
    }

    override public function draw<T: IPolyBoolReceiver>
    (ctx: T): T {
        var p0 = this.p0;
        var p1 = this.p1;
        ctx.moveTo(p0[0], p0[1]);
        ctx.lineTo(p1[0], p1[1]);
        return ctx;
    }
}

class SegmentCurve extends SegmentBase<SegmentCurve> implements Segment {
    public var p0:Vec2;
    public var p1:Vec2;
    public var p2:Vec2;
    public var p3: Vec2;
    public var geo:Geometry;

    // Constructor to initialize the curve segment
    public function new(p0: Vec2, p1: Vec2, p2: Vec2, p3: Vec2, geo: Geometry) {
        super();
        this.p0 = p0;
        this.p1 = p1;
        this.p2 = p2;
        this.p3 = p3;
        this.geo = geo;
    }

    // Copy the current curve segment
    override public function copy():SegmentCurve {
        return new SegmentCurve(this.p0, this.p1, this.p2, this.p3, this.geo);
    }

    // Check for equality between this and another SegmentCurve
    override public function isEqual(other:SegmentCurve):Bool {
        return (
            this.geo.isEqualVec2(this.p0, other.p0) &&
        this.geo.isEqualVec2(this.p1, other.p1) &&
        this.geo.isEqualVec2(this.p2, other.p2) &&
        this.geo.isEqualVec2(this.p3, other.p3)
        );
    }

    // Returns the starting point of the curve
    override public function start():Vec2 {
        return this.p0;
    }

    // Returns the control point (interpreted as "start2" in the curve context)
    override public function start2():Vec2 {
        return this.p1;
    }

    // Returns the control point as an endpoint (interpreted as "end2")
    override public function end2():Vec2 {
        return this.p2;
    }

    // Returns the ending point of the curve
    override public function end():Vec2 {
        return this.p3;
    }

    // Sets the starting point of the curve
    override public function setStart(p0: Vec2):Void {
        this.p0 = p0;
    }

    // Sets the ending point of the curve
    override public function setEnd(p3:Vec2):Void {
        this.p3 = p3;
    }

    // Calculate a point on the curve based on a `t` value (0 <= t <= 1)
    override public function point(t:Float):Vec2 {
        var p0 = this.p0;
        var p1 = this.p1;
        var p2 = this.p2;
        var p3 = this.p3;


        if (t == 0) {
            return p0;
        } else if (t == 1) {
            return p3;
        }

        var t1t = (1 - t) * (1 - t);
        var tt = t * t;
        var t0 = t1t * (1 - t);
        var t1 = 3 * t1t * t;
        var t2 = 3 * tt * (1 - t);
        var t3 = tt * t;

        return [
            p0[0] * t0 + p1[0] * t1 + p2[0] * t2 + p3[0] * t3,
            p0[1] * t0 + p1[1] * t1 + p2[1] * t2 + p3[1] * t3
        ];
    }

    // Split the curve segment into multiple sub-segments based on provided `t` values
    override public function split(ts:Array<Float>):Array<SegmentCurve> {
        if (ts.length <= 0) {
            return [this];
        }
        var result = new Array<SegmentCurve>();
        function splitSingle(pts: Array<Vec2>, t: Float):Array<Vec2> {
            var p0 = pts[0];
            var p1 = pts[1];
            var p2 = pts[2];
            var p3 = pts[3];
            var p4 = GeometryUtils.lerpVec2(p0, p1, t);
            var p5 = GeometryUtils.lerpVec2(p1, p2, t);
            var p6 = GeometryUtils.lerpVec2(p2, p3, t);
            var p7 = GeometryUtils.lerpVec2(p4, p5, t);
            var p8 = GeometryUtils.lerpVec2(p5, p6, t);
            var p9 = GeometryUtils.lerpVec2(p7, p8, t);
            result.push(new SegmentCurve(p0, p4, p7, p9, this.geo));
            return [p9, p8, p6, p3];
        };
        var last = [this.p0, this.p1, this.p2, this.p3];
        var lastT:Float = 0;
        for (t in ts) {
            last = splitSingle(last, (t - lastT) / (1 - lastT));
            lastT = t;
        }
        result.push(new SegmentCurve(last[0], last[1], last[2], last[3], this.geo));
        return result;
    }

    // Reverse the curve segment by swapping points and adapting the control point
    override public function reverse():SegmentCurve {
        return new SegmentCurve(this.p3, this.p2, this.p1, this.p0, this.geo);
    }

    public function getCubicCoefficients(axis: Int):Array<Float> {
        var p0 = this.p0[axis];
        var p1 = this.p1[axis];
        var p2 = this.p2[axis];
        var p3 = this.p3[axis];
        return [
            p3 - 3 * p2 + 3 * p1 - p0,
            3 * p2 - 6 * p1 + 3 * p0,
            3 * p1 - 3 * p0,
            p0,
        ];
    }

    public function boundingTValues() {
        var result = new SegmentTValuesBuilder(this.geo);
        function bounds(x0: Float, x1: Float, x2: Float, x3: Float) {
            var a = 3 * x3 - 9 * x2 + 9 * x1 - 3 * x0;
            var b = 6 * x0 - 12 * x1 + 6 * x2;
            var c = 3 * x1 - 3 * x0;
            if (this.geo.snap0(a) == 0) {
                result.add(-c / b);
            } else {
                var disc = b * b - 4 * a * c;
                if (disc >= 0) {
                    var sq = Math.sqrt(disc);
                    result.add((-b + sq) / (2 * a));
                    result.add((-b - sq) / (2 * a));
                }
            }
            return result;
        }

        var p0 = this.p0;
        var p1 = this.p1;
        var p2 = this.p2;
        var p3 = this.p3;
        bounds(p0[0], p1[0], p2[0], p3[0]);
        bounds(p0[1], p1[1], p2[1], p3[1]);
        return result.list();
    }

    public function inflectionTValues():Array<Float>  {
        var result = new SegmentTValuesBuilder(this.geo);
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
        for (s in this.geo.solveCubic(A, B, C, D)) {
            result.add(s);
        }
        return result.list();
    }

    // Get the bounding box for this curve segment
    override public function boundingBox():Array<Vec2> {
        var p0 = this.p0;
        var p3 = this.p3;
        var min: Vec2 = [Math.min(p0[0], p3[0]), Math.min(p0[1], p3[1])];
        var max: Vec2 = [Math.max(p0[0], p3[0]), Math.max(p0[1], p3[1])];
        for (t in this.boundingTValues()) {
        var p = this.point(t);
        min[0] = Math.min(min[0], p[0]);
        min[1] = Math.min(min[1], p[1]);
        max[0] = Math.max(max[0], p[0]);
        max[1] = Math.max(max[1], p[1]);
        }
        return [min, max];
    }

    public function mapXtoT(x: Float, force = false): Null<Float> {
        if (this.geo.snap0(this.p0[0] - x) == 0) {
            return 0;
        }
        if (this.geo.snap0(this.p3[0] - x) == 0) {
            return 1;
        }
        var p0 = this.p0[0] - x;
        var p1 = this.p1[0] - x;
        var p2 = this.p2[0] - x;
        var p3 = this.p3[0] - x;
        var R = [
            p3 - 3 * p2 + 3 * p1 - p0,
            3 * p2 - 6 * p1 + 3 * p0,
            3 * p1 - 3 * p0,
            p0,
        ];
        for (t in this.geo.solveCubic(R[0], R[1], R[2], R[3])) {
            var ts = this.geo.snap01(t);
            if (ts >= 0 && ts <= 1) {
                return t;
            }
        }
        // force a solution if we know there is one...
        if (
            force ||
            (x >= Math.min(this.p0[0], this.p3[0]) &&
            x <= Math.max(this.p0[0], this.p3[0]))
        ) {
            for (attempt in 0...4) {
                // collapse an R value to 0, this is so wrong!!!
                var ii = -1;
                for (i in 0...4) {
                    if (R[i] != 0 && (ii < 0 || Math.abs(R[i]) < Math.abs(R[ii]))) {
                        ii = i;
                    }
                }
                if (ii < 0) {
                    return 0;
                }
                R[ii] = 0;
                // solve again, but with another 0 to help
                for (t in this.geo.solveCubic(R[0], R[1], R[2], R[3])) {
                    var ts = this.geo.snap01(t);
                    if (ts >= 0 && ts <= 1) {
                        return t;
                    }
                }
            }
        }
        return null;
    }

    public function mapXtoY(x: Float, force = false): Null<Float> {
        var t = this.mapXtoT(x, force);
        if (t == null) {
            return null;
        }
        return this.point(t)[1];
    }

    // Determine if a point lies directly on the curve
    override public function pointOn(p:Vec2):Bool {
        if (this.geo.isEqualVec2(this.p0, p) || this.geo.isEqualVec2(this.p3, p)) {
            return true;
        }
        var y = this.mapXtoY(p[0]);
        if (y == null) {
            return false;
        }
        return this.geo.snap0(y - p[1]) == 0;
    }

    public function toLine(): SegmentLine {
        // note: this won't work for arbitrary curves, because they could loop back on themselves,
        // but will work fine for curves that have already been split at all inflection points
        var p0 = this.p0;
        var p1 = this.p1;
        var p2 = this.p2;
        var p3 = this.p3;
        if (
            // vertical line
            (this.geo.snap0(p0[0] - p1[0]) == 0 &&
            this.geo.snap0(p0[0] - p2[0]) == 0 &&
            this.geo.snap0(p0[0] - p3[0]) == 0) || // horizontal line
            (this.geo.snap0(p0[1] - p1[1]) == 0 &&
            this.geo.snap0(p0[1] - p2[1]) == 0 &&
            this.geo.snap0(p0[1] - p3[1]) == 0)
        ) {
            return new SegmentLine(p0, p3, this.geo);
        }
        return null;
    }

    // Draw this segment for a receiver
    override public function draw<T:IPolyBoolReceiver>(ctx:T):T {
        var p0 = this.p0;
        var p1 = this.p1;
        var p2 = this.p2;
        var p3 = this.p3;
        ctx.moveTo(p0[0], p0[1]);
        ctx.bezierCurveTo(p1[0], p1[1], p2[0], p2[1], p3[0], p3[1]);
        return ctx;
    }
}

interface Segment {
    function start():Vec2;
    function start2():Vec2;
    function pointOn(p:Vec2):Bool;
    function point(t:Float):Vec2;
    function end():Vec2;
    function setStart(p:Vec2):Void;
    function setEnd(p:Vec2):Void;
    function isLine():Bool;
    //function mapXToY():Float;
}

class SegmentUtils {

    public static function projectPointOntoSegmentLine(p:Vec2, seg:SegmentLine):Float {
        var dx = seg.p1[0] - seg.p0[0];
        var dy = seg.p1[1] - seg.p0[1];
        var px = p[0] - seg.p0[0];
        var py = p[1] - seg.p0[1];
        var dist = dx * dx + dy * dy;
        var dot = px * dx + py * dy;
        return dot / dist;
    }

    public static function segmentLineIntersectSegmentLine(
        segA:SegmentLine,
        segB:SegmentLine,
        allowOutOfRange:Bool
    ):SegmentPairs {
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
        if (geo.snap0(axb) == 0) {
            // lines are coincident or parallel
            if (!geo.isCollinear(a0, a1, b0)) {
                // they're not coincident, so they're parallel, with no intersections
                return null;
            }
            // otherwise, segments are on top of each other somehow (aka coincident)
            var tB0onA = projectPointOntoSegmentLine(segB.p0, segA);
            var tB1onA = projectPointOntoSegmentLine(segB.p1, segA);
            var tAMin = geo.snap01(Math.min(tB0onA, tB1onA));
            var tAMax = geo.snap01(Math.max(tB0onA, tB1onA));
            if (tAMax < 0 || tAMin > 1) {
                return null;
            }

            var tA0onB = projectPointOntoSegmentLine(segA.p0, segB);
            var tA1onB = projectPointOntoSegmentLine(segA.p1, segB);
            var tBMin = geo.snap01(Math.min(tA0onB, tA1onB));
            var tBMax = geo.snap01(Math.max(tA0onB, tA1onB));
            if (tBMax < 0 || tBMin > 1) {
                return null;
            }

            return new SegmentTRangePairs(
                [Math.max(0, tAMin), Math.max(0, tBMin)],
                [Math.min(1, tAMax), Math.min(1, tBMax)]
            );
        }

        // otherwise, not coincident, so they intersect somewhere
        var dx = a0[0] - b0[0];
        var dy = a0[1] - b0[1];
        return new SegmentTValuePairsBuilder(allowOutOfRange, geo)
        .add((bdx * dy - bdy * dx) / axb, (adx * dy - ady * dx) / axb)
        .done();
    }

    public static function segmentLineIntersectSegmentCurve(
        segA:SegmentLine,
        segB:SegmentCurve,
        allowOutOfRange:Bool,
        invert:Bool
    ):SegmentTValuePairs {
        var geo = segA.geo;
        var a0 = segA.p0;
        var a1 = segA.p1;

        var A = a1[1] - a0[1];
        var B = a0[0] - a1[0];

        if (geo.snap0(B) == 0) {
            // vertical line
            var t = segB.mapXtoT(a0[0], false);
            if (t == null) {
                return null;
            }
            var y = segB.point(t)[1];
            var s = (y - a0[1]) / A;
            var result = new SegmentTValuePairsBuilder(allowOutOfRange, geo);
            if (invert) {
                result.add(t, s);
            } else {
                result.add(s, t);
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

        var roots = geo.solveCubic(rA, rB, rC, rD);

        var result = new SegmentTValuePairsBuilder(allowOutOfRange, geo);

        if (geo.snap0(A) == 0) {
            // project curve's X component onto line
            for (t in roots) {
                var X = bx[0] * t * t * t + bx[1] * t * t + bx[2] * t + bx[3];
                var s = (a0[0] - X) / B;
                if (invert) {
                    result.add(t, s);
                } else {
                    result.add(s, t);
                }
            }
        } else {
            // project curve's Y component onto line
            for (t in roots) {
                var Y = by[0] * t * t * t + by[1] * t * t + by[2] * t + by[3];
                var s = (Y - a0[1]) / A;
                if (invert) {
                    result.add(t, s);
                } else {
                    result.add(s, t);
                }
            }
        }

        return result.done();
    }


    public static function segmentCurveIntersectSegmentCurve(
        segA:SegmentCurve,
        segB:SegmentCurve,
        allowOutOfRange:Bool
    ):SegmentPairs {
        var geo = segA.geo;
        // dummy coincident calculation for now
        // TODO: implement actual range/equality testing
        if (geo.isEqualVec2(segA.p0, segB.p0)) {
            if (geo.isEqualVec2(segA.p3, segB.p3)) {
                if (
                geo.isEqualVec2(segA.p1, segB.p1) &&
                geo.isEqualVec2(segA.p2, segB.p2)
                ) {
                    return new SegmentTRangePairs([0, 0], [1, 1]);
                } else {
                    return new SegmentTValuePairs([
                        [0, 0],
                        [1, 1],
                    ]);
                }
            } else {
                return new SegmentTValuePairs([
                    [0, 0]
                ]);
            }
        } else if (geo.isEqualVec2(segA.p0, segB.p3)) {
            return new SegmentTValuePairs([
                [0, 1]
            ]);
        } else if (geo.isEqualVec2(segA.p3, segB.p0)) {
            return new SegmentTValuePairs([
                [1, 0]
            ]);
        } else if (geo.isEqualVec2(segA.p3, segB.p3)) {
            return new SegmentTValuePairs([
                [1, 1]
            ]);
        }
        var result = new SegmentTValuePairsBuilder(allowOutOfRange, geo);

        function checkCurves(
            c1:SegmentCurve,
            t1L:Float,
            t1R:Float,
            c2:SegmentCurve,
            t2L:Float,
            t2R:Float
        ) {
            var bbox1 = c1.boundingBox();
            var bbox2 = c2.boundingBox();

            if (!GeometryUtils.boundingBoxesIntersect(bbox1, bbox2)) {
                return;
            }

            var t1M = (t1L + t1R) / 2;
            var t2M = (t2L + t2R) / 2;

            if (geo.snap0(t1R - t1L) == 0 && geo.snap0(t2R - t2L) == 0) {
                result.add(t1M, t2M);
                return;
            }

            var c1Sides = c1.split([0.5]);
            var c1L = c1Sides[0];
            var c1R = c1Sides[1];
            var c2Sides = c2.split([0.5]);
            var c2L = c2Sides[0];
            var c2R = c2Sides[1];
            checkCurves(c1L, t1L, t1M, c2L, t2L, t2M);
            checkCurves(c1R, t1M, t1R, c2L, t2L, t2M);
            checkCurves(c1L, t1L, t1M, c2R, t2M, t2R);
            checkCurves(c1R, t1M, t1R, c2R, t2M, t2R);
        };

        checkCurves(segA, 0, 1, segB, 0, 1);
        return result.done();
    }

// return value:
//   null               => no intersection
//   SegmentTValuePairs => the segments intersect along a series of points, whose position is
//                         represented by T values pairs [segA_tValue, segB_tValue]
//                         note: a T value pair is returned even if it's just a shared vertex!
//   SegmentTRangePairs => the segments are coincident (on top of each other), and intersect along a
//                         segment, ranged by T values
    public static function segmentsIntersect(
        segA:Segment,
        segB:Segment,
        allowOutOfRange:Bool
    ):SegmentPairs {
        if (segA is SegmentLine) {
            if (segB is SegmentLine) {
                return segmentLineIntersectSegmentLine(cast segA, cast segB, allowOutOfRange);
            } else if (segB is SegmentCurve) {
                return segmentLineIntersectSegmentCurve(
                    cast segA,
                    cast segB,
                    allowOutOfRange,
                    false
                );
            }
        } else if (segA is SegmentCurve) {
            if (segB is SegmentLine) {
                return segmentLineIntersectSegmentCurve(
                    cast segB,
                    cast segA,
                    allowOutOfRange,
                    true
                );
            } else if (segB is SegmentCurve) {
                return segmentCurveIntersectSegmentCurve(cast segA, cast segB, allowOutOfRange);
            }
        }
        throw new Exception("PolyBool: Unknown segment instance in segmentsIntersect");
    }

    public static function reverse(seg:Segment):Segment {
        if (seg is SegmentLine) {
            return cast(seg, SegmentLine).reverse();
        } else {
            return cast(seg, SegmentCurve).reverse();
        }
    }
}

typedef IPolyBoolReceiver = {
    function beginPath():Void;
    function moveTo(x:Float, y:Float):Void;
    function lineTo(x:Float, y:Float):Void;
    function bezierCurveTo(
        cp1x:Float,
        cp1y:Float,
        cp2x:Float,
        cp2y:Float,
        x:Float,
        y:Float
    ):Void;
    function closePath():Void;
}
