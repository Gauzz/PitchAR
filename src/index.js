import deepEqual from 'deep-equal';

const COMPONENT_NAME = 'click-drag';
const DRAG_START_EVENT = 'dragstart';
const DRAG_MOVE_EVENT = 'dragmove';
const DRAG_END_EVENT = 'dragend';
const TIME_TO_KEEP_LOG = 100;

function forceWorldUpdate(threeElement) {

  let element = threeElement;
  while (element.parent) {
    element = element.parent;
  }

  element.updateMatrixWorld(true);
}

function forEachParent(element, lambda) {
  while (element.attachedToParent) {
    element = element.parentElement;
    lambda(element);
  }
}

function someParent(element, lambda) {
  while (element.attachedToParent) {
    element = element.parentElement;
    if (lambda(element)) {
      return true;
    }
  }
  return false;
}

function cameraPositionToVec3(camera, vec3) {

  vec3.set(
    camera.components.position.data.x,
    camera.components.position.data.y,
    camera.components.position.data.z
  );

  forEachParent(camera, element => {

    if (element.components && element.components.position) {
      vec3.set(
        vec3.x + element.components.position.data.x,
        vec3.y + element.components.position.data.y,
        vec3.z + element.components.position.data.z
      );
    }

  });

}

function localToWorld(THREE, threeCamera, vector) {
  forceWorldUpdate(threeCamera);
  return threeCamera.localToWorld(vector);
}

const {unproject} = (function unprojectFunction() {

  let initialized = false;

  let matrix;

  function initialize(THREE) {
    matrix = new THREE.Matrix4();

    return true;
  }

  return {

    unproject(THREE, vector, camera) {

      const threeCamera = camera.components.camera.camera;

      initialized = initialized || initialize(THREE);

//      vector.applyProjection(matrix.getInverse(threeCamera.projectionMatrix));
      vector.applyMatrix4(matrix.getInverse(threeCamera.projectionMatrix));
      return localToWorld(THREE, threeCamera, vector);

    },
  };
}());

function clientCoordsTo3DCanvasCoords(
  clientX,
  clientY,
  offsetX,
  offsetY,
  clientWidth,
  clientHeight
) {
  return {
    x: (((clientX - offsetX) / clientWidth) * 2) - 1,
    y: (-((clientY - offsetY) / clientHeight) * 2) + 1,
  };
}

const {screenCoordsToDirection} = (function screenCoordsToDirectionFunction() {

  let initialized = false;

  let mousePosAsVec3;
  let cameraPosAsVec3;

  function initialize(THREE) {
    mousePosAsVec3 = new THREE.Vector3();
    cameraPosAsVec3 = new THREE.Vector3();

    return true;
  }

  return {
    screenCoordsToDirection(
      THREE,
      aframeCamera,
      {x: clientX, y: clientY}
    ) {

      initialized = initialized || initialize(THREE);

      // scale mouse coordinates down to -1 <-> +1
      const {x: mouseX, y: mouseY} = clientCoordsTo3DCanvasCoords(
        clientX, clientY,
        0, 0, // TODO: Replace with canvas position
        window.innerWidth,
        window.innerHeight
      );

      mousePosAsVec3.set(mouseX, mouseY, -1);

      // apply camera transformation from near-plane of mouse x/y into 3d space
      // NOTE: This should be replaced with THREE code directly once the aframe bug
      // is fixed:
/*
      cameraPositionToVec3(aframeCamera, cameraPosAsVec3);
      const {x, y, z} = new THREE
       .Vector3(mouseX, mouseY, -1)
       .unproject(aframeCamera.components.camera.camera)
       .sub(cameraPosAsVec3)
       .normalize();
*/
      const projectedVector = unproject(THREE, mousePosAsVec3, aframeCamera);

      cameraPositionToVec3(aframeCamera, cameraPosAsVec3);

      // Get the unit length direction vector from the camera's position
      const {x, y, z} = projectedVector.sub(cameraPosAsVec3).normalize();
      return {x, y, z};
    },
  };
}());

/**
 * @param planeNormal {THREE.Vector3}
 * @param planeConstant {Float} Distance from origin of the plane
 * @param rayDirection {THREE.Vector3} Direction of ray from the origin
 *
 * @return {THREE.Vector3} The intersection point of the ray and plane
 */
function rayPlaneIntersection(planeNormal, planeConstant, rayDirection) {
  // A line from the camera position toward (and through) the plane
  const distanceToPlane = planeConstant / planeNormal.dot(rayDirection);
  return rayDirection.multiplyScalar(distanceToPlane);
}

const {directionToWorldCoords} = (function directionToWorldCoordsFunction() {

  let initialized = false;

  let direction;
  let cameraPosAsVec3;

  function initialize(THREE) {
    direction = new THREE.Vector3();
    cameraPosAsVec3 = new THREE.Vector3();

    return true;
  }

  return {
    /**
     * @param camera Three.js Camera instance
     * @param Object Position of the camera
     * @param Object position of the mouse (scaled to be between -1 to 1)
     * @param depth Depth into the screen to calculate world coordinates for
     */
    directionToWorldCoords(
      THREE,
      aframeCamera,
      camera,
      {x: directionX, y: directionY, z: directionZ},
      depth
    ) {

      initialized = initialized || initialize(THREE);

      cameraPositionToVec3(aframeCamera, cameraPosAsVec3);
      direction.set(directionX, directionY, directionZ);

      // A line from the camera position toward (and through) the plane
      const newPosition = rayPlaneIntersection(
        camera.getWorldDirection(),
        depth,
        direction
      );

      // reposition back to the camera position
      const {x, y, z} = newPosition.add(cameraPosAsVec3);

      return {x, y, z};

    },
  };
}());

