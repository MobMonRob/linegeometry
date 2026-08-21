Algebra(3,0,1,() => {
  //Clean up existing GUI to prevent duplicates
  let oldGui = document.getElementById('ur5-gui');
  if (oldGui) oldGui.remove();

  //HTML control panel
  let panel = document.createElement('div');
  panel.id = 'ur5-gui';
  panel.style.cssText = 'position:absolute; top:15px; right:15px; z-index:9999; background:rgba(255, 255, 255, 0.95); padding:10px; width:220px; border:1px solid #ccc; border-radius:5px; font-family:sans-serif;';
  document.body.appendChild(panel);

  panel.innerHTML = '<h4 style="margin:0 0 10px 0; color:#333; font-size:14px;">UR5 Exact Angles (°) </h4>';

  //Numeric input for theta entry
  const createNumberControl = (label, min, max, initialVal) => {
    let container = document.createElement('div');
    container.style.cssText = "margin:6px 0; display:flex; align-items:center; justify-content:space-between; font-size:12px;";

    let labelSpan = document.createElement('span');
    labelSpan.innerText = label;

    let numInput = Object.assign(document.createElement('input'), {
      type: 'number', min, max, step: 1, value: initialVal
    });
    numInput.style.cssText = "width:70px; padding: 3px 6px; border:1px solid #ccc; border-radius:4px; text-align:right; font-family:monospace;";

    container.appendChild(labelSpan);
    container.appendChild(numInput);
    panel.appendChild(container);

    return numInput;
  };

  //Create 6 inputs (-180° to 180°)
  var in1 = createNumberControl("Base (Θ1)", -180, 180, 0);
  var in2 = createNumberControl("Shoulder (Θ2)", -180, 180, -45);
  var in3 = createNumberControl("Elbow (Θ3)", -180, 180, 90);
  var in4 = createNumberControl("Wrist 1 (Θ4)", -180, 180, -45);
  var in5 = createNumberControl("Wrist 2 (Θ5)", -180, 180, 0);
  var in6 = createNumberControl("Effector (Θ6)", -180, 180, 0);

  //Denavit-Hartenberg Motor Generator
  const Mdh = (alpha, a, theta, d) => {
    let Rz = Math.cos(0.5*theta) - Math.sin(0.5*theta)*1e31; // FIXME Should be rotation around z: 1e12
    let Tz = 1 - 0.5*d*1e02;                                 // Translation along z
    let Tx = 1 - 0.5*a*1e01;                                 // Translation along x
    let Rx = Math.cos(0.5*alpha) - Math.sin(0.5*alpha)*1e23; // Rotation around x
    return Rz * Tz * Tx * Rx;
  };

  //Nominal UR5 DH parameters
  const pi = Math.PI;
  const dhParams = [
    { alpha : pi/2.0,  a : 0.0,    d : 0.0892  },  //Joint 1
    { alpha : 0.0,     a : 0.425,  d : 0.0     },  //Joint 2 FIXME a should be -1
    { alpha : 0.0,     a : 0.392,  d : 0.0     },  //Joint 3 FIXME a should be -1
    { alpha : pi/2.0,  a : 0.0,    d : 0.10915 },  //Joint 4
    { alpha : -pi/2.0, a : 0.0,    d : 0.09465 },  //Joint 5
    { alpha : 0.0,     a : 0.0,    d : 0.0825  }   //Joint 6
  ];

  const origin = 1e123;
  const Y_axe = 1e31;
  const M_base = (1.0 - 0.5 * 1e01) * (1.0 - 0.5 * (-1) * 1e02);
  const L_0 = M_base * Y_axe * ~M_base;
  const P_0 = M_base * origin * ~M_base;

  //Automated Forward Kinematics Engine (Simplified)
  const computeForwardKinematics = (params, angles) => {
    let M_abs_current = M_base;
    let rawAxes = [], points = [];

    // Calculate positions and axes based on DH parameters
    for (let i = 0; i < params.length; i++) {
      let M_rel = Mdh(params[i].alpha, params[i].a, angles[i], params[i].d);
      M_abs_current = M_abs_current * M_rel;

      rawAxes.push(M_abs_current * Y_axe * ~M_abs_current);
      points.push(M_abs_current * origin * ~M_abs_current);
    }

    // Apply a uniform color (orange) to all axes
    let axes = [];
    for (let i = 0; i < 6; i++) {
      axes.push(0xFF5722); 
      axes.push(rawAxes[i]);
    }

    return { axes, points };
  };

  // Generate line segments between joints
  const generateSegments = (basePoint, jointPoints) => {
    let allPoints = [basePoint, ...jointPoints];
    let segments = [];
    for (let i = 0; i < allPoints.length - 1; i++) {
      if (allPoints[i] && allPoints[i + 1]) {
        segments.push([allPoints[i], allPoints[i+1]]);
      }
    }
    return segments;
  };

  // Real-time rendering
  return this.graph(() => {
    
    // Fetch and convert slider values to radians
    const thetas = [
      parseFloat(in1.value || 0) * (pi / 180),
      parseFloat(in2.value || 0) * (pi / 180),
      parseFloat(in3.value || 0) * (pi / 180),
      parseFloat(in4.value || 0) * (pi / 180),
      parseFloat(in5.value || 0) * (pi / 180),
      parseFloat(in6.value || 0) * (pi / 180)
    ];

    const { axes, points } = computeForwardKinematics(dhParams, thetas);
    const segments = generateSegments(P_0, points);

    //Clean return array for rendering
    return [
      0x222222, "UR5 Direct Kinematics Only",
      0xFF5722, L_0, ...axes,
      0xFF0000, P_0, "Base",
      0x000000, ...points,
      0x00FF00, ...segments,
    ];
  }, {
    grid        : true, // Display a grid
    labels      : true, // Label the grid
    h           : 0.4,  // Heading
    p           : -0.2, // Pitching
    lineWidth   : 3,    // Custom lineWidth (default=1)
    pointRadius : 1,    // Custom point radius (default=1)
    fontSize    : 1,    // Custom font size (default=1)
    scale       : 1,    // Custom scale (default=1), mousewheel.
    animate     : true,
  });
});
