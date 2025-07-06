//
// polybool - Boolean operations on polygons (union, intersection, etc)
// by Sean Connelly (@velipso), https://sean.fun
// Project Home: https://github.com/velipso/polybool
// SPDX-License-Identifier: 0BSD
//

package polyboolhx;

import polyboolhx.Geometry.Vec2;
import polyboolhx.Geometry;
import polyboolhx.BuildLog.BuildLog;
import polyboolhx.Segment;
import polyboolhx.Segment.SegmentLine;
import polyboolhx.Segment.SegmentCurve;
import haxe.Exception;
import polyboolhx.BuildLog;

typedef SegmentBoolFill = {
    var above:Null<Bool>;
    var below:Null<Bool>;
}

typedef ListBoolTransition<T> = {
    var before:Null<T>;
    var after:Null<T>;
    var insert:(node:T) -> T;
}

//interface SegmentBool {
//    var id:Int;
//    var myFill:SegmentBoolFill;
//    var otherFill:SegmentBoolFill;
//    var closed:Bool;
//}

class SegmentBool {
    public var id:Int;
    public var data:Segment;
    public var myFill:SegmentBoolFill;
    public var otherFill:SegmentBoolFill = null;
    public var closed:Bool;

    public function new(
        data:Segment,
        fill:SegmentBoolFill = null,
        closed = false
    ) {
        this.id = -1;
        this.id = BuildLog.log.segmentId();
        this.data = data;
        this.myFill = {
            above: (fill != null && fill.above != null) ? fill.above : null,
            below: (fill != null && fill.below != null) ? fill.below : null,
        };
        this.closed = closed;
    }


    public function get_data() {
        return this.data;
    }
}
//
//class SegmentBoolLine extends SegmentBoolBase<SegmentLine> implements SegmentBool {
//}
//class SegmentBoolCurve extends SegmentBoolBase<SegmentCurve> implements SegmentBool {
//
//}

class IntersectorUtils {

    public static function copySegmentBool(
        seg:SegmentBool
    ):SegmentBool {
        return new SegmentBool(seg.data, seg.myFill, seg.closed);
    }

    public static function sign(f:Float):Int {
        return f > 0 ? 1 : (f < 0 ? -1 : 0);
    }
}

class EventBool {
    public var isStart:Bool;
    public var p:Vec2;
    public var seg:SegmentBool;
    public var primary:Bool;
    public var other:EventBool;
    public var status:EventBool = null;

    public function new(isStart:Bool, p:Vec2, seg:SegmentBool, primary:Bool) {
        this.isStart = isStart;
        this.p = p;
        this.seg = seg;
        this.primary = primary;
    }
}

class ListBool<T> {
    public var nodes:Array<T> = [];

    public function new() {

    }

    public function remove(node:T) {
        var i = this.nodes.indexOf(node);
        if (i >= 0) {
            this.nodes.splice(i, 1);
        }
    }

    public function getIndex(node:T) {
        return this.nodes.indexOf(node);
    }

    public function isEmpty() {
        return this.nodes.length <= 0;
    }

    public function getHead() {
        return this.nodes[0];
    }

    public function removeHead() {
        this.nodes.shift();
    }

    public function insertBefore(node:T, check:(node: T) -> Float) {
        this.findTransition(node, check).insert(node);
    }

    public function findTransition(node:T, check:(node: T) -> Float):ListBoolTransition<T> {
        // T could be EventBool

        // bisect to find the transition point
        var compare = (a:T, b:T) -> check(b) - check(a);
        var i = 0;
        var high = this.nodes.length;
        while (i < high) {
            var mid = (i + high) >> 1;
            if (compare(this.nodes[mid], node) > 0) {
                high = mid;
            } else {
                i = mid + 1;
            }
        }
        return {
            before: i <= 0 ? null : (this.nodes[i - 1] != null ? this.nodes[i - 1] : null),
            after: this.nodes[i] != null ? this.nodes[i] : null,
            insert: (node:T) -> {
                this.nodes.insert(i, node);
                return node;
            },
        };
    }
}

class Intersector {
    private var selfIntersection:Bool;
    private var geo:Geometry;
    private var events = new ListBool<EventBool>();
    private var status = new ListBool<EventBool>();
    public var currentPath:Array<SegmentBool> = [];

