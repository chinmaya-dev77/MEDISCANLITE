// ===========================
// 3D Background with Three.js
// ===========================
(function() {
    const canvas = document.getElementById('bg-canvas');
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 8;

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.15);
    scene.add(ambient);
    const pointLight1 = new THREE.PointLight(0x2dd4bf, 1.2, 30);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);
    const pointLight2 = new THREE.PointLight(0xa855f7, 0.6, 25);
    pointLight2.position.set(-5, -3, 3);
    scene.add(pointLight2);

    // DNA Helix
    const dnaGroup = new THREE.Group();
    dnaGroup.position.set(4, 0, -3);
    scene.add(dnaGroup);

    const sphereGeo = new THREE.SphereGeometry(0.06, 8, 8);
    const matTeal = new THREE.MeshStandardMaterial({ color: 0x2dd4bf, emissive: 0x2dd4bf, emissiveIntensity: 0.8 });
    const matPurple = new THREE.MeshStandardMaterial({ color: 0xa855f7, emissive: 0xa855f7, emissiveIntensity: 0.8 });
    const matBridge = new THREE.MeshStandardMaterial({ color: 0x2dd4bf, transparent: true, opacity: 0.25 });
    const cylGeo = new THREE.CylinderGeometry(0.01, 0.01, 1, 4);

    for (let i = 0; i < 80; i++) {
        const t = i * 0.15;
        const y = (i - 40) * 0.12;
        const x1 = Math.cos(t) * 1.2, z1 = Math.sin(t) * 1.2;
        const x2 = Math.cos(t + Math.PI) * 1.2, z2 = Math.sin(t + Math.PI) * 1.2;

        const s1 = new THREE.Mesh(sphereGeo, matTeal);
        s1.position.set(x1, y, z1);
        dnaGroup.add(s1);

        const s2 = new THREE.Mesh(sphereGeo, matPurple);
        s2.position.set(x2, y, z2);
        dnaGroup.add(s2);

        if (i % 4 === 0) {
            const start = new THREE.Vector3(x1, y, z1);
            const end = new THREE.Vector3(x2, y, z2);
            const mid = start.clone().add(end).multiplyScalar(0.5);
            const dir = end.clone().sub(start);
            const len = dir.length();
            const cyl = new THREE.Mesh(
                new THREE.CylinderGeometry(0.01, 0.01, len, 4),
                matBridge
            );
            cyl.position.copy(mid);
            const quat = new THREE.Quaternion();
            quat.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
            cyl.setRotationFromQuaternion(quat);
            dnaGroup.add(cyl);
        }
    }

    // Floating Particles
    const particles = [];
    const particleGeo = new THREE.SphereGeometry(1, 6, 6);
    for (let i = 0; i < 50; i++) {
        const scale = Math.random() * 0.05 + 0.02;
        const color = i % 3 === 0 ? 0x2dd4bf : i % 3 === 1 ? 0xa855f7 : 0x475569;
        const mat = new THREE.MeshStandardMaterial({
            color, emissive: color, emissiveIntensity: 0.4,
            transparent: true, opacity: 0.5
        });
        const mesh = new THREE.Mesh(particleGeo, mat);
        mesh.scale.set(scale, scale, scale);
        mesh.position.set(
            (Math.random() - 0.5) * 18,
            (Math.random() - 0.5) * 12,
            (Math.random() - 0.5) * 10
        );
        mesh.userData = {
            baseY: mesh.position.y,
            speed: Math.random() * 0.5 + 0.3,
            amplitude: Math.random() * 0.4 + 0.1
        };
        scene.add(mesh);
        particles.push(mesh);
    }

    // Wireframe Orb
    const orbGeo = new THREE.IcosahedronGeometry(0.8, 2);
    const orbMat = new THREE.MeshStandardMaterial({
        color: 0x2dd4bf, emissive: 0x2dd4bf, emissiveIntensity: 0.3,
        wireframe: true, transparent: true, opacity: 0.35
    });
    const orb = new THREE.Mesh(orbGeo, orbMat);
    orb.position.set(-4, 1.5, -4);
    scene.add(orb);

    // Stars
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(1500 * 3);
    for (let i = 0; i < 1500; i++) {
        starPositions[i * 3] = (Math.random() - 0.5) * 80;
        starPositions[i * 3 + 1] = (Math.random() - 0.5) * 80;
        starPositions[i * 3 + 2] = (Math.random() - 0.5) * 80;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.08, transparent: true, opacity: 0.6 });
    scene.add(new THREE.Points(starGeo, starMat));

    // Mouse tracking
    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    // Animation loop
    const clock = new THREE.Clock();
    function animate() {
        requestAnimationFrame(animate);
        const t = clock.getElapsedTime();

        dnaGroup.rotation.y += 0.003;

        particles.forEach(p => {
            p.position.y = p.userData.baseY + Math.sin(t * p.userData.speed) * p.userData.amplitude;
        });

        const orbScale = 1 + Math.sin(t * 1.5) * 0.12;
        orb.scale.set(orbScale, orbScale, orbScale);
        orb.rotation.x += 0.003;
        orb.rotation.z += 0.002;

        // Subtle camera follow mouse
        camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.02;
        camera.position.y += (-mouseY * 0.3 - camera.position.y) * 0.02;
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
})();

