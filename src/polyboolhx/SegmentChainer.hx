//
// polybool - Boolean operations on polygons (union, intersection, etc)
// by Sean Connelly (@velipso), https://sean.fun
// Project Home: https://github.com/velipso/polybool
// SPDX-License-Identifier: 0BSD
//

package polyboolhx;

import polyboolhx.Geometry.Vec6;
import polyboolhx.Geometry;
import polyboolhx.Intersector.SegmentBool;
import polyboolhx.BuildLog;
import polyboolhx.Segment;
import polyboolhx.Segment.SegmentLine;
import polyboolhx.Segment.SegmentCurve;
import haxe.Exception;
using Lambda;

//
// converts a list of segments into a list of regions, while also removing
// unnecessary verticies
//


typedef SegMatch = {
    index:Int,
    matchesHead:Bool,
    matchesPt1:Bool
}

typedef ISegsFill = {
    segs:Array<Segment>,
    fill:Bool
}

class SegmentChainerUtils {

    public static function joinLines(
        seg1:SegmentLine,
        seg2:SegmentLine,
        geo:Geometry
    ):SegmentLine {
        if (geo.isCollinear(seg1.p0, seg1.p1, seg2.p1)) {
            return new SegmentLine(seg1.p0, seg2.p1, geo);
        }
        return null;
    }

    // return NULL or SegmentCurve (was false … hmm)
    public static function joinCurves(
        seg1:SegmentCurve,
        seg2:SegmentCurve,
        geo:Geometry
    ):SegmentCurve {
        if (geo.isCollinear(seg1.p2, seg1.p3, seg2.p1)) {
            var dx = seg2.p1[0] - seg1.p2[0];
            var dy = seg2.p1[1] - seg1.p2[1];
            var t =
            Math.abs(dx) > Math.abs(dy)
            ? (seg1.p3[0] - seg1.p2[0]) / dx
            : (seg1.p3[1] - seg1.p2[1]) / dy;
            var ts = geo.snap01(t);
            if (ts != 0 && ts != 1) {
                var ns = new SegmentCurve(
                seg1.p0,
                [
                    seg1.p0[0] + (seg1.p1[0] - seg1.p0[0]) / t,
                    seg1.p0[1] + (seg1.p1[1] - seg1.p0[1]) / t,
                ],
                [
                    seg2.p2[0] - (t * (seg2.p3[0] - seg2.p2[0])) / (1 - t),
                    seg2.p2[1] - (t * (seg2.p3[1] - seg2.p2[1])) / (1 - t),
                ],
                seg2.p3,
                geo
                );
                // double check that if we split at T, we get seg1/seg2 back
                var split = ns.split([t]);
                var left = split[0];
                var right = split[1];
                if (left.isEqual(seg1) && right.isEqual(seg2)) {
                    return ns;
                }
            }
        }
        return null;
    }

    // return NULL or Segment (was false … hmm)
    public static function joinSegments(
        seg1:Segment,
        seg2:Segment,
        geo:Geometry
    ):Segment {
        if (seg1 == seg2) {
            return null;
        }
        if (seg1 is SegmentLine && seg2 is SegmentLine) {
            return joinLines(cast seg1, cast seg2, geo);
        }
        if (seg1 is SegmentCurve && seg2 is SegmentCurve) {
            return joinCurves(cast seg1, cast seg2, geo);
        }
        return null;
    }