const {selectItem} = (function selectItemFunction() {

  let initialized = false;

  let cameraPosAsVec3;
  let directionAsVec3;
  let raycaster;
  let plane;

  function initialize(THREE) {
    plane = new THREE.Plane();
    cameraPosAsVec3 = new THREE.Vector3();
    directionAsVec3 = new THREE.Vector3();
    raycaster = new THREE.Raycaster();

    // TODO: From camera values?
    raycaster.far = Infinity;
    raycaster.near = 0;

    return true;
  }

  return {
    selectItem(THREE, selector, camera, clientX, clientY) {

      initialized = initialized || initialize(THREE);

      const {x: directionX, y: directionY, z: directionZ} = screenCoordsToDirection(
        THREE,
        camera,
        {x: clientX, y: clientY}
      );

      cameraPositionToVec3(camera, cameraPosAsVec3);
      directionAsVec3.set(directionX, directionY, directionZ);

      raycaster.set(cameraPosAsVec3, directionAsVec3);

      // Push meshes onto list of objects to intersect.
      // TODO: Can we do this at some other point instead of every time a ray is
      // cast? Is that a micro optimization?
      const objects = Array.from(
        camera.sceneEl.querySelectorAll(`[${selector}]`)
      ).map(object => object.object3D);

      const recursive = true;

      const intersected = raycaster
        .intersectObjects(objects, recursive)
        // Only keep intersections against objects that have a reference to an entity.
        .filter(intersection => !!intersection.object.el)
        // Only keep ones that are visible
        .filter(intersection => intersection.object.parent.visible)
        // The first element is the closest
        [0]; // eslint-disable-line no-unexpected-multiline

      if (!intersected) {
        return {};
      }

      const {point, object} = intersected;

      // Aligned to the world direction of the camera
      // At the specified intersection point
      plane.setFromNormalAndCoplanarPoint(
        camera.components.camera.camera.getWorldDirection().clone().negate(),
        point.clone().sub(cameraPosAsVec3)
      );

      const depth = plane.constant;

      const offset = point.sub(object.getWorldPosition());

      return {depth, offset, element: object.el};

    },
  };
}());

function dragItem(THREE, element, offset, camera, depth, mouseInfo) {
  event.preventDefault();

  const threeCamera = camera.components.camera.camera;

  // Setting up for rotation calculations
  const startCameraRotationInverse = threeCamera.getWorldQuaternion().inverse();
  const startElementRotation = element.object3D.getWorldQuaternion();
  const elementRotationOrder = element.object3D.rotation.order;

  const rotationQuaternion = new THREE.Quaternion();
  const rotationEuler = element.object3D.rotation.clone();

  const offsetVector = new THREE.Vector3(offset.x, offset.y, offset.z);
  let lastMouseInfo = mouseInfo;

  const nextRotation = {
    x: THREE.Math.radToDeg(rotationEuler.x),
    y: THREE.Math.radToDeg(rotationEuler.y),
    z: THREE.Math.radToDeg(rotationEuler.z),
  };

  const activeCamera = element.sceneEl.systems.camera.activeCameraEl;

  const isChildOfActiveCamera = someParent(element, parent => parent === activeCamera);

  function onMouseMove({clientX, clientY}) {
    event.preventDefault();
  
    lastMouseInfo = {clientX, clientY};

    const direction = screenCoordsToDirection(
      THREE,
      camera,
      {x: clientX, y: clientY}
    );

    const {x, y, z} = directionToWorldCoords(
      THREE,
      camera,
      camera.components.camera.camera,
      direction,
      depth
    );


    let rotationDiff;

    // Start by rotating backwards from the initial camera rotation
    rotationDiff = rotationQuaternion.copy(startCameraRotationInverse);

    // rotate the offset
    offsetVector.set(offset.x, offset.y, offset.z);

    // Then add the current camera rotation
    rotationDiff = rotationQuaternion.multiply(threeCamera.getWorldQuaternion());

    offsetVector.applyQuaternion(rotationDiff);

    if (!isChildOfActiveCamera) {
      // And correctly offset rotation
      rotationDiff.multiply(startElementRotation);

      rotationEuler.setFromQuaternion(rotationDiff, elementRotationOrder);
    }

    nextRotation.x = rotationEuler.x*(180/3.14);
    nextRotation.y = rotationEuler.y*(180/3.14);
    nextRotation.z = rotationEuler.z*(180/3.14);

    const nextPosition = {x: x - offsetVector.x, y: y - offsetVector.y, z: z - offsetVector.z};

    // When the element has parents, we need to convert its new world position
    // into new local position of its parent element
    if (element.parentEl !== element.sceneEl) {

      // The new world position
      offsetVector.set(nextPosition.x, nextPosition.y, nextPosition.z);

      // Converted
      element.parentEl.object3D.worldToLocal(offsetVector);

      nextPosition.x = offsetVector.x;
      nextPosition.y = offsetVector.y;
      //nextPosition.z = offsetVector.z;
    }

    element.emit(DRAG_MOVE_EVENT, {nextPosition, nextRotation, clientX, clientY});

    //element.setAttribute('rotation', nextRotation);
    element.setAttribute('position', nextPosition);
  }

  function onTouchMove({changedTouches: [touchInfo]}) {
    onMouseMove(touchInfo);
  }

  function onCameraChange({detail}) {
    if (
      (detail.name === 'position' || detail.name === 'rotation')
      && !deepEqual(detail.oldData, detail.newData)
    ) {
      onMouseMove(lastMouseInfo);
    }
  }

  document.addEventListener('mousemove', onMouseMove);
//  document.addEventListener('touchmove', onTouchMove);
  camera.addEventListener('componentchanged', onCameraChange);
  // The "unlisten" function
  return _ => {
    document.removeEventListener('mousemove', onMouseMove);
//    document.removeEventListener('touchmove', onTouchMove);
    camera.removeEventListener('componentchanged', onCameraChange);
  };
}

