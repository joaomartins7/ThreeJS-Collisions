/*global THREE*/

var camera, cameraPerspective, cameraTop, cameraSide, cameraFront;

var floor, wall1, wall2, wall3, wall4;
var cannon1, cannon2, cannon3;

var cameraFactor = 7;

var changeCameraTop = false;
var changeCameraFront = false;
var changeCameraSide = false;
var changeCameraPerspective = false;

var selectDownCannon = false;
var selectCenterCannon = false;
var selectTopCannon = false;
var leftArrow = false;
var rightArrow = false;
var shootCannon = false;

var largura = 70;
var comprimento = 2*largura;
var espessura = 1;
var altura = 16;

var wallsVectors = new Array(3);

var raioBola = altura/4;
var ballsNum = 15;
var balls = new Array(ballsNum);
var ballsAxis = new Array(ballsNum);
var ballsVectors = new Array(ballsNum);

var cannonsVectors = new Array(3);

var scene, renderer;
var geometry, material, material2, material3, material4, mesh;
var mesh1, mesh2, mesh3;

var TopCannonCenter, DownCannonCenter, CenterCannonCenter;
var angleLimit1 = 0, angleLimit2 = 0, angleLimit3 = 0;

function render(){
    'use strict';
    renderer.render(scene, camera);
}

// --------------- Camera's Creation ---------------
function createCameraPerspective() {
    'use strict';
    cameraPerspective = new THREE.PerspectiveCamera(70,
                                         window.innerWidth / window.innerHeight,
                                         1,
                                         1000);
    cameraPerspective.position.x = 80;
    cameraPerspective.position.y = 80;
    cameraPerspective.position.z = 80;
    cameraPerspective.lookAt(scene.position);
}

function createCameraTop() {
    'use strict';
    cameraTop = new THREE.OrthographicCamera(window.innerWidth / -cameraFactor,
                                         window.innerWidth / cameraFactor,
                                         window.innerHeight / cameraFactor,
                                         window.innerHeight / -cameraFactor,
                                         1,
                                         1000);
    cameraTop.position.x = 0;
    cameraTop.position.y = 100;
    cameraTop.position.z = 0;
    cameraTop.lookAt(scene.position);
}

function createCameraSide() {
    'use strict';
    cameraSide = new THREE.OrthographicCamera(window.innerWidth / -cameraFactor,
                                         window.innerWidth / cameraFactor,
                                         window.innerHeight / cameraFactor,
                                         window.innerHeight / -cameraFactor,
                                         1,
                                         1000);
    cameraSide.position.x = 100;
    cameraSide.position.y = 0;
    cameraSide.position.z = 0;
    cameraSide.lookAt(scene.position);
}

function createCameraFront() {
    'use strict';
    cameraFront = new THREE.OrthographicCamera(window.innerWidth / -cameraFactor,
                                         window.innerWidth / cameraFactor,
                                         window.innerHeight / cameraFactor,
                                         window.innerHeight / -cameraFactor,
                                         1,
                                         1000);
    cameraFront.position.x = 0;
    cameraFront.position.y = 0;
    cameraFront.position.z = -100;
    cameraFront.lookAt(scene.position);
}
// ------------------------------------------------

function createScene() {
    'use strict';

    scene = new THREE.Scene();
    scene.add(new THREE.AxisHelper(10));

    createFloor();
    createWalls();

    createCannons();

    createBalls();


}

function createFloor() {
    'use strict';

    floor = new THREE.Object3D();

    material = new THREE.MeshBasicMaterial({ color: 0xffff00, wireframe: true });

    addFloor(floor, 0, 0, 0);
    scene.add(floor);
}

function createWalls() {
    'use strict'

    wall1 = new THREE.Object3D();
    wall2 = new THREE.Object3D();
    wall3 = new THREE.Object3D();

    material = new THREE.MeshBasicMaterial({ color: 0x0066ff, wireframe: true });

    addWall1(wall1,-(largura/2 + espessura/2)-50, altura/2, 0);
    addWall2(wall2, -50, altura/2, comprimento/2 + espessura/2);
    addWall2(wall3, -50, altura/2, -(comprimento/2 + espessura/2));

    //wallsVectors[0] = new THREE.Vector3( 1, 0, 0);
    //wallsVectors[1] = new THREE.Vector3( 0, 0, 1);
    //wallsVectors[2] = new THREE.Vector3( 0, 0, -1);

    scene.add(wall1);
    scene.add(wall2);
    scene.add(wall3);
}

