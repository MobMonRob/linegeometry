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
  
  // Calculate the determinant of an NxN matrix
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

  // Norm of the G6 outer product via the Gram Matrix
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

  // --- 3 JOINTS CONFIGURATIONS ---
  // 1. 3 DOF: Independent lines in space
  const L1_3dof = point(-4, 0, -1) & point(-2, 0, 1);
  const L2_3dof = point(-4, 1, 1) & point(-2, 1, -1);
  const L3_3dof = point(-3, -1, 0) & point(-3, 2, 0); 
  
  // 2. 2 DOF (Elbow Singularity): Parallel lines
  const L1_2dof = point(2, 0, 0) & point(4, 0, 0);
  const L2_2dof = point(2, 1, 0) & point(4, 1, 0);
  const L3_2dof = point(2, 2, 0) & point(4, 2, 0); 

  // --- CALCULATIONS ---
  // In PGA, the product of 3 bivectors exceeds the dimension of the space (grade 6 in a 4D space). 
  // Therefore, it is always zero.
  const pga_3dof = 0; 
  const pga_2dof = 0; 

  const g6_3dof = wedgeNormG6(L1_3dof, L2_3dof, L3_3dof);
  const g6_2dof = wedgeNormG6(L1_2dof, L2_2dof, L3_2dof);

  panel.innerHTML = `
    <h3 style="margin-top:0; color:#333;">PGA vs G6 (3 Joints)</h3>
    <p style="color:#0000FF;"><strong>1. 3 DOF (Lines in space)</strong><br>
       PGA = ${pga_3dof.toFixed(2)} (Algebra capacity exceeded)<br>
       G6 = ${g6_3dof.toFixed(2)} (Non-zero = Independent)</p>
    <p style="color:#FF0000;"><strong>2. 2 DOF (Elbow Singularity)</strong><br>
       PGA = ${pga_2dof.toFixed(2)}<br>
       G6 = ${g6_2dof.toFixed(2)} (Zero = Singular in G6!)</p>
  `;

  return this.graph(() => {
    return [
      0x0000FF, L1_3dof, L2_3dof, L3_3dof,
      0xFF0000, L1_2dof, L2_2dof, L3_2dof
    ];
  }, { grid: true, labels: true, lineWidth: 3, h: 0.2, p: -0.1, scale: 0.6 });
});