// ===========================
// Prediction Logic
// ===========================
// NOTE: This uses a client-side heuristic for DEMO purposes.
// For real predictions, connect to your Flask/FastAPI backend:
//   fetch('/predict', { method: 'POST', body: JSON.stringify(data) })

function predict() {
    const btn = document.getElementById('predictBtn');
    const resultDiv = document.getElementById('result');

    btn.classList.add('loading');
    btn.querySelector('span').textContent = 'Analyzing...';
    resultDiv.classList.add('hidden');

    const data = {
        pregnancies: +document.getElementById('pregnancies').value,
        glucose: +document.getElementById('glucose').value,
        bp: +document.getElementById('bp').value,
        skin: +document.getElementById('skin').value,
        insulin: +document.getElementById('insulin').value,
        bmi: +document.getElementById('bmi').value,
        dpf: +document.getElementById('dpf').value,
        age: +document.getElementById('age').value
    };

    // Simulate API call — replace with actual backend call
    // setTimeout(() => {
    //     // Simple risk heuristic (mirrors SVM behavior roughly)
    //     let riskScore = 0;
    //     if (data.glucose > 140) riskScore += 30;
    //     else if (data.glucose > 120) riskScore += 15;
    //     if (data.bmi > 30) riskScore += 20;
    //     else if (data.bmi > 27) riskScore += 10;
    //     if (data.age > 45) riskScore += 15;
    //     else if (data.age > 35) riskScore += 8;
    //     if (data.dpf > 0.8) riskScore += 15;
    //     if (data.insulin > 200) riskScore += 10;
    //     if (data.pregnancies > 5) riskScore += 10;

    //     const isHighRisk = riskScore >= 40;
    //     const confidence = isHighRisk
    //         ? Math.min(95, 70 + riskScore * 0.4)
    //         : Math.max(60, 90 - riskScore * 0.5);

    //     showResult(isHighRisk, confidence.toFixed(1), data);

    //     btn.classList.remove('loading');
    //     btn.querySelector('span').textContent = 'Predict';
    // }, 1500);

    
    // === UNCOMMENT FOR REAL BACKEND ===
    // If using Flask wrapper around your model:
    fetch('/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(result => {
        showResult(result.prediction === 1, result.confidence, data);
        btn.classList.remove('loading');
        btn.querySelector('span').textContent = 'Predict';
    })
    .catch(err => {
        alert('Prediction failed. Is the backend running?');
        btn.classList.remove('loading');
        btn.querySelector('span').textContent = 'Predict';
    });
    
}

function showResult(isHighRisk, confidence, data) {
    const resultDiv = document.getElementById('result');
    resultDiv.className = 'result ' + (isHighRisk ? 'result-high' : 'result-low');

    resultDiv.innerHTML = `
        <div class="result-header">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
            ${isHighRisk ? '⚠️ High Risk of Diabetes' : '✅ Low Risk — Not Diabetic'}
        </div>
        <div class="result-details">
            <div class="result-row">
                <span class="label">Assessment</span>
                <span class="value" style="color:${isHighRisk ? 'var(--danger)' : 'var(--success)'}">
                    ${isHighRisk ? 'Diabetic Risk Detected' : 'No Significant Risk'}
                </span>
            </div>
            <div class="result-row">
                <span class="label">Confidence</span>
                <span class="value" style="color:var(--primary)">${confidence}%</span>
            </div>
            <div class="confidence-bar">
                <div class="confidence-fill" id="confFill"></div>
            </div>
            <div class="result-row">
                <span class="label">Key Factor</span>
                <span class="value">${data.glucose > 140 ? 'High Glucose' : data.bmi > 30 ? 'High BMI' : data.age > 45 ? 'Age Factor' : 'Combined Metrics'}</span>
            </div>
        </div>
        <p class="result-note">⚕️ Prediction generated using trained machine learning model.</p>
    `;

    // Animate confidence bar
    requestAnimationFrame(() => {
        document.getElementById('confFill').style.width = confidence + '%';
    });
}
