Algebra(6, 0, 0, () => {
  const pgaToG6 = (c01, c02, c03, c12, c13, c23) => {
    return c01 * 1e1 + c02 * 1e2 + c03 * 1e3 + c12 * 1e4 + c13 * 1e5 + c23 * 1e6;
  };

  const L1_skew = pgaToG6(1, 0, 0, 0, 1, 0);
  const L2_skew = pgaToG6(0, 1, 0, -1, 0, 0);
  
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
});