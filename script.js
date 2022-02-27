//TODO
//saturation per hue family - lets you make grays
//saturation adjustment per swatch
//format json to conform to style dictionary spec, maybe with a setting
//black and white (maybe as one-off colors)?
//reorder steps/fams (maybe with arrows to swap neighbors)
//dark/neutral theme
//choose swatches to exclude from display or export
//if all swatches in a column are white or black, display one supertall swatch instead?

//more than one scale of steps?
//come up with better saturation solution. easing?
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

//let contrastSteps = 3;
//let gridCols = contrastSteps + 2;
//let hueFamilies = 3;

//let hue;
//let startHue = 200;
//let endHue = 210;
//let saturation100 = 100;
//let saturation = document.getElementById("saturation").value;
//let contrast;
//let lightness = 0;
//let color;

//let contrasts = [];
//let hueStarts = [];
let hueEnds = [];
let hueEndEnabled = [false, false, false];
let flips = [false, false, false];

let stepNames = [];
let hueNames = [];

let textarea = document.getElementById("jsonTextarea");
let exportTextarea = document.getElementById("exportTextarea");

let json = { 
  contrastSteps: 3,
  stepNames: [ '1', '2', '3' ],
  contrasts: [ '3', '4.5', '7' ],
  saturation: [ '100', '100', '80' ],
  hueFamilies: 3,
  hueNames: [ 'red', 'green', 'blue' ],
  hueStarts: [ '350', '160', '220' ],
  hueEnds: [ '350', '160', '220' ],
  hueEndEnabled: [ false, false, false ],
  flips: [ false, false, false ], 
  }

let hsls = [];
let hexes = [];

let exportColors = {}

function exportWrite() {
  exportColors = {};
  //console.log(json.hueStarts, "exportwrite");
  for(let h = 0; h < json.hueFamilies; h++) { //for each hue family
    let hueName = json.hueNames[h];
    //console.log(hueName, "huename");
    let step = {}
    for(let c = 0; c < json.contrastSteps; c++) { //for each contrast step in the family
      let stepName = json.stepNames[c];
      //console.log(stepName, "stepname");
      step[hueName + stepName] = hsls[(h*json.hueFamilies)+c];
      //console.log(step[hueName + stepName]);
    }
    exportColors[hueName] = step;
  }
  //console.log(exportColors);
  let exportString = JSON.stringify(exportColors, null, "\t");
  //console.log(exportString, "exportString");
  exportTextarea.value = exportString;
}

function jsonWrite() {
  //json = {
  //  "contrastSteps": contrastSteps,
  //  "stepNames": stepNames,
  //  "contrasts": contrasts,
  //  "saturation": saturation,
  //  "hueFamilies": hueFamilies,
  //  "hueNames": hueNames,
  //  "hueStarts": hueStarts,
  //  "hueEnds": hueEnds,
  //  "hueEndEnabled": hueEndEnabled,
  //  "flips": flips,
  //}
  let jsonString = JSON.stringify(json, null, "\t");
  //console.log(jsonString);
  textarea.value = jsonString;
}

function jsonRead() {
  json = {};
  json = JSON.parse(textarea.value);
  //contrastSteps = json.contrastSteps;
  //contrasts = json.contrasts;
  //saturation = json.saturation;
  //hueFamilies = json.hueFamilies;
  //hueNames = json.hueNames;
  //hueStarts = json.hueStarts;
  //hueEnds = json.hueEnds;
  //hueEndEnabled = json.hueEndEnabled;
  //flips = json.flips;
  //console.log(json);
  updateUI();
  console.log(json);
}

function jsonDownload() {
  //console.log(JSON.stringify(json));
  const a = document.createElement("a");
  const file = new Blob([JSON.stringify(json)], { type: "text/plain" });
  a.href = URL.createObjectURL(file);
  a.download = "colorgrid.json";
  a.click();
}

function initializeUI() {
  updateUI();
  //console.log(fam0.value, famEnd0.value);
  //updateUI();
  //updateSwatches();
}

function addContrastStep() {
  json.contrastSteps++;
  json.contrasts.push(2);
  json.stepNames.push("?");
  updateUI();
}

function delContrastStep(event) {
  if (json.contrastSteps > 1) {
    let contrastSetting = this.parentNode.id;
    let index = contrastSetting.substring(15);
    document.getElementById(contrastSetting).remove();
    json.contrastSteps--;
    json.stepNames.splice(index, 1);
    json.contrasts.splice(index, 1);
    updateUI();
  }
}

function addHueFamily() {
  json.hueFamilies++;
  json.hueStarts.push(0);
  json.hueEnds.push(0);
  json.hueNames.push("?");
  json.hueEndEnabled.push(false);
  json.flips.push(false);
  console.log(json.hueEndEnabled);
  updateUI();
}

function delHueStep(event) {
  if (json.hueFamilies > 1) {
    let hueSetting = this.parentNode.id;
    let index = hueSetting.substring(10);
    console.log(hueSetting, index);
    document.getElementById(hueSetting).remove();
    json.hueFamilies--;
    json.hueNames.splice(index, 1);
    json.hueStarts.splice(index, 1);
    json.hueEnds.splice(index, 1);
    json.hueEndEnabled.splice(index, 1);
    json.flips.splice(index, 1);
    updateUI();
  }
}

function calcHue(fam, step) {
  let hueStartID = "fam" + fam; //get ids of hue inputs
  let hueEndID = "famEnd" + fam;
  let hueStartValue = json.hueStarts[fam]; //get values of start hues
  //console.log(hueID, hueStartValue);
  let hueEndValue = json.hueEnds[fam];
  let hueDifference = hueStartValue - hueEndValue; 
  let result = hueStartValue - ((hueDifference/(json.contrastSteps-1))*step); //calculate actual hue of each swatch
  //console.log(result, hueStartValue, hueEndValue, hueDifference, contrastSteps, step);
  return result;
}

function calcHueFlipped(fam, step) {
  let hueStartID = "fam" + fam; //get ids of hue inputs
  let hueEndID = "famEnd" + fam;
  let hueStartValue = json.hueStarts[fam]; //get values of start hues
  //console.log(hueID, hueStartValue);
  let hueEndValue = json.hueEnds[fam];
  let hueDifference = hueStartValue - (parseInt(hueEndValue) + 360); 
  let result = hueStartValue - ((hueDifference/(json.contrastSteps-1))*step); //calculate actual hue of each swatch
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

  if (json.hueEndEnabled[key] == true) {
    json.hueEndEnabled[key] = false; 
  } else {
    json.hueEndEnabled[key] = true;
  } //update flips array with new value

  let hueEndInput = "famEnd" + key;
  let hueStartInput = "fam" + key;
  document.getElementById(hueEndInput).value = document.getElementById(hueStartInput).value; //whenever hue end is toggled, reset it to equal the start hue
  updateHueSettings();
  updateSwatches();
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





