package polyboolhx.test;
import polyboolhx.Polybool.Polygon;
import polyboolhx.Polybool.PolyBool;
import sys.io.File;
import polyboolhx.Geometry.PointVec;
import haxe.ds.StringMap;
import haxe.macro.JSGenApi;
import haxe.Json;

class VisualTest {

    var name:String;
    var sources:Array<Polygon>;
    var algorithm:String;
    var options:Dynamic;

    public function new(name, sourceRegions:Array<Array<Array<PointVec>>>, algorithm = 'simple', ?options:Dynamic) {
        this.name = name;
        this.algorithm = algorithm;
        this.sources = new Array();
        for (region in sourceRegions) {
            this.sources.push(makePoly(region));
        }
        this.options = options;
    }

    public function run() {
        var label = name + ' (algo:' + algorithm + ')';
        ExecutionTimer.start(label);
        var unified:Polygon = null;
        if (algorithm == 'efficient') {
            unified = polyboolEfficient();
        } else if (algorithm == 'cascading_union'){
            unified = cascadingUnion();
        } else {
            unified = simpleUnion();
        }
        var duration = ExecutionTimer.end(label);
        var filename = '${name}.svg';
        var svg = generateSVG(sources, unified, '${name} ${duration}ms');
        var output = File.write('dist/polyboolhx/js/vistest/${filename}');
        output.writeString(svg);
        output.close();
        return filename;
    }

    private function simpleUnion() {
        var polyBool = new PolyBool();
        var unified = sources[0];
        for (i in 1...sources.length) {
            unified = polyBool.union(unified, sources[i]);
        }
        return unified;
    }

    // not efficient!
    private function polyboolEfficient() {
        var polyBool = new PolyBool();
        var segments = polyBool.segments(sources[0]);
        for (i in 1...sources.length){
            var seg2 = polyBool.segments(sources[i]);
            var comb = polyBool.combine(segments, seg2);
            segments = polyBool.selectUnion(comb);
        }
        return polyBool.polygon(segments);
    }


    private function cascadingUnion(?caching:Bool = false) {
        var polyBool = new PolyBool();
        var allUnified = new Array<Polygon>();
        var cache:StringMap<Polygon> = new StringMap();
        var cacheKey:String = '';
        for (src in sources) {
            allUnified.push(src);
        }
        var unify4Adjacent = (width, height) -> {
            var y = 0;
            var unified = [];
            while (y < height) {
                var x = 0;
                while (x < width) {
                    var idx = x + (y * width);
                    var idx2 = x + ((y + 1) * width);
                    var pts = [allUnified[idx]];
                    if (allUnified.length > idx + 1) pts.push(allUnified[idx + 1]);
                    if (allUnified.length > idx2) pts.push(allUnified[idx2]);
                    if (allUnified.length > idx2 + 1) pts.push(allUnified[idx2 + 1]);
                    if (caching) {
                        cacheKey = Json.stringify(pts);
                        if (cache.exists(cacheKey)) {
                            unified.push(cache.get(cacheKey));
                            continue;
                        }
                    }
                    var adjacentUnified = pts[0];
                    for (i in 1...pts.length) {
                        adjacentUnified = polyBool.union(adjacentUnified, pts[i]);
                    }
                    unified.push(adjacentUnified);
                    x += 2;
                }
                y += 2;
            }
            return unified;
        }
        var width = options.width;
        var height = options.height;
        while (allUnified.length != 1) {
            allUnified = unify4Adjacent(width, height);
            width = Math.ceil(width / 2);
            height = Math.ceil(height / 2);
        }

        return allUnified[0];


//        var polyBool = new PolyBool();
//        var unified = sources[0];
//        for (i in 1...this.sources.length) {
//            unified = polyBool.union(unified, this.sources[i]);
//        }
//        return unified;
    }


    private function generateSVG(sources:Array<Polygon>, union:Polygon, ?label = ''):String {
        var extremes = {
            minX: 10000.0,
            maxX: -10000.0,
            minY: 10000.0,
            maxY: -10000.0
        };
        for (region in union.regions) {
            for (p in region) {
                if (p[0] < extremes.minX) extremes.minX = p[0];
                if (p[0] > extremes.maxX) extremes.maxX = p[0];
                if (p[1] < extremes.minY) extremes.minY = p[1];
                if (p[1] > extremes.maxY) extremes.maxY = p[1];
            }
        }

        var width = extremes.maxX - extremes.minX;
        var height = extremes.maxY - extremes.minY;

        var svg = '<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">\n';

        // Add the original polygons
        for (source in sources) {
            svg += generateSVGPath(source, "rgba(0, 0, 0, 0.3)", "rgba(0, 0, 0, 0.3)", 0 - extremes.minX, 0 - extremes.minY);
        }

        // Add the union result (green)
        svg += generateSVGPath(union, "rgba(0, 255, 0, 0.7)", "green", 0 - extremes.minX, 0 - extremes.minY);
        svg += '<text x="10" y="20">${label}</text>';

        svg += '</svg>';

        return svg;
    }

    private function generateSVGPath(
        polygon:Polygon,
        fillStyle = "rgba(0, 255, 0, 0.5)",
        strokeStyle = "green",
        offsetX = 0.0,
        offsetY = 0.0
    ):String {
        var result = "";

        var pt = p -> {
            return [p[0] + offsetX, p[1] + offsetY];
        }

        for (region in polygon.regions) {
            var pathData = "";

            // Start from the first point
            var firstPoint = pt(region[0]);
            pathData += 'M${firstPoint[0]},${firstPoint[1]} ';

            // Draw lines to each point
            for (i in 1...region.length) {
                var point = pt(region[i]);
                if (point.length == 2) {
                    pathData += 'L${point[0]},${point[1]} ';
                } else if (point.length == 6) {
                    // Handle Bezier curves if present
                    pathData += 'C${point[0]},${point[1]} ${point[2]},${point[3]} ${point[4]},${point[5]} ';
                }
            }

            // Close the path
            pathData += 'Z';

            // Add the path to SVG content
            result += '<path d="${pathData}" fill="${fillStyle}" stroke="${strokeStyle}" stroke-width="2" />\n';
        }

        return result;
    }

    private function makePoly(paths) {
        return {
            regions: paths,
            inverted: false
        }
    }

}