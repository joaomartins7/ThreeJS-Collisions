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

var raioBola = altura/2;        //FIXME tava a dividir por quatro
var ballsNum = 10;
var cannonBallsNum = 100;
var balls = new Array(ballsNum+cannonBallsNum);
var ballsAxis = new Array(ballsNum+cannonBallsNum);
var ballsMesh = new Array(ballsNum+cannonBallsNum);
var ballsVectors = new Array(ballsNum+cannonBallsNum);

var cannonsVectors = new Array(3);

var scene, renderer;
var geometry, material, material2, material3, material4, mesh;
var mesh1, mesh2, mesh3;

var downCannonCenter, centerCannonCenter, topCannonCenter;

var cannonRotation = 0.1; //Math.PI/32

var angleLimit1 = 0;
var angleLimit2 = 0;
var angleLimit3 = 0;

var cannon1BallAngle = 0;
var cannon2BallAngle = 0;
var cannon3BallAngle = 0;

var forcaDeAtrito = 0.995;

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
    cameraPerspective.position.x = 120;
    cameraPerspective.position.y = 120;
    cameraPerspective.position.z = 120;
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

    /*
    console.log(x);
    console.log(y);
    console.log(z);
    */

    cameraBall.position.x = x;
    cameraBall.position.y = y;
    cameraBall.position.z = z;

    //cameraBall.position.set(x, y, z);
    //cameraBall.lookAt(x, y, z);
    //console.log(balls[0].position);
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



    scene.add(wall1);       // esquerda
    scene.add(wall2);       // baixo
    scene.add(wall3);       // cima
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
        balls[i] = new THREE.Object3D();

        ballsMesh[i] = new THREE.Mesh(geometry, material);
        balls[i].add(ballsMesh[i]);
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


        var velX = getRandomArbitrary(-0.8,0.8);
        var velZ = getRandomArbitrary(-0.8,0.8);

        ballsVectors[i] = new THREE.Vector3(velX, 0, velZ);

        console.log(ballsVectors[i]);

        scene.add(balls[i]);
    }

}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function addFloor(obj, x, y, z){
    'use strict';
    geometry = new THREE.CubeGeometry(largura*2.5, 0, comprimento);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x+2, y, z);
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
    geometry = new THREE.CubeGeometry(largura*2.48 + 2*espessura, espessura, altura);
    mesh = new THREE.Mesh(geometry, material);

    mesh.rotation.x = Math.PI / 2;

    mesh.position.set(x+51.8, y, z);
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


    cameraPerspective.aspect = window.innerWidth / window.innerHeight;
    cameraPerspective.updateProjectionMatrix();


    cameraBall.aspect = window.innerWidth / window.innerHeight;
    cameraBall.updateProjectionMatrix();

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

    case 82: // R
    case 114: // r
        switchAxisVisibility = true;
        break;
    }
}

function checkMove(){

    var i, j;
    for(i = 0; i < ballsNum; i++){
        checkBallWallColisions(i);
        for(j = i+1; j < ballsNum; j++){
            checkBallBallColision(i,j);
        }
    }

    for(i = 0; i < ballsNum; i++){

        ballsVectors[i].x *= forcaDeAtrito;
        ballsVectors[i].z *= forcaDeAtrito;
        balls[i].position.x += ballsVectors[i].x;
        balls[i].position.z += ballsVectors[i].z;
        ballsMesh[i].rotateX(ballsVectors[i].x);
        ballsMesh[i].rotateZ(ballsVectors[i].z);
    }
}

function checkBallBallColision(b1,b2){

    var c1x = balls[b1].position.x;
    var c1z = balls[b1].position.z;
    var c2x = balls[b2].position.x;
    var c2z = balls[b2].position.z;
    var coef = 1;

    if((2*raioBola)**2 >= (((c1x)-(c2x))**2 + ((c1z)-(c2z))**2)){
        var v1x = ballsVectors[b1].x;
        var v1z = ballsVectors[b1].z;
        var v2x = ballsVectors[b2].x;
        var v2z = ballsVectors[b2].z;

        coef = ((v1x - v2x)*(c1x-c2x) + (v1z-v2z)*(c1z-c2z)) / ((c1x-c2x)**2 + (c1z-c2z)**2);
        ballsVectors[b1].x = v1x - coef*(c1x-c2x);
        ballsVectors[b1].z = v1z - coef*(c1z-c2z);

        coef = ((v2x - v1x)*(c2x-c1x) + (v2z-v1z)*(c2z-c1z)) / ((c2x-c1x)**2 + (c2z-c1z)**2);
        ballsVectors[b2].x = v2x - coef*(c2x-c1x);
        ballsVectors[b2].z = v2z - coef*(c2z-c1z);

    }
}

