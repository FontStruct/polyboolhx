//
// polybool - Boolean operations on polygons (union, intersection, etc)
// by Sean Connelly (@velipso), https://sean.fun
// Project Home: https://github.com/velipso/polybool
// SPDX-License-Identifier: 0BSD
//

package polyboolhx;

import polyboolhx.Intersector.SegmentBool;
import polyboolhx.Segment.SegmentLine;

//
// filter a list of segments based on boolean operations
//
class SegmentSelector {

    public static function union(segments:Array<SegmentBool>) {
        // primary | secondary
        // above1 below1 above2 below2    Keep?               Value
        //    0      0      0      0   =>   yes if open         4
        //    0      0      0      1   =>   yes filled below    2
        //    0      0      1      0   =>   yes filled above    1
        //    0      0      1      1   =>   no                  0
        //    0      1      0      0   =>   yes filled below    2
        //    0      1      0      1   =>   yes filled below    2
        //    0      1      1      0   =>   no                  0
        //    0      1      1      1   =>   no                  0
        //    1      0      0      0   =>   yes filled above    1
        //    1      0      0      1   =>   no                  0
        //    1      0      1      0   =>   yes filled above    1
        //    1      0      1      1   =>   no                  0
        //    1      1      0      0   =>   no                  0
        //    1      1      0      1   =>   no                  0
        //    1      1      1      0   =>   no                  0
        //    1      1      1      1   =>   no                  0
        return select(
            segments,
            [
                4, 2, 1, 0,
                2, 2, 0, 0,
                1, 0, 1, 0,
                0, 0, 0, 0
            ]
        );
    }

    public static function intersect(segments:Array<SegmentBool>) {
        // primary & secondary
        // above1 below1 above2 below2    Keep?               Value
        //    0      0      0      0   =>   no                  0
        //    0      0      0      1   =>   no                  0
        //    0      0      1      0   =>   no                  0
        //    0      0      1      1   =>   yes if open         4
        //    0      1      0      0   =>   no                  0
        //    0      1      0      1   =>   yes filled below    2
        //    0      1      1      0   =>   no                  0
        //    0      1      1      1   =>   yes filled below    2
        //    1      0      0      0   =>   no                  0
        //    1      0      0      1   =>   no                  0
        //    1      0      1      0   =>   yes filled above    1
        //    1      0      1      1   =>   yes filled above    1
        //    1      1      0      0   =>   yes if open         4
        //    1      1      0      1   =>   yes filled below    2
        //    1      1      1      0   =>   yes filled above    1
        //    1      1      1      1   =>   no                  0
        return select(
            segments,
            [
                0, 0, 0, 4,
                0, 2, 0, 2,
                0, 0, 1, 1,
                4, 2, 1, 0
            ]
        );
    }

    public static function difference(segments:Array<SegmentBool>) {
        // primary - secondary
        // above1 below1 above2 below2    Keep?               Value
        //    0      0      0      0   =>   yes if open         4
        //    0      0      0      1   =>   no                  0
        //    0      0      1      0   =>   no                  0
        //    0      0      1      1   =>   no                  0
        //    0      1      0      0   =>   yes filled below    2
        //    0      1      0      1   =>   no                  0
        //    0      1      1      0   =>   yes filled below    2
        //    0      1      1      1   =>   no                  0
        //    1      0      0      0   =>   yes filled above    1
        //    1      0      0      1   =>   yes filled above    1
        //    1      0      1      0   =>   no                  0
        //    1      0      1      1   =>   no                  0
        //    1      1      0      0   =>   no                  0
        //    1      1      0      1   =>   yes filled above    1
        //    1      1      1      0   =>   yes filled below    2
        //    1      1      1      1   =>   no                  0
        return select(
            segments,
            [
                4, 0, 0, 0,
                2, 0, 2, 0,
                1, 1, 0, 0,
                0, 1, 2, 0
            ]
        );
    }

    // prettier-ignore
    public static function differenceRev(segments:Array<SegmentBool>) {
        // secondary - primary
        // above1 below1 above2 below2    Keep?               Value
        //    0      0      0      0   =>   yes if open         4
        //    0      0      0      1   =>   yes filled below    2
        //    0      0      1      0   =>   yes filled above    1
        //    0      0      1      1   =>   no                  0
        //    0      1      0      0   =>   no                  0
        //    0      1      0      1   =>   no                  0
        //    0      1      1      0   =>   yes filled above    1
        //    0      1      1      1   =>   yes filled above    1
        //    1      0      0      0   =>   no                  0
        //    1      0      0      1   =>   yes filled below    2
        //    1      0      1      0   =>   no                  0
        //    1      0      1      1   =>   yes filled below    2
        //    1      1      0      0   =>   no                  0
        //    1      1      0      1   =>   no                  0
        //    1      1      1      0   =>   no                  0
        //    1      1      1      1   =>   no                  0
        return select(
            segments,
            [
                4, 2, 1, 0,
                0, 0, 1, 1,
                0, 2, 0, 2,
                0, 0, 0, 0
            ]
        );
    }

    // prettier-ignore
    public static function xor(segments:Array<SegmentBool>) {
        // primary ^ secondary
        // above1 below1 above2 below2    Keep?               Value
        //    0      0      0      0   =>   yes if open         4
        //    0      0      0      1   =>   yes filled below    2
        //    0      0      1      0   =>   yes filled above    1
        //    0      0      1      1   =>   no                  0
        //    0      1      0      0   =>   yes filled below    2
        //    0      1      0      1   =>   no                  0
        //    0      1      1      0   =>   no                  0
        //    0      1      1      1   =>   yes filled above    1
        //    1      0      0      0   =>   yes filled above    1
        //    1      0      0      1   =>   no                  0
        //    1      0      1      0   =>   no                  0
        //    1      0      1      1   =>   yes filled below    2
        //    1      1      0      0   =>   no                  0
        //    1      1      0      1   =>   yes filled above    1
        //    1      1      1      0   =>   yes filled below    2
        //    1      1      1      1   =>   no                  0
        return select(
            segments,
            [
                4, 2, 1, 0,
                2, 0, 0, 1,
                1, 0, 0, 2,
                0, 1, 2, 0
            ]
        );
    }

    private static function select(
        segments:Array<SegmentBool>,
        selection:Array<Int>
    ):Array<SegmentBool> {
        var result:Array<SegmentBool> = [];
        for (seg in segments) {
            var index = (seg.myFill.above ? 8 : 0) +
                (seg.myFill.below ? 4 : 0) +
                (seg.otherFill != null && seg.otherFill.above == true ? 2 : 0) +
                (seg.otherFill != null && seg.otherFill.below == true ? 1 : 0)
            ;
            var flags = selection[index];
            var above = (flags & 1) != 0; // bit 1 if filled above
            var below = (flags & 2) != 0; // bit 2 if filled below
            if ((!seg.closed && flags != 0) || (seg.closed && above != below)) {
                // copy the segment to the results, while also calculating the fill status
                var fill = { above: above, below: below };
                result.push(new SegmentBool(seg.data, fill, seg.closed));
//                throw new Exception(
//                    "PolyBool: Unknown SegmentBool type in SegmentSelector"
//                );
            }
        }
        BuildLog.log.selected(result);
        return result;
    }
}
