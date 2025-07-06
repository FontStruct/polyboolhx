//
// polybool - Boolean operations on polygons (union, intersection, etc)
// by Sean Connelly (@velipso), https://sean.fun
// Project Home: https://github.com/velipso/polybool
// SPDX-License-Identifier: 0BSD
//

package polyboolhx;

import polyboolhx.Geometry;
import polyboolhx.Geometry.Vec2;
import polyboolhx.Geometry.Vec6;
import polyboolhx.Intersector.SegmentBool;
import polyboolhx.Intersector;
import polyboolhx.Intersector.IntersectorUtils;
import polyboolhx.SegmentSelector;
import polyboolhx.SegmentChainer;
import polyboolhx.Segment;
import haxe.Exception;
import polyboolhx.SegmentChainer.SegmentChainerUtils;

typedef ResultState = {
    state:String,
    ?segments:Array<SegmentBool>,
    ?selfIntersect:Intersector,
    ?regions:Array<Array<Segment>>
}

typedef PathState = {
    kind:String,
    ?start:Vec2,
    ?current:Vec2
}

class Shape {
    private var geo:Geometry;
    private var pathState:PathState = { kind: "beginPath" };
    public var resultState:ResultState;

    private var saveStack:Array<{matrix:Vec6}> = [];
    private var matrix:Vec6 = [1, 0, 0, 1, 0, 0];

    public function new(
        geo:Geometry,
        segments:Array<SegmentBool>
    ) {
        this.geo = geo;
        if (segments != null) {
            resultState = { state: "seg", segments: segments };
        } else {
            resultState = {
                state: "new",
                selfIntersect: new Intersector(true, this.geo),
            };
        }
    }

    public function setTransform(
        a:Float,
        b:Float,
        c:Float,
        d:Float,
        e:Float,
        f:Float
    ) {
        if (resultState.state != "new") {
            throw new Exception(
            "PolyBool: Cannot change shape after using it in an operation"
            );
        }
        this.matrix = [a, b, c, d, e, f];
        return this;
    }

    public function resetTransform() {
        this.matrix = [1, 0, 0, 1, 0, 0];
        return this;
    }

    public function getTransform() {
        if (resultState.state != "new") {
            throw new Exception(
            "PolyBool: Cannot change shape after using it in an operation"
            );
        }
//    const [a, b, c, d, e, f] = this.matrix;
//    return { a, b, c, d, e, f };
        return this.matrix;
    }

    public function transform(a:Float, b:Float, c:Float, d:Float, e:Float, f:Float) {
        var a0 = this.matrix[0];
        var b0 = this.matrix[1];
        var c0 = this.matrix[2];
        var d0 = this.matrix[3];
        var e0 = this.matrix[4];
        var f0 = this.matrix[5];
        this.matrix = [
            a0 * a + c0 * b,
            b0 * a + d0 * b,
            a0 * c + c0 * d,
            b0 * c + d0 * d,
            a0 * e + c0 * f + e0,
            b0 * e + d0 * f + f0,
        ];
        return this;
    }

    public function rotate(angle:Float) {
        var cos = Math.cos(angle);
        var sin = Math.sin(angle);
        var a0 = this.matrix[0];
        var b0 = this.matrix[1];
        var c0 = this.matrix[2];
        var d0 = this.matrix[3];
        var e0 = this.matrix[4];
        var f0 = this.matrix[5];
        this.matrix = [
            a0 * cos + c0 * sin,
            b0 * cos + d0 * sin,
            c0 * cos - a0 * sin,
            d0 * cos - b0 * sin,
            e0,
            f0,
        ];
        return this;
    }

