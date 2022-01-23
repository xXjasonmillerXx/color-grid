//TODO
//add arbitrary control of grid dimensions
//add info inside swatches
//add naming of steps/families
//add end hue and easing
//add offsets
//come up with saturation solution
//json import/export/save
//style dictionary compatibility
//figma plugin
//dark mode
//reorder steps/fams

let contrastSteps = 3;
let gridCols = contrastSteps + 2;
let hueFamilies = 3;
//let gridRows = hueFamilies + 2;

let hue;
let startHue = 200;
let endHue = 210;
let saturation100;
let saturation;
let contrast;
let lightness = 0;
let color;

let contrasts = [];
let hues = [];

function addHueFamily() {
  hueFamilies++;

  let newHueCell = document.createElement("div");
  let newHueCellLabel = document.createElement("label");
  let newHueCellLabelText = document.createTextNode("Hue:");
  let newHueCellInput = document.createElement("input");
  //create hueCell div, label, and input

  newHueCellInput.type = "number";
  newHueCellInput.name = "hue";
  newHueCellInput.value = "0";
  newHueCellInput.addEventListener("change", updateColors);
  newHueCellInput.min = "0";
  newHueCellInput.max = "360";
  //add attributes to hueCell input

  newHueCell.appendChild(newHueCellLabel); //put label inside div
  newHueCellLabel.appendChild(newHueCellLabelText); //put label text inside label
  newHueCell.appendChild(newHueCellInput); //put input inside div

  let addHue = document.getElementById("addHue");
  document.getElementById("grid").insertBefore(newHueCell, addHue);
  //put hueCell before the existing Add Hue Family button
  //console.log(gridCols, contrastSteps);

  for (let col = 0; col < contrasts.length; col++) {
    let newSwatch = document.createElement("div");
    newSwatch.id = "swatchR" + (hueFamilies-1) + "C" + col;
    newSwatch.className = "swatch";
    newSwatch.style.backgroundColor = "white";
    document.getElementById("grid").insertBefore(newSwatch, addHue);
    //similar to above, create swatch divs and add to new row, for each col
    //console.log(row, contrastSteps, newSwatch.id, newSwatch.className, newSwatch.style.backgroundColor, rowEndSwatch.id);
  }

  let newEndCell = document.createElement("div");
  newEndCell.id = "swatchR" + (hueFamilies-1) + "End";
  newEndCell.className = "swatch";
  document.getElementById("grid").insertBefore(newEndCell, addHue);

  updateColors();   
}

function addContrastStep() {
  contrastSteps++;
  gridCols = contrastSteps + 2;
  document.getElementById("grid").style.gridTemplateColumns = "repeat(" + gridCols + ", 1fr)";
  //console.log(gridCols, contrastSteps);
  //restyle grid to have 1 additional column

  let newContrastCell = document.createElement("div");
  let newContrastCellLabel = document.createElement("label");
  let newContrastCellLabelText = document.createTextNode("Contrast to white:");
  let newContrastCellInput = document.createElement("input");
  //create contrastCell div, label, and input

  newContrastCellInput.type = "number";
  newContrastCellInput.name = "contrast";
  newContrastCellInput.value = "2";
  newContrastCellInput.addEventListener("change", updateColors);
  newContrastCellInput.min = "1";
  newContrastCellInput.max = "21";
  newContrastCellInput.step = "0.1";
  //add attributes to contrastCell input

  newContrastCell.appendChild(newContrastCellLabel); //put label inside div
  newContrastCellLabel.appendChild(newContrastCellLabelText); //put label text inside label
  newContrastCell.appendChild(newContrastCellInput); //put input inside div

  let addContrast = document.getElementById("addContrast");
  document.getElementById("grid").insertBefore(newContrastCell, addContrast);
  //put contrastCell before the existing Add Contrast Step button
  //console.log(gridCols, contrastSteps);

  for (let row = 0; row < hues.length; row++) {
    let newSwatch = document.createElement("div");
    newSwatch.id = "swatchR" + row + "C" + (contrastSteps-1);
    newSwatch.className = "swatch";
    newSwatch.style.backgroundColor = "white";
    let rowEndSwatch = document.getElementById("swatchR" + row + "End");
    document.getElementById("grid").insertBefore(newSwatch, rowEndSwatch);
    //similar to above, create swatch div and add to end of row, for each row
    //console.log(row, contrastSteps, newSwatch.id, newSwatch.className, newSwatch.style.backgroundColor, rowEndSwatch.id);
  }

  updateColors(); //this generates a weird error i can't fix, but seems to work fine regardless for some reason
}


function updateColors() {
  saturation100 = parseFloat(document.getElementById('saturation').value);

  let contrastValues = document.getElementsByName("contrast");
  for (let step = 0; step < contrastValues.length; step++) {
    contrasts[step] = contrastValues[step].value;
  }
  let hueValues = document.getElementsByName("hue");
  for (let step = 0; step < hueValues.length; step++) {
    hues[step] = hueValues[step].value;
  }
  for (let row = 0; row < hues.length; row++) {
    for (let cell = 0; cell < contrasts.length; cell++) {
      let color = getContrast(hues[row], saturation100, contrasts[cell]);
      //let swatch = "swatch" + ((row * 3) + cell + 1);
      let swatch = "swatchR" + row + "C" + cell;
      document.getElementById(swatch).style.backgroundColor = color;
      console.log(contrasts.length, hues.length, row, cell, swatch);

    }
  }
}

function getContrast(hue, sat100, contrast) {

  let sat = sat100 / 100;
  for (let lightness100 = 0; lightness100 < 101; lightness100++) {
    //runs on every value of lightness from 0 to 100
    let testLightness = lightness100 / 100;
    //convert lightness 0-100 to lightness 0-1 
    let testColorDarker = chroma({ h: hue, s: sat, l: testLightness });
    let testColorLighter = chroma({ h: hue, s: sat, l: testLightness + 0.01 });
    //a pair of colors one step apart in lightness
    let testContrastDarker = Math.round(chroma.contrast(testColorDarker, 'white') * 100) / 100;
    let testContrastLighter = Math.round(chroma.contrast(testColorLighter, 'white') * 100) / 100;
    //get contrast ratio of test colors
    if (testContrastDarker - contrast <= 0 && testContrastLighter - contrast <= 0) {
      break;
      //stop looping if the test values are on either side of the target
    };
    let diff1 = testContrastDarker - contrast;
    let diff2 = contrast - testContrastLighter;
    //calculate how close each contrast ratio is to the target
    if (diff1 < diff2) {
      lightness = testLightness;
    } else {
      lightness = testLightness + 0.01;
    }
    //compare them and use the lightness from the closest one
    //console.log(contrast, testContrastDarker, testContrastLighter, diff1, diff2, lightness);
  }
  return chroma({ h: hue, s: sat, l: lightness });
  console.log(chroma.contrast(color, 'white'));

  //document.getElementById("swatch1").style.backgroundColor = color;
}





