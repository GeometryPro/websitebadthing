
class Mouse {
    constructor(canvas) {
        this.x = window.innerWidth / 2,
        this.y = -1000

        canvas.addEventListener('mousemove', (evt) => {
            let rect = canvas.getBoundingClientRect();
            this.x = evt.clientX - rect.left - window.innerWidth/2,
            this.y = evt.clientY - rect.top - window.innerHeight/2
        })
        canvas.addEventListener('mouseleave', (evt) => {
            this.x = window.innerWidth / 2,
            this.y = -1000
        })
    }
}
class Particle {
    constructor(x, y, radius, color,speed) {
        // Look
        this.x = x;
        this.y = y;
        this.radius = radius || 5;

        // Phys
        this.vx = 0;
        this.vy = 0;
        this.friction = 0.9;
        this.springForce = 0.08;

        this.originalX = x || 0;
        this.originalY = y || 0;

        this.speed = speed;
    }

    updatePosition(x, y) {
        this.y = y;
        this.x = x;
    }

    phys(mouse, balls) {
        let dx = this.x - mouse.x;
        let dy = this.y - mouse.y;
        let dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius + this.radius) {
            let angle = Math.atan2(dy, dx);
            let tx = mouse.x + Math.cos(angle) * (mouse.radius + this.radius);
            let ty = mouse.y + Math.sin(angle) * (mouse.radius + this.radius);

            let tz = mouse.x + Math.sin(angle) * (mouse.radius + this.radius);

            this.vx += tx - this.x;
            this.vy += ty - this.y;
        }

        // Friction
        this.vx *= this.friction;
        this.vy *= this.friction;
        this.vz *= this.friction;

        // Final velocity
        this.x += this.vx;
        this.y += this.vy;
        this.z += this.vz;

        
    }

    spring() {
        let dx1 = this.x - this.originalX;
        let dy1 = this.y - this.originalY;
        let dz1 = this.z - this.originalZ;
        this.vx += -(dx1 * this.springForce);
        this.vy += -(dy1 * this.springForce);
        this.vz += -(dz1 * this.springForce);
    }
}
class app {
  constructor() {
    this.RENDERER;
    this.SCENE;
    this.CAMERA;
    this.CONTROL;
    this.PLANE;

    this.dots = [];

    this.time = 0;

    this.init();
    this.render();
  }

  init() {
    this.initRenderer();
    this.intScene();
    this.initObjects();
    this.initCamera();
    this.initLights();
    this.initEventListners();
    
    let dist = this.CAMERA.position.z - this.PLANE.position.z;
    let height = window.innerHeight/100;
    this.CAMERA.fov = 2 * Math.atan(height / (2 * dist)) * (180 / Math.PI);
    this.CAMERA.updateProjectionMatrix();
  }

  initEventListners() {
    window.addEventListener('resize', this.onWindowResize.bind(this), false);
  }

  initRenderer() {
    this.RENDERER = new THREE.WebGLRenderer();
    this.RENDERER.setSize(window.innerWidth, window.innerHeight);
    this.RENDERER.setClearColor(0x000000, 1);
    this.RENDERER.shadowMap.enabled = true;
    document.querySelector('.container').appendChild(this.RENDERER.domElement);

    this.MOUSE = new Mouse(this.RENDERER.domElement);
    this.MOUSE.radius = 40;
  }

  intScene() {
    this.SCENE = new THREE.Scene();
  }

  initCamera() {
    this.CAMERA = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.CAMERA.position.z = 0.8
  }

  initLights() {
    const pointLight = new THREE.PointLight(0xFFFFFF);

    pointLight.position.set(1, 2, 2);
    this.SCENE.add(pointLight);

    const sphereSize = 1;
    const pointLightHelper = new THREE.PointLightHelper(pointLight, sphereSize);
    this.SCENE.add(pointLightHelper);
  }

  initObjects() {

    this.geometry = new THREE.PlaneGeometry(window.innerWidth/100, window.innerHeight/100, 50, 50);
    this.geometry.elementsNeedUpdate = true;

    this.geometry.vertices.forEach((v, i) => {
      this.dots.push(new Particle(v.x*100, -v.y*100));
    })

    this.geometry.faces.forEach((f, i)=>{
      let color = new THREE.Color( 0xff0000 );
      f.vertexColors = color;
    })

    let material;

    material = new THREE.MeshBasicMaterial({
      wireframe: true,
      side: THREE.DoubleSide,
      // map: texture,
      color: 'orange'
    });

    this.PLANE = new THREE.Mesh(this.geometry, material);
    this.SCENE.add(this.PLANE)

  }

