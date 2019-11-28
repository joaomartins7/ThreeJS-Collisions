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

var topcannonaxis = new THREE.Vector3(50, 0,-40).normalize();
var centercannonaxis = new THREE.Vector3(50, 0, 0).normalize();
var downcannonaxis = new THREE.Vector3(50, 0,40).normalize();

var largura = 70;
var comprimento = 2*largura;
var espessura = 1;
var altura = 16;

var wallsVectors = new Array(3);

var raioBola = altura/4;
var ballsNum = 1;
var balls = new Array(ballsNum);
var ballsAxis = new Array(ballsNum);
var ballsVectors = new Array(ballsNum);

var scene, renderer;
var geometry, material, material2, material3, mesh;


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

    material = new THREE.MeshBasicMaterial({ color: 0x0066ff, wireframe: true });

    addCannon(cannon1, 50, 0, 40);
    addCannon(cannon2, 50, 0, 0);
    addCannon(cannon3, 50, 0, -40);

    scene.add(cannon1);
    scene.add(cannon2);
    scene.add(cannon3);



}


function createBalls(){
    'use strict';

    for (var i = 0; i < 15; i += 1){

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
            var y = altura/2;
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

function addCannon(obj, x, y, z){
    'use strict';
    geometry = new THREE.CylinderGeometry(5, 5, 24);
    mesh = new THREE.Mesh(geometry, material);

    mesh.rotation.x = Math.PI / 2;
    mesh.rotation.z = Math.PI / 2;




    mesh.position.set(x, y, z);
    obj.add(mesh);
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
        break;
    case 87: // W
    case 119: // w
        selectCenterCannon = true;
        break;
    case 69: // E
    case 101: // e
        selectTopCannon = true;
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
        //cannon1.position.x += 2;
       //cannon1.material.color.setHex(0xffffff);
       //cannon1.setColor(0xffffff);
       //cannon1.Color.set(0xffffff);

       //selectDownCannon = false;
    }
    else if(selectCenterCannon){

    }
    else if(selectTopCannon){

    }
}


function checkCannonRotation(){
    if(selectDownCannon){
       if(leftArrow){
        //cannon1.rotateY(0.1);
        //cannon1.position.x -= 5;
        //cannon1.position.z += 5;
        cannon1.rotateOnAxis(downcannonaxis, 0.1);

        leftArrow = false;
       }
       if(rightArrow){
        //cannon1.rotateY(-0.1);
        //cannon1.position.x += 5;
        //cannon1.position.z -= 5;
        cannon1.rotateOnAxis(downcannonaxis, -0.1);

        rightArrow = false;
       }
       //selectDownCannon = false;
    }

    else if(selectCenterCannon){
        if(leftArrow){
        //cannon2.rotateY(0.1);
        //cannon1.rotation.y = 0.1;
        cannon2.rotateOnAxis(centercannonaxis, 0.1);

        leftArrow = false;
       }
       if(rightArrow){
        //cannon2.rotateY(-0.1);
        cannon2.rotateOnAxis(centercannonaxis, -0.1);
        rightArrow = false;
       }
       //selectCenterCannon = false;
    }

    else if(selectTopCannon){
        if(leftArrow){
        //cannon3.rotateY(0.1);
        //cannon1.rotation.y = 0.1;
        cannon3.rotateOnAxis(topcannonaxis, 0.1);
        leftArrow = false;
       }
       if(rightArrow){
        //cannon3.rotateY(-0.1);
        cannon3.rotateOnAxis(topcannonaxis, -0.1);
        rightArrow = false;
       }
       //selectTopCannon = false;
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
