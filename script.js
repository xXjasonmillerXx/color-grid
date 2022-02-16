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

let textarea = document.getElementById("jsonTextarea");


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
  //console.log(jsonString);
  textarea.value = jsonString;
}

function jsonRead() {
  json = JSON.parse(textarea.value);
  contrastSteps = json.contrastSteps;
  contrasts = json.contrasts;
  //updateUI();
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





