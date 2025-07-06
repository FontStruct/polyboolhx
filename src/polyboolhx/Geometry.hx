//
// polybool - Boolean operations on polygons (union, intersection, etc)
// by Sean Connelly (@velipso), https://sean.fun
// Project Home: https://github.com/velipso/polybool
// SPDX-License-Identifier: 0BSD
//

package polyboolhx;

typedef PointVec = Array<Float>;
typedef Vec2 = PointVec;
typedef Vec6 = PointVec;

class GeometryUtils {
    public static function lerp(a:Float, b:Float, t:Float):Float {
        return a + (b - a) * t;
    }

    public static function lerpVec2(a:Vec2, b:Vec2, t:Float):Vec2 {
        return [lerp(a[0], b[0], t), lerp(a[1], b[1], t)];
    }

    public static function boundingBoxesIntersect(
        bbox1:Array<Vec2>,
        bbox2:Array<Vec2>
    ) {
        var b1min = bbox1[0];
        var b1max = bbox1[1];
        var b2min = bbox2[0];
        var b2max = bbox2[1];
        return !(
            b1min[0] > b2max[0] ||
            b1max[0] < b2min[0] ||
            b1min[1] > b2max[1] ||
            b1max[1] < b2min[1]
        );
    }
}

abstract class Geometry {
    public function new() { }

    public function snap0(v:Float):Float {
        throw "Abstract method must be overridden";
    }

    public function snap01(v:Float):Float {
        throw "Abstract method must be overridden";
    }

    public function isCollinear(p1:Vec2, p2:Vec2, p3:Vec2):Bool {
        throw "Abstract method must be overridden";
    }

    public function solveCubic(a:Float, b:Float, c:Float, d:Float):Array<Float> {
        throw "Abstract method must be overridden";
    }

    public function isEqualVec2(a:Vec2, b:Vec2):Bool {
        throw "Abstract method must be overridden";
    }

    public function compareVec2(a:Vec2, b:Vec2):Int {
        throw "Abstract method must be overridden";
    }

}

class GeometryEpsilon extends Geometry {
    public var epsilon:Float;

    public function new(epsilon = 0.0000000001) {
        super();
        this.epsilon = epsilon;
    }

    override public function snap0(v:Float):Float {
        if (Math.abs(v) < this.epsilon) {
            return 0;
        }
        return v;
    }

    override public function snap01(v:Float):Float {
        if (Math.abs(v) < this.epsilon) {
            return 0;
        }
        if (Math.abs(1 - v) < this.epsilon) {
            return 1;
        }
        return v;
    }

    override public function isCollinear(p1:Vec2, p2:Vec2, p3:Vec2):Bool {
        // does pt1->pt2->pt3 make a straight line?
        // essentially this is just checking to see if
        //   slope(pt1->pt2) === slope(pt2->pt3)
        // if slopes are equal, then they must be collinear, because they share pt2
        var dx1 = p1[0] - p2[0];
        var dy1 = p1[1] - p2[1];
        var dx2 = p2[0] - p3[0];
        var dy2 = p2[1] - p3[1];
        return Math.abs(dx1 * dy2 - dx2 * dy1) < epsilon;
    }

    private function solveCubicNormalized(a:Float, b:Float, c:Float):Array<Float> {
        // based somewhat on gsl_poly_solve_cubic from GNU Scientific Library
        var a3 = a / 3;
        var b3 = b / 3;
        var Q = a3 * a3 - b3;
        var R = a3 * (a3 * a3 - b / 2) + c / 2;

        if (Math.abs(R) < epsilon && Math.abs(Q) < epsilon) {
            return [-a3];
        }

        var F = a3 * (a3 * (4 * a3 * c - b3 * b) - 2 * b * c) + 4 * b3 * b3 * b3 + c * c;

        if (Math.abs(F) < epsilon) {
            var sqrtQ = Math.sqrt(Q);
            return if (R > 0)
                [-2 * sqrtQ - a / 3, sqrtQ - a / 3]
            else
                [-sqrtQ - a / 3, 2 * sqrtQ - a / 3];
        }

        var Q3 = Q * Q * Q;
        var R2 = R * R;

        if (R2 < Q3) {
            var ratio = (R < 0 ? -1 : 1) * Math.sqrt(R2 / Q3);
            var theta = Math.acos(ratio);
            var norm = -2 * Math.sqrt(Q);
            var x0 = norm * Math.cos(theta / 3) - a3;
            var x1 = norm * Math.cos((theta + 2 * Math.PI) / 3) - a3;
            var x2 = norm * Math.cos((theta - 2 * Math.PI) / 3) - a3;
            var res = [x0, x1, x2];
            res.sort(function(x, y) return Std.int(x - y));
            return res;
        } else {
            var A = (R < 0 ? 1 : -1) * Math.pow(Math.abs(R) + Math.sqrt(R2 - Q3), 1 / 3);
            var B = if (Math.abs(A) >= epsilon) Q / A else 0;
            return [A + B - a3];
        }
    }

    override public function solveCubic(a:Float, b:Float, c:Float, d:Float):Array<Float> {
        if (Math.abs(a) < epsilon) {
            if (Math.abs(b) < epsilon) {
                if (Math.abs(c) < epsilon) {
                    return Math.abs(d) < epsilon ? [0] : [];
                }
                return [-d / c];
            }
            var b2 = 2 * b;
            var D = c * c - 4 * b * d;

            if (Math.abs(D) < epsilon) {
                return [-c / b2];
            } else if (D > 0) {
                D = Math.sqrt(D);
                var res = [(-c + D) / b2, (-c - D) / b2];
                res.sort(function(x, y) return Std.int(x - y));
                return res;
            }

            return [];
        }

        return solveCubicNormalized(b / a, c / a, d / a);
    }


    override public function isEqualVec2(a:Vec2, b:Vec2):Bool {
        return (
            Math.abs(a[0] - b[0]) < this.epsilon &&
            Math.abs(a[1] - b[1]) < this.epsilon
        );
    }

    override public function compareVec2(a:Vec2, b:Vec2):Int {
        // returns -1 if a is smaller, 1 if b is smaller, 0 if equal
        if (Math.abs(b[0] - a[0]) < this.epsilon) {
            return Math.abs(b[1] - a[1]) < this.epsilon ? 0 : a[1] < b[1] ? -1 : 1;
        }
        return a[0] < b[0] ? -1 : 1;
    }
}
