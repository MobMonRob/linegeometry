Algebra(6, 0, 0, () => {
  const pgaToG6 = (c01, c02, c03, c12, c13, c23) => {
    return c01 * 1e1 + c02 * 1e2 + c03 * 1e3 + c12 * 1e4 + c13 * 1e5 + c23 * 1e6;
  };

  const L1_4dof = pgaToG6(1, 0, 0, 0, 1, 0);
  const L2_4dof = pgaToG6(0, 1, 0, 0, 0, 1);
  const L3_4dof = pgaToG6(0, 0, 1, 1, 0, 0);
  const L4_4dof = pgaToG6(1, 1, 0, 0, 1, 1);

  const wedge_4dof = L1_4dof ^ L2_4dof ^ L3_4dof ^ L4_4dof;
  const is_4dof_singular = wedge_4dof.Length === 0;

  const L1_3dof = pgaToG6(1, 0, 0, 0, 0, 0);
  const L2_3dof = pgaToG6(0, 1, 0, 0, 0, 0);
  const L3_3dof = pgaToG6(0, 0, 1, 0, 0, 0);
  const L4_3dof = pgaToG6(1, 1, 1, 0, 0, 0);

  const wedge_3dof = L1_3dof ^ L2_3dof ^ L3_3dof ^ L4_3dof;
  const is_3dof_singular = wedge_3dof.Length === 0;

  document.body.innerHTML = `
    <div style="font-family: sans-serif; padding: 30px; color: #333;">
      <h2>4 Joints/Lines Detection in Cl(6,0,0)</h2>
      <div style="margin-bottom: 20px; padding: 15px; background: #e3f2fd; border-radius: 5px; border-left: 5px solid #2196F3;">
        <strong>4 DOF</strong><br>
        Norm: ${wedge_4dof.Length.toFixed(4)}<br>
        Is Singular? <span style="color: red; font-weight: bold;">${is_4dof_singular}</span>
      </div>
      <div style="margin-bottom: 20px; padding: 15px; background: #fbe9e7; border-radius: 5px; border-left: 5px solid #FF5722;">
        <strong>3 DOF SINGULAR</strong><br>
        Norm: ${wedge_3dof.Length.toFixed(4)}<br>
        Is Singular? <span style="color: green; font-weight: bold;">${is_3dof_singular}</span>
      </div>
    </div>
  `;
});