function createCannons(){
    'use strict';

    cannon1 = new THREE.Object3D();
    cannon2 = new THREE.Object3D();
    cannon3 = new THREE.Object3D();

    material2 = new THREE.MeshBasicMaterial({ color: 0x0066ff, wireframe: true });
    material3 = new THREE.MeshBasicMaterial({ color: 0x0066ff, wireframe: true });
    material4 = new THREE.MeshBasicMaterial({ color: 0x0066ff, wireframe: true });

    addCannon1(cannon1, 50, 0, 40, material2);
    addCannon2(cannon2, 50, 0, 0, material3);
    addCannon3(cannon3, 50, 0, -40, material4);

    scene.add(cannon1);
    scene.add(cannon2);
    scene.add(cannon3);

}

function createBalls(){
    'use strict';

    for (var i = 0; i < ballsNum; i += 1){

        geometry = new THREE.SphereGeometry(raioBola, 15, 15);
        material = new THREE.MeshBasicMaterial({ color: 0xff00ff, wireframe: true });
        ballsAxis[i] = new THREE.AxisHelper(10); //Adicionar eixos para as bolas
        ballsVectors[i] = new THREE.Vector3( 0, 0, 1);
        balls[i] = new THREE.Object3D();

        mesh = new THREE.Mesh(geometry, material);
        balls[i].add(mesh);
        balls[i].add(ballsAxis[i]);



        while(true){

            var haColisao = false;
            var x = getRandomInt(-70, -30);
            var y = raioBola;
            var z = getRandomInt(-55, 55);

            console.log(x);
            console.log(y);
            console.log(z);


            for(var j = 0; j < i; j++){
                //(2*raioBola)**2
                if((2.2*raioBola)**2 >= (((balls[j].position.x)-(x))**2 + ((balls[j].position.z)-(z))**2)){
                    haColisao = true;
                    break;
                }
            }
            if(haColisao == false){
                balls[i].position.set(x, y, z);
                break;
            }
        }


        /*
        var x,y,z;
        x = getRandomInt(-70, -30);
        y = altura/2;
        z = getRandomInt(-55, 55);
        balls[i].position.set(x, y, z);
        */
        /*
        console.log(x);
        console.log(y);
        console.log(z);
        */


        //balls[i].userData.velocity = Math.random(0.001,0.1);
        scene.add(balls[i]);
    }

}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function addFloor(obj, x, y, z){
    'use strict';
    geometry = new THREE.CubeGeometry(largura, 0, comprimento);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x-50, y, z);
    obj.add(mesh);
}

function addWall1(obj, x, y, z){
    'use strict';
    geometry = new THREE.CubeGeometry(comprimento, espessura, altura);
    mesh = new THREE.Mesh(geometry, material);

    mesh.position.set(x, y, z);
    mesh.rotation.x = Math.PI / 2;
    mesh.rotation.z = Math.PI / 2;

    obj.add(mesh);
}

function addWall2(obj, x, y, z){
    'use strict';
    geometry = new THREE.CubeGeometry(largura + 2*espessura, espessura, altura);
    mesh = new THREE.Mesh(geometry, material);

    mesh.rotation.x = Math.PI / 2;

    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addCannon1(obj, x, y, z, material){
    'use strict';
    geometry = new THREE.CylinderGeometry(5, 5, 24);
    mesh1 = new THREE.Mesh(geometry, material);
    cannonsVectors[0] = new THREE.Vector3( 0, 0, 1);

    mesh1.rotation.x = Math.PI / 2;
    mesh1.rotation.z = Math.PI / 2;

	  mesh1.position.set(0, 5, 0);

    DownCannonCenter = new THREE.Object3D();
	  DownCannonCenter.position.set(x, y, z);
    DownCannonCenter.add(mesh1);

    obj.add(DownCannonCenter);
}

function addCannon2(obj, x, y, z, material){
    'use strict';
    geometry = new THREE.CylinderGeometry(5, 5, 24);
    mesh2 = new THREE.Mesh(geometry, material);
    cannonsVectors[1] = new THREE.Vector3( 0, 0, 1);

    mesh2.rotation.x = Math.PI / 2;
    mesh2.rotation.z = Math.PI / 2;

  	mesh2.position.set(0, 5, 0);

    CenterCannonCenter = new THREE.Object3D();
	  CenterCannonCenter.position.set(x, y, z);
    CenterCannonCenter.add(mesh2);

    obj.add(CenterCannonCenter);
}

function addCannon3(obj, x, y, z, material){
    'use strict';
    geometry = new THREE.CylinderGeometry(5, 5, 24);
    mesh3 = new THREE.Mesh(geometry, material);
    cannonsVectors[2] = new THREE.Vector3( 0, 0, 1);

    mesh3.rotation.x = Math.PI / 2;
    mesh3.rotation.z = Math.PI / 2;

	  mesh3.position.set(0, 5, 0);

	  TopCannonCenter = new THREE.Object3D();
	  TopCannonCenter.position.set(x, y, z);
    TopCannonCenter.add(mesh3);

    obj.add(TopCannonCenter);
}

function onResize() {
    'use strict';

    renderer.setSize(window.innerWidth, window.innerHeight);

    if (window.innerHeight > 0 && window.innerWidth > 0) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    }
}

