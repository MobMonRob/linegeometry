Algebra(6, 0, 0, () => {
  const pgaToG6 = (c01, c02, c03, c12, c13, c23) => {
    return c01 * 1e1 + c02 * 1e2 + c03 * 1e3 + c12 * 1e4 + c13 * 1e5 + c23 * 1e6;
  };

  const L1_skew = pgaToG6(1, 0, 0, 0, 1, 0);
  const L2_skew = pgaToG6(0, 1, 0, -1, 0, 0);
//  const L3_skew = pgaToG6(0, 0, 0, 0, 0, 0);
//  const L4_skew = pgaToG6(0, 0, 0, 0, 0, 0);
//  const L5_skew = pgaToG6(0, 0, 0, 0, 0, 0);
//  const L6_skew = pgaToG6(0, 0, 0, 0, 0, 0);
  
  const wedge_skew = L1_skew ^ L2_skew;
  const is_skew_singular = wedge_skew.Length === 0;

  const L1_coax = pgaToG6(1, 2, 3, 4, 5, 6);
  const L2_coax = pgaToG6(2, 4, 6, 8, 10, 12);
  
  const wedge_coax = L1_coax ^ L2_coax;
  const is_coax_singular = wedge_coax.Length === 0;

  const L1 = pgaToG6(1, 0, 0, 0, 0, 0);
  const L2 = pgaToG6(0, 1, 0, 0, 0, 0);
  const L3 = pgaToG6(0, 0, 1, 0, 0, 0);
  const L4 = pgaToG6(0, 0, 0, 1, 0, 0);
  const L5 = pgaToG6(0, 0, 0, 0, 1, 0);
  const L6 = pgaToG6(0, 0, 0, 0, 0, 1);

  const full_robot_singularity = L1 ^ L2 ^ L3 ^ L4 ^ L5 ^ L6;
  const is_full_robot_singular = full_robot_singularity.Length === 0;

document.body.innerHTML=`
  <div style="font-family: sans-serif; padding: 30px; color: #333;">
    <h2>Singularity Detection in Cl(6,0,0)</h2>
    
    <div style="margin-bottom: 20px; padding: 15px; background : #f5f5f5; border-radius: 5px; border-left: 5px solid #2196f3;">
      <strong>SKEW LINES (Non-singular)</strong><br>
      Norm of outer product : ${wedge_skew.Length.toFixed(4)}<br>
      Outer product == 0 ? <span style="color: red; font-weight: bold;">${is_skew_singular}</span>
    </div>
    
    <div style="margin-bottom: 20px; padding: 15px; background : #f5f5f5; border-radius: 5px; border-left: 5px solid #ff5722;">
      <strong>COAXIAL LINES (singular)</strong><br>
      Norm of outer product : ${wedge_coax.Length.toFixed(4)}<br>
      Outer product == 0 ? <span style="color: green; font-weight: bold;">${is_coax_singular}</span>
    </div>
    
    <div style="margin-bottom: 20px; padding: 15px; background : #f5f5f5; border-radius: 5px; border-left: 5px solid #4caf50;">
      <strong>FULL 6-AXIS ROBOT</strong><br>
      Norm of outer product : ${full_robot_singularity.Length.toFixed(4)}<br>
      Outer product == 0 ? <strong>${is_full_robot_singular}</strong>
    </div>
  </div>
  `;
});