    public function new(
        selfIntersection:Bool,
        geo:Geometry
    ) {
        this.selfIntersection = selfIntersection;
        this.geo = geo;
    }

    public function compareEvents(
        aStart:Bool,
        a1:Vec2,
        a2:Vec2,
        aSeg:Segment,
        bStart:Bool,
        b1:Vec2,
        b2:Vec2,
        bSeg:Segment
    ):Float {
        // compare the selected points first
        var comp = this.geo.compareVec2(a1, b1);
        if (comp != 0) {
            return comp;
        }
        // the selected points are the same

        if (
        aSeg is SegmentLine &&
        bSeg is SegmentLine &&
        this.geo.isEqualVec2(a2, b2)
        ) {
            // if the non-selected points are the same too...
            return 0; // then the segments are equal
        }

        if (aStart != bStart) {
            // if one is a start and the other isn't...
            return aStart ? 1 : -1; // favor the one that isn't the start
        }

        return this.compareSegments(bSeg, aSeg);
    }

    public function addEvent(ev:EventBool) {
        this.events.insertBefore(ev, (here:EventBool) -> {
            if (here == ev) {
                return 0;
            }
            return this.compareEvents(
                ev.isStart,
                ev.p,
                ev.other.p,
                ev.seg.data,
                here.isStart,
                here.p,
                here.other.p,
                here.seg.data
            );
        });
    }

    public function divideEvent(ev:EventBool, t:Float, p:Vec2) {
        BuildLog.log.segmentDivide(ev.seg, p);

        var left:Segment = null;
        var right:Segment = null;
        if (ev.seg.data.isLine()) {
            var parts = cast(ev.seg.data, SegmentLine).split([t]);
            left = parts[0];
            right = parts[1];
        } else {
            var parts = cast(ev.seg.data, SegmentCurve).split([t]);
            left = parts[0];
            right = parts[1];
        }
        // set the *exact* intersection point
        left.setEnd(p);
        right.setStart(p);
        var ns:SegmentBool = new SegmentBool(right, ev.seg.myFill, ev.seg.closed);
        // slides an end backwards
        //   (start)------------(end)    to:
        //   (start)---(end)
        this.events.remove(ev.other);
        ev.seg.data = left;
        BuildLog.log.segmentChop(ev.seg);
        ev.other.p = p;
        this.addEvent(ev.other);
        return this.addSegment(ns, ev.primary);
    }

    public function beginPath() {
        this.currentPath = [];
    }

    public function closePath() {
        for (seg in this.currentPath) {
            seg.closed = true;
        }
    }

    public function addSegment(seg:SegmentBool, primary:Bool) {
        var evStart = new EventBool(true, seg.data.start(), seg, primary);
        var evEnd = new EventBool(false, seg.data.end(), seg, primary);
        evStart.other = evEnd;
        evEnd.other = evStart;
        this.addEvent(evStart);
        this.addEvent(evEnd);
        return evStart;
    }

    public function addLine(from:Vec2, to:Vec2, primary = true) {
        var f = this.geo.compareVec2(from, to);
        if (f == 0) {
            // points are equal, so we have a zero-length segment
            return; // skip it
        }
        var seg = new SegmentBool(
            new SegmentLine(f < 0 ? from : to, f < 0 ? to : from, this.geo),
            null,
            false
        );
        this.currentPath.push(seg);
        this.addSegment(seg, primary);
    }

    public function addCurve(from:Vec2, c1:Vec2, c2:Vec2, to:Vec2, primary = true) {
        var original = new SegmentCurve(from, c1, c2, to, this.geo);
        var curves = original.split(original.inflectionTValues());
        for (curve in curves) {
            var f = this.geo.compareVec2(curve.start(), curve.end());
            if (f == 0) {
                // points are equal AFTER splitting... this only happens for zero-length segments
                continue; // skip it
            }
            // convert horizontal/vertical curves to lines
            var line = curve.toLine();
            if (line != null) {
                this.addLine(line.p0, line.p1, primary);
            } else {
                var seg = new SegmentBool(
                f < 0 ? curve : curve.reverse(),
                null,
                false
                );
                this.currentPath.push(seg);
                this.addSegment(seg, primary);
            }
        }
    }

