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
let saturation100 = 100;
let saturation;
let contrast;
let lightness = 0;
let color;

let contrasts = [];
let hues = [];


//updateUI should contain functions like update contrast settings, update hue settings, update swatches
function initializeUI() {
  updateUI();
  document.getElementById("step0").value = 3;
  document.getElementById("step1").value = 4.5;
  document.getElementById("step2").value = 7;
  document.getElementById("fam0").value = 350;
  document.getElementById("fam1").value = 160;
  document.getElementById("fam2").value = 220;
  updateUI();
  //updateSwatches();
}

function updateUI() {
  updateContrastSettings();
  updateHueSettings();
  updateSwatches();
}

function addContrastStep() {
  contrastSteps++;
  contrasts.push(2);
  updateContrastSettings();
  updateSwatches();
}

function delContrastStep(event) {
  if (contrastSteps > 1) {
    let contrastSetting = this.parentNode.id;
    document.getElementById(contrastSetting).remove();
    contrastSteps--;
    updateContrastSettings();
    updateSwatches();
  }
}

function addHueFamily() {
  hueFamilies++;
  hues.push(0);
  updateHueSettings();
  updateSwatches();
}

function delHueStep(event) {
  if (hueFamilies > 1) {
    let hueSetting = this.parentNode.id;
    console.log(hueSetting);
    document.getElementById(hueSetting).remove();
    hueFamilies--;
    updateHueSettings();
    updateSwatches();
  }
}

function updateContrastSettings() {
  let contrastValues = document.getElementsByName("contrast");
  for (let step = 0; step < contrastValues.length; step++) {
    contrasts[step] = contrastValues[step].value;
  } //update contrasts array with current contrast values
  //console.log(contrasts);

  let contrastSettings = document.getElementById("contrastSettings");
  while (contrastSettings.firstChild) {
    contrastSettings.removeChild(contrastSettings.lastChild);
  } //remove all existing contents of grid so we can start fresh

  contrastSettings.style.gridTemplateColumns = "repeat(" + contrastSteps + ", 1fr)";
  grid.style.gridTemplateColumns = "repeat(" + contrastSteps + ", 1fr)";
  for (let step = 0; step < contrastSteps; step++) {
    createContrastSetting(step); //create setting UI for each step

    let id = "step" + step;
    document.getElementById(id).value = contrasts[step];
    console.log(id, contrastValues[step].value);
    //add back previous contrast values
  }
}

function updateHueSettings() {
  let hueValues = document.getElementsByName("hue");
  for (let i = 0; i < hueValues.length; i++) {
    hues[i] = hueValues[i].value;
  } //update hues array with current hue values
  //console.log(hues);

  let hueSettings = document.getElementById("hueSettings");
  while (hueSettings.firstChild) {
    hueSettings.removeChild(hueSettings.lastChild);
  } //remove all existing contents of grid so we can start fresh

  hueSettings.style.gridTemplateRows = "repeat(" + hueFamilies + ", 1fr)";
  //grid.style.gridTemplateRows = "repeat(" + hueFamilies + ", 1fr)";
  for (let fam = 0; fam < hueFamilies; fam++) {
    createHueSetting(fam); //create setting UI for each step

    let id = "fam" + fam;
    document.getElementById(id).value = hues[fam];
    //console.log(id, hueValues[fam].value);
    //add back previous contrast values
  }
}

function updateSwatches() {
  let grid = document.getElementById("grid");
  while (grid.firstChild) {
    grid.removeChild(grid.lastChild);
  } //remove all existing contents of grid so we can start fresh
  
  for (let fam = 0; fam < hueFamilies; fam++) {
    for (let step = 0; step < contrastSteps; step++) {
      createSwatch(fam, step);
    }
  }
}

