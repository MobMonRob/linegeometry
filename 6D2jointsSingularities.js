
Algebra(6, 0, 0, () => {


    var L1 = 1e12 + 2e13 + 3e14; 
    var L2 = 1e12 + 2e13 + 4e14; 

    var meet = L1 ^ L2;
    console.log("Produit extérieur (L1 ^ L2) :", meet);
    console.log("Norme du produit :", meet.Length);
    
    if (meet.Length < 0.0001) {
        console.log("Singularité détectée : Les lignes sont intersectantes ou coaxiales.");
    } else {
        console.log("Pas de singularité : Les lignes sont skew (non-intersectantes).");
    }
});