/*global THREE*/

var camera, cameraPerspective, cameraTop, cameraSide, cameraFront, cameraBall;

var floor, wall1, wall2, wall3, wall4;
var cannon1, cannon2, cannon3;

var cameraFactor = 7;

var changeCameraTop = false;
var changeCameraFront = false;
var changeCameraSide = false;
var changeCameraPerspective = false;
var changeCameraBall = false;

var selectDownCannon = false;
var selectCenterCannon = false;
var selectTopCannon = false;
var leftArrow = false;
var rightArrow = false;
var shootCannon = false;

var switchAxisVisibility = false;

var largura = 70;
var comprimento = 2*largura;
var espessura = 1;
var altura = 16;

var wallsVectors = new Array(3);

var raioBola = altura/4;
var ballsNum = 5;
var balls = new Array(ballsNum+20);         // para as que vao ser disparadas
var ballsAxis = new Array(ballsNum+20);
var ballsVectors = new Array(ballsNum+20);

var cannonsVectors = new Array(3);

var scene, renderer;
var geometry, material, material2, material3, material4, mesh;
var mesh1, mesh2, mesh3;

var downCannonCenter, centerCannonCenter, topCannonCenter;

var cannonRotation = Math.PI/32; //0.1

var angleLimit1 = 0;
var angleLimit2 = 0;
var angleLimit3 = 0;

var cannon1BallAngle = 0;
var cannon2BallAngle = 0;
var cannon3BallAngle = 0;

var vectorZZ = new THREE.Vector3(0,0,1).normalize();
var vectorYY = new THREE.Vector3(0,1,0).normalize();
var vectorXX = new THREE.Vector3(1,0,0).normalize();

var velocity = new Array(ballsNum+20);

this.ballPivot = new THREE.Group();


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

function createCameraBall() {
    'use strict';
    cameraBall = new THREE.PerspectiveCamera(70,
                                        window.innerWidth / window.innerHeight,
                                        1,
                                        1000);

    balls[0].add(cameraBall);

    var x = balls[0].position.x;
    var y = balls[0].position.y;
    var z = balls[0].position.z;

    console.log(x);
    console.log(y);
    console.log(z);

    cameraBall.position.x = x;
    cameraBall.position.y = y+100;
    cameraBall.position.z = z;

    //cameraBall.position.set(x, y, z);
    //cameraBall.lookAt(x, y, z);
    console.log(balls[0].position);
    cameraBall.lookAt(balls[0].position);
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
    createCameraBall();

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

    //wallsVectors[0] = new THREE.Vector3(1, 0, 0);
    //wallsVectors[1] = new THREE.Vector3(0, 0, 1);
    //wallsVectors[2] = new THREE.Vector3(0, 0, -1);

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
        ballsVectors[i] = new THREE.Vector3(0, 0, 1);
        balls[i] = new THREE.Object3D();
        velocity[i] = 0;

        mesh = new THREE.Mesh(geometry, material);
        balls[i].add(mesh);
        balls[i].add(ballsAxis[i]);





        while(true){

            var haColisao = false;
            var x = getRandomInt(-70, -30);
            var y = raioBola;
            var z = getRandomInt(-55, 55);


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
    cannonsVectors[0] = new THREE.Vector3(0, 0, 1);

    mesh1.rotation.x = Math.PI / 2;
    mesh1.rotation.z = Math.PI / 2;

	mesh1.position.set(0, 5, 0);

    downCannonCenter = new THREE.Object3D();
	downCannonCenter.position.set(x, y, z);
    downCannonCenter.add(mesh1);

    obj.add(downCannonCenter);
}

function addCannon2(obj, x, y, z, material){
    'use strict';
    geometry = new THREE.CylinderGeometry(5, 5, 24);
    mesh2 = new THREE.Mesh(geometry, material);
    cannonsVectors[1] = new THREE.Vector3(0, 0, 1);

    mesh2.rotation.x = Math.PI / 2;
    mesh2.rotation.z = Math.PI / 2;

	mesh2.position.set(0, 5, 0);

    centerCannonCenter = new THREE.Object3D();
	centerCannonCenter.position.set(x, y, z);
    centerCannonCenter.add(mesh2);

    obj.add(centerCannonCenter);
}

function addCannon3(obj, x, y, z, material){
    'use strict';
    geometry = new THREE.CylinderGeometry(5, 5, 24);
    mesh3 = new THREE.Mesh(geometry, material);
    cannonsVectors[2] = new THREE.Vector3(0, 0, 1);

    mesh3.rotation.x = Math.PI / 2;
    mesh3.rotation.z = Math.PI / 2;

	mesh3.position.set(0, 5, 0);

	topCannonCenter = new THREE.Object3D();
	topCannonCenter.position.set(x, y, z);
    topCannonCenter.add(mesh3);

    obj.add(topCannonCenter);
}

/*
function onResize() {
    'use strict';

    renderer.setSize(window.innerWidth, window.innerHeight);

    if (window.innerHeight > 0 && window.innerWidth > 0) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    }
}
*/

function onResize() {
    'use strict';

    // notify the renderer of the size change
    renderer.setSize(window.innerWidth, window.innerHeight);
    // update the camera

    cameraTop.left = -window.innerWidth / cameraFactor;
    cameraTop.right = window.innerWidth / cameraFactor;
    cameraTop.top = window.innerHeight / cameraFactor;
    cameraTop.bottom = -window.innerHeight / cameraFactor;
    cameraTop.updateProjectionMatrix();

    cameraPerspective.left = -window.innerWidth / cameraFactor;
    cameraPerspective.right = window.innerWidth / cameraFactor;
    cameraPerspective.top = window.innerHeight / cameraFactor;
    cameraPerspective.bottom = -window.innerHeight / cameraFactor;
    cameraPerspective.updateProjectionMatrix();

    /*
    cameraBall.left = -window.innerWidth / cameraFactor;
    cameraBall.right = window.innerWidth / cameraFactor;
    cameraBall.top = window.innerHeight / cameraFactor;
    cameraBall.bottom = -window.innerHeight / cameraFactor;
    cameraBall.updateProjectionMatrix();
    */
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
    case 51:    // tecla 3
        changeCameraBall = true;
        break;


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
        switchAxisVisibility = true;
        break;
    }
}

