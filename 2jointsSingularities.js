Algebra(3,0,1, () => {
  
  const origin = 1e123;
 // const createPoint = (x, y, z) => {
 //   let Tx = 1.0 - 0.5 * x * 1e01;
 //   let Ty = 1.0 - 0.5 * y * 1e02;
 //   let Tz = 1.0 - 0.5 * z * 1e03;
 //   let T = Tx * Ty * Tz;
 //   return T * origin * ~T;
 // };

  const createPoint = (x, y, z) => {
     return !(1e0 + x*1e1 + y*1e2 + z*1e3);
  };
  
  const p1_skew = createPoint(-1, 0.5, -1);
  const p2_skew = createPoint(1, 0.5, 1);
  const L1_skew = p1_skew & p2_skew; 

  const p3_skew = createPoint(-1, 1, 1);
  const p4_skew = createPoint(1, 1, -1);
  const L2_skew = p3_skew & p4_skew; 
  
  const wedge_skew = L1_skew ^ L2_skew;

  const p1_coax = createPoint(-1, -1, -1);
  const p2_coax = createPoint(1, -1, 1);
  const L1_coax = p1_coax & p2_coax; 

  const p3_coax = createPoint(-1, -1, 1);
  const p4_coax = createPoint(1, -1, -1);
  const L2_coax = p3_coax & p4_coax; 
  
  const wedge_coax = L1_coax ^ L2_coax;

  const norm_skew = wedge_skew.Length;
  const norm_coax = wedge_coax.Length;

  return this.graph(() => {
    
    const text_skew = "SKEW (2 DOF) : L1 ^ L2 = " + norm_skew.toFixed(2) + " (Non nul)";
    const text_coax = "INTERSECTING (1 DOF) : L1 ^ L2 = " + norm_coax.toFixed(2) + " (= 0)";

    return [
      0x000000, "Singularities - Geometrical Insight",
      
      0x2196F3, text_skew,
      0x2196F3, L1_skew, L2_skew,
      
      0xFF5722, text_coax,
      0xFF5722, L1_coax, L2_coax
    ];
  }, {
    grid      : true, 
    labels    : true, 
    lineWidth : 3, 
    h         : 0.4, 
    p         : -0.1, 
    scale     : 1.5
  });
});
