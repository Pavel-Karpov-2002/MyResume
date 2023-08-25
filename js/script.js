const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()
const objectsDistance = 4;
const loader = new THREE.GLTFLoader();
gsap.registerPlugin(ScrollTrigger, ScrollSmoother)

//#region load models
let loaderFront = [];
let loaderBack = [];
let loaderUnity = [];
let sectionsModels = [];

//#region frontend models

if (ScrollTrigger.isTouch !== 1) {
    const addToLoader = (loader, object, position) => {
        loader[loader.length] = {
            model: object,
            positionX: position
        }
    }
    loader.load('./models/HTML.gltf', function (gltf) {
        gltf.scene.position.y = -objectsDistance * 0.3 + (-objectsDistance);
        gltf.scene.position.x = -5;
        scene.add(gltf.scene);
        addToLoader(loaderFront, gltf.scene, -1.6);
    });
    loader.load('./models/CSS.gltf', function (gltf) {
        gltf.scene.position.y = -objectsDistance * 0.1 + (-objectsDistance);
        gltf.scene.position.x = -5;
        scene.add(gltf.scene);
        addToLoader(loaderFront, gltf.scene, -2.7);
    });
    loader.load('./models/threeJS.gltf', function (gltf) {
        gltf.scene.position.y = -objectsDistance * 0 + (-objectsDistance);
        gltf.scene.position.x = -5;
        scene.add(gltf.scene);
        addToLoader(loaderFront, gltf.scene, -1);
    });
    loader.load('./models/react.gltf', function (gltf) {
        gltf.scene.position.y = (objectsDistance * 0.22) + (-objectsDistance);
        gltf.scene.position.x = -5;
        scene.add(gltf.scene);
        addToLoader(loaderFront, gltf.scene, -2.2);
    });
    //#endregion

    //#region backend models
    loader.load('./models/CSharp.gltf', function (gltf) {
        gltf.scene.position.y = -objectsDistance * 0.3 + (-objectsDistance * 2);
        gltf.scene.position.x = 5;
        scene.add(gltf.scene);
        addToLoader(loaderBack, gltf.scene, 1.6);
    });
    loader.load('./models/WPF.gltf', function (gltf) {
        gltf.scene.position.y = -objectsDistance * 0 + (-objectsDistance * 2);
        gltf.scene.position.x = 5;
        scene.add(gltf.scene);
        addToLoader(loaderBack, gltf.scene, 0.8);
    });
    loader.load('./models/git.gltf', function (gltf) {
        gltf.scene.position.y = -objectsDistance * 0.35 + (-objectsDistance * 2);
        gltf.scene.position.x = 5;
        scene.add(gltf.scene);
        addToLoader(loaderBack, gltf.scene, 0.4);
    });
    loader.load('./models/sql.gltf', function (gltf) {
        gltf.scene.position.y = -objectsDistance * 0 + (-objectsDistance * 2);
        gltf.scene.position.x = 5;
        scene.add(gltf.scene);
        addToLoader(loaderBack, gltf.scene, 2);
    });
    //#endregion

    //#region unity model
    loader.load('./models/unity.gltf', function (gltf) {
        gltf.scene.position.y = -objectsDistance * 0 + (-objectsDistance * 3);
        gltf.scene.position.x = -5;
        gltf.scene.position.z = 1;
        scene.add(gltf.scene);
        addToLoader(loaderUnity, gltf.scene, 0);
    });
    //#endregion
}
sectionsModels = [loaderFront, loaderBack, loaderUnity];
//#endregion

//#region background

const particlesCount = 300
let particlesGeometry = new THREE.BufferGeometry()
const positions = new Float32Array(particlesCount * 3)

for (let i = 0; i < particlesCount; i++) {
    positions[i * 3 + 0] = (Math.random() - 0.5) * 10
    positions[i * 3 + 1] = objectsDistance * 0.5 - Math.random() * objectsDistance * (sectionsModels.length + 1)
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
}



// Material
const particlesMaterial = new THREE.PointsMaterial({
    color: '#fff',
    sizeAttenuation: true,
    transparent: true,
    size: 0.05,
    opacity: 1
})

// Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
particles.geometry.attributes.position.needsUpdate = true;
scene.add(particles)
//#endregion

//#region light
const directionalLight = new THREE.DirectionalLight('#ffffff', 0.5)
directionalLight.position.set(7, 0, 7)
scene.add(directionalLight)
const directionalLight_2 = new THREE.DirectionalLight('#ffffff', 0.8)
directionalLight_2.position.set(-7, 0, 7)
scene.add(directionalLight_2)
//#endregion

//#region resize scene
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})
//#endregion

//#region for parallax
const cursor = {}
cursor.x = 0
cursor.y = 0

window.addEventListener('mousemove', (event) => {
    cursor.x = event.clientX / sizes.width - 0.5;
    cursor.y = event.clientY / sizes.height - 0.5;
})
//#endregion

