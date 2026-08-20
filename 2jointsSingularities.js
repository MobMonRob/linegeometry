Algebra(3,0,1, () => {
  let oldGui = document.getElementById('comparison-gui');
  if (oldGui) oldGui.remove();

  // Interface 
  let panel = document.createElement('div');
  panel.id = 'comparison-gui';
  panel.style.cssText = 'position:absolute; top:15px; left:15px; z-index:9999; background:rgba(255, 255, 255, 0.9); padding:15px; border-radius:5px; font-family:sans-serif; box-shadow: 0 4px 6px rgba(0,0,0,0.1);';
  document.body.appendChild(panel);

  const point = (x, y, z) => 1e123 - x*1e023 + y*1e013 + z*1e012;
  
  // --- MOTOR G6 ---
  const getG6Coords = (L) => [L[5]||0, L[6]||0, L[7]||0, L[8]||0, L[9]||0, L[10]||0];
  const dot6 = (A, B) => A.reduce((sum, val, i) => sum + val * B[i], 0);
  const wedgeNormG6 = (L_A, L_B) => {
    let A = getG6Coords(L_A), B = getG6Coords(L_B);
    let magnitudeSquared = dot6(A,A) * dot6(B,B) - Math.pow(dot6(A,B), 2);
    return Math.sqrt(Math.max(0, magnitudeSquared));
  };

  // --- CONFIGURATIONS ---
  // 1. SKEW (Rouge) 
  const L1_skew = point(-3, 0.5, -1) & point(-1, 0.5, 1);
  const L2_skew = point(-3, 1, 1) & point(-1, 1, -1);
  
  // 2. INTERSECTING (Bleu) 
  const L1_int = point(1, 0.5, -1) & point(3, 0.5, 1);
  const L2_int = point(1, 0.5, 1) & point(3, 0.5, -1);
  
  // 3. COAXIAL (Vert) 
  const L1_coax = point(5, 0.5, -1) & point(7, 0.5, 1);
  const L2_coax = point(5.5, 0.5, -0.5) & point(6.5, 0.5, 0.5); 

  const pga_skew = Math.abs((L1_skew ^ L2_skew)[15]); 
  const pga_int  = Math.abs((L1_int ^ L2_int)[15]);
  const pga_coax = Math.abs((L1_coax ^ L2_coax)[15]);

  const g6_skew = wedgeNormG6(L1_skew, L2_skew);
  const g6_int  = wedgeNormG6(L1_int, L2_int);
  const g6_coax = wedgeNormG6(L1_coax, L2_coax);


  panel.innerHTML = `
    <h3 style="margin-top:0;">PGA vs G6 (2 Joints)</h3>
    <p style="color:#FF0000;"><strong>1. SKEW LINES</strong><br>
       PGA = ${pga_skew.toFixed(2)} (Non-zero = 4D Volume exists)<br>
       G6 = ${g6_skew.toFixed(2)} (Non-zero)</p>
    <p style="color:#0000FF;"><strong>2. INTERSECTING</strong><br>
       PGA = ${pga_int.toFixed(2)} (Zero = Coplanar, Null volume)<br>
       G6 = ${g6_int.toFixed(2)} (Non-zero = Still independent in 6D)</p>
    <p style="color:#00AA00;"><strong>3. COAXIAL</strong><br>
       PGA = ${pga_coax.toFixed(2)}<br>
       G6 = ${g6_coax.toFixed(2)} (Zero = Singular in G6!)</p>
  `;


  return this.graph(() => {
    return [
      0xFF0000, L1_skew, L2_skew,
      0x0000FF, L1_int, L2_int,
      0x00AA00, L1_coax, L2_coax
    ];
  }, { 
    grid      : true, 
    labels    : true, 
    lineWidth : 3, 
    h         : 0.1, 
    p         : -0.1, 
    scale     : 0.8 
  });
});