    public function rotateDeg(angle:Float) {
        var sqrt1_2 = Math.sqrt(0.5);
        var ang = ((angle % 360) + 360) % 360;
        if (ang == 0) {
            return this;
        }
        var cos:Float = 0;
        var sin:Float = 0;
        if (ang == 90) {
            sin = 1;
        } else if (ang == 180) {
            cos = -1;
        } else if (ang == 270) {
            sin = -1;
        } else if (ang == 45) {
            cos = sin = sqrt1_2;
        } else if (ang == 135) {
            sin = sqrt1_2;
            cos = -sqrt1_2;
        } else if (ang == 225) {
            cos = sin = -sqrt1_2;
        } else if (ang == 315) {
            cos = sqrt1_2;
            sin = -sqrt1_2;
        } else if (ang == 30) {
            cos = Math.sqrt(3) / 2;
            sin = 0.5;
        } else if (ang == 60) {
            cos = 0.5;
            sin = Math.sqrt(3) / 2;
        } else if (ang == 120) {
            cos = -0.5;
            sin = Math.sqrt(3) / 2;
        } else if (ang == 150) {
            cos = -Math.sqrt(3) / 2;
            sin = 0.5;
        } else if (ang == 210) {
            cos = -Math.sqrt(3) / 2;
            sin = -0.5;
        } else if (ang == 240) {
            cos = -0.5;
            sin = -Math.sqrt(3) / 2;
        } else if (ang == 300) {
            cos = 0.5;
            sin = -Math.sqrt(3) / 2;
        } else if (ang == 330) {
            cos = Math.sqrt(3) / 2;
            sin = -0.5;
        } else {
            var rad = (Math.PI * ang) / 180;
            cos = Math.cos(rad);
            sin = Math.sin(rad);
        }
        var a0 = this.matrix[0];
        var b0 = this.matrix[1];
        var c0 = this.matrix[2];
        var d0 = this.matrix[3];
        var e0 = this.matrix[4];
        var f0 = this.matrix[5];
        this.matrix = [
            a0 * cos + c0 * sin,
            b0 * cos + d0 * sin,
            c0 * cos - a0 * sin,
            d0 * cos - b0 * sin,
            e0,
            f0,
        ];
        return this;
    }

    public function scale(sx:Float, sy:Float) {
        var a0 = this.matrix[0];
        var b0 = this.matrix[1];
        var c0 = this.matrix[2];
        var d0 = this.matrix[3];
        var e0 = this.matrix[4];
        var f0 = this.matrix[5];
        this.matrix = [a0 * sx, b0 * sx, c0 * sy, d0 * sy, e0, f0];
        return this;
    }

    public function translate(tx:Float, ty:Float) {
        var a0 = this.matrix[0];
        var b0 = this.matrix[1];
        var c0 = this.matrix[2];
        var d0 = this.matrix[3];
        var e0 = this.matrix[4];
        var f0 = this.matrix[5];
        this.matrix = [
            a0,
            b0,
            c0,
            d0,
            a0 * tx + c0 * ty + e0,
            b0 * tx + d0 * ty + f0,
        ];
        return this;
    }

    public function save() {
        if (resultState.state != "new") {
            throw new Exception(
            "PolyBool: Cannot change shape after using it in an operation"
            );
        }
        this.saveStack.push({ matrix: this.matrix });
        return this;
    }

    public function restore() {
        if (resultState.state != "new") {
            throw new Exception(
            "PolyBool: Cannot change shape after using it in an operation"
            );
        }
        var s = this.saveStack.pop();
        if (s != null) {
            this.matrix = s.matrix;
        }
        return this;
    }

    public function transformPoint(x:Float, y:Float):Vec2 {
        var a = this.matrix[0];
        var b = this.matrix[1];
        var c = this.matrix[2];
        var d = this.matrix[3];
        var e = this.matrix[4];
        var f = this.matrix[5];
        return [a * x + c * y + e, b * x + d * y + f];
    }

    public function beginPath() {
        if (resultState.state != "new") {
            throw new Exception(
            "PolyBool: Cannot change shape after using it in an operation"
            );
        }
        resultState.selfIntersect.beginPath();
        return this.endPath();
    }

    public function moveTo(x:Float, y:Float) {
        if (resultState.state != "new") {
            throw new Exception(
            "PolyBool: Cannot change shape after using it in an operation"
            );
        }
        if (pathState.kind != "beginPath") {
            this.beginPath();
        }
        var current = this.transformPoint(x, y);
        pathState = {
            kind: "moveTo",
            start: current,
            current: current,
        };
        return this;
    }