    public function compareSegments(seg1:Segment, seg2:Segment):Float {
        // TODO:
        //  This is where some of the curve instability comes from... we need to reliably sort
        //  segments, but this is surprisingly hard when it comes to curves.
        //
        //  The easy case is something like:
        //
        //             C   A - - - D
        //               \
        //                 \
        //                   B
        //  A is clearly above line C-B, which is easily calculated... however, once curves are
        //  introduced, it's not so obvious without using some heuristic which will fail at times.
        //
        var A = seg1.start();
        var B = seg2.start2();
        var C = seg2.start();
        if (seg2.pointOn(A)) {
            // A intersects seg2 somehow (possibly sharing a start point, or maybe just splitting it)
            //
            //   AC - - - - D
            //      \
            //        \
            //          B
            //
            // so grab seg1's second point (D) instead
            A = seg1.start2();
            if (seg2.pointOn(A)) {
                if (seg1 is SegmentLine) {
                    if (seg2 is SegmentLine) {
                        // oh... D is on the line too... so these are the same
                        return 0;
                    }
                    if (seg2 is SegmentCurve) {
                        A = seg1.point(0.5); // TODO: ???
                    }
                }
                if (seg1 is SegmentCurve) {
                    A = seg1.end();
                }
            }
            if (seg2 is SegmentCurve) {
                if (
                this.geo.snap0(A[0] - C[0]) == 0 &&
                this.geo.snap0(B[0] - C[0]) == 0
                ) {
                    // seg2 is a curve, but the tangent line (C-B) at the start point is vertical, and
                    // collinear with A... so... just sort based on the Y values I guess?
                    return IntersectorUtils.sign(C[1] - A[1]);
                }
            }
        } else {
            if (seg2 is SegmentCurve) {
                // find seg2's position at A[0] and see if it's above or below A[1]
                var y = cast(seg2, SegmentCurve).mapXtoY(A[0], true);
                if (y != null) {
                    return IntersectorUtils.sign(y - A[1]);
                }
            }
            if (seg1 is SegmentCurve) {
                // unfortunately, in order to sort against curved segments, we need to check the
                // intersection point... this means a lot more intersection tests, but I'm not sure how else
                // to sort correctly
                var i = SegmentUtils.segmentsIntersect(seg1, seg2, true);
                if (i != null && i is SegmentTValuePairs) {
                    // find the intersection point on seg1
                    for (pair in cast(i, SegmentTValuePairs).tValuePairs) {
                        var t = this.geo.snap01(pair[0]);
                        if (t > 0 && t < 1) {
                            B = seg1.point(t);
                            break;
                        }
                    }
                }
            }
        }

        // fallthrough to this calculation which determines if A is on one side or another of C-B
        var Ax = A[0];
        var Ay = A[1];
        var Bx = B[0];
        var By = B[1];
        var Cx = C[0];
        var Cy = C[1];
        return IntersectorUtils.sign((Bx - Ax) * (Cy - Ay) - (By - Ay) * (Cx - Ax));
    }

    public function statusFindSurrounding(ev:EventBool) {
        return this.status.findTransition(ev, (here:EventBool) -> {
            if (ev == here) {
                return 0;
            }
            var c = this.compareSegments(ev.seg.data, here.seg.data);
            return c == 0 ? -1 : c;
        });
    }

