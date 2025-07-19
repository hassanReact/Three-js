import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'

const Canvas = () => {
  const canvasRef = useRef();
  const modelRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    
    // Setup renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;

    // Setup post-processing
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const rgbShiftPass = new ShaderPass(RGBShiftShader);
    rgbShiftPass.uniforms['amount'].value = 0.0015;
    composer.addPass(rgbShiftPass);

    // Load HDRI environment map
    const rgbeLoader = new RGBELoader();
    rgbeLoader.load('https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/4k/pond_bridge_night_4k.hdr', (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      // scene.background = texture;
      scene.environment = texture;
    });

    // Position camera
    camera.position.z = 2.5;

    // Add OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enabled = false; // Disable orbit controls by default
    

    // Load GLTF Model
    const loader = new GLTFLoader();
    loader.load(
      'public/DamagedHelmet.gltf',
      (gltf) => {
        const model = gltf.scene;
        modelRef.current = model; // Store model reference
        scene.add(model);
        
        // Optional: Adjust model position/scale if needed
        model.position.set(0, 0, 0);
        model.scale.set(1, 1, 1);
      },
      (progress) => {
        console.log('Loading progress:', (progress.loaded / progress.total * 100) + '%');
      },
      (error) => {
        console.error('Error loading model:', error);
      }
    );
    
    // Handle window resizing
    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      composer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onWindowResize);

    // Handle mouse movement for model rotation
    const onMouseMove = (event) => {
      if (modelRef.current) {
        const rotationX = (event.clientX / window.innerWidth - 0.5) * Math.PI;
        const rotationY = (event.clientY / window.innerHeight - 0.5) * Math.PI;
        modelRef.current.rotation.y = rotationX;
        modelRef.current.rotation.x = rotationY;
      }
    };
    window.addEventListener('mousemove', onMouseMove);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      composer.render();
    };
    animate();

    // Cleanup event listeners on unmount
    return () => {
      window.removeEventListener('resize', onWindowResize);
      window.removeEventListener('mousemove', onMouseMove);
      composer.dispose();
      controls.dispose();
    };
  }, []);

  return(
    <>
    <div className="main w-full">
      <div className="w-full h-screen overflow-hidden ">
      <canvas ref={canvasRef} />
      </div>
    </div>

    <div className="w-full h-screen bg-zinc-900"></div>
    </>
  ) 
};

export default Canvas;