// Closure to close over the removal of the event listeners
const {didMount, didUnmount} = (function getDidMountAndUnmount() {

  let removeClickListeners;
  let removeDragListeners;
  const cache = [];

  function initialize(THREE, componentName) {

    // TODO: Based on a scene from the element passed in?
    const scene = document.querySelector('a-scene');
    // delay loading of this as we're not 100% if the scene has loaded yet or not
    let camera;
    let draggedElement;
    let dragInfo;
    let selected;
    let rx;
    let ry;
    let rz;
    let sc;
    let zaxis;
    let modifier;
    let cam;
    let oc;
    var dir = ' ';
    let remove;
    const positionLog = [];

    function cleanUpPositionLog() {
      const now = performance.now();
      while (positionLog.length && now - positionLog[0].time > TIME_TO_KEEP_LOG) {
        // remove the first element;
        positionLog.shift();
      }
    }

    function onDragged({detail: {nextPosition}}) {
      

      
   
      // Continuously clean up so we don't get huge logs built up
      cleanUpPositionLog();
     
    
      if(cam.object3D.rotation.x < -1.1 ){
        oc.pause();

        if(this.id == 'rx'){
          if(nextPosition.x < this.object3D.position.x){
            selected.object3D.rotation.z +=   0.04;
          }
          else{
            selected.object3D.rotation.z -=  0.04;
          }
          
        }
        
         else if(this.id == 'ry'){
          if(nextPosition.y < this.object3D.position.y){
            selected.object3D.rotation.x +=   0.04;
          }
          else{
            selected.object3D.rotation.x -=  0.04;
          }
        }
        
        else if(this.id == 'rz'){
          if(nextPosition.x < this.object3D.position.x){
            selected.object3D.rotation.y +=   0.04;
          }
          else{
            selected.object3D.rotation.y -=  0.04;
          }
        }
        
        else if(this.id == 'zaxis'){
          if(nextPosition.y < this.object3D.position.y){
            selected.object3D.position.y += 0.04;
          } 
          else{
            selected.object3D.position.y -= 0.04;
          }
        }
      
        else if(this.id == 'sc'){
          if(nextPosition.y < this.object3D.position.y || nextPosition.x < this.object3D.position.x){
            if(selected.object3D.scale.x >0.1)
            selected.object3D.scale.x -=   0.02;
            if(selected.object3D.scale.y >0.1)
            selected.object3D.scale.y -=   0.02;
            if(selected.object3D.scale.z >0.1)
            selected.object3D.scale.z -=   0.02;
  
          }
          else{
            selected.object3D.scale.x +=  0.02;
            selected.object3D.scale.y +=  0.02;
            selected.object3D.scale.z +=  0.02; 
            
          }
         
        }
        
      }  
      else if(cam.object3D.rotation.y > -0.785398 && cam.object3D.rotation.y < 0.785398){
      
      if(this.id == 'rx'){
        if(nextPosition.y < this.object3D.position.y){
          selected.object3D.rotation.x +=   0.04;
        }
        else{
          selected.object3D.rotation.x -=  0.04;
        }
      }
      
       else if(this.id == 'ry'){
        if(nextPosition.x < this.object3D.position.x){
          selected.object3D.rotation.y -=   0.04;
        }
        else{
          selected.object3D.rotation.y +=  0.04;
        }
      }
      
      else if(this.id == 'rz'){
        if(nextPosition.x < this.object3D.position.x){
          selected.object3D.rotation.z +=   0.04;
        }
        else{
          selected.object3D.rotation.z -=  0.04;
        }
      }
      
      else if(this.id == 'zaxis'){
        if(nextPosition.y < this.object3D.position.y){
          selected.object3D.position.z += 0.04;
        } 
        else{
          selected.object3D.position.z -= 0.04;
        }
      }
    
      else if(this.id == 'sc'){
        if(nextPosition.y < this.object3D.position.y || nextPosition.x < this.object3D.position.x){
          if(selected.object3D.scale.x >0.1)
          selected.object3D.scale.x -=   0.02;
          if(selected.object3D.scale.y >0.1)
          selected.object3D.scale.y -=   0.02;
          if(selected.object3D.scale.z >0.1)
          selected.object3D.scale.z -=   0.02;

        }
        else{
          selected.object3D.scale.x +=  0.02;
          selected.object3D.scale.y +=  0.02;
          selected.object3D.scale.z +=  0.02; 
          
        }
       
      }
      else{
          
      }
    }
      else if(cam.object3D.rotation.y < -0.785398 && cam.object3D.rotation.y > -2.35619){
        if(this.id == 'rx'){
          if(nextPosition.y < this.object3D.position.y){
            selected.object3D.rotation.z +=   0.04;
          }
          else{
            selected.object3D.rotation.z -=  0.04;
          }
        }
        
         else if(this.id == 'ry'){
          if(nextPosition.z < this.object3D.position.z){
            selected.object3D.rotation.y -=   0.04;
          }
          else{
            selected.object3D.rotation.y +=  0.04;
          }
        }
        
        else if(this.id == 'rz'){
          if(nextPosition.z < this.object3D.position.z){
            selected.object3D.rotation.x -=   0.04;
          }
          else{
            selected.object3D.rotation.x +=  0.04;
          }
        }
        
        else if(this.id == 'zaxis'){
          if(nextPosition.y < this.object3D.position.y){
            selected.object3D.position.x -= 0.04;
          } 
          else{
            selected.object3D.position.x += 0.04;
          }
        }
      
        else if(this.id == 'sc'){
          if(nextPosition.y < this.object3D.position.y || nextPosition.z < this.object3D.position.z){
            if(selected.object3D.scale.z >0.1)
            selected.object3D.scale.z -=   0.02;
            if(selected.object3D.scale.y >0.1)
            selected.object3D.scale.y -=   0.02;
            if(selected.object3D.scale.x >0.1)
            selected.object3D.scale.x -=   0.02;
  
          }
          else{
            selected.object3D.scale.z +=  0.02;
            selected.object3D.scale.y +=  0.02;
            selected.object3D.scale.x +=  0.02; 
            
          }
         
        }
        else{
            
        }
      }
    
      else if(cam.object3D.rotation.y < -2.35619 || (cam.object3D.rotation.y < 3.14 && cam.object3D.rotation.y  > 2.07)){
      
        if(this.id == 'rx'){
          if(nextPosition.y < this.object3D.position.y){
            selected.object3D.rotation.x -=   0.04;
          }
          else{
            selected.object3D.rotation.x +=  0.04;
          }
        }
        
         else if(this.id == 'ry'){
          if(nextPosition.x < this.object3D.position.x){
            selected.object3D.rotation.y +=   0.04;
          }
          else{
            selected.object3D.rotation.y -=  0.04;
          }
        }
        
        else if(this.id == 'rz'){
          if(nextPosition.x < this.object3D.position.x){
            selected.object3D.rotation.z +=   0.04;
          }
          else{
            selected.object3D.rotation.z -=  0.04;
          }
        }
        
        else if(this.id == 'zaxis'){
          if(nextPosition.y < this.object3D.position.y){
            selected.object3D.position.z -= 0.04;
          } 
          else{
            selected.object3D.position.z += 0.04;
          }
        }
      
        else if(this.id == 'sc'){
          if(nextPosition.y < this.object3D.position.y || nextPosition.x > this.object3D.position.x){
            if(selected.object3D.scale.x >0.1)
            selected.object3D.scale.x -=   0.02;
            if(selected.object3D.scale.y >0.1)
            selected.object3D.scale.y -=   0.02;
            if(selected.object3D.scale.z >0.1)
            selected.object3D.scale.z -=   0.02;
  
          }
          else{
            selected.object3D.scale.x +=  0.02;
            selected.object3D.scale.y +=  0.02;
            selected.object3D.scale.z +=  0.02; 
            
          }
         
        }
        else{
            
        }
          
      }
      else if(cam.object3D.rotation.y > 0.785398 && cam.object3D.rotation.y  < 2.07){
       
        if(this.id == 'rx'){
          if(nextPosition.y < this.object3D.position.y){
            selected.object3D.rotation.z -=   0.04;
          }
          else{
            selected.object3D.rotation.z +=  0.04;
          }
        }
        
         else if(this.id == 'ry'){
          if(nextPosition.z < this.object3D.position.z){
            selected.object3D.rotation.y +=   0.04;
          }
          else{
            selected.object3D.rotation.y -=  0.04;
          }
        }
        
        else if(this.id == 'rz'){
          if(nextPosition.z > this.object3D.position.z){
            selected.object3D.rotation.x +=   0.04;
          }
          else{
            selected.object3D.rotation.x -=  0.04;
          }
        }
        
        else if(this.id == 'zaxis'){
          if(nextPosition.y < this.object3D.position.y){
            selected.object3D.position.x += 0.04;
          } 
          else{
            selected.object3D.position.x -= 0.04;
          }
        }
      
        else if(this.id == 'sc'){
          if(nextPosition.y > this.object3D.position.y || nextPosition.z < this.object3D.position.z){
            if(selected.object3D.scale.z >0.1)
            selected.object3D.scale.z +=   0.02;
            if(selected.object3D.scale.y >0.1)
            selected.object3D.scale.y +=   0.02;
            if(selected.object3D.scale.x >0.1)
            selected.object3D.scale.x +=   0.02;
  
          }
          else{
            selected.object3D.scale.z -=  0.02;
            selected.object3D.scale.y -=  0.02;
            selected.object3D.scale.x -=  0.02; 
            
          }
         
        }
        else{
            
        }
      }
      positionLog.push({
        position: Object.assign({}, nextPosition),
        time: performance.now(),
      });
      
      repos();
    }

    function onMouseDown({clientX, clientY}) {
      
      const {depth, offset, element} = selectItem(THREE, componentName, camera, clientX, clientY);

      if (element) {
        if(element.id != 'rx' && element.id != 'ry' && element.id != 'rz' && element.id != 'sc' && element.id != 'zaxis'){
          selected = element;
        }
        oc.pause();
        var m= document.querySelector('#modifier');
        repos();
        m.object3D.visible = true; 
        
      var object = selected.getObject3D('mesh');

      // compute bounding box
      var bbox = new THREE.Box3().setFromObject(object);
      console.log(bbox.min,bbox.max); 
        document.getElementsByClassName('sidebar')[0].style.display='block';
        // Can only drag one item at a time, so no need to check if any
        // listener is already set up
        let removeDragItemListeners = dragItem(
          THREE,
          element,
          offset,
          camera,
          depth,
          {
            clientX,
            clientY,
          }
        );

        draggedElement = element;

        dragInfo = {
          offset: {x: offset.x, y: offset.y, z: offset.z},
          depth,
          clientX,
          clientY,
        };

        element.addEventListener(DRAG_MOVE_EVENT, onDragged);

        removeDragListeners = _ => {
          element.removeEventListener(DRAG_MOVE_EVENT, onDragged);
          // eslint-disable-next-line no-unused-expressions
          removeDragItemListeners && removeDragItemListeners();
          // in case this removal function gets called more than once
//          removeDragItemListeners = null;
  
};

        element.emit(DRAG_START_EVENT, dragInfo);
      }
    }
    
    function calculateVelocity() {

      if (positionLog.length < 2) {
        return 0;
      }

      const start = positionLog[positionLog.length - 1];
      const end = positionLog[0];

      const deltaTime = 1000 / (start.time - end.time);
      return {
        x: (start.position.x - end.position.x) * deltaTime, // m/s
        y: (start.position.y - end.position.y) * deltaTime, // m/s
        z: (start.position.z - end.position.z) * deltaTime, // m/s
      };
    }

    function onMouseUp({clientX, clientY}) {
      event.preventDefault();
      if (!draggedElement) {
        
        return;
        
      }
      else{
        oc.play();
       
  
      }

      cleanUpPositionLog();

      const velocity = calculateVelocity();

      draggedElement.emit(
        DRAG_END_EVENT,
        Object.assign({}, dragInfo, {clientX, clientY, velocity})
      );

      removeDragListeners && removeDragListeners(); // eslint-disable-line no-unused-expressions
      removeDragListeners = undefined;
      
        
      repos(); 
   
    }

    function onTouchStart({changedTouches: [touchInfo]}) {
      onMouseDown(touchInfo);
    }

    function onTouchEnd({changedTouches: [touchInfo]}) {
      onMouseUp(touchInfo);
    }

    function repos(){
     
      if(cam.object3D.rotation.x < -1.1 ){
        console.log(cam.object3D.rotation.x);
      document.querySelector('#zaxis').object3D.position.x = selected.object3D.position.x - 1.25*selected.object3D.scale.x;
      document.querySelector('#zaxis').object3D.position.y = selected.object3D.position.y;
      document.querySelector('#zaxis').object3D.position.z = selected.object3D.position.z ;
      
      if(selected.object3D.position.x < 0)
      {
        document.querySelector('#zaxis').object3D.position.x +=  0.15*selected.object3D.position.x;
      }
      
      document.querySelector('#sc').object3D.position.x = selected.object3D.position.x + 1.25*selected.object3D.scale.x;
      document.querySelector('#sc').object3D.position.y = selected.object3D.position.y ;
      document.querySelector('#sc').object3D.position.z = selected.object3D.position.z - 1.25*selected.object3D.scale.z;
      if(selected.object3D.position.y > 0)
      {
        document.querySelector('#sc').object3D.position.y +=  0.25*selected.object3D.position.y;
      }

      document.querySelector('#rz').object3D.position.x = selected.object3D.position.x;
      document.querySelector('#rz').object3D.position.y = selected.object3D.position.y ;
      document.querySelector('#rz').object3D.position.z = selected.object3D.position.z - 1.25*selected.object3D.scale.z;
      if(selected.object3D.position.y > 0)
      {
        document.querySelector('#rz').object3D.position.y +=  0.25*selected.object3D.position.y;
      }
      

      document.querySelector('#ry').object3D.position.x = selected.object3D.position.x + 1.25*selected.object3D.scale.x;
      document.querySelector('#ry').object3D.position.y = selected.object3D.position.y ;
      document.querySelector('#ry').object3D.position.z = selected.object3D.position.z + 2*selected.object3D.scale.z;

      document.querySelector('#rx').object3D.position.x = selected.object3D.position.x + 1.25*selected.object3D.scale.x + 0.05*selected.object3D.scale.x*selected.object3D.position.x;
      document.querySelector('#rx').object3D.position.y = selected.object3D.position.y;
      document.querySelector('#rx').object3D.position.z = selected.object3D.position.z;
      document.querySelector('#rx').object3D.rotation.y = 70;
      
      if(selected.object3D.position.x > 0)
      {
        
        document.querySelector('#rx').object3D.position.x +=  0.15*selected.object3D.position.x;
      }

      }


      else if(cam.object3D.rotation.y > -0.785398 && cam.object3D.rotation.y < 0.785398){
      document.querySelector('#zaxis').object3D.position.x = selected.object3D.position.x - 1.25*selected.object3D.scale.x;
      document.querySelector('#zaxis').object3D.position.y = selected.object3D.position.y;
      document.querySelector('#zaxis').object3D.position.z = selected.object3D.position.z;
      if(selected.object3D.position.x < 0)
      {
        document.querySelector('#zaxis').object3D.position.x +=  0.15*selected.object3D.position.x;
      }
      
      document.querySelector('#sc').object3D.position.x = selected.object3D.position.x + 1.25*selected.object3D.scale.x;
      document.querySelector('#sc').object3D.position.y = selected.object3D.position.y + 1.25*selected.object3D.scale.y;
      document.querySelector('#sc').object3D.position.z = selected.object3D.position.z;
      if(selected.object3D.position.y > 0)
      {
        document.querySelector('#sc').object3D.position.y +=  0.25*selected.object3D.position.y;
      }

      document.querySelector('#rz').object3D.position.x = selected.object3D.position.x;
      document.querySelector('#rz').object3D.position.y = selected.object3D.position.y + 1.25*selected.object3D.scale.y;
      document.querySelector('#rz').object3D.position.z = selected.object3D.position.z ;
      if(selected.object3D.position.y > 0)
      {
        document.querySelector('#rz').object3D.position.y +=  0.25*selected.object3D.position.y;
      }
      

      document.querySelector('#ry').object3D.position.x = selected.object3D.position.x;
      document.querySelector('#ry').object3D.position.y = selected.object3D.position.y - 2*selected.object3D.scale.y;
      document.querySelector('#ry').object3D.position.z = selected.object3D.position.z;

      document.querySelector('#rx').object3D.position.x = selected.object3D.position.x + 1.25*selected.object3D.scale.x + 0.05*selected.object3D.scale.x*selected.object3D.position.x;
      document.querySelector('#rx').object3D.position.y = selected.object3D.position.y;
      document.querySelector('#rx').object3D.position.z = selected.object3D.position.z;
      if(selected.object3D.position.x > 0)
      {
        
        document.querySelector('#rx').object3D.position.x +=  0.15*selected.object3D.position.x;
      }
    }

    else if(cam.object3D.rotation.y < -0.785398 && cam.object3D.rotation.y > -2.35619){
      console.log('next phase');
      document.querySelector('#zaxis').object3D.position.z = selected.object3D.position.z - 1.25*selected.object3D.scale.z;
      document.querySelector('#zaxis').object3D.position.y = selected.object3D.position.y;
      document.querySelector('#zaxis').object3D.position.x = selected.object3D.position.x;
      if(selected.object3D.position.x < 0)
      {
        document.querySelector('#zaxis').object3D.position.x +=  0.15*selected.object3D.position.x;
      }
      
      document.querySelector('#sc').object3D.position.z = selected.object3D.position.z + 1.25*selected.object3D.scale.z;
      document.querySelector('#sc').object3D.position.y = selected.object3D.position.y + 1.25*selected.object3D.scale.y;
      document.querySelector('#sc').object3D.position.x = selected.object3D.position.x;
      if(selected.object3D.position.y > 0)
      {
        document.querySelector('#sc').object3D.position.y +=  0.25*selected.object3D.position.y;
      }

      document.querySelector('#rz').object3D.position.z = selected.object3D.position.z;
      document.querySelector('#rz').object3D.position.y = selected.object3D.position.y + 1.25*selected.object3D.scale.y;
      document.querySelector('#rz').object3D.position.x = selected.object3D.position.x;
      if(selected.object3D.position.y > 0)
      {
        document.querySelector('#rz').object3D.position.y +=  0.25*selected.object3D.position.y;
      }
      

      document.querySelector('#ry').object3D.position.z = selected.object3D.position.z;
      document.querySelector('#ry').object3D.position.y = selected.object3D.position.y - 2*selected.object3D.scale.y;
      document.querySelector('#ry').object3D.position.x = selected.object3D.position.x;

      document.querySelector('#rx').object3D.position.z = selected.object3D.position.z + 1.25*selected.object3D.scale.z + 0.05*selected.object3D.scale.z*selected.object3D.position.z;
      document.querySelector('#rx').object3D.position.y = selected.object3D.position.y;
      document.querySelector('#rx').object3D.position.x = selected.object3D.position.x;
      if(selected.object3D.position.z > 0)
      {
        
        document.querySelector('#rx').object3D.position.z +=  0.15*selected.object3D.position.z;
      }
    }

    else if(cam.object3D.rotation.y < -2.35619){
    
      document.querySelector('#zaxis').object3D.position.x = selected.object3D.position.x + 1.25*selected.object3D.scale.x;
      document.querySelector('#zaxis').object3D.position.y = selected.object3D.position.y;
      document.querySelector('#zaxis').object3D.position.z = selected.object3D.position.z;
      if(selected.object3D.position.x < 0)
      {
        document.querySelector('#zaxis').object3D.position.x -=  0.15*selected.object3D.position.x;
      }
      
      document.querySelector('#sc').object3D.position.x = selected.object3D.position.x - 1.25*selected.object3D.scale.x;
      document.querySelector('#sc').object3D.position.y = selected.object3D.position.y + 1.25*selected.object3D.scale.y;
      document.querySelector('#sc').object3D.position.z = selected.object3D.position.z;
      if(selected.object3D.position.y > 0)
      {
        document.querySelector('#sc').object3D.position.y +=  0.25*selected.object3D.position.y;
      }

      document.querySelector('#rz').object3D.position.x = selected.object3D.position.x;
      document.querySelector('#rz').object3D.position.y = selected.object3D.position.y + 1.25*selected.object3D.scale.y;
      document.querySelector('#rz').object3D.position.z = selected.object3D.position.z;
      if(selected.object3D.position.y > 0)
      {
        document.querySelector('#rz').object3D.position.y +=  0.25*selected.object3D.position.y;
      }
      

      document.querySelector('#ry').object3D.position.x = selected.object3D.position.x;
      document.querySelector('#ry').object3D.position.y = selected.object3D.position.y - 2*selected.object3D.scale.y;
      document.querySelector('#ry').object3D.position.z = selected.object3D.position.z;

      document.querySelector('#rx').object3D.position.x = selected.object3D.position.x - 1.25*selected.object3D.scale.x - 0.05*selected.object3D.scale.x*selected.object3D.position.x;
      document.querySelector('#rx').object3D.position.y = selected.object3D.position.y;
      document.querySelector('#rx').object3D.position.z = selected.object3D.position.z;
      if(selected.object3D.position.x > 0)
      {
        
        document.querySelector('#rx').object3D.position.x +=  0.15*selected.object3D.position.x;
      }

    }

    else if(cam.object3D.rotation.y < 3.14 && cam.object3D.rotation.y  > 2.07){
      console.log('reached');
      document.querySelector('#zaxis').object3D.position.x = selected.object3D.position.x + 1.25*selected.object3D.scale.x;
      document.querySelector('#zaxis').object3D.position.y = selected.object3D.position.y;
      document.querySelector('#zaxis').object3D.position.z = selected.object3D.position.z + 0.5;
      if(selected.object3D.position.x < 0)
      {
        document.querySelector('#zaxis').object3D.position.x -=  0.15*selected.object3D.position.x;
      }
      
      document.querySelector('#sc').object3D.position.x = selected.object3D.position.x - 1.25*selected.object3D.scale.x;
      document.querySelector('#sc').object3D.position.y = selected.object3D.position.y + 1.25*selected.object3D.scale.y;
      document.querySelector('#sc').object3D.position.z = selected.object3D.position.z - 0.5;
      if(selected.object3D.position.y > 0)
      {
        document.querySelector('#sc').object3D.position.y +=  0.25*selected.object3D.position.y;
      }

      document.querySelector('#rz').object3D.position.x = selected.object3D.position.x;
      document.querySelector('#rz').object3D.position.y = selected.object3D.position.y + 1.25*selected.object3D.scale.y;
      document.querySelector('#rz').object3D.position.z = selected.object3D.position.z;
      if(selected.object3D.position.y > 0)
      {
        document.querySelector('#rz').object3D.position.y +=  0.25*selected.object3D.position.y;
      }
      

      document.querySelector('#ry').object3D.position.x = selected.object3D.position.x;
      document.querySelector('#ry').object3D.position.y = selected.object3D.position.y - 2*selected.object3D.scale.y;
      document.querySelector('#ry').object3D.position.z = selected.object3D.position.z;

      document.querySelector('#rx').object3D.position.x = selected.object3D.position.x - 1.25*selected.object3D.scale.x - 0.05*selected.object3D.scale.x*selected.object3D.position.x;
      document.querySelector('#rx').object3D.position.y = selected.object3D.position.y;
      document.querySelector('#rx').object3D.position.z = selected.object3D.position.z - 0.5;
      if(selected.object3D.position.x > 0)
      {
        
        document.querySelector('#rx').object3D.position.x +=  0.15*selected.object3D.position.x;
      }
     
    }

    else if(cam.object3D.rotation.y > 0.785398 && cam.object3D.rotation.y  < 2.07){
      document.querySelector('#zaxis').object3D.position.z = selected.object3D.position.z + 1.25*selected.object3D.scale.z;
      document.querySelector('#zaxis').object3D.position.y = selected.object3D.position.y;
      document.querySelector('#zaxis').object3D.position.x = selected.object3D.position.x;
      if(selected.object3D.position.x < 0)
      {
        document.querySelector('#zaxis').object3D.position.x +=  0.15*selected.object3D.position.x;
      }
      
      document.querySelector('#sc').object3D.position.z = selected.object3D.position.z - 1.25*selected.object3D.scale.z;
      document.querySelector('#sc').object3D.position.y = selected.object3D.position.y + 1.25*selected.object3D.scale.y;
      document.querySelector('#sc').object3D.position.x = selected.object3D.position.x;
      if(selected.object3D.position.y > 0)
      {
        document.querySelector('#sc').object3D.position.y +=  0.25*selected.object3D.position.y;
      }

      document.querySelector('#rz').object3D.position.z = selected.object3D.position.z;
      document.querySelector('#rz').object3D.position.y = selected.object3D.position.y + 1.25*selected.object3D.scale.y;
      document.querySelector('#rz').object3D.position.x = selected.object3D.position.x;
      if(selected.object3D.position.y > 0)
      {
        document.querySelector('#rz').object3D.position.y +=  0.25*selected.object3D.position.y;
      }
      

      document.querySelector('#ry').object3D.position.z = selected.object3D.position.z;
      document.querySelector('#ry').object3D.position.y = selected.object3D.position.y - 2*selected.object3D.scale.y;
      document.querySelector('#ry').object3D.position.x = selected.object3D.position.x;

      document.querySelector('#rx').object3D.position.z = selected.object3D.position.z - 1.25*selected.object3D.scale.z - 0.05*selected.object3D.scale.z*selected.object3D.position.z;
      document.querySelector('#rx').object3D.position.y = selected.object3D.position.y;
      document.querySelector('#rx').object3D.position.x = selected.object3D.position.x;
      if(selected.object3D.position.z > 0)
      {
        
        document.querySelector('#rx').object3D.position.z +=  0.15*selected.object3D.position.z;
      }
    
    }
    }

    document.getElementById('remove').addEventListener('click',function(e){
      selected.object3D.visible=false;
      modifier.object3D.visible=false;
    });

    //Animation and effects logic here.  
    document.getElementById('anim1').addEventListener('click',function(e){  
      resetImage(selected);
      selected.setAttribute('animation', {property: 'rotation', to: '0 360 0', dur: '2000', loop: true});
    });

    document.getElementById('anim2').addEventListener('click',function(e){    
      resetImage(selected); 
      selected.setAttribute('animation', {property: 'scale', from: '0 0 0', to: '1 1 1', dur: '2000', loop: true});      
    });

    document.getElementById('anim3').addEventListener('click',function(e){   
      resetImage(selected);
      selected.setAttribute('animation', {property: 'scale', from: '1 1 1', to: '0 0 0', dur: '2000', loop: true});      
    });

    document.getElementById('anim4').addEventListener('click',function(e){   
      resetImage(selected);  
      selected.setAttribute('animation', {property: 'components.material.material.color', type: 'color', from: 'red', to: 'blue', dur:'2000', loop: true});      
    });

    document.getElementById('anim5').addEventListener('click',function(e){   
      resetImage(selected);  
      //selected.setAttribute('animation', {property: 'position', to: '0 1.5 0', dur: '1500', easing: 'linear', dir:'alternate', loop: true});           
      selected.setAttribute('animation', {property: 'object3D.position.y', to: '1', dur: '1500', easing: 'linear', dir:'alternate', loop: true});      
    });


    document.getElementById('fx1').addEventListener('click',function(e){
      resetImage(selected);      
      selected.setAttribute('animation', {property: 'components.material.material.opacity', from: '1', to: '0', dur: '1000'});      
    });

    document.getElementById('fx2').addEventListener('click',function(e){ 
      resetImage(selected);    
      selected.setAttribute('animation', {property: 'components.material.material.opacity', from: '0', to: '1', dur: '1000'});      
    });

    document.getElementById('fx3').addEventListener('click',function(e){   
      resetImage(selected);   
      selected.setAttribute('animation', {property: 'components.material.material.opacity', from: '0', to: '1', dur: '500', dir: 'alternate', loop: true});      
    });

    document.getElementById('fx4').addEventListener('click',function(e){ 
      resetImage(selected);          
      selected.setAttribute('animation', {property: 'object3D.scale.y', from:'0', to: '1', dur: '300', easing: 'linear', dir:'alternate', loop: true});      
    });

    document.getElementById('fx5').addEventListener('click',function(e){ 
      resetImage(selected);
      selected.setAttribute('particle-system', {color: 'red', blending: '1'});      
    });    

    document.getElementById('fx6').addEventListener('click',function(e){ 
      resetImage(selected);           
      selected.setAttribute('particle-system', {blending: '1', preset: 'snow'});      
    }); 
    
    document.getElementById('fx7').addEventListener('click',function(e){
      resetImage(selected);          
      selected.setAttribute('particle-system', {blending: '1', preset: 'dust'});      
    }); 

    function resetImage(e) {
      e.removeAttribute('animation');
      e.removeAttribute('particle-system');      
      e.object3D.position.set(0, 0.5, 0);
      e.object3D.rotation.set(0, 0, 0);
      e.object3D.scale.set(1, 1, 1);
      e.components.material.material.opacity = 1;
      e.components.material.material.color.setStyle("#ffffff");
    }

    function run() {
      camera = scene.camera.el;
      rx = document.querySelector('#rx');
      ry = document.querySelector('#ry');
      rz = document.querySelector('#rz');
      sc = document.querySelector('#sc');
      zaxis = document.querySelector('#zaxis');
      modifier = document.querySelector('#modifier');
      cam= document.querySelector('#cam');
      oc = cam.components['orbit-controls'];
      
      // TODO: Attach to canvas?
      document.addEventListener('mousedown', onMouseDown);
      document.addEventListener('mouseup', onMouseUp);

//      document.addEventListener('touchstart', onTouchStart);
//      document.addEventListener('touchend', onTouchEnd);

      removeClickListeners = _ => {
        document.removeEventListener('mousedown', onMouseDown);
        document.removeEventListener('mouseup', onMouseUp);

//        document.removeEventListener('touchstart', onTouchStart);
//        document.removeEventListener('touchend', onTouchEnd);
                 
      };

    }

    if (scene.hasLoaded) {
      run();
    } else {
      scene.addEventListener('loaded', run);
    }

  }

  function tearDown() {
    removeClickListeners && removeClickListeners(); // eslint-disable-line no-unused-expressions
    removeClickListeners = undefined;
  }

  return {
    didMount(element, THREE, componentName) {

      if (cache.length === 0) {
        initialize(THREE, componentName);
      }

      if (cache.indexOf(element) === -1) {
        cache.push(element);
      }
    },

    didUnmount(element) {

      const cacheIndex = cache.indexOf(element);

      removeDragListeners && removeDragListeners(); // eslint-disable-line no-unused-expressions
      removeDragListeners = undefined;

      if (cacheIndex === -1) {
        return;
      }

      // remove that element
      cache.splice(cacheIndex, 1);

      if (cache.length === 0) {
        tearDown();
      }

    },
  };
}());

/**
 * @param aframe {Object} The Aframe instance to register with
 * @param componentName {String} The component name to use. Default: 'click-drag'
 */
export default function aframeDraggableComponent(aframe, componentName = COMPONENT_NAME) {

  const THREE = aframe.THREE;

  /**
   * Draggable component for A-Frame.
   */
  aframe.registerComponent(componentName, {
    schema: {},

    /**
     * Called once when component is attached. Generally for initial setup.
     */
    init() {
      didMount(this, THREE, componentName);
     
    },

    /**
     * Called when component is attached and when component data changes.
     * Generally modifies the entity based on the data.
     *
     * @param oldData
     */
    update() { },

    /**
     * Called when a component is removed (e.g., via removeAttribute).
     * Generally undoes all modifications to the entity.
     */
    remove() {
      didUnmount(this);
      
    },

    /**
     * Called when entity pauses.
     * Use to stop or remove any dynamic or background behavior such as events.
     */
    pause() {
      
      didUnmount(this);
      
    },

    /**
     * Called when entity resumes.
     * Use to continue or add any dynamic or background behavior such as events.
     */
    play() {
      didMount(this, THREE, componentName);
    },
  });
}