    public function checkIntersection(ev1:EventBool, ev2:EventBool):EventBool {
        // returns the segment equal to ev1, or null if nothing equal
        var seg1 = ev1.seg;
        var seg2 = ev2.seg;

        BuildLog.log.checkIntersection(seg1, seg2);

        var i = SegmentUtils.segmentsIntersect(seg1.data, seg2.data, false);

        if (i == null) {
            // no intersections
            return null;
        } else if (i is SegmentTRangePairs) {
            var rpairs = cast(i, SegmentTRangePairs);
            // segments are parallel or coincident
            var tA1 = rpairs.tStart[0];
            var tB1 = rpairs.tStart[1];
            var tA2 = rpairs.tEnd[0];
            var tB2 = rpairs.tEnd[1];

            if (
            (tA1 == 1 && tA2 == 1 && tB1 == 0 && tB2 == 0) ||
            (tA1 == 0 && tA2 == 0 && tB1 == 1 && tB2 == 1)
            ) {
                return null; // segments touch at endpoints... no intersection
            }

            if (tA1 == 0 && tA2 == 1 && tB1 == 0 && tB2 == 1) {
                return ev2; // segments are exactly equal
            }

            var a1 = seg1.data.start();
            var a2 = seg1.data.end();
            var b2 = seg2.data.end();

            if (tA1 == 0 && tB1 == 0) {
                if (tA2 == 1) {
                    //  (a1)---(a2)
                    //  (b1)----------(b2)
                    this.divideEvent(ev2, tB2, a2);
                } else {
                    //  (a1)----------(a2)
                    //  (b1)---(b2)
                    this.divideEvent(ev1, tA2, b2);
                }
                return ev2;
            } else if (tB1 > 0 && tB1 < 1) {
                if (tA2 == 1 && tB2 == 1) {
                    //         (a1)---(a2)
                    //  (b1)----------(b2)
                    this.divideEvent(ev2, tB1, a1);
                } else {
                    // make a2 equal to b2
                    if (tA2 == 1) {
                        //         (a1)---(a2)
                        //  (b1)-----------------(b2)
                        this.divideEvent(ev2, tB2, a2);
                    } else {
                        //         (a1)----------(a2)
                        //  (b1)----------(b2)
                        this.divideEvent(ev1, tA2, b2);
                    }
                    //         (a1)---(a2)
                    //  (b1)----------(b2)
                    this.divideEvent(ev2, tB1, a1);
                }
            }
            return null;
        } else if (i is SegmentTValuePairs) {
            var stvp = cast(i, SegmentTValuePairs);
            if (stvp.tValuePairs.length <= 0) {
                return null;
            }
            // process a single intersection

            // skip intersections where endpoints meet
            var minPair = stvp.tValuePairs[0];
            var j = 1;
            while (
            j < stvp.tValuePairs.length &&
            ((minPair[0] == 0 && minPair[1] == 0) ||
            (minPair[0] == 0 && minPair[1] == 1) ||
            (minPair[0] == 1 && minPair[1] == 0) ||
            (minPair[0] == 1 && minPair[1] == 1))
            ) {
                minPair = stvp.tValuePairs[j];
                j++;
            }
            var tA = minPair[0];
            var tB = minPair[1];

            // even though *in theory* seg1.data.point(tA) == seg2.data.point(tB), that isn't exactly
            // correct in practice because intersections aren't exact... so we need to calculate a single
            // intersection point that everyone can share

            var p: Vec2;

            if (tB == 0) {
                p = seg2.data.start();
            } else if (tB == 1) {
                p = seg2.data.end();
            } else if (tA == 0) {
                p = seg1.data.start();
            } else if (tA == 1) {
                p = seg1.data.end();
            } else {
                p = seg1.data.point(tA);
            }

            // is A divided between its endpoints? (exclusive)
            if (tA > 0 && tA < 1) {
                this.divideEvent(ev1, tA, p);
            }
            // is B divided between its endpoints? (exclusive)
            if (tB > 0 && tB < 1) {
                this.divideEvent(ev2, tB, p);
            }
            return null;
        }
        throw new Exception("PolyBool: Unknown intersection type");
    }

