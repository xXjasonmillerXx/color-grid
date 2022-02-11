//TODO
//come up with better saturation solution. easing?
//json import/export/save
//black and white (maybe as one-off colors)?
//reorder steps/fams
//dark/neutral mode
//choose swatches to exclude from display or export
//if all swatches in a column are white or black, display one supertall swatch instead

//more than one scale of steps?
//add example text to swatches
//configuration of swatch content
//customizable light and dark contrast comparisons (instead of pure white/black)
//sideproject: normalized colorspace
//mesh gradient from swatches
//apca support
//add offsets
//style dictionary compatibility
//figma plugin
//display/documentation mode - json behind the scenes, all inputs hidden
//assistive tools for more than just base colors
//notes for steps/fams
//post on twitter
//write lil blog post
//promote on sidebar and other places
//win

//example json should have: # contrast steps, # hue families, start hues, end hues, contrast targets, saturations, names
//might need a json "savefile" with full UI info, and then a "color export" which just lists colors

let contrastSteps = 3;
//let gridCols = contrastSteps + 2;
let hueFamilies = 3;

//let hue;
//let startHue = 200;
//let endHue = 210;
//let saturation100 = 100;
let saturation = document.getElementById("saturation").value;
//let contrast;
//let lightness = 0;
//let color;

let contrasts = [];
let hueStarts = [];
let hueEnds = [];
let hueEndEnabled = [false, false, false];
let flips = [false, false, false];

let stepNames = [];
let hueNames = [];

let json = {}

function jsonWrite() {
  json = {
    "contrastSteps": contrastSteps,
    "stepNames": stepNames,
    "contrasts": contrasts,

    "saturation": saturation,

    "hueFamilies": hueFamilies,
    "hueNames": hueNames,
    "hueStarts": hueStarts,
    "hueEnds": hueEnds,
    "hueEndEnabled": hueEndEnabled,

    "flips": flips,
  }
  let jsonString = JSON.stringify(json);
  console.log(jsonString);
  let textarea = document.getElementById("jsonTextarea");
  textarea.value = jsonString;
}

function jsonDownload() {
  console.log(JSON.stringify(json));

  const a = document.createElement("a");
  const file = new Blob([JSON.stringify(json)], { type: "text/plain" });
  a.href = URL.createObjectURL(file);
  a.download = "colorgrid.json";
  a.click();
}


function initializeUI() {
  updateUI();
  document.getElementById("step0").value = 3;
  document.getElementById("step1").value = 4.5;
  document.getElementById("step2").value = 7;
  document.getElementById("fam0").value = 350;
  document.getElementById("fam1").value = 160;
  document.getElementById("fam2").value = 220;
  document.getElementById("famEnd0").value = 350;
  document.getElementById("famEnd1").value = 160;
  document.getElementById("famEnd2").value = 220;
  document.getElementById("nameS0").value = 1;
  document.getElementById("nameS1").value = 2;
  document.getElementById("nameS2").value = 3;
  document.getElementById("nameF0").value = "red";
  document.getElementById("nameF1").value = "green";
  document.getElementById("nameF2").value = "blue";
  //console.log(fam0.value, famEnd0.value);
  updateUI();
  //updateSwatches();
}

function updateUI() {
  updateContrastSettings();
  updateHueSettings();
  updateSwatches();
  jsonWrite();
  //console.log(json);
}

function addContrastStep() {
  contrastSteps++;
  contrasts.push(2);
  stepNames.push("-");
  updateUI();
}

function delContrastStep(event) {
  if (contrastSteps > 1) {
    let contrastSetting = this.parentNode.id;
    document.getElementById(contrastSetting).remove();
    contrastSteps--;
    updateUI();
  }
}

function addHueFamily() {
  hueFamilies++;
  hueStarts.push(0);
  hueNames.push("-");
  hueEndEnabled.push(false);
  flips.push(false);
  updateUI();
}

function delHueStep(event) {
  if (hueFamilies > 1) {
    let hueSetting = this.parentNode.id;
    //console.log(hueSetting);
    document.getElementById(hueSetting).remove();
    hueFamilies--;
    updateUI();
  }
}

function updateContrastData() {
  let contrastValues = document.getElementsByName("contrast");
  for (let i = 0; i < contrastValues.length; i++) {
    contrasts[i] = contrastValues[i].value;
  } //update contrasts array with current contrast values
  //console.log(contrasts);
}

function updateContrastSettings() {
  updateContrastData();

  let stepNameValues = document.getElementsByClassName("stepName");
  for (let i = 0; i < stepNameValues.length; i++) {
    stepNames[i] = stepNameValues[i].value;
  } //update stepnames array with current stepname values

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
    //console.log(id, contrastValues[step].value);
    //add back previous contrast values

    let nameID = "nameS" + step;
    document.getElementById(nameID).value = stepNames[step];
  }
}