    public function lineTo(x:Float, y:Float) {
        if (resultState.state != "new") {
            throw new Exception(
            "PolyBool: Cannot change shape after using it in an operation"
            );
        }
        if (pathState.kind != "moveTo") {
            throw new Exception("PolyBool: Must call moveTo prior to calling lineTo");
        }
        var current = this.transformPoint(x, y);
        resultState.selfIntersect.addLine(pathState.current, current);
        pathState.current = current;
        return this;
    }

    public function rect(x:Float, y:Float, width:Float, height:Float) {
        return this.moveTo(x, y)
        .lineTo(x + width, y)
        .lineTo(x + width, y + height)
        .lineTo(x, y + height)
        .closePath()
        .moveTo(x, y);
    }

    public function bezierCurveTo(
        cp1x:Float,
        cp1y:Float,
        cp2x:Float,
        cp2y:Float,
        x:Float,
        y:Float
    ) {
        if (resultState.state != "new") {
            throw new Exception(
            "PolyBool: Cannot change shape after using it in an operation"
            );
        }
        if (pathState.kind != "moveTo") {
            throw new Exception(
            "PolyBool: Must call moveTo prior to calling bezierCurveTo"
            );
        }
        var current = this.transformPoint(x, y);
        resultState.selfIntersect.addCurve(
            pathState.current,
            this.transformPoint(cp1x, cp1y),
            this.transformPoint(cp2x, cp2y),
            current
        );
        pathState.current = current;
        return this;
    }

    public function closePath() {
        if (resultState.state != "new") {
            throw new Exception(
            "PolyBool: Cannot change shape after using it in an operation"
            );
        }
        // close with a line if needed
        if (
        pathState.kind == "moveTo" &&
        !geo.isEqualVec2(pathState.start, pathState.current)
        ) {
            resultState.selfIntersect.addLine(
                pathState.current,
                pathState.start
            );
            pathState.current = pathState.start;
        }
        resultState.selfIntersect.closePath();
        return this.endPath();
    }

    public function endPath() {
        if (resultState.state != "new") {
            throw new Exception(
            "PolyBool: Cannot change shape after using it in an operation"
            );
        }
        pathState = { kind: "beginPath" };
        return this;
    }

    private function selfIntersect() {
        if (resultState.state == "new") {
            resultState = {
                state: "seg",
                segments: resultState.selfIntersect.calculate(),
            };
        }
        return resultState.segments;
    }

    public function segments() {
        if (resultState.state != "reg") {
            var segs = this.selfIntersect();
            resultState = {
                state: "reg",
                segments: segs,
                regions: SegmentChainer.chain(segs, geo),
            };
        }
        return resultState.regions;
    }

    public function output<T:IPolyBoolReceiver>(
        receiver:T,
        matrix:Vec6 = null
    ):T {
        if (matrix == null) {
            matrix = [1, 0, 0, 1, 0, 0];
        }
        return SegmentChainerUtils.segmentsToReceiver(segments(), geo, receiver, matrix);
    }

    public function combine(shape:Shape) {
        var int = new Intersector(false, geo);
        for (seg in this.selfIntersect()) {
            int.addSegment(IntersectorUtils.copySegmentBool(seg), true);
        }
        for (seg in shape.selfIntersect()) {
            int.addSegment(IntersectorUtils.copySegmentBool(seg), false);
        }
        return new ShapeCombined(int.calculate(), geo);
    }
}

class ShapeCombined {
    private var geo:Geometry;
    public var segments:Array<SegmentBool>;

    public function new(
        segments:Array<SegmentBool>,
        geo:Geometry
    ) {
        this.geo = geo;
        this.segments = segments;
    }

    public function union() {
        return new Shape(
        geo,
        SegmentSelector.union(segments)
        );
    }

    public function intersect() {
        return new Shape(
        geo,
        SegmentSelector.intersect(segments)
        );
    }

    public function difference() {
        return new Shape(
        geo,
        SegmentSelector.difference(segments)
        );
    }

    public function differenceRev() {
        return new Shape(
        geo,
        SegmentSelector.differenceRev(segments)
        );
    }

    public function xor() {
        return new Shape(
        geo,
        SegmentSelector.xor(segments)
        );
    }
}
