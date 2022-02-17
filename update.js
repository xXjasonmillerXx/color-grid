function updateUI() {
  //jsonWrite();
  updateContrastSettings();
  updateHueSettings();
  updateSwatches();
  //jsonRead();
  //console.log(json);
}

function updateUIFromInputs() {
  //jsonWrite();
  updateContrastDataFromInputs();
  updateHueDataFromInputs();
  json.saturation = document.getElementById("saturation").value;
  console.log(json.saturation);
  jsonWrite();
  console.log(json);
  updateContrastSettings();
  updateHueSettings();
  updateSwatches();
  jsonWrite();
  console.log(json);
}

function updateContrastDataFromInputs() {
  let contrastValues = document.getElementsByName("contrast");
  for (let i = 0; i < contrastValues.length; i++) {
    json.contrasts[i] = contrastValues[i].value;
  } //update contrasts array with current contrast values
  //console.log(contrasts);

  let stepNameValues = document.getElementsByClassName("stepName");
  for (let i = 0; i < stepNameValues.length; i++) {
    json.stepNames[i] = stepNameValues[i].value;
  } //update stepnames array with current stepname values
}


function updateHueDataFromInputs() {
  let hueStartValues = document.getElementsByName("hueStart");
  let hueEndValues = document.getElementsByName("hueEnd");
  for (let i = 0; i < hueStartValues.length; i++) {
    hueStarts[i] = hueStartValues[i].value;
  } //update start hues array with current hue values

  for (let i = 0; i < hueEndValues.length; i++) {
    hueEnds[i] = hueEndValues[i].value;
  } //update end hues array with current hue values

  let hueNameValues = document.getElementsByClassName("hueName");
  for (let i = 0; i < hueNameValues.length; i++) {
    hueNames[i] = hueNameValues[i].value;
  } //update huenames array with current huename values
}

function updateContrastSettings() {

  let contrastSettings = document.getElementById("contrastSettings");
  while (contrastSettings.firstChild) {
    contrastSettings.removeChild(contrastSettings.lastChild);
  } //remove all existing contents of grid so we can start fresh

  contrastSettings.style.gridTemplateColumns = "repeat(" + json.contrastSteps + ", 1fr)";
  grid.style.gridTemplateColumns = "repeat(" + json.contrastSteps + ", 1fr)";
  for (let step = 0; step < json.contrastSteps; step++) {
    createContrastSetting(step); //create setting UI for each step

    let id = "step" + step;
    document.getElementById(id).value = json.contrasts[step];
    //console.log(id, contrastValues[step].value);
    //add back previous contrast values

    let nameID = "nameS" + step;
    document.getElementById(nameID).value = json.stepNames[step];
  }
  jsonWrite();
}

function updateHueSettings() {

  let hueSettings = document.getElementById("hueSettings");
  while (hueSettings.firstChild) {
    hueSettings.removeChild(hueSettings.lastChild);
    hueEndSettings.removeChild(hueEndSettings.lastChild);
  } //remove all existing contents of grid so we can start fresh

  hueSettings.style.gridTemplateRows = "repeat(" + json.hueFamilies + ", 1fr)";
  hueEndSettings.style.gridTemplateRows = "repeat(" + json.hueFamilies + ", 1fr)";
  //grid.style.gridTemplateRows = "repeat(" + hueFamilies + ", 1fr)";
  for (let fam = 0; fam < json.hueFamilies; fam++) {
    createHueSetting(fam); //create setting UI for each step
    createEndHueSetting(fam); //create end hue setting for each

    let idStart = "fam" + fam;
    document.getElementById(idStart).value = json.hueStarts[fam];

    let idEnd = "famEnd" + fam;
    document.getElementById(idEnd).value = json.hueEnds[fam];
    //console.log(id, hueStartValues[fam].value);
    //add back previous contrast values

    let nameID = "nameF" + fam;
    document.getElementById(nameID).value = json.hueNames[fam];
  }
  jsonWrite();
}


function updateSwatches() {
  let grid = document.getElementById("grid");
  while (grid.firstChild) {
    grid.removeChild(grid.lastChild);
  } //remove all existing contents of grid so we can start fresh
  
  for (let fam = 0; fam < json.hueFamilies; fam++) {
    for (let step = 0; step < json.contrastSteps; step++) {
      createSwatch(fam, step);
    }
  }
  //jsonWrite();
}