function createContrastSetting(step) {
  let contrastSetting = document.createElement("div");
  let contrastSettingLabel = document.createElement("label");
  let contrastSettingLabelText = document.createTextNode("Target contrast: ");
  let contrastSettingInput = document.createElement("input");
  let contrastSettingDelete = document.createElement("button");
  let contrastSettingDeleteText = document.createTextNode("Delete");
  //create contrastSetting contents

  contrastSetting.id = "contrastSetting" + step;
  contrastSettingInput.id = "step" + step;
  contrastSetting.className = "contrastSetting";
  contrastSettingInput.type = "number";
  contrastSettingInput.name = "contrast";
  //contrastSettingInput.value = "2";
  contrastSettingInput.addEventListener("change", updateSwatches);
  contrastSettingInput.addEventListener("click", contrastSettingInput.select);
  contrastSettingInput.min = "1";
  contrastSettingInput.max = "21";
  contrastSettingInput.step = "0.1";
  contrastSettingDelete.addEventListener("click", delContrastStep);
  //add attributes to contents

  document.getElementById("contrastSettings").appendChild(contrastSetting);
  contrastSetting.appendChild(contrastSettingLabel);
  contrastSettingLabel.appendChild(contrastSettingLabelText);
  contrastSetting.appendChild(contrastSettingInput);
  contrastSetting.appendChild(contrastSettingDelete);
  contrastSettingDelete.appendChild(contrastSettingDeleteText);
  //put contents in DOM
}

function createHueSetting(fam) {
  let hueSetting = document.createElement("div");
  let hueSettingLabel = document.createElement("label");
  let hueSettingLabelText = document.createTextNode("Hue: ");
  let hueSettingInput = document.createElement("input");
  let hueSettingDelete = document.createElement("button");
  let hueSettingDeleteText = document.createTextNode("Delete");
  //create hueSetting contents

  hueSetting.id = "hueSetting" + fam;
  hueSettingInput.id = "fam" + fam;
  hueSetting.className = "hueSetting";
  hueSettingInput.type = "number";
  hueSettingInput.name = "hue";
  //hueSettingInput.value = "0";
  hueSettingInput.addEventListener("change", updateSwatches);
  hueSettingInput.addEventListener("click", hueSettingInput.select);
  hueSettingInput.min = "-360";
  hueSettingInput.max = "360";
  hueSettingDelete.addEventListener("click", delHueStep);
  //add attributes to contents

  document.getElementById("hueSettings").appendChild(hueSetting);
  hueSetting.appendChild(hueSettingLabel);
  hueSettingLabel.appendChild(hueSettingLabelText);
  hueSetting.appendChild(hueSettingInput);
  hueSetting.appendChild(hueSettingDelete);
  hueSettingDelete.appendChild(hueSettingDeleteText);
  //put contents in DOM
}

function createSwatch(fam, step) {
  let hueID = "fam" + fam; //get id of corresponding hue input
  let hueValue = document.getElementById(hueID).value; //get value of hue input
  //console.log(hueID, hueValue);
  let contrastID = "step" + step; //get id of corresponding contrast input
  let contrastValue = document.getElementById(contrastID).value; //get value of contrast input
  let color = getContrast(hueValue, saturation100, contrastValue); //get color
  let actualContrast = Math.round(chroma.contrast(color, "white") * 100)/100; //get actual contrast of color 
  //console.log(hueID, hueValue, contrastID, contrastValue, saturation100);

  let swatch = document.createElement("div");
  let swatchContrast = document.createElement("p");
  let swatchContrastText = document.createTextNode("Contrast: " + actualContrast);
  //create swatch contents

  swatch.id = "swatchF" + fam + "S" + step;
  swatch.className = "swatch";
  swatch.style.backgroundColor = color;
  swatchContrast.className = "swatchText";
  if (actualContrast < 4.5) {
    swatchContrast.style.color = "black";
  } else { swatchContrast.style.color = "white"; }
  //add attributes to contents

  document.getElementById("grid").appendChild(swatch);
  swatch.appendChild(swatchContrast);
  swatchContrast.appendChild(swatchContrastText);
  //put contents in DOM
}
  
//////////////////////////////////////////////


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





