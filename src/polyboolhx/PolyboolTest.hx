//
// polybool - Boolean operations on polygons (union, intersection, etc)
// by Sean Connelly (@velipso), https://sean.fun
// Project Home: https://github.com/velipso/polybool
// SPDX-License-Identifier: 0BSD
//

package polyboolhx;

import polyboolhx.Polybool;
import haxe.Exception;
import deepequal.DeepEqual;
import deepequal.Outcome.Success;
import deepequal.Outcome.Failure;
import haxe.Json;

class Receiver {
    public var log:Array<Dynamic> = [];

    public function new() {

    }

    public function beginPath() {
        this.log.push('beginPath');
    }

    public function moveTo(x:Float, y:Float) {
        this.log = this.log.concat(['moveTo', x, y]);
    }

    public function lineTo(x:Float, y:Float) {
        this.log = this.log.concat(['lineTo', x, y]);
    }

    public function bezierCurveTo(
        cp1x:Float,
        cp1y:Float,
        cp2x:Float,
        cp2y:Float,
        x:Float,
        y:Float
    ) {
        this.log.push(['bezierCurveTo', cp1x, cp1y, cp2x, cp2y, x, y]);
    }

    public function closePath() {
        this.log.push('closePath');
    }

    public function done() {
        return this.log;
    }
}


class PolyboolTest {

    static var triangle1 = {
        regions: [[
            [0.0, 0.0],
            [5.0, 10.0],
            [10.0, 0.0]
        ]],
        inverted: false
    };

    static var triangle2 = {
        regions: [[
            [5.0, 0.0],
            [10.0, 10.0],
            [15.0, 0.0]
        ]],
        inverted: false
    };

    static var box1 = {
        regions: [[
            [0.0, 0.0],
            [5.0, 0.0],
            [5.0, -5.0],
            [0.0, -5.0]
        ]],
        inverted: false
    };

    static var curve1 = {
        regions: [[
            [0.0, 0.0],
            [0.0, -5.0, 10.0, -5.0, 10.0, 0.0]
        ]],
        inverted: false
    };

    static public function assertEqual(a:Dynamic, b:Dynamic) {
        switch DeepEqual.compare(a, b) {
            case Success(_): return true; // they are value-identical
            case Failure(f): {
                throw new Exception('Values not equal'); // they are different!
            }
        }

    }

    static public function main():Void {

        var polybool = new PolyBool();
        polybool.buildLog(true);

        var tests = [
            {
                name: 'basic intersection',
                func: () -> {
                    PolyboolTest.assertEqual(
                        polybool.intersect(triangle1, triangle2),
                        {
                            regions: [[
                                [10.0, 0.0],
                                [5.0, 0.0],
                                [7.5, 5.0]
                            ]],
                            inverted: false
                        }
                    );
                }
            },
            {
                name: 'basic union',
                func: () -> {
                    assertEqual(
                        polybool.union(triangle1, triangle2),
                        {
                            regions: [[
                                [10.0, 10.0],
                                [7.5, 5],
                                [5.0, 10.0],
                                [0.0, 0.0],
                                [15.0, 0.0]
                            ]],
                            inverted: false
                        }
                    );
                }
            },
            {
                name: 'union with curve',
                func: () -> {
                    assertEqual(
                        polybool.union(box1, curve1),
                        {
                            regions: [[
                                [10.0, 0.0],
                                [10.0, -2.5, 7.5, -3.75, 5.0, -3.75],
                                [5.0, -5.0],
                                [0.0, -5.0],
                                [0.0, 0.0]
                            ]],
                            inverted: false
                        }
                    );
                }
            },
            {
                name: 'example',
                func: () -> {
                    var log = polybool.shape()
                    .beginPath()
                    .moveTo(50, 50)
                    .lineTo(150, 150)
                    .lineTo(190, 50)
                    .closePath()
                    .moveTo(130, 50)
                    .lineTo(290, 150)
                    .lineTo(290, 50)
                    .closePath()
                    .combine(
                        polybool.shape()
                        .beginPath()
                        .moveTo(110, 20)
                        .lineTo(110, 110)
                        .lineTo(20, 20)
                        .closePath()
                        .moveTo(130, 170)
                        .lineTo(130, 20)
                        .lineTo(260, 20)
                        .lineTo(260, 170)
                        .closePath()
                    )
                    .intersect()
                    .output(new Receiver())
                    .done();
                    assertEqual(log, [
                        'beginPath',
                        'moveTo', 110, 110,
                        'lineTo', 50, 50,
                        'lineTo', 110, 50,
                        'lineTo', 110, 110,
                        'closePath',
                        'moveTo', 150, 150,
                        'lineTo', 178, 80,
                        'lineTo', 130, 50,
                        'lineTo', 130, 130,
                        'lineTo', 150, 150,
                        'closePath',
                        'moveTo', 260, 131.25,
                        'lineTo', 178, 80,
                        'lineTo', 190, 50,
                        'lineTo', 260, 50,
                        'lineTo', 260, 131.25,
                        'closePath',
                    ]);
                }
            },
            {
                name: 'transforms',
                func: () -> {
                    var log = polybool.shape()
                    .setTransform(3, 0, 0, 2, 100, 200)
                    .beginPath()
                    .moveTo(50, 50)
                    .lineTo(-10, 50)
                    .lineTo(10, 10)
                    .closePath()
                    .output(new Receiver())
                    .done();
                    assertEqual(log, [
                        'beginPath',
                        'moveTo', 250, 300,
                        'lineTo', 70, 300,
                        'lineTo', 130, 220,
                        'lineTo', 250, 300,
                        'closePath',
                    ]);
                },
            }
        ];


        // run tests
        var pass = 0;
        var fail = 0;
        for (test in tests) {
            try {
                test.func();
                trace('pass ${test.name}');
                pass++;
            } catch (err) {
                trace('FAIL ${test.name}');
                trace('${test.name} failed:', err);
                fail++;
            }
        }
        trace('\nPass: ${pass}\nFail: ${fail}');

    }


}