    public static function segmentsToReceiver<T:IPolyBoolReceiver>(
        segments:Array<Array<Segment>>,
        geo:Geometry,
        receiver:T,
        matrix:Vec6
    ):T {
        var a = matrix[0];
        var b = matrix[1];
        var c = matrix[2];
        var d = matrix[3];
        var e = matrix[4];
        var f = matrix[5];
        receiver.beginPath();
        for (region in segments) {
            if (region.length <= 0) {
                continue;
            }
            for (i in 0...region.length) {
                var seg = region[i];
                if (i == 0) {
                    var p0x = seg.start()[0];
                    var p0y = seg.start()[1];
                    receiver.moveTo(a * p0x + c * p0y + e, b * p0x + d * p0y + f);
                }
                if (seg is SegmentLine) {
                    var line = cast(seg, SegmentLine);
                    var p1x = line.p1[0];
                    var p1y = line.p1[1];
                    receiver.lineTo(a * p1x + c * p1y + e, b * p1x + d * p1y + f);
                } else if (seg is SegmentCurve) {
                    var curve = cast(seg, SegmentCurve);
                    var p1x = curve.p1[0];
                    var p1y = curve.p1[1];
                    var p2x = curve.p2[0];
                    var p2y = curve.p2[1];
                    var p3x = curve.p3[0];
                    var p3y = curve.p3[1];
                    receiver.bezierCurveTo(
                        a * p1x + c * p1y + e,
                        b * p1x + d * p1y + f,
                        a * p2x + c * p2y + e,
                        b * p2x + d * p2y + f,
                        a * p3x + c * p3y + e,
                        b * p3x + d * p3y + f
                    );
                } else {
                    throw new Exception("PolyBool: Unknown segment instance");
                }
            }
            var first = region[0];
            var last = region[region.length - 1];
            if (geo.isEqualVec2(first.start(), last.end())) {
                receiver.closePath();
            }
        }
        return receiver;
    }
}


