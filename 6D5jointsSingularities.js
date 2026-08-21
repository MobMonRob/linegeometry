Algebra(3,0,1, () => {
  let oldGui = document.getElementById('comparison-gui');
  if (oldGui) oldGui.remove();

  let panel = document.createElement('div');
  panel.id = 'comparison-gui';
  panel.style.cssText = 'position:absolute; top:15px; left:15px; z-index:9999; background:rgba(255, 255, 255, 0.95); padding:15px; border-radius:5px; font-family:sans-serif; box-shadow: 0 4px 6px rgba(0,0,0,0.1); width: 380px;';
  document.body.appendChild(panel);

  const point = (x, y, z) => 1e123 - x*1e023 + y*1e013 + z*1e012;
  
  // --- G6 ENGINE: GRAM MATRIX FOR N LINES ---
  const getG6Coords = (L) => [L[5]||0, L[6]||0, L[7]||0, L[8]||0, L[9]||0, L[10]||0];
  const dot6 = (A, B) => A.reduce((sum, val, i) => sum + val * B[i], 0);
  
  const determinant = (m) => {
    if (m.length === 1) return m[0][0];
    if (m.length === 2) return m[0][0]*m[1][1] - m[0][1]*m[1][0];
    let det = 0;
    for (let i = 0; i < m.length; i++) {
      let subMatrix = m.slice(1).map(row => row.filter((_, j) => j !== i));
      det += (i % 2 === 0 ? 1 : -1) * m[0][i] * determinant(subMatrix);
    }
    return det;
  };

  const wedgeNormG6 = (...lines) => {
    let vecs = lines.map(getG6Coords);
    let N = vecs.length;
    let gram = Array(N).fill(0).map(() => Array(N).fill(0));
    for(let i=0; i<N; i++) {
      for(let j=0; j<N; j++) {
        gram[i][j] = dot6(vecs[i], vecs[j]);
      }
    }
    return Math.sqrt(Math.max(0, determinant(gram)));
  };

  // --- 5 JOINTS CONFIGURATIONS ---
  // 1. 5 DOF: Independent lines (e.g., in 2 planes)
  const L1_5dof = point(-0.4, 0, 0) & point(-0.3, 0, 0);
  const L2_5dof = point(-0.4, 0, 0) & point(-0.4, 0.1, 0);
  const L3_5dof = point(-0.4, 0, 0) & point(-0.4, 0, 0.1); 
  const L4_5dof = point(-0.2, 0, 0) & point(-0.2, 0, 0.1);
  const L5_5dof = point(-0.4, 0.2, 0) & point(-0.4, 0.2, 0.1);

  // 2. 4 DOF (Wrist Singularity): Concurrent lines (intersecting at the center)
  const L1_4dof = point(0.2, 0, 0) & point(0.3, 0, 0);
  const L2_4dof = point(0.2, 0, 0) & point(0.2, 0.1, 0);
  const L3_4dof = point(0.2, 0, 0) & point(0.3, 0.1, 0);
  const L4_4dof = point(0.4, 0, 0) & point(0.4, 0, 0.1);
  const L5_4dof = point(0.2, 0.2, 0) & point(0.2, 0.2, 0.1); 

  // --- CALCULATIONS ---
  const g6_5dof = wedgeNormG6(L1_5dof, L2_5dof, L3_5dof, L4_5dof, L5_5dof);
  const g6_4dof = wedgeNormG6(L1_4dof, L2_4dof, L3_4dof, L4_4dof, L5_4dof);

  panel.innerHTML = `
    <h3 style="margin-top:0; color:#333;">PGA vs G6 (5 Joints)</h3>
    <p style="color:#0000FF;"><strong>1. 5 DOF (Independent)</strong><br>
       PGA = 0.00 (Algebra capacity exceeded)<br>
       G6 = ${g6_5dof.toFixed(2)} (Non-zero = Independent)</p>
    <p style="color:#FF0000;"><strong>2. 4 DOF (Wrist Singularity)</strong><br>
       PGA = 0.00<br>
       G6 = ${g6_4dof.toFixed(2)} (Zero = Singular in G6!)</p>
  `;

  return this.graph(() => {
    return [
      0x0000FF, L1_5dof, L2_5dof, L3_5dof, L4_5dof, L5_5dof,
      0xFF0000, L1_4dof, L2_4dof, L3_4dof, L4_4dof, L5_4dof
    ];
  }, { grid: true, labels: true, lineWidth: 3, h: 0.2, p: -0.1, scale: 0.6 });
});