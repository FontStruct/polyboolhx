//
// polybool - Boolean operations on polygons (union, intersection, etc)
// by Sean Connelly (@velipso), https://sean.fun
// Project Home: https://github.com/velipso/polybool
// SPDX-License-Identifier: 0BSD
//

package polyboolhx;

import polyboolhx.Geometry.PointVec;
import polyboolhx.Geometry;
import polyboolhx.Geometry.GeometryEpsilon;
import polyboolhx.Shape;
import polyboolhx.Shape.ShapeCombined;
import haxe.Exception;
import polyboolhx.BuildLog.ArrayBuildLog;

typedef Polygon = {
  regions: Array<Array<PointVec>>,
  inverted: Bool
}

typedef Segments = {
  shape: Shape,
  inverted: Bool
}

typedef CombinedSegments = {
  shape: ShapeCombined,
  inverted1: Bool,
  inverted2: Bool
}

class PolyBool {

  private var geo:Geometry;

  public function new(
    geo: Geometry = null
  ) {
    if (geo == null) {
      geo = new GeometryEpsilon();
    }
    this.geo = geo;
  }

  public function shape() {
    return new Shape(this.geo, null);
  }

  public function buildLog(enable: Bool) {
    BuildLog.log = enable? new ArrayBuildLog() : null;
    return enable ? BuildLog.log.list : null;
  }

  public function segments(poly: Polygon): Segments {
    var shape = this.shape();
    shape.beginPath();
    for (region in poly.regions) {
      var lastPoint = region[region.length - 1];
      shape.moveTo(
        lastPoint[lastPoint.length - 2],
        lastPoint[lastPoint.length - 1]
      );
      for (p in region) {
        if (p.length == 2) {
          shape.lineTo(p[0], p[1]);
        } else if (p.length == 6) {
          shape.bezierCurveTo(p[0], p[1], p[2], p[3], p[4], p[5]);
        } else {
          throw new Exception("PolyBool: Invalid point in region");
        }
      }
      shape.closePath();
    }
    return {
      shape: shape,
      inverted: poly.inverted
    };
  }

  public function combine(segments1: Segments, segments2: Segments): CombinedSegments {
    return {
      shape: segments1.shape.combine(segments2.shape),
      inverted1: segments1.inverted,
      inverted2: segments2.inverted,
    };
  }

  public function selectUnion(combined: CombinedSegments): Segments {
    return {
      shape: combined.inverted1
        ? combined.inverted2
          ? combined.shape.intersect()
          : combined.shape.difference()
        : combined.inverted2
          ? combined.shape.differenceRev()
          : combined.shape.union(),
      inverted: combined.inverted1 || combined.inverted2,
    };
  }

  public function selectIntersect(combined: CombinedSegments): Segments {
    return {
      shape: combined.inverted1
        ? combined.inverted2
          ? combined.shape.union()
          : combined.shape.differenceRev()
        : combined.inverted2
          ? combined.shape.difference()
          : combined.shape.intersect(),
      inverted: combined.inverted1 && combined.inverted2,
    };
  }

  public function selectDifference(combined: CombinedSegments): Segments {
    return {
      shape: combined.inverted1
        ? combined.inverted2
          ? combined.shape.differenceRev()
          : combined.shape.union()
        : combined.inverted2
          ? combined.shape.intersect()
          : combined.shape.difference(),
      inverted: combined.inverted1 && !combined.inverted2,
    };
  }

  public function selectDifferenceRev(combined: CombinedSegments): Segments {
    return {
      shape: combined.inverted1
        ? combined.inverted2
          ? combined.shape.difference()
          : combined.shape.intersect()
        : combined.inverted2
          ? combined.shape.union()
          : combined.shape.differenceRev(),
      inverted: !combined.inverted1 && combined.inverted2,
    };
  }

  public function selectXor(combined: CombinedSegments): Segments {
    return {
      shape: combined.shape.xor(),
      inverted: combined.inverted1 != combined.inverted2,
    };
  }

  public function polygon(segments: Segments): Polygon {
    var regions: Array<Array<PointVec>> = [];
    var receiver = {
      beginPath: () -> {},
      moveTo: (x:Float, y:Float) -> {
        regions.push([]);
      },
      lineTo: (x: Float, y: Float) -> {
        regions[regions.length - 1].push([x, y]);
      },
      bezierCurveTo: (
        c1x: Float,
        c1y: Float,
        c2x: Float,
        c2y: Float,
        x: Float,
        y: Float
      ) -> {
        regions[regions.length - 1].push([c1x, c1y, c2x, c2y, x, y]);
      },
      closePath: () -> {},
    };
    segments.shape.output(receiver);
    return { regions: regions, inverted: segments.inverted };
  }

  // helper functions for common operations
  public function union(poly1: Polygon, poly2: Polygon): Polygon {
    var seg1 = this.segments(poly1);
    var seg2 = this.segments(poly2);
    var comb = this.combine(seg1, seg2);
    var seg3 = this.selectUnion(comb);
    return this.polygon(seg3);
  }

  public function intersect(poly1: Polygon, poly2: Polygon): Polygon {
    var seg1 = this.segments(poly1);
    var seg2 = this.segments(poly2);
    var comb = this.combine(seg1, seg2);
    var seg3 = this.selectIntersect(comb);
    return this.polygon(seg3);
  }

  public function difference(poly1: Polygon, poly2: Polygon): Polygon {
    var seg1 = this.segments(poly1);
    var seg2 = this.segments(poly2);
    var comb = this.combine(seg1, seg2);
    var seg3 = this.selectDifference(comb);
    return this.polygon(seg3);
  }

  public function differenceRev(poly1: Polygon, poly2: Polygon): Polygon {
    var seg1 = this.segments(poly1);
    var seg2 = this.segments(poly2);
    var comb = this.combine(seg1, seg2);
    var seg3 = this.selectDifferenceRev(comb);
    return this.polygon(seg3);
  }

  public function xor(poly1: Polygon, poly2: Polygon): Polygon {
    var seg1 = this.segments(poly1);
    var seg2 = this.segments(poly2);
    var comb = this.combine(seg1, seg2);
    var seg3 = this.selectXor(comb);
    return this.polygon(seg3);
  }
}
