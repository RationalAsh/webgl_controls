//Declare these as global so I can access them anywhere
var scene, camera, renderer, model, model_geom, boundingBox;

init();
animate();

function init(){
    //Create scene
    scene = new THREE.Scene();

    //Container in which the stl viewer will be
    var display_container = document.getElementById('stl_view');
    var cont_style = getComputedStyle(display_container, null);

    //Set width and height
    var WIDTH = parseInt(cont_style.getPropertyValue('width'));
    var HEIGHT = WIDTH;
    //var HEIGHT = parseInt(cont_style.getPropertyValue('height'));

    //Create renderer and add to DOM
    //renderer = new THREE.CanvasRenderer();
    renderer =  new THREE.WebGLRenderer();
    renderer.setSize(WIDTH, HEIGHT);
    //display_element = document.getElementById("display");
    //document.body.appendChild(renderer.domElement);
    display_container.appendChild(renderer.domElement);

    //Create the camera
    camera = new THREE.PerspectiveCamera(45, WIDTH/HEIGHT, 0.1, 2000);
    camera.position.set(0,-10,8.5);
    scene.add(camera);

   //Update window on resize
    window.addEventListener('resize', function(){
	var WIDTH = parseInt(cont_style.getPropertyValue('width'));
	var HEIGHT = WIDTH
	//var HEIGHT = parseInt(cont_style.getPropertyValue('height'));
	renderer.setSize(WIDTH, HEIGHT);
	camera.aspect = WIDTH/HEIGHT;
	camera.updateProjectionMatrix();
    })

    //Adding some lighting
    var light = new THREE.AmbientLight( 0x404040 ); // soft white light
    scene.add( light );

    //Surface representing printing area
    var geometry = new THREE.PlaneGeometry( 10, 10, 32 );
    var material = new THREE.MeshNormalMaterial( {side: THREE.DoubleSide} );
    var print_plane = new THREE.Mesh( geometry, material );
    scene.add( print_plane );


    //Use the STLLoader to load stl files
    var loader = new THREE.STLLoader();
    loader.load('stls/porsche.stl', function(geometry) {

	//Computing volume of geometry
	

     	var material = new THREE.MeshNormalMaterial({color: 0x55B663});
     	model = new THREE.Mesh(geometry, material);
	geometry.computeBoundingBox();
	boundingBox = geometry.boundingBox.clone();
	camera.position.set(0, -250, 100); 
     	scene.add(model);
    });

    //This adds the rotate and pan view controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);

    //console.log(boundingBox.min, boundingBox.max, boundingBox.size);

    //Scale the model when scale button is clicked
    scale_button = document.getElementById('scale-btn');
    scale_button.onclick = function(event){
	var scale_factor = parseFloat(document.getElementById('scale-factor').value);
	model.geometry.applyMatrix(new THREE.Matrix4().makeScale(scale_factor, scale_factor, scale_factor));
	render();
    }

    //Rotate the model when the rotate button is clicked
    rot_button = document.getElementById('rot-btn');
    rot_button.onclick = function(event){
	var DEG2RAD = 3.14159/180.0;
	var rotX = parseFloat(document.getElementById('x-rot').value);
	var rotY = parseFloat(document.getElementById('y-rot').value);
	var rotZ = parseFloat(document.getElementById('z-rot').value);

	model.geometry.applyMatrix(new THREE.Matrix4().makeRotationX(rotX*DEG2RAD));
	model.geometry.applyMatrix(new THREE.Matrix4().makeRotationY(rotY*DEG2RAD));
	model.geometry.applyMatrix(new THREE.Matrix4().makeRotationZ(rotZ*DEG2RAD));
    }

    //Translate the model when the translate button is clicked
    trans_button = document.getElementById('trans-btn');
    trans_button.onclick = function(event){
	var dx = parseFloat(document.getElementById('x-pos').value);
	var dy = parseFloat(document.getElementById('y-pos').value);
	var dz = parseFloat(document.getElementById('z-pos').value);
	
	//Apply translation
	model.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(dx,dy,dz));
    }
    
    //Center the model to origin when the center button is clicked.
    center_button = document.getElementById('center-btn');
    center_button.onclick = function(event){
	model.geometry.center();
    }
	
}


function animate(){
    requestAnimationFrame(animate);
    
    //Render the scene
    renderer.render(scene, camera);
    controls.update();
}

function render(){
    renderer.render( scene, camera );
}