    public function calculate() {
        var segments:Array<SegmentBool> = [];
        while (!this.events.isEmpty()) {
            var ev = this.events.getHead();

            BuildLog.log.vert(ev.p[0]);


            if (ev.isStart) {
                BuildLog.log.segmentNew(ev.seg, ev.primary);

                var surrounding = this.statusFindSurrounding(ev);
                var above = surrounding.before;
                var below = surrounding.after;

                BuildLog.log.tempStatus(
                    ev.seg,
                    above != null? above.seg : null,
                    below != null? below.seg : null
                );

                var checkBothIntersections = () -> {
                    if (above != null) {
                        var eve = this.checkIntersection(ev, above);
                        if (eve != null) {
                            return eve;
                        }
                    }
                    if (below != null) {
                        return this.checkIntersection(ev, below);
                    }
                    return null;
                };

                var eve = checkBothIntersections();
                if (eve != null) {
                    // ev and eve are equal
                    // we'll keep eve and throw away ev

                    // merge ev.seg's fill information into eve.seg

                    if (this.selfIntersection) {
                        var toggle:Bool; // are we a toggling edge?
                        if (ev.seg.myFill.below == null) {
                            toggle = ev.seg.closed;
                        } else {
                            toggle = ev.seg.myFill.above != ev.seg.myFill.below;
                        }

                        // merge two segments that belong to the same polygon
                        // think of this as sandwiching two segments together, where
                        // `eve.seg` is the bottom -- this will cause the above fill flag to
                        // toggle
                        if (toggle) {
                            eve.seg.myFill.above = !eve.seg.myFill.above;
                        }
                    } else {
                        // merge two segments that belong to different polygons
                        // each segment has distinct knowledge, so no special logic is
                        // needed
                        // note that this can only happen once per segment in this phase,
                        // because we are guaranteed that all self-intersections are gone
                        eve.seg.otherFill = ev.seg.myFill;
                    }

                    BuildLog.log.segmentUpdate(eve.seg);

                    this.events.remove(ev.other);
                    this.events.remove(ev);
                }

                if (this.events.getHead() != ev) {
                    // something was inserted before us in the event queue, so loop back
                    // around and process it before continuing
                    BuildLog.log.rewind(ev.seg);
                    continue;
                }

                //
                // calculate fill flags
                //
                if (this.selfIntersection) {
                    var toggle:Bool; // are we a toggling edge?
                    if (ev.seg.myFill.below == null) {
                        // if we are new then we toggle if we're part of a closed path
                        toggle = ev.seg.closed;
                    } else {
                        // we are a segment that has previous knowledge from a division
                        // calculate toggle
                        toggle = ev.seg.myFill.above != ev.seg.myFill.below;
                    }

                    // next, calculate whether we are filled below us
                    if (below == null) {
                        // if nothing is below us, then we're not filled
                        ev.seg.myFill.below = false;
                    } else {
                        // otherwise, we know the answer -- it's the same if whatever is
                        // below us is filled above it
                        ev.seg.myFill.below = below.seg.myFill.above;
                    }

                    // since now we know if we're filled below us, we can calculate
                    // whether we're filled above us by applying toggle to whatever is
                    // below us
                    ev.seg.myFill.above = toggle
                    ? !ev.seg.myFill.below
                    : ev.seg.myFill.below;
                } else {
                    // now we fill in any missing transition information, since we are
                    // all-knowing at this point

                    if (ev.seg.otherFill == null) {
                        // if we don't have other information, then we need to figure out if
                        // we're inside the other polygon
                        var inside:Null<Bool>;
                        if (below == null) {
                            // if nothing is below us, then we're not filled
                            inside = false;
                        } else {
                            // otherwise, something is below us
                            // so copy the below segment's other polygon's above
                            if (ev.primary == below.primary) {
                                if (below.seg.otherFill == null) {
                                    throw new Exception(
                                    "PolyBool: Unexpected state of otherFill (null)"
                                    );
                                }
                                inside = below.seg.otherFill.above;
                            } else {
                                inside = below.seg.myFill.above;
                            }
                        }
                        ev.seg.otherFill = {
                            above: inside,
                            below: inside,
                        };
                    }
                }
                BuildLog.log.status(
                    ev.seg,
                    above != null? above.seg : null,
                    below != null? below.seg : null
                );
                // insert the status and remember it for later removal
                ev.other.status = surrounding.insert(ev);
            } else {
                // end
                var st = ev.status;

                if (st == null) {
                    throw new Exception(
                    "PolyBool: Zero-length segment detected; your epsilon is " +
                    "probably too small or too large"
                    );
                }

                // removing the status will create two new adjacent edges, so we'll need
                // to check for those
                var i = this.status.getIndex(st);
                if (i > 0 && i < this.status.nodes.length - 1) {
                    var before = this.status.nodes[i - 1];
                    var after = this.status.nodes[i + 1];
                    this.checkIntersection(before, after);
                }

                BuildLog.log.statusRemove(st.seg);

                // remove the status
                this.status.remove(st);

                // if we've reached this point, we've calculated everything there is to
                // know, so save the segment for reporting
                if (!ev.primary) {
                    // make sure `seg.myFill` actually points to the primary polygon
                    // though
                    if (ev.seg.otherFill == null) {
                        throw new Exception("PolyBool: Unexpected state of otherFill (null)");
                    }
                    var s = ev.seg.myFill;
                    ev.seg.myFill = ev.seg.otherFill;
                    ev.seg.otherFill = s;
                }
                segments.push(ev.seg);
            }

            // remove the event and continue
            this.events.removeHead();
        }

        BuildLog.log.done();

        return segments;
    }
}
