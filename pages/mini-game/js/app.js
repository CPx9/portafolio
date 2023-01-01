let scene, camera, renderer, container;
let winningAudio = new Audio('audio/win.mp3'),
    losingAudio = new Audio('audio/lose.mp3');

container = document.querySelector('.container');

scene = new THREE.Scene();


let contSize = {
    width: container.clientWidth,
    height: container.clientHeight
};

camera = new THREE.PerspectiveCamera(50, contSize.width / contSize.height, 0.1, 500);
camera.position.set(0, 0, 80);

/*loader = new THREE.TextureLoader();
const urls = [
    './sides/five.png', './sides/three.png',
    './sides/six.png', './sides/one.png',
    './sides/two.png', './sides/four.png'
];
const materials = urls.map(url => {
    return new THREE.MeshStandardMaterial({
        color: 0xffffff,
        map: loader.load(url),
        roughness: .3,
        metalness: 0

    });
});*/

let format = new THREE.BoxGeometry(10, 10, 10),
    mat = new THREE.MeshStandardMaterial({
        color: 0x0ff0ff,
        transparent: true,
        opacity: .5,
    });
let object = new THREE.Mesh(format, mat);
object.name = "first";
scene.add(object);
object.position.set(20, 0, 0);


format = new THREE.BoxGeometry(10, 10, 10),
    mat = new THREE.MeshStandardMaterial({
        color: 0x0ff0ff,
        transparent: true,
        opacity: .5,
    });
let object1 = new THREE.Mesh(format, mat);
object1.name = "second";
scene.add(object1);
object1.position.set(0, 0, 0);

format = new THREE.BoxGeometry(10, 10, 10),
    mat = new THREE.MeshStandardMaterial({
        color: 0x0ff0ff,
        transparent: true,
        opacity: .5,
    });
let object2 = new THREE.Mesh(format, mat);
object2.name = "third";
scene.add(object2);
object2.position.set(-20, 0, 0);


const ambient = new THREE.AmbientLight(0xff0000, 5);
scene.add(ambient);

const light = new THREE.PointLight(0xffffff, 1);
light.position.set(0, 0, 10);
scene.add(light);



renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(contSize.width, contSize.height);
container.appendChild(renderer.domElement);

let unselectedObjects = [],
    selectedObjects = [];

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

let validObj = scene.children.filter(obj => obj.material);

for (let i = validObj.length - 1; i >= 0; i--) {
    unselectedObjects[i] = {
        mesh: validObj[i],
        name: validObj[i].name,
        opacity: validObj[i].material.opacity
    };
}

function onMouseMove(event) {
    event.preventDefault();

    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components

    mouse.x = (event.clientX / contSize.width) * 2 - 1;
    mouse.y = -(event.clientY / contSize.height) * 2 + 1;

}

function reset() {
    for (let i = 0; i < validObj.length; i++) {
        if (validObj[i].material) {
            validObj[i].material.opacity = .5;
        }
    }
}

function hover() {
    raycaster.setFromCamera(mouse, camera);

    // calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects(validObj, true);

    if (intersects.length > 0) {
        intersects[0].object.material.opacity = .8;
    };
}

function click() {
    raycaster.setFromCamera(mouse, camera);

    // calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects(validObj, true);

    if (intersects.length > 0) {
        intersects[0].object.material.opacity = 1;
        let removed = validObj.splice(validObj.indexOf(intersects[0].object), 1);
        for (let i = 0; i < unselectedObjects.length; i++) {
            if (unselectedObjects[i].name == removed[0].name) {
                selectedObjects.push(unselectedObjects[i]);
                unselectedObjects.splice(i, 1);
            }
        }
        if (unselectedObjects.length == 0) {
            let randomNum = Math.round(Math.random());
            let condition = selectedObjects[randomNum].name == "second" && selectedObjects[2].name == "first";
            if (condition) {
		winningAudio.play();
                alert("you win");
                window.location.reload();
            } else {
		losingAudio.play();
                alert("you lose");
                window.location.reload();
            }
        }
    };
}

function render() {

    requestAnimationFrame(render);
    reset();
    hover();
    window.addEventListener('click', click);
    object.rotation.y += 0.005;
    object.rotation.x += 0.005;
    object1.rotation.y += 0.005;
    object1.rotation.x += 0.005;
    object2.rotation.y += 0.005;
    object2.rotation.x += 0.005;
    renderer.render(scene, camera);

}


window.addEventListener('mousemove', onMouseMove, false);

render();