  onWindowResize() {
    this.CAMERA.aspect = window.innerWidth / window.innerHeight;
    this.CAMERA.updateProjectionMatrix();
    this.RENDERER.setSize(window.innerWidth, window.innerHeight);

    let dist = this.CAMERA.position.z - this.PLANE.position.z;
    let height = window.innerHeight/100;
    this.CAMERA.fov = 2 * Math.atan(height / (2 * dist)) * (180 / Math.PI);
    this.CAMERA.updateProjectionMatrix();
  }

  render() {
    requestAnimationFrame(this.render.bind(this));
    this.time++;
    this.geometry.verticesNeedUpdate = true;

    this.dots.forEach((d, i) => {
      d.phys(this.MOUSE, this.dots);
      d.spring();
    })

    this.geometry.vertices.forEach((v, i) => {
      // v.z = Math.sin(v.x * 10 + v.y * 10 + this.time * 0.02) / 15
      // + Math.sin(v.y * 10 + this.time * 0.02) / 20;
      v.z = Perlin(this.time / 200 + v.y, this.time / 200 + v.x, 0) / 10;
      v.x = (this.dots[i].x)/100;
      v.y = (-this.dots[i].y)/100;
    })


    this.CAMERA.updateProjectionMatrix();
    this.RENDERER.render(this.SCENE, this.CAMERA);
  }
}


new app();


function Perlin(x, y, z) {
  var p = new Array(512)
  var permutation = [151, 160, 137, 91, 90, 15,
    131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23,
    190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33,
    88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48, 27, 166,
    77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244,
    102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196,
    135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123,
    5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42,
    223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9,
    129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228,
    251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107,
    49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254,
    138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180
  ];
  for (var i = 0; i < 256; i++)
    p[256 + i] = p[i] = permutation[i];

  var X = Math.floor(x) & 255,                  // FIND UNIT CUBE THAT
    Y = Math.floor(y) & 255,                  // CONTAINS POINT.
    Z = Math.floor(z) & 255;
  x -= Math.floor(x);                                // FIND RELATIVE X,Y,Z
  y -= Math.floor(y);                                // OF POINT IN CUBE.
  z -= Math.floor(z);
  var u = fade(x),                                // COMPUTE FADE CURVES
    v = fade(y),                                // FOR EACH OF X,Y,Z.
    w = fade(z);
  var A = p[X] + Y, AA = p[A] + Z, AB = p[A + 1] + Z,      // HASH COORDINATES OF
    B = p[X + 1] + Y, BA = p[B] + Z, BB = p[B + 1] + Z;      // THE 8 CUBE CORNERS,

  return scale(lerp(w, lerp(v, lerp(u, grad(p[AA], x, y, z),  // AND ADD
    grad(p[BA], x - 1, y, z)), // BLENDED
    lerp(u, grad(p[AB], x, y - 1, z),  // RESULTS
      grad(p[BB], x - 1, y - 1, z))),// FROM  8
    lerp(v, lerp(u, grad(p[AA + 1], x, y, z - 1),  // CORNERS
      grad(p[BA + 1], x - 1, y, z - 1)), // OF CUBE
      lerp(u, grad(p[AB + 1], x, y - 1, z - 1),
        grad(p[BB + 1], x - 1, y - 1, z - 1)))));
}
function fade(t) { return t * t * t * (t * (t * 6 - 15) + 10); }
function lerp(t, a, b) { return a + t * (b - a); }
function grad(hash, x, y, z) {
  var h = hash & 15;                      // CONVERT LO 4 BITS OF HASH CODE
  var u = h < 8 ? x : y,                 // INTO 12 GRADIENT DIRECTIONS.
    v = h < 4 ? y : h == 12 || h == 14 ? x : z;
  return ((h & 1) == 0 ? u : -u) + ((h & 2) == 0 ? v : -v);
}
function scale(n) { return (1 + n) / 2; }