function updateHueData() {
  let hueStartValues = document.getElementsByName("hueStart");
  let hueEndValues = document.getElementsByName("hueEnd");
  for (let i = 0; i < hueStartValues.length; i++) {
    hueStarts[i] = hueStartValues[i].value;
  } //update start hues array with current hue values
  for (let i = 0; i < hueEndValues.length; i++) {
    hueEnds[i] = hueEndValues[i].value;
  } //update end hues array with current hue values
}

function updateHueSettings() {
  updateHueData();

  let hueNameValues = document.getElementsByClassName("hueName");
  for (let i = 0; i < hueNameValues.length; i++) {
    hueNames[i] = hueNameValues[i].value;
  } //update huenames array with current huename values

  let hueSettings = document.getElementById("hueSettings");
  while (hueSettings.firstChild) {
    hueSettings.removeChild(hueSettings.lastChild);
    hueEndSettings.removeChild(hueEndSettings.lastChild);
  } //remove all existing contents of grid so we can start fresh

  hueSettings.style.gridTemplateRows = "repeat(" + hueFamilies + ", 1fr)";
  //grid.style.gridTemplateRows = "repeat(" + hueFamilies + ", 1fr)";
  for (let fam = 0; fam < hueFamilies; fam++) {
    createHueSetting(fam); //create setting UI for each step
    createEndHueSetting(fam); //create end hue setting for each

    let idStart = "fam" + fam;
    document.getElementById(idStart).value = hueStarts[fam];

    let idEnd = "famEnd" + fam;
    document.getElementById(idEnd).value = hueEnds[fam];
    //console.log(id, hueStartValues[fam].value);
    //add back previous contrast values

    let nameID = "nameF" + fam;
    document.getElementById(nameID).value = hueNames[fam];
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
  updateHueData();
  updateContrastData();
  jsonWrite();
}

function createContrastSetting(step) {
  let contrastSetting = document.createElement("div");
  let contrastNameLabel = document.createElement("label");
  let contrastNameLabelText = document.createTextNode("Step name: ");
  let contrastNameInput = document.createElement("input");
  let contrastSettingLabel = document.createElement("label");
  let contrastSettingLabelText = document.createTextNode("Target contrast: ");
  let contrastSettingInput = document.createElement("input");
  let contrastSettingDelete = document.createElement("button");
  let contrastSettingDeleteText = document.createTextNode("Delete");
  //create contrastSetting contents

  contrastSetting.id = "contrastSetting" + step;
  contrastNameInput.id = "nameS" + step;
  contrastNameInput.className = "nameInput stepName";
  contrastNameInput.addEventListener("change", updateSwatches);
  contrastNameInput.addEventListener("click", contrastNameInput.select);
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
  contrastSetting.appendChild(contrastNameLabel);
  contrastNameLabel.appendChild(contrastNameLabelText);
  contrastSetting.appendChild(contrastNameInput);
  contrastSetting.appendChild(contrastSettingLabel);
  contrastSettingLabel.appendChild(contrastSettingLabelText);
  contrastSetting.appendChild(contrastSettingInput);
  contrastSetting.appendChild(contrastSettingDelete);
  contrastSettingDelete.appendChild(contrastSettingDeleteText);
  //put contents in DOM
}

function createHueSetting(fam) {
  let hueSetting = document.createElement("div");
  let hueNameLabel = document.createElement("label");
  let hueNameLabelText = document.createTextNode("Hue name: ");
  let hueNameInput = document.createElement("input");
  let hueSettingLabel = document.createElement("label");
  let hueSettingLabelText = document.createTextNode("Hue: ");
  let hueSettingInput = document.createElement("input");
  let hueSettingDelete = document.createElement("button");
  let hueSettingDeleteText = document.createTextNode("Delete");
  //create hueSetting contents

  hueSetting.id = "hueSetting" + fam;
  hueNameInput.id = "nameF" + fam;
  hueNameInput.className = "nameInput hueName";
  hueNameInput.addEventListener("change", updateSwatches);
  hueNameInput.addEventListener("click", hueNameInput.select);
  hueSettingInput.id = "fam" + fam;
  hueSetting.className = "hueSetting";
  hueSettingInput.type = "number";
  hueSettingInput.name = "hueStart";
  //hueSettingInput.value = "0";
  hueSettingInput.addEventListener("change", updateSwatches);
  hueSettingInput.addEventListener("click", hueSettingInput.select);
  hueSettingInput.min = "-360";
  hueSettingInput.max = "360";
  hueSettingDelete.addEventListener("click", delHueStep);
  //add attributes to contents

  document.getElementById("hueSettings").appendChild(hueSetting);
  hueSetting.appendChild(hueNameLabel);
  hueNameLabel.appendChild(hueNameLabelText);
  hueSetting.appendChild(hueNameInput);
  hueSetting.appendChild(hueSettingLabel);
  hueSettingLabel.appendChild(hueSettingLabelText);
  hueSetting.appendChild(hueSettingInput);
  hueSetting.appendChild(hueSettingDelete);
  hueSettingDelete.appendChild(hueSettingDeleteText);
  //put contents in DOM
}

function createEndHueSetting(fam) {
  let hueEndSetting = document.createElement("div");
  let hueEndSettingLabel = document.createElement("label");
  let hueEndSettingLabelText = document.createTextNode("End Hue: ");
  let hueEndSettingInput = document.createElement("input");
  //let hueEndSettingDelete = document.createElement("button");
  //let hueEndSettingDeleteText = document.createTextNode("Delete");
  let hueEndSettingFlip = document.createElement("button");
  let hueEndSettingFlipText = document.createTextNode("Flip");
  let hueEndSettingToggle = document.createElement("button");
  let hueEndSettingToggleText = document.createTextNode("Remove End Hue");
  //create hueEndSetting contents

  hueEndSetting.id = "hueEndSetting" + fam;
  hueEndSettingInput.id = "famEnd" + fam;
  hueEndSetting.className = "hueEndSetting";
  hueEndSettingInput.type = "number";
  hueEndSettingInput.name = "hueEnd";
  hueEndSettingInput.addEventListener("change", updateSwatches);
  hueEndSettingInput.addEventListener("click", hueEndSettingInput.select);
  hueEndSettingInput.min = "-360";
  hueEndSettingInput.max = "360";
  hueEndSettingFlip.id = "flip" + fam;
  hueEndSettingFlip.addEventListener("click", flipHues);
  hueEndSettingToggle.id = "hueEndEnable" + fam;
  hueEndSettingToggle.addEventListener("click", toggleHueEnd);
  //add attributes to contents

  document.getElementById("hueEndSettings").appendChild(hueEndSetting);
  hueEndSetting.appendChild(hueEndSettingLabel);
  hueEndSetting.appendChild(hueEndSettingInput);
  hueEndSetting.appendChild(hueEndSettingFlip);
  hueEndSettingLabel.appendChild(hueEndSettingLabelText);
  hueEndSettingFlip.appendChild(hueEndSettingFlipText);
  //hueEndSetting.appendChild(hueEndSettingDelete);
  //hueEndSettingDelete.appendChild(hueEndSettingDeleteText);
  hueEndSetting.appendChild(hueEndSettingToggle);
  hueEndSettingToggle.appendChild(hueEndSettingToggleText);
  //put contents in DOM
  //console.log(hueEndEnabled[fam], fam);

  if (hueEndEnabled[fam] == false) {
    hueEndSettingToggleText.nodeValue = "Add End Hue";
    hueEndSettingLabel.style.display = "none";
    hueEndSettingInput.style.display = "none";
    hueEndSettingFlip.style.display = "none";
    //console.log(hueEnds[fam], hueStarts[fam]);
    //if hue end is true, append elements to DOM, else don't
    //console.log(hueEndEnabled[fam]);
  }
}

function calcHue(fam, step) {
  let hueStartID = "fam" + fam; //get ids of hue inputs
  let hueEndID = "famEnd" + fam;
  let hueStartValue = document.getElementById(hueStartID).value; //get values of hue inputs
  //console.log(hueID, hueStartValue);
  let hueEndValue = document.getElementById(hueEndID).value;
  let hueDifference = hueStartValue - hueEndValue; 
  let result = hueStartValue - ((hueDifference/(contrastSteps-1))*step); //calculate actual hue of each swatch
  //console.log(result, hueStartValue, hueEndValue, hueDifference, contrastSteps, step);
  return result;
}

function calcHueFlipped(fam, step) {
  let hueStartID = "fam" + fam; //get ids of hue inputs
  let hueEndID = "famEnd" + fam;
  let hueStartValue = document.getElementById(hueStartID).value; //get values of hue inputs
  //console.log(hueID, hueStartValue);
  let hueEndValue = document.getElementById("famEnd" + fam).value;
  let hueDifference = hueStartValue - (parseInt(hueEndValue) + 360); 
  let result = hueStartValue - ((hueDifference/(contrastSteps-1))*step); //calculate actual hue of each swatch
  if (result >= 360) {
    result = result - 360;
  } else { 
    result = result;
  }
  //console.log(result, hueStartValue, hueEndValue, hueDifference, contrastSteps, step);
  return result;
} 

function flipHues(event) {
  let family = this.parentNode.id; //get id of parent
  let key = family.substring(13); //get only fam number from end of id
  //console.log(event, family, key);

  if (flips[key] == true) {
    flips[key] = false; 
  } else {
    flips[key] = true;
  } //update flips array with new value
  updateSwatches();
  console.log(flips);
}

function toggleHueEnd() {
  let family = this.parentNode.id; //get id of parent
  let key = family.substring(13); //get only fam number from end of id
  //console.log(event, family, key);

  if (hueEndEnabled[key] == true) {
    hueEndEnabled[key] = false; 
  } else {
    hueEndEnabled[key] = true;
  } //update flips array with new value

  let hueEndInput = "famEnd" + key;
  let hueStartInput = "fam" + key;
  document.getElementById(hueEndInput).value = document.getElementById(hueStartInput).value; //whenever hue end is toggled, reset it to equal the start hue
  updateHueSettings();
  updateSwatches();
}

function createSwatch(fam, step) {
  let hueValue;
  if (hueEndEnabled[fam] == true) {
    if (flips[fam] == true) {
      hueValue = calcHueFlipped(fam, step); //get hue from wraparound technique
    } else {
      hueValue = calcHue(fam, step); //get hue from normal technique
    }
  } else {
    let hueStartID = "fam" + fam; //get ids of hue inputs
    hueValue = document.getElementById(hueStartID).value; //use hue start value as only hue value
  }

  let contrastID = "step" + step; //get id of corresponding contrast input
  let contrastValue = document.getElementById(contrastID).value; //get value of contrast input
  let satValue = saturation;
  let color = getContrast(hueValue, satValue, contrastValue); //get color
  let actualContrast = Math.round(chroma.contrast(color, "white") * 100)/100; //get actual contrast of color
  let hex = chroma(color).hex();
  let hsl = chroma(color).css('hsl');
  //console.log(hueID, hueStartValue, contrastID, contrastValue, saturation100);

  let stepName = document.getElementById("nameS" + step).value;
  let famName = document.getElementById("nameF" + fam).value;

  let swatch = document.createElement("div");
  let swatchName = document.createElement("p");
  let swatchNameText = document.createTextNode(famName + stepName);
  let swatchContrast = document.createElement("p");
  let swatchContrastText = document.createTextNode("Contrast: " + actualContrast);
  let swatchHex = document.createElement("p");
  let swatchHexText = document.createTextNode(hex);
  let swatchHsl = document.createElement("p");
  let swatchHslText = document.createTextNode(hsl);
  let ack = document.createElement("div");
  let ackName = document.createElement("p");
  let ackNameText = document.createTextNode("Copied!");
  //create swatch contents

  swatch.id = "swatchF" + fam + "S" + step;
  swatch.className = "swatch";
  swatch.addEventListener("click", copyHsl);
  swatchName.className = "swatchText";
  swatch.style.backgroundColor = color;
  swatchContrast.className = "swatchText";
  swatchHex.id = "hexF" + fam + "S" + step;
  swatchHex.className = "swatchText swatchHex";
  swatchHsl.id = "hslF" + fam + "S" + step;
  swatchHsl.className = "swatchText swatchHsl";
  ack.className = "ack";
  if (actualContrast < 4.5) {
    swatch.style.color = "black";
    ack.style.backgroundColor = "black";
    ack.style.color = "white";
  } else { 
    swatch.style.color = "white";
    ack.style.backgroundColor = "white";
    ack.style.color = "black";
    }
  //add attributes to contents

  document.getElementById("grid").appendChild(swatch);
  swatch.appendChild(swatchName);
  swatchName.appendChild(swatchNameText);
  swatch.appendChild(swatchContrast);
  swatchContrast.appendChild(swatchContrastText);
  swatch.appendChild(swatchHex);
  swatchHex.appendChild(swatchHexText);
  swatch.appendChild(swatchHsl);
  swatchHsl.appendChild(swatchHslText);
  swatch.appendChild(ack);
  ack.appendChild(ackName);
  ackName.appendChild(ackNameText);
  //put contents in DOM
}
  
//////////////////////////////////////////////


function copyHex() {
  let swatch = this.id;
  let copyText = this.getElementsByClassName("swatchHex")[0].innerHTML;
  console.log(copyText);

   /* Copy the text inside the text field */
  navigator.clipboard.writeText(copyText);

  let ack = this.getElementsByClassName("ack")[0];
  ack.style.opacity = "80%"; //make Ack visible
  setTimeout(function(){ ack.style.opacity = "0%" }, 2000); //make Ack invisible again after delay
}

function copyHsl() {
  let swatch = this.id;
  let copyText = this.getElementsByClassName("swatchHsl")[0].innerHTML;
  console.log(copyText);

   /* Copy the text inside the text field */
  navigator.clipboard.writeText(copyText);

  let ack = this.getElementsByClassName("ack")[0];
  ack.style.opacity = "80%"; //make Ack visible
  setTimeout(function(){ ack.style.opacity = "0%" }, 2000); //make Ack invisible again after delay
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