class SegmentChainer {
    public static function chain(
        segments:Array<SegmentBool>,
        geo:Geometry
    ):Array<Array<Segment>> {
        var closedChains:Array<ISegsFill> = [];
        var openChains:Array<ISegsFill> = [];
        var regions:Array<Array<Segment>> = [];

        for (segb in segments) {
            var seg = segb.data;
            var closed = segb.closed;
            var chains = closed ? closedChains : openChains;
            var pt1 = seg.start();
            var pt2 = seg.end();

            function reverseChain(index:Int) {
                BuildLog.log.chainReverse(index, closed);
                var newChain:Array<Segment> = [];
                for (seg in chains[index].segs) {
                    newChain.unshift(SegmentUtils.reverse(seg));
                }
                chains[index] = {
                    segs: newChain,
                    fill: !chains[index].fill
                };
                return newChain;
            }

            if (seg is SegmentLine && geo.isEqualVec2(pt1, pt2)) {
                BuildLog.log.info(
                    "PolyBool: Warning: Zero-length segment detected; your epsilon is " +
                    "probably too small or too large"
                );
                continue;
            }

            BuildLog.log.chainStart({seg: seg, fill: segb.myFill.above == true }, closed);

            // search for two chains that this segment matches
            var firstMatch:SegMatch = {
                index: 0,
                matchesHead: false,
                matchesPt1: false,
            };
            var secondMatch:SegMatch = {
                index: 0,
                matchesHead: false,
                matchesPt1: false,
            };
            var nextMatch:SegMatch = firstMatch;
            function setMatch(
                index:Int,
                matchesHead:Bool,
                matchesPt1:Bool
            ) {
                // return true if we've matched twice
                if (nextMatch != null) {
                    nextMatch.index = index;
                    nextMatch.matchesHead = matchesHead;
                    nextMatch.matchesPt1 = matchesPt1;
                }
                if (nextMatch == firstMatch) {
                    nextMatch = secondMatch;
                    return false;
                }
                nextMatch = null;
                return true; // we've matched twice, we're done here
            }
            for (i in 0...chains.length) {
                var chain = chains[i].segs;
                var head = chain[0].start();
                var tail = chain[chain.length - 1].end();
                if (geo.isEqualVec2(head, pt1)) {
                    if (setMatch(i, true, true)) {
                        break;
                    }
                } else if (geo.isEqualVec2(head, pt2)) {
                    if (setMatch(i, true, false)) {
                        break;
                    }
                } else if (geo.isEqualVec2(tail, pt1)) {
                    if (setMatch(i, false, true)) {
                        break;
                    }
                } else if (geo.isEqualVec2(tail, pt2)) {
                    if (setMatch(i, false, false)) {
                        break;
                    }
                }
            }
            if (nextMatch == firstMatch) {
                // we didn't match anything, so create a new chain
                var fill = segb.myFill.above == true;
                chains.push({segs: [seg], fill: fill});
                BuildLog.log.chainNew({ seg: seg, fill: fill }, closed);
            } else if (nextMatch == secondMatch) {
                // we matched a single chain
                var index = firstMatch.index;
                BuildLog.log.chainMatch(index, closed);

                // add the other point to the appropriate end
                var chain = chains[index].segs;
                var fill = chains[index].fill;
                if (firstMatch.matchesHead) {
                    if (firstMatch.matchesPt1) {
                        seg = SegmentUtils.reverse(seg);
                        BuildLog.log.chainAddHead(index, { seg: seg, fill: fill }, closed);
                        chain.unshift(seg);
                    } else {
                        BuildLog.log.chainAddHead(index, { seg: seg, fill: fill }, closed);
                        chain.unshift(seg);
                    }
                } else {
                    if (firstMatch.matchesPt1) {
                        BuildLog.log.chainAddTail(index, { seg: seg, fill: fill }, closed);
                        chain.push(seg);
                    } else {
                        seg = SegmentUtils.reverse(seg);
                        BuildLog.log.chainAddTail(index, { seg: seg, fill: fill }, closed);
                        chain.push(seg);
                    }
                }

                // simplify chain
                if (firstMatch.matchesHead) {
                    var next = chain[1];
                    var newSeg = SegmentChainerUtils.joinSegments(seg, next, geo);
                    if (newSeg != null) {
                        chain.shift();
                        chain[0] = newSeg;
                        BuildLog.log.chainSimplifyHead(index, { seg: newSeg, fill: fill }, closed);
                    }
                } else {
                    var next = chain[chain.length - 2];
                    var newSeg = SegmentChainerUtils.joinSegments(next, seg, geo);
                    if (newSeg != null) {
                        chain.pop();
                        chain[chain.length - 1] = newSeg;
                        BuildLog.log.chainSimplifyTail(index, { seg: newSeg, fill: fill }, closed);
                    }
                }

                // check for closed chain
                if (closed) {
                    var finalChain = chain;
                    var segS = finalChain[0];
                    var segE = finalChain[finalChain.length - 1];
                    if (
                        finalChain.length > 0 &&
                        geo.isEqualVec2(segS.start(), segE.end())
                    ) {
                        // see if chain is clockwise
                        var winding:Float = 0;
                        var last = finalChain[0].start();
                        for (seg in finalChain) {
                            var here = seg.end();
                            winding += here[1] * last[0] - here[0] * last[1];
                            last = here;
                        }
                        // this assumes Cartesian coordinates (Y is positive going up)
                        var isClockwise = winding < 0;
                        if (isClockwise == fill) {
                            finalChain = reverseChain(index);
                            segS = finalChain[0];
                            segE = finalChain[finalChain.length - 1];
                        }

                        var newStart = SegmentChainerUtils.joinSegments(segE, segS, geo);
                        if (newStart != null) {
                            finalChain.pop();
                            finalChain[0] = newStart;
                            BuildLog.log.chainSimplifyClose(index, { seg: newStart, fill: fill }, closed);
                        }

                        // we have a closed chain!
                        BuildLog.log.chainClose(index, closed);
                        chains.splice(index, 1);
                        regions.push(finalChain);
                    }
                }
            } else {
                // otherwise, we matched two chains, so we need to combine those chains together
                var appendChain = (index1:Int, index2:Int) -> {
                    // index1 gets index2 appended to it, and index2 is removed
                    var chain1 = chains[index1].segs;
                    var fill = chains[index1].fill;
                    var chain2 = chains[index2].segs;

                    // add seg to chain1's tail
                    BuildLog.log.chainAddTail(index1, { seg: seg, fill: fill }, closed);
                    chain1.push(seg);

                    // simplify chain1's tail
                    var next = chain1[chain1.length - 2];
                    var newEnd = SegmentChainerUtils.joinSegments(next, seg, geo);
                    if (newEnd != null) {
                        chain1.pop();
                        chain1[chain1.length - 1] = newEnd;
                        BuildLog.log.chainSimplifyTail(index1, { seg: newEnd, fill: fill }, closed);
                    }

                    // simplify chain2's head
                    var tail = chain1[chain1.length - 1];
                    var head = chain2[0];
                    var newJoin = SegmentChainerUtils.joinSegments(tail, head, geo);
                    if (newJoin != null) {
                        chain2.shift();
                        chain1[chain1.length - 1] = newJoin;
                        BuildLog.log.chainSimplifyJoin(
                            index1,
                            index2,
                            { seg: newJoin, fill: fill },
                            closed
                        );
                    }
                    BuildLog.log.chainJoin(index1, index2, closed);
                    chains[index1].segs = chain1.concat(chain2);
                    chains.splice(index2, 1);
                };

                var F = firstMatch.index;
                var S = secondMatch.index;

                BuildLog.log.chainConnect(F, S, closed);

                // reverse the shorter chain, if needed
                var reverseF = chains[F].segs.length < chains[S].segs.length;
                if (firstMatch.matchesHead) {
                    if (secondMatch.matchesHead) {
                        if (reverseF) {
                            if (!firstMatch.matchesPt1) {
                                // <<<< F <<<< <-- >>>> S >>>>
                                seg = SegmentUtils.reverse(seg);
                            }
                            // <<<< F <<<< --> >>>> S >>>>
                            reverseChain(F);
                            // >>>> F >>>> --> >>>> S >>>>
                            appendChain(F, S);
                        } else {
                            if (firstMatch.matchesPt1) {
                                // <<<< F <<<< --> >>>> S >>>>
                                seg = SegmentUtils.reverse(seg);
                            }
                            // <<<< F <<<< <-- >>>> S >>>>
                            reverseChain(S);
                            // <<<< F <<<< <-- <<<< S <<<<   logically same as:
                            // >>>> S >>>> --> >>>> F >>>>
                            appendChain(S, F);
                        }
                    } else {
                        if (firstMatch.matchesPt1) {
                            // <<<< F <<<< --> >>>> S >>>>
                            seg = SegmentUtils.reverse(seg);
                        }
                        // <<<< F <<<< <-- <<<< S <<<<   logically same as:
                        // >>>> S >>>> --> >>>> F >>>>
                        appendChain(S, F);
                    }
                } else {
                    if (secondMatch.matchesHead) {
                        if (!firstMatch.matchesPt1) {
                            // >>>> F >>>> <-- >>>> S >>>>
                            seg = SegmentUtils.reverse(seg);
                        }
                        // >>>> F >>>> --> >>>> S >>>>
                        appendChain(F, S);
                    } else {
                        if (reverseF) {
                            if (firstMatch.matchesPt1) {
                                // >>>> F >>>> --> <<<< S <<<<
                                seg = SegmentUtils.reverse(seg);
                            }
                            // >>>> F >>>> <-- <<<< S <<<<
                            reverseChain(F);
                            // <<<< F <<<< <-- <<<< S <<<<   logically same as:
                            // >>>> S >>>> --> >>>> F >>>>
                            appendChain(S, F);
                        } else {
                            if (!firstMatch.matchesPt1) {
                                // >>>> F >>>> <-- <<<< S <<<<
                                seg = SegmentUtils.reverse(seg);
                            }
                            // >>>> F >>>> --> <<<< S <<<<
                            reverseChain(S);
                            // >>>> F >>>> --> >>>> S >>>>
                            appendChain(F, S);
                        }
                    }
                }
            }
        }
        for (chain in openChains) {
            regions.push(chain.segs);
        }
        return regions;
    }
}