function onKeyDown(e) {
    'use strict';

    switch (e.keyCode) {

    case 49:   // tecla 1
        changeCameraTop = true;
        break;
    case 50:   // tecla 2
        changeCameraPerspective = true;
        break;
    /*case 51:    // tecla 3
        changeCameraMovelPerspective = true;
        break;
    */

    case 52:   // tecla 4
        changeCameraFront = true;
        break;
    case 53:   // tecla 5
        changeCameraSide = true;
        break;


    case 81: // Q
    case 113: // q
        selectDownCannon = true;
        selectCenterCannon = false;
        selectTopCannon = false;
        break;
    case 87: // W
    case 119: // w
        selectCenterCannon = true;
        selectDownCannon = false;
        selectTopCannon = false;
        break;
    case 69: // E
    case 101: // e
        selectTopCannon = true;
        selectDownCannon = false;
        selectCenterCannon = false;
        break;

    case 37: // left arrow
        leftArrow = true;
        break;
    case 39: // right arrow
        rightArrow = true;
        break;

    case 32: // space
        shootCannon = true;
        break;

    case 54: // tecla 6
        scene.traverse(function (node) {
            if (node instanceof THREE.AxisHelper) {
                node.visible = !node.visible;
            }
        });
        break;
    }
}

// --------------- Camera Flags Checking ---------------
function checkCamera(){
    if(changeCameraFront){
        camera = cameraFront;
        changeCameraFront = false;
    }
    else if(changeCameraSide){
        camera = cameraSide;
        changeCameraSide = false
    }
    else if(changeCameraTop){
        camera = cameraTop;
        changeCameraTop = false
    }
    else if(changeCameraPerspective){
        camera = cameraPerspective;
        changeCameraPerspective = false
    }
}
// -------------------------------------------------

function checkCannonSelection(){
    if(selectDownCannon){

        mesh2.material.color.setHex(0x0066ff);
        mesh3.material.color.setHex(0x0066ff);

        mesh1.material.color.setHex(0xffffff);   // cor original 0x0066ff
        //selectDownCannon = false;

    }

    else if(selectCenterCannon){

        mesh1.material.color.setHex(0x0066ff);
        mesh3.material.color.setHex(0x0066ff);

        mesh2.material.color.setHex(0xffffff);
        //selectCenterCannon = false;
    }

    else if(selectTopCannon){

        mesh1.material.color.setHex(0x0066ff);
        mesh2.material.color.setHex(0x0066ff);

        mesh3.material.color.setHex(0xffffff);
        //selectTopCannon = false;
    }
}

function checkCannonRotation(){
    if(selectDownCannon){
       if(leftArrow && angleLimit1 < 4){
        DownCannonCenter.rotateY(0.1);
        leftArrow = false;
        angleLimit1 += 1;
       }
       if(rightArrow && angleLimit1 > -4){
        DownCannonCenter.rotateY(-0.1);
        rightArrow = false;
        angleLimit1 -= 1;
       }
    }

    else if(selectCenterCannon){
       if(leftArrow && angleLimit2 < 4){
        CenterCannonCenter.rotateY(0.1);
        leftArrow = false;
        angleLimit2 += 1;
       }
       if(rightArrow && angleLimit2 > -4){
        CenterCannonCenter.rotateY(-0.1);
        rightArrow = false;
        angleLimit2 -= 1;
       }
    }

    else if(selectTopCannon){
       if(leftArrow && angleLimit3 < 4){
        TopCannonCenter.rotateY(0.1);
        leftArrow = false;
        angleLimit3 += 1;
       }
       if(rightArrow && angleLimit3 > -4){
        TopCannonCenter.rotateY(-0.1);
        rightArrow = false;
        angleLimit3 -= 1;
       }
    }
}


function init(){
    'use strict';

    renderer = new THREE.WebGLRenderer({ antialias: true});

    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);

    createScene();

    createCameraPerspective();          //perspetiva
    createCameraTop();                  //ortográfica topo
    createCameraSide();                 //ortográfica lateral
    createCameraFront();                //ortográfica frente

    camera = cameraTop;

    render();

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);
}

function animate() {
    'use strict';

    checkCamera();
    checkCannonSelection();
    checkCannonRotation();
    //processInputKeys();

    render();
    requestAnimationFrame(animate);
}