function checkAxisVisibility(){
    if (switchAxisVisibility){

        scene.traverse(function (node) {
            if (node instanceof THREE.AxisHelper) {
                node.visible = !node.visible;
            }
        });

    switchAxisVisibility = false;
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
    else if(changeCameraBall){
        camera = cameraBall;
        changeCameraBall = false;
    }
}
// -------------------------------------------------


function checkCannonSelection(){
    if(selectDownCannon){

        mesh2.material.color.setHex(0x0066ff);
        mesh3.material.color.setHex(0x0066ff);

        mesh1.material.color.setHex(0xffffff);
    }

    else if(selectCenterCannon){

        mesh1.material.color.setHex(0x0066ff);
        mesh3.material.color.setHex(0x0066ff);

        mesh2.material.color.setHex(0xffffff);
    }

    else if(selectTopCannon){

        mesh1.material.color.setHex(0x0066ff);
        mesh2.material.color.setHex(0x0066ff);

        mesh3.material.color.setHex(0xffffff);
    }
}

function checkCannonRotation(){
    if(selectDownCannon){
        if(leftArrow){
            if(angleLimit1 < 4){
                downCannonCenter.rotateY(cannonRotation);
                angleLimit1 += 1;
            }
            leftArrow = false;
        }
        else if(rightArrow){
            if(angleLimit1 > -4){
                downCannonCenter.rotateY(-cannonRotation);
                angleLimit1 -= 1;
            }
            rightArrow = false;
        }
    }

    else if(selectCenterCannon){
       if(leftArrow){
            if(angleLimit2 < 4){
                centerCannonCenter.rotateY(cannonRotation);
                angleLimit2 += 1;
            }
            leftArrow = false;
        }
        else if(rightArrow){
            if(angleLimit2 > -4){
                centerCannonCenter.rotateY(-cannonRotation);
                angleLimit2 -= 1;
            }
            rightArrow = false;
        }
    }

    else if(selectTopCannon){
       if(leftArrow){
            if(angleLimit3 < 4){
                topCannonCenter.rotateY(cannonRotation);
                angleLimit3 += 1;
            }
            leftArrow = false;
        }
        else if(rightArrow){
            if(angleLimit3 > -4){
                topCannonCenter.rotateY(-cannonRotation);
                angleLimit3 -= 1;
            }
            rightArrow = false;
        }
    }
}

function checkCannonShoot(){
    if(selectDownCannon){
        if(shootCannon){

            console.log(ballsNum);
            createCannonBall(50, raioBola, 40);
            //sleep();
            cannon1BallAngle = angleLimit1*cannonRotation;
            balls[ballsNum-1].rotateY(cannon1BallAngle);
            //balls[ballsNum-1].position.x -= 10;

            //balls[0].rotateY(0.5);      // debug
            //balls[0].position.x += 30;

        }
        shootCannon = false;
    }

    else if(selectCenterCannon){
        if(shootCannon){

            createCannonBall(50, raioBola, 0);
            cannon2BallAngle = angleLimit2*cannonRotation;
            balls[ballsNum-1].rotateY(cannon2BallAngle);

        }
        shootCannon = false;
    }

    else if(selectTopCannon){
        if(shootCannon){

            createCannonBall(50, raioBola, -40);
            cannon3BallAngle = angleLimit3*cannonRotation;
            balls[ballsNum-1].rotateY(cannon3BallAngle);

        }
        shootCannon = false;
    }
}


function sleep(){
   for (var i=0; i<2000000000; i++){
        i += 1;
        i-= 1;
    }
}

function createCannonBall(x, y, z){
    geometry = new THREE.SphereGeometry(raioBola, 15, 15);
    material = new THREE.MeshBasicMaterial({ color: 0xff00ff, wireframe: true });
    ballsAxis[ballsNum] = new THREE.AxisHelper(10); //Adicionar eixos para as bolas
    ballsVectors[ballsNum] = new THREE.Vector3(0, 0, 1);
    balls[ballsNum] = new THREE.Object3D();

    mesh = new THREE.Mesh(geometry, material);
    balls[ballsNum].add(mesh);
    balls[ballsNum].add(ballsAxis[ballsNum]);

    velocity[ballsNum] = getRandomArbitrary(.5, 1.5);

    this.balls[ballsNum] = mesh;
    this.ballPivot.add(this.balls[ballsNum]);

    balls[ballsNum].position.set(x, y, z);
    scene.add(this.ballPivot.balls[ballsNum]);

    ballsNum++;

}

function doMoveBalls(){
    for (i= 0; i < ballsNum; i++){
      if (velocity[i]>0){
        balls[i].translateX(-velocity[i]);
        balls[i].rotateZ(velocity[i]);
        velocity[i] = velocity[i]*.995;
      }
    }
}


function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
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

    //resize();
    //balls[0].position.x++;  //debug

    checkAxisVisibility();
    checkCamera();
    checkCannonSelection();
    checkCannonRotation();
    checkCannonShoot();
    doMoveBalls();
    //processInputKeys();

    render();
    requestAnimationFrame(animate);
}
