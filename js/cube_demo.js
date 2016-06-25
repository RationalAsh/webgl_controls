var scene, camera, renderer, model;

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
    renderer = new THREE.WebGLRenderer({antialias: true});
    //renderer = new THREE.CanvasRenderer();
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

     var loader = new THREE.STLLoader();
     loader.load('stls/porsche.stl', function(geometry) {
	 var material = new THREE.MeshNormalMaterial({color: 0x55B663});
     	 model = new THREE.Mesh(geometry, material);
     	 scene.add(model);
     });

    controls = new THREE.OrbitControls(camera, renderer.domElement);

    scale_button = document.getElementById("scale-btn");
    scale_button.onclick = function(event){
	scale_factor = parseFloat(document.getElementById("scale-factor").value);
	model.scale.x *= scale_factor;
	model.scale.y *= scale_factor;
	model.scale.z *= scale_factor;
	render();
    }}


function animate(){
    requestAnimationFrame(animate);
    
    //Render the scene
    renderer.render(scene, camera);
    controls.update();
}

function render(){
    renderer.render( scene, camera );
}
