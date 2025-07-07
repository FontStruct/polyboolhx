package polyboolhx.test;
import sys.io.File;
import polyboolhx.Geometry.PointVec;

using Lambda;


class VisualTestRunner {

    static public function main():Void {

        var tests = [

            new VisualTest('simple', [[
                [
                    [100.0, 100.0],
                    [300.0, 100.0],
                    [300.0, 300.0],
                    [100.0, 300.0]
                ],

            ], [
                [
                    [200.0, 200.0],
                    [400.0, 200.0],
                    [400.0, 400.0],
                    [200.0, 400.0]
                ]
            ]]),

                // L-shaped polygon with partial overlap
            new VisualTest('l_shape_overlap',
            [[
                // L-shaped region
                [
                    [100.0, 100.0],
                    [300.0, 100.0],
                    [300.0, 200.0],
                    [200.0, 200.0],
                    [200.0, 300.0],
                    [100.0, 300.0]
                ]
            ],
            [
                // Rectangle cutting through the L-shape
                [
                    [150.0, 150.0],
                    [350.0, 150.0],
                    [350.0, 250.0],
                    [150.0, 250.0]
                ]
            ]]),

                // Two polygons touching at a single edge
            new VisualTest('edge_touching',
            [[
                // Square 1
                [
                    [100.0, 100.0],
                    [200.0, 100.0],
                    [200.0, 200.0],
                    [100.0, 200.0]
                ]
            ],
            [
                // Square 2 touching edge of Square 1
                [
                    [200.0, 100.0],
                    [300.0, 100.0],
                    [300.0, 200.0],
                    [200.0, 200.0]
                ]
            ]]
            ),

                // Test Case 4: Complex polygon vs square
            new VisualTest('complex_vs_square',
            [[
                // Complex polygon (zigzag shape)
                [
                    [50.0, 50.0],
                    [150.0, 50.0],
                    [150.0, 150.0],
                    [50.0, 150.0],
                    [50.0, 250.0],
                    [150.0, 250.0],
                    [150.0, 350.0],
                    [50.0, 350.0]
                ]
            ],
            [
                // Square
                [
                    [100.0, 200.0],
                    [200.0, 200.0],
                    [200.0, 300.0],
                    [100.0, 300.0]
                ]
            ]]
            ),

            new VisualTest('angled_lines',
            [
                [
                    // Diamond-shaped polygon (angled lines)
                    [
                        [200.0, 100.0],
                        [300.0, 200.0],
                        [200.0, 300.0],
                        [100.0, 200.0]
                    ]
                ],
                [
                    // Triangle cutting through the diamond
                    [
                        [150.0, 120.0],
                        [250.0, 120.0],
                        [200.0, 220.0]
                    ]
                ]
            ]
            ),
            new VisualTest('grid_small', generateGrid(25, 25, 10, 10)),
            new VisualTest('efficent_grid_small', generateGrid(25, 25, 10, 10), 'efficient'),
            new VisualTest('cascading_union_small', generateGrid(25, 25, 10, 10), 'cascading_union', {
                width: 25,
                height: 25
            })
            ,
            new VisualTest('grid_big', generateGrid(100, 100, 10, 10)),
            new VisualTest('efficent_grid_big', generateGrid(100, 100, 10, 10), 'efficient'),
            new VisualTest('cascading_union_big', generateGrid(100, 100, 10, 10), 'cascading_union', {
                width: 100,
                height: 100
            })

        ];

        var html = '<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>PolyBoolHx Visual Test</title>
</head>
<body>';
        for (test in tests) {
            var svg = test.run();
            html += '\n<div><img src="${svg}"></div>';
        }
        html += '\n</body>\n</html>';

        var output = File.write('dist/polyboolhx/js/vistest/vistest.html');
        output.writeString(html);
        output.close();

    }

    // Generates a grid of adjacent squares
    static private function generateGrid(rows:Int, cols:Int, squareWidth:Float, squareHeight:Float):Array<Array<Array<PointVec>>> {
        var regions = [];
        for (i in 0...rows) {
            for (j in 0...cols) {
                var x = j * squareWidth;
                var y = i * squareHeight;
                regions.push([[
                    cast [x, y], // Top-left
                    cast [x + squareWidth, y], // Top-right
                    cast [x + squareWidth, y + squareHeight], // Bottom-right
                    cast [x, y + squareHeight] // Bottom-left
                ]]);
            }
        }
        return regions;
    }


}
