
var camera, controls, scene, renderer, model,
    hilbertCurve;
    X = new THREE.Vector3(1, 0, 0),
    Y = new THREE.Vector3(0, 1, 0),
    Z = new THREE.Vector3(0, 0, 1),
    lineLength = 1;

var width, height, color,
    word, productions;

function initHilbertCurve(_width, _height, _decColor, _word, _productions)
{
    width = _width;
    height = _height;
    color = _decColor;
    word = _word;
    productions = _productions;
}

var pushSegment = function()
{
    var newSegment = model.clone();
    scene.add(newSegment);
    model.translateX(-lineLength);
    newSegment.matrixAutoUpdate = false;
    newSegment.updateMatrix();
    //setTimeout(10000);
}

function getHilbertCurve()
{
    scene = new THREE.Scene();

    if(!camera)
    {
        camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.x = -10;
        camera.position.y = 5;
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

    controls.addEventListener("change", renderHilbertCurve);

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
    var material = new THREE.MeshLambertMaterial(
    {
        color: color,
        wireframe: false
    })
    model = new THREE.Mesh(geometry, material)
    model.geometry.translate( -(lineLength/2), 0, 0 )

    hilbertCurve = new LSystem(
    {
        word,
        productions:
        [
            [
                "Z", productions.Z
            ],
            [
                "Y", productions.Y
            ],
            [
                "X", productions.X
            ]
        ],
        finals:
        [
            [
                "F", pushSegment
            ],
            [
                "+", function()
                {
                    model.rotation.y += ((Math.PI / 180) * angle)
                }
            ],
            [
                "-", function()
                {
                    model.rotation.y += ((Math.PI / 180) * -angle)
                }
            ],
            [
                "^", function()
                {
                    model.rotation.z += ((Math.PI / 180) * -angle)
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