//#region render
const cameraGroup = new THREE.Group()
scene.add(cameraGroup)
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100);
camera.position.z = 6;
cameraGroup.add(camera);

const renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas: canvas,
    alpha: true
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const clock = new THREE.Clock()
let previousTime = 0
let onLoadFront = false;
let onLoadBack = false;
let onLoadUnity = false;

function changeRotation(obj, deltaTime, xAdd, yAdd) {
    obj.rotation.x += deltaTime * xAdd;
    obj.rotation.y += deltaTime * yAdd;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

const tick = () => {
    let elapsedTime = clock.getElapsedTime();
    let deltaTime = elapsedTime - previousTime;
    previousTime = elapsedTime;
    if (ScrollTrigger.isTouch !== 1) {
        if (onLoadFront) {
            changeRotation(loaderFront[0].model, deltaTime, 0, 0.25);
            changeRotation(loaderFront[1].model, deltaTime, 0, 0.2);
            changeRotation(loaderFront[2].model, deltaTime, 0.3, 0.3);
            changeRotation(loaderFront[3].model, deltaTime, 0.4, 0.4);
        }

        if (onLoadBack) {
            changeRotation(loaderBack[0].model, deltaTime, 0, 1.35);
            changeRotation(loaderBack[1].model, deltaTime, 0, -1.3);
            changeRotation(loaderBack[2].model, deltaTime, 0, -1.45);
            changeRotation(loaderBack[3].model, deltaTime, 0, 1.32);
        }

        if (onLoadUnity) {
            changeRotation(loaderUnity[0].model, deltaTime, 0, 0.3);
        }
    }

    camera.position.y = - scrollY / sizes.height * objectsDistance
    particles.rotation.y += 0.001;
    const parallaxX = cursor.x * 0.5
    const parallaxY = - cursor.y * 0.5

    cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 5 * deltaTime
    cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 5 * deltaTime
    renderer.render(scene, camera)

    window.requestAnimationFrame(tick)
}

tick();
//#endregion

//#region sleep to loader

if (ScrollTrigger.isTouch !== 1) {
    let frontLoader = setInterval(() => {
        if (loaderFront.length > 3 && loaderFront[loaderFront.length - 1]?.model) {
            onLoadFront = true;
            scroll();
            clearInterval(frontLoader);
        }
    }, (200));

    let backLoader = setInterval(() => {
        if (loaderBack.length > 3 && loaderBack[loaderBack.length - 1]?.model) {
            onLoadBack = true;
            scroll();
            clearInterval(backLoader);
        }
    }, (300));

    let unityLoader = setInterval(() => {
        if (loaderUnity.length > 0 && loaderUnity[loaderUnity.length - 1]?.model) {
            onLoadUnity = true;
            scroll();
            clearInterval(unityLoader);
        }
    }, (400));
}
//#endregion

//#region scroll
const scroll = () => {
    if (ScrollTrigger.isTouch !== 1) {
        const visibleSectionModels = (objects, elementTrigger, unvisiblePos = -5) => {
            objects.forEach(element => {
                gsap.fromTo(element.model.position, { x: unvisiblePos },
                    {
                        x: element.positionX,
                        scrollTrigger: {
                            trigger: elementTrigger,
                            start: '-800',
                            end: '200',
                            scrub: true
                        }
                    }
                );
            });
        }
        ScrollSmoother.create({
            wrapper: '.wrapper',
            content: '.scroll__content',
            smooth: 1.2,
            effects: true
        });

        let itemsR = gsap.utils.toArray('.section_right.front');

        itemsR.forEach(element => {
            gsap.fromTo(element, { x: 500, opacity: 0 },
                {
                    x: 0, opacity: 1,
                    scrollTrigger: {
                        trigger: element,
                        start: '-850',
                        end: '-100',
                        scrub: true
                    }
                });
            visibleSectionModels(sectionsModels[0], element, -5);
        });

        let itemsL = gsap.utils.toArray('.section_left');

        itemsL.forEach(element => {
            gsap.fromTo(element, { x: -500, opacity: 0 },
                {
                    x: 0, opacity: 1,
                    scrollTrigger: {
                        trigger: element,
                        start: '-850',
                        end: '-100',
                        scrub: true
                    }
                });
            visibleSectionModels(sectionsModels[1], element, 5);
        });

        let unity = gsap.utils.toArray('.unity');

        unity.forEach(element => {
            gsap.fromTo(element, { x: 500, opacity: 0 },
                {
                    x: 0, opacity: 1,
                    scrollTrigger: {
                        trigger: element,
                        start: '-850',
                        end: '-100',
                        scrub: true
                    }
                });
            visibleSectionModels(sectionsModels[2], element, -5);
        });
    }
}
//#endregion