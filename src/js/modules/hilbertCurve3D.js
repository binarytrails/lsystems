
var camera, controls, scene, renderer, currentModel;
var hilbertCurve;
var X = new THREE.Vector3(1, 0, 0)
var Y = new THREE.Vector3(0, 1, 0)
var Z = new THREE.Vector3(0, 0, 1)
var lineLength = 1
var width, height, color;

var pushSegment = function()
{
    var newSegment = currentModel.clone()
    scene.add(newSegment)
    currentModel.translateX(-(lineLength))
    newSegment.matrixAutoUpdate = false
    newSegment.updateMatrix()
}

function initHilbertCurve(_width, _height, _color)
{
    width = _width;
    height = _height;
    color = _color;
}

function getHilbertCurve()
{
    scene = new THREE.Scene()

    if(!camera)
    {
        camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
        camera.position.x = -10
    }

    controls = new THREE.TrackballControls(camera);

    controls.rotateSpeed = 5;
    controls.zoomSpeed = 7;
    controls.panSpeed = 0.8;

    controls.noZoom = false;
    controls.noPan = false;

    controls.staticMoving = true;
    controls.dynamicDampingFactor = 0.3;

    controls.keys = [
        65, 83, 68
    ];

    controls.addEventListener('change', renderHilbertCurve);

    var light = new THREE.DirectionalLight(0xffffff);
    light.position.set(1, 1, 1);
    scene.add(light);

    light = new THREE.DirectionalLight(0x002288);
    light.position.set(-1, -1, -1);
    scene.add(light);

    light = new THREE.AmbientLight(0x222222);
    scene.add(light);

    renderer = new THREE.WebGLRenderer()
    renderer.setSize(width, height)

    var angle = 90

    var geometry = new THREE.BoxGeometry(lineLength, lineLength/4, lineLength/4)
    var material = new THREE.MeshLambertMaterial({
        color: color,
        wireframe: false
    })
    currentModel = new THREE.Mesh(geometry, material)
    currentModel.geometry.translate( -(lineLength/2), 0, 0 )

    hilbertCurve = new LSystem({
        word: 'Z',
        productions: [
            [
                'Z', 'YYYY|Z'
            ],
            [
                'Y', 'XXXX+XXXX+XXXX+XXXX'
            ], [
                'X', 'F+F+F^F^F-F-F^F^F'
            ],
            [
                'A', 'B-F+CFC+F-D&F^D-F+&&CFC+F+B//'
            ], [
                'B', 'A&F^CFB^F^D^^-F-D^|F^B|FC^F^A//'
            ], [
                'C', '|D^|F^B-F+C^F^A&&FA&F^C+F+B^F^D//'
            ], [
                'D', '|CFB-F+B|FA&F^A&&FB-F+B|FC//'
            ]
        ],
        finals: [
            [
                'F', pushSegment
            ], [
                '+', function() {
                    currentModel.rotation.y += ((Math.PI / 180) * angle)
                }
            ], [
                '-', function() {
                    currentModel.rotation.y += ((Math.PI / 180) * -angle)
                }
            ], [
                '&', function() {
                    currentModel.rotation.z += ((Math.PI / 180) * angle)
                }
            ], [
                '^', function() {
                    currentModel.rotation.z += ((Math.PI / 180) * -angle)
                }
            ], [
                '\\', function() {
                    currentModel.rotation.x += ((Math.PI / 180) * angle)
                }
            ], [
                '/', function() {
                    currentModel.rotation.x += ((Math.PI / 180) * -angle)
                }
            ], [
                '|', function() {
                    currentModel.rotation.y += ((Math.PI / 180) * 180)
                }
            ]
        ]
    })

    hilbertCurve.iterate(4);
    hilbertCurve.final();

    return renderer.domElement;
}

function animateHilbertCurve()
{
    requestAnimationFrame(animateHilbertCurve);
    controls.update();
}

function renderHilbertCurve()
{
    renderer.render(scene, camera);
}