function checkBallWallColisions(b1){

    //colisao com canto inferior esquerdo da cerca
    if(balls[b1].position.z >= 62 && balls[b1].position.x <= -77){
        ballsVectors[b1].z = -ballsVectors[b1].z;
        ballsVectors[b1].x = -ballsVectors[b1].x;
    }

    //colisao com canto superior esquerdo da cerca
    else if(balls[b1].position.z <= -62 && balls[b1].position.x <= -77){
        ballsVectors[b1].z = -ballsVectors[b1].z;
        ballsVectors[b1].x = -ballsVectors[b1].x;
    }

    //colisao com a parede de baixo
    if(balls[b1].position.z >= 62){
        ballsVectors[b1].z = -ballsVectors[b1].z;
    }

    //colisao com a parede de cima
    else if(balls[b1].position.z <= -62){
        ballsVectors[b1].z = -ballsVectors[b1].z;
    }

    //colisao com a parede da esquerda
    else if(balls[b1].position.x <= -77){
        ballsVectors[b1].x = -ballsVectors[b1].x;
    }


    //colisao com a parede da 'direita' (nao existe)
    else if(balls[b1].position.x >= 90){
        //ballsVectors[b1].x = -ballsVectors[b1].x;

        balls[b1].position.y -= 5;

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
        //updateCameraBallTarget();
        changeCameraBall = false;
    }
}
// -------------------------------------------------


function updateCameraBallTarget(){

    balls[ballsNum-1].add(cameraBall);

    var x = balls[ballsNum-1].position.x;
    var y = balls[ballsNum-1].position.y;
    var z = balls[ballsNum-1].position.z;

    var velX = ballsVectors[ballsNum-1].x;
    var velZ = ballsVectors[ballsNum-1].z;

    var distancia = 15;

    cameraBall.position.x = 0;
    cameraBall.position.y = 20;
    cameraBall.position.z = 40;

    //cameraBall.lookAt(balls[ballsNum-1].position);
    cameraBall.lookAt(x, y, z);


    /*
    var vectorBall = new THREE.Vector3(-velX, 10, -velZ).normalize;
    cameraBall.position.set(x, y, z);
    cameraBall.lookAt(-vectorBall.x, 10, -vectorBall.z);
    */

    /*
    balls[ballsNum-1].add(cameraBall);
    cameraBall.position.set(0,60,-100);
    cameraBall.lookAt(balls[ballsNum-1].position);
    */
}

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

            cannon1BallAngle = angleLimit1*cannonRotation;
            console.log(cannon1BallAngle);
            createBall(50, raioBola, 40, cannon1BallAngle);
            updateCameraBallTarget();
            //balls[ballsNum-1].rotateY(cannon1BallAngle);

        }
        shootCannon = false;
    }

    else if(selectCenterCannon){
        if(shootCannon){

            cannon2BallAngle = angleLimit2*cannonRotation;
            createBall(50, raioBola, 0, cannon2BallAngle);
            updateCameraBallTarget();
            //balls[ballsNum-1].rotateY(cannon2BallAngle);

        }
        shootCannon = false;
    }

    else if(selectTopCannon){
        if(shootCannon){

            cannon3BallAngle = angleLimit3*cannonRotation;
            createBall(50, raioBola, -40, cannon3BallAngle);
            updateCameraBallTarget();
            //balls[ballsNum-1].rotateY(cannon3BallAngle);

        }
        shootCannon = false;
    }
}

function createBall(x, y, z, cannonBallAngle){
    geometry = new THREE.SphereGeometry(raioBola, 15, 15);
    material = new THREE.MeshBasicMaterial({ color: 0xff00ff, wireframe: true });
    ballsAxis[ballsNum] = new THREE.AxisHelper(10); //Adicionar eixos para as bolas

    balls[ballsNum] = new THREE.Object3D();

    ballsMesh[ballsNum] = new THREE.Mesh(geometry, material);
    balls[ballsNum].add(ballsMesh[ballsNum]);
    balls[ballsNum].add(ballsAxis[ballsNum]);

    balls[ballsNum].position.set(x, y, z);

    var velX = getRandomArbitrary(-0.4,-0.1);

    ballsVectors[ballsNum] = new THREE.Vector3(velX, 0, cannonBallAngle*2.2);

    scene.add(balls[ballsNum]);
    ballsNum++;
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



    checkMove();

    checkAxisVisibility();
    checkCamera();
    checkCannonSelection();
    checkCannonRotation();
    checkCannonShoot();


    render();
    requestAnimationFrame